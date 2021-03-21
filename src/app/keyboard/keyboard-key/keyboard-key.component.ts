import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { KeyboardKeyData } from '../keyboard';

@Component({
  selector: 'app-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardKeyComponent implements OnInit {
	@Input() key: KeyboardKeyData;

  constructor() { }

  ngOnInit(): void {
  }

}
