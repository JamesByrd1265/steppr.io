// import Tone from 'tone'
// import Nexus from 'nexusui'
// import synths from './synth'

// const sequencer = new Nexus.Sequencer('#synth-sequencer', {
//   'size': [400,400],
//   'mode': 'toggle',
//   'rows': 8,
//   'columns': 8
// })

// sequencer.on('step', note => {
//   if(note[7]) {
//     synths[0].triggerAttackRelease('C5', '16n')
//   }
//   if(note[6]) {
//     synths[0].triggerAttackRelease('B4', '16n')
//   }
//   if(note[5]) {
//     synths[0].triggerAttackRelease('A4', '16n')
//   }
//   if(note[4]) {
//     synths[0].triggerAttackRelease('G4', '16n')
//   }
//   if(note[3]) {
//     synths[0].triggerAttackRelease('F4', '16n')
//   }
//   if(note[2]) {
//     synths[0].triggerAttackRelease('E4', '16n')
//   }
//   if(note[1]) {
//     synths[0].triggerAttackRelease('D4', '16n')
//   }
//   if(note[0]) {
//     synths[0].triggerAttackRelease('C4', '16n') 
//   }
// })

// sequencer.start(100)