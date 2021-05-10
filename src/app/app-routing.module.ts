import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchingComponent } from './views/matching/matching.component';
import { RoomComponent } from './views/room/room.component';

const routes: Routes = [
	{
		path: 'join',
		component: MatchingComponent
	},
	{
		path: '',
		redirectTo: "join",
		pathMatch: 'full'
	},
	{
		path: '**',
		component: RoomComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
