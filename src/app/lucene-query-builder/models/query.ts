import { QueryConjuctionOperator } from './query-conjunction-operator.enum';
import { QueryTerm } from './query-term';


export class Query {
  public field: string;

  constructor(public terms: (QueryTerm | Query)[] = [], public operators: QueryConjuctionOperator[] = []) {
    this.terms = terms.map(term => {
      if ((term as Query).terms) {
        const query = term as Query;
        return new Query(query.terms, query.operators);
      }

      return new QueryTerm((term as QueryTerm).term);
    });
  }

  addTerm(term: QueryTerm | Query, operator: QueryConjuctionOperator = QueryConjuctionOperator.OR): void {
    this.terms.push(term);
    if (this.terms.length > 1) {
      this.operators.push(operator);
    }
  }

  clone(): Query {
    const queryString = JSON.stringify(this);
    const tmpQuery = JSON.parse(queryString);
    return new Query(tmpQuery.terms, tmpQuery.operators);
  }

  join(query: Query): Query {
    this.terms = this.terms.concat(query.terms);
    this.operators = this.operators.concat(query.operators);
    return this;
  }
}
