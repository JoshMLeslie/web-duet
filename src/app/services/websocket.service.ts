import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import * as UUIDReadable from 'uuid-readable';
import {
	ROOM_ACTION,
	USER_ACTION,
	WssResponse,
	WssRoomRequest,
	WssUserRequest
} from '../models/room';
import { UserService } from './user.service';

// future thought - https://stackoverflow.com/questions/40688738/what-is-the-difference-between-sending-json-stringify-objects-and-plain-objects/40690049

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	ready$ = new BehaviorSubject<boolean>(false);
	sendData$ = new Subject<WebSocketData>();

	get userUUID() {
		return this.us.getUUID();
	}

	private _recieveData$ = new Subject<WssResponse>();
	recieveData$ = this._recieveData$.asObservable().pipe(
		map(res => {
			if (typeof res === 'string') {
				try {
					res = JSON.parse(res);
				} catch {
					console.error("couldn't parse incoming data", res);
					throw new Error('Malformed data');
				}
			}
			return res;
		})
	);

	ws: WebSocket;
	domain = 'localhost';
	port = '8080';

	constructor(private us: UserService) {
		if (this.ws) {
			this.ws.close();
		}

		this.ws = new WebSocket('ws://' + this.domain + ':' + this.port);
		this.ws.onopen = () => {
			console.log('client connection opened');
			this.ready$.next(true);
		};
		this.ws.onmessage = message => {
			const { data } = message;
			console.log('incoming:', data);
			this._recieveData$.next(data);
		};
		this.ws.onclose = () => {
			this.ws = null;
		};

		combineLatest([this.ready$, this.sendData$]).subscribe(([ready, data]) => {
			if (ready) {
				this.ws.send(data);
			} else {
				console.warn('no server connection');
			}
		});
	}

	private send(data: Object) {
		this.sendData$.next(JSON.stringify(data));
	}

	newRoomUUID() {
		const uuid = uuidV4();
		return UUIDReadable.short(uuid);
	}

	roomStatus(roomUUID: string) {
		this.send(
			WssRoomRequest(ROOM_ACTION.STATUS, {
				roomUUID
			})
		);
	}

	join(roomUUID: string) {
		this.send(WssRoomRequest(ROOM_ACTION.JOIN, { roomUUID }));
	}

	createRoom(roomUUID: string = this.newRoomUUID()) {
		this.send(
			WssRoomRequest(ROOM_ACTION.CREATE, {
				roomUUID,
				userUUID: this.userUUID
			})
		);
	}

	ensureRoom(roomUUID: string) {
		this.send(
			WssRoomRequest(ROOM_ACTION.ENSURE, {
				roomUUID,
				userUUID: this.userUUID
			})
		);
	}

	leaveRoom(roomUUID: string) {
		this.send(
			WssRoomRequest(ROOM_ACTION.LEAVE, { roomUUID, userUUID: this.userUUID })
		);
	}

	getUserID() {
		this.send(WssUserRequest(USER_ACTION.GET_ID));
	}

	logout() {
		this.send(WssUserRequest(USER_ACTION.LOGOUT, { userUUID: this.userUUID }));
	}
}
