// AWS WS Article - https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

const WebSocket = require('ws');
const { RoomUtil } = require('./util-room');
const { UserUtil } = require('./util-user');

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
					console.info('current rooms size:', rooms.size);
					break;
				case 'user':
					resData = UserUtil[action](users, userUUID);
					console.info('current user size:', users.size);
					break;
			}
			console.debug('response', requester, action, resData);
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
