import {PropTypes} from 'react'

const deviceCommands = PropTypes.arrayOf(PropTypes.string)

const device = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  commands: deviceCommands,
  model: PropTypes.shape({
    name: PropTypes.string,
    protocol: PropTypes.string
  }),
  state: PropTypes.shape({
    on: PropTypes.bool,
    dimmed: PropTypes.bool,
    dimlevel: PropTypes.number
  }),
  timestamp: PropTypes.number,
  connector: PropTypes.string
})

const sensor = PropTypes.shape({
  id: PropTypes.number,
  type: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  model: PropTypes.string,
  protocol: PropTypes.string,
  value: PropTypes.string,
  timestamp: PropTypes.number,
  connector: PropTypes.string
})

export default {
  device,
  sensor,
  deviceCommands
}
