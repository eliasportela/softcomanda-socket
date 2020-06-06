const socket = require( 'socket.io' );
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = socket.listen( server );

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

const suporte = io.of('/suporte'); //LeCard Suporte
const delivery = io.of('/delivery'); //LeCard Delivery
const ioempresas = io.of('/empresas'); //LeCard empresas


/*
#print_order => Imprimir pedido
#delivery_order => Novo pedido delivery
#delivery_status => Troca de status (preprando / enviado entrega / finalizado)
#notification  => Som das notifcacoes no Gestor (play / pause)
*/

ioempresas.on('connection', function (socket) {

  socket.on('connect', function(socket) {
    console.log('Eliiias', socket);
  });

  socket.on('print_order', function(data) { ioempresas.emit('print_order', data); });
  socket.on('delivery_order', function(data) { ioempresas.emit('delivery_order', {data: data}); });
  socket.on('delivery_status', function(data) { delivery.emit('delivery_status', {data: data}); });
  socket.on('notification', function(data) { ioempresas.emit('notification', {data: data}); });
});

delivery.on('connection', function (socket) {

  socket.on('connect', function(socket) {
    console.log('conectou', socket);
  });

  socket.on('delivery_status', function(data) {
    delivery.emit('delivery_status', {data: data});
  });

  socket.on('delivery_order', function(data) {
    // data.token
    ioempresas.emit('delivery_order', {data: data});
    suporte.emit('delivery_order', {data: data});
  });

});

app.get('/hello', function(req, res) {
  res.send('hello world');
});

app.get('/hello', function(req, res) {
  res.send('hello world');
});