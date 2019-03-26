import * as QueryClass from './query';
import { QueryTermType } from './query-term-type.enum';
import { QueryOperator } from './query-operator.enum';
import { QueryConjuctionOperator } from './query-conjunction-operator.enum';
import { QueryTerm } from './query-term';

export class Query {
  static parse(input: string): QueryClass.Query {
    const query = new QueryClass.Query();
    let term = '';
    let isPhrase = false;
    let isGroup = false;
    let isEscaped = false;
    let isProhibited = false;
    let isRequired = false;
    let hasSyntaxError = false;
    let modifierValue = '';
    let isFuzzyOrProximityValue = false;
    let isBoostValue = false;
    let isOr = false;
    let isAnd = false;
    let isNot = false;
    let field: string;
    let hasWildcard = false;
    let isRange = false;
    let range = [];

    for (let char of input) {
      if (!isPhrase && char === ' ' && term !== '') { // term boundary
        if (term === 'OR' || term === '||') {
          isOr = true;
        } else if (term === 'AND' || term === '&&') {
          isAnd = true;
        } else if (term === 'NOT' || term === '!') {
          isNot = true;
        } else if (isRange) {
          if (range.length === 0) {
            range.push(term);
          } else if (term !== 'TO') {
            isRange = false;
          }
        } else {
          const queryConjuctionOperator = isOr ? QueryConjuctionOperator.OR : isAnd ? QueryConjuctionOperator.AND : isNot ? QueryConjuctionOperator.NOT : undefined;
          query.addTerm(Query.createQueryTerm(term, isRequired, isProhibited, isFuzzyOrProximityValue, isBoostValue, hasWildcard, modifierValue, field, range), queryConjuctionOperator);
          isOr = false;
          isAnd = false;
          isNot = false;
          range = [];
        }

        char = '';
        field = undefined;
        term = '';
        modifierValue = '';
        hasWildcard = false;
        isFuzzyOrProximityValue = false;
        isBoostValue = false;
        isRequired = false;
        isProhibited = false;
      }

      if (!isEscaped) {
        switch (char) {
          case '\\':
            isEscaped = true;
            char = '';
            break;
          case '(':
            // group start
            // RECURSE HERE?
            if (term === '') {
              isGroup = true;
              char = '';
            } else {
              hasSyntaxError = true;
            }
            break;
          case ')':
            // group end
            // END RECURSE HERE?
            if (term === '') {
              hasSyntaxError = true;
            } else {
              isGroup = false;
              char = '';
            }
            break;
          case '"':
            if (term === '') {
              isPhrase = true;
              char = '';
            } else if (term !== '' && !isPhrase) {
              hasSyntaxError = true;
            } else {
              isPhrase = false;
              char = '';
            }
            break;
          case '-':
            if (term === '') {
              isProhibited = true;
              char = '';
            } else {
              hasSyntaxError = true;
            }
            break;
          case '+':
            if (term === '') {
              isRequired = true;
              char = '';
            } else {
              hasSyntaxError = true;
            }
            break;
          case '~':
            isFuzzyOrProximityValue = true;
            char = '';
            break;
          case '^':
            isBoostValue = true;
            char = '';
            break;
          case ':':
            if (term === '') {
              hasSyntaxError = true;
            } else {
              field = term;
              term = '';
              char = '';
            }
            break;
          case '?':
          case '*':
            if (term === '') {
              hasSyntaxError = true;
            } else {
              hasWildcard = true;
            }
            break;
          case '{':
          case '[':
            if (field === '') {
              hasSyntaxError = true;
            } else {
              isRange = true;
              char = '';
            }
            break;
          case '}':
          case ']':
            if (!isRange) {
              hasSyntaxError = true;
            } else {
              char = '';
              range.push(term);
              isRange = false;
              term = '';
            }
            break;
        }

        if (isFuzzyOrProximityValue || isBoostValue) {
          modifierValue += char;
        } else {
          term += char;
        }
      } else {
        const allowedEscapedCharacters = [ '+', '-', '&&', '||', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\' ];
        if (allowedEscapedCharacters.find(allowedEscapedCharacter => allowedEscapedCharacter === char)) {
          term += char;
        } else {
          hasSyntaxError = true;
        }
        isEscaped = false;
      }
    }

    if (term || range.length === 2) {
      const queryConjuctionOperator = isOr ? QueryConjuctionOperator.OR : isAnd ? QueryConjuctionOperator.AND : isNot ? QueryConjuctionOperator.NOT : undefined;
      query.addTerm(Query.createQueryTerm(term, isRequired, isProhibited, isFuzzyOrProximityValue, isBoostValue, hasWildcard, modifierValue, field, range), queryConjuctionOperator);
    }

    return query;
  }

  private static createQueryTerm(term: string, isRequired = false, isProhibited = false, isFuzzyOrProximityValue = false, isBoostValue = false, hasWildcard = false, modifierValue: string, field: string, range: string[]): QueryTerm {
    const queryTerm = new QueryTerm(term);
    const isPhrase = term.indexOf(' ') !== -1;
    queryTerm.type = isPhrase ? QueryTermType.Phrase : QueryTermType.SingleTerm;
    queryTerm.field = field;
    queryTerm.hasWildcard = hasWildcard;

    if (range.length) {
      queryTerm.range = range;
    }

    if (isRequired) {
      queryTerm.operator = QueryOperator.Required;
    }

    if (isProhibited) {
      queryTerm.operator = QueryOperator.Prohibited;
    }

    if (!isPhrase && isFuzzyOrProximityValue) {
      queryTerm.includeFuzzyMatches = true;
      queryTerm.fuzzySimilarity = +modifierValue;
    }

    if (isPhrase && isFuzzyOrProximityValue) {
      queryTerm.onlyIncludeProximityMatches = true;
      queryTerm.proximityDistance = +modifierValue;
    }

    if (isBoostValue) {
      queryTerm.boostTerm = true;
      queryTerm.boostFactor = +modifierValue;
    }

    return queryTerm;
  }
}