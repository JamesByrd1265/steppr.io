const socket = io(window.location.origin);
const canvas = document.createElement('canvas')
import Nexus from 'nexusui'
import Tone from 'tone'
import $ from 'jquery'
import synths, {vol, gain} from './synths'
import synthEffects from './synth-effects'
import {setupDrumSelects} from './drum-selects'
import {setupDrumEffects} from './drum-effects'
import resizeOnload from './resize-onload'
import resizeResponsively from './resize-responsively'

import {bpmConverter, tempo} from './tempo'
export var bpm = 125

import {leadSeq, leadVol, selectLead, selectLeadEffect} from './lead-sequencer'
import {bassSeq, bassVol, selectBass, selectBassEffect} from './bass-sequencer'
import {drumSeq, drumVol, selectDrum, selectDrumEffect,
  selectCymbal, selectClap, selectShaker, selectOpenHat,
  selectClosedHat, selectPerc, selectSnare, selectKick} from './drum-sequencer'

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

const setupSequencers = () => {
  $("#start").on('click', start)
  $("#lead-select").on('change', selectLead)
  $("#bass-select").on('change', selectBass)
  $("#lead-effect-select").on('change', selectLeadEffect)
  $("#bass-effect-select").on('change', selectBassEffect)
  setupDrumSelects()
  setupDrumEffects()
}

export const resizeSequencers = (seqH, synthW, drumW, headerH, tempoR) => {
  leadSeq.resize(synthW, seqH)
  bassSeq.resize(synthW, seqH)
  drumSeq.resize(drumW, seqH)
  $(".synth-seq-header").width(synthW).height(headerH)
  $("#drum-seq-header").width(drumW).height(headerH)
  if(tempoR) tempo.resize(tempoR, tempoR)
}

const setup = () => {
  document.body.appendChild(canvas)
  resizeResponsively()
  resizeOnload()
  setupSequencers()
}

socket.on('connect', () => {
  console.log('I have made a persistent two-way connection to the server!')
})  

document.addEventListener('DOMContentLoaded', setup)

if(typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
   var resumeAudio = function() {
      if(typeof g_WebAudioContext == "undefined" || g_WebAudioContext == null) return;
      if(g_WebAudioContext.state == "suspended") g_WebAudioContext.resume();
      document.removeEventListener("click", resumeAudio);
   };
   document.addEventListener("click", resumeAudio);
}