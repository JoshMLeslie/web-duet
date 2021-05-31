import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
	providedIn: 'root'
})
export class UuidService {
	private _uuid$ = new BehaviorSubject<string>(null);
	uuid$ = this._uuid$.asObservable();

	setUUID(uuid: string) {
		this._uuid$.next(uuid);
	}

	get uuid() {
		return this._uuid$.value;
	}

	genUUID() {
		const uuid = uuidv4();
		this._uuid$.next(uuid);
		return uuid;
	}

}
