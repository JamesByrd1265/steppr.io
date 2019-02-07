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

const mqws = [
  window.matchMedia('(min-width: 595px) and (max-width: 634px'),    //0
  window.matchMedia('(min-width: 635px) and (max-width: 674px'),    //1
  window.matchMedia('(min-width: 675px) and (max-width: 714px'),    //2
  window.matchMedia('(min-width: 715px) and (max-width: 754px'),    //3
  window.matchMedia('(min-width: 755px) and (max-width: 794px'),    //4
  window.matchMedia('(min-width: 795px) and (max-width: 834px'),    //5
  window.matchMedia('(min-width: 835px) and (max-width: 874px'),   //6
  window.matchMedia('(min-width: 875px) and (max-width: 914px'),  //7
  window.matchMedia('(min-width: 915px) and (max-width: 954px'),  //8
  window.matchMedia('(min-width: 955px) and (max-width: 1094px'),  //9
  window.matchMedia('(min-width: 1095px) and (max-width: 1134px'),  //10
  window.matchMedia('(min-width: 1135px) and (max-width: 1274px'),  //11
  window.matchMedia('(min-width: 1175px) and (max-width: 1214px'),  //12
  window.matchMedia('(min-width: 1215px) and (max-width: 1254px'),  //13
  window.matchMedia('(min-width: 1255px) and (max-width: 1294px'),  //14
  window.matchMedia('(min-width: 1295px) and (max-width: 1334px'),  //15
  window.matchMedia('(min-width: 1335px) and (max-width: 1374px'),  //16
  window.matchMedia('(min-width: 1375px) and (max-width: 1414px'),  //17
  window.matchMedia('(min-width: 1415px) and (max-width: 1454px'),  //18
  window.matchMedia('(min-width: 1455px) and (max-width: 1494px'),  //19
  window.matchMedia('(min-width: 1495px) and (max-width: 1534px'),  //20
  window.matchMedia('(min-width: 1535px) and (max-width: 1574px'),  //21
  window.matchMedia('(min-width: 1575px) and (max-width: 1614px'),  //22
  window.matchMedia('(min-width: 1615px) and (max-width: 1654px'),  //23
  window.matchMedia('(min-width: 1655px) and (max-width: 1694px'),  //24
  window.matchMedia('(min-width: 1695px) and (max-width: 1724px'),  //25
  window.matchMedia('(min-width: 1725px) and (max-width: 1774px'),  //26
  window.matchMedia('(min-width: 1775px) and (max-width: 1814px'),  //27
  window.matchMedia('(min-width: 1815px) and (max-width: 1854px'),  //28
  window.matchMedia('(min-width: 1855px) and (max-width: 1894px'),  //29
  window.matchMedia('(min-width: 1895px) and (max-width: 1934px'),  //30
  window.matchMedia('(min-width: 1935px) and (max-width: 1974px'),  //31
  window.matchMedia('(min-width: 1975px) and (max-width: 2014px'),  //32--
  window.matchMedia('(min-width: 2015px) and (max-width: 2054px'),  //33
  window.matchMedia('(min-width: 2055px) and (max-width: 2094px'),  //34
  window.matchMedia('(min-width: 2095px) and (max-width: 2174px'),  //35
  window.matchMedia('(min-width: 2175px) and (max-width: 2254px'),  //36
  window.matchMedia('(min-width: 2255px) and (max-width: 2334px)'), //37
  window.matchMedia('(min-width: 2335px) and (max-width: 2414px)'), //38
  window.matchMedia('(min-width: 2415px) and (max-width: 2496px)'), //39
  window.matchMedia('(min-width: 2497px)')                          //40
]

