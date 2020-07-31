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
    socket.join(token);
  });

  socket.on('delivery_status', function(token) {
    delivery.in(token).emit('delivery_status');
  });

});

delivery.on('connection', function (socket) {

  socket.on('delivery_connected', (token) => {
    socket.join(token);
  })

});

app.get('/send-empresa', function(req, res) {
  ioempresas.in('gaucholuluwjbaw3ron5psf4').emit('new_order', 'what is going on, party people?');
  res.send('Send Order');
});

app.get('/send-delivery', function(req, res) {
  delivery.emit('delivery_status', '15mbfqfluwjbaw3ron5psf2cqt');
  res.send('Send Delivery');
});
