const socket = io(window.location.origin);
const jamCanvas = document.createElement('jamCanvas')
import synths from './synth'
import Nexus from 'nexusui'
import nx from 'nexusui'
import Tone from 'tone'
const sequencer = nx.add('sequencer')
sequencer.size = [400,400]
sequencer.mode = 'toggle'
sequencer.rows = 8
sequencer.columns = 8

let noteStates = [0, 0, 0, 0, 0, 0, 0, 0]
let grid = [], steps = [], step = {}

const triggerNote = note => {
  synths[0].triggerAttackRelease(note, '32n')
}

const setup = () => {
  document.body.appendChild(jamCanvas)
  setupSequencer()
}

sequencer.on('change', data => {
  console.log('STEP:  ', data)
  if(!step.state && data.state) step = data
  socket.emit('selectStep', step, steps)
})

sequencer.on('step', notes => {
  if(notes[7] || noteStates[7]) {
    triggerNote('C5')
    noteStates[7] = notes[7]
    socket.emit('nx', notes)
  }
  if(notes[6] || noteStates[6]) {
    triggerNote('B4')
    noteStates[6] = notes[6]
    socket.emit('nx', notes)   
  }
  if(notes[5] || noteStates[5]) {
    triggerNote('A4')
    noteStates[5] = notes[5]
    socket.emit('nx', notes)   
  }
  if(notes[4] || noteStates[4]) {
    triggerNote('G4')
    noteStates[4] = notes[4]
    socket.emit('nx', notes)   
  }
  if(notes[3] || noteStates[3]) {
    triggerNote('F4')
    noteStates[3] = notes[3]
    socket.emit('nx', notes)   
  }
  if(notes[2] || noteStates[2]) {
    triggerNote('E4')
    noteStates[2] = notes[2]
    socket.emit('nx', notes)   
  }
  if(notes[1] || noteStates[1]) {
    triggerNote('D4')
    noteStates[1] = notes[1]
    socket.emit('nx', notes)   
  }
  if(notes[0] || noteStates[0]) {
    triggerNote('C4')
    noteStates[0] = notes[0]
    socket.emit('nx', notes)
  } 
})

const setupSequencer = () => {
  const stepsNodeList = window.document.getElementsByTagName('rect')
  grid = Array.from(stepsNodeList)
  console.log('GRID:  ', grid)
  for(let i = 0; i < grid.length; i +=8) {
    steps.push(grid.slice(i, i+8))
  }
  console.log('STEPS:  ', steps)
  sequencer.start(100)
}

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')
})

socket.on('selectStep', (...data) => {//#ccc
  console.log('DATA:  ', [...data])
  let currentStep = steps[data[0].row][data[0].column]
  // currentStep.stroke = '#ccc'
  console.log('CURRENT:  ',currentStep)
  step = data[0],
  steps = data[1]
  console.log('SELECTED STEP: ', currentStep)
})

socket.on('nx', (data) => {
  noteStates = data
})

nx.onload = function() {
  // console.log('PAYLOAD:  ')
  console.log('TEST****')
  nx.sendsTo("node")

}

document.addEventListener('DOMContentLoaded', setup)