const resizeSequencersResponsively = () => {
  mqws[25].addListener(e => {
    if(e.matches) {
      leadSeq.resize(614, 400)
      bassSeq.resize(614, 400)
      drumSeq.resize(1271, 400)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $('.list-select').width(134)
      $('.select-sub-header').css('font-size', '16px')
      $('.select-container').width(154).css('margin-right', '.75em')
      $('#lead-select-container').css('margin-left', '3em')
      $('#drum-select-container').width(136).css('margin-right', '2em').css('margin-left', '38px')
      $('#drum-effect-container').width(136).css('margin-left', '2.2em')
      $('.drum-effect').width(100)
      $('#lead-seq').css('padding-left', '0')
      $('#lead-container').css('margin-left', '0em')
      $('#bass-seq').css('padding-left', '2em')
      $('#bass-seq-header').css('margin-left', '2em')
      $('#bass-select-container').css('margin-left', '2.2em')
      $('#lead-seq-header').css('margin-left', '0')
      $('.select-header').width(102).css('font-size', '18px')
      $('#bass-select-header').width(102)
      $('#drum-effect-header').width(103)
      $('#drum-select-header').width(104)
      $('.effect').width(132)
      $('#start').css('font-size', '1.6em').css('margin-left', '0em').css('left', '2em')
    }
  })
  mqws[26].addListener(e => {
    if(e.matches) {
      leadSeq.resize(614, 400)
      bassSeq.resize(614, 400)
      drumSeq.resize(1271, 400)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $('.list-select').width(134)
      $('.select-sub-header').css('font-size', '16px')
      $('.select-container').width(154)
      $('#drum-select-container').width(136).css('margin-right', '2.2em').css('margin-left', '61px')
      $('#drum-effect-container').width(136).css('margin-left', '2.2em')
      $('.drum-effect').width(100)
      $('#lead-seq').css('padding-left', '0')
      $('#lead-container').css('margin-left', '.6em')
      $('#bass-seq').css('padding-left', '2em')
      $('#bass-seq-header').css('margin-left', '2em')
      $('#bass-select-container').css('margin-left', '2.2em')
      $('#lead-seq-header').css('margin-left', '0')
      $('.select-header').width(102).css('font-size', '18px')
      $('#drum-effect-header').width(104)
      $('#drum-select-header').width(104)
      $('.effect').width(132)
      $('#start').css('font-size', '1.6em').css('margin-left', '0em')
    }
  })
  mqws[27].addListener(e => {
    if(e.matches) {
      leadSeq.resize(616, 400)
      bassSeq.resize(616, 400)
      drumSeq.resize(1274.5, 400)
      $(".synth-seq-header").width(616)
      $("#drum-seq-header").width(1274.5)
      $(".synth-seq-header").width(616)
      $("#drum-seq-header").width(1274.5)
      $('.list-select').width(140)
      $('#drum-select-container').width(142).css('margin-right', '2.6em').css('margin-left', '74.5px')
      $('#drum-effect-container').width(142).css('margin-left', '2.6em')
      $('#lead-seq').css('padding-left', '0')
      $('#lead-container').css('margin-left', '1.45em')
      $('#bass-seq').css('padding-left', '2em')
      $('#bass-seq-header').css('margin-left', '2em')
      $('#bass-select-container').css('margin-left', '2.6em')
      $('#lead-seq-header').css('margin-left', '0')
      $('.sub-header').width(104)
      $('#drum-effect-header').width(106)
      $('#drum-select-header').width(106)
      $('.effect').width(138)
      $('#start').css('font-size', '1.6em').css('margin-left', '.3em')
    }
  })
  mqws[28].addListener(e => {
    if(e.matches) {
      leadSeq.resize(617.5, 400)
      bassSeq.resize(617.5, 400)
      drumSeq.resize(1285, 400)
      $(".synth-seq-header").width(617.5)
      $("#drum-seq-header").width(1285)
      $(".synth-seq-header").width(617.5)
      $("#drum-seq-header").width(1285)
      $('.list-select').width(140)
      $('#drum-select-container').width(142).css('margin-right', '3.3em').css('margin-left', '80px')
      $('#drum-effect-container').width(142).css('margin-left', '3.2em')
      $('#lead-seq').css('padding-left', '14px')
      $('#bass-seq').css('padding-left', '2.3em')
      $('#bass-seq-header').css('margin-left', '2.3em')
      $('#bass-select-container').css('margin-left', '3.4em')
      $('#lead-seq-header').css('margin-left', '.9em')
      $('.sub-header').width(104)
      $('#drum-effect-header').width(106)
      $('#drum-select-header').width(106)
      $('.effect').width(138)
      $('#start').css('font-size', '1.6em').css('margin-left', '.3em')
    }
  })
  mqws[29].addListener(e => {
    if(e.matches) {
      leadSeq.resize(620, 400)
      bassSeq.resize(620, 400)
      drumSeq.resize(1288, 400)
      $(".synth-seq-header").width(620)
      $("#drum-seq-header").width(1288)
      $(".synth-seq-header").width(620)
      $("#drum-seq-header").width(1288)
      $('.list-select').width(140)
      $('#drum-select-container').width(142).css('margin-right', '3.5em')
      $('#drum-effect-container').width(142).css('margin-left', '3.45em')
      $('#lead-seq').css('padding-left', '18px')
      $('#bass-seq').css('padding-left', '2.5em')
      $('#lead-seq-header').css('margin-left', '1.1em')
      $('.sub-header').width(104)
      $('#drum-effect-header').width(106)
      $('#drum-select-header').width(106)
      $('.effect').width(138)
      $('#start').css('font-size', '1.6em').css('margin-left', '.3em')
    }
  })
  mqws[30].addListener(e => {
    if(e.matches) {
      leadSeq.resize(640, 400)
      bassSeq.resize(640, 400)
      drumSeq.resize(1329.5, 400)
      $(".synth-seq-header").width(640)
      $("#drum-seq-header").width(1329.5)
      $(".synth-seq-header").width(640)
      $("#drum-seq-header").width(1329.5)
      $('.list-select').width(144)
      $('#drum-select-container').width(146)
      $('#drum-effect-container').width(146).css('margin-left', '3.45em')
      $('#lead-seq').css('padding-left', '24px')
      $('#lead-seq-header').css('margin-left', '1.5em')
      $('.sub-header').width(108)
      $('#drum-effect-header').width(110)
      $('#drum-select-header').width(110)
      $('.effect').width(142)
      $('#start').css('font-size', '1.7em').css('margin-left', '.3em')
    }
  })
  mqws[31].addListener(e => {
    if(e.matches) {
      leadSeq.resize(660, 400)
      bassSeq.resize(660, 400)
      drumSeq.resize(1371, 400)
      // $('#tempo').css('right', '5.4em')
      $(".synth-seq-header").width(660)
      $("#drum-seq-header").width(1371)
      $(".synth-seq-header").width(660)
      $("#drum-seq-header").width(1371)
      $('.list-select').width(148)
      $('#drum-select-container').width(150).css('margin-right', '3.5em')
      $('#drum-effect-container').width(150).css('margin-left', '3.45em')
      $('#lead-seq').css('padding-left', '27px')
      $('#lead-seq-header').css('margin-left', '1.7em')
      $('.sub-header').width(112)
      $('#drum-effect-header').width(114)
      $('#drum-select-header').width(114)
      $('.effect').width(146)
      $('#start').css('font-size', '1.8em').css('margin-left', '.3em')
    }
  })
  mqws[32].addListener(e => {
    if(e.matches) {
      leadSeq.resize(680, 400)
      bassSeq.resize(680, 400)
      drumSeq.resize(1412.5, 400)
      // $('#tempo').css('right', '5.3em')
      $(".synth-seq-header").width(680)
      $("#drum-seq-header").width(1412.5)
      $(".synth-seq-header").width(680)
      $("#drum-seq-header").width(1412.5)
      $('.list-select').width(152)
      $('#drum-select-container').width(154).css('margin-right', '3.6em')
      $('#drum-effect-container').width(154)
      $('.sub-header').width(116)
      $('#drum-effect-header').width(118)
      $('#drum-select-header').width(118)
      $('.effect').width(150)
      $('#start').css('font-size', '1.9em')
    }
  })
  mqws[33].addListener(e => {
    if(e.matches) {
      leadSeq.resize(700, 400)
      bassSeq.resize(700, 400)
      drumSeq.resize(1454, 400)
      // $('#tempo').css('right', '5.2em')
      $(".synth-seq-header").width(700)
      $("#drum-seq-header").width(1454)
      $('.list-select').width(156)
      $('#lead-seq').css('padding-left', '36px')
      $('#lead-seq-header').css('margin-left', '2.25em')
      $('#drum-select-container').width(158)
      $('#drum-effect-container').width(158).css('margin-left', '3em')
      $('#bass-select-container').css('margin-left', '60px')
      $('.sub-header').width(120)
      $('#drum-effect-header').width(122)
      $('#drum-select-header').width(122)
      $('.effect').width(154)
      $('#start').css('font-size', '1.95em')
    }
  })
  mqws[34].addListener(e => {
    if(e.matches) {
      leadSeq.resize(720, 400)
      bassSeq.resize(720, 400)
      drumSeq.resize(1493.5, 400)
      // $('#tempo').css('right', '5.1em')
      $(".synth-seq-header").width(720)
      $("#drum-seq-header").width(1493.5)
      $('.list-select').width(160)
      $('#drum-select-container').width(160).css('margin-right', '3.6em')
      $('#drum-effect-container').width(160)
      $('.sub-header').width(124)
      $('.effect').width(158)
    }
  })
  mqws[35].addListener(e => {
    if(e.matches) {
      leadSeq.resize(740, 400)
      bassSeq.resize(740, 400)
      drumSeq.resize(1533, 400)
      $(".synth-seq-header").width(740)
      $("#drum-seq-header").width(1533)
    }
  })
  mqws[36].addListener(e => {
    if(e.matches) {
      leadSeq.resize(780, 400)
      bassSeq.resize(780, 400)
      drumSeq.resize(1612, 400)
      $(".synth-seq-header").width(780)
      $("#drum-seq-header").width(1612)
    }
  })
  mqws[37].addListener(e => {
    if(e.matches) {
      leadSeq.resize(820, 400)
      bassSeq.resize(820, 400)
      drumSeq.resize(1693, 400)
      $(".synth-seq-header").width(820)
      $("#drum-seq-header").width(1693)
    }
  })
  mqws[38].addListener(e => {
    if(e.matches) {
      leadSeq.resize(860, 400)
      bassSeq.resize(860, 400)
      drumSeq.resize(1772, 400)
      $(".synth-seq-header").width(860)
      $("#drum-seq-header").width(1772)
    }
  })
  mqws[39].addListener(e => {
    if(e.matches) {
      leadSeq.resize(900, 400)
      bassSeq.resize(900, 400)
      drumSeq.resize(1851, 400)
      $(".synth-seq-header").width(900)
      $("#drum-seq-header").width(1851)
    }
  })
  mqws[40].addListener(e => {
    if(e.matches) {
      leadSeq.resize(940, 400)
      bassSeq.resize(940, 400)
      drumSeq.resize(1932, 400)
      $(".synth-seq-header").width(940)
      $("#drum-seq-header").width(1932)
    }
  })
}

