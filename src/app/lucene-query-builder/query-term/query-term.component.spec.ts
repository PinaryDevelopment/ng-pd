import { TestBed, async } from '@angular/core/testing';
import { QueryTermComponent } from './query-term.component';

describe('QueryTermComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueryTermComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-pd-demo-app'`, () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ng-pd-demo-app');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(QueryTermComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ng-pd-demo-app!');
  });
});
