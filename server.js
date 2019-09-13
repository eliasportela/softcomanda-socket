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
var e3 = io.of('/3'); //Donnis Pizzaria (Temporario)
var e4 = io.of('/tiophilluwjbaw3ron5psf2qr2'); //Tio Phill

setConection(e1);
setConection(e2);
setConection(e3);
setConection(e4);

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

    });
}

delivery.on('connection', function (socket) {

    socket.on('delivery_status', function(data) {
        delivery.emit('delivery_status', {data: data});
    });

    socket.on('delivery_order', function(data) {
        
        switch(data.token) {
            case 'mbfqfluwjbaw3ron5psf2cqt':
                e1.emit('delivery_order', {data: data}); 
                break;
            
            case 'mbfqfluwjbaw3ron5psf2cqr':
                e2.emit('delivery_order', {data: data});        
                break;
            
            case 'tiophilluwjbaw3ron5psf2qr2':
                e4.emit('delivery_order', {data: data});        
                break;
        }
    });

});