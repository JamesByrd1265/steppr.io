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
  window.matchMedia('(min-width: 0px) and (max-width: 524px)'),    //0
  window.matchMedia('(min-width: 525px) and (max-width: 574px)'),    //1
  window.matchMedia('(min-width: 575px) and (max-width: 64px)'),    //2
  window.matchMedia('(min-width: 625px) and (max-width: 674px)'),    //3
  window.matchMedia('(min-width: 675px) and (max-width: 724px)'),    //4
  window.matchMedia('(min-width: 725px) and (max-width: 774px)'),    //5
  window.matchMedia('(min-width: 775px) and (max-width: 824px)'),   //6--
  window.matchMedia('(min-width: 825px) and (max-width: 874px)'),  //7
  window.matchMedia('(min-width: 875px) and (max-width: 924px)'),  //8
  window.matchMedia('(min-width: 925px) and (max-width: 974px)'),  //9
  window.matchMedia('(min-width: 975px) and (max-width: 1024px)'),  //10
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px)'),  //11
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px)'),  //12
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px)'),  //13
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px)'),  //14
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px)'),  //15
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px)'),  //16
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px)'),  //17
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px)'),  //18
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px)'),  //19
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px)'),  //20
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px)'),  //21
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px)'),  //22
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px)'),  //23
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px)'),  //24
  window.matchMedia('(min-width: 1703px) and (max-width: 1724px)'),  //25
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px)'),  //26*
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px)'),  //27
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px)'),  //28
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px)'),  //29
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px)'),  //30
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px)'),  //31
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px)'),  //32
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px)'),  //33
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px)'),  //34
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px)'),  //35
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px)'),  //36
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px)'), //37
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px)'), //38
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px)'), //39
  window.matchMedia('(min-width: 2497px)'),                         //40
  window.matchMedia('(min-width: 0px) and (max-width: 524px) and (max-height: 0px)'),    //41
  window.matchMedia('(min-width: 575px) and (max-width: 64px) and (max-height: 0px)'),   //42
  window.matchMedia('(min-width: 625px) and (max-width: 674px) and (max-height: 0px)'),    //43
  window.matchMedia('(min-width: 675px) and (max-width: 724px)'),    //44
  window.matchMedia('(min-width: 725px) and (max-width: 774px) and (max-height: 0px)'),    //45
  window.matchMedia('(min-width: 775px) and (max-width: 824px) and (max-height: 0px)'),   //46--
  window.matchMedia('(min-width: 825px) and (max-width: 874px) and (max-height: 0px)'),  //47
  window.matchMedia('(min-width: 875px) and (max-width: 924px) and (max-height: 0px)'),  //48
  window.matchMedia('(min-width: 925px) and (max-width: 974px) and (max-height: 0px)'),  //49
  window.matchMedia('(min-width: 975px) and (max-width: 1024px) and (max-height: 0px)'),  //50
  window.matchMedia('(min-width: 1025px) and (max-width: 1074px) and (max-height: 0px)'),  //51
  window.matchMedia('(min-width: 1075px) and (max-width: 1124px) and (max-height: 0px)'),  //52
  window.matchMedia('(min-width: 1125px) and (max-width: 1174px) and (max-height: 0px)'),  //53
  window.matchMedia('(min-width: 1175px) and (max-width: 1224px) and (max-height: 0px)'),  //54
  window.matchMedia('(min-width: 1225px) and (max-width: 1274px) and (max-height: 0px)'),  //55
  window.matchMedia('(min-width: 1275px) and (max-width: 1324px) and (max-height: 0px)'),  //56
  window.matchMedia('(min-width: 1325px) and (max-width: 1374px) and (max-height: 0px)'),  //57
  window.matchMedia('(min-width: 1375px) and (max-width: 1424px) and (max-height: 0px)'),  //58
  window.matchMedia('(min-width: 1425px) and (max-width: 1467px) and (max-height: 0px)'),  //59
  window.matchMedia('(min-width: 1468px) and (max-width: 1534px) and (max-height: 0px)'),  //60
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px) and (max-height: 0px)'),  //61
  window.matchMedia('(min-width: 1575px) and (max-width: 1624px) and (max-height: 0px)'),  //62
  window.matchMedia('(min-width: 1625px) and (max-width: 1654px) and (max-height: 0px)'),  //63
  window.matchMedia('(min-width: 1655px) and (max-width: 1702px) and (max-height: 1000px)'),  //64
  window.matchMedia('(min-width: 1703px) and (max-width: 1724px) and (max-height: 1000px)'),  //65
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px) and (max-height: 1000px)'),  //66*
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px) and (max-height: 1000px)'),  //67
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px) and (max-height: 1000px)'),  //68
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px) and (max-height: 1000px)'),  //69
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px) and (max-height: 1000px)'),  //70
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px) and (max-height: 1000px)')  //71                           //41
]

