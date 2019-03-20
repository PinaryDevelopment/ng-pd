import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Query, QueryTerm } from '../models';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: [
    '../lucene-query-builder.scss',
    './query.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryComponent {
  Query = Query;

  @Input() query: Query;
  @Output() change = new EventEmitter<Query>();

  isQuery(queryTerm: QueryTerm | Query) {
    return queryTerm instanceof Query;
  }

  onDrop($event: CdkDragDrop<QueryTerm>) {
    const itemIndex = this.query.terms.findIndex(term => term === $event.item.data);
    const containerItemIndex = this.query.terms.findIndex(term => term === $event.container.data);
    const item = this.query.terms[itemIndex];
    const containerItem = this.query.terms[containerItemIndex];

    if (item !== containerItem) {
      const termMovingLeft = itemIndex > containerItemIndex;
      const operatorIndex = itemIndex === 0 ? 0                                       // term being moved is first, take first operator
        : itemIndex === this.query.terms.length - 1 ? this.query.operators.length - 1 // term being moved is last, take last operator
        : termMovingLeft ? itemIndex - 1                                              // term is moving left, take operator before it
        : itemIndex;                                                                  // term is moving right, take operator after it

      const operator = this.query.operators.splice(operatorIndex, 1)[0];

      if ($event.item.data instanceof Query && $event.container.data instanceof Query) {
        $event.container.data.operators.push(operator);
        $event.container.data.join($event.item.data);
      } else if ($event.item.data instanceof Query) {
        $event.item.data.addTerm($event.container.data, operator);
      } else if ($event.container.data instanceof Query) {
        $event.container.data.addTerm($event.item.data, operator);
      } else {
        // replace the term dragged onto with new 'query' containing both terms and the chose operator
        this.query.terms.splice(containerItemIndex, 1, new Query([item, containerItem], [operator]));
      }

      // remove dragged term from the original terms array
      this.query.terms.splice(itemIndex, 1);

      this.change.emit(this.query);
    }
  }
}
