import { Injectable } from '@angular/core';
import { MidiObject } from '../models/midi-data';
import { MidiToSoundService } from './midi-to-sound.service';

@Injectable({
  providedIn: 'root'
})
export class AudioOutputService {
	context: AudioContext;
	oscillator: ReturnType<AudioContext['createOscillator']>;

  constructor(private convert: MidiToSoundService) {
		if (!this.context) {
			this.context = new AudioContext();
			this.oscillator = this.context.createOscillator();
			this.oscillator.connect(this.context.destination);
		}
	}

	playMidiNote(note: MidiObject) {
		this.oscillator.frequency.setTargetAtTime(
			this.convert.convertMidiToHz(note.id)
		)
	}
}
