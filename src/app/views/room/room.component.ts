import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MidiDictDatum } from 'src/app/models/midi-data';
import { AudioOutputService } from 'src/app/services/audio-output.service';
import { ComputerKeyboardListeningService } from 'src/app/services/keyboard-binding.service';
import { MidiListenerService } from 'src/app/services/midi-listener.service';
import { MidiToSoundService } from 'src/app/services/midi-to-sound.service';
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

	midiDataInput$: Observable<MidiDictDatum[]>;

	destroy$ = new Subject();

	constructor(
		private wss: WebsocketService,
		private activatedRoute: ActivatedRoute,
		private us: UserService
	) {
		this.wss.recieveData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
			console.log(data);
		})
	}

	ngOnInit(): void {
		this.roomUUID = this.activatedRoute.snapshot.url[0].path;

		combineLatest([
			this.wss.ready$,
			this.us.uuid$
		]).pipe(
			takeUntil(this.destroy$),
		).subscribe(([ready, userUUID]) => {
			if (ready && !!userUUID) {
				this.wss.ensureRoom(this.roomUUID);
				this.init();
			}
		});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		this.wss.leaveRoom(this.roomUUID);
	}

	init() {
		this.loading = false;
	}

}
