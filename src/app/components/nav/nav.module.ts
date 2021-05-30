import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
	declarations: [NavComponent],
	imports: [CommonModule, ClipboardModule],
	exports: [NavComponent]
})
export class NavModule {}
