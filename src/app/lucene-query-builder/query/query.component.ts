import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Query, QueryTerm } from '../models';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
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

    /*
      TODO
      update logic for following two if statements
    */
    if ($event.item.data instanceof Query) {}
    if ($event.container.data instanceof Query) {}

    const itemIndex = this.query.terms.findIndex(term => term === $event.item.data);
    const containerItemIndex = this.query.terms.findIndex(term => term === $event.container.data);
    const item = this.query.terms[itemIndex];
    const containerItem = this.query.terms[containerItemIndex];

    /*
     * terms[0] operators[0] terms[1] operators[1] terms[2]   operators[2] terms[3]
     * csharp   OR           html     AND          javascript OR           typescript
    */

    /*
      TODO
      update below to following logic
        if dragged term is moving left, take operator to left, unless first term then take operator after
        if dragged term is moving right, take operator to right, unless last term then take operator before
    */

    // always take the operator after the term being dragged, unless it is the last term and then take the operator before it
    const operatorIndex = itemIndex === this.query.terms.length - 1 ? this.query.operators.length - 1 : itemIndex;
    const operator = this.query.operators.splice(operatorIndex, 1);
    // replace the term dragged onto with new 'query' containing both terms and the chose operator
    this.query.terms.splice(containerItemIndex, 1, new Query([item, containerItem], operator));
    // remove dragged term from the original terms array
    this.query.terms.splice(itemIndex, 1);
  }
}
