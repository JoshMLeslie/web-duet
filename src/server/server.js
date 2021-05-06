// AWS WS Article - https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

const UUID = require('uuid');
const WebSocket = require('ws');
const { RoomUtil } = require('./room-util');

const port = 8080;
const wss = new WebSocket.Server({ port }, () => console.log('server started'));

const rooms = new Map();
const users = new Map();

wss.on('connection', ws => {
	ws.on('message', message => {
		console.log('incoming', message);
		let messageJSON;
		if (typeof message === 'string') {
			try {
				messageJSON = JSON.parse(message);
			} catch {
				throw new ReferenceError('Malformed request', message);
			}
		}

		if (messageJSON) {
			const { action, requester, data } = messageJSON;
			let roomUUID, userUUID;
			if (data) {
				roomUUID = data.roomUUID;
				userUUID = data.userUUID;
			}
			let resData;
			switch (requester) {
				case 'room':
					resData = RoomUtil[action](rooms, roomUUID, userUUID);
					break;
				case 'user':
					userUUID = userUUID || UUID.v4();
					switch (action) {
						case 'getId':
							users.set(userUUID, new Date().toISOString());
							console.log('added new user:', userUUID);
							resData = userUUID;
							break;
						case 'logout':
							users.delete(userUUID);
							console.log('logged out user:', userUUID);
							resData = true;
							break;
					}
					console.log('current user size:', users.size);
					break;
			}
			console.log('response', requester, action, resData);
			ws.send(
				JSON.stringify({
					action,
					data: resData
				})
			);
		}

		/** Send to all clients */
		// wss.clients.forEach(client => {
		//   if (client !== ws && client.readyState === WebSocket.OPEN) {
		//     client.send(message);
		//   }
		// })
	});
});
