import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private _uuid$ = new BehaviorSubject<string>(null);
	uuid$ = this._uuid$.asObservable();

  constructor() { }

	setUUID(uuid: string) {
		console.log(uuid)
		this._uuid$.next(uuid);
	}

	// use sync with caution.
	getUUID() {
		return this._uuid$.value;
	}
}
