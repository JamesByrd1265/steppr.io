const socket = io(window.location.origin);
const canvas = document.createElement('canvas')
import $ from 'jquery'
import synths, {vol, gain} from './synths'
import synthEffects from './synth-effects'
import Nexus from 'nexusui'
import Tone from 'tone'

let bpm = 125
const bpmConverter = ms => (60000/ms) / 4
const tempo = new Nexus.Dial('#tempo-select', {
  'size': [90, 90],
  'interaction': 'radial',
  'mode': 'absolute',
  'value': bpm,
  'min': 30,
  'max': 300,
  'step': 1
})

tempo.colorize('fill', 'rgba(67, 203, 203, 0.84)')
tempo.colorize('accent', '#3D3D3D')
tempo.colorize('border', '#3D3D3D')

let sequencer = {'size': [940, 400], 'mode': 'toggle', 'rows': 8, 'columns': 8}
const leadSeq = new Nexus.Sequencer('#lead-seq', sequencer)
const bassSeq = new Nexus.Sequencer('#bass-seq', sequencer)
const drumSeq = new Nexus.Sequencer('#drum-seq', {'size': [1932,400], 'mode': 'toggle', 'rows': 8, 'columns': 16})

let leadSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
let bassSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
let drumSlider = {'size': [180,20], 'mode': 'absolute', 'min': -30, 'max': 0, 'step': 0, 'value': 0}
const leadVol = new Nexus.Slider('#lead-vol', leadSlider)
const bassVol = new Nexus.Slider('#bass-vol', bassSlider)
const drumVol = new Nexus.Slider('#drum-vol', drumSlider)

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

const drumDelay = new Tone.FeedbackDelay()
const drumReverb = new Tone.Freeverb()
const drumPhaser = new Tone.Phaser()
const drumChorus = new Tone.Chorus()
const drumDistortion = new Tone.Distortion()
const drumBitcrusher = new Tone.BitCrusher()
const drumAutofilter = new Tone.AutoFilter()
const drumPingpong = new Tone.PingPongDelay()

drumDelay.wet.value = 0
drumReverb.wet.value = 0
drumPhaser.wet.value = 0
drumChorus.wet.value = 0
drumDistortion.wet.value = 0
drumBitcrusher.wet.value = 0
drumAutofilter.wet.value = 0
drumPingpong.wet.value = 0

const drumOnLoad = () => console.log('drum samples loaded')
const drumSamples = {
  "C1": "RIDE-909.wav",
  "C2": "RIDE-707.wav",
  "C3": "RIDE-METAL.wav",
  "C4": "SPLASH.wav",
  "C5": "CRASH.wav",
  "C6": "CRASH-707.wav",
  "C7": "CHIMES.wav",
  "C8": "NOISE.wav",
  "D1": "CLAP-909.wav",
  "D2": "CLAP-909-SHORT.wav",
  "D3": "CLAP-NOISE.wav",
  "D4": "CLAP-NOISE-FILT.wav",
  "D5": "CLAP-NOISE-HI.wav",
  "D6": "CLAP-SWEEP.wav",
  "D7": "CLAP-HI-SWEEP.wav",
  "D8": "CLAP-UFO.wav",
  "E1": "MARACAS.wav",
  "E2": "MARACAS-808.wav",
  "E3": "SHAKER.wav",
  "E4": "SHAKER-SP1200.wav",
  "E5": "CABASA.wav",
  "E6": "AGOGO.wav",
  "E7": "QUIJADA.wav",
  "E8": "SHAKER-NOISE.wav",
  "F1": "OH-909.wav",
  "F2": "OH-909-SHORT.wav",
  "F3": "OH-808.wav",
  "F4": "OH-CR78.wav",
  "F5": "OH-SDS800.wav",
  "F6": "OH-SP1200.wav",
  "F7": "OH-NOISE.wav",
  "F8": "OH-78-NOISE.wav",
  "F#1": "CH-78.wav",
  "F#2": "CH-RTM.wav",
  "F#3": "CH-909.wav",
  "F#4": "CH-909-COLOR.wav",
  "F#5": "CH-808.wav",
  "F#6": "CH-727.wav",
  "F#7": "CH-METAL.wav",
  "F#8": "CH-SDS800.wav",
  "G1": "BONGO.wav",
  "G2": "BONGO-727.wav",
  "G3": "CONGA.wav",
  "G4": "CONGA-HI.wav",
  "G5": "CONGA-LOW.wav",
  "G6": "CONGA-CR78.wav",
  "G7": "TIMBALE.wav",
  "G8": "TIMBALE-FLAM.wav",
  "A1": "SD-808.wav",
  "A2": "SD-909.wav",
  "A3": "SD-909-COLORED.wav",
  "A4": "SD-707.wav",
  "A5": "SD-CR78.wav",
  "A6": "SD-SP1200.wav",
  "A7": "RIM-808.wav",
  "A8": "RIM-CR78.wav",
  "B1": "BD-78.wav",
  "B2": "BD-RTM.wav",
  "B3": "BD-707.wav",
  "B4": "BD-808.wav",
  "B5": "BD-808-ACCENT.wav",
  "B6": "BD-909.wav",
  "B7": "BD-909-LONG.wav",
  "B8": "BD-909-DIRTY.wav"
}

const drums = new Tone.Sampler(drumSamples, drumOnLoad, '/drum-samples/').chain(
  drumDelay,
  drumReverb,
  drumPhaser,
  drumChorus,
  drumDistortion,
  drumBitcrusher,
  drumAutofilter,
  drumPingpong,
  Tone.Master
)

const cymbals = {
  RIDE_909: 'C1',
  RIDE_707: 'C2',
  RIDE_METAL: 'C3',
  SPLASH: 'C4',
  CRASH: 'C5',
  CRASH_707: 'C6',
  CHIMES: 'C7',
  NOISE: 'C8'
}

const claps = {
  CLAP_909: 'D1',
  CLAP_909_SHORT: 'D2',
  CLAP_NOISE: 'D3',
  CLAP_NOISE_FILT: 'D4',
  CLAP_NOISE_HI: 'D5',
  CLAP_SWEEP: 'D6',
  CLAP_HI_SWEEP: 'D7',
  CLAP_UFO: 'D8'
}

