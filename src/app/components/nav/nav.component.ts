import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MiscUtil } from '../../util/websocket.util';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent {
	user$ = this.us.uuid$.pipe(
		map(uuid => MiscUtil.newShortUUID(uuid))
	);
	roomUUID$ = this.router.events.pipe(
		filter(event => event instanceof NavigationEnd),
		map(event => (event as NavigationEnd).url.slice(1))
	);

	constructor(private us: UserService, private router: Router) {}
}
