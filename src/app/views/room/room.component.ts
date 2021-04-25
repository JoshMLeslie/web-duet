import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MidiDictDatum } from 'src/app/models/midi-data';
import { AudioOutputService } from 'src/app/services/audio-output.service';
import { ComputerKeyboardListeningService } from 'src/app/services/keyboard-binding.service';
import { MidiListenerService } from 'src/app/services/midi-listener.service';
import { MidiToSoundService } from 'src/app/services/midi-to-sound.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit, OnDestroy {
	loading = true;
	roomPath: string;

	midiDataInput$: Observable<MidiDictDatum[]>;

	destroy$ = new Subject();

	constructor(
		private wss: WebsocketService,
		private activatedRoute: ActivatedRoute,
		private midiListener: MidiListenerService,
		private keyboardListener: ComputerKeyboardListeningService,
		private audioService: AudioOutputService
	) {
		this.wss.ready$.pipe(takeUntil(this.destroy$)).subscribe(isReady => {
			if (isReady) {
				this.init();
			}
		});
	}

	ngOnInit(): void {
		this.roomPath = this.activatedRoute.snapshot.url[0].path;
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	init() {
		this.loading = false;
		this.midiListener.init();
		this.keyboardListener.init();
		merge(
			this.midiListener.activeInput$,
			this.keyboardListener.activeInput$
		).subscribe(v => {
			console.log(v);
			this.audioService.handleMidiNote(v.data);
		});
	}
}
