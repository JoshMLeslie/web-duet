import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { MidiMapSubject } from '../../models/midi-data';
import { KEYBOARD_ACTION } from '../../models/room';
import { AudioOutputService } from '../../services/audio-output.service';
import { ComputerKeyboardListeningService } from '../../services/keyboard-binding.service';
import { MidiListenerService } from '../../services/midi-listener.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { KeyboardKeyData, KeyboardKeys } from './keyboard';
import { WB_PATTERN } from './keys-setup';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.less'],
})
export class KeyboardComponent implements OnInit, OnDestroy {
	@Input() keyboardSize = 88;
	@Input() userUUID: string;

	_keys: KeyboardKeys;
	updateTone ({id, tone}: KeyboardKeyData) {
		this._keys.set(id, {
			...this._keys.get(id),
			tone
		});
	};
	get keys() {
		return this._keys;
	}
	inputSubs: MidiMapSubject = new Map();
	destroy$ = new Subject();

	constructor(
		private midiListener: MidiListenerService,
		private keyboardListener: ComputerKeyboardListeningService,
		private audioService: AudioOutputService,
		private us: UserService,
		private wss: WebsocketService
	) {
		this.buildKeys();
	}

	ngOnInit() {
		// this.startMidi();

		// TEST
		// getTestData(1).subscribe(key => {
		// 	this.updateTone(key as unknown as KeyboardKeyData);
		// })
		let stream: Observable<any>;
		if (this.userUUID === this.us.getUUID()) {
			this.midiListener.init();
			this.keyboardListener.init();
			stream = merge(
				this.midiListener.activeInput$,
				this.keyboardListener.activeInput$
			).pipe(
				tap(input => {
					this.wss.keyboard.note(input.data)
				})
			)
		} else {
			stream = this.wss.recieveData$.pipe(
				filter(res => res.action === KEYBOARD_ACTION.NOTE),
				map(res => ({data: res.data.note}))
			)
		}
		stream.pipe(takeUntil(this.destroy$)).subscribe(v => {
			this.audioService.handleMidiNote(v.data);
			this.updateTone(v.data);
		});
		
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private buildKeys() {
		const tempMap = new Map() as KeyboardKeys;
		const base = 21;
		// starts at 21 for 88s at least TODO check for smaller boards
		
		for (let i = 0; i < this.keyboardSize; i++ ) {
			const color = WB_PATTERN[i % WB_PATTERN.length];
			const id = i + base;
			tempMap.set(id, {
				id: id,
				tone: 0,
				type: null,
				color
			})
		};
		this._keys = tempMap;
	}
}
