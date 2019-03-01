import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LuceneQueryBuilderComponent } from './lucene-query-builder/lucene-query-builder.component';
import { QueryConjuctionOperatorComponent } from './lucene-query-builder/query-conjunction-operator/query-conjunction-operator.component';
import { QueryTermComponent } from './lucene-query-builder/query-term/query-term.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    LuceneQueryBuilderComponent,
    QueryConjuctionOperatorComponent,
    QueryTermComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
