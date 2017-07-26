import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgxChoosyModule } from '@nglibrary/ngx-choosy';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';
import { AppComponent } from './app.component';
import { ChangelogComponent } from './pages/changelog/changelog.component';
import { ExamplesComponent } from './pages/examples/examples.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'changelog', component: ChangelogComponent },
  { path: '**', component: AppComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ChangelogComponent,
    ExamplesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    MarkdownToHtmlModule.forRoot(),
    NgxChoosyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
