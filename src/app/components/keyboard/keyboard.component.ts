import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { getTestData } from 'test-data/test-data_perpetuum-mobile';
import { MidiMapSubject } from '../../models/midi-data';
import { KeyboardKeyData, KeyboardKeys } from './keyboard';
import { WB_PATTERN } from './keys-setup';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.less'],
})
export class KeyboardComponent implements OnInit {
	@Input() keyboardSize = 88;

	_keys: KeyboardKeys;
	updateTone (data: KeyboardKeyData) {
		const id = data[1];
		this._keys.set(id, {
			...this._keys.get(id),
			tone: data[2],
		});
	};
	get keys() {
		return this._keys;
	}
	inputSubs: MidiMapSubject = new Map();

	constructor(private cd: ChangeDetectorRef) {
		this.buildKeys();
	}

	ngOnInit() {
		// this.startMidi();

		// TEST
		getTestData(1).subscribe(key => {
			this.updateTone(key as unknown as KeyboardKeyData);
		})
	}

	private buildKeys() {
		const tempMap = new Map() as KeyboardKeys;
		const base = 21;
		// starts at 21 for 88s at least TODO check for smaller boards
		
		for (let i = 0; i < this.keyboardSize; i++ ) {
			const color = WB_PATTERN[i % WB_PATTERN.length];
			const id = i + base;
			tempMap.set(id, {
				id: id,
				tone: 0,
				type: null,
				color
			})
		};
		this._keys = tempMap;
	}
}
