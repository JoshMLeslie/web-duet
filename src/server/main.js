'use strict';
// External Libs
require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

// /
// -- web-duet
// -- -- server
// -- -- -- main.js
// -- -- buildfiles.123.js

// Local Libs
const { RoomUtil } = require('./util-room');
const { UserUtil } = require('./util-user');

// Server config
const port = process.env.PORT || 8080;
let wss;

if (process.env.LOCAL) {
  wss = new WebSocket.Server({ port }, () => console.info('server started'));
} else {
  const server = express();
  server.enable('trust proxy');
  wss = new WebSocket.Server({ server });

  server.use(express.static(path.resolve(__dirname, '../public')));
  server.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
  });

  server.listen(port);
}

// Local config
const rooms = new Map();
const users = new Map();

// ws utils
const send = (ws, payload) => {
  ws.send(JSON.stringify(payload));
};

const sendOthers = (ws, sendData, log = 'update') => {
  wss.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      console.log('notifing', client.userUUID, 'of', log);
      send(client, sendData);
    }
  });
};

// WS main
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

          switch (resData) {
            case 'joined':
            case 'departed':
              sendOthers(
                ws,
                {
                  action: 'users',
                  data: RoomUtil.users(rooms, roomUUID, userUUID)
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
          );
          return;
      }
      console.debug('response', requester, action, resData, '\n---\n');
      send(ws, {
        action,
        data: resData
      });
    }
  });
  console.log('todo - user cleanup on DC');
  ws.on('close', () => console.info(ws.userUUID, 'disconnected', '\n---\n'));
});
