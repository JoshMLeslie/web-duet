import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MidiToSoundService {

	convertMidiToHz(key: number): number {
		return Math.pow(2, ((key - 69) / 12)) * 440;
	}

	convertHzToMidi(f: number): number {
		return 69 + (12 * Math.log2(f/440))
	}
}
