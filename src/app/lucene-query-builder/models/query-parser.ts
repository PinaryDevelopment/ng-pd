import { Query } from './query';
import { QueryTermType } from './query-term-type.enum';
import { QueryOperator } from './query-operator.enum';
import { QueryConjuctionOperator } from './query-conjunction-operator.enum';
import { QueryTerm } from './query-term';

export class QueryParser {
  static parse(input: string): Query {
    return QueryParser._parse(input).query;
  }

  private static _parse(input: string): { query: Query, charsParsed: number } {
    const query = new Query();
    let term = '';
    let isPhrase = false;
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
    let isExclusiveRange = false;
    let isInclusiveRange = false;
    let range = [];


    for (let i = 0, l = input.length, char = input[0]; i < l; i++, char = input[i]) {
      if (!isPhrase && char === ' ' && term !== '') { // term boundary
        if (term === 'OR' || term === '||') {
          isOr = true;
        } else if (term === 'AND' || term === '&&') {
          isAnd = true;
        } else if (term === 'NOT' || term === '!') {
          isNot = true;
        } else if (isExclusiveRange || isInclusiveRange) {
          if (range.length === 0) {
            range.push(term);
          } else if (term !== 'TO') {
          }
        } else {
          const queryConjuctionOperator = isOr ? QueryConjuctionOperator.OR : isAnd ? QueryConjuctionOperator.AND : isNot ? QueryConjuctionOperator.NOT : undefined;
          query.addTerm(QueryParser.createQueryTerm(term, isRequired, isProhibited, isFuzzyOrProximityValue, isBoostValue, hasWildcard, isInclusiveRange, isExclusiveRange, modifierValue, field, range), queryConjuctionOperator);
          isOr = false;
          isAnd = false;
          isNot = false;
          range = [];
          field = undefined;
          isExclusiveRange = false;
          isInclusiveRange = false;
        }

        char = '';
        term = '';
        modifierValue = '';
        hasWildcard = false;
        isFuzzyOrProximityValue = false;
        isBoostValue = false;
        isRequired = false;
        isProhibited = false;
      } else if (char === ' ' && term === '') {
        char = '';
      }

      if (!isEscaped) {
        switch (char) {
          case '\\':
            isEscaped = true;
            char = '';
            break;
          case '(':
            if (term === '') {
              const queryGroup = QueryParser._parse(input.substring(i + 1));
              i += queryGroup.charsParsed + 1;
              query.addTerm(queryGroup.query);
              if (field) {
                query.field = field;
                field = '';
              }
              char = '';
            } else {
              hasSyntaxError = true;
            }
            break;
          case ')':
            if (term === '') {
              hasSyntaxError = true;
            } else {
              const queryConjuctionOperator = isOr ? QueryConjuctionOperator.OR : isAnd ? QueryConjuctionOperator.AND : isNot ? QueryConjuctionOperator.NOT : undefined;
              query.addTerm(QueryParser.createQueryTerm(term, isRequired, isProhibited, isFuzzyOrProximityValue, isBoostValue, hasWildcard, isInclusiveRange, isExclusiveRange, modifierValue, field, range), queryConjuctionOperator);
              return { query, charsParsed: i };
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
            if (field === '') {
              hasSyntaxError = true;
            } else {
              isExclusiveRange = true;
              char = '';
            }
            break;
          case '[':
            if (field === '') {
              hasSyntaxError = true;
            } else {
              isInclusiveRange = true;
              char = '';
            }
            break;
          case '}':
            if (!isExclusiveRange) {
              hasSyntaxError = true;
            } else {
              char = '';
              range.push(term);
              term = '';
            }
            break;
          case ']':
            if (!isInclusiveRange) {
              hasSyntaxError = true;
            } else {
              char = '';
              range.push(term);
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
      query.addTerm(QueryParser.createQueryTerm(term, isRequired, isProhibited, isFuzzyOrProximityValue, isBoostValue, hasWildcard, isInclusiveRange, isExclusiveRange, modifierValue, field, range), queryConjuctionOperator);
    }

    return { query, charsParsed: input.length };
  }

  private static createQueryTerm(term: string, isRequired = false, isProhibited = false, isFuzzyOrProximityValue = false, isBoostValue = false, hasWildcard = false, isInclusiveRange = false, isExclusiveRange = false, modifierValue: string, field: string, range: string[]): QueryTerm {
    const queryTerm = new QueryTerm(term);
    const isPhrase = term.indexOf(' ') !== -1;
    queryTerm.type = isPhrase ? QueryTermType.Phrase : QueryTermType.SingleTerm;
    queryTerm.field = field;
    queryTerm.hasWildcard = hasWildcard;

    if (range.length) {
      queryTerm.range = range;
      queryTerm.isExclusiveRange = isExclusiveRange;
      queryTerm.isInclusiveRange = isInclusiveRange;
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
