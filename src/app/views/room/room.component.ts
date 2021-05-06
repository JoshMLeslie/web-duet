import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MidiDictDatum } from 'src/app/models/midi-data';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit, OnDestroy {
	loading = true;
	roomUUID: string;
	users: string[] = [];

	midiDataInput$: Observable<MidiDictDatum[]>;

	destroy$ = new Subject();

	constructor(
		private wss: WebsocketService,
		private activatedRoute: ActivatedRoute,
		private us: UserService
	) {
		this.wss.recieveData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
			console.log(data);
		});

		this.us.uuid$
			.pipe(
				takeUntil(this.destroy$),
				filter(u => !!u)
			)
			.subscribe(uuid => this.users.push(uuid));
	}

	ngOnInit(): void {
		this.roomUUID = this.activatedRoute.snapshot.url[0].path;

		combineLatest([this.wss.ready$, this.us.uuid$])
			.pipe(takeUntil(this.destroy$))
			.subscribe(([ready, userUUID]) => {
				if (ready && !!userUUID) {
					this.wss.room.ensureRoom(this.roomUUID);
					this.init();
				}
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		this.wss.room.leaveRoom(this.roomUUID);
	}

	init() {
		this.loading = false;
	}
}
