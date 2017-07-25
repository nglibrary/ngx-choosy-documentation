import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChoosyModule } from '@nglibrary/ngx-choosy';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxChoosyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
