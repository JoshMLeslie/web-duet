import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchingComponent } from './matching.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [
		MatchingComponent
	],
	imports: [
		CommonModule,
		MatCardModule,
		MatInputModule,
		MatButtonModule,
		MatTooltipModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		MatchingComponent
	]
})
export class MatchingModule { }
