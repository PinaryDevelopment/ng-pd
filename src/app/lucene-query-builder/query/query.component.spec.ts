import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/internal/operators/take';
import { AppModule } from '../../app.module';
import { QueryComponent } from './query.component';
import { Query, QueryTerm, QueryConjuctionOperator } from '../models';

describe('QueryComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: []
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should show nothing', () => {
    const fixture = TestBed.createComponent(QueryComponent);

    expect(fixture.debugElement.nativeElement.innerText).toEqual('');
  });

  it(`should have query term element`, () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new QueryTerm('query')]);
    fixture.detectChanges();
    const queryTermDebugElement = fixture.debugElement.query(By.css('app-query-term'));
    expect(queryTermDebugElement).not.toBeNull();
  });

  it(`should have no query conjunction operator element`, () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new QueryTerm('query')]);
    fixture.detectChanges();
    const queryTermDebugElement = fixture.debugElement.query(By.css('app-query-conjunction-operator'));
    expect(queryTermDebugElement).toBeNull();
  });

  it(`should have query element`, () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new Query([new QueryTerm('query')])]);
    fixture.detectChanges();
    const queryDebugElement = fixture.debugElement.query(By.css('app-query'));
    expect(queryDebugElement).not.toBeNull();
  });

  it(`should have parentheses around term`, () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new Query([new QueryTerm('query')])]);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('(query)');
  });

  it('query term element #cdkDropListDropped should call #onDrop', () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new QueryTerm('query'), new QueryTerm('term')], [QueryConjuctionOperator.OR]);
    fixture.detectChanges();

    const mockEvent = new Event('');
    const onDropSpy = spyOn(fixture.componentInstance, 'onDrop');

    const queryTermDebugElement = fixture.debugElement.query(By.css('app-query-term'));
    queryTermDebugElement.triggerEventHandler('cdkDropListDropped', mockEvent);

    expect(onDropSpy).toHaveBeenCalled();
  });

  it('query term element #cdkDropListDropped should call #onDrop', () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new Query([new QueryTerm('query'), new QueryTerm('term')], [QueryConjuctionOperator.OR])]);
    fixture.detectChanges();

    const mockEvent = new Event('');
    const onDropSpy = spyOn(fixture.componentInstance, 'onDrop');

    const queryDebugElement = fixture.debugElement.query(By.css('app-query'));
    queryDebugElement.triggerEventHandler('cdkDropListDropped', mockEvent);

    expect(onDropSpy).toHaveBeenCalled();
  });

  it('moves first query conjunction operator #onDrop moving first term', () => {
    const component = new QueryComponent();
    component.query = new Query(
      [new QueryTerm('one'), new QueryTerm('two'), new QueryTerm('three'), new QueryTerm('four')],
      [QueryConjuctionOperator.OR, QueryConjuctionOperator.AND, QueryConjuctionOperator.NOT]
    );

    const oneQueryTerm = component.query.terms[0];
    const twoQueryTerm = component.query.terms[1];

    component.onDrop({
      previousIndex: -1,
      currentIndex: -1,
      item: {
        data: oneQueryTerm
      } as any,
      container: {
        data: twoQueryTerm
      } as any,
      previousContainer: {} as any,
      isPointerOverContainer: true
    });

    expect((component.query.terms[0] as Query).operators[0]).toBe(QueryConjuctionOperator.OR);
  });

  it('moves last query conjunction operator #onDrop moving last term', () => {
    const component = new QueryComponent();
    component.query = new Query(
      [new QueryTerm('one'), new QueryTerm('two'), new QueryTerm('three'), new QueryTerm('four')],
      [QueryConjuctionOperator.OR, QueryConjuctionOperator.AND, QueryConjuctionOperator.NOT]
    );

    const threeQueryTerm = component.query.terms[2];
    const fourQueryTerm = component.query.terms[3];

    component.onDrop({
      previousIndex: -1,
      currentIndex: -1,
      item: {
        data: fourQueryTerm
      } as any,
      container: {
        data: threeQueryTerm
      } as any,
      previousContainer: {} as any,
      isPointerOverContainer: true
    });

    expect((component.query.terms[2] as Query).operators[0]).toBe(QueryConjuctionOperator.NOT);
  });

  it('moves query conjunction operator to right of dragged term #onDrop second term', () => {
    const component = new QueryComponent();
    component.query = new Query(
      [new QueryTerm('one'), new QueryTerm('two'), new QueryTerm('three'), new QueryTerm('four')],
      [QueryConjuctionOperator.OR, QueryConjuctionOperator.AND, QueryConjuctionOperator.NOT]
    );

    const twoQueryTerm = component.query.terms[1];
    const fourQueryTerm = component.query.terms[3];

    component.onDrop({
      previousIndex: -1,
      currentIndex: -1,
      item: {
        data: twoQueryTerm
      } as any,
      container: {
        data: fourQueryTerm
      } as any,
      previousContainer: {} as any,
      isPointerOverContainer: true
    });

    expect((component.query.terms[2] as Query).operators[0]).toBe(QueryConjuctionOperator.AND);
  });

  it('moves query conjunction operator to left of dragged term #onDrop third term', () => {
    const component = new QueryComponent();
    component.query = new Query(
      [new QueryTerm('one'), new QueryTerm('two'), new QueryTerm('three'), new QueryTerm('four')],
      [QueryConjuctionOperator.OR, QueryConjuctionOperator.AND, QueryConjuctionOperator.NOT]
    );

    const oneQueryTerm = component.query.terms[0];
    const threeQueryTerm = component.query.terms[2];

    component.onDrop({
      previousIndex: -1,
      currentIndex: -1,
      item: {
        data: threeQueryTerm
      } as any,
      container: {
        data: oneQueryTerm
      } as any,
      previousContainer: {} as any,
      isPointerOverContainer: true
    });

    expect((component.query.terms[0] as Query).operators[0]).toBe(QueryConjuctionOperator.AND);
  });

  it(`#setOperator should emit #change event`, () => {
    const fixture = TestBed.createComponent(QueryComponent);
    const component = fixture.debugElement.componentInstance;
    component.query = new Query([new QueryTerm('query'), new QueryTerm('term')], [QueryConjuctionOperator.OR]);
    fixture.detectChanges();

    component.change
             .pipe(take(1))
             .subscribe(query => expect(query).toBe(component.query));
    component.onDrop({ item: {}, container: {} });
  });
});
