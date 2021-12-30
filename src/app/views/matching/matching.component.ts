import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebRTCService } from '../../services/web-rtc.service';
import { UuidService } from '../../services/uuid.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
	selector: 'app-matching',
	templateUrl: './matching.component.html',
	styleUrls: ['./matching.component.less']
})
export class MatchingComponent {
	readonly uuidControl = new FormControl(null, [Validators.required]);

	constructor(
		private router: Router,
		private wRTC: WebRTCService,
		private wss: WebsocketService,
	) {}

	joinRoom() {
		this.wss.join().subscribe(({roomExists, roomId}) => {
			if (roomExists) {
				console.log('todo?')
				this.wRTC.connect(roomId);
			} else {
				this.wRTC.connect(roomId);
			}
			this.router.navigate(['room', roomId]);
		});
	}

	joinRandom() {
		console.log('TODO', 'requires custom wrtc/peerJs server')
		// this.wRTC.init();
		// this.wRTC.listAllPeers().subscribe(peers => {
		// 	console.log(peers)
		// })
	}

	private cleanString(str: string) {
		return str.trim().replace(/\s/g, '-');
	}
}
