import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MidiData, MidiMapObject, MidiMapSubject, MidiObject, MidiTimeData } from '../components/models/midi-data';

@Injectable({
  providedIn: 'root'
})
export class MidiListenerService implements OnDestroy {
	// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
	// type: 248 => 'timing clock'
	// type: 254 => 'active sensing'

	inputSubs: MidiMapSubject;
	_activeKeys: MidiMapObject = new Map();
	activeKey$ = new Subject<MidiObject>();

  constructor() { }

	ngOnDestroy() {
		this.inputSubs.forEach(sub => sub.unsubscribe());
	}

	private startMidi(): void {
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
					input.onmidimessage = ({data}: {data: MidiData}) => {
						const clockedData = this.formatRawMidi(data);
						this.inputSubs.get(input.id).next({midiInputId: input.id, data: clockedData});
					}
				});

				this.inputSubs.forEach(sub => {
					sub.pipe(filter(v => !this.isMidiClock(v.data))).subscribe();
				});
			},
			(err: any) => console.error(err)
		);
	}

	private isMidiClock({type}: MidiTimeData) {
		return type === 248 || type === 254;
	}

	private formatRawMidi(midiData: MidiData): MidiTimeData {
		// assuming an active tone can't change value except to 0
		const clockedData = this._activeKeys.get(midiData[1])?.data || {
			type: midiData[0],
			id: midiData[1],
			tone: midiData[2]
		};

		if (clockedData.startTime && midiData[2] === 0) {
			clockedData.endTime = new Date().toISOString();
		} else {
			clockedData.startTime = new Date().toISOString();
		}

		return clockedData;
	}
}