const shakers = {
  MARACAS: 'E1',
  MARACAS_808: 'E2',
  SHAKER: 'E3',
  SHAKER_SP1200: 'E4',
  CABASA: 'E5',
  AGOGO: 'E6',
  QUIJADA: 'E7',
  SHAKER_NOISE: 'E8'
}

const openHats = {
  OH_909: 'F1',
  OH_909_SHORT: 'F2',
  OH_808: 'F3',
  OH_CR78: 'F4',
  OH_SDS800: 'F5',
  OH_SP1200: 'F6',
  OH_NOISE: 'F7',
  OH_78_NOISE: 'F8'
}

const closedHats = {
  CH_78: 'F#1',
  CH_RTM: 'F#2',
  CH_909: 'F#3',
  CH_909_COLOR: 'F#4',
  CH_808: 'F#5',
  CH_727: 'F#6',
  CH_METAL: 'F#7',
  CH_SDS800: 'F#8'
}

const percussion = {
  BONGO: 'G1',
  BONGO_727: 'G2',
  CONGA: 'G3',
  CONGA_HI: 'G4',
  CONGA_LOW: 'G5',
  CONGA_CR78: 'G6',
  TIMBALE: 'G7',
  TIMBALE_FLAM: 'G8'
}

const snares = {
  SD_808: 'A1',
  SD_909: 'A2',
  SD_909_COLORED: 'A3',
  SD_707: 'A4',
  SD_CR78: 'A5',
  SD_SP1200: 'A6',
  RIM_808: 'A7',
  RIM_CR78: 'A8'
}

const kicks = {
  BD_78: 'B1',
  BD_RTM: 'B2',
  BD_707: 'B3',
  BD_808: 'B4',
  BD_808_ACCENT: 'B5',
  BD_909: 'B6',
  BD_909_LONG: 'B7',
  BD_909_DIRTY: 'B8'
}

let lead = synths.fm,
bass = synths.fmBass,
cymbal = cymbals.RIDE_909,
clap = claps.CLAP_909,
shaker = shakers.MARACAS,
openHat = openHats.OH_909,
closedHat = closedHats.CH_78,
perc = percussion.BONGO,
snare = snares.SD_808,
kick = kicks.BD_78

