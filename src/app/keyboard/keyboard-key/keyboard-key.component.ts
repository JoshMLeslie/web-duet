import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardKeyComponent implements OnInit {
	@Input() keyId: number;
	@Input() keyTone: number;

  constructor() { }

  ngOnInit(): void {
  }

}