const setup = () => {
  document.body.appendChild(canvas)
  setupSequencers()
  const resizeSequencers = () => {
    if(mqws[25].matches) {
      leadSeq.resize(614, 400)
      bassSeq.resize(614, 400)
      drumSeq.resize(1271, 400)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $('.list-select').width(134)
      $('.select-sub-header').css('font-size', '16px')
      $('.select-container').width(154).css('margin-right', '.75em')
      $('#lead-select-container').css('margin-left', '3em')
      $('#drum-select-container').width(136).css('margin-right', '2em').css('margin-left', '38px')
      $('#drum-effect-container').width(136).css('margin-left', '2.2em')
      $('.drum-effect').width(100)
      $('#lead-seq').css('padding-left', '0')
      $('#lead-container').css('margin-left', '0em')
      $('#bass-seq').css('padding-left', '2em')
      $('#bass-seq-header').css('margin-left', '2em')
      $('#bass-select-container').css('margin-left', '2.2em')
      $('#lead-seq-header').css('margin-left', '0')
      $('.select-header').width(102).css('font-size', '18px')
      $('#bass-select-header').width(102)
      $('#drum-effect-header').width(103)
      $('#drum-select-header').width(104)
      $('.effect').width(132)
      $('#start').css('font-size', '1.6em').css('margin-left', '0em').css('left', '2em')
    }
    if(mqws[26].matches) {
      leadSeq.resize(614, 400)
      bassSeq.resize(614, 400)
      drumSeq.resize(1271, 400)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $(".synth-seq-header").width(614)
      $("#drum-seq-header").width(1271)
      $('.list-select').width(134)
      $('.select-sub-header').css('font-size', '16px')
      $('.select-container').width(154)
      $('#drum-select-container').width(136).css('margin-right', '2.2em').css('margin-left', '61px')
      $('#drum-effect-container').width(136).css('margin-left', '2.2em')
      $('.drum-effect').width(100)
      $('#lead-seq').css('padding-left', '0')
      $('#lead-container').css('margin-left', '.6em')
      $('#bass-seq').css('padding-left', '2em')
      $('#bass-seq-header').css('margin-left', '2em')
      $('#bass-select-container').css('margin-left', '2.2em')
      $('#lead-seq-header').css('margin-left', '0')
      $('.select-header').width(102).css('font-size', '18px')
      $('#bass-select-header').width(101)
      $('#drum-effect-header').width(104)
      $('#drum-select-header').width(104)
      $('.effect').width(132)
      $('#start').css('font-size', '1.6em').css('margin-left', '0em')
    }
    if(mqws[27].matches) {
      leadSeq.resize(616, 400)
      bassSeq.resize(616, 400)
      drumSeq.resize(1274.5, 400)
      $(".synth-seq-header").width(616)
      $("#drum-seq-header").width(1274.5)
      $(".synth-seq-header").width(616)
      $("#drum-seq-header").width(1274.5)
      $('.list-select').width(140)
      $('#drum-select-container').width(142).css('margin-right', '2.6em').css('margin-left', '74.5px')
      $('#drum-effect-container').width(142).css('margin-left', '2.6em')
      $('#lead-seq').css('padding-left', '0')
      $('#lead-container').css('margin-left', '1.45em')
      $('#bass-seq').css('padding-left', '2em')
      $('#bass-seq-header').css('margin-left', '2em')
      $('#bass-select-container').css('margin-left', '2.6em')
      $('#lead-seq-header').css('margin-left', '0')
      $('.select-header').width(104)
      $('#drum-effect-header').width(106)
      $('#drum-select-header').width(106)
      $('.effect').width(138)
      $('#start').css('font-size', '1.6em').css('margin-left', '.3em')
    }
    if(mqws[28].matches) {
      leadSeq.resize(617.5, 400)
      bassSeq.resize(617.5, 400)
      drumSeq.resize(1285, 400)
      $(".synth-seq-header").width(617.5)
      $("#drum-seq-header").width(1285)
      $(".synth-seq-header").width(617.5)
      $("#drum-seq-header").width(1285)
      $('.list-select').width(140)
      $('#drum-select-container').width(142).css('margin-right', '3.3em').css('margin-left', '80px')
      $('#drum-effect-container').width(142).css('margin-left', '3.2em')
      $('#lead-seq').css('padding-left', '14px')
      $('#bass-seq').css('padding-left', '2.3em')
      $('#bass-seq-header').css('margin-left', '2.3em')
      $('#bass-select-container').css('margin-left', '3.4em')
      $('#lead-seq-header').css('margin-left', '.9em')
      $('.select-header').width(104)
      $('#drum-effect-header').width(106)
      $('#drum-select-header').width(106)
      $('.effect').width(138)
      $('#start').css('font-size', '1.6em').css('margin-left', '.3em')
    }
    if(mqws[29].matches) {
      leadSeq.resize(620, 400)
      bassSeq.resize(620, 400)
      drumSeq.resize(1288, 400)
      $(".synth-seq-header").width(620)
      $("#drum-seq-header").width(1288)
      $(".synth-seq-header").width(620)
      $("#drum-seq-header").width(1288)
      $('.list-select').width(140)
      $('#drum-select-container').width(142)
      $('#drum-effect-container').width(142).css('margin-left', '3.45em')
      $('#lead-seq').css('padding-left', '18px')
      $('#bass-seq').css('padding-left', '2.5em')
      $('#lead-seq-header').css('margin-left', '1.1em')
      $('.select-header').width(104)
      $('#drum-effect-header').width(106)
      $('#drum-select-header').width(106)
      $('.effect').width(138)
      $('#start').css('font-size', '1.6em').css('margin-left', '.3em')
    }
    if(mqws[30].matches) {
      leadSeq.resize(640, 400)
      bassSeq.resize(640, 400)
      drumSeq.resize(1329.5, 400)
      $(".synth-seq-header").width(640)
      $("#drum-seq-header").width(1329.5)
      $(".synth-seq-header").width(640)
      $("#drum-seq-header").width(1329.5)
      $('.list-select').width(144)
      $('#drum-select-container').width(146)
      $('#drum-effect-container').width(146)
      $('#lead-seq').css('padding-left', '24px')
      $('#lead-seq-header').css('margin-left', '1.5em')
      $('.select-header').width(108)
      $('#drum-effect-header').width(110)
      $('#drum-select-header').width(110)
      $('.effect').width(142)
      $('#start').css('font-size', '1.7em')
    }
    if(mqws[31].matches) {
      leadSeq.resize(660, 400)
      bassSeq.resize(660, 400)
      drumSeq.resize(1371, 400)
      // $('#tempo').css('right', '5.4em')
      $(".synth-seq-header").width(660)
      $("#drum-seq-header").width(1371)
      $(".synth-seq-header").width(660)
      $("#drum-seq-header").width(1371)
      $('.list-select').width(148)
      $('#drum-select-container').width(150).css('margin-right', '3.5em')
      $('#drum-effect-container').width(150)
      $('#lead-seq').css('padding-left', '27px')
      $('#lead-seq-header').css('margin-left', '1.7em')
      $('.select-header').width(112)
      $('#drum-effect-header').width(114)
      $('#drum-select-header').width(114)
      $('.effect').width(146)
      $('#start').css('font-size', '1.8em').css('margin-left', '.3em')
    }
    if(mqws[32].matches) {
      leadSeq.resize(680, 400)
      bassSeq.resize(680, 400)
      drumSeq.resize(1412.5, 400)
      // $('#tempo').css('right', '5.3em')
      $(".synth-seq-header").width(680)
      $("#drum-seq-header").width(1412.5)
      $(".synth-seq-header").width(680)
      $("#drum-seq-header").width(1412.5)
      $('.list-select').width(152)
      $('#drum-select-container').width(154).css('margin-right', '4em')
      $('#drum-effect-container').width(154).css('margin-left', '3.45em')
      $('.select-header').width(116)
      $('#drum-effect-header').width(118)
      $('#drum-select-header').width(118)
      $('.effect').width(150)
      $('#start').css('font-size', '1.9em')
    }
    if(mqws[33].matches) {
      leadSeq.resize(700, 400)
      bassSeq.resize(700, 400)
      drumSeq.resize(1454, 400)
      // $('#tempo').css('right', '5.2em')
      $(".synth-seq-header").width(700)
      $("#drum-seq-header").width(1454)
      $('.list-select').width(156)
      $('#lead-seq').css('padding-left', '36px')
      $('#lead-seq-header').css('margin-left', '2.25em')
      $('#drum-select-container').width(158)
      $('#drum-effect-container').width(158)
      $('.select-header').width(120)
      $('#drum-effect-header').width(122)
      $('#drum-select-header').width(122)
      $('#bass-select-container').css('margin-left', '60px')
      $('.effect').width(154)
      $('#start').css('font-size', '1.95em')
    }
    if(mqws[34].matches) {
      leadSeq.resize(720, 400)
      bassSeq.resize(720, 400)
      drumSeq.resize(1493.5, 400)
      // $('#tempo').css('right', '5.1em')
      $(".synth-seq-header").width(720)
      $("#drum-seq-header").width(1493.5)
      $('.list-select').width(160) //orig 162
      $('#drum-select-container').width(160) //
      $('#drum-effect-container').width(160) //
      $('.select-header').width(124) //126
      $('.effect').width(158) ///162
    }
    if(mqws[35].matches) {
      leadSeq.resize(740, 400)
      bassSeq.resize(740, 400)
      drumSeq.resize(1533, 400)
      $(".synth-seq-header").width(740)
      $("#drum-seq-header").width(1533)
    }
    if(mqws[36].matches) {
      leadSeq.resize(780, 400)
      bassSeq.resize(780, 400)
      drumSeq.resize(1612, 400)
      $(".synth-seq-header").width(780)
      $("#drum-seq-header").width(1612)
    }
    if(mqws[37].matches) {
      leadSeq.resize(820, 400)
      bassSeq.resize(820, 400)
      drumSeq.resize(1693, 400)
      $(".synth-seq-header").width(820)
      $("#drum-seq-header").width(1693)
    }
    if(mqws[38].matches) {
      leadSeq.resize(860, 400)
      bassSeq.resize(860, 400)
      drumSeq.resize(1772, 400)
      $(".synth-seq-header").width(860)
      $("#drum-seq-header").width(1772)
    }
    if(mqws[39].matches) {
      leadSeq.resize(900, 400)
      bassSeq.resize(900, 400)
      drumSeq.resize(1851, 400)
      $(".synth-seq-header").width(900)
      $("#drum-seq-header").width(1851)
    }
    if(mqws[40].matches) { 
      leadSeq.resize(940, 400)
      bassSeq.resize(940, 400)
      drumSeq.resize(1932, 400)
      $(".synth-seq-header").width(940)
      $("#drum-seq-header").width(1932)
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