import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { getTestData } from 'test-data/test-data_perpetuum-mobile';
import { KeyboardKeyData, KeyboardKeys, KeyboardMapArgs } from './keyboard';
import { WB_PATTERN } from './keys-setup';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.less'],
})
export class KeyboardComponent implements OnInit, OnDestroy {
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
	inputSubs = new Map<string, Subject<any>>();

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

	ngOnDestroy() {
		Array.from(this.inputSubs.values(), val => {
			val.unsubscribe();
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

	private startMidi(): void {
		// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
		// 248 => 'timing clock'
		// 254 => 'active sensing'
		(navigator as any).requestMIDIAccess({ sysex: true }).then(
			(acc: any) => {
				// Get lists of available MIDI controllers
				const inputs = acc.inputs.values();
				const outputs = acc.outputs.values();

				Array.from(outputs, v => console.log(v));
				
				// pipe midi output into subject(s)
				Array.from(inputs, (input: any) => {
					console.log(input)

					this.inputSubs.set(input.id, new Subject());
					input.onmidimessage = (result: any) => {
						this.inputSubs.get(input.id).next({midiId: input.id, data: result.data});
					}
				});

				
				Object.keys(this.inputSubs).forEach(key => {
					this.inputSubs.get(key).pipe(
						filter(v => !(v.data.length === 1 && (v.data[0] === 248 || v.data[0] === 254))),
						tap(v => {
							console.log(v);
							this.updateTone(v.data);
							this.cd.detectChanges(); // I think it's gets thrown outside the zone bc of the weird sub stuff
						})
					).subscribe();
				});
			},
			(err: any) => console.error(err)
		);
	}
}
