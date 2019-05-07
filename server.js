var socket = require( 'socket.io' );
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = socket.listen( server );
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
io.on('connection', function (socket) {
    
    //novo pedido
    socket.on('new_order', function(data) {
        io.sockets.emit('new_order', {
            data: data
        });
    });
    
    //nova comanda
    socket.on('new_menu', function(data) {
        io.sockets.emit('new_menu', {
            data: data
        });
    });

    //pedido finalizado
    socket.on('order_finished', function(data) {
        io.sockets.emit('order_finished', {
            data: data
        });
    });
    
});
