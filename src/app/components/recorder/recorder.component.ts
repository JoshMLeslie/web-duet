import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.less']
})
export class RecorderComponent implements OnInit {
	startTime: ReturnType<Date['getTime']>;
	endTime: ReturnType<Date['getTime']>;

  constructor() { }

  ngOnInit(): void {
  }

	startRecording() {
		this.startTime = new Date().getTime();
	}

	endRecording() {
		this.endTime = new Date().getTime();
	}
}
