import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit, OnDestroy {
	loading = true;
	roomPath: string;

	destroy$ = new Subject();

	constructor(
		private wss: WebsocketService,
		private activatedRoute: ActivatedRoute
	) {
		this.wss.ready$.pipe(takeUntil(this.destroy$)).subscribe(isReady => {
			if (isReady) {
				this.init();
			}
		});
	}

	ngOnInit(): void {
		this.roomPath = this.activatedRoute.snapshot.url[0].path;
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	init() {
		this.loading = false;
	}
}
