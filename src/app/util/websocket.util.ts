import { v4 as uuidV4 } from 'uuid';
import { MidiObject } from '../models/midi-data';
import {
	KEYBOARD_ACTION,
	ROOM_ACTION,
	USER_ACTION,
	WssKeyboardRequest,
	WssRoomRequest,
	WssUserRequest
} from '../models/room';

export const RoomUtil = (
	send: Function,
	userUUID: string
): { [key in ROOM_ACTION]: Function } => ({
	status: (roomUUID: string) => {
		send(
			WssRoomRequest(ROOM_ACTION.STATUS, {
				roomUUID
			})
		);
	},
	hasUser: (roomUUID: string, userUUID: string) => {
		send(
			WssRoomRequest(ROOM_ACTION.HAS_USER, {
				roomUUID,
				userUUID
			})
		);
	},
	join: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.JOIN, { roomUUID }));
	},
	create: (roomUUID: string = uuidV4()) => {
		send(
			WssRoomRequest(ROOM_ACTION.CREATE, {
				roomUUID,
				userUUID
			})
		);
	},
	ensure: (roomUUID: string) => {
		send(
			WssRoomRequest(ROOM_ACTION.ENSURE, {
				roomUUID,
				userUUID
			})
		);
	},
	close: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.CLOSE, { roomUUID }));
	},
	leave: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.LEAVE, { roomUUID, userUUID }));
	},
	users: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.USERS, { roomUUID, userUUID }));
	}
});

export const UserUtil = (send: Function, userUUID: string): {[key in USER_ACTION]: Function} => ({
	getUserUUID: () => {
		send(WssUserRequest(USER_ACTION.GET_USER_UUID));
	},
	logout: (roomUUID?: string) => {
		send(WssUserRequest(USER_ACTION.LOGOUT, { userUUID }));
		if (roomUUID) {
			send(WssRoomRequest(ROOM_ACTION.LEAVE, { roomUUID, userUUID }))
		}
	}
});

export const KeyboardUtil = (send: Function, userUUID: string): {[key in KEYBOARD_ACTION]: Function} => ({
	note: (note: MidiObject) => {
		send(WssKeyboardRequest(KEYBOARD_ACTION.NOTE, { userUUID, note }))
	}
})