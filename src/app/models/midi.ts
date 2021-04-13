// useless, but https://webaudio.github.io/web-midi-api/#MIDIInputMap
export interface MIDIInputMap extends Readonly<Map<unknown, unknown>> {
	onmidimessage: Function;
	id: string;
}