export enum ROOM_ACTION {
	CLOSE = 'close',
	CREATE = 'create',
	JOIN = 'join',
	LEAVE = 'leave',
	STATUS = 'status'
}

export interface RoomInteraction {
	roomAction: ROOM_ACTION;
	roomUUID?: string;
}