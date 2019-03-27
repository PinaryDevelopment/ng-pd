import { Query } from './query';
import { QueryParser } from './query-parser';
import { QueryTerm } from './query-term';
import { QueryTermType } from './query-term-type.enum';
import { QueryConjuctionOperator } from './query-conjunction-operator.enum';
import { QueryOperator } from './query-operator.enum';

describe('Query.extensions', () => {
  // Terms: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Terms
  it('should create query term', () => {
    const query = QueryParser.parse('hello');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('hello');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
  });

  it('should create query term phrase', () => {
    const query = QueryParser.parse('"hello dolly"');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('hello dolly');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
  });

  // Fields: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Fields
  it('should create query terms scoped to fields', () => {
    const query = QueryParser.parse('title:"The Right Way" AND text:go');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('The Right Way');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.field).toBe('title');

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('go');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.field).toBe('text');
  });

  it('should create query terms scoped to default field', () => {
    const query = QueryParser.parse('title:"Do it right" AND right');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('Do it right');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.field).toBe('title');

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('right');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.field).toBeUndefined();
  });

  it('should create proper query term with scope', () => {
    const query = QueryParser.parse('title:Do it right');

    expect(query.terms.length).toBe(3);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('Do');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.field).toBe('title');

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('it');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.field).toBeUndefined();

    queryTerm = query.terms[2] as QueryTerm;
    expect(queryTerm.term).toBe('right');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.field).toBeUndefined();
  });

  // Wildcard Searches: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Wildcard%20Searches
  it('should create query term with single character wildcard', () => {
    const query = QueryParser.parse('te?t');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('te?t');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.hasWildcard).toBe(true);
  });

  it('should create query term with multiple character wildcard at end', () => {
    const query = QueryParser.parse('test*');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('test*');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.hasWildcard).toBe(true);
  });

  it('should create query term with multiple character wildcard in middle', () => {
    const query = QueryParser.parse('te*t');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('te*t');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.hasWildcard).toBe(true);
  });

  // Fuzzy Searches: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Fuzzy%20Searches
  it('should create fuzzy search', () => {
    const query = QueryParser.parse('roam~');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('roam');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.includeFuzzyMatches).toBe(true);
    expect(queryTerm.fuzzySimilarity).toBe(0.5);
  });

  it('should create fuzzy search with similarity value', () => {
    const query = QueryParser.parse('roam~0.8');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('roam');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.includeFuzzyMatches).toBe(true);
    expect(queryTerm.fuzzySimilarity).toBe(0.8);
  });

  // Proximity Searches: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Proximity%20Searches
  it('should create proximity search', () => {
    const query = QueryParser.parse('"jakarta apache"~10');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.onlyIncludeProximityMatches).toBe(true);
    expect(queryTerm.proximityDistance).toBe(10);
  });

  // Range Searches: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Range%20Searches
  it('should create exclusive range search', () => {
    const query = QueryParser.parse('mod_date:[20020101 TO 20030101]');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('');
    expect(queryTerm.type).toBe(QueryTermType.Range);
    expect(queryTerm.field).toBe('mod_date');
    expect(queryTerm.range.length).toBe(2);
    expect(queryTerm.range[0]).toBe('20020101');
    expect(queryTerm.range[1]).toBe('20030101');
  });

  it('should create inclusive range search', () => {
    const query = QueryParser.parse('title:{Aida TO Carmen}');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('');
    expect(queryTerm.type).toBe(QueryTermType.Range);
    expect(queryTerm.field).toBe('title');
    expect(queryTerm.range.length).toBe(2);
    expect(queryTerm.range[0]).toBe('Aida');
    expect(queryTerm.range[1]).toBe('Carmen');
  });

  // Boosting a Term: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Boosting%20a%20Term
  it('should create boosted search', () => {
    const query = QueryParser.parse('jakarta^4 apache');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.boostTerm).toBe(true);
    expect(queryTerm.boostFactor).toBe(4);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('apache');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.boostTerm).toBe(false);
  });

  it('should create boosted phrase search', () => {
    const query = QueryParser.parse('"jakarta apache"^4 "Apache Lucene"');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.boostTerm).toBe(true);
    expect(queryTerm.boostFactor).toBe(4);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('Apache Lucene');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.boostTerm).toBe(false);
  });

  // Boolean Operators: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Boolean%20operators
  it('should create default OR query', () => {
    const query = QueryParser.parse('"jakarta apache" jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.OR);
  });

  it('should create OR query', () => {
    const query = QueryParser.parse('"jakarta apache" OR jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.OR);
  });

  it('should create OR query from || symbol', () => {
    const query = QueryParser.parse('"jakarta apache" || jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.OR);
  });

  // AND: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#AND
  it('should create AND query', () => {
    const query = QueryParser.parse('"jakarta apache" AND jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.AND);
  });

  it('should create AND query from && symbol', () => {
    const query = QueryParser.parse('"jakarta apache" && jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.AND);
  });

  // +: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#+
  it('should create required query term', () => {
    const query = QueryParser.parse('+jakarta lucene');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.operator).toBe(QueryOperator.Required);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('lucene');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.operator).toBeUndefined();
  });

  // NOT: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#NOT
  it('should create NOT query', () => {
    const query = QueryParser.parse('"jakarta apache" NOT jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.NOT);
  });

  it('should create NOT query from ! symbol', () => {
    const query = QueryParser.parse('"jakarta apache" ! jakarta');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.NOT);
  });

  // -: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#-
  it('should create prohibited query term', () => {
    const query = QueryParser.parse('"jakarta apache" -"Apache Lucene"');

    expect(query.terms.length).toBe(2);

    let queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta apache');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.operator).toBeUndefined();

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('Apache Lucene');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.operator).toBe(QueryOperator.Prohibited);
  });

  // Grouping: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Grouping
  it('should create a grouped query', () => {
    const query = QueryParser.parse('(jakarta OR apache) AND website');

    expect(query.terms.length).toBe(2);
    expect(query.operators.length).toBe(1);
    expect(query.operators[0]).toBe(QueryConjuctionOperator.AND);

    const groupedQuery = query.terms[0] as Query;
    expect(groupedQuery.terms.length).toBe(2);
    expect(groupedQuery.operators.length).toBe(1);
    expect(groupedQuery.operators[0]).toBe(QueryConjuctionOperator.OR);

    let queryTerm = groupedQuery.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('jakarta');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    queryTerm = groupedQuery.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('apache');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);

    queryTerm = query.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('website');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
  });

  // Field Grouping: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Field Grouping
  it('should create a grouped query', () => {
    const query = QueryParser.parse('title:(+return +"pink panther")');
    expect(query.field).toBe('title');

    expect(query.terms.length).toBe(1);

    const groupedQuery = query.terms[0] as Query;
    expect(groupedQuery.terms.length).toBe(2);
    expect(groupedQuery.operators.length).toBe(1);
    expect(groupedQuery.operators[0]).toBe(QueryConjuctionOperator.OR);

    let queryTerm = groupedQuery.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('return');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
    expect(queryTerm.operator).toBe(QueryOperator.Required);

    queryTerm = groupedQuery.terms[1] as QueryTerm;
    expect(queryTerm.term).toBe('pink panther');
    expect(queryTerm.type).toBe(QueryTermType.Phrase);
    expect(queryTerm.operator).toBe(QueryOperator.Required);
  });

  // Escaping Special Characters: https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Escaping Special Characters
  it('should create query term with escaped characters', () => {
    const query = QueryParser.parse('\\(1\\+1\\)\\:2');

    expect(query.terms.length).toBe(1);

    const queryTerm = query.terms[0] as QueryTerm;
    expect(queryTerm.term).toBe('(1+1):2');
    expect(queryTerm.type).toBe(QueryTermType.SingleTerm);
  });
});
