// import sequencer from './sequencer'
const jamCanvas = document.createElement('jamCanvas')
const socket = io(window.location.origin);
import synths from './synth'
import Nexus from 'nexusui'
import nx from 'nexusui'
console.log('NX:  ', nx)
import Tone from 'tone'

const setup = () => {
  document.body.appendChild(jamCanvas)
}

const triggerNote = note => {
  synths[0].triggerAttackRelease(note, '16n')
}

const sequencer = new Nexus.Sequencer('#synth-sequencer', {
  'size': [400,400],
  'mode': 'toggle',
  'rows': 8,
  'columns': 8
})

sequencer.on('step', note => {
  if(note[7]) {
    triggerNote('C5')
    socket.emit('nx', 'C5')
  }
  if(note[6]) {
    triggerNote('B4')
    socket.emit('nx', 'B4')   
  }
  if(note[5]) {
    triggerNote('A4')
    socket.emit('nx', 'A4')   
  }
  if(note[4]) {
    triggerNote('G4')
    socket.emit('nx', 'G4')   
  }
  if(note[3]) {
    triggerNote('F4')
    socket.emit('nx', 'F4')   
  }
  if(note[2]) {
    triggerNote('E4')
    socket.emit('nx', 'E4')   
  }
  if(note[1]) {
    triggerNote('D4')
    socket.emit('nx', 'D4')   
  }
  if(note[0]) {
    triggerNote('C4')
    socket.emit('nx', 'C4')
  }
})

sequencer.start(100)

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('noteState', (payload) => {
  noteOn = payload
})

nx.onload = (...payload) => {
  console.log('TEST****')
   nx.sendsTo("node", ...payload)
}

document.addEventListener('DOMContentLoaded', setup)
