import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// adapted from https://github.com/ullalaaron/angular-peerjs/blob/main/src/app/call.service.ts

@Injectable({
	providedIn: 'root'
})
export class WebRTCService {
	private peer: Peer;
	private mediaCall: Peer.MediaConnection;

	private _localStream$: BehaviorSubject<MediaStream> = new BehaviorSubject(
		null
	);
	localStream$ = this._localStream$.asObservable();
	private _remoteStream$: BehaviorSubject<MediaStream> = new BehaviorSubject(
		null
	);
	remoteStream$ = this._remoteStream$.asObservable();

	private isCallStartedBs = new Subject<boolean>();
	isCallStarted$ = this.isCallStartedBs.asObservable();

	constructor(private snackBar: MatSnackBar) {}

	initPeer(): string {
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
			};
			try {
				const id = uuidv4();
				this.peer = new Peer(id, peerJsOptions);
				return id;
			} catch (error) {
				console.error(error);
			}
		}
	}

	/**
	 * Called by the user initializing a room
	 */
	async enableCallAnswer() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});
			this._localStream$.next(stream);
			this.peer.on('call', async call => {
				this.mediaCall = call;
				this.isCallStartedBs.next(true);

				this.mediaCall.answer(stream);
				this.mediaCall.on('data', remoteStream => {
					this._remoteStream$.next(remoteStream);
				});
				this.mediaCall.on('error', err => {
					this.snackBar.open(err, 'Close');
					this.isCallStartedBs.next(false);
					console.error(err);
				});
				this.mediaCall.on('close', () => this.onCallClose());
			});
		} catch (ex) {
			console.error(ex);
			this.snackBar.open(ex, 'Close');
			this.isCallStartedBs.next(false);
		}
	}

	/**
	 * Called by the user entering a room
	 */
	async establishMediaCall(remotePeerId: string) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});

			const connection = this.peer.connect(remotePeerId);
			connection.on('error', err => {
				console.error(err);
				this.snackBar.open(err, 'Close');
			});

			this.mediaCall = this.peer.call(remotePeerId, stream);
			if (!this.mediaCall) {
				let errorMessage = 'Unable to connect to remote peer';
				this.snackBar.open(errorMessage, 'Close');
				throw new Error(errorMessage);
			}
			this._localStream$.next(stream);
			this.isCallStartedBs.next(true);

			this.mediaCall.on('data', remoteStream => {
				this._remoteStream$.next(remoteStream);
			});
			this.mediaCall.on('error', err => {
				this.snackBar.open(err, 'Close');
				console.error(err);
				this.isCallStartedBs.next(false);
			});
			this.mediaCall.on('close', () => this.onCallClose());
		} catch (ex) {
			console.error(ex);
			this.snackBar.open(ex, 'Close');
			this.isCallStartedBs.next(false);
		}
	}

	private onCallClose() {
		this._remoteStream$?.value.getTracks().forEach(track => {
			track.stop();
		});
		this._localStream$?.value.getTracks().forEach(track => {
			track.stop();
		});
		this.snackBar.open('Call Ended', 'Close');
	}

	closeMediaCall() {
		this.mediaCall?.close();
		if (!this.mediaCall) {
			this.onCallClose();
		}
		this.isCallStartedBs.next(false);
	}

	destroyPeer() {
		this.mediaCall?.close();
		this.peer?.disconnect();
		this.peer?.destroy();
	}
}
