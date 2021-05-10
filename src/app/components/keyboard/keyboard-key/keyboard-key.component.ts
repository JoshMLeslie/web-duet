import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { KeyboardKeyData } from '../keyboard';

@Component({
	selector: 'app-keyboard-key',
	templateUrl: './keyboard-key.component.html',
	styleUrls: ['./keyboard-key.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardKeyComponent implements OnInit {
	@Input() key: KeyboardKeyData;

	@HostBinding('class.white') isWhite: boolean; 
	@HostBinding('class.black') isBlack: boolean; 

	constructor() { }

	ngOnInit(): void {
		this.isWhite = this.key.color === 'white';
		this.isBlack = this.key.color === 'black';
	}

}
