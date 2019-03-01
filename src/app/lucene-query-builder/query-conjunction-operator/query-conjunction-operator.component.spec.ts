import { TestBed, async } from '@angular/core/testing';
import { QueryConjuctionOperatorComponent } from './query-conjunction-operator.component';

describe('QueryConjuctionOperatorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueryConjuctionOperatorComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-pd-demo-app'`, () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ng-pd-demo-app');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(QueryConjuctionOperatorComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ng-pd-demo-app!');
  });
});
