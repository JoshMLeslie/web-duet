import { MidiObject } from "../../models/midi-data";

export interface KeyboardKeyData extends MidiObject {
	color?: 'white' | 'black';
};
export type KeyboardMapArgs = [number, KeyboardKeyData];
export type KeyboardKeys = Map<number, KeyboardKeyData>;