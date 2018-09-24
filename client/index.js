export const socket = io(window.location.origin);
const canvas = document.createElement('canvas')
import synths from './synth'
// import nx from 'nexusui'
import Nexus from 'nexusui'
import Tone from 'tone'

var leadSeq = new Nexus.Sequencer('#lead-seq',{
 'size': [400,200],
 'mode': 'toggle',
 'rows': 8,
 'columns': 8
})

var bassSeq = new Nexus.Sequencer('#bass-seq',{
 'size': [400,200],
 'mode': 'toggle',
 'rows': 8,
 'columns': 8
})

var drumSeq = new Nexus.Sequencer('#drum-seq',{
 'size': [800,200],
 'mode': 'toggle',
 'rows': 8,
 'columns': 16
})

const triggerNote = note => {
  synths[0].triggerAttackRelease(note, '32n')
}

const setup = () => {
  document.body.appendChild(canvas)
  setupSequencer()
  // nx.onload()
}

leadSeq.on('step', notes => {
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


bassSeq.on('step', notes => {
  if(notes[7]) {
    triggerNote('C3')
    socket.emit('nx', notes)
  }
  if(notes[6]) {
    triggerNote('B2')
    socket.emit('nx', notes)   
  }
  if(notes[5]) {
    triggerNote('A2')
    socket.emit('nx', notes)   
  }
  if(notes[4]) {
    triggerNote('G2')
    socket.emit('nx', notes)   
  }
  if(notes[3]) {
    triggerNote('F2')
    socket.emit('nx', notes)   
  }
  if(notes[2]) {
    triggerNote('E2')
    socket.emit('nx', notes)   
  }
  if(notes[1]) {
    triggerNote('D2')
    socket.emit('nx', notes)   
  }
  if(notes[0]) {
    triggerNote('C2')
    socket.emit('nx', notes)
  } 
})

const setupSequencer = () => {
  leadSeq.start(100)
  bassSeq.start(100)
  drumSeq.start(100)
}

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('nx', (data) => {
  console.log('DATA:  ', data)
})

// nx.onload = function() {
//  nx.sendTo('node')
// }

document.addEventListener('DOMContentLoaded', setup)