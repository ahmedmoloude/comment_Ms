const express = require('express');
const http = require('http');
const redis = require('redis');
// redis client

// Using to publish
const client = redis.createClient({
  socket: {
    host: '199.192.20.214',
    port: '6379',
  },
  password:
    '4D/HvxNPDcbAZuzAVJnGM9kVsZnZAtqOQtXUTXN0l6alhnMZQ8+MNxrreajUUsBmR05eKzVu0VAYcePI',
});
client.connect();
const subscriber = client.duplicate();

// To consume data

// To publish data
// client.publish('resources_update', 'Allah Mostaan');

const logger = require('morgan');
const socketio = require('socket.io');

const connection = require('./server/websocket/index');
const SocketEvents = require('./server/constants/SocketEvents');

const app = express();

app.get('/', (req, res) => {
  res.send('Publishing an Event using Redis');
});

// const port = process.env.PORT || "3000";
const port = '7500';
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

global.users = [];

global.io.on('connection', (socket) => connection(socket));

(async function () {
  try {
    await subscriber.connect();
    await subscriber.subscribe('resources_update', (message) => {
      global.io.emit(SocketEvents.JOIN_RESOURCES_UPDATE, message);
      //
    });
  } catch (err) {
    console.error('Rejection handled.');
  }
}());

server.listen(port, '0.0.0.0');

server.on('listening', () => {
  console.log(`Listening on porttttt:: http://0.0.0.:${port}/`);
});
