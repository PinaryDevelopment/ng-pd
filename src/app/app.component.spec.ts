import { TestBed, async } from '@angular/core/testing';
import { AppModule } from './app.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: []
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();

    expect(true).toBeFalsy('force failure to remember that there are not any tests written for this component yet');
  });
});
