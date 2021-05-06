import { Component, HostListener } from '@angular/core';
import { filter } from 'rxjs/operators';
import { USER_ACTION } from './models/room';
import { UserService } from './services/user.service';
import { WebsocketService } from './services/websocket.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
})
export class AppComponent {
	@HostListener('window:unload', ['$event']) unload(event: BeforeUnloadEvent) {
		this.wss.user.logout();
		event.returnValue = '';
  }

	constructor(
		private wss: WebsocketService,
		us: UserService
	) {
		this.wss.recieveData$.pipe(
			filter(res => res.action === USER_ACTION.GET_ID)
		).subscribe((res) => us.setUUID(res.data));
		wss.user.getUserID();
	}
}
