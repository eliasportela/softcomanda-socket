const socket = require( 'socket.io' );
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = socket.listen( server );

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

const bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

const suport = io.of('/suport');
const delivery = io.of('/delivery');
const ioempresas = io.of('/empresas');

ioempresas.on('connection', function (socket) {

  socket.on('empresa_connected', function(token) {
    console.log('Empresa conectada: ' + token)
    socket.join(token);
  });

});

delivery.on('connection', function (socket) {

  socket.on('delivery_connected', (token) => {
    console.log('Cliente conectado: ' + token)
    socket.join(token);
  });

});

app.post('/api/new-order', function(req, res) {
  const { socket_id, play, cancel } = req.body
  console.log(req.body)
  if (socket_id && play !== undefined) {
    ioempresas.in(socket_id).emit('delivery_order');
    ioempresas.in(socket_id).emit('notification', {play: play});
  }

  if (play && !cancel) {
    suport.emit('delivery_order');

  } else if (cancel) {
    suport.emit('canceled_order')
  }

  console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});

app.post('/api/change-status', function(req, res) {
  const {socket_id, status} = req.body
  if (socket_id) {
    delivery.in(socket_id).emit('delivery_status');
  }

  if (status == 2) {
    suport.emit('confirmed_order');
  }

  console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});
