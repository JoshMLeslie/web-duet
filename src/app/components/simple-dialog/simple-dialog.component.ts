import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
		title: string;
		body: string;
		buttons: {
			onClose: string | number | boolean;
			text: string;
		}[]
	}) {}
}
