import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeyboardModule } from './components/keyboard/keyboard.module';
import { RecorderModule } from './components/recorder/recorder.module';
import { MatchingModule } from './views/matching/matching.module';
import { RoomModule } from './views/room/room.module';
import { NavModule } from './components/nav/nav.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		KeyboardModule,
		RecorderModule,
		MatchingModule,
		RoomModule,
		NavModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
