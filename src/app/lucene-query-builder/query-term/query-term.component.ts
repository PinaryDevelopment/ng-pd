import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { QueryTerm, QueryTermType, QueryOperator } from '../models';

@Component({
  selector: 'app-query-term',
  templateUrl: './query-term.component.html',
  styleUrls: [
    '../lucene-query-builder.scss',
    './query-term.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryTermComponent {
  @Input() queryTerm: QueryTerm;
  @Output() change = new EventEmitter<QueryTerm>();

  QueryOperator = QueryOperator;
  QueryTermType = QueryTermType;
  hoveringOverTerm = false;

  @HostListener('mouseover') onMouseover() {
    this.hoveringOverTerm = true;
  }

  @HostListener('mouseout') onMouseout() {
    this.hoveringOverTerm = false;
  }

  setOperator(operator: QueryOperator) {
    this.queryTerm.operator = this.queryTerm.operator === operator ? undefined : operator;
    this.change.emit(this.queryTerm);
  }
}
