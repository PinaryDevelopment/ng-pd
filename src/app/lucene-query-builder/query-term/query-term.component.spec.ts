import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs/internal/operators/take';
import { QueryTermComponent } from './query-term.component';
import { QueryTerm, QueryOperator } from '../models';

describe('QueryTermComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueryTermComponent
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should have as text 'query'`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('query');
  });

  it(`should have as text quoted phrase '“query phrase”'`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query phrase');
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('“query phrase”');
  });

  it(`should have as text '+query'`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Required;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('+query');
  });

  it(`should have as text '-query'`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Prohibited;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toEqual('-query');
  });

  it('should not show prohibited element', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');
    fixture.detectChanges();

    const prohibitedDebugElement = fixture.debugElement.query(By.css('.operator.prohibited'));

    /* tslint:disable:no-string-literal */
    expect(prohibitedDebugElement.classes['hidden']).not.toBeNull();
    /* tslint:enable */
  });

  it('should not show required element', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');
    fixture.detectChanges();

    const requiredDebugElement = fixture.debugElement.query(By.css('.operator.required'));

    /* tslint:disable:no-string-literal */
    expect(requiredDebugElement.classes['hidden']).not.toBeNull();
    /* tslint:enable */
  });

  it('should show prohibited element', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.hoveringOverTerm = true;
    fixture.detectChanges();
    const prohibitedDebugElement = fixture.debugElement.query(By.css('.operator.prohibited'));

    expect(prohibitedDebugElement).not.toBeNull();
  });

  it('should show required element', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.hoveringOverTerm = true;
    fixture.detectChanges();
    const requiredDebugElement = fixture.debugElement.query(By.css('.operator.required'));

    expect(requiredDebugElement).not.toBeNull();
  });

  it('should show prohibited element', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Prohibited;
    fixture.detectChanges();
    const prohibitedDebugElement = fixture.debugElement.query(By.css('.operator.prohibited'));

    expect(prohibitedDebugElement).not.toBeNull();
  });

  it('should show required element', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Required;
    fixture.detectChanges();
    const requiredDebugElement = fixture.debugElement.query(By.css('.operator.required'));

    expect(requiredDebugElement).not.toBeNull();
  });

  it('prohibited element #click should call #setOperator', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Prohibited;
    fixture.detectChanges();

    const mockEvent = new Event('');
    const setOperatorSpy = spyOn(fixture.componentInstance, 'setOperator');

    const prohibitedDebugElement = fixture.debugElement.query(By.css('.operator.prohibited'));
    prohibitedDebugElement.triggerEventHandler('click', mockEvent);

    expect(setOperatorSpy).toHaveBeenCalled();
  });

  it('prohibited element #keyup.enter should call #setOperator', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Prohibited;
    fixture.detectChanges();

    const mockEvent = new Event('');
    const setOperatorSpy = spyOn(fixture.componentInstance, 'setOperator');

    const prohibitedDebugElement = fixture.debugElement.query(By.css('.operator.prohibited'));
    prohibitedDebugElement.triggerEventHandler('keyup.enter', mockEvent);

    expect(setOperatorSpy).toHaveBeenCalled();
  });

  it('required element #click should call #setOperator', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Required;
    fixture.detectChanges();

    const mockEvent = new Event('');
    const setOperatorSpy = spyOn(fixture.componentInstance, 'setOperator');

    const requiredDebugElement = fixture.debugElement.query(By.css('.operator.required'));
    requiredDebugElement.triggerEventHandler('click', mockEvent);

    expect(setOperatorSpy).toHaveBeenCalled();
  });

  it('required element #keyup.enter should call #setOperator', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('query');
    component.queryTerm.operator = QueryOperator.Required;
    fixture.detectChanges();

    const mockEvent = new Event('');
    const setOperatorSpy = spyOn(fixture.componentInstance, 'setOperator');

    const requiredDebugElement = fixture.debugElement.query(By.css('.operator.required'));
    requiredDebugElement.triggerEventHandler('keyup.enter', mockEvent);

    expect(setOperatorSpy).toHaveBeenCalled();
  });

  it('component #mouseover should call #onMouseover', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);

    const mockEvent = new Event('');
    const setOperatorSpy = spyOn(fixture.componentInstance, 'onMouseover');

    fixture.debugElement.triggerEventHandler('mouseover', mockEvent);

    expect(setOperatorSpy).toHaveBeenCalled();
  });

  it('component #mouseout should call #onMouseout', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);

    const mockEvent = new Event('');
    const setOperatorSpy = spyOn(fixture.componentInstance, 'onMouseout');

    fixture.debugElement.triggerEventHandler('mouseout', mockEvent);

    expect(setOperatorSpy).toHaveBeenCalled();
  });

  it(`#onMouseover should update hoveringOverTerm`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.hoveringOverTerm = false;
    expect(component.hoveringOverTerm).toBeFalsy();

    component.onMouseover();

    expect(component.hoveringOverTerm).toBeTruthy();
  });

  it(`#onMouseout should update hoveringOverTerm`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.hoveringOverTerm = true;
    expect(component.hoveringOverTerm).toBeTruthy();

    component.onMouseout();

    expect(component.hoveringOverTerm).toBeFalsy();
  });

  it(`#setOperator should set queryTerm.operator`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');

    component.setOperator(QueryOperator.Prohibited);

    expect(component.queryTerm.operator).toEqual(QueryOperator.Prohibited);
  });

  it(`#setOperator should set queryTerm.operator`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');

    component.setOperator(QueryOperator.Required);

    expect(component.queryTerm.operator).toEqual(QueryOperator.Required);
  });

  it(`#setOperator should unset queryTerm.operator`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');
    component.queryTerm.operator = QueryOperator.Prohibited;

    component.setOperator(QueryOperator.Prohibited);

    expect(component.queryTerm.operator).toBeUndefined();
  });

  it(`#setOperator should unset unqueryTerm.operator`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');
    component.queryTerm.operator = QueryOperator.Required;

    component.setOperator(QueryOperator.Required);

    expect(component.queryTerm.operator).toBeUndefined();
  });

  it(`#setOperator should emit #change event`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const component = fixture.debugElement.componentInstance;
    component.queryTerm = new QueryTerm('');
    component.change
             .pipe(take(1))
             .subscribe(queryTerm => expect(queryTerm).toBe(component.queryTerm));
    component.setOperator();
  });
});
