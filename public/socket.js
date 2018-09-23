// const sequencer = document.createElement('sequencer')
// const socket = io(window.location.origin);
// import synths from '../synth'
// import $ from 'jquery'
// import Tone from 'tone'

// let note = 'C4', steps = [], scale = [], synth = synths[0]
// let noteOn = {
//   C5: false,
//   B4: false,
//   A4: false,
//   G4: false,
//   F4: false,
//   E4: false,
//   D4: false,
//   C4: false
// }   

// const setup = () => {
//   document.body.appendChild(sequencer)
//   setupSequencer()
// }

// const selectNote = (event) => { 
//   let step = event.target.id.slice(2)

//   if(event.target.matches(`#C4${step}`)) {
//     note = 'C4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }  
//   else if(event.target.matches(`#D4${step}`)) {
//     note = 'D4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }
//   else if(event.target.matches(`#E4${step}`)) {
//     note = 'E4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }
//   else if(event.target.matches(`#F4${step}`)) {
//     note = 'F4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }
//   else if(event.target.matches(`#G4${step}`)) {
//     note = 'G4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }
//   else if(event.target.matches(`#A4${step}`)) {
//     note = 'A4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }
//   else if(event.target.matches(`#B4${step}`)) {
//     note = 'B4'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }
//   else if(event.target.matches(`#C5${step}`)) {
//     note = 'C5'
//     noteOn[note] = !(noteOn[note])
//     socket.emit('selectStep', note, noteOn)
//   }        
// }

// const selectStep = time => {
//   synth.triggerAttackRelease(note, '64n', time) 
// }

// const repeat = time => {
//   if (noteOn[note]) selectStep(time)
// }

// const setupSequencer = () => {
//   Tone.Transport.scheduleRepeat(repeat, '2n')
//   Tone.Transport.start()

//   const stepsNodeList = window.document.querySelectorAll('div.step')
//   steps = Array.from(stepsNodeList)

//   steps.forEach((step, i) => {
//     scale = window.document.getElementById(`scale-${i+1}`)
//     synth = synths[i]
//     scale.addEventListener('click', selectNote)

//   }) 
// }

// socket.on('connect', function() {
//   console.log('I have made a persistent two-way connection to the server!')
// })

// socket.on('currentNoteState', (payload) => {
//   noteOn = payload
// })

// socket.on('selectStep', (...payload) => {
//   console.log('playing note: ', ...payload)
//   note = payload[0]
//   noteOn = payload[1]
// })


// document.addEventListener('DOMContentLoaded', setup)
