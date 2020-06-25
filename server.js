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
const e1 = io.of('/mbfqfluwjbaw3ron5psf2cqt'); //Homologacao
const e2 = io.of('/mbfqfluwjbaw3ron5psf2cqr'); //Donnis Pizzaria
const e3 = io.of('/tiophilluwjbaw3ron5psf2qr2'); //Tio Phill
const e4 = io.of('/tatululuwjbaw3ron5psf2qr3'); //Tatu
const e5 = io.of('/sacolaoluluwjbaw3ron5psf4'); //sacolao

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
      case 'mbfqfluwjbaw3ron5psf2cqt':
        suporte.emit('delivery_order', {data: data});
        e1.emit('delivery_order', {data: data});
        break;

      case 'mbfqfluwjbaw3ron5psf2cqr':
        suporte.emit('delivery_order', {data: data});
        e2.emit('delivery_order', {data: data});
        break;

      case 'tiophilluwjbaw3ron5psf2qr2':
        suporte.emit('delivery_order', {data: data});
        e3.emit('delivery_order', {data: data});
        break;

      case 'tatululuwjbaw3ron5psf2qr3':
        suporte.emit('delivery_order', {data: data});
        e4.emit('delivery_order', {data: data});
        break;

      case 'sacolaoluluwjbaw3ron5psf4':
        suporte.emit('delivery_order', {data: data});
        e5.emit('delivery_order', {data: data});
        break;
    }
  });

  socket.on('notification', function(data) {
    switch(data.token) {
      case 'mbfqfluwjbaw3ron5psf2cqt':
        e1.emit('notification', {data: data});
        break;

      case 'mbfqfluwjbaw3ron5psf2cqr':
        e2.emit('notification', {data: data});
        break;

      case 'tiophilluwjbaw3ron5psf2qr2':
        e3.emit('notification', {data: data});
        break;

      case 'tatululuwjbaw3ron5psf2qr3':
        e4.emit('notification', {data: data});
        break;

      case 'sacolaoluluwjbaw3ron5psf4':
        e5.emit('notification', {data: data});
        break;
    }
  });
});
