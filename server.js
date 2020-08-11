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

const delivery = io.of('/delivery');
const ioempresas = io.of('/empresas');

ioempresas.on('connection', function (socket) {

  socket.on('empresa_connected', function(token) {
    console.log(token)
    socket.join(token);
  });

  //PDV
  socket.on('new_order', function(token) {
    ioempresas.in(token).emit('new_order');
  });

  socket.on('new_menu', function(token) {
    ioempresas.in(token).emit('new_menu');
  });

  socket.on('order_finished', function(token) {
    ioempresas.in(token).emit('order_finished');
  });

  socket.on('print_order', function(data) {
    ioempresas.in(data.token).emit('print_order', data);
  });

  socket.on('connect_printer', function(token) {
    ioempresas.in(token).emit('connect_printer');
  });

  socket.on('message', function(token) {
    ioempresas.in(token).emit('message');
  });

  //Delivery
  socket.on('delivery_order', function(token) {
    ioempresas.in(token).emit('delivery_order');
  });

  socket.on('notification', function(data) {
    ioempresas.in(data.token).emit('notification', data);
  });

  socket.on('delivery_status', function(token) {
    delivery.in(token).emit('delivery_status');
  });

});

delivery.on('connection', function (socket) {

  socket.on('delivery_connected', (token) => {
    console.log(token)
    socket.join(token);
  });

  socket.on('delivery_order', function(token) {
    ioempresas.in(token).emit('delivery_order');
  });

  socket.on('notification', function(data) {
    ioempresas.in(data.token).emit('notification', data);
  });

});

app.post('/api/new-order', function(req, res) {
  const { socket_id, play } = req.body

  if (socket_id && play !== undefined) {
    ioempresas.in(socket_id).emit('delivery_order');
    ioempresas.in(socket_id).emit('notification', {play: play});
  }

  console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});

app.post('/api/change-status', function(req, res) {
  const {socket_id} = req.body
  if (socket_id) {
    delivery.in(socket_id).emit('delivery_status');
  }

  console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});
