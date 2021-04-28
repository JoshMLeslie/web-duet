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
		console.log('server - incoming', message)
		if (typeof message === 'string') {
			try {
				message = JSON.parse(message);
			} catch {
				throw new ReferenceError('Malformed request', message);
			}
		}

		if (message) {
			const { action, requester, roomUUID } = message;
			let { userUUID } = message
			switch(requester) {
				case 'room':
					const data = RoomUtil[action](rooms, roomUUID);
					ws.send(JSON.stringify({
						action,
						data
					}));
					break;
				case 'user':
					userUUID = userUUID || UUID.v4();
					switch(action) {
						case 'getUserId':
							users.set(userUUID, null);
							ws.send(JSON.stringify({
								action,
								data: userUUID
							}));
							break;
					}
					break;
			}
		}
		

		/** Send to all clients */
		// wss.clients.forEach(client => {
		//   if (client !== ws && client.readyState === WebSocket.OPEN) {
		//     client.send(message);
		//   }
		// })
	});
});