const selectLead = sound => {
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

const selectLeadEffect = effect => {
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

const selectBass = effect => {
  let {value, id} = effect.target
  socket.emit('selectBass', value)
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

const selectBassEffect = effect => {
  let {value, id} = effect.target
  socket.emit('selectBassEffect', value)
  if(value === 'DRY') {
    bass.disconnect()
    bass.fan(gain, vol)
  } else if(value === 'DELAY') {
    bass.disconnect()
    bass.fan(delay)
  } else if(value === 'REVERB') {
    bass.disconnect()
    bass.fan(reverb)
  } else if(value === 'PHASER') {
    bass.disconnect()
    bass.fan(phaser)
  } else if(value === 'CHORUS') {
    bass.disconnect()
    bass.fan(chorus)
  } else if(value === 'DISTORTION') {
    bass.disconnect()
    bass.fan(distortion)
  } else if(value === 'BITCRUSHER') {
    bass.disconnect()
    bass.fan(bitcrusher)
  } else if(value === 'AUTOFILTER') {
    bass.disconnect()
    bass.fan(autofilter)
  } else if(value === 'PINGPONG') {
    bass.disconnect()
    bass.fan(pingpong)
  }
}

const selectCymbal = sample => {
  let {value, id} = sample.target
  socket.emit('selectCymbal', value)
  cymbal = cymbals[value]
}
const selectClap = sample => {
  let {value, id} = sample.target
  socket.emit('selectClap', value)
  clap = claps[value]
}
const selectShaker = sample => {
  let {value, id} = sample.target
  socket.emit('selectShaker', value)
  shaker = shakers[value]
}
const selectOpenHat = sample => {
  let {value, id} = sample.target
  socket.emit('selectOpenHat', value)
  openHat = openHats[value]
}
const selectClosedHat = sample => {
  let {value, id} = sample.target
  socket.emit('selectClosedHat', value)
  closedHat = closedHats[value]
}
const selectPerc = sample => {
  let {value, id} = sample.target
  socket.emit('selectPerc', value)
  perc = percussion[value]
}
const selectSnare = sample => {
  let {value, id} = sample.target
  socket.emit('selectSnare', value)
  snare = snares[value]
}
const selectKick = sample => {
  let {value, id} = sample.target
  socket.emit('selectKick', value)
  kick = kicks[value]
}

const triggerNote = (synth, note) => {
  synth.triggerAttackRelease(note, '32n')
}

const triggerHit = drum => {
  drums.triggerAttack(drum)
}

tempo.on('change', event => {
  $('#tempo').mouseup(() => {
    socket.emit('changeTempo', event)
  })
})

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

tempo.on('change', value => {
  leadSeq.matrix.bpm = value
  bassSeq.matrix.bpm = value
  drumSeq.matrix.bpm = value
  bpm = bpmConverter(value)
  leadSeq.stop()
  bassSeq.stop()
  drumSeq.stop()
  leadSeq.start(bpm)
  bassSeq.start(bpm)
  drumSeq.start(bpm)
})

leadVol.on('change', level => {
  lead.volume.value = level
})

bassVol.on('change', level => {
  bass.volume.value = level
})

drumVol.on('change', level => {
  drums.volume.value = level
})

const start = () => {
  const {context} = leadSeq.interval.clock
  if(context.state === 'suspended') {
    context.resume().then(() => console.log('audio context resumed'))
    leadSeq.start(bpm)
    bassSeq.start(bpm)
    drumSeq.start(bpm)
    $("#start").html('STOP')
  } else {
    leadSeq.stop()
    bassSeq.stop()
    drumSeq.stop()
    context.suspend().then(() => console.log('audio context suspended'))
    $("#start").html('START')
  }
}

let effectFontColors = {
  'delay': 'white',
  'reverb': 'white',
  'phaser': 'white',
  'chorus': 'white',
  'distortion': 'white',
  'bitcrusher': 'white',
  'autofilter': 'white',
  'pingpong': 'white'
}

const toggleDrumEffect = function(effect, text) {
  return () => {
    console.log(effectFontColors[text])
    let currentText = "#drum-" + text
    console.log(currentText)
    if(effect.wet.value === 0) {
      effect.wet.value = .5
      $(currentText).css('font-weight', 'bold')
      $(currentText).css('color', '#F29854')
    } else {
      effect.wet.value = 0
      $(currentText).css('font-weight', 'normal')
      $(currentText).css('color', 'white')
    }
  }
}

const setupSequencers = () => {
  $("#start").on('click', start)
  $("#lead-select").on('change', selectLead)
  $("#bass-select").on('change', selectBass)
  $("#cymbal-select").on('change', selectCymbal)
  $("#clap-select").on('change', selectClap)
  $("#shaker-select").on('change', selectShaker)
  $("#oh-select").on('change', selectOpenHat)
  $("#ch-select").on('change', selectClosedHat)
  $("#perc-select").on('change', selectPerc)
  $("#snare-select").on('change', selectSnare)
  $("#kick-select").on('change', selectKick)
  $("#lead-effect-select").on('change', selectLeadEffect)
  $("#bass-effect-select").on('change', selectBassEffect)
  $("#drum-delay").on('click', toggleDrumEffect(drumDelay, 'delay'))
  $("#drum-reverb").on('click', toggleDrumEffect(drumReverb, 'reverb'))
  $("#drum-phaser").on('click', toggleDrumEffect(drumPhaser, 'phaser'))
  $("#drum-chorus").on('click', toggleDrumEffect(drumChorus, 'chorus'))
  $("#drum-distortion").on('click', toggleDrumEffect(drumDistortion, 'distortion'))
  $("#drum-bitcrusher").on('click', toggleDrumEffect(drumBitcrusher, 'bitcrusher'))
  $("#drum-autofilter").on('click', toggleDrumEffect(drumAutofilter, 'autofilter'))
  $("#drum-pingpong").on('click', toggleDrumEffect(drumPingpong, 'pingpong'))
}

socket.on('connect', () => {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('changeTempo', data => {
  tempo.value = data
  console.log('tempo data: ', data,  '   bpm:  ', bpm)
})

socket.on('leadSeq', data => {
  leadSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('bassSeq', data => {
  bassSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('drumSeq', data => {
  drumSeq.matrix.set.cell(data.column, data.row, data.state)
})

socket.on('selectLead', data => {
  $("#lead-select").val(data)
  lead = synths[data.toLowerCase()]
})

socket.on('selectBass', data => {
  $("#bass-select").val(data)
  bass = synths[data.toLowerCase()]
})

socket.on('selectCymbal', data => {
  $("#cymbal-select").val(data)
  cymbal = cymbals[data]
})

socket.on('selectClap', data => {
  $("#clap-select").val(data)
  clap = claps[data]
})

socket.on('selectShaker', data => {
  $("#shaker-select").val(data)
  shaker = shakers[data]
})

socket.on('selectOpenHat', data => {
  $("#oh-select").val(data)
  openHat = openHats[data]
})

socket.on('selectClosedHat', data => {
  $("#ch-select").val(data)
  closedHat = closedHats[data]
})

socket.on('selectPerc', data => {
  $("#perc-select").val(data)
  perc = percussion[data]
})

socket.on('selectSnare', data => {
  $("#snare-select").val(data)
  snare = snares[data]
})

socket.on('selectKick', data => {
  $("#kick-select").val(data)
  kick = kicks[data]
})

const mq = [
  window.matchMedia('(min-width: 0px) and (max-width: 1024px) and (max-height: 500px)'),
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1175px) and (max-width: 1274px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (max-height: 500px)'),     
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (max-height: 500px)'),   
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (max-height: 500px)'),   
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (max-height: 500px)'),   
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (max-height: 500px)'),   
  window.matchMedia('(min-width: 1625px) and (max-width: 1702px) and (max-height: 500px)'),   
  window.matchMedia('(min-width: 1703px) and (max-width: 1774px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 1775px) and (max-width: 1894px) and (max-height: 500px)'), 
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (max-height: 500px)'),  
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (max-height: 500px)'), 
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (max-height: 500px)'), 
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (max-height: 500px)'), 
  window.matchMedia('(min-width: 2497px) and (max-height: 500px)'),                       
  window.matchMedia('(min-width: 0px) and (max-width: 874px) and (min-height: 501px) and (max-height: 620px)'),    
  window.matchMedia('(min-width: 875px) and (max-width: 1074px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (min-height: 501px) and (max-height: 620px)'),     
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (min-height: 501px) and (max-height: 620px)'),   
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (min-height: 501px) and (max-height: 620px)'),   
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (min-height: 501px) and (max-height: 620px)'),   
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (min-height: 501px) and (max-height: 620px)'),   
  window.matchMedia('(min-width: 1625px) and (max-width: 1702px) and (min-height: 501px) and (max-height: 620px)'),   
  window.matchMedia('(min-width: 1703px) and (max-width: 1774px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (min-height: 501px) and (max-height: 620px)'),  
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (min-height: 501px) and (max-height: 620px)'), 
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (min-height: 501px) and (max-height: 620px)'), 
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (min-height: 501px) and (max-height: 620px)'), 
  window.matchMedia('(min-width: 2497px) and (min-height: 501px) and (max-height: 620px)'),                         
  window.matchMedia('(min-width: 0px) and (max-width: 924px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 925px) and (max-width: 1074px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (min-height: 621px) and (max-height: 850px)'),     
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (min-height: 621px) and (max-height: 850px)'),   
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (min-height: 621px) and (max-height: 850px)'),   
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (min-height: 621px) and (max-height: 850px)'),   
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (min-height: 621px) and (max-height: 850px)'),   
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px) and (min-height: 621px) and (max-height: 850px)'),   
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1703px) and (max-width: 1774px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (min-height: 621px) and (max-height: 850px)'),  
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (min-height: 621px) and (max-height: 850px)'), 
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (min-height: 621px) and (max-height: 850px)'), 
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (min-height: 621px) and (max-height: 850px)'), 
  window.matchMedia('(min-width: 2497px) and (min-height: 621px) and (max-height: 850px)'),                         
  window.matchMedia('(min-width: 0px) and (max-width: 774px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 775px) and (max-width: 824px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 825px) and (max-width: 974px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 975px) and (max-width: 1124px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (min-height: 851px) and (max-height: 1000px)'),     
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (min-height: 851px) and (max-height: 1000px)'),   
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (min-height: 851px) and (max-height: 1000px)'),   
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (min-height: 851px) and (max-height: 1000px)'),   
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (min-height: 851px) and (max-height: 1000px)'),   
  window.matchMedia('(min-width: 1625px) and (max-width: 1702px) and (min-height: 851px) and (max-height: 1000px)'),   
  window.matchMedia('(min-width: 1703px) and (max-width: 1774px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (min-height: 851px) and (max-height: 1000px)'),  
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (min-height: 851px) and (max-height: 1000px)'), 
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (min-height: 851px) and (max-height: 1000px)'), 
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (min-height: 851px) and (max-height: 1000px)'), 
  window.matchMedia('(min-width: 2497px) and (min-height: 851px) and (max-height: 1000px)'),                         
  window.matchMedia('(min-width: 0px) and (max-width: 824px) and (min-height: 1001px)'),    
  window.matchMedia('(min-width: 825px) and (max-width: 974px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 975px) and (max-width: 1124px) and (min-height: 1001px)'), 
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1625px) and (max-width: 1702px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1703px) and (max-width: 1774px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (min-height: 1001px)'),  
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (min-height: 1001px)'), 
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (min-height: 1001px)'), 
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (min-height: 1001px)'), 
  window.matchMedia('(min-width: 2497px) and (min-height: 1001px)')
]                  

let height = 400, synthWidth = 940, drumWidth = 1932

const resizeSequencers = (seqH, synthW, drumW, headerH, tempoR) => {
  leadSeq.resize(synthW, seqH)
  bassSeq.resize(synthW, seqH)
  drumSeq.resize(drumW, seqH)
  $(".synth-seq-header").width(synthW).height(headerH)
  $("#drum-seq-header").width(drumW).height(headerH)
  if(tempoR) tempo.resize(tempoR, tempoR)
}

const abbreviateEffects = () => {
  $("#drum-delay").html('DELY')
  $("#drum-reverb").html('REVR')
  $("#drum-phaser").html('PHSR')
  $("#drum-chorus").html('CHOR')
  $("#drum-distortion").html('DSTR')
  $("#drum-bitcrusher").html('BTCR')
  $("#drum-autofilter").html('FLTR')
  $("#drum-pingpong").html('PPDL')
  $("#drum-effect-header").html('FX')
}

const resizeSequencersResponsively = () => {
  mq[0].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 268, 545, 16, 45)
      abbreviateEffects()
    }
  })
  mq[1].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 318, 644, 16, 45)
      abbreviateEffects()
      tempo.resize(45, 45)
    }
  })
  mq[2].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 368, 742, 20, 45)
      abbreviateEffects()
      tempo.resize(45, 45)
    }
  })
  mq[3].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 424, 856, 20, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    }
  })
  mq[4].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 455, 917, 20, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    }
  })
  mq[5].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 500, 1007, 5, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    }
  })
  mq[6].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 522, 1051, 5, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    }
  })
  mq[7].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 540, 1090, 26, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    }
  })
  mq[8].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 1133, 26, 65)
      tempo.resize(65, 65)
    }
  })
  mq[9].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 576, 1162, 26, 65)
      abbreviateEffects()
      tempo.resize(65, 65)
    }
  })
  mq[10].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 588, 1186, 29, 65)
      abbreviateEffects()
      tempo.resize(65, 65)
    }
  })
  mq[11].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 602, 1215, 30, 65)
      abbreviateEffects()
      tempo.resize(65, 65)
    }
  })
  mq[12].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 606, 1240, 30, 65)
      abbreviateEffects()
    }
  })
  mq[13].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 614, 1271, 30, 70)
    }
  })
  mq[14].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 616, 1274, 35, 80)
    }
  })
  mq[15].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 640, 1329, 35, 80)
    }
  })
  mq[16].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 660, 1360, 35, 80)
      tempo.resize(80, 80)
    }
  })
  mq[17].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 680, 1412, 35)
    }
  })
  mq[18].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 700, 1454, 35)
    }
  })
  mq[19].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 720, 1493, 35)
    }
  })
  mq[20].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 740, 1533, 35)
    }
  })
  mq[21].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 780, 1612, 35)
    }
  })
  mq[22].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 820, 1693, 35)
    }
  })
  mq[23].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 860, 1772, 35)
    }
  })
  mq[24].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 900, 1851, 35)
    }
  })
  mq[25].addListener(e => {
    if(e.matches) { 
      resizeSequencers(200, 940, 1932, 35)
    }
  })
  mq[26].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 268, 546, 16, 45)
      abbreviateEffects()
    }
  })
  mq[27].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 318, 644, 16, 45)
      abbreviateEffects()
    }
  })
  mq[28].addListener(e => {
    if(e.matches) {
      resizeSequencers(160, 368, 742, 20, 45)
      abbreviateEffects()
    }
  })
  mq[29].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 424, 856, 20, 55)
      abbreviateEffects()
    }
  })
  mq[30].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 455, 917, 20, 55)
      abbreviateEffects()
    }
  })
  mq[31].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 480, 968, 24, 55)
      abbreviateEffects()
    }
  })
  mq[32].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 500, 1007, 24, 55)
      abbreviateEffects()
    }
  })
  mq[33].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 522, 1051, 26, 55)
      abbreviateEffects()
    }
  })
  mq[34].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 540, 1090, 26, 55)
      abbreviateEffects()
    }
  })
  mq[35].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 1133, 26, 65)
    }
  })
  mq[36].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 576, 1162, 26, 65)
      abbreviateEffects()
    }
  })
  mq[37].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 588, 1186, 29, 65)
      abbreviateEffects()
    }
  })
  mq[38].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 602, 1215, 30, 65)
      abbreviateEffects()
    }
  })
  mq[39].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 606, 1240, 30, 65)
      abbreviateEffects()
    }
  })
  mq[40].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 614, 1271, 30, 70)
    }
  })
  mq[41].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 616, 1274, 35, 80)
    }
  })
  mq[42].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 1285, 35, 80)
    }
  })
  mq[43].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 620, 1288, 35, 80)
    }
  })
  mq[44].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 640, 1329, 35, 80)
    }
  })
  mq[45].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 660, 1360, 35, 80)
    }
  })
  mq[46].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 680, 1412, 35)
    }
  })
  mq[47].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 700, 1454, 35)
    }
  })
  mq[48].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 720, 1493, 35)
    }
  })
  mq[49].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 740, 1533, 35)
    }
  })
  mq[50].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 780, 1612, 35)
    }
  })
  mq[51].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 820, 1693, 35)
    }
  })
  mq[52].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 860, 1772, 35)
    }
  })
  mq[53].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 900, 1851, 35)
    }
  })
  mq[54].addListener(e => {
    if(e.matches) { 
      resizeSequencers(200, 940, 1932, 35)
    }
  })
  mq[55].addListener(e => {
    if(e.matches) {
      resizeSequencers(200, 268, 546, 16, 45)
      abbreviateEffects()
    }
  })
  mq[56].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateEffects()
    }
  })
  mq[57].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateEffects()
    }
  })
  mq[58].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 424, 856, 20, 55)
      abbreviateEffects()
    }
  })
  mq[59].addListener(e => {
    if(e.matches) { 
      resizeSequencers(260, 455, 917, 20, 55)
      abbreviateEffects()
    }
  })
  mq[60].addListener(e => {
    if(e.matches) { 
      resizeSequencers(260, 480, 968, 24, 55)
      abbreviateEffects()
    }
  })
  mq[61].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 500, 1007, 5, 55)
      abbreviateEffects()
    }
  })
  mq[62].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 522, 1051, 5, 55)
      abbreviateEffects()
    }
  })
  mq[63].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 540, 1090, 26, 55)
      abbreviateEffects()
    }
  })
  mq[64].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 1133, 26, 65)
    }
  })
  mq[65].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 576, 1162, 26, 65)
      abbreviateEffects()
    }
  })
  mq[66].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 588, 1186, 29, 65)
      abbreviateEffects()
    }
  })
  mq[67].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 602, 1215, 30, 65)
      abbreviateEffects()
    }
  })
  mq[68].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 606, 1240, 30, 65)
      abbreviateEffects()
    }
  })
  mq[69].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 606, 1240, 30, 70)
    }
  })
  mq[70].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 614, 1271, 30, 70)
    }
  })
  mq[71].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 616, 1274, 35, 80)
    }
  })
  mq[72].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 617, 1285, 35, 80)
    }
  })
  mq[73].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 620, 1288, 35, 80)
    }
  })
  mq[74].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 640, 1329, 35, 80)
    }
  })
  mq[75].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 660, 1360, 35, 80)
    }
  })
  mq[76].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 680, 1412, 35)
    }
  })
  mq[77].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 700, 1454, 35)
    }
  })
  mq[78].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 720, 1493, 35)
    }
  })
  mq[79].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 740, 1533, 35)
    }
  })
  mq[80].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 780, 1612, 35)
    }
  })
  mq[81].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 820, 1693, 35)
    }
  })
  mq[82].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 860, 1772, 35)
    }
  })
  mq[83].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 900, 1851, 35)
    }
  })
  mq[84].addListener(e => {
    if(e.matches) { 
      resizeSequencers(260, 940, 1932, 35)
    }
  })
  mq[85].addListener(e => {
    if(e.matches) {
      resizeSequencers(220, 268, 546, 16, 45)
      abbreviateEffects()
    }
  })
  mq[86].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 268, 546, 16, 45)
      abbreviateEffects()
    }
  })
  mq[87].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateEffects()
    }
  })
  mq[88].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateEffects()
    }
  })
  mq[89].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 424, 856, 20, 55)
      abbreviateEffects()
    }
  })
  mq[90].addListener(e => {
    if(e.matches) { 
      resizeSequencers(300, 455, 917, 20, 55)
      abbreviateEffects()
    }
  })
  mq[91].addListener(e => {
    if(e.matches) { 
      resizeSequencers(300, 480, 968, 24, 55)
      abbreviateEffects()
    }
  })
  mq[92].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 500, 1007, 5, 55)
      abbreviateEffects()
    }
  })
  mq[93].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 522, 1051, 5, 55)
      abbreviateEffects()
    }
  })
  mq[94].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 540, 1090, 26, 55)
      abbreviateEffects()
    }
  })
  mq[95].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 1133, 26, 65)
    }
  })
  mq[96].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 576, 1162, 26, 65)
      abbreviateEffects()
    }
  })
  mq[97].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 588, 1186, 29, 65)
      abbreviateEffects()
    }
  })
  mq[98].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 602, 1215, 30, 65)
      abbreviateEffects()
    }
  })
  mq[99].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 606, 1240, 30, 65)
      abbreviateEffects()
    }
  })
  mq[100].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 614, 1271, 30, 70)
    }
  })
  mq[101].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 616, 1274, 35, 80)
    }
  })
  mq[102].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 617, 1285, 35, 80)
    }
  })
  mq[103].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 620, 1288, 35, 80)
    }
  })
  mq[104].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 640, 1329, 35, 80)
    }
  })
  mq[105].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 660, 1360, 35, 80)
    }
  })
  mq[106].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 680, 1412, 35)
    }
  })
  mq[107].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 700, 1454, 35)
    }
  })
  mq[108].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 720, 1493, 35)
    }
  })
  mq[109].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 740, 1533, 35)
    }
  })
  mq[110].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 780, 1612, 35)
    }
  })
  mq[111].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 820, 1693, 35)
    }
  })
  mq[112].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 860, 1772, 35)
    }
  })
  mq[113].addListener(e => {
    if(e.matches) {
      resizeSequencers(300, 900, 1851, 35)
    }
  })
  mq[114].addListener(e => {
    if(e.matches) { 
      resizeSequencers(300, 940, 1932, 35)
    }
  })
  mq[115].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 268, 546, 16, 45)
      abbreviateEffects()
    }
  })
  mq[116].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateEffects()
    }
  })
  mq[117].addListener(e => {
    if(e.matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateEffects()
    }
  })
  mq[118].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 424, 856, 20, 55)
      abbreviateEffects()
    }
  })
  mq[119].addListener(e => {
    if(e.matches) { 
      resizeSequencers(400, 455, 917, 20, 55)
      abbreviateEffects()
    }
  })
  mq[120].addListener(e => {
    if(e.matches) { 
      resizeSequencers(400, 480, 968, 24, 55)
      abbreviateEffects()
    }
  })
  mq[121].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 500, 1007, 5, 55)
      abbreviateEffects()
    }
  })
  mq[122].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 522, 1051, 5, 55)
      abbreviateEffects()
    }
  })
  mq[123].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 540, 1090, 26, 55)
      abbreviateEffects()
    }
  })
  mq[124].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 1133, 26, 65)
    }
  })
  mq[125].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 576, 1162, 26, 65)
      abbreviateEffects()
    }
  })
  mq[126].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 588, 1186, 29, 65)
      abbreviateEffects()
    }
  })
  mq[127].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 602, 1215, 30, 65)
      abbreviateEffects()
    }
  })
  mq[128].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 606, 1240, 30, 65)
      abbreviateEffects()
    }
  })
  mq[129].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 614, 1271, 30, 70)
    }
  })
  mq[130].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 616, 1274, 35, 80)
    }
  })
  mq[131].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 617, 1285, 35, 80)
    }
  })
  mq[132].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 620, 1288, 35, 80)
    }
  })
  mq[133].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 640, 1329, 35, 80)
    }
  })
  mq[134].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 660, 1360, 35, 80)
    }
  })
  mq[135].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 680, 1412, 35)
    } else {
      tempo.resize(90, 90)
    }
  })
  mq[136].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 700, 1454, 35)
    }
  })
  mq[137].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 720, 1493, 35)
    }
  })
  mq[138].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 740, 1533, 35)
    }
  })
  mq[139].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 780, 1612, 35)
    }
  })
  mq[140].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 820, 1693, 35)
    }
  })
  mq[141].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 860, 1772, 35)
    }
  })
  mq[142].addListener(e => {
    if(e.matches) {
      resizeSequencers(400, 900, 1851, 35)
    }
  })
  mq[143].addListener(e => {
    if(e.matches) { 
      resizeSequencers(400, 940, 1932, 35)
    }
  })
}

