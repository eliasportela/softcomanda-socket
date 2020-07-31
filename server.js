const socket = require( 'socket.io' );
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = socket.listen( server );

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

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

  socket.on('notification', function(token) {
    ioempresas.in(token).emit('notification');
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

app.get('/send-empresa', function(req, res) {
  ioempresas.in('mbfqfluwjbaw3ron5psf2cqt').emit('notification', {play: true});
  res.send('Send Order');
});

app.get('/send-delivery', function(req, res) {
  delivery.emit('delivery_status', '15mbfqfluwjbaw3ron5psf2cqt');
  res.send('Send Delivery');
});
