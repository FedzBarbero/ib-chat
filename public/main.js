var socket = io('http://localhost:3000');

let msgNumber = 0;

function postMessage (data) {
  let username = data.username.trim();
  let message = data.message.trim();
  let desc = data.desc.trim().length > 0 ? ' (' + data.desc.trim() + ') ' :  '';

  msgNumber++;
  let numb = msgNumber % 2 == 0 ? "message-box1" : "message-box2";

  $('#messages').append('<li class="' + numb + ' card-panel blue lighten-1"><b class="username black-text">'+ username + desc  + '</b><p class="message">' + message + '</p></li><br>');
}

function online (data) {
  let message = data.data;

  $('#online-count').text('Online count: ' + message);
  $('#messages').append('<li class="log-box"><b>There are ' + message + ' people online!</b></li>');
}
$(document).ready(function() {

  $('#profile-settings').modal();
  $('#profile-settings').modal('open');

  $('#message').keyup(function(e){
    if (e.keyCode == 13) {
        let msg = $(this).val();
        let userName = $('#name-of-user').text();
        let userDesc = $('#description-of-user').text();

        let data = {
          'message': msg,
          'userName': userName,
          'userDesc': userDesc
        };

        socket.emit('send-msg', data);

        $(this).val('');
    }
  });

  socket.on('new message', (data) => {
    postMessage(data);
  });

  socket.on('user joined', (data) => {
    online(data);
  });

  socket.on('user left', (data) => {
    online(data);
  });

});
