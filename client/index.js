import Tone from 'tone'
import Nexus from 'nexusui'
import synths from '../synth'

const sequencer = new Nexus.Sequencer('#sequencer', {
  'size': [400,400],
  'mode': 'toggle',
  'rows': 8,
  'columns': 8
})

sequencer.on('step',function(evt) {
  console.log(evt)
  if(evt[7]) synths[0].triggerAttackRelease('C5', '16n')
  if(evt[6]) synths[0].triggerAttackRelease('B4', '16n')
  if(evt[5]) synths[0].triggerAttackRelease('A4', '16n')
  if(evt[4]) synths[0].triggerAttackRelease('G4', '16n')
  if(evt[3]) synths[0].triggerAttackRelease('F4', '16n')
  if(evt[2]) synths[0].triggerAttackRelease('E4', '16n')
  if(evt[1]) synths[0].triggerAttackRelease('D4', '16n')
  if(evt[0]) synths[0].triggerAttackRelease('C4', '16n') 
})

sequencer.start(100)