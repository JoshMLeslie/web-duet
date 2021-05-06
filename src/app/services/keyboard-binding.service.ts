import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { MidiSubject } from '../models/midi-data';

const KeyMap = {
	q: 60,
	w: 62,
	e: 64,
	r: 65,
	t: 67,
	y: 69,
	u: 71,
	i: 72,
	o: 74,
	p: 76
};

@Injectable({
	providedIn: 'root'
})
export class ComputerKeyboardListeningService implements OnDestroy {
	private _activeInput$: MidiSubject = new Subject();
	activeInput$ = this._activeInput$.asObservable();

	// listenToKeyboard$ = new BehaviorSubject(true); // lets user toggle on / off - off by default
	destroy$ = new Subject();

	constructor() {
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	init() {
		merge(
			fromEvent<KeyboardEvent>(document, 'keydown'),
			fromEvent<KeyboardEvent>(document, 'keyup')
		)
			.pipe(
				filter(event => KeyMap[event.key]),
				tap(event => this._activeInput$.next({
					inputId: 'text-keyboard',
					data: {
						id: KeyMap[event.key],
						tone: event.type === 'keydown' ? 100 : 0, // arbitrary middle-ish
						type: 144
					}
				})),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}
}
