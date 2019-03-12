import { TestBed, async } from '@angular/core/testing';
import { take } from 'rxjs/internal/operators/take';
import { QueryConjuctionOperatorComponent } from './query-conjunction-operator.component';
import { QueryConjuctionOperator } from '../models';

describe('QueryConjuctionOperatorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueryConjuctionOperatorComponent
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should have as text 'OR'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.OR;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('OR');
  });

  it(`should have as text 'AND'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.AND;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('AND');
  });

  it(`should have as text 'NOT'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.NOT;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('NOT');
  });

  it('component #click should call #toggleOperator', () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const mockEvent = new Event('');
    const toggleOperatorSpy = spyOn(fixture.componentInstance, 'toggleOperator');

    fixture.debugElement.triggerEventHandler('click', mockEvent);

    expect(toggleOperatorSpy).toHaveBeenCalled();
  });

  it('component #keyup.enter should call #toggleOperator', () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const mockEvent = new Event('');
    const toggleOperatorSpy = spyOn(fixture.componentInstance, 'toggleOperator');

    fixture.debugElement.triggerEventHandler('keyup.enter', mockEvent);

    expect(toggleOperatorSpy).toHaveBeenCalled();
  });

  it(`#toggleOperator should toggle 'OR' to 'AND'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.OR;
    component.toggleOperator();

    expect(component.operator).toEqual(QueryConjuctionOperator.AND);
  });

  it(`#toggleOperator should toggle 'AND' to 'NOT'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.AND;
    component.toggleOperator();

    expect(component.operator).toEqual(QueryConjuctionOperator.NOT);
  });

  it(`#toggleOperator should toggle 'NOT' to 'OR'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.NOT;
    component.toggleOperator();

    expect(component.operator).toEqual(QueryConjuctionOperator.OR);
  });

  it(`#toggleOperator should emit #change event`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const component = fixture.debugElement.componentInstance;
    component.operator = QueryConjuctionOperator.AND;
    component.change
             .pipe(take(1))
             .subscribe(operator => expect(operator).toBe(component.operator));
    component.toggleOperator();
  });
});
