import { Subject } from "rxjs";

export type RawMidiData = [number] | [number, number, number]; //  type, id, tone
export interface MidiObject {
	id: number;		// 21 -> 108 for an 88 key setup
	tone: number; // 0 - 254 (?)
	type: number;
}

export interface MidiTimeData extends MidiObject {
	startTime?: ReturnType<Date['getTime']>;
	endTime?: ReturnType<Date['getTime']>;
}
export interface MidiDictDatum {
	inputId: string;
	data: MidiObject;
}
export type MidiMap = Map<string | number, MidiDictDatum>
export type MidiSubject = Subject<MidiDictDatum>
export type MidiMapSubject = Map<string | number, MidiSubject>