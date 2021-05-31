import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebRTCService } from '../../services/web-rtc.service';
import { UuidService } from '../../services/uuid.service';

@Component({
	selector: 'app-matching',
	templateUrl: './matching.component.html',
	styleUrls: ['./matching.component.less']
})
export class MatchingComponent {
	readonly uuidControl = new FormControl(null, [
		Validators.required,
		Validators.minLength(10)
	]);

	constructor(
		private router: Router,
		private wRTC: WebRTCService,
		private us: UuidService
	) {}

	createRoom() {
		const uuid = this.cleanString(this.us.genUUID());
		this.wRTC.connect(uuid);
		this.router.navigate([uuid]);
	}

	joinRoom() {
		const uuid = this.cleanString(this.us.genUUID());
		const remoteUuid = this.cleanString(this.uuidControl.value)
		this.wRTC.connect(uuid, remoteUuid);
		this.router.navigate([remoteUuid]);
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
