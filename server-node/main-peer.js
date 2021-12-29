var express = require('express'),
	app = express();

// … Configure Express, and register necessary route handlers

srv = app.listen(process.env.PORT);
app.use(
	'/peerjs',
	require('peer').ExpressPeerServer(srv, {
		debug: true
	})
);
