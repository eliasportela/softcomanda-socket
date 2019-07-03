var socket = require( 'socket.io' );
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = socket.listen( server );

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var e1 = io.of('/1');
e1.on('connection', function (socket) {
    
    //novo pedido
    socket.on('new_order', function(data) {
        e1.emit('new_order', {
            data: data
        });
    });
    
    //nova comanda
    socket.on('new_menu', function(data) {
        e1.emit('new_menu', {
            data: data
        });
    });

    //pedido finalizado
    socket.on('order_finished', function(data) {
        e1.emit('order_finished', {
            data: data
        });
    });
	
    //Imprimir pedido
    socket.on('print_order', function(data) {
        e1.emit('print_order', data);
    });
	
    //Status impressora
    socket.on('connect_printer', function(data) {
        e1.emit('connect_printer', data);
    });
	
    //Imprimir pedido
    socket.on('message', function(data) {
        e1.emit('message', {
            data: data
        });
    });
    
});

var e2 = io.of('/2');
e2.on('connection', function (socket) {
    
    //novo pedido
    socket.on('new_order', function(data) {
        e2.emit('new_order', {
            data: data
        });
    });
    
    //nova comanda
    socket.on('new_menu', function(data) {
        e2.emit('new_menu', {
            data: data
        });
    });

    //pedido finalizado
    socket.on('order_finished', function(data) {
        e2.emit('order_finished', {
            data: data
        });
    });
    
    //Imprimir pedido
    socket.on('print_order', function(data) {
        e2.emit('print_order', data);
    });
    
    //Status impressora
    socket.on('connect_printer', function(data) {
        e2.emit('connect_printer', data);
    });
    
    //Imprimir pedido
    socket.on('message', function(data) {
        e2.emit('message', {
            data: data
        });
    });
    
});

var e3 = io.of('/3');
e2.on('connection', function (socket) {
    
    //novo pedido
    socket.on('new_order', function(data) {
        e3.emit('new_order', {
            data: data
        });
    });
    
    //nova comanda
    socket.on('new_menu', function(data) {
        e3.emit('new_menu', {
            data: data
        });
    });

    //pedido finalizado
    socket.on('order_finished', function(data) {
        e3.emit('order_finished', {
            data: data
        });
    });
    
    //Imprimir pedido
    socket.on('print_order', function(data) {
        e3.emit('print_order', data);
    });
    
    //Status impressora
    socket.on('connect_printer', function(data) {
        e3.emit('connect_printer', data);
    });
    
    //Imprimir pedido
    socket.on('message', function(data) {
        e3.emit('message', {
            data: data
        });
    });
    
});
