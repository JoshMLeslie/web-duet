import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private _uuid$ = new BehaviorSubject<string>(null);
	uuid$ = this._uuid$.asObservable();

	setUUID(uuid: string) {
		console.log(uuid);
		this._uuid$.next(uuid);
	}

	// use sync with caution.
	getUUID() {
		return this._uuid$.value;
	}
}
