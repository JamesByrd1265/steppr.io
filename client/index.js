export const socket = io(window.location.origin);
const canvas = document.createElement('canvas')
import $ from 'jquery'
import synths from './synths'
import Nexus from 'nexusui'
import Tone from 'tone'

let sequencer = {'size': [600,300], 'mode': 'toggle', 'rows': 8, 'columns': 8}
let leadSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
let bassSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
let drumSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}

const drumOnLoad = () => console.log('drum samples loaded')

const drums = new Tone.Sampler({
  "C1" : "BD-707.wav", //707kick
  "C2" : "SD-909.wav", //sd909
  "C3" : "Bongo.wav", //bongo
  "C4" : "CH-909.wav", //ch909
  "C5" : "OH-909.wav", //oh909
  "C6" : "Maracas.wav", //maracas
  "C7" : "Clap.wav", //clap
  "C8" : "Ride.wav" //ride
}, drumOnLoad, '/drum-samples/').toMaster()

const leadSeq = new Nexus.Sequencer('#lead-seq', sequencer)
const bassSeq = new Nexus.Sequencer('#bass-seq', sequencer)
const drumSeq = new Nexus.Sequencer('#drum-seq', {'size': [1245,300], 'mode': 'toggle', 'rows': 8, 'columns': 16})
const leadVol = new Nexus.Slider('#lead-vol', leadSlider)
const bassVol = new Nexus.Slider('#bass-vol', bassSlider)
const drumVol = new Nexus.Slider('#drum-vol', drumSlider)
let lead = synths.fm, bass = synths.fmBass

const selectLeadSound = sound => {
  socket.emit('selectLeadSound', sound.target.value)
  let {value, id} = sound.target
  if(value === 'FM') {
    lead = synths.fm
  } else if(value === 'MEMBRANE') {
    lead = synths.membrane
  } else if(value === 'AM') {
    lead = synths.am
  } else if(value === 'PLUCK') {
    lead = synths.pluck
  } else if(value === 'DUO') {
    lead = synths.duo
  } else if(value === 'POLY') {
    lead = synths.poly
  }
}

const selectBassSound = sound => {
  socket.emit('selectBassSound', sound.target.value)
  let {value, id} = sound.target
  if(value === 'FM') {
    bass = synths.fmBass
  } else if(value === 'MEMBRANE') {
    bass = synths.membraneBass
  } else if(value === 'AM') {
    bass = synths.amBass
  } else if(value === 'PLUCK') {
    bass = synths.pluckBass
  } else if(value === 'DUO') {
    bass = synths.duoBass
  } else if(value === 'POLY') {
    bass = synths.polyBass
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
}

leadSeq.on('change', event => {
  socket.emit('leadSeq', event)
})

bassSeq.on('change', event => {
  socket.emit('bassSeq', event)
})

drumSeq.on('change', event => {
  socket.emit('drumSeq', event)
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

drumSeq.on('step', hits => {
  if(hits[7]) {
    triggerHit('C8')
    socket.emit('nx', hits)
  }
  if(hits[6]) {
    triggerHit('C7')
    socket.emit('nx', hits)   
  }
  if(hits[5]) {
    triggerHit('C6')
    socket.emit('nx', hits)   
  }
  if(hits[4]) {
    triggerHit('C5')
    socket.emit('nx', hits)   
  }
  if(hits[3]) {
    triggerHit('C4')
    socket.emit('nx', hits)   
  }
  if(hits[2]) {
    triggerHit('C3')
    socket.emit('nx', hits)   
  }
  if(hits[1]) {
    triggerHit('C2')
    socket.emit('nx', hits)   
  }
  if(hits[0]) {
    triggerHit('C1')
    socket.emit('nx', hits)
  } 
})

leadVol.on('change', level => {
  lead.volume.value = level
})

bassVol.on('change', level => {
  bass.volume.value = level
})

const setupSequencer = () => {
  leadSeq.start(100)
  bassSeq.start(100)
  drumSeq.start(100)
  $("#lead-select").on('change', selectLeadSound)
  $("#bass-select").on('change', selectBassSound)
}

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('leadSeq', data => {
  //console.log('lead data:  ', data)
  leadSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('bassSeq', data => {
  bassSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('drumSeq', data => {
  console.log('data:  ', data)
  drumSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('selectLeadSound', data => {
  $("#lead-select").val(data)
  lead = synths[data.toLowerCase()]
})

socket.on('selectBassSound', data => {
  $("#bass-select").val(data)
  bass = synths[data.toLowerCase()]
})

document.addEventListener('DOMContentLoaded', setup)