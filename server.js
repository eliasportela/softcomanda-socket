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
    socket.join(token);
    suport.emit('empresas_online', Object.keys(ioempresas.adapter.rooms));
  });

  socket.on('notification', (data) => {
    if (data && data.token) {
      ioempresas.in(data.token).emit('notification', {
        ...data,
        play: !!data.play
      });
    }
  });

  socket.on('delivery_status', function(data) {
    const { socket_id, status } = data;

    if (socket_id) {
      delivery.in(socket_id).emit('delivery_status');
    }

    const statusPedido = parseInt(status);

    if (statusPedido === 2) {
      suport.emit('confirmed_order');

    } else if (statusPedido === 5) {
      suport.emit('canceled_order')
    }
  });

  socket.on('print', function(data) {
    const {token, content} = data;
    if (token && content) {
      ioempresas.in(token).emit('print', content);
    }
  });

  socket.on('comanda_order', function(data) {
    if (data) {
      const {token, content} = data;

      if (token) {
        socket.broadcast.to(token).emit('comanda_order', content);
      }
    }
  });

  socket.on('disconnect', function() {
    suport.emit('empresas_online', Object.keys(ioempresas.adapter.rooms));
  });

});

delivery.on('connection', function (socket) {

  socket.on('delivery_connected', (token) => {
    // console.log('Cliente conectado: ' + token)
    socket.join(token);
  });

});

suport.on('connection', function (socket) {
  socket.on('empresas_online', () => {
    suport.emit('empresas_online', Object.keys(ioempresas.adapter.rooms));
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
  const { socket_id, play, nome_fantasia, canceled, whatsapp } = req.body;

  if (socket_id && play !== undefined) {
    ioempresas.in(socket_id).emit('delivery_order');
    ioempresas.in(socket_id).emit('notification', { play, nome_fantasia });

    if (whatsapp) {
      ioempresas.in(socket_id).emit('delivery_whatsapp', whatsapp)
    }
  }

  if (play && !canceled) {
    suport.emit('delivery_order');

  } else if (canceled) {
    suport.emit('canceled_order')
  }

  res.json({success: true});
});

app.post('/api/notification', function(req, res) {
  const { token } = req.body;

  if (token) {
    ioempresas.in(token).emit('notification', req.body);
  }

  res.json({success: true});
});

app.post('/api/status-empresa', function(req, res) {
  const { socket_id } = req.body;

  if (socket_id) {
    ioempresas.in(socket_id).emit('status_empresa', req.body);
  }

  res.json({success: true});
});

app.post('/api/delivery-whatsapp', function(req, res) {
  const { socket_id, whatsapp } = req.body;

  if (socket_id && whatsapp) {
    ioempresas.in(socket_id).emit('delivery_whatsapp', whatsapp);
  }

  res.json({success: true});
});

app.post('/api/request-human', function(req, res) {
  const { socket_id, telefone } = req.body;

  if (socket_id) {
    ioempresas.in(socket_id).emit('request_human', { telefone });
  }

  res.json({success: true});
});

app.post('/api/new-chat', function(req, res) {
  const { socket_id, message } = req.body;

  if (socket_id) {
    ioempresas.in(socket_id).emit('new_chat', { message });
  }

  res.json({success: true});
});

app.get('/api/list-online', function(req, res) {
  res.json({empresas: Object.keys(ioempresas.adapter.rooms)});
});