const setup = () => {
  document.body.appendChild(canvas)
  setupSequencers()
  const loadSequencerSizes = () => {
    if(mq[0].matches) {
      resizeSequencers(160, 268, 545, 16, 45)
      abbreviateEffects()
    } else if(mq[1].matches) {
      resizeSequencers(160, 318, 644, 16, 45)
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[2].matches) {
      resizeSequencers(160, 368, 742, 20, 45)
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[3].matches) {
      resizeSequencers(200, 424, 856, 20, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[4].matches) {
      resizeSequencers(200, 455, 917, 20, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[5].matches) {
      resizeSequencers(200, 500, 1007, 24, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[6].matches) {
      resizeSequencers(200, 522, 1051, 24, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[7].matches) {
      resizeSequencers(200, 540, 1090, 26, 55)
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[8].matches) {
      resizeSequencers(200, 1133, 26, 65)
      tempo.resize(65, 65)
    } else if(mq[9].matches) {
      resizeSequencers(200, 576, 1162, 26, 65)
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[10].matches) {
      resizeSequencers(200, 588, 1186, 29, 65)
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[11].matches) {
      resizeSequencers(200, 602, 1215, 30, 65)
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[12].matches) {
      resizeSequencers(200, 606, 1240, 30, 65)
      abbreviateEffects()
    } else if(mq[13].matches) {
      resizeSequencers(200, 614, 1271, 30, 70)
    } else if(mq[14].matches) {
      resizeSequencers(200, 616, 1274, 35, 80)
    } else if(mq[15].matches) {
      resizeSequencers(200, 640, 1329, 35, 80)
    } else if(mq[16].matches) {
      resizeSequencers(200, 660, 1360, 35, 80)
      tempo.resize(80, 80)
    } else if(mq[17].matches) {
      resizeSequencers(200, 680, 1412, 35)
    } else if(mq[18].matches) {
      resizeSequencers(200, 700, 1454, 35)
    } else if(mq[19].matches) {
      resizeSequencers(200, 720, 1493, 35)
    } else if(mq[20].matches) {
      resizeSequencers(200, 740, 1533, 35)
    } else if(mq[21].matches) {
      resizeSequencers(200, 780, 1612, 35)
    } else if(mq[22].matches) {
      resizeSequencers(200, 820, 1693, 35)
    } else if(mq[23].matches) {
      resizeSequencers(200, 860, 1772, 35)
    } else if(mq[24].matches) {
      resizeSequencers(200, 900, 1851, 35)
    } else if(mq[25].matches) { 
      resizeSequencers(200, 940, 1932, 35)
    } else if(mq[26].matches) {
      resizeSequencers(160, 268, 546, 16, 45)
      abbreviateEffects()
    } else if(mq[27].matches) {
      resizeSequencers(160, 318, 644, 16, 45)
      abbreviateEffects()
    } else if(mq[28].matches) {
      resizeSequencers(160, 368, 742, 20, 45)
      abbreviateEffects()
    } else if(mq[29].matches) {
      resizeSequencers(200, 424, 856, 20, 55)
      abbreviateEffects()
    } else if(mq[30].matches) {
      resizeSequencers(200, 455, 917, 20, 55)
      abbreviateEffects()
    } else if(mq[31].matches) {
      resizeSequencers(200, 480, 968, 24, 55)
      abbreviateEffects()
    } else if(mq[32].matches) {
      resizeSequencers(200, 500, 1007, 24, 55)
      abbreviateEffects()
    } else if(mq[33].matches) {
      resizeSequencers(200, 522, 1051, 26, 55)
      abbreviateEffects()
    } else if(mq[34].matches) {
      resizeSequencers(200, 540, 1090, 26, 55)
      abbreviateEffects()
    } else if(mq[35].matches) {
      resizeSequencers(200, 1133, 26, 65)
    } else if(mq[36].matches) {
      resizeSequencers(200, 576, 1162, 26, 65)
      abbreviateEffects()
    } else if(mq[37].matches) {
      resizeSequencers(200, 588, 1186, 29, 65)
      abbreviateEffects()
    } else if(mq[38].matches) {
      resizeSequencers(200, 602, 1215, 30, 65)
      abbreviateEffects()
    } else if(mq[39].matches) {
      resizeSequencers(200, 606, 1240, 30, 65)
      abbreviateEffects()
    } else if(mq[40].matches) {
      resizeSequencers(200, 614, 1271, 30, 70)
    } else if(mq[41].matches) {
      resizeSequencers(200, 616, 1274, 35, 80)
    } else if(mq[42].matches) {
      resizeSequencers(200, 1285, 35, 80)
    } else if(mq[43].matches) {
      resizeSequencers(200, 620, 1288, 35, 80)
    } else if(mq[44].matches) {
      resizeSequencers(200, 640, 1329, 35, 80)
    } else if(mq[45].matches) {
      resizeSequencers(200, 660, 1360, 35, 80)
    } else if(mq[46].matches) {
      resizeSequencers(200, 680, 1412, 35)
    } else if(mq[47].matches) {
      resizeSequencers(200, 700, 1454, 35)
    } else if(mq[48].matches) {
      resizeSequencers(200, 720, 1493, 35)
    } else if(mq[49].matches) {
      resizeSequencers(200, 740, 1533, 35)
    } else if(mq[50].matches) {
      resizeSequencers(200, 780, 1612, 35)
    } else if(mq[51].matches) {
      resizeSequencers(200, 820, 1693, 35)
    } else if(mq[52].matches) {
      resizeSequencers(200, 860, 1772, 35)
    } else if(mq[53].matches) {
      resizeSequencers(200, 900, 1851, 35)
    } else if(mq[54].matches) { 
      resizeSequencers(200, 940, 1932, 35)
    } else if(mq[55].matches) {
      resizeSequencers(200, 268, 546, 16, 45)
      abbreviateEffects()
    } else if(mq[56].matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateEffects()
    } else if(mq[57].matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateEffects()
    } else if(mq[58].matches) {
      resizeSequencers(260, 424, 856, 20, 55)
      abbreviateEffects()
    } else if(mq[59].matches) { 
      resizeSequencers(260, 455, 917, 20, 55)
      abbreviateEffects()
    } else if(mq[60].matches) { 
      resizeSequencers(260, 480, 968, 24, 55)
      abbreviateEffects()
    } else if(mq[61].matches) {
      resizeSequencers(260, 500, 1007, 24, 55)
      abbreviateEffects()
    } else if(mq[62].matches) {
      resizeSequencers(260, 522, 1051, 26, 55)
      abbreviateEffects()
    } else if(mq[63].matches) {
      resizeSequencers(260, 540, 1090, 26, 55)
      abbreviateEffects()
    } else if(mq[64].matches) {
      resizeSequencers(260, 1133, 26, 65)
    } else if(mq[65].matches) {
      resizeSequencers(260, 576, 1162, 26, 65)
      abbreviateEffects()
    } else if(mq[66].matches) {
      resizeSequencers(260, 588, 1186, 29, 65)
      abbreviateEffects()
    } else if(mq[67].matches) {
      resizeSequencers(260, 602, 1215, 30, 65)
      abbreviateEffects()
    } else if(mq[68].matches) {
      resizeSequencers(260, 606, 1240, 30, 65)
      abbreviateEffects()
    } else if(mq[69].matches) {
      resizeSequencers(260, 606, 1240, 30, 70)
    } else if(mq[70].matches) {
      resizeSequencers(260, 614, 1271, 30, 70)
    } else if(mq[71].matches) {
      resizeSequencers(260, 616, 1274, 35, 80)
    } else if(mq[72].matches) {
      resizeSequencers(260, 617, 1285, 35, 80)
    } else if(mq[73].matches) {
      resizeSequencers(260, 620, 1288, 35, 80)
    } else if(mq[74].matches) {
      resizeSequencers(260, 640, 1329, 35, 80)
    } else if(mq[75].matches) {
      resizeSequencers(260, 660, 1360, 35, 80)
    } else if(mq[76].matches) {
      resizeSequencers(260, 680, 1412, 35)
    } else if(mq[77].matches) {
      resizeSequencers(260, 700, 1454, 35)
    } else if(mq[78].matches) {
      resizeSequencers(260, 720, 1493, 35)
    } else if(mq[79].matches) {
      resizeSequencers(260, 740, 1533, 35)
    } else if(mq[80].matches) {
      resizeSequencers(260, 780, 1612, 35)
    } else if(mq[81].matches) {
      resizeSequencers(260, 820, 1693, 35)
    } else if(mq[82].matches) {
      resizeSequencers(260, 860, 1772, 35)
    } else if(mq[83].matches) {
      resizeSequencers(260, 900, 1851, 35)
    } else if(mq[84].matches) { 
      resizeSequencers(260, 940, 1932, 35)
    } else if(mq[85].matches) {
      resizeSequencers(220, 268, 546, 16, 45)
      abbreviateEffects()
    } else if(mq[86].matches) {
      resizeSequencers(260, 268, 546, 16, 45)
      abbreviateEffects()
    } else if(mq[87].matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateEffects()
    } else if(mq[88].matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateEffects()
    } else if(mq[89].matches) {
      resizeSequencers(300, 424, 856, 20, 55)
      abbreviateEffects()
    } else if(mq[90].matches) { 
      resizeSequencers(300, 455, 917, 20, 55)
      abbreviateEffects()
    } else if(mq[91].matches) { 
      resizeSequencers(300, 480, 968, 24, 55)
      abbreviateEffects()
    } else if(mq[92].matches) {
      resizeSequencers(300, 500, 1007, 24, 55)
      abbreviateEffects()
    } else if(mq[93].matches) {
      resizeSequencers(300, 522, 1051, 26, 55)
      abbreviateEffects()
    } else if(mq[94].matches) {
      resizeSequencers(300, 540, 1090, 26, 55)
      abbreviateEffects()
    } else if(mq[95].matches) {
      resizeSequencers(300, 1133, 26, 65)
    } else if(mq[96].matches) {
      resizeSequencers(300, 576, 1162, 26, 65)
      abbreviateEffects()
    } else if(mq[97].matches) {
      resizeSequencers(300, 588, 1186, 29, 65)
      abbreviateEffects()
    } else if(mq[98].matches) {
      resizeSequencers(300, 602, 1215, 30, 65)
      abbreviateEffects()
    } else if(mq[99].matches) {
      resizeSequencers(300, 606, 1240, 30, 65)
      abbreviateEffects()
    } else if(mq[100].matches) {
      resizeSequencers(300, 614, 1271, 30, 70)
    } else if(mq[101].matches) {
      resizeSequencers(300, 616, 1274, 35, 80)
      tempo.resize(80, 80)
    } else if(mq[102].matches) {
      resizeSequencers(300, 617, 1285, 35, 80)
      tempo.resize(80, 80)
    } else if(mq[103].matches) {
      resizeSequencers(300, 620, 1288, 35, 80)
      tempo.resize(80, 80)
    } else if(mq[104].matches) {
      resizeSequencers(300, 640, 1329, 35, 80)
    } else if(mq[105].matches) {
      resizeSequencers(300, 660, 1360, 35, 80)
    } else if(mq[106].matches) {
      resizeSequencers(300, 680, 1412, 35)
    } else if(mq[107].matches) {
      resizeSequencers(300, 700, 1454, 35)
    } else if(mq[108].matches) {
      resizeSequencers(300, 720, 1493, 35)
    } else if(mq[109].matches) {
      resizeSequencers(300, 740, 1533, 35)
    } else if(mq[110].matches) {
      resizeSequencers(300, 780, 1612, 35)
    } else if(mq[111].matches) {
      resizeSequencers(300, 820, 1693, 35)
    } else if(mq[112].matches) {
      resizeSequencers(300, 860, 1772, 35)
    } else if(mq[113].matches) {
      resizeSequencers(300, 900, 1851, 35)
    } else if(mq[114].matches) { 
      resizeSequencers(300, 940, 1932, 35)
    } else if(mq[115].matches) {
      resizeSequencers(260, 268, 546, 16, 45)
      abbreviateEffects()
    } else if(mq[116].matches) {
      resizeSequencers(260, 318, 644, 16, 45)
      abbreviateEffects()
    } else if(mq[117].matches) {
      resizeSequencers(260, 368, 742, 20, 45)
      abbreviateEffects()
    } else if(mq[118].matches) {
      resizeSequencers(400, 424, 856, 20, 55)
      abbreviateEffects()
    } else if(mq[119].matches) { 
      resizeSequencers(400, 455, 917, 20, 55)
      abbreviateEffects()
    } else if(mq[120].matches) { 
      resizeSequencers(400, 480, 968, 24, 55)
      abbreviateEffects()
    } else if(mq[121].matches) {
      resizeSequencers(400, 500, 1007, 24, 55)
      abbreviateEffects()
    } else if(mq[122].matches) {
      resizeSequencers(400, 522, 1051, 26, 55)
      abbreviateEffects()
    } else if(mq[123].matches) {
      resizeSequencers(400, 540, 1090, 26, 55)
      abbreviateEffects()
    } else if(mq[124].matches) {
      resizeSequencers(400, 1133, 26, 65)
    } else if(mq[125].matches) {
      resizeSequencers(400, 576, 1162, 26, 65)
      abbreviateEffects()
    } else if(mq[126].matches) {
      resizeSequencers(400, 588, 1186, 29, 65)
      abbreviateEffects()
    } else if(mq[127].matches) {
      resizeSequencers(400, 602, 1215, 30, 65)
      abbreviateEffects()
    } else if(mq[128].matches) {
      resizeSequencers(400, 606, 1240, 30, 65)
      abbreviateEffects()
    } else if(mq[129].matches) {
      resizeSequencers(400, 614, 1271, 30, 70)
    } else if(mq[130].matches) {
      resizeSequencers(400, 616, 1274, 35, 80)
    } else if(mq[131].matches) {
      resizeSequencers(400, 617, 1285, 35, 80)
    } else if(mq[132].matches) {
      resizeSequencers(400, 620, 1288, 35, 80)
    } else if(mq[133].matches) {
      resizeSequencers(400, 640, 1329, 35, 80)
    } else if(mq[134].matches) {
      resizeSequencers(400, 660, 1360, 35, 80)
    } else if(mq[135].matches) {
      resizeSequencers(400, 680, 1412, 35)
    } else if(mq[136].matches) {
      resizeSequencers(400, 700, 1454, 35)
    } else if(mq[137].matches) {
      resizeSequencers(400, 720, 1493, 35)
    } else if(mq[138].matches) {
      resizeSequencers(400, 740, 1533, 35)
    } else if(mq[139].matches) {
      resizeSequencers(400, 780, 1612, 35)
    } else if(mq[140].matches) {
      resizeSequencers(400, 820, 1693, 35)
    } else if(mq[141].matches) {
      resizeSequencers(400, 860, 1772, 35)
    } else if(mq[142].matches) {
      resizeSequencers(400, 900, 1851, 35)
    } else if(mq[143].matches) { 
      resizeSequencers(400, 940, 1932, 35)
    }
  }
  loadSequencerSizes()
  resizeSequencersResponsively()
}


document.addEventListener('DOMContentLoaded', setup)

if(typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
   var resumeAudio = function() {
      if(typeof g_WebAudioContext == "undefined" || g_WebAudioContext == null) return;
      if(g_WebAudioContext.state == "suspended") g_WebAudioContext.resume();
      document.removeEventListener("click", resumeAudio);
   };
   document.addEventListener("click", resumeAudio);
}