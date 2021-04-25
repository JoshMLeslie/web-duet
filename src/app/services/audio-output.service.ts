import { Injectable } from '@angular/core';
import { MidiObject } from '../models/midi-data';
import { MidiToSoundService } from './midi-to-sound.service';

@Injectable({
	providedIn: 'root'
})
export class AudioOutputService {
	context: AudioContext;
	oscillator: ReturnType<AudioContext['createOscillator']>;
	oscillatorStarted = false;

	constructor(private convert: MidiToSoundService) {
		if (!this.context) {
			this.context = new AudioContext();
			this.oscillator = this.context.createOscillator();
			this.oscillator.connect(this.context.destination);
		}
	}

	handleMidiNote(note: MidiObject) {
		if (note.tone > 0) {
			this.playMidiNote(note);
		} else {
			this.stopMidiNote();
		}
	}

	playMidiNote(note: MidiObject) {
		this.oscillator.frequency.setTargetAtTime(
			this.convert.convertMidiToHz(note.id),
			this.context.currentTime,
			0
		);
		if (this.oscillatorStarted) {
			this.context.resume();
		} else {
			this.oscillator.start(0);
			this.oscillatorStarted = true;
		}
	}
	stopMidiNote() {
		this.context.suspend();
	}
}
