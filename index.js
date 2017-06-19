//modules
const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('[SERVER]Listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var numUsers = 0;

io.on('connection', (socket) => {
  var addedUser = false;
  numUsers++;
  console.log('[SERVER] A user connected: ' + numUsers);

  io.emit('user joined', {
    data: numUsers
  });

  socket.emit('user joined', {
    data: numUsers
  });

  // disconnect event
  socket.on('disconnect', () => {
      --numUsers;
      console.log('[SERVER] A user disconnected: ' + numUsers);
      // globally echo that user has disconnected
      io.emit('user left', {
        data: numUsers
      });
  });

  // on new message, broadcast
  socket.on('send-msg', (data) => {

    fs.appendFile('message_log.json', '{"message": "' + data.message.trim() + '"},', (err) => {
      if (err) console.log(err);
    });

    io.emit('new message', {
      'username': data.userName,
      'message': data.message,
      'desc': data.userDesc
    });
  });

  // when the client emits 'add user', this listens and executes

});
