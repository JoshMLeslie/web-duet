import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {
	user$ = this.us.uuid$;

  constructor(private us: UserService) { }

  ngOnInit(): void {
  }

}
