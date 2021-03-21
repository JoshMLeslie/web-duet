export type KeyboardKeyDataRaw = [number, number, number] | Uint8Array[];

export interface KeyboardKeyData {
	id: number;
	tone: number;
	type: number;
	color: 'w' | 'b';
};
export type KeyboardMapArgs = [number, KeyboardKeyData];
export type KeyboardKeys = Map<number, KeyboardKeyData>;