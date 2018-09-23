const path = require('path')
const express = require('express')
const app = express()
const socketio = require('socket.io');
let note = null
let noteOn = {
  C5: false,
  B4: false,
  A4: false,
  G4: false,
  F4: false,
  E4: false,
  D4: false,
  C4: false
}

const server = app.listen(4000, () => {
  console.log(`Listening on http://localhost:${server.address().port}`)
})

const io = socketio(server);

io.on('connection', function (socket) {
  console.log('A new client has connected!');
  console.log(socket.id);
  socket.emit('currentNoteState', noteOn)
  socket.on('selectStep', (...payload) => {
    note = payload[0]
    noteOn = payload[1]
  	console.log('SERVER SIDE SELECT STEP *****', ...payload)
  	socket.broadcast.emit('selectStep', ...payload)
  })
  socket.on('disconnect', () => {
  	console.log('user disconnected')
  })
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

