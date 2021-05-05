// AWS WS Article - https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

const UUID = require('uuid');
const WebSocket = require('ws');
const RoomUtil = require('./room-util');

const port = 8080;
const wss = new WebSocket.Server({ port }, () => console.log('server started'));

const rooms = new Map();
const users = new Map();

wss.on('connection', ws => {
	ws.on('message', message => {
		console.log('incoming', message);
		if (typeof message === 'string') {
			try {
				message = JSON.parse(message);
			} catch {
				throw new ReferenceError('Malformed request', message);
			}
		}

		if (message) {
			const { action, requester, roomUUID } = message;
			let { userUUID } = message;
			let data;
			switch (requester) {
				case 'room':
					data = RoomUtil[action](rooms, roomUUID, userUUID);
					break;
				case 'user':
					userUUID = userUUID || UUID.v4();
					switch (action) {
						case 'getUserId':
							users.set(userUUID, null);
							data = userUUID;
							break;
					}
					break;
			}
			console.log('response', requester, action, data);
			ws.send(
				JSON.stringify({
					action,
					data
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
