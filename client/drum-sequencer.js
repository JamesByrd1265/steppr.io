const socket = io(window.location.origin);
import $ from 'jquery'
import Nexus from 'nexusui'
import Tone from 'tone'

import {drums, drumSampleOptions} from './drums'
const {
  cymbals, claps, shakers, openHats,
  closedHats, percussion, snares, kicks
} = drumSampleOptions

let cymbal = cymbals.RIDE_909,
clap = claps.CLAP_909,
shaker = shakers.MARACAS,
openHat = openHats.OH_909,
closedHat = closedHats.CH_78,
perc = percussion.BONGO,
snare = snares.SD_808,
kick = kicks.BD_78

let drumSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
export const drumVol = new Nexus.Slider('#drum-vol', drumSlider)
export const drumSeq = new Nexus.Sequencer('#drum-seq', {
  'size': [1932,400],
  'mode': 'toggle',
  'rows': 8,
  'columns': 16
})

const triggerHit = drum => {
  drums.triggerAttack(drum)
}

drumSeq.on('change', event => {
  socket.emit('drumSeq', event)
})

drumSeq.on('step', hits => {
  if(hits[7]) {
    triggerHit(cymbal)
    socket.emit('nx', hits)
  }
  if(hits[6]) {
    triggerHit(clap)
    socket.emit('nx', hits)   
  }
  if(hits[5]) {
    triggerHit(shaker)
    socket.emit('nx', hits)   
  }
  if(hits[4]) {
    triggerHit(openHat)
    socket.emit('nx', hits)   
  }
  if(hits[3]) {
    triggerHit(closedHat)
    socket.emit('nx', hits)   
  }
  if(hits[2]) {
    triggerHit(perc)
    socket.emit('nx', hits)   
  }
  if(hits[1]) {
    triggerHit(snare)
    socket.emit('nx', hits)   
  }
  if(hits[0]) {
    triggerHit(kick)
    socket.emit('nx', hits)
  } 
})


drumVol.on('change', level => {
  drums.volume.value = level
})

socket.on('drumSeq', data => {
  drumSeq.matrix.set.cell(data.column, data.row, data.state)
})