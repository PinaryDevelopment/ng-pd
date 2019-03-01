import { QueryTermType } from './query-term-type.enum';
import { QueryOperator } from './query-operator.enum';

export class QueryTerm {
  public type: QueryTermType;
  // public title: string; // TODO
  public operator: QueryOperator;

  constructor(public term: string) {
    this.type = term.indexOf(' ') === -1 ? QueryTermType.SingleTerm : QueryTermType.Phrase;
  }
}
