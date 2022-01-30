
const express = require('express');
const http = require('http');
const logger = require('morgan');
const socketio = require('socket.io');

const connection = require('./server/websocket/index')
const app = express();

const port = process.env.PORT || '3000';
app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('*', (req, res) => res.status(404).json({
  success: false,
  message: 'API endpoint doesnt exist',
}));

const server = http.createServer(app);

global.io = socketio(server);



global.users = []


global.io.on('connection', socket => connection(socket))

server.listen(port);


server.on('listening', () => {
  console.log(`Listening on porttttt:: http://localhost:${port}/`);
});
