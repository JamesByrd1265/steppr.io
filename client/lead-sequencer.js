const socket = io(window.location.origin);
import Nexus from 'nexusui'
import $ from 'jquery'
import synths, {vol, gain} from './synths'
import synthEffects from './synth-effects'
import {triggerNote} from './index'

let leadSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
export const leadVol = new Nexus.Slider('#lead-vol', leadSlider)

export const leadSeq = new Nexus.Sequencer('#lead-seq', {
  'size': [940, 400],
  'mode': 'toggle',
  'rows': 8,
  'columns': 8
})

let lead = synths.fm

const {
  delay,
  reverb,
  phaser,
  chorus,
  distortion,
  bitcrusher,
  autofilter,
  pingpong
} = synthEffects

export const selectLead = sound => {
  let {value, id} = sound.target
  socket.emit('selectLead', value)
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

export const selectLeadEffect = effect => {
  let {value, id} = effect.target
  socket.emit('selectLeadEffect', value)
  if(value === 'DRY') {
    lead.disconnect()
    lead.fan(gain, vol)
  } else if(value === 'DELAY') {
    lead.disconnect()
    lead.fan(delay)
  } else if(value === 'REVERB') {
    lead.disconnect()
    lead.fan(reverb)
  } else if(value === 'PHASER') {
    lead.disconnect()
    lead.fan(phaser)
  } else if(value === 'CHORUS') {
    lead.disconnect()
    lead.fan(chorus)
  } else if(value === 'DISTORTION') {
    lead.disconnect()
    lead.fan(distortion)
  } else if(value === 'BITCRUSHER') {
    lead.disconnect()
    lead.fan(bitcrusher)
  } else if(value === 'AUTOFILTER') {
    lead.disconnect()
    lead.fan(autofilter)
  } else if(value === 'PINGPONG') {
    lead.disconnect()
    lead.fan(pingpong)
  }
}

leadVol.on('change', level => {
  lead.volume.value = level
})

leadSeq.on('change', event => {
  socket.emit('leadSeq', event)
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

socket.on('leadSeq', data => {
  leadSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('selectLead', data => {
  $("#lead-select").val(data)
  lead = synths[data.toLowerCase()]
})