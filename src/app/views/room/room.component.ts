import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { WebRTCService } from 'src/app/services/web-rtc.service';
import { ROOM_ACTION } from '../../models/room';
import { UuidService } from '../../services/uuid.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit, OnDestroy {
	@HostListener('window:unload', ['$event']) unload() {
		// this.wss.room.leave(this.roomUUID); // for page closing
	}

	loading = true;
	roomUUID: string;
	roomUUID$: Observable<string>;
	users: string[];

	destroy$ = new Subject();

	constructor(
		// private wss: WebsocketService,
		private activatedRoute: ActivatedRoute,
		private us: UuidService,
		private wRTC: WebRTCService
	) {
		// this.wss.recieveData$.pipe(
		// 	takeUntil(this.destroy$),
		// 	filter(res => res.action === ROOM_ACTION.USERS)
		// ).subscribe((res: {data?: string[]}) => {
		// 	const user = this.us.uuid;
		// 	console.log(res)
		// 	if (res.data) {
		// 		this.users = [
		// 			...res.data.filter(u => u !== user),
		// 			user
		// 		];
		// 	}
		// });
	}

	ngOnInit(): void {
		this.roomUUID = this.activatedRoute.snapshot.url[0].path;
		if (!this.wRTC.initialized) {
			this.wRTC.connect(this.roomUUID);
		}
		this.wRTC.isCallStarted$.subscribe(state => {
			if (state) {
				console.log('user joined')
			}
		});
		this.init();
		// combineLatest([
		// 	this.wss.ready$,
		// 	this.us.uuid$,
		// ])
		// 	.pipe(takeUntil(this.destroy$))
		// 	.subscribe(([ready, userUUID]) => {
		// 		if (ready && !!userUUID) {
		// 			this.init();
		// 		}
		// 	});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		// this.wss.user.logout(this.roomUUID);
	}

	init() {
		// this.wss.room.ensure(this.roomUUID);
		// this.wss.room.users(this.roomUUID);
		this.loading = false;
	}
}
