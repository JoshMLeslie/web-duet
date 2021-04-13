// AWS WS Article - https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

const UUID = require('uuid');
const WebSocket = require('ws');
const RoomUtil = require('./room-util');

const uuid = UUID.v4();
const port = 8080;
const wss = new WebSocket.Server({ port }, () => console.log('server started'));

const rooms = new Map();

wss.on('connection', ws => {
	ws.on('message', message => {
		if (typeof message === 'string') {
			try {
				message = JSON.parse(message);
			} catch {}
		}

		if (message && message.roomAction && message.roomUUID) {
			const { roomAction, roomUUID } = message;
			RoomUtil[roomAction](rooms, roomUUID, uuid);
			console.log(rooms);
		} else if (message && (!message.roomAction || !message.roomUUID)) {
			throw new ReferenceError('Malformed request. Attribute missing');
		}

		/** Send to all clients */
		// wss.clients.forEach(client => {
		//   if (client !== ws && client.readyState === WebSocket.OPEN) {
		//     client.send(message);
		//   }
		// })
	});
});
