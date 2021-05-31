import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
	declarations: [NavComponent],
	imports: [
		CommonModule,
		ClipboardModule,
		RouterModule,
		MatSnackBarModule
	],
	exports: [NavComponent]
})
export class NavModule {}
