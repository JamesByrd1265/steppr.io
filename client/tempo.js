const socket = io(window.location.origin);
import Nexus from 'nexusui'
import $ from 'jquery'

export const bpmConverter = ms => (60000/ms) / 4
export const tempo = new Nexus.Dial('#tempo-select', {
  'size': [90, 90],
  'interaction': 'radial',
  'mode': 'absolute',
  'value': null,
  'min': 30,
  'max': 300,
  'step': 1
})

tempo.colorize('fill', 'rgba(67, 203, 203, 0.84)')
tempo.colorize('accent', '#3D3D3D')
tempo.colorize('border', '#3D3D3D')

tempo.on('change', event => {
  $('#tempo').mouseup(() => {
    socket.emit('changeTempo', event)
  })
})

socket.on('changeTempo', data => {
  tempo.value = data
})