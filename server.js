var socket = require( 'socket.io' );
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = socket.listen( server );

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// app.get('/class/:classID', function(req,res) {
//   className = req.params.classID;
//   nsp = io.of('/' + className)
//   res.sendFile(__dirname + '/index.html');

//   nsp.on('connection', function(socket) {
    
//     socket.on('new_order', function(data) {
//         e1.emit('new_order', {
//             data: data
//         });
//     });

//   });
// });

io.on('connection', function (socket) {
    
    //novo pedido
    socket.on('new_order', function(data) {
        io.sockets.emit('new_order', {
            data: data
        });
    });

	//nova comanda
    socket.on('new_menu', function(data) {
        io.emit('new_menu', {
            data: data
        });
    });

    //pedido finalizado
    socket.on('order_finished', function(data) {
        io.emit('order_finished', {
            data: data
        });
    });
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
        e1.emit('print_order', {
            data: data
        });
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
    
});
