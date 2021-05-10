import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardComponent } from './keyboard.component';
import { KeyboardKeyComponent } from './keyboard-key/keyboard-key.component';
import { KeyOpacityDirective } from './keyboard-key/key-opacity.directive';

@NgModule({
	declarations: [KeyboardComponent, KeyboardKeyComponent, KeyOpacityDirective],
	imports: [
		CommonModule
	],
	exports: [KeyboardComponent]
})
export class KeyboardModule { }
