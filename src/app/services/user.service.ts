import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
	providedIn: 'root'
})
export class UserService {
	private _uuid$ = new BehaviorSubject<string>(null);
	uuid$ = this._uuid$.asObservable();

	genUUID() {
		const uuid = uuidv4();
		this._uuid$.next(uuid);
		return uuid;
	}

	setUUID(uuid: string) {
		console.log(uuid);
		this._uuid$.next(uuid);
	}

	// use sync with caution.
	getUUID() {
		return this._uuid$.value;
	}
}
