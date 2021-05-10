import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
		private us: UserService
	) { }

	ngOnInit(): void {
		this.roomUUID = this.wss.room.newUUID();
	}

	enterRoom() {
		const roomUUID = (
			this.roomUUIDControl.value || this.roomUUID
		).replace(/\s/g, '-');
		this.wss.room.create(roomUUID);
		this.router.navigate([roomUUID]);
	}
}
