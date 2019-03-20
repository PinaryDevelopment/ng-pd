import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostBinding, HostListener } from '@angular/core';

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

  @HostBinding('class') classes = 'chip clickable syntax';

  QueryConjuctionOperator = QueryConjuctionOperator;

  @HostListener('click') onClick() {
    this.toggleOperator();
  }

  @HostListener('keyup.enter') onEnter() {
    this.toggleOperator();
  }

  toggleOperator() {
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
  }
}
