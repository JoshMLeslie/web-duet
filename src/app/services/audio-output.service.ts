import { Injectable } from '@angular/core';
import Note from '../classes/note';
import { MidiObject } from '../models/midi-data';

@Injectable({
	providedIn: 'root'
})
export class AudioOutputService {
	context: AudioContext;
	notes: {[id: number]: Note} = {};

	constructor() {
		if (!this.context) {
			this.context = new AudioContext();
		}
	}

	handleMidiNote(note: MidiObject) {
		note.tone > 0 ?
			this.playMidiNote(note) :
			this.stopMidiNote(note);
	}

	private playMidiNote(note: MidiObject) {
		if (!this.notes[note.id]) {
			this.notes[note.id] = new Note(this.context, note);
		}
		this.notes[note.id].start(note.tone);
	}
	private stopMidiNote(note: MidiObject) {
		this.notes[note.id].stop();
	}
}
