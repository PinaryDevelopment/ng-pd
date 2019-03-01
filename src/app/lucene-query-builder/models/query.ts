import { QueryConjuctionOperator } from './query-conjunction-operator.enum';
import { QueryTerm } from './query-term';

export class Query {
  constructor(public terms: QueryTerm[] = [], public operators: QueryConjuctionOperator[] = []) {}

  addTerm(term: QueryTerm) {
    this.terms.push(term);
    if (this.terms.length > 1) {
      this.operators.push(QueryConjuctionOperator.OR);
    }
  }
}
