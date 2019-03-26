import { TestBed, async } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { LuceneQueryBuilderComponent } from './lucene-query-builder.component';

xdescribe('LuceneQueryBuilderComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: [],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LuceneQueryBuilderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
