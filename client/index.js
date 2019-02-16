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
    console.log('test')
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
  window.matchMedia('(min-width: 0px) and (max-width: 674px) and (max-height: 500px)'),    //43 => 0  
  window.matchMedia('(min-width: 675px) and (max-width: 724px) and (max-height: 500px)'),   //44 => 1 
  window.matchMedia('(min-width: 725px) and (max-width: 774px) and (max-height: 500px)'),    //45 => 2 
  window.matchMedia('(min-width: 775px) and (max-width: 824px) and (max-height: 500px)'),   //46 => 3
  window.matchMedia('(min-width: 825px) and (max-width: 874px) and (max-height: 500px)'),  //47 => 4
  window.matchMedia('(min-width: 875px) and (max-width: 924px) and (max-height: 500px)'),  //48-- => 5 
  window.matchMedia('(min-width: 925px) and (max-width: 974px) and (max-height: 500px)'),  //49 => 6
  window.matchMedia('(min-width: 975px) and (max-width: 1024px) and (max-height: 500px)'),      //50 => 7
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px) and (max-height: 500px)'),     //51 => 8
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (max-height: 500px)'),     //52 => 9
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (max-height: 500px)'),     // 620 53-- => 10
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (max-height: 500px)'),     // 620 54 => 11
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (max-height: 500px)'),     // 620 55 => 12
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (max-height: 500px)'),     // 620 56 => 13
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (max-height: 500px)'),     // 620 57 => 14
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (max-height: 500px)'),     // 620 58 => 15
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (max-height: 500px)'),   //850 59 => 16
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (max-height: 500px)'),   // 850 60 => 17
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (max-height: 500px)'),   // 850 61 => 18
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (max-height: 500px)'),   // 850 62 => 19
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px) and (max-height: 500px)'),   // 850 63 => 20
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px) and (max-height: 500px)'),  // 1000 64 => 21
  window.matchMedia('(min-width: 1703px) and (max-width: 1724px) and (max-height: 500px)'),  // 1000 65 => 22
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px) and (max-height: 500px)'),  // 1000 66* => 23
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (max-height: 500px)'),  // 1000 67 => 24
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (max-height: 500px)'),  // 1000 68 => 25
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (max-height: 500px)'),  // 1000 69 => 26
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (max-height: 500px)'),  // 1000 70 => 27
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (max-height: 500px)'),  // 1000 71 => 28
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (max-height: 500px)'),  // 0 32  => 29
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (max-height: 500px)'),  // 0 33 => 30
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (max-height: 500px)'),  // 0 34 => 31
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (max-height: 500px)'),  // 0 35 => 32
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (max-height: 500px)'),  // 0 36 => 33
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (max-height: 500px)'), // 0 37 => 34
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (max-height: 500px)'), // 0 38 => 35
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (max-height: 500px)'), // 0 39 => 36
  window.matchMedia('(min-width: 2497px) and (max-height: 500px)'),                         //40 => 37
  window.matchMedia('(min-width: 0px) and (max-width: 674px) and (max-height: 620px)'),     // 500 73 => 38
  window.matchMedia('(min-width: 675px) and (max-width: 724px) and (max-height: 620px)'),     // 500 74 => 39
  window.matchMedia('(min-width: 725px) and (max-width: 774px) and (max-height: 620px)'),     // 500 75 => 40
  window.matchMedia('(min-width: 775px) and (max-width: 824px) and (max-height: 620px)'),     // 500 76 => 41
  window.matchMedia('(min-width: 825px) and (max-width: 874px) and (max-height: 620px)'),     // 500 77   => 42
  window.matchMedia('(min-width: 875px) and (max-width: 924px) and (max-height: 620px)'),     // 500 78 => 43
  window.matchMedia('(min-width: 925px) and (max-width: 974px) and (max-height: 620px)'),     // 500 79 => 44
  window.matchMedia('(min-width: 975px) and (max-width: 1024px) and (max-height: 620px)'),     // 500 80 => 45
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px) and (max-height: 620px)'),     // 500 81 => 46
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (max-height: 620px)'),     // 500 82- => 47
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (max-height: 620px)'),     //53-- => 48
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (max-height: 620px)'),     //54 => 49
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (max-height: 620px)'),     //55 => 50
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (max-height: 620px)'),     //56 => 51
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (max-height: 620px)'),     //57 => 52
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (max-height: 620px)'),     //58 => 53
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (max-height: 620px)'),   // 850 59 => 54 
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (max-height: 620px)'),   // 850 60 => 55
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (max-height: 620px)'),   // 850 61 => 56
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (max-height: 620px)'),   // 850 62 => 57
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px) and (max-height: 620px)'),   // 850 63 => 58
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px) and (max-height: 620px)'),  // 1000 64 => 59
  window.matchMedia('(min-width: 1703px) and (max-width: 1724px) and (max-height: 620px)'),  // 1000 65 => 60
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px) and (max-height: 620px)'),  // 1000 66* => 61
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (max-height: 620px)'),  // 1000 67 => 62
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (max-height: 620px)'),  // 1000 68 => 63
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (max-height: 620px)'),  // 1000 69 => 64
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (max-height: 620px)'),  // 1000 70 => 65
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (max-height: 620px)'),  // 1000 71 => 66
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (max-height: 620px)'),  // 0 32 => 67
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (max-height: 620px)'),  // 0 33 => 68
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (max-height: 620px)'),  // 0 34 => 69
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (max-height: 620px)'),  // 0 35 => 70
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (max-height: 620px)'),  // 0 36 => 71
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (max-height: 620px)'), // 0 37 => 72
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (max-height: 620px)'), // 0 38 => 73
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (max-height: 620px)'), // 0 39 => 74
  window.matchMedia('(min-width: 2497px) and (max-height: 620px)'),                         //40 => 75
  window.matchMedia('(min-width: 0px) and (max-width: 674px) and (max-height: 850px)'),     // 500 73 (5)-- => 76
  window.matchMedia('(min-width: 675px) and (max-width: 724px) and (max-height: 850px)'),     // 500 74 => 77
  window.matchMedia('(min-width: 725px) and (max-width: 774px) and (max-height: 850px)'),     // 500 75 => 78
  window.matchMedia('(min-width: 775px) and (max-width: 824px) and (max-height: 850px)'),     // 500 76 => 79
  window.matchMedia('(min-width: 825px) and (max-width: 874px) and (max-height: 850px)'),     // 500 77   => 80
  window.matchMedia('(min-width: 875px) and (max-width: 924px) and (max-height: 850px)'),     // 500 78 => 81
  window.matchMedia('(min-width: 925px) and (max-width: 974px) and (max-height: 850px)'),     // 500 79 => 82
  window.matchMedia('(min-width: 975px) and (max-width: 1024px) and (max-height: 850px)'),     // 500 80 => 83
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px) and (max-height: 850px)'),     // 500 81 => 84
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (max-height: 850px)'),     // 500 82- => 85
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (max-height: 850px)'),     // 620 53-- => 86
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (max-height: 850px)'),     // 620 54 => 87
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (max-height: 850px)'),     // 620 55 => 88
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (max-height: 850px)'),     // 620 56 => 89
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (max-height: 850px)'),     // 620 57 => 90
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (max-height: 850px)'),     // 620 58 => 91
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (max-height: 850px)'),   //59 => 92
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (max-height: 850px)'),   //60 => 93
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (max-height: 850px)'),   //61 => 94
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (max-height: 850px)'),   //62 => 95
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px) and (max-height: 850px)'),   //63 => 96
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px) and (max-height: 850px)'),  // 1000 64 => 97
  window.matchMedia('(min-width: 1703px) and (max-width: 1724px) and (max-height: 850px)'),  // 1000 65 => 98
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px) and (max-height: 850px)'),  // 1000 66* => 99
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (max-height: 850px)'),  // 1000 67 => 100
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (max-height: 850px)'),  // 1000 68 => 101
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (max-height: 850px)'),  // 1000 69 => 102
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (max-height: 850px)'),  // 1000 70 => 103
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (max-height: 850px)'),  // 1000 71 => 104
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (max-height: 850px)'),  // 0 32 => 105
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (max-height: 850px)'),  // 0 33 => 106
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (max-height: 850px)'),  // 0 34 => 107
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (max-height: 850px)'),  // 0 35 => 108
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (max-height: 850px)'),  // 0 36 => 109
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (max-height: 850px)'), // 0 37 => 110
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (max-height: 850px)'), // 0 38 => 111
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (max-height: 850px)'), // 0 39 => 112
  window.matchMedia('(min-width: 2497px) and (max-height: 850px)'),                         // 0 40 => 113
  window.matchMedia('(min-width: 0px) and (max-width: 674px) and (max-height: 1000px)'),     // 500 73 => 114
  window.matchMedia('(min-width: 675px) and (max-width: 724px) and (max-height: 1000px)'),     // 500 74 => 115
  window.matchMedia('(min-width: 725px) and (max-width: 774px) and (max-height: 1000px)'),     // 500 75 => 116
  window.matchMedia('(min-width: 775px) and (max-width: 824px) and (max-height: 1000px)'),     // 500 76 => 117
  window.matchMedia('(min-width: 825px) and (max-width: 874px) and (max-height: 1000px)'),     // 500 77   => 118
  window.matchMedia('(min-width: 875px) and (max-width: 924px) and (max-height: 1000px)'),     // 500 78 => 119
  window.matchMedia('(min-width: 925px) and (max-width: 974px) and (max-height: 1000px)'),     // 500 79 => 120
  window.matchMedia('(min-width: 975px) and (max-width: 1024px) and (max-height: 1000px)'),     // 500 80 => 121
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px) and (max-height: 1000px)'),     // 500 81 => 122
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (max-height: 1000px)'),     // 500 82- => 123
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (max-height: 1000px)'),     // 620 53-- => 124
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (max-height: 1000px)'),     // 620 54 => 125
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (max-height: 1000px)'),     // 620 55 => 126
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (max-height: 1000px)'),     // 620 56 => 127
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (max-height: 1000px)'),     // 620 57 => 128
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (max-height: 1000px)'),     // 620 58 => 129
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (max-height: 1000px)'),   // 850 59 => 130
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (max-height: 1000px)'),   // 850 60 => 131
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (max-height: 1000px)'),   // 850 61 => 132
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (max-height: 1000px)'),   // 850 62 => 133
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px) and (max-height: 1000px)'),   // 850 63 => 134
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px) and (max-height: 1000px)'),  //64 => 135
  window.matchMedia('(min-width: 1703px) and (max-width: 1724px) and (max-height: 1000px)'),  //65 => 136
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px) and (max-height: 1000px)'),  //66* => 137
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (max-height: 1000px)'),  //67 => 138
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (max-height: 1000px)'),  //68 => 139
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (max-height: 1000px)'),  //69 => 140
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (max-height: 1000px)'),  //70 => 141
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (max-height: 1000px)'),  //71 => 142
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px) and (max-height: 1000px)'),  // 0 32 => 143 
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px) and (max-height: 1000px)'),  // 0 33 => 144
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px) and (max-height: 1000px)'),  // 0 34 => 145
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px) and (max-height: 1000px)'),  // 0 35 => 146
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px) and (max-height: 1000px)'),  // 0 36 => 147
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px) and (max-height: 1000px)'), // 0 37 => 148
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px) and (max-height: 1000px)'), // 0 38 => 149
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px) and (max-height: 1000px)'), // 0 39 => 150
  window.matchMedia('(min-width: 2497px) and (max-height: 1000px)'),                         // 0 40 => 151
]

