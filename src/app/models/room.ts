// room actions require roomUUID
export enum ROOM_ACTION {
	CLOSE = 'close',
	CREATE = 'create',
	ENSURE = 'ensure',
	JOIN = 'join',
	LEAVE = 'leave',
	STATUS = 'status',
	HAS_USER = 'hasUser',
	GET_USERS = 'getUsers'
}

export enum USER_ACTION {
	GET_USER_UUID = 'getUserUUID',
	LOGOUT = 'logout'
}

interface WssBaseRequest <A, R, D = any> {
	action: A;
	requester: R;
	data?: {
		[key: string]: D;
	}
}

interface WssBaseResponse<A, D> {
	action: A;
	data?: D 
}

export type WssRoomRequestT = WssBaseRequest<ROOM_ACTION, 'room', string>
export type WssUserRequestT = WssBaseRequest<USER_ACTION, 'user', string>

export type WssRoomResponse<D = any> = WssBaseResponse<ROOM_ACTION, D>;
export type WssUserResponse<D = any> = WssBaseResponse<USER_ACTION, D>;

export type WssResponse<D = any> = WssRoomResponse<D> | WssUserResponse<D>;

export const WssRoomRequest = (action: ROOM_ACTION, data?: WssRoomRequestT['data']): WssRoomRequestT => {
	return {
		action,
		data,
		requester: 'room'
	}
}
export const WssUserRequest = (action: USER_ACTION, data?: WssUserRequestT['data']): WssUserRequestT => {
	return {
		action,
		data,
		requester: 'user'
	}
}