const path = require('path')
const express = require('express')
const app = express()
const socketio = require('socket.io')

const server = app.listen(9000, () => {
  console.log(`Listening on http://localhost:${server.address().port}`)
})

const io = socketio(server);

io.on('connection', socket => {
  console.log('A new client has connected!', socket.id)
  socket.on('changeTempo', data => {
    socket.broadcast.emit('changeTempo', data)
  })  
  socket.on('leadSeq', data => {
    socket.broadcast.emit('leadSeq', data)
  })
  socket.on('bassSeq', data => {
    socket.broadcast.emit('bassSeq', data)
  })
  socket.on('drumSeq', data => {
    socket.broadcast.emit('drumSeq', data)
  })
  socket.on('selectLead', data => {
    socket.broadcast.emit('selectLead', data)
  })
  socket.on('selectBass', data => {
    socket.broadcast.emit('selectBass', data)
  }) 
  socket.on('selectCymbal', data => {
    socket.broadcast.emit('selectCymbal', data)
  })
  socket.on('selectClap', data => {
    socket.broadcast.emit('selectClap', data)
  })
  socket.on('selectShaker', data => {
    socket.broadcast.emit('selectShaker', data)
  })
  socket.on('selectOpenHat', data => {
    socket.broadcast.emit('selectOpenHat', data)
  })
  socket.on('selectClosedHat', data => {
    socket.broadcast.emit('selectClosedHat', data)
  })
  socket.on('selectPerc', data => {
    socket.broadcast.emit('selectPerc', data)
  })
  socket.on('selectSnare', data => {
    socket.broadcast.emit('selectSnare', data)
  })
  socket.on('selectKick', data => {
    socket.broadcast.emit('selectKick', data)
  }) 
  socket.on('nx', data => {
    socket.broadcast.emit('nx', data)
  });
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});


