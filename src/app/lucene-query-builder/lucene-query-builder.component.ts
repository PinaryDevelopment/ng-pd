/*
 * REFERENCE DOCS
 * - https://lucene.apache.org/core/2_9_4/queryparsersyntax.html
 * - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */

import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';

import { Query, QueryTerm } from './models';
import { isNullOrWhiteSpace } from '../shared/string';

@Component({
  selector: 'app-lucene-query-builder',
  templateUrl: './lucene-query-builder.component.html',
  styleUrls: ['./lucene-query-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LuceneQueryBuilderComponent implements OnInit, OnDestroy {
  query = new Query();
  userInputInFocus = false;

  @ViewChild('userInput') userInputElement: ElementRef;
  private input: Observable<KeyboardEvent>;
  private inputSubject = new Subject<KeyboardEvent>();
  private subscriptions: Subscription[] = [];

  constructor() {
    this.input = this.inputSubject.asObservable();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.on({ listenTo: ['Tab'] })
          .subscribe((event) => this.onTab(event)),
      this.on({ listenTo: ['Enter'] })
          .subscribe((event) => this.onEnter(event)),
      this.on({ ignore: ['Tab', 'Enter'] })
          .pipe(debounceTime(150))
          .pipe(map(event => (event.target as HTMLInputElement).value))
          .pipe(distinctUntilChanged())
          .subscribe(this.noop2)
    );
  }

  onKeydown(event: KeyboardEvent) {
    this.inputSubject.next(event);
  }

  emitQuery() {
    console.log(this.query);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  giveUserInputFocus() {
    (this.userInputElement.nativeElement as HTMLInputElement).focus();
  }

  private noop2(e: any) { console.log('noop2', e); }

  private onTab(event: KeyboardEvent) {
    this.addTerm((event.target as HTMLInputElement).value);
    event.preventDefault();
    event.stopPropagation();
  }

  private onEnter(event: KeyboardEvent) {
    this.addTerm((event.target as HTMLInputElement).value);
  }

  private addTerm(term: string) {
    if (isNullOrWhiteSpace(term)) { return; }

    this.query.addTerm(new QueryTerm(term));
    this.query = this.query.clone();
    (this.userInputElement.nativeElement as HTMLInputElement).value = '';
  }

  /*
   * Modified 'Event Bus' pattern from:
   * https://www.pluralsight.com/courses/angular-architecture-best-practices
   * https://github.com/DanWahlin/angular-architecture/blob/master/demos/src/app/core/services/event-bus.service.ts
   */
  private on(filters: { listenTo?: string[], ignore?: string[] }): Observable<KeyboardEvent> {
    return this.input
               .pipe(
                 filter((e: KeyboardEvent) => !filters.listenTo || !!filters.listenTo.find(key => e.key === key)),
                 filter((e: KeyboardEvent) => !filters.ignore || !filters.ignore.find(key => e.key === key))
               );
  }
}
