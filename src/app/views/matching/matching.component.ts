import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

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
		this.roomUUID = this.wss.newRoomUUID();
  }

	enterRoom() {
		const roomUUID = (
			this.roomUUIDControl.value || this.roomUUID
		).replace(/\s/g, '-');
		this.wss.createRoom(roomUUID);
		this.router.navigate([roomUUID]);
	}
}
