import {EventEmitter} from 'events'
const Tone = require('Tone')

const reverb = new Tone.Freeverb().toMaster()
const vibrato = new Tone.Vibrato().toMaster()
const chorus = new Tone.Chorus().toMaster()
const delay = new Tone.PingPongDelay().toMaster()
const gain = new Tone.Gain(0.5).toMaster()
const vol = new Tone.Volume().toMaster()

reverb.wet.value = 1.0
vibrato.wet.value = 1.0
chorus.wet.value = 1.0
delay.wet.value = 1.0

let fmSynth = new Tone.FMSynth().chain(gain, vol, vibrato, chorus)
let membraneSynth = new Tone.MembraneSynth().chain(gain, vol)
let amSynth = new Tone.AMSynth().chain(gain, vol)
let metalSynth = new Tone.MetalSynth().chain(gain, vol)
let noiseSynth = new Tone.NoiseSynth().chain(gain, vol)
let pluckSynth = new Tone.PluckSynth().chain(gain, vol)
let duoSynth = new Tone.DuoSynth().chain(gain, vol)
let polySynth = new Tone.PolySynth().chain(gain, vol)

const synths = {
  fmSynth,
  membraneSynth,
  amSynth,
  metalSynth,
  noiseSynth,
  pluckSynth,
  duoSynth,
  polySynth
}

export default synths



