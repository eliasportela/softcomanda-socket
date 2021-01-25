const socket = require( 'socket.io' );
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = socket.listen( server );

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

const bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

const suport = io.of('/suport');
const delivery = io.of('/delivery');
const ioempresas = io.of('/empresas');
const comanda = io.of('/comanda');

ioempresas.on('connection', function (socket) {

  socket.on('empresa_connected', function(token) {
    // console.log('Empresa conectada: ' + token)
    socket.join(token);
  });

  socket.on('notification', (data) => {
    ioempresas.in(data.token).emit('notification', {play: data.play});
  });

  socket.on('delivery_status', function(data) {
    const {socket_id, status} = data;

    if (socket_id) {
      delivery.in(socket_id).emit('delivery_status');
    }

    const statusPedido = parseInt(status);
    if (statusPedido == 2) {
      suport.emit('confirmed_order');

    } else if (statusPedido == 5) {
      suport.emit('canceled_order')
    }

    // console.log('Sockey send: ' + socket_id);
  });

});

delivery.on('connection', function (socket) {

  socket.on('delivery_connected', (token) => {
    // console.log('Cliente conectado: ' + token)
    socket.join(token);
  });

});

comanda.on('connection', function (socket) {

  socket.on('empresa_connected', function(token) {
    // console.log('Comanda conectada: ' + token)
    socket.join(token);
  });

  socket.on('print_order', function(data) {
    const {token} = data;
    socket.in(token).emit('print_order', data);
    ioempresas.in(token).emit('print_order', data);
  });
});

app.post('/api/new-order', function(req, res) {
  const { socket_id, play, nome_fantasia, canceled } = req.body

  if (socket_id && play !== undefined) {
    ioempresas.in(socket_id).emit('delivery_order');
    ioempresas.in(socket_id).emit('notification', { play, nome_fantasia });
  }

  if (play && !canceled) {
    suport.emit('delivery_order');

  } else if (canceled) {
    suport.emit('canceled_order')
  }

  // console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});

app.post('/api/change-status', function(req, res) {
  const {socket_id, status} = req.body
  if (socket_id) {
    delivery.in(socket_id).emit('delivery_status');
  }

  const statusPedido = parseInt(status);
  if (statusPedido === 2) {
    suport.emit('confirmed_order');

  } else if (statusPedido === 5) {
    suport.emit('canceled_order')
  }

  // console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});

app.post('/api/status-empresa', function(req, res) {
  const { socket_id, aberto } = req.body;

  if (socket_id) {
    ioempresas.in(socket_id).emit('status_empresa', { aberto });
  }

  // console.log('Sockey send: ' + socket_id);
  res.json({success: true});
});
