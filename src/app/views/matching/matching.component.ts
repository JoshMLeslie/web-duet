import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebRTCService } from 'src/app/services/web-rtc.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
	selector: 'app-matching',
	templateUrl: './matching.component.html',
	styleUrls: ['./matching.component.less']
})
export class MatchingComponent implements OnInit {
	roomUUID: string;
	roomUUIDControl = new FormControl(null, Validators.required);

	constructor(
		private wss: WebsocketService,
		private router: Router,
		private us: UserService,
		private wRTC: WebRTCService
	) { }

	ngOnInit(): void {
		// this.roomUUID = this.wss.room.newUUID();
	}

	createRoom() {
		this.wRTC.startConnection();
		this.router.navigate([this.us.getUUID()]);
	}

	enterRoom() {
		// const roomUUID = (
		// 	this.roomUUIDControl.value || this.roomUUID
		// ).replace(/\s/g, '-');
		// this.wss.room.create(roomUUID);
		const joinUserUUID = (
			this.roomUUIDControl.value || this.roomUUID
		).replace(/\s/g, '-');
		this.wRTC.connectToUser(joinUserUUID)
		this.router.navigate([joinUserUUID]);
	}
}
