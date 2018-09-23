const socket = io(window.location.origin);
const jamCanvas = document.createElement('jamCanvas')
import synths from './synth'
import nx from 'nexusui'
import Tone from 'tone'
const sequencer = nx.add('sequencer')
sequencer.size = [400,400]
sequencer.mode = 'toggle'
sequencer.rows = 8
sequencer.columns = 8

const triggerNote = note => {
  synths[0].triggerAttackRelease(note, '32n')
}

const setup = () => {
  document.body.appendChild(jamCanvas)
  setupSequencer()
}

sequencer.on('step', notes => {
  if(notes[7]) {
    triggerNote('C5')
    socket.emit('nx', notes)
  }
  if(notes[6]) {
    triggerNote('B4')
    socket.emit('nx', notes)   
  }
  if(notes[5]) {
    triggerNote('A4')
    socket.emit('nx', notes)   
  }
  if(notes[4]) {
    triggerNote('G4')
    socket.emit('nx', notes)   
  }
  if(notes[3]) {
    triggerNote('F4')
    socket.emit('nx', notes)   
  }
  if(notes[2]) {
    triggerNote('E4')
    socket.emit('nx', notes)   
  }
  if(notes[1]) {
    triggerNote('D4')
    socket.emit('nx', notes)   
  }
  if(notes[0]) {
    triggerNote('C4')
    socket.emit('nx', notes)
  } 
})

const setupSequencer = () => {
  sequencer.start(100)
}

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('nx', (data) => {
  console.log('DATA:  ', data)
})


nx.onload = () => {
  // console.log('PAYLOAD:  ')
  console.log('TEST****')
  nx.sendsTo("node")
}



document.addEventListener('DOMContentLoaded', setup)