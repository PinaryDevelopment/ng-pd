import { QueryConjuctionOperator } from './query-conjunction-operator.enum';
import { QueryTerm } from './query-term';

export class Query {
  constructor(public terms: (QueryTerm | Query)[] = [], public operators: QueryConjuctionOperator[] = []) {}

  addTerm(term: QueryTerm | Query): void {
    this.terms.push(term);
    if (this.terms.length > 1) {
      this.operators.push(QueryConjuctionOperator.OR);
    }
  }

  clone(): Query {
    const queryString = JSON.stringify(this);
    const tmpQuery = JSON.parse(queryString);
    return new Query(tmpQuery.terms, tmpQuery.operators);
  }
}
