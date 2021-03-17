import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardComponent } from './keyboard.component';
import { KeyboardKeyComponent } from './keyboard-key/keyboard-key.component';



@NgModule({
  declarations: [KeyboardComponent, KeyboardKeyComponent],
  imports: [
    CommonModule
  ],
  exports: [KeyboardComponent]
})
export class KeyboardModule { }
