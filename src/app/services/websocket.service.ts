import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WssResponse } from '../models/room';
import { KeyboardUtil, RoomUtil, UserUtil } from '../util/websocket.util';
import { UuidService } from './uuid.service';

// future thought - https://stackoverflow.com/questions/40688738/what-is-the-difference-between-sending-json-stringify-objects-and-plain-objects/40690049

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	room: ReturnType<typeof RoomUtil>;
	user: ReturnType<typeof UserUtil>;
	keyboard: ReturnType<typeof KeyboardUtil>;
	
	ready$ = new BehaviorSubject<boolean>(false);
	sendData$ = new Subject<WebSocketData>();

	private _receiveData$ = new Subject<WssResponse>();
	receiveData$ = this._receiveData$.asObservable().pipe(
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
	host = this.doc.location.hostname;
	port = environment.apiPort;
	version = environment.apiVersion;
	websocketUrl = [
		this.host.includes('localhost') ? 'ws://' : 'wss://',
		this.host, ':',
		this.port, "/",
		this.version, '/ws'
	].join();

	constructor(
		private us: UuidService,
		@Inject(DOCUMENT) private doc: Document
	) {
		if (window['WebSocket']) {
			this.wsSetup();
		} else {
			alert('Please upgrade your browser. It must support WebSockets.')
		}
	}

	send(data: Object) {
		this.sendData$.next(JSON.stringify(data));
	}

	private wsSetup() {
		if (this.ws) {
			this.ws.close();
		}

		this.ws = new WebSocket(this.websocketUrl);
		this.ws.onopen = () => {
			console.log('client connection opened');
			this.ready$.next(true);
		};
		this.ws.onmessage = message => {
			const { data } = message;
			console.log('incoming:', data);
			this._receiveData$.next(data);
		};
		this.ws.onclose = () => {
			this.ws = null;
		};

		this.us.uuid$.pipe(take(2)).subscribe(uuid => {
			this.room = RoomUtil(this.send.bind(this), uuid);
			this.user = UserUtil(this.send.bind(this), uuid);
			this.keyboard = KeyboardUtil(this.send.bind(this), uuid);
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
