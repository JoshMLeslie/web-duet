import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
		MatProgressSpinnerModule
  ],
	exports: [
		RoomComponent
	]
})
export class RoomModule { }
