import { MidiObject } from '../models/midi-data';

// https://blog.chrislowis.co.uk/2013/06/10/playing-multiple-notes-web-audio-api.html
class Note {
	context: AudioContext;
	keyData: MidiObject;
	oscillator: OscillatorNode;
	oscillatorStarted: boolean = false;
	amp: GainNode;

	static MidiToHz(id: MidiObject['id']) {
		return Math.pow(2, (id - 69) / 12) * 440;
	}

	static HzToMidi(hz: number): number {
		return 69 + 12 * Math.log2(hz / 440);
	}

	constructor(context: AudioContext, keyData: MidiObject) {
		this.context = context;
		this.keyData = keyData;
		this.setup();
	}

	start(tone: MidiObject['tone']) {
		if (!this.oscillatorStarted) {
			this.oscillator.start(0);
			this.oscillatorStarted = true;
		}
		this.amp.gain.value = tone / 100; // should it be divided by 100? +? -?
	}

	stop() {
		this.amp.gain.value = 0;
	}

	private setup() {
		this.oscillator = this.context.createOscillator();
		this.oscillator.type = 'sine';
		this.oscillator.frequency.value = Note.MidiToHz(this.keyData.id);

		this.amp = this.context.createGain();

		this.oscillator.connect(this.amp);
		this.amp.connect(this.context.destination);
	}
}

export default Note;
