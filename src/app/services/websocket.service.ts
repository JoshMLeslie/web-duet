import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import * as UUIDReadable from 'uuid-readable';
import { ROOM_ACTION, USER_ACTION, WssResponse, WssRoomRequest, WssUserRequest } from '../models/room';

// future thought - https://stackoverflow.com/questions/40688738/what-is-the-difference-between-sending-json-stringify-objects-and-plain-objects/40690049

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
	ready$ = new BehaviorSubject<boolean>(false);
	sendData$ = new Subject<WebSocketData>();
	
	private _recieveData$ = new Subject<WssResponse>();
	recieveData$ = this._recieveData$.asObservable().pipe(
		map(res => {
			if (typeof res === 'string') {
				try {
					res = JSON.parse(res);
				} catch {
					console.error("couldn't parse incoming data", res);
					throw new Error("Malformed data")
				}
			}
			return res;
		})
	);

	ws: WebSocket;
	domain = 'localhost';
	port = '8080';

  constructor() {
		if (this.ws) {
			this.ws.close();
		}

		this.ws = new WebSocket('ws://' + this.domain + ':' + this.port);
		this.ws.onopen = () => {
			console.log('client connection opened');
			this.ready$.next(true);
		}
		this.ws.onmessage = ({ data }) => {
			console.log('incoming:', data);
			this._recieveData$.next(data);
		}
		this.ws.onclose = () => {
			this.ws = null;
		}

		combineLatest([
			this.ready$,
			this.sendData$
		]).subscribe(([ready, data]) => {
			if (ready) {
				this.ws.send(data);
			} else {
				console.warn('no server connection');
			}
		})
	}

	send(data: WebSocketData) {
		this.sendData$.next(data);
	}

	newRoomUUID() {
		const uuid = uuidV4();
		return UUIDReadable.short(uuid);
	}

	status(roomUUID: string) {
		const request: WssRoomRequest = {
			action: ROOM_ACTION.STATUS,
			requester: 'room',
			data: {
				roomUUID
			}
		};
		this.send(JSON.stringify(request));
	}

	join(roomUUID: string) {
		const request: WssRoomRequest = {
			action: ROOM_ACTION.JOIN,
			requester: 'room',
			data: { roomUUID }
		};
		this.send(JSON.stringify(request));
	}

	createRoom(roomUUID: string = '', userUUID: string) {
		roomUUID ||= this.newRoomUUID();
	
		const request: WssRoomRequest = {
			action: ROOM_ACTION.CREATE,
			requester: 'room',
			data: {
				roomUUID,
				userUUID
			}
		};
		this.send(JSON.stringify(request));
	}

	getUserID() {
		const request: WssUserRequest = {
			action: USER_ACTION.GET_USER_ID,
			requester: 'user'
		}
		this.send(JSON.stringify(request));
	}
}
