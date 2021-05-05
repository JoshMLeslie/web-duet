// room actions require roomUUID
export enum ROOM_ACTION {
	CLOSE = 'close',
	CREATE = 'create',
	ENSURE = 'ensure',
	JOIN = 'join',
	LEAVE = 'leave',
	STATUS = 'status'
}

export enum USER_ACTION {
	GET_USER_ID = 'getUserId'
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

export type WssRoomRequest = WssBaseRequest<ROOM_ACTION, 'room', string>
export type WssUserRequest = WssBaseRequest<USER_ACTION, 'user', string>

export type WssRoomResponse<D = any> = WssBaseResponse<ROOM_ACTION, D>;
export type WssUserResponse<D = any> = WssBaseResponse<USER_ACTION, D>;

export type WssResponse<D = any> = WssRoomResponse<D> | WssUserResponse<D>;