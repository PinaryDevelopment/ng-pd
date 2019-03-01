import { TestBed, async } from '@angular/core/testing';
import { LuceneQueryBuilderComponent } from './lucene-query-builder.component';

describe('LuceneQueryBuilderComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LuceneQueryBuilderComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LuceneQueryBuilderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-pd-demo-app'`, () => {
    const fixture = TestBed.createComponent(LuceneQueryBuilderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ng-pd-demo-app');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(LuceneQueryBuilderComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ng-pd-demo-app!');
  });
});
