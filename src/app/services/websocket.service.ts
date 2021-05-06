import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { v4 as uuidV4 } from 'uuid';
import * as UUIDReadable from 'uuid-readable';
import {
	ROOM_ACTION,
	USER_ACTION,
	WssResponse,
	WssRoomRequest,
	WssUserRequest
} from '../models/room';
import { RoomUtil, UserUtil } from '../util/websocket.util';
import { UserService } from './user.service';

// future thought - https://stackoverflow.com/questions/40688738/what-is-the-difference-between-sending-json-stringify-objects-and-plain-objects/40690049

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	room: ReturnType<typeof RoomUtil>;
	user: ReturnType<typeof UserUtil>;
	
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
		this.wsSetup();
	}

	send(data: Object) {
		this.sendData$.next(JSON.stringify(data));
	}

	private wsSetup() {
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

		this.us.uuid$.pipe(take(2)).subscribe(uuid => {
			this.room = RoomUtil(this.send, uuid);
			this.user = UserUtil(this.send, uuid);
		})

		combineLatest([
			this.ready$,
			this.sendData$
		]).subscribe(([ready, data]) => {
			if (ready) {
				this.ws.send(data);
			} else {
				console.warn('no server connection');
			}
		});
	}
}
