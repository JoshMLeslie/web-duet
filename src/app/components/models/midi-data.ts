import { Subject } from "rxjs";

export type MidiData = [number] | [number, number, number]; //  type, id, tone
export interface MidiObject {
	id: number;
	tone: number;
	type: number;
}

export interface MidiTimeData extends MidiObject {
	startTime?: string; // ISO 8601
	endTime?: string; // ISO 8601
}
export type MidiMapSubject = Map<string | number, Subject<{midiInputId: string, data: MidiTimeData}>>
export type MidiMapObject = Map<string | number, {midiInputId: string, data: MidiTimeData}>