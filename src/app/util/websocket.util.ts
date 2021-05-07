import { v4 as uuidV4 } from 'uuid';
import * as UUIDReadable from 'uuid-readable';
import {
	ROOM_ACTION,
	USER_ACTION,
	WssResponse,
	WssRoomRequest,
	WssUserRequest
} from '../models/room';

const _roomUtil = {
	newUUID: () => {
		const uuid = uuidV4();
		return UUIDReadable.short(uuid);
	}
};

export const RoomUtil = (send: Function, userUUID: string) => ({
	newUUID: _roomUtil.newUUID,
	roomStatus: (roomUUID: string) => {
		send(
			WssRoomRequest(ROOM_ACTION.STATUS, {
				roomUUID
			})
		);
	},

	join: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.JOIN, { roomUUID }));
	},

	createRoom: (roomUUID: string = _roomUtil.newUUID()) => {
		send(
			WssRoomRequest(ROOM_ACTION.CREATE, {
				roomUUID,
				userUUID
			})
		);
	},

	ensureRoom: (roomUUID: string) => {
		send(
			WssRoomRequest(ROOM_ACTION.ENSURE, {
				roomUUID,
				userUUID
			})
		);
	},

	leaveRoom: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.LEAVE, { roomUUID, userUUID }));
	},
	getUsers: (roomUUID: string) => {
		send(WssRoomRequest(ROOM_ACTION.GET_USERS, { roomUUID, userUUID }))
	}
});

export const UserUtil = (send: Function, userUUID: string) => ({
	getUserID: () => {
		send(WssUserRequest(USER_ACTION.GET_ID));
	},
	logout: () => {
		send(WssUserRequest(USER_ACTION.LOGOUT, { userUUID: userUUID }));
	}
});
