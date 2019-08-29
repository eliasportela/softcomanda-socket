var socket = require( 'socket.io' );
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = socket.listen( server );

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var delivery = io.of('/delivery'); //LeCard Delivery
var e1 = io.of('/mbfqfluwjbaw3ron5psf2cqt'); //Homologacao
var e2 = io.of('/mbfqfluwjbaw3ron5psf2cqr'); //Donnis Pizzaria

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

e1.on('connection', function (socket) {

    socket.on('new_order', function(data) { e1.emit('new_order', {data: data}); });
    socket.on('new_menu', function(data) { e1.emit('new_menu', {data: data}); });
    socket.on('order_finished', function(data) { e1.emit('order_finished', {data: data}); });
    socket.on('print_order', function(data) { e1.emit('print_order', data); });
    socket.on('connect_printer', function(data) { e1.emit('connect_printer', data); });
    socket.on('message', function(data) { e1.emit('message', {data: data}); });

    socket.on('delivery_order', function(data) { e1.emit('delivery_order', {data: data}); });
    socket.on('delivery_status', function(data) { delivery.emit('delivery_status', {data: data}); });

});

e2.on('connection', function (socket) {

    socket.on('new_order', function(data) { e2.emit('new_order', {data: data}); });
    socket.on('new_menu', function(data) { e2.emit('new_menu', {data: data}); });
    socket.on('order_finished', function(data) { e2.emit('order_finished', {data: data}); });
    socket.on('print_order', function(data) { e2.emit('print_order', data); });
    socket.on('connect_printer', function(data) { e2.emit('connect_printer', data); });
    socket.on('message', function(data) { e2.emit('message', {data: data}); });

    socket.on('delivery_order', function(data) { e2.emit('delivery_order', {data: data}); });
    socket.on('delivery_status', function(data) { delivery.emit('delivery_status', {data: data}); });

});

delivery.on('connection', function (socket) {

    socket.on('delivery_status', function(data) {
        delivery.emit('delivery_status', {data: data});
    });

    socket.on('delivery_order', function(data) {
        //console.log("Elias");
        e1.emit('delivery_order', {data: data});
        e2.emit('delivery_order', {data: data});
    });

});