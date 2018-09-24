const path = require('path')
const express = require('express')
const app = express()
const socketio = require('socket.io')

const server = app.listen(4000, () => {
  console.log(`Listening on http://localhost:${server.address().port}`)
})

const io = socketio(server);

io.on('connection', function (socket) {
  console.log('A new client has connected!');
  console.log(socket.id);

  socket.on('nx', function (data) {
    console.log('DATA:  ', data)
    socket.broadcast.emit('nx', data)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});


