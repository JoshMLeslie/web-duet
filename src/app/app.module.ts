import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeyboardModule } from './components/keyboard/keyboard.module';
import { RecorderModule } from './components/recorder/recorder.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeyboardModule,
    RecorderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
