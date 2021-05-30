import { Component, HostListener } from '@angular/core';
import { filter } from 'rxjs/operators';
import { USER_ACTION } from './models/room';
import { UserService } from './services/user.service';
import { WebRTCService } from './services/web-rtc.service';
import { WebsocketService } from './services/websocket.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
})
export class AppComponent {
	@HostListener('window:unload', ['$event']) unload() {
		// this.wss.user.logout();
	}

	constructor(
		// private wss: WebsocketService,
		// us: UserService,
		private wRTC: WebRTCService
	) {
		this.wRTC.initPeer();
		// this.wss.recieveData$.pipe(
		// 	filter(res => res.action === USER_ACTION.GET_USER_UUID)
		// ).subscribe((res) => us.setUUID(res.data));
		// wss.user.getUserUUID();

	}
}
