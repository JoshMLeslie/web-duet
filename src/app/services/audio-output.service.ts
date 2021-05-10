import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Note from '../classes/note';
import { SimpleDialogComponent } from '../components/simple-dialog/simple-dialog.component';
import { MidiObject } from '../models/midi-data';

@Injectable({
	providedIn: 'root'
})
export class AudioOutputService {
	context: AudioContext;
	notes: { [id: number]: Note } = {};

	constructor(private dialog: MatDialog) {
		setTimeout(_ => this.startAudioContext(), 0);
	}

	handleMidiNote(note: MidiObject) {
		note.tone > 0 ? this.playMidiNote(note) : this.stopMidiNote(note);
	}

	startAudioContext() {
		this.context = new AudioContext();

		if (this.context.state === 'running') {
			console.info('audio started')
		} else {
			this.startAudioContext();
			console.error('could not start audio');
			const diag = this.dialog.open(SimpleDialogComponent, {
				data: {
					title: 'Could not start audio output',
					body: 'Would you like to try to reconnect the audio?',
					buttons: [
						{
							text: 'Retry',
							onClose: true
						}
					]
				}
			});
			diag.afterClosed().subscribe(res => {
				if (res) {
					this.startAudioContext();
				}
			});
		}
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
