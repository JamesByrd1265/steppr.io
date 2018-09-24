export const socket = io(window.location.origin);
const canvas = document.createElement('canvas')
import synths from './synths'
// import nx from 'nexusui'
import Nexus from 'nexusui'
import Tone from 'tone'

let sequencer = {'size': [600,300], 'mode': 'toggle', 'rows': 8, 'columns': 8}
let slider = {'size': [180,20], 'mode': 'relative', 'min': -80, 'max': 0, 'step': 0, 'value': -80}

const leadSeq = new Nexus.Sequencer('#lead-seq', sequencer)
const bassSeq = new Nexus.Sequencer('#bass-seq', sequencer)
const drumSeq = new Nexus.Sequencer('#drum-seq', {'size': [1245,300], 'mode': 'toggle', 'rows': 8, 'columns': 16})
const leadVol = new Nexus.Slider('#lead-vol', slider)
const bassVol = new Nexus.Slider('#bass-vol', slider)
const drumVol = new Nexus.Slider('#drum-vol', slider)
let synth = synths.fmSynth
synth.volume.value = -80

const triggerNote = note => {
  synth.triggerAttackRelease(note, '32n')
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

leadVol.on('change', level => {
  console.log('LEVEL:  ', level)
  synth.volume.value = level
  console.log(synth.volume.value)
})

bassVol.on('change', level => {
  console.log('LEVEL:  ', level)
  synth.volume.value = level
  console.log(synth.volume.value)
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