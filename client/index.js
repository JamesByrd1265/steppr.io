const jamCanvas = document.createElement('jamCanvas')
const socket = io(window.location.origin);
import synths from './synth'
import Nexus from 'nexusui'
import nx from 'nexusui'
console.log('NX:  ', nx)
import Tone from 'tone'
const sequencer = nx.add('sequencer')
sequencer.size = [400,400]
sequencer.mode = 'toggle'
sequencer.rows = 8
sequencer.columns = 8

const setup = () => {
  document.body.appendChild(jamCanvas)
}

const triggerNote = note => {
  synths[0].triggerAttackRelease(note, '16n')
}

sequencer.on('step', note => {
  if(note[7]) {
    triggerNote('C5')
    socket.emit('nx', note)
  }
  if(note[6]) {
    triggerNote('B4')
    socket.emit('nx', note)   
  }
  if(note[5]) {
    triggerNote('A4')
    socket.emit('nx', note)   
  }
  if(note[4]) {
    triggerNote('G4')
    socket.emit('nx', note)   
  }
  if(note[3]) {
    triggerNote('F4')
    socket.emit('nx', note)   
  }
  if(note[2]) {
    triggerNote('E4')
    socket.emit('nx', note)   
  }
  if(note[1]) {
    triggerNote('D4')
    socket.emit('nx', note)   
  }
  if(note[0]) {
    triggerNote('C4')
    socket.emit('nx', note)
  }
})

sequencer.start(100)

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('nx', (...data) => {
  console.log(...data)
  nx.onload = () => {
    // console.log('PAYLOAD:  ')
    console.log('TEST****')
    nx.sendsTo("node")
  }
})



document.addEventListener('DOMContentLoaded', setup, nx)
