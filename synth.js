import {EventEmitter} from 'events'
const Tone = require('Tone')

const reverb = new Tone.Freeverb().toMaster()
const vibrato = new Tone.Vibrato().toMaster()
const chorus = new Tone.Chorus().toMaster()
const delay = new Tone.PingPongDelay().toMaster()
const gain = new Tone.Gain(0.3)
// const autoFilter = new Tone.AutoFilter('8n').toMaster()
// const lfo = new Tone.LFO('4n', 1, 1)
// lfo.connect(delay)
reverb.wet.value = 1.0
vibrato.wet.value = 1.0
chorus.wet.value = 1.0
delay.wet.value = 1.0

let synths = [
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus),
  new Tone.FMSynth().chain(gain, vibrato, chorus)
]

export default synths



