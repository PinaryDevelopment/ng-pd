import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { QueryConjuctionOperator } from '../models';

@Component({
  selector: 'app-query-conjunction-operator',
  templateUrl: './query-conjunction-operator.component.html',
  styleUrls: ['./query-conjunction-operator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryConjuctionOperatorComponent {
  @Input() operator: QueryConjuctionOperator;
  @Output() change = new EventEmitter<QueryConjuctionOperator>();

  QueryConjuctionOperator = QueryConjuctionOperator;

  toggleOperator($event: UIEvent) {
    switch (this.operator) {
      case QueryConjuctionOperator.OR:
        this.operator = QueryConjuctionOperator.AND;
        break;
      case QueryConjuctionOperator.AND:
        this.operator = QueryConjuctionOperator.NOT;
        break;
      case QueryConjuctionOperator.NOT:
        this.operator = QueryConjuctionOperator.OR;
        break;
    }

    this.change.emit(this.operator);
    $event.preventDefault();
    $event.stopPropagation();
  }
}
