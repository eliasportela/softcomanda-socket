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
const e1 = io.of('/chocoburguerluluwjbaw3ron5psf4'); //Chocoburguer
const e2 = io.of('/pointdoacailuluwjbaw3ron5psf4'); //Point do acai
const e3 = io.of('/theminasbariluluwjbaw3ron5psf4'); //TheMinas
const e4 = io.of('/lanobigodeiluluwjbaw3ron5psf4'); //Lanobigode
const e5 = io.of('/donisguaxupeiluluwjbaw3ron5psf4'); //Donis Guaxupe

setConection(e1);
setConection(e2);
setConection(e3);
setConection(e4);
setConection(e5);

/*
new_order => novo pedido
new_menu => nova comanda
order_finished => pedido finalizado
print_order => Imprimir pedido
connect_printer => Status impressora
message => Imprimir pedido

#delivery
delivery_order => Novo pedido delivery
*/

function setConection(con) {
  con.on('connection', function (socket) {

    socket.on('new_order', function(data) { con.emit('new_order', {data: data}); });
    socket.on('new_menu', function(data) { con.emit('new_menu', {data: data}); });
    socket.on('order_finished', function(data) { con.emit('order_finished', {data: data}); });
    socket.on('print_order', function(data) { con.emit('print_order', data); });
    socket.on('connect_printer', function(data) { con.emit('connect_printer', data); });
    socket.on('message', function(data) { con.emit('message', {data: data}); });

    socket.on('delivery_order', function(data) { con.emit('delivery_order', {data: data}); });
    socket.on('delivery_status', function(data) { delivery.emit('delivery_status', {data: data}); });
    socket.on('notification', function(data) { con.emit('notification', {data: data}); });

  });
}

delivery.on('connection', function (socket) {

  socket.on('delivery_status', function(data) {
    delivery.emit('delivery_status', {data: data});
  });

  socket.on('delivery_order', function(data) {
    switch(data.token) {
      case 'chocoburguerluluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e1.emit('delivery_order', {data: data});
        break;

      case 'pointdoacailuluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e2.emit('delivery_order', {data: data});
        break;

      case 'theminasbariluluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e3.emit('delivery_order', {data: data});
        break;

      case 'lanobigodeiluluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e4.emit('delivery_order', {data: data});
        break;

      case 'donisguaxupeiluluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e5.emit('delivery_order', {data: data});
        break;
    }
  });

  socket.on('notification', function(data) {
    switch(data.token) {
      case 'chocoburguerluluwjbaw3ron5psf4':
        e1.emit('notification', {data: data});
        break;

      case 'pointdoacailuluwjbaw3ron5psf4':
        e2.emit('notification', {data: data});
        break;

      case 'theminasbariluluwjbaw3ron5psf4':
        e3.emit('notification', {data: data});
        break;

      case 'lanobigodeiluluwjbaw3ron5psf4':
        e4.emit('notification', {data: data});
        break;

      case 'donisguaxupeiluluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e5.emit('notification', {data: data});
        break;
    }
  });
});
