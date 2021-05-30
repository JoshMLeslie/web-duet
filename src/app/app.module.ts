import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeyboardModule } from './components/keyboard/keyboard.module';
import { NavModule } from './components/nav/nav.module';
import { RecorderModule } from './components/recorder/recorder.module';
import { SimpleDialogModule } from './components/simple-dialog/simple-dialog.module';
import { WebRTCService } from './services/web-rtc.service';
import { MatchingModule } from './views/matching/matching.module';
import { RoomModule } from './views/room/room.module';

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
		NavModule,
		MatDialogModule,
		SimpleDialogModule,
		MatSnackBarModule
	],
	providers: [WebRTCService],
	bootstrap: [AppComponent]
})
export class AppModule {}
