const socket = io(window.location.origin);
import $ from 'jquery'
import Nexus from 'nexusui'
import Tone from 'tone'

import drumSamples from './drum-samples'
import drumEffects from './drum-effects'
const {
  drumDelay,
  drumReverb,
  drumPhaser,
  drumChorus,
  drumDistortion,
  drumBitcrusher,
  drumAutofilter,
  drumPingpong
} = drumEffects

const drumOnLoad = () => console.log('drum samples loaded')

export const drums = new Tone.Sampler(drumSamples, drumOnLoad, '/drum-samples/').chain(
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

export const drumSampleOptions = {
  cymbals, claps, shakers, openHats,
  closedHats, percussion, snares, kicks
}