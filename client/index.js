export const socket = io(window.location.origin);
const canvas = document.createElement('canvas')
import $ from 'jquery'
import synths from './synths'
// import drums from './drums'
// import nx from 'nexusui'
import Nexus from 'nexusui'
import Tone from 'tone'

let sequencer = {'size': [600,300], 'mode': 'toggle', 'rows': 8, 'columns': 8}
let slider = {'size': [180,20], 'mode': 'relative', 'min': -30, 'max': 0, 'step': 0, 'value': 0}

const leadSeq = new Nexus.Sequencer('#lead-seq', sequencer)
const bassSeq = new Nexus.Sequencer('#bass-seq', sequencer)
const drumSeq = new Nexus.Sequencer('#drum-seq', {'size': [1245,300], 'mode': 'toggle', 'rows': 8, 'columns': 16})
const leadVol = new Nexus.Slider('#lead-vol', slider)
const bassVol = new Nexus.Slider('#bass-vol', slider)
const drumVol = new Nexus.Slider('#drum-vol', slider)
let lead = synths.fm, bass = synths.fmBass

const selectSound = sound => {
  let {value, id} = sound.target
  if(value === 'FM') {
    id === 'lead-select'
    ? lead = synths.fm
    : bass = synths.fmBass
  } else if(value === 'MEMBRANE') {
    id === 'lead-select'
    ? lead = synths.membrane
    : bass = synths.membraneBass
  } else if(value === 'AM') {
    id === 'lead-select'
    ? lead = synths.am
    : bass = synths.amBass
  } else if(value === 'PLUCK') {
    id === 'lead-select'
    ? lead = synths.pluck
    : bass = synths.pluckBass
  } else if(value === 'DUO') {
    id === 'lead-select'
    ? lead = synths.duo
    : bass = synths.duoBass
  } else if(value === 'POLY') {
    id === 'lead-select'
    ? lead = synths.poly
    : bass = synths.polyBass
  }
}

const triggerNote = (synth, note) => {
  synth.triggerAttackRelease(note, '32n')
}

const triggerHit = drum => {
  drums.triggerAttack(drum)
}

const setup = () => {
  document.body.appendChild(canvas)
  setupSequencer()
  // nx.onload()
}

leadSeq.on('change', event => {
  socket.emit('leadSeq', event)
})

bassSeq.on('change', event => {
  socket.emit('bassSeq', event)
})

leadSeq.on('step', notes => {
  if(notes[7]) {
    triggerNote(lead, 'C6')
    socket.emit('nx', notes)
  }
  if(notes[6]) {
    triggerNote(lead, 'B5')
    socket.emit('nx', notes)   
  }
  if(notes[5]) {
    triggerNote(lead, 'A5')
    socket.emit('nx', notes)   
  }
  if(notes[4]) {
    triggerNote(lead, 'G5')
    socket.emit('nx', notes)   
  }
  if(notes[3]) {
    triggerNote(lead, 'F5')
    socket.emit('nx', notes)   
  }
  if(notes[2]) {
    triggerNote(lead, 'E5')
    socket.emit('nx', notes)   
  }
  if(notes[1]) {
    triggerNote(lead, 'D5')
    socket.emit('nx', notes)   
  }
  if(notes[0]) {
    triggerNote(lead, 'C5')
    socket.emit('nx', notes)
  } 
})

bassSeq.on('step', notes => {
  if(notes[7]) {
    triggerNote(bass, 'C3')
    socket.emit('nx', notes)
  }
  if(notes[6]) {
    triggerNote(bass, 'B2')
    socket.emit('nx', notes)   
  }
  if(notes[5]) {
    triggerNote(bass, 'A2')
    socket.emit('nx', notes)   
  }
  if(notes[4]) {
    triggerNote(bass, 'G2')
    socket.emit('nx', notes)   
  }
  if(notes[3]) {
    triggerNote(bass, 'F2')
    socket.emit('nx', notes)   
  }
  if(notes[2]) {
    triggerNote(bass, 'E2')
    socket.emit('nx', notes)   
  }
  if(notes[1]) {
    triggerNote(bass, 'D2')
    socket.emit('nx', notes)   
  }
  if(notes[0]) {
    triggerNote(bass, 'C2')
    socket.emit('nx', notes)
  } 
})

leadVol.on('change', level => {
  lead.volume.value = level
  // socket.emit('leadVol', level)
})

bassVol.on('change', level => {
  bass.volume.value = level
  // socket.emit('bassVol', level)
})

const setupSequencer = () => {
  leadSeq.start(100)
  bassSeq.start(100)
  drumSeq.start(100)
  $("select").on('change', selectSound)
}

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('nx', (data) => {
  console.log('DATA:  ', data)
})

socket.on('leadSeq', data => {
  leadSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('bassSeq', data => {
  bassSeq.matrix.set.cell(data.column, data.row, data.state)
})

// socket.on('leadVol', data => {
//   leadVol.value = data
// })

// socket.on('bassVol', data => {
//   bass.volume.value = data
// })

document.addEventListener('DOMContentLoaded', setup)