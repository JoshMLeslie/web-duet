import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import * as UUIDReadable from 'uuid-readable';
import { RoomInteraction, ROOM_ACTION } from '../models/room';

// future thought - https://stackoverflow.com/questions/40688738/what-is-the-difference-between-sending-json-stringify-objects-and-plain-objects/40690049

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
	ready$ = new BehaviorSubject<boolean>(false);
	sendData$ = new Subject<WebSocketData>();
	recieveData$ = new Subject();

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
			this.recieveData$.next(data);
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
				console.warn('server not started');
			}
		})
	}

	send(data: WebSocketData) {
		this.sendData$.next(data);
	}

	join(roomUUID: string) {
		const roomInteraction: RoomInteraction = {
			roomAction: ROOM_ACTION.JOIN,
			roomUUID
		};
		this.send(JSON.stringify(roomInteraction));
	}

	createRoom() {
		const uuid = uuidV4();
		const roomUUID = UUIDReadable.short(uuid);
	
		const roomInteraction: RoomInteraction = {
			roomAction: ROOM_ACTION.CREATE,
			roomUUID
		};
		this.send(JSON.stringify(roomInteraction));
	}
}
