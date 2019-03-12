import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { LuceneQueryBuilderComponent } from './lucene-query-builder/lucene-query-builder.component';
import { QueryConjuctionOperatorComponent } from './lucene-query-builder/query-conjunction-operator/query-conjunction-operator.component';
import { QueryComponent } from './lucene-query-builder/query/query.component';
import { QueryTermComponent } from './lucene-query-builder/query-term/query-term.component';

@NgModule({
  declarations: [
    AppComponent,
    LuceneQueryBuilderComponent,
    QueryComponent,
    QueryConjuctionOperatorComponent,
    QueryTermComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