let height = 400, synthWidth = 940, drumWidth = 1932

const resizeSequencersResponsively = () => {
  mq[67].addListener(e => {
    if(e.matches) {
        height = 320
        leadSeq.resize(616, height)
        bassSeq.resize(616, height)
        drumSeq.resize(1274.5, height)
        $(".synth-seq-header").width(616).height(35)
        $("#drum-seq-header").width(1274.5).height(35)
        tempo.resize(80, 80)
    }
  })
  mq[68].addListener(e => {
    if(e.matches) {
        height = 320
        leadSeq.resize(617.5, height)
        bassSeq.resize(617.5, height)
        drumSeq.resize(1285, height)
        $(".synth-seq-header").width(617.5).height(35)
        $("#drum-seq-header").width(1285).height(35)
        tempo.resize(80, 80)
    }
  })
  mq[69].addListener(e => {
    if(e.matches) {
        height = 320
        leadSeq.resize(620, height)
        bassSeq.resize(620, height)
        drumSeq.resize(1288, height)
        $(".synth-seq-header").width(620).height(35)
        $("#drum-seq-header").width(1288).height(35)
        tempo.resize(80, 80)
    }
  })
  mq[70].addListener(e => {
    if(e.matches) {
        height = 320
        leadSeq.resize(640, height)
        bassSeq.resize(640, height)
        drumSeq.resize(1329.5, height)
        $(".synth-seq-header").width(640).height(35)
        $("#drum-seq-header").width(1329.5).height(35)
        tempo.resize(80, 80)
    }
  })
  mq[71].addListener(e => {
    if(e.matches) {
        height = 320
        leadSeq.resize(660, height)
        bassSeq.resize(660, height)
        drumSeq.resize(1360, height)
        $(".synth-seq-header").width(660).height(35)
        $("#drum-seq-header").width(1360).height(35)
        tempo.resize(80, 80)
    }
  })
  mq[5].addListener(e => {
    if(e.matches) { 
      height = 220
      synthWidth = 266
      drumWidth = 540
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(16)
      $("#drum-seq-header").width(drumWidth).height(16)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[6].addListener(e => {
    if(e.matches) {
      height = 260
      synthWidth = 292
      drumWidth = 592
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(16)
      $("#drum-seq-header").width(drumWidth).height(16)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[7].addListener(e => {
    if(e.matches) {
      height = 300
      synthWidth = 318
      drumWidth = 644
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(16)
      $("#drum-seq-header").width(drumWidth).height(16)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[8].addListener(e => {
    if(e.matches) {
      height = 320
      synthWidth = 332
      drumWidth = 670
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(16)
      $("#drum-seq-header").width(drumWidth).height(16)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[9].addListener(e => {
    if(e.matches) {
      height = 340
      synthWidth = 356
      drumWidth = 722
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(19)
      $("#drum-seq-header").width(drumWidth).height(19)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[10].addListener(e => {
    if(e.matches) {
      height = 360
      synthWidth = 368
      drumWidth = 742
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(20)
      $("#drum-seq-header").width(drumWidth).height(20)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[11].addListener(e => {
    if(e.matches) {
      height = 360
      synthWidth = 388
      drumWidth = 782
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(20)
      $("#drum-seq-header").width(drumWidth).height(20)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[12].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 400
      drumWidth = 808
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(21)
      $("#drum-seq-header").width(drumWidth).height(21)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[13].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 424
      drumWidth = 854
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(20)
      $("#drum-seq-header").width(drumWidth).height(20)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[14].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 455
      drumWidth = 917
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(20)
      $("#drum-seq-header").width(drumWidth).height(20)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[15].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 480
      drumWidth = 968
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(24)
      $("#drum-seq-header").width(drumWidth).height(24)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[16].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 500
      drumWidth = 1007
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(24.5)
      $("#drum-seq-header").width(drumWidth).height(24.5)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[17].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 522
      drumWidth = 1051
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(26)
      $("#drum-seq-header").width(drumWidth).height(26)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[18].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 540
      drumWidth = 1090
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(26)
      $("#drum-seq-header").width(drumWidth).height(26)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[19].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 561.5
      drumWidth = 1133
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(26)
      $("#drum-seq-header").width(drumWidth).height(26)
      $("#drum-effect-header").html('FX')
    }
  })
  mq[20].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 576
      drumWidth = 1162
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(26)
      $("#drum-seq-header").width(drumWidth).height(26)
    }
  })
  mq[21].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 588
      drumWidth = 1186
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(29)
      $("#drum-seq-header").width(drumWidth).height(29)
    }
  })
  mq[22].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 602
      drumWidth = 1215
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(30)
      $("#drum-seq-header").width(drumWidth).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
    }
  })
  mq[23].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 606
      drumWidth = 1240
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(30)
      $("#drum-seq-header").width(drumWidth).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
    }
  })
  mq[24].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 606
      drumWidth = 1240
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(30)
      $("#drum-seq-header").width(drumWidth).height(30)
      $('#lead-select-container').css('margin-left', '2.7em')
    }
  })
  mq[25].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 614
      drumWidth = 1271
      leadSeq.resize(614, height)
      bassSeq.resize(614, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(30)
      $("#drum-seq-header").width(drumWidth).height(30)
      $('#lead-select-container').css('margin-left', '3em')
    }
  })
  mq[26].addListener(e => {
    if(e.matches) {
      height = 380
      synthWidth = 614
      drumWidth = 1271
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(32)
      $("#drum-seq-header").width(drumWidth).height(32)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[27].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 616
      drumWidth = 1274.5
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[28].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 617.5
      drumWidth = 1285
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[29].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 620
      drumWidth = 1288
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[30].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 640
      drumWidth = 1329.5
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[31].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 660
      drumWidth = 1371
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[32].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 680
      drumWidth = 1412.5
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[33].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 700
      drumWidth = 1454
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[34].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 720
      drumWidth = 1493.5
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[35].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 740
      drumWidth = 1533
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[36].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 780
      drumWidth = 1612
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[37].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 820
      drumWidth = 1693
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[38].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 860
      drumWidth = 1772
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[39].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 900
      drumWidth = 1851
      leadSeq.resize(synthWidth, height)
      bassSeq.resize(synthWidth, height)
      drumSeq.resize(drumWidth, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[40].addListener(e => {
    if(e.matches) {
      height = 400
      synthWidth = 940
      drumWidth = 1932
      leadSeq.resize(940, height)
      bassSeq.resize(940, height)
      drumSeq.resize(1932, height)
      $(".synth-seq-header").width(synthWidth).height(35)
      $("#drum-seq-header").width(drumWidth).height(35)
      $('#lead-select-container').css('margin-left', '60px')
    }
  })
  mq[41].addListener(e => {
    if(e.matches) {
      $("#drum-delay").html('DELY')
      $("#drum-reverb").html('REVR')
      $("#drum-phaser").html('PHSR')
      $("#drum-chorus").html('CHOR')
      $("#drum-distortion").html('DSTR')
      $("#drum-bitcrusher").html('BTCR')
      $("#drum-autofilter").html('FLTR')
      $("#drum-pingpong").html('PPDL')
    } else {
      $("#drum-delay").html('DELAY')
      $("#drum-reverb").html('REVERB')
      $("#drum-phaser").html('PHASER')
      $("#drum-chorus").html('CHORUS')
      $("#drum-distortion").html('DISTORTION')
      $("#drum-bitcrusher").html('BITCRUSHER')
      $("#drum-autofilter").html('AUTOFILTER')
      $("#drum-pingpong").html('PINGPONG')
    }
  })
}

const setup = () => {
  document.body.appendChild(canvas)
  setupSequencers()
  const resizeSequencers = () => {
    if(mq[45].matches) { 
        height = 220
        leadSeq.resize(266, height)
        bassSeq.resize(266, height)
        drumSeq.resize(540, height)
        $(".synth-seq-header").width(266).height(16)
        $("#drum-seq-header").width(540).height(16)
        $("#drum-effect-header").html('FX')

    } else if(mq[46].matches) { 
        height = 260
        leadSeq.resize(292, height)
        bassSeq.resize(292, height)
        drumSeq.resize(592, height)
        $(".synth-seq-header").width(292).height(16)
        $("#drum-seq-header").width(592).height(16)
        $("#drum-effect-header").html('FX')

    } else if(mq[47].matches) {
        height = 300 
        leadSeq.resize(318, height)
        bassSeq.resize(318, height)
        drumSeq.resize(644, height)
        $(".synth-seq-header").width(318).height(16)
        $("#drum-seq-header").width(644).height(16)
        $("#drum-effect-header").html('FX')

    } else if(mq[48].matches) { 
        height = 320 
        leadSeq.resize(332, height)
        bassSeq.resize(332, height)
        drumSeq.resize(670, height)
        $(".synth-seq-header").width(332).height(16)
        $("#drum-seq-header").width(670).height(16)
        $("#drum-effect-header").html('FX')

    } else if(mq[49].matches) {
        height = 3400
        leadSeq.resize(356, height)
        bassSeq.resize(356, height)
        drumSeq.resize(722, height)
        $(".synth-seq-header").width(356).height(19)
        $("#drum-seq-header").width(722).height(19)
        $("#drum-effect-header").html('FX')

    } else if(mq[50].matches) {
        height = 3600
        leadSeq.resize(368, height)
        bassSeq.resize(368, height)
        drumSeq.resize(742, height)
        $(".synth-seq-header").width(368).height(20)
        $("#drum-seq-header").width(742).height(20)
        $("#drum-effect-header").html('FX')

    } else if(mq[51].matches) {
        height = 3600
        leadSeq.resize(388, height)
        bassSeq.resize(388, height)
        drumSeq.resize(782, height)
        $(".synth-seq-header").width(388).height(20)
        $("#drum-seq-header").width(782).height(20)
        $("#drum-effect-header").html('FX')

    } else if(mq[52].matches) {
        height = 3800
        leadSeq.resize(400, height)
        bassSeq.resize(400, height)
        drumSeq.resize(808, height)
        $(".synth-seq-header").width(400).height(21)
        $("#drum-seq-header").width(808).height(21)
        $("#drum-effect-header").html('FX')

    } else if(mq[53].matches) {
        height = 3800
        leadSeq.resize(424, height)
        bassSeq.resize(424, height)
        drumSeq.resize(854, height)
        $(".synth-seq-header").width(424).height(20)
        $("#drum-seq-header").width(854).height(20)
        $("#drum-effect-header").html('FX')

    } else if(mq[54].matches) { 
        height = 300
        leadSeq.resize(455, height)
        bassSeq.resize(455, height)
        drumSeq.resize(917, height)
        $(".synth-seq-header").width(455).height(20)
        $("#drum-seq-header").width(917).height(20)
        $("#drum-effect-header").html('FX')

    } else if(mq[55].matches) { 
        height = 300
        leadSeq.resize(480, height)
        bassSeq.resize(480, height)
        drumSeq.resize(968, height)
        $(".synth-seq-header").width(480).height(24)
        $("#drum-seq-header").width(968).height(24)
        $("#drum-effect-header").html('FX')

    } else if(mq[56].matches) {
        height = 300
        leadSeq.resize(500, height)
        bassSeq.resize(500, height)
        drumSeq.resize(1007, height)
        $(".synth-seq-header").width(500).height(24.5)
        $("#drum-seq-header").width(1007).height(24.5)
        $("#drum-effect-header").html('FX')

    } else if(mq[57].matches) {
        height = 300
        leadSeq.resize(522, height)
        bassSeq.resize(522, height)
        drumSeq.resize(1051, height)
        $(".synth-seq-header").width(522).height(24.5)
        $("#drum-seq-header").width(1051).height(24.5)
        $("#drum-effect-header").html('FX')

    } else if(mq[58].matches) {
        height = 300
        leadSeq.resize(540, height)
        bassSeq.resize(540, height)
        drumSeq.resize(1090, height)
        $(".synth-seq-header").width(540).height(26)
        $("#drum-seq-header").width(1090).height(26)
        $("#drum-effect-header").html('FX')

    } else if(mq[59].matches) {
        height = 300
        leadSeq.resize(561.5, height)
        bassSeq.resize(561.5, height)
        drumSeq.resize(1133, height)
        $(".synth-seq-header").width(561.5).height(26)
        $("#drum-seq-header").width(1133).height(26)
        $("#drum-effect-header").html('FX')

    } else if(mq[60].matches) {
        height = 300
        leadSeq.resize(576, height)
        bassSeq.resize(576, height)
        drumSeq.resize(1162, height)
        $(".synth-seq-header").width(576).height(26)
        $("#drum-seq-header").width(1162).height(26)

    } else if(mq[61].matches) {
        height = 300
        leadSeq.resize(588, height)
        bassSeq.resize(588, height)
        drumSeq.resize(1186, height)
        $(".synth-seq-header").width(588).height(29)
        $("#drum-seq-header").width(1186).height(29)

    } else if(mq[62].matches) {
        height = 300
        leadSeq.resize(602, height)
        bassSeq.resize(602, height)
        drumSeq.resize(1215, height)
        $(".synth-seq-header").width(602).height(30)
        $("#drum-seq-header").width(1215).height(30)
        $('#lead-select-container').css('margin-left', '2.7em')

    } else if(mq[63].matches) {
        height = 300
        leadSeq.resize(606, height)
        bassSeq.resize(606, height)
        drumSeq.resize(1240, height)
        $(".synth-seq-header").width(606).height(30)
        $("#drum-seq-header").width(1240).height(30)
        $('#lead-select-container').css('margin-left', '2.7em')

    } else if(mq[64].matches) {
        height = 300
        leadSeq.resize(606, height)
        bassSeq.resize(606, height)
        drumSeq.resize(1240, height)
        $(".synth-seq-header").width(606).height(30)
        $("#drum-seq-header").width(1240).height(30)
        $('#lead-select-container').css('margin-left', '2.7em')
        tempo.resize(70, 70)
    } else if(mq[65].matches) {
        height = 300
        leadSeq.resize(614, height)
        bassSeq.resize(614, height)
        drumSeq.resize(1271, height)
        $(".synth-seq-header").width(614).height(30)
        $("#drum-seq-header").width(1271).height(30)
        $('#lead-select-container').css('margin-left', '3em')
        tempo.resize(70, 70)
    } else if(mq[66].matches) {
        height = 300
        leadSeq.resize(614, height)
        bassSeq.resize(614, height)
        drumSeq.resize(1271, height)
        $(".synth-seq-header").width(614).height(32)
        $("#drum-seq-header").width(1271).height(32)
        tempo.resize(70, 70)
    } else if(mq[67].matches) {
        height = 320
        leadSeq.resize(616, height)
        bassSeq.resize(616, height)
        drumSeq.resize(1274.5, height)
        $(".synth-seq-header").width(616).height(35)
        $("#drum-seq-header").width(1274.5).height(35)
        tempo.resize(80, 80)
    } else if(mq[68].matches) {
        height = 320
        leadSeq.resize(617.5, height)
        bassSeq.resize(617.5, height)
        drumSeq.resize(1285, height)
        $(".synth-seq-header").width(617.5).height(35)
        $("#drum-seq-header").width(1285).height(35)
        tempo.resize(80, 80)
    } else if(mq[69].matches) {
        height = 320
        leadSeq.resize(620, height)
        bassSeq.resize(620, height)
        drumSeq.resize(1288, height)
        $(".synth-seq-header").width(620).height(35)
        $("#drum-seq-header").width(1288).height(35)
        tempo.resize(80, 80)
    } else if(mq[70].matches) {
        height = 320
        leadSeq.resize(640, height)
        bassSeq.resize(640, height)
        drumSeq.resize(1329.5, height)
        $(".synth-seq-header").width(640).height(35)
        $("#drum-seq-header").width(1329.5).height(35)
        tempo.resize(80, 80)
    } else if(mq[71].matches) {
        height = 320
        leadSeq.resize(660, height)
        bassSeq.resize(660, height)
        drumSeq.resize(1360, height)
        $(".synth-seq-header").width(660).height(35)
        $("#drum-seq-header").width(1360).height(35)
        tempo.resize(80, 80)
    } else if(mq[5].matches) { 
        height = 220
        leadSeq.resize(266, height)
        bassSeq.resize(266, height)
        drumSeq.resize(540, height)
        $(".synth-seq-header").width(266).height(16)
        $("#drum-seq-header").width(540).height(16)
        $("#drum-effect-header").html('FX')
    } else if(mq[6].matches) { 
        height = 260
        leadSeq.resize(292, height)
        bassSeq.resize(292, height)
        drumSeq.resize(592, height)
        $(".synth-seq-header").width(292).height(16)
        $("#drum-seq-header").width(592).height(16)
        $("#drum-effect-header").html('FX')
    } else if(mq[7].matches) {
        height = 300 
        leadSeq.resize(318, height)
        bassSeq.resize(318, height)
        drumSeq.resize(644, height)
        $(".synth-seq-header").width(318).height(16)
        $("#drum-seq-header").width(644).height(16)
        $("#drum-effect-header").html('FX')
    } else if(mq[8].matches) { 
        height = 320 
        leadSeq.resize(332, height)
        bassSeq.resize(332, height)
        drumSeq.resize(670, height)
        $(".synth-seq-header").width(332).height(16)
        $("#drum-seq-header").width(670).height(16)
        $("#drum-effect-header").html('FX')
    } else if(mq[9].matches) {
        height = 340 
        leadSeq.resize(356, height)
        bassSeq.resize(356, height)
        drumSeq.resize(722, height)
        $(".synth-seq-header").width(356).height(19)
        $("#drum-seq-header").width(722).height(19)
        $("#drum-effect-header").html('FX')
    } else if(mq[10].matches) {
        height = 360 
        leadSeq.resize(368, height)
        bassSeq.resize(368, height)
        drumSeq.resize(742, height)
        $(".synth-seq-header").width(368).height(20)
        $("#drum-seq-header").width(742).height(20)
        $("#drum-effect-header").html('FX')
    } else if(mq[11].matches) {
        height = 360 
        leadSeq.resize(388, height)
        bassSeq.resize(388, height)
        drumSeq.resize(782, height)
        $(".synth-seq-header").width(388).height(20)
        $("#drum-seq-header").width(782).height(20)
        $("#drum-effect-header").html('FX')
    } else if(mq[12].matches) {
        height = 380 
        leadSeq.resize(400, height)
        bassSeq.resize(400, height)
        drumSeq.resize(808, height)
        $(".synth-seq-header").width(400).height(21)
        $("#drum-seq-header").width(808).height(21)
        $("#drum-effect-header").html('FX')
    } else if(mq[13].matches) {
        height = 380 
        leadSeq.resize(424, height)
        bassSeq.resize(424, height)
        drumSeq.resize(854, height)
        $(".synth-seq-header").width(424).height(20)
        $("#drum-seq-header").width(854).height(20)
        $("#drum-effect-header").html('FX')
    } else if(mq[14].matches) { 
        height = 380
        leadSeq.resize(455, height)
        bassSeq.resize(455, height)
        drumSeq.resize(917, height)
        $(".synth-seq-header").width(455).height(20)
        $("#drum-seq-header").width(917).height(20)
        $("#drum-effect-header").html('FX')
    } else if(mq[15].matches) { 
        height = 380
        leadSeq.resize(480, height)
        bassSeq.resize(480, height)
        drumSeq.resize(968, height)
        $(".synth-seq-header").width(480).height(24)
        $("#drum-seq-header").width(968).height(24)
        $("#drum-effect-header").html('FX')
    } else if(mq[16].matches) {
        height = 380
        leadSeq.resize(500, height)
        bassSeq.resize(500, height)
        drumSeq.resize(1007, height)
        $(".synth-seq-header").width(500).height(24.5)
        $("#drum-seq-header").width(1007).height(24.5)
        $("#drum-effect-header").html('FX')
    } else if(mq[17].matches) {
        height = 380
        leadSeq.resize(522, height)
        bassSeq.resize(522, height)
        drumSeq.resize(1051, height)
        $(".synth-seq-header").width(522).height(24.5)
        $("#drum-seq-header").width(1051).height(24.5)
        $("#drum-effect-header").html('FX')
    } else if(mq[18].matches) {
        height = 380
        leadSeq.resize(540, height)
        bassSeq.resize(540, height)
        drumSeq.resize(1090, height)
        $(".synth-seq-header").width(540).height(26)
        $("#drum-seq-header").width(1090).height(26)
        $("#drum-effect-header").html('FX')
    } else if(mq[19].matches) {
        height = 380
        leadSeq.resize(561.5, height)
        bassSeq.resize(561.5, height)
        drumSeq.resize(1133, height)
        $(".synth-seq-header").width(561.5).height(26)
        $("#drum-seq-header").width(1133).height(26)
        $("#drum-effect-header").html('FX')
    } else if(mq[20].matches) {
        height = 380
        leadSeq.resize(576, height)
        bassSeq.resize(576, height)
        drumSeq.resize(1162, height)
        $(".synth-seq-header").width(576).height(26)
        $("#drum-seq-header").width(1162).height(26)
    } else if(mq[21].matches) {
        height = 380
        leadSeq.resize(588, height)
        bassSeq.resize(588, height)
        drumSeq.resize(1186, height)
        $(".synth-seq-header").width(588).height(29)
        $("#drum-seq-header").width(1186).height(29)
    } else if(mq[22].matches) {
        height = 380
        leadSeq.resize(602, height)
        bassSeq.resize(602, height)
        drumSeq.resize(1215, height)
        $(".synth-seq-header").width(602).height(30)
        $("#drum-seq-header").width(1215).height(30)
        $('#lead-select-container').css('margin-left', '2.7em')
    } else if(mq[23].matches) {
        height = 380
        leadSeq.resize(606, height)
        bassSeq.resize(606, height)
        drumSeq.resize(1240, height)
        $(".synth-seq-header").width(606).height(30)
        $("#drum-seq-header").width(1240).height(30)
        $('#lead-select-container').css('margin-left', '2.7em')
    } else if(mq[24].matches) {
        height = 380
        leadSeq.resize(606, height)
        bassSeq.resize(606, height)
        drumSeq.resize(1240, height)
        $(".synth-seq-header").width(606).height(30)
        $("#drum-seq-header").width(1240).height(30)
        $('#lead-select-container').css('margin-left', '2.7em')
    } else if(mq[25].matches) {
        height = 380
        leadSeq.resize(614, height)
        bassSeq.resize(614, height)
        drumSeq.resize(1271, height)
        $(".synth-seq-header").width(614).height(30)
        $("#drum-seq-header").width(1271).height(30)
        $('#lead-select-container').css('margin-left', '3em')
    } else if(mq[26].matches) {
        height = 380
        leadSeq.resize(614, height)
        bassSeq.resize(614, height)
        drumSeq.resize(1271, height)
        $(".synth-seq-header").width(614).height(32)
        $("#drum-seq-header").width(1271).height(32)
    } else if(mq[27].matches) {
        height = 400
        leadSeq.resize(616, height)
        bassSeq.resize(616, height)
        drumSeq.resize(1274.5, height)
        $(".synth-seq-header").width(616).height(35)
        $("#drum-seq-header").width(1274.5).height(35)
    } else if(mq[28].matches) {
        height = 400
        leadSeq.resize(617.5, height)
        bassSeq.resize(617.5, height)
        drumSeq.resize(1285, height)
        $(".synth-seq-header").width(617.5).height(35)
        $("#drum-seq-header").width(1285).height(35)
    } else if(mq[29].matches) {
        height = 400
        leadSeq.resize(620, height)
        bassSeq.resize(620, height)
        drumSeq.resize(1288, height)
        $(".synth-seq-header").width(620).height(35)
        $("#drum-seq-header").width(1288).height(35)
    } else if(mq[30].matches) {
        height = 400
        leadSeq.resize(640, height)
        bassSeq.resize(640, height)
        drumSeq.resize(1329.5, height)
        $(".synth-seq-header").width(640).height(35)
        $("#drum-seq-header").width(1329.5).height(35)
    } else if(mq[31].matches) {
        height = 400
        leadSeq.resize(660, height)
        bassSeq.resize(660, height)
        drumSeq.resize(1371, height)
        $(".synth-seq-header").width(660).height(35)
        $("#drum-seq-header").width(1371).height(35)
    } else if(mq[32].matches) {
        height = 400
        leadSeq.resize(680, height)
        bassSeq.resize(680, height)
        drumSeq.resize(1412.5, height)
        $(".synth-seq-header").width(680).height(35)
        $("#drum-seq-header").width(1412.5).height(35)
    } else if(mq[33].matches) {
        height = 400
        leadSeq.resize(700, height)
        bassSeq.resize(700, height)
        drumSeq.resize(1454, height)
        $(".synth-seq-header").width(700).height(35)
        $("#drum-seq-header").width(1454).height(35)
    } else if(mq[34].matches) {
        height = 400
        leadSeq.resize(720, height)
        bassSeq.resize(720, height)
        drumSeq.resize(1493.5, height)
        $(".synth-seq-header").width(720).height(35)
        $("#drum-seq-header").width(1493.5).height(35)
    } else if(mq[35].matches) {
        height = 400
        leadSeq.resize(740, height)
        bassSeq.resize(740, height)
        drumSeq.resize(1533, height)
        $(".synth-seq-header").width(740).height(35)
        $("#drum-seq-header").width(1533).height(35)
    } else if(mq[36].matches) {
        height = 400
        leadSeq.resize(780, height)
        bassSeq.resize(780, height)
        drumSeq.resize(1612, height)
        $(".synth-seq-header").width(780).height(35)
        $("#drum-seq-header").width(1612).height(35)
    } else if(mq[37].matches) {
        height = 400
        leadSeq.resize(820, height)
        bassSeq.resize(820, height)
        drumSeq.resize(1693, height)
        $(".synth-seq-header").width(820).height(35)
        $("#drum-seq-header").width(1693).height(35)
    } else if(mq[38].matches) {
        height = 400
        leadSeq.resize(860, height)
        bassSeq.resize(860, height)
        drumSeq.resize(1772, height)
        $(".synth-seq-header").width(860).height(35)
        $("#drum-seq-header").width(1772).height(35)
    } else if(mq[39].matches) {
        height = 400
        leadSeq.resize(900, height)
        bassSeq.resize(900, height)
        drumSeq.resize(1851, height)
        $(".synth-seq-header").width(900).height(35)
        $("#drum-seq-header").width(1851).height(35)
    } else if(mq[40].matches) { 
        height = 400
        leadSeq.resize(940, height)
        bassSeq.resize(940, height)
        drumSeq.resize(1932, height)
        $(".synth-seq-header").width(940).height(35)
        $("#drum-seq-header").width(1932).height(35)
    } else if(mq[41].matches) {
        $("#drum-delay").html('DELY')
        $("#drum-reverb").html('REVR')
        $("#drum-phaser").html('PHSR')
        $("#drum-chorus").html('CHOR')
        $("#drum-distortion").html('DSTR')
        $("#drum-bitcrusher").html('BTCR')
        $("#drum-autofilter").html('FLTR')
        $("#drum-pingpong").html('PPDL')

    }
  }
  resizeSequencers()
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