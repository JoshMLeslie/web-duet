import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { KeyboardKeys } from './keyboard';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.less'],
})
export class KeyboardComponent implements OnInit, OnDestroy {
	@Input() keyboardSize = 88;

	keys: KeyboardKeys;
	inputSubs: {[id: string]: Subject<any>} = {};

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit() {
		this.buildKeys();
		this.startMidi();
	}

	ngOnDestroy() {
		Object.keys(this.inputSubs).forEach(key => {
			this.inputSubs[key].unsubscribe();
		})
	}

	calcOpacity(tone: number) {
		return tone / 100;
	}

	private buildKeys() {
		const tempMap = new Map() as KeyboardKeys;
		const base = 21;
		for (let i = base; i < (this.keyboardSize + base); i++ ) {
			// starts at 21 for 88s at least TODO check for smaller boards
			tempMap.set(i, {
				id: i,
				tone: 0
			})
		};
		this.keys = tempMap;
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

					this.inputSubs[input.id] = new Subject();
					input.onmidimessage = (result: any) => {
						this.inputSubs[input.id].next({midiId: input.id, data: result.data});
					}
				});

				
				Object.keys(this.inputSubs).forEach(key => {
					this.inputSubs[key].pipe(
						filter(v => !(v.data.length === 1 && (v.data[0] === 248 || v.data[0] === 254))),
						tap(v => {
							console.log(v);
							const keyType = v.data[0]; // TODO filter by type
							const keyId = v.data[1];
							const keyTone = v.data[2];
							this.keys.set(keyId, {
								id: keyId,
								tone: keyTone
							})
							this.cd.detectChanges(); // I think it's gets thrown outside the zone bc of the weird sub stuff
							console.log(this.keys.get(keyId))
						})
					).subscribe();
				});
			},
			(err: any) => console.error(err)
		);
	}
}
