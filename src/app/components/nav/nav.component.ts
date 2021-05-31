import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UuidService } from '../../services/uuid.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent {
	readonly configButtonDisabled = /join/; // /foo|bar|baz/
	readonly buttonDisabled$ = new Subject<boolean>();
	readonly roomUUID$ = this.router.events.pipe(
		filter(event => event instanceof NavigationEnd),
		map(event => {
			const url = (event as NavigationEnd).url.slice(1) ||
				(event as NavigationEnd).urlAfterRedirects.slice(1)

				this.buttonDisabled$.next(
					!this.configButtonDisabled.test(url)
				);
				
			return url;
		})
	);

	constructor(
		private router: Router,
		private snackbar: MatSnackBar
	) {}

	copyConfirm() {
		this.snackbar.open('Room ID copied', 'close', {
			duration: 1000 // ms
		})
	}
}
