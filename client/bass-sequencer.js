import socket from './index'
import synths from './synth'
import nx from 'nexusui'
import Tone from 'tone'

const triggerNote = note => {
  synths[5].triggerAttackRelease(note, '16n')
}

const bassSeq = new nx.Sequencer('#bass-seq',{
 'size': [400,400],
 'mode': 'toggle',
 'rows': 8,
 'columns': 8
})

bassSeq.on('step', notes => {
  if(notes[7]) {
    triggerNote('C3')
    socket.emit('nx', notes)
  }
  if(notes[6]) {
    triggerNote('B2')
    socket.emit('nx', notes)   
  }
  if(notes[5]) {
    triggerNote('A2')
    socket.emit('nx', notes)   
  }
  if(notes[4]) {
    triggerNote('G2')
    socket.emit('nx', notes)   
  }
  if(notes[3]) {
    triggerNote('F2')
    socket.emit('nx', notes)   
  }
  if(notes[2]) {
    triggerNote('E2')
    socket.emit('nx', notes)   
  }
  if(notes[1]) {
    triggerNote('D2')
    socket.emit('nx', notes)   
  }
  if(notes[0]) {
    triggerNote('C2')
    socket.emit('nx', notes)
  } 
})


export default bassSeq