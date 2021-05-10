import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KeyboardModule } from '../../components/keyboard/keyboard.module';

@NgModule({
	declarations: [
		RoomComponent
	],
	imports: [
		CommonModule,
		MatProgressSpinnerModule,
		KeyboardModule
	],
	exports: [
		RoomComponent
	]
})
export class RoomModule { }
