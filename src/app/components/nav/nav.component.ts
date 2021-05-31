import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { UuidService } from '../../services/user.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent {
	user$ = this.us.uuid$;
	roomUUID$ = this.router.events.pipe(
		filter(event => event instanceof NavigationEnd),
		map(event => (event as NavigationEnd).url.slice(1))
	);

	constructor(private us: UuidService, private router: Router) {}
}
