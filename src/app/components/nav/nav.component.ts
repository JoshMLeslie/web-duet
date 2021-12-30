import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
	roomUUID$: Observable<string>;

	constructor(
		private router: Router,
		private snackbar: MatSnackBar
	) {}

	ngOnInit() {
		this.roomUUID$ = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map((event: NavigationEnd) =>  {
				const roomId = event.urlAfterRedirects.split('/').pop();
				return roomId && /(.{4,12}-+){4}/.test(roomId) ? roomId : '';
			})
		);
	}

	copyConfirm() {
		this.snackbar.open('Room ID copied', 'close', {
			duration: 1000 // ms
		})
	}
}
