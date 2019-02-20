const Tone = require('Tone')

const delay = new Tone.FeedbackDelay().toMaster()
const reverb = new Tone.Freeverb().toMaster()
const phaser = new Tone.Phaser().toMaster()
const chorus = new Tone.Chorus().toMaster()
const distortion = new Tone.Distortion().toMaster()
const bitcrusher = new Tone.BitCrusher().toMaster()
const autofilter = new Tone.AutoFilter().toMaster()
const pingpong = new Tone.PingPongDelay().toMaster()

delay.wet.value = .5
reverb.wet.value = 1
phaser.wet.value = 1
chorus.wet.value = 1
distortion.wet.value = 1
bitcrusher.wet.value = 1
autofilter.wet.value = 1
pingpong.wet.value = .5

const synthEffects = {
  delay,
  reverb,
  phaser,
  chorus,
  distortion,
  bitcrusher,
  autofilter,
  pingpong
}

export default synthEffects