let height = 400, synthWidth = 940, drumWidth = 1932

// const resizeSequencersResponsively = () => {

// }

const abbreviateEffects = () => {
  $("#drum-delay").html('DELY')
  $("#drum-reverb").html('REVR')
  $("#drum-phaser").html('PHSR')
  $("#drum-chorus").html('CHOR')
  $("#drum-distortion").html('DSTR')
  $("#drum-bitcrusher").html('BTCR')
  $("#drum-autofilter").html('FLTR')
  $("#drum-pingpong").html('PPDL')
}

const setup = () => {
  document.body.appendChild(canvas)
  setupSequencers()
  const resizeSequencers = () => {
    if(mq[0].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[1].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[2].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[3].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[4].matches) {
      height = 160 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[5].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[6].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[7].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[8].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[9].matches) {
      height = 160 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[10].matches) {
      height = 200 
      leadSeq.resize(424, height)
      bassSeq.resize(424, height)
      drumSeq.resize(856, height)
      $(".synth-seq-header").width(424).height(20)
      $("#drum-seq-header").width(856).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[11].matches) { 
      height = 200
      leadSeq.resize(455, height)
      bassSeq.resize(455, height)
      drumSeq.resize(917, height)
      $(".synth-seq-header").width(455).height(20)
      $("#drum-seq-header").width(917).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[12].matches) { 
      height = 200
      leadSeq.resize(480, height)
      bassSeq.resize(480, height)
      drumSeq.resize(968, height)
      $(".synth-seq-header").width(480).height(24)
      $("#drum-seq-header").width(968).height(24)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[13].matches) {
      height = 200
      leadSeq.resize(500, height)
      bassSeq.resize(500, height)
      drumSeq.resize(1007, height)
      $(".synth-seq-header").width(500).height(24.5)
      $("#drum-seq-header").width(1007).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[14].matches) {
      height = 200
      leadSeq.resize(522, height)
      bassSeq.resize(522, height)
      drumSeq.resize(1051, height)
      $(".synth-seq-header").width(522).height(24.5)
      $("#drum-seq-header").width(1051).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[15].matches) {
      height = 200
      leadSeq.resize(540, height)
      bassSeq.resize(540, height)
      drumSeq.resize(1090, height)
      $(".synth-seq-header").width(540).height(26)
      $("#drum-seq-header").width(1090).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[16].matches) {
      height = 280
      leadSeq.resize(561.5, height)
      bassSeq.resize(561.5, height)
      drumSeq.resize(1133, height)
      $(".synth-seq-header").width(561.5).height(26)
      $("#drum-seq-header").width(1133).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[17].matches) {
      height = 280
      leadSeq.resize(576, height)
      bassSeq.resize(576, height)
      drumSeq.resize(1162, height)
      $(".synth-seq-header").width(576).height(26)
      $("#drum-seq-header").width(1162).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[18].matches) {
      height = 280
      leadSeq.resize(588, height)
      bassSeq.resize(588, height)
      drumSeq.resize(1186, height)
      $(".synth-seq-header").width(588).height(29)
      $("#drum-seq-header").width(1186).height(29)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[19].matches) {
      height = 280
      leadSeq.resize(602, height)
      bassSeq.resize(602, height)
      drumSeq.resize(1215, height)
      $(".synth-seq-header").width(602).height(30)
      $("#drum-seq-header").width(1215).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[20].matches) {
      height = 280
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[21].matches) {
      height = 300
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      tempo.resize(70, 70)
    } else if(mq[22].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(30)
      $("#drum-seq-header").width(1271).height(30)
      $('#lead-select-container').css('margin-left', '3em')
      tempo.resize(70, 70)
    } else if(mq[23].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(32)
      $("#drum-seq-header").width(1271).height(32)
      tempo.resize(70, 70)
    } else if(mq[24].matches) {
      height = 320
      leadSeq.resize(616, height)
      bassSeq.resize(616, height)
      drumSeq.resize(1274.5, height)
      $(".synth-seq-header").width(616).height(35)
      $("#drum-seq-header").width(1274.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[25].matches) {
      height = 320
      leadSeq.resize(617.5, height)
      bassSeq.resize(617.5, height)
      drumSeq.resize(1285, height)
      $(".synth-seq-header").width(617.5).height(35)
      $("#drum-seq-header").width(1285).height(35)
      tempo.resize(80, 80)
    } else if(mq[26].matches) {
      height = 320
      leadSeq.resize(620, height)
      bassSeq.resize(620, height)
      drumSeq.resize(1288, height)
      $(".synth-seq-header").width(620).height(35)
      $("#drum-seq-header").width(1288).height(35)
      tempo.resize(80, 80)
    } else if(mq[27].matches) {
      height = 320
      leadSeq.resize(640, height)
      bassSeq.resize(640, height)
      drumSeq.resize(1329.5, height)
      $(".synth-seq-header").width(640).height(35)
      $("#drum-seq-header").width(1329.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[28].matches) {
      height = 320
      leadSeq.resize(660, height)
      bassSeq.resize(660, height)
      drumSeq.resize(1360, height)
      $(".synth-seq-header").width(660).height(35)
      $("#drum-seq-header").width(1360).height(35)
      tempo.resize(80, 80)
    } else if(mq[29].matches) {
      height = 400
      leadSeq.resize(680, height)
      bassSeq.resize(680, height)
      drumSeq.resize(1412.5, height)
      $(".synth-seq-header").width(680).height(35)
      $("#drum-seq-header").width(1412.5).height(35)
    } else if(mq[30].matches) {
      height = 400
      leadSeq.resize(700, height)
      bassSeq.resize(700, height)
      drumSeq.resize(1454, height)
      $(".synth-seq-header").width(700).height(35)
      $("#drum-seq-header").width(1454).height(35)
    } else if(mq[31].matches) {
      height = 400
      leadSeq.resize(720, height)
      bassSeq.resize(720, height)
      drumSeq.resize(1493.5, height)
      $(".synth-seq-header").width(720).height(35)
      $("#drum-seq-header").width(1493.5).height(35)
    } else if(mq[32].matches) {
      height = 400
      leadSeq.resize(740, height)
      bassSeq.resize(740, height)
      drumSeq.resize(1533, height)
      $(".synth-seq-header").width(740).height(35)
      $("#drum-seq-header").width(1533).height(35)
    } else if(mq[33].matches) {
      height = 400
      leadSeq.resize(780, height)
      bassSeq.resize(780, height)
      drumSeq.resize(1612, height)
      $(".synth-seq-header").width(780).height(35)
      $("#drum-seq-header").width(1612).height(35)
    } else if(mq[34].matches) {
      height = 400
      leadSeq.resize(820, height)
      bassSeq.resize(820, height)
      drumSeq.resize(1693, height)
      $(".synth-seq-header").width(820).height(35)
      $("#drum-seq-header").width(1693).height(35)
    } else if(mq[35].matches) {
      height = 400
      leadSeq.resize(860, height)
      bassSeq.resize(860, height)
      drumSeq.resize(1772, height)
      $(".synth-seq-header").width(860).height(35)
      $("#drum-seq-header").width(1772).height(35)
    } else if(mq[36].matches) {
      height = 400
      leadSeq.resize(900, height)
      bassSeq.resize(900, height)
      drumSeq.resize(1851, height)
      $(".synth-seq-header").width(900).height(35)
      $("#drum-seq-header").width(1851).height(35)
    } else if(mq[37].matches) { 
      height = 400
      leadSeq.resize(940, height)
      bassSeq.resize(940, height)
      drumSeq.resize(1932, height)
      $(".synth-seq-header").width(940).height(35)
      $("#drum-seq-header").width(1932).height(35)
    } else if(mq[38].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[39].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[40].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[41].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[42].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[43].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[44].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[45].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[46].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[47].matches) {
      height = 160 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[48].matches) {
      height = 200 
      leadSeq.resize(424, height)
      bassSeq.resize(424, height)
      drumSeq.resize(856, height)
      $(".synth-seq-header").width(424).height(20)
      $("#drum-seq-header").width(856).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[49].matches) { 
      height = 200
      leadSeq.resize(455, height)
      bassSeq.resize(455, height)
      drumSeq.resize(917, height)
      $(".synth-seq-header").width(455).height(20)
      $("#drum-seq-header").width(917).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[50].matches) { 
      height = 200
      leadSeq.resize(480, height)
      bassSeq.resize(480, height)
      drumSeq.resize(968, height)
      $(".synth-seq-header").width(480).height(24)
      $("#drum-seq-header").width(968).height(24)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[51].matches) {
      height = 200
      leadSeq.resize(500, height)
      bassSeq.resize(500, height)
      drumSeq.resize(1007, height)
      $(".synth-seq-header").width(500).height(24.5)
      $("#drum-seq-header").width(1007).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[52].matches) {
      height = 200
      leadSeq.resize(522, height)
      bassSeq.resize(522, height)
      drumSeq.resize(1051, height)
      $(".synth-seq-header").width(522).height(24.5)
      $("#drum-seq-header").width(1051).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[53].matches) {
      height = 200
      leadSeq.resize(540, height)
      bassSeq.resize(540, height)
      drumSeq.resize(1090, height)
      $(".synth-seq-header").width(540).height(26)
      $("#drum-seq-header").width(1090).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[54].matches) {
      height = 280
      leadSeq.resize(561.5, height)
      bassSeq.resize(561.5, height)
      drumSeq.resize(1133, height)
      $(".synth-seq-header").width(561.5).height(26)
      $("#drum-seq-header").width(1133).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[55].matches) {
      height = 280
      leadSeq.resize(576, height)
      bassSeq.resize(576, height)
      drumSeq.resize(1162, height)
      $(".synth-seq-header").width(576).height(26)
      $("#drum-seq-header").width(1162).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[56].matches) {
      height = 280
      leadSeq.resize(588, height)
      bassSeq.resize(588, height)
      drumSeq.resize(1186, height)
      $(".synth-seq-header").width(588).height(29)
      $("#drum-seq-header").width(1186).height(29)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[57].matches) {
      height = 280
      leadSeq.resize(602, height)
      bassSeq.resize(602, height)
      drumSeq.resize(1215, height)
      $(".synth-seq-header").width(602).height(30)
      $("#drum-seq-header").width(1215).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[58].matches) {
      height = 280
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[59].matches) {
      height = 300
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      tempo.resize(70, 70)
    } else if(mq[60].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(30)
      $("#drum-seq-header").width(1271).height(30)
      $('#lead-select-container').css('margin-left', '3em')
      tempo.resize(70, 70)
    } else if(mq[61].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(32)
      $("#drum-seq-header").width(1271).height(32)
      tempo.resize(70, 70)
    } else if(mq[62].matches) {
      height = 320
      leadSeq.resize(616, height)
      bassSeq.resize(616, height)
      drumSeq.resize(1274.5, height)
      $(".synth-seq-header").width(616).height(35)
      $("#drum-seq-header").width(1274.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[63].matches) {
      height = 320
      leadSeq.resize(617.5, height)
      bassSeq.resize(617.5, height)
      drumSeq.resize(1285, height)
      $(".synth-seq-header").width(617.5).height(35)
      $("#drum-seq-header").width(1285).height(35)
      tempo.resize(80, 80)
    } else if(mq[64].matches) {
      height = 320
      leadSeq.resize(620, height)
      bassSeq.resize(620, height)
      drumSeq.resize(1288, height)
      $(".synth-seq-header").width(620).height(35)
      $("#drum-seq-header").width(1288).height(35)
      tempo.resize(80, 80)
    } else if(mq[65].matches) {
      height = 320
      leadSeq.resize(640, height)
      bassSeq.resize(640, height)
      drumSeq.resize(1329.5, height)
      $(".synth-seq-header").width(640).height(35)
      $("#drum-seq-header").width(1329.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[66].matches) {
      height = 320
      leadSeq.resize(660, height)
      bassSeq.resize(660, height)
      drumSeq.resize(1360, height)
      $(".synth-seq-header").width(660).height(35)
      $("#drum-seq-header").width(1360).height(35)
      tempo.resize(80, 80)
    } else if(mq[67].matches) {
      height = 400
      leadSeq.resize(680, height)
      bassSeq.resize(680, height)
      drumSeq.resize(1412.5, height)
      $(".synth-seq-header").width(680).height(35)
      $("#drum-seq-header").width(1412.5).height(35)
    } else if(mq[68].matches) {
      height = 400
      leadSeq.resize(700, height)
      bassSeq.resize(700, height)
      drumSeq.resize(1454, height)
      $(".synth-seq-header").width(700).height(35)
      $("#drum-seq-header").width(1454).height(35)
    } else if(mq[69].matches) {
      height = 400
      leadSeq.resize(720, height)
      bassSeq.resize(720, height)
      drumSeq.resize(1493.5, height)
      $(".synth-seq-header").width(720).height(35)
      $("#drum-seq-header").width(1493.5).height(35)
    } else if(mq[70].matches) {
      height = 400
      leadSeq.resize(740, height)
      bassSeq.resize(740, height)
      drumSeq.resize(1533, height)
      $(".synth-seq-header").width(740).height(35)
      $("#drum-seq-header").width(1533).height(35)
    } else if(mq[71].matches) {
      height = 400
      leadSeq.resize(780, height)
      bassSeq.resize(780, height)
      drumSeq.resize(1612, height)
      $(".synth-seq-header").width(780).height(35)
      $("#drum-seq-header").width(1612).height(35)
    } else if(mq[72].matches) {
      height = 400
      leadSeq.resize(820, height)
      bassSeq.resize(820, height)
      drumSeq.resize(1693, height)
      $(".synth-seq-header").width(820).height(35)
      $("#drum-seq-header").width(1693).height(35)
    } else if(mq[73].matches) {
      height = 400
      leadSeq.resize(860, height)
      bassSeq.resize(860, height)
      drumSeq.resize(1772, height)
      $(".synth-seq-header").width(860).height(35)
      $("#drum-seq-header").width(1772).height(35)
    } else if(mq[74].matches) {
      height = 400
      leadSeq.resize(900, height)
      bassSeq.resize(900, height)
      drumSeq.resize(1851, height)
      $(".synth-seq-header").width(900).height(35)
      $("#drum-seq-header").width(1851).height(35)
    } else if(mq[75].matches) { 
      height = 400
      leadSeq.resize(940, height)
      bassSeq.resize(940, height)
      drumSeq.resize(1932, height)
      $(".synth-seq-header").width(940).height(35)
      $("#drum-seq-header").width(1932).height(35)
    } else if(mq[76].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[77].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[78].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[79].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[80].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[81].matches) {
      height = 160
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[82].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[83].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[84].matches) {
      height = 160 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[85].matches) {
      height = 160 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[86].matches) {
      height = 200 
      leadSeq.resize(424, height)
      bassSeq.resize(424, height)
      drumSeq.resize(856, height)
      $(".synth-seq-header").width(424).height(20)
      $("#drum-seq-header").width(856).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[87].matches) { 
      height = 200
      leadSeq.resize(455, height)
      bassSeq.resize(455, height)
      drumSeq.resize(917, height)
      $(".synth-seq-header").width(455).height(20)
      $("#drum-seq-header").width(917).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[88].matches) { 
      height = 200
      leadSeq.resize(480, height)
      bassSeq.resize(480, height)
      drumSeq.resize(968, height)
      $(".synth-seq-header").width(480).height(24)
      $("#drum-seq-header").width(968).height(24)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[89].matches) {
      height = 200
      leadSeq.resize(500, height)
      bassSeq.resize(500, height)
      drumSeq.resize(1007, height)
      $(".synth-seq-header").width(500).height(24.5)
      $("#drum-seq-header").width(1007).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[90].matches) {
      height = 200
      leadSeq.resize(522, height)
      bassSeq.resize(522, height)
      drumSeq.resize(1051, height)
      $(".synth-seq-header").width(522).height(24.5)
      $("#drum-seq-header").width(1051).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[91].matches) {
      height = 280
      leadSeq.resize(540, height)
      bassSeq.resize(540, height)
      drumSeq.resize(1090, height)
      $(".synth-seq-header").width(540).height(26)
      $("#drum-seq-header").width(1090).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[92].matches) {
      height = 280
      leadSeq.resize(561.5, height)
      bassSeq.resize(561.5, height)
      drumSeq.resize(1133, height)
      $(".synth-seq-header").width(561.5).height(26)
      $("#drum-seq-header").width(1133).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[93].matches) {
      height = 280
      leadSeq.resize(576, height)
      bassSeq.resize(576, height)
      drumSeq.resize(1162, height)
      $(".synth-seq-header").width(576).height(26)
      $("#drum-seq-header").width(1162).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[94].matches) {
      height = 280
      leadSeq.resize(588, height)
      bassSeq.resize(588, height)
      drumSeq.resize(1186, height)
      $(".synth-seq-header").width(588).height(29)
      $("#drum-seq-header").width(1186).height(29)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[95].matches) {
      height = 280
      leadSeq.resize(602, height)
      bassSeq.resize(602, height)
      drumSeq.resize(1215, height)
      $(".synth-seq-header").width(602).height(30)
      $("#drum-seq-header").width(1215).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[96].matches) {
      height = 280
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[97].matches) {
      height = 300
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      tempo.resize(70, 70)
    } else if(mq[98].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(30)
      $("#drum-seq-header").width(1271).height(30)
      $('#lead-select-container').css('margin-left', '3em')
      tempo.resize(70, 70)
    } else if(mq[99].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(32)
      $("#drum-seq-header").width(1271).height(32)
      tempo.resize(70, 70)
    } else if(mq[100].matches) {
      height = 320
      leadSeq.resize(616, height)
      bassSeq.resize(616, height)
      drumSeq.resize(1274.5, height)
      $(".synth-seq-header").width(616).height(35)
      $("#drum-seq-header").width(1274.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[101].matches) {
      height = 320
      leadSeq.resize(617.5, height)
      bassSeq.resize(617.5, height)
      drumSeq.resize(1285, height)
      $(".synth-seq-header").width(617.5).height(35)
      $("#drum-seq-header").width(1285).height(35)
      tempo.resize(80, 80)
    } else if(mq[102].matches) {
      height = 320
      leadSeq.resize(620, height)
      bassSeq.resize(620, height)
      drumSeq.resize(1288, height)
      $(".synth-seq-header").width(620).height(35)
      $("#drum-seq-header").width(1288).height(35)
      tempo.resize(80, 80)
    } else if(mq[103].matches) {
      height = 320
      leadSeq.resize(640, height)
      bassSeq.resize(640, height)
      drumSeq.resize(1329.5, height)
      $(".synth-seq-header").width(640).height(35)
      $("#drum-seq-header").width(1329.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[104].matches) {
      height = 320
      leadSeq.resize(660, height)
      bassSeq.resize(660, height)
      drumSeq.resize(1360, height)
      $(".synth-seq-header").width(660).height(35)
      $("#drum-seq-header").width(1360).height(35)
      tempo.resize(80, 80)
    } else if(mq[105].matches) {
      height = 400
      leadSeq.resize(680, height)
      bassSeq.resize(680, height)
      drumSeq.resize(1412.5, height)
      $(".synth-seq-header").width(680).height(35)
      $("#drum-seq-header").width(1412.5).height(35)
    } else if(mq[106].matches) {
      height = 400
      leadSeq.resize(700, height)
      bassSeq.resize(700, height)
      drumSeq.resize(1454, height)
      $(".synth-seq-header").width(700).height(35)
      $("#drum-seq-header").width(1454).height(35)
    } else if(mq[107].matches) {
      height = 400
      leadSeq.resize(720, height)
      bassSeq.resize(720, height)
      drumSeq.resize(1493.5, height)
      $(".synth-seq-header").width(720).height(35)
      $("#drum-seq-header").width(1493.5).height(35)
    } else if(mq[108].matches) {
      height = 400
      leadSeq.resize(740, height)
      bassSeq.resize(740, height)
      drumSeq.resize(1533, height)
      $(".synth-seq-header").width(740).height(35)
      $("#drum-seq-header").width(1533).height(35)
    } else if(mq[109].matches) {
      height = 400
      leadSeq.resize(780, height)
      bassSeq.resize(780, height)
      drumSeq.resize(1612, height)
      $(".synth-seq-header").width(780).height(35)
      $("#drum-seq-header").width(1612).height(35)
    } else if(mq[110].matches) {
      height = 400
      leadSeq.resize(820, height)
      bassSeq.resize(820, height)
      drumSeq.resize(1693, height)
      $(".synth-seq-header").width(820).height(35)
      $("#drum-seq-header").width(1693).height(35)
    } else if(mq[111].matches) {
      height = 400
      leadSeq.resize(860, height)
      bassSeq.resize(860, height)
      drumSeq.resize(1772, height)
      $(".synth-seq-header").width(860).height(35)
      $("#drum-seq-header").width(1772).height(35)
    } else if(mq[112].matches) {
      height = 400
      leadSeq.resize(900, height)
      bassSeq.resize(900, height)
      drumSeq.resize(1851, height)
      $(".synth-seq-header").width(900).height(35)
      $("#drum-seq-header").width(1851).height(35)
    } else if(mq[113].matches) { 
      height = 400
      leadSeq.resize(940, height)
      bassSeq.resize(940, height)
      drumSeq.resize(1932, height)
      $(".synth-seq-header").width(940).height(35)
      $("#drum-seq-header").width(1932).height(35)
    } else if(mq[114].matches) {
      height = 220
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[115].matches) {
      height = 220
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[116].matches) {
      height = 220
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[117].matches) {
      height = 260
      leadSeq.resize(268, height)
      bassSeq.resize(268, height)
      drumSeq.resize(546, height)
      $(".synth-seq-header").width(268).height(16)
      $("#drum-seq-header").width(546).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[118].matches) {
      height = 300 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[119].matches) {
      height = 300 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[120].matches) {
      height = 300 
      leadSeq.resize(318, height)
      bassSeq.resize(318, height)
      drumSeq.resize(644, height)
      $(".synth-seq-header").width(318).height(16)
      $("#drum-seq-header").width(644).height(16)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[121].matches) {
      height = 300 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[122].matches) {
      height = 300 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[123].matches) {
      height = 300 
      leadSeq.resize(368, height)
      bassSeq.resize(368, height)
      drumSeq.resize(742, height)
      $(".synth-seq-header").width(368).height(20)
      $("#drum-seq-header").width(742).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(45, 45)
    } else if(mq[124].matches) {
      height = 300 
      leadSeq.resize(424, height)
      bassSeq.resize(424, height)
      drumSeq.resize(856, height)
      $(".synth-seq-header").width(424).height(20)
      $("#drum-seq-header").width(856).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[125].matches) { 
      height = 300
      leadSeq.resize(455, height)
      bassSeq.resize(455, height)
      drumSeq.resize(917, height)
      $(".synth-seq-header").width(455).height(20)
      $("#drum-seq-header").width(917).height(20)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[126].matches) { 
      height = 300
      leadSeq.resize(480, height)
      bassSeq.resize(480, height)
      drumSeq.resize(968, height)
      $(".synth-seq-header").width(480).height(24)
      $("#drum-seq-header").width(968).height(24)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[127].matches) {
      height = 300
      leadSeq.resize(500, height)
      bassSeq.resize(500, height)
      drumSeq.resize(1007, height)
      $(".synth-seq-header").width(500).height(24.5)
      $("#drum-seq-header").width(1007).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[128].matches) {
      height = 300
      leadSeq.resize(522, height)
      bassSeq.resize(522, height)
      drumSeq.resize(1051, height)
      $(".synth-seq-header").width(522).height(24.5)
      $("#drum-seq-header").width(1051).height(24.5)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[129].matches) {
      height = 300
      leadSeq.resize(540, height)
      bassSeq.resize(540, height)
      drumSeq.resize(1090, height)
      $(".synth-seq-header").width(540).height(26)
      $("#drum-seq-header").width(1090).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(55, 55)
    } else if(mq[130].matches) {
      height = 300
      leadSeq.resize(561.5, height)
      bassSeq.resize(561.5, height)
      drumSeq.resize(1133, height)
      $(".synth-seq-header").width(561.5).height(26)
      $("#drum-seq-header").width(1133).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[131].matches) {
      height = 300
      leadSeq.resize(576, height)
      bassSeq.resize(576, height)
      drumSeq.resize(1162, height)
      $(".synth-seq-header").width(576).height(26)
      $("#drum-seq-header").width(1162).height(26)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[132].matches) {
      height = 300
      leadSeq.resize(588, height)
      bassSeq.resize(588, height)
      drumSeq.resize(1186, height)
      $(".synth-seq-header").width(588).height(29)
      $("#drum-seq-header").width(1186).height(29)
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[133].matches) {
      height = 300
      leadSeq.resize(602, height)
      bassSeq.resize(602, height)
      drumSeq.resize(1215, height)
      $(".synth-seq-header").width(602).height(30)
      $("#drum-seq-header").width(1215).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[134].matches) {
      height = 300
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      $("#drum-effect-header").html('FX')
      abbreviateEffects()
      tempo.resize(65, 65)
    } else if(mq[135].matches) {
      height = 300
      leadSeq.resize(606, height)
      bassSeq.resize(606, height)
      drumSeq.resize(1240, height)
      $(".synth-seq-header").width(606).height(30)
      $("#drum-seq-header").width(1240).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
      tempo.resize(70, 70)
    } else if(mq[136].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(30)
      $("#drum-seq-header").width(1271).height(30)
      $('#lead-select-container').css('margin-left', '3em')
      tempo.resize(70, 70)
    } else if(mq[137].matches) {
      height = 300
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(1271, height)
      $(".synth-seq-header").width(614).height(32)
      $("#drum-seq-header").width(1271).height(32)
      tempo.resize(70, 70)
    } else if(mq[138].matches) {
      height = 300
      leadSeq.resize(616, height)
      bassSeq.resize(616, height)
      drumSeq.resize(1274.5, height)
      $(".synth-seq-header").width(616).height(35)
      $("#drum-seq-header").width(1274.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[139].matches) {
      height = 300
      leadSeq.resize(617.5, height)
      bassSeq.resize(617.5, height)
      drumSeq.resize(1285, height)
      $(".synth-seq-header").width(617.5).height(35)
      $("#drum-seq-header").width(1285).height(35)
      tempo.resize(80, 80)
    } else if(mq[140].matches) {
      height = 300
      leadSeq.resize(620, height)
      bassSeq.resize(620, height)
      drumSeq.resize(1288, height)
      $(".synth-seq-header").width(620).height(35)
      $("#drum-seq-header").width(1288).height(35)
      tempo.resize(80, 80)
    } else if(mq[141].matches) {
      height = 300
      leadSeq.resize(640, height)
      bassSeq.resize(640, height)
      drumSeq.resize(1329.5, height)
      $(".synth-seq-header").width(640).height(35)
      $("#drum-seq-header").width(1329.5).height(35)
      tempo.resize(80, 80)
    } else if(mq[142].matches) {
      height = 300
      leadSeq.resize(660, height)
      bassSeq.resize(660, height)
      drumSeq.resize(1360, height)
      $(".synth-seq-header").width(660).height(35)
      $("#drum-seq-header").width(1360).height(35)
      tempo.resize(80, 80)
    } else if(mq[143].matches) {
      height = 340
      leadSeq.resize(680, height)
      bassSeq.resize(680, height)
      drumSeq.resize(1412.5, height)
      $(".synth-seq-header").width(680).height(35)
      $("#drum-seq-header").width(1412.5).height(35)
    } else if(mq[144].matches) {
      height = 340
      leadSeq.resize(700, height)
      bassSeq.resize(700, height)
      drumSeq.resize(1454, height)
      $(".synth-seq-header").width(700).height(35)
      $("#drum-seq-header").width(1454).height(35)
    } else if(mq[145].matches) {
      height = 340
      leadSeq.resize(720, height)
      bassSeq.resize(720, height)
      drumSeq.resize(1493.5, height)
      $(".synth-seq-header").width(720).height(35)
      $("#drum-seq-header").width(1493.5).height(35)
    } else if(mq[146].matches) {
      height = 340
      leadSeq.resize(740, height)
      bassSeq.resize(740, height)
      drumSeq.resize(1533, height)
      $(".synth-seq-header").width(740).height(35)
      $("#drum-seq-header").width(1533).height(35)
    } else if(mq[147].matches) {
      height = 340
      leadSeq.resize(780, height)
      bassSeq.resize(780, height)
      drumSeq.resize(1612, height)
      $(".synth-seq-header").width(780).height(35)
      $("#drum-seq-header").width(1612).height(35)
    } else if(mq[148].matches) {
      height = 340
      leadSeq.resize(820, height)
      bassSeq.resize(820, height)
      drumSeq.resize(1693, height)
      $(".synth-seq-header").width(820).height(35)
      $("#drum-seq-header").width(1693).height(35)
    } else if(mq[149].matches) {
      height = 340
      leadSeq.resize(860, height)
      bassSeq.resize(860, height)
      drumSeq.resize(1772, height)
      $(".synth-seq-header").width(860).height(35)
      $("#drum-seq-header").width(1772).height(35)
    } else if(mq[150].matches) {
      height = 340
      leadSeq.resize(900, height)
      bassSeq.resize(900, height)
      drumSeq.resize(1851, height)
      $(".synth-seq-header").width(900).height(35)
      $("#drum-seq-header").width(1851).height(35)
    } else if(mq[151].matches) { 
      height = 340
      leadSeq.resize(940, height)
      bassSeq.resize(940, height)
      drumSeq.resize(1932, height)
      $(".synth-seq-header").width(940).height(35)
      $("#drum-seq-header").width(1932).height(35)
    }
  }
  resizeSequencers()
  // resizeSequencersResponsively()
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