import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
	user$ = this.us.uuid$;
	roomUUID$: Observable<string>;

	constructor(private us: UserService, router: Router) {
		this.roomUUID$ = router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(event => (event as NavigationEnd).url.slice(1).replace(/-/g, ' '))
		);
	}

	ngOnInit(): void {}
}
