import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { MidiObject } from '../models/midi-data';
import { AudioOutputService } from './audio-output.service';
import { UserService } from './user.service';

// adapted from https://github.com/ullalaaron/angular-peerjs/blob/main/src/app/call.service.ts

@Injectable({
	providedIn: 'root'
})
export class WebRTCService {
	private peer: Peer;
	private conn: Peer.DataConnection;

	private _fromRemoteStream$ = new BehaviorSubject<MidiObject>(null);
	fromRemoteStream$ = this._fromRemoteStream$.asObservable();

	private _isCallStarted$ = new BehaviorSubject<boolean>(false);
	isCallStarted$ = this._isCallStarted$.asObservable();

	constructor(
		private audioService: AudioOutputService,
		private userService: UserService,
		private snackBar: MatSnackBar
	) {}

	initPeer() {
		if (!this.peer || this.peer.disconnected) {
			const peerJsOptions: Peer.PeerJSOption = {
				debug: 3,
				config: {
					iceServers: [
						{
							urls: [
								'stun:stun1.l.google.com:19302',
								'stun:stun2.l.google.com:19302'
							]
						}
					]
				}
				/** For custom server */
				// host: location.hostname,
				// port: +location.port || (location.protocol === 'https:' ? 443 : 80),
				// path: '/peerjs'
			};
			try {
				const uuid = this.userService.genUUID();
				this.peer = new Peer(uuid, peerJsOptions);
			} catch (error) {
				console.error(error);
			}
		}
	}

	listAllPeers(): Observable<string[]> {
		if (!this.peer) {
			return throwError(new ReferenceError('connection not established'));
		}
		return new Observable(subscriber => {
			this.peer.listAllPeers(peers => {
				console.log(peers);
				subscriber.next(peers);
				subscriber.complete();
			});
			return subscriber;
		});
	}

	send(data: MidiObject) {
		if (!this.conn) {
			return throwError(new ReferenceError('connection not established'));
		}
		this.conn.send(data);
	}

	/**
	 * Called by the user initializing a room
	 */
	startConnection() {
		try {
			this.peer.on('connection', (call: Peer.DataConnection) => {
				console.log('connection established')
				this.conn = call;
				this._isCallStarted$.next(true);

				this.conn.on('data', (remoteStream: MidiObject) => {
					this._fromRemoteStream$.next(remoteStream);
				});
				this.conn.on('error', err => {
					this.snackBar.open(err, 'Close');
					this._isCallStarted$.next(false);
					console.error(err);
				});
				this.conn.on('close', () => this.closecall());
			});
		} catch (err) {
			console.error(err);
			this.snackBar.open(err, 'Close');
			this._isCallStarted$.next(false);
		}
	}

	/**
	 * Called by the joining user
	 */
	connectToUser(remoteUserId: string) {
		try {
			this.conn = this.peer.connect(remoteUserId);
			if (!this.conn) {
				let errorMessage = 'Unable to connect to remote peer';
				this.snackBar.open(errorMessage, 'Close');
				throw new Error(errorMessage);
			}

			this._isCallStarted$.next(true);

			this.conn.on('error', err => {
				this.snackBar.open(err, 'Close');
				this._isCallStarted$.next(false);
				console.error(err);
			});
		} catch (err) {
			console.error(err);
			this.snackBar.open(err, 'Close');
			this._isCallStarted$.next(false);
		}
	}

	// remove user from room
	destroyPeer() {
		this.audioService.stopAudioContext();
		this.conn?.close();
		this.peer?.disconnect();
		this.peer?.destroy();
	}

	// end room
	closeMediaCall() {
		this.conn ? this.conn.close() : this.closecall();
		this._isCallStarted$.next(false);
	}

	private closecall() {
		this.audioService.stopAudioContext();
		this.snackBar.open('Call Ended', 'Close');
	}
}
