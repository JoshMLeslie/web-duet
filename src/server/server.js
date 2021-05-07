// AWS WS Article - https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/

const WebSocket = require('ws');
const { RoomUtil } = require('./util-room');
const { UserUtil } = require('./util-user');

const port = 8080;
const wss = new WebSocket.Server({ port }, () => console.log('server started'));

const rooms = new Map();
const users = new Map();

const send = (ws, payload) => {
	ws.send(JSON.stringify(payload))
}

const sendOthers = (ws, sendData, log = 'update') => {
	wss.clients.forEach(client => {
		if (client !== ws && client.readyState === WebSocket.OPEN) {
			console.log('notifing', client.userUUID, 'of', log)
			send(client, sendData)
		}
	});
	return;
}

wss.on('connection', ws => {
	ws.userUUID = UserUtil.newUser(users);
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

					if (resData === 'joined') {
						sendOthers(
							ws,
							{
								action: 'users',
								data: RoomUtil['users'](rooms, roomUUID, userUUID)
							},
							'new users'
						);
						return;
					}

					console.info('current rooms size:', rooms.size);
					break;
				case 'user':
					resData = UserUtil[action](users, userUUID, ws);
					console.info('current user size:', users.size);
					break;

				case 'keyboard':
					sendOthers(
						ws,
						{
							action: 'note',
							data
						},
						'new note'
					)
					return;
			}
			console.debug('response', requester, action, resData, '\n---\n');
			send(ws, {
				action,
				data: resData
			});
		}
	});
});
