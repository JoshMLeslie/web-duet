import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MIDIInputMap } from '../models/midi';
import { MidiObject, MidiSubject, RawMidiData } from '../models/midi-data';

@Injectable({
  providedIn: 'root'
})
export class MidiListenerService {
	// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
	// type: 248 => 'timing clock'
	// type: 254 => 'active sensing'

	activeInput$: MidiSubject = new Subject();

	get accessStatus(): Observable<PermissionState> {
		if (!navigator?.permissions?.query) return of('denied');
		return from(navigator.permissions.query({name: 'midi'}).then(r => r.state));
	}

	get accessGranted(): Observable<boolean> {
		return this.accessStatus.pipe(map(v => v === 'granted'));
	}

  constructor() { }

	init() {
		this.startMidi();
	}

	private startMidi(): void {
		if (!(navigator as any).requestMIDIAccess) {
			console.error('midi access not supported')
			alert('Browser does not support midi access!');
			return;
		}
		(navigator as any).requestMIDIAccess({ sysex: true }).then(
			(acc: any) => {
				/** Kept for posterity */
				// const outputs = acc.outputs.values();
				// Array.from(outputs, v => console.log(v));
				
				// setup midi input(s) to pipe to active subject
				Array.from(acc.inputs.values(), (input: MIDIInputMap) => {
					console.log('midi input:', input)

					input.onmidimessage = ({data}: {data: RawMidiData}) => {
						this.updateActive(input.id, data);
					}
				});
			},
			(err: any) => console.error(err)
		);
	}

	private formatRawMidi(midiData: RawMidiData): MidiObject {
		const data = {
			type: midiData[0],
			id: midiData[1],
			tone: midiData[2]
		};
		return data;
	}
	private isMidiClock({type}: MidiObject) {
		return type === 248 || type === 254;
	}
	private updateActive(inputId: MIDIInputMap['id'], rawData: RawMidiData) {
		const data = this.formatRawMidi(rawData);
		if (this.isMidiClock(data)) {
			return;
		}
		this.activeInput$.next({ inputId, data });
	}
}
