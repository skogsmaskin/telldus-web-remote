import {PropTypes} from 'react'

const deviceCommands = PropTypes.arrayOf(PropTypes.oneOf([
  'turnOn',
  'turnOff',
  'dim'
]))

const device = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  commands: deviceCommands,
  model: PropTypes.shape({
    name: PropTypes.string,
    protocol: PropTypes.string
  }),
  dimmable: PropTypes.bool,
  state: PropTypes.shape({
    on: PropTypes.bool,
    dimmed: PropTypes.bool,
    dimlevel: PropTypes.number
  }),
  timestamp: PropTypes.number,
  adapter: PropTypes.string
})

const sensor = PropTypes.shape({
  id: PropTypes.number,
  type: PropTypes.oneOf([
    'temperature',
    'humidity'
  ]),
  name: PropTypes.string,
  model: PropTypes.shape({
    name: PropTypes.string,
    protocol: PropTypes.string
  }),
  value: PropTypes.string,
  timestamp: PropTypes.number,
  adapter: PropTypes.string
})


module.exports = {
  device,
  sensor,
  deviceCommands
}
