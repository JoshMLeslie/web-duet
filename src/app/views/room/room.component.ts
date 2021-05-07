import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { MidiDictDatum } from 'src/app/models/midi-data';
import { ROOM_ACTION } from 'src/app/models/room';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit, OnDestroy {
	@HostListener('window:unload', ['$event']) unload() {
		this.wss.room.leave(this.roomUUID); // for page closing
	}

	loading = true;
	roomUUID: string;
	roomUUID$: Observable<string>;
	users: string[];

	destroy$ = new Subject();

	constructor(
		private wss: WebsocketService,
		private activatedRoute: ActivatedRoute,
		private us: UserService
	) {
		this.wss.recieveData$.pipe(
			takeUntil(this.destroy$),
			filter(res => res.action === ROOM_ACTION.USERS)
		).subscribe((res: {data?: string[]}) => {
			const user = this.us.getUUID();
			this.users = [
				...res.data.filter(u => u !== user),
				user
			];
		});
	}

	ngOnInit(): void {
		this.roomUUID = this.activatedRoute.snapshot.url[0].path;

		combineLatest([
			this.wss.ready$,
			this.us.uuid$,
		])
			.pipe(takeUntil(this.destroy$))
			.subscribe(([ready, userUUID]) => {
				if (ready && !!userUUID) {
					this.init();
				}
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	init() {
		this.wss.room.ensure(this.roomUUID);
		this.wss.room.users(this.roomUUID);
		this.loading = false;
	}
}
