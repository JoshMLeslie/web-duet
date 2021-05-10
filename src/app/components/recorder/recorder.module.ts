import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecorderComponent } from './recorder.component';

@NgModule({
	declarations: [RecorderComponent],
	imports: [
		CommonModule
	],
	exports: [RecorderComponent]
})
export class RecorderModule { }
