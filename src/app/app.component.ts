import { Component, HostListener } from '@angular/core';
import { WebRTCService } from './services/web-rtc.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
})
export class AppComponent {
	@HostListener('window:unload', ['$event']) unload() {
		// this.wss.user.logout();
	}

	constructor(private wRTC: WebRTCService) {
	}
}
