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

let fm = new Tone.FMSynth().chain(gain, vol, vibrato, chorus)
let membrane = new Tone.MembraneSynth().chain(gain, vol)
let am = new Tone.AMSynth().chain(gain, vol)
let metal = new Tone.MetalSynth().chain(gain, vol)
let noise = new Tone.NoiseSynth().chain(gain, vol)
let pluck = new Tone.PluckSynth().chain(gain, vol)
let duo = new Tone.DuoSynth().chain(gain, vol)
let poly = new Tone.PolySynth().chain(gain, vol)
let fmBass = new Tone.FMSynth().chain(gain, vol, vibrato, chorus)
let membraneBass = new Tone.MembraneSynth().chain(gain, vol)
let amBass = new Tone.AMSynth().chain(gain, vol)
let metalBass = new Tone.MetalSynth().chain(gain, vol)
let noiseBass = new Tone.NoiseSynth().chain(gain, vol)
let pluckBass = new Tone.PluckSynth().chain(gain, vol)
let duoBass = new Tone.DuoSynth().chain(gain, vol)
let polyBass = new Tone.PolySynth().chain(gain, vol)

const synths = {
  fm,
  membrane,
  am,
  pluck,
  duo,
  poly,
  fmBass,
  membraneBass,
  amBass,
  pluckBass,
  duoBass,
  polyBass
}

export default synths



