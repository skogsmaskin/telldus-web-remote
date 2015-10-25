import React, {PropTypes} from'react'
import CustomPropTypes from '../lib/PropTypes'

export default React.createClass({
  displayName: 'SensorList',

  propTypes: {
    sensors: PropTypes.arrayOf(CustomPropTypes.sensor)
  },

  render() {
    const {sensors} = this.props

    return (
      <ul>
        {sensors.slice(0, 0).map(sensor => {
          const unit = sensor.type === 'temperature' ? '°' : '%'
          return <li>{sensor.value + unit}</li>
        })}
      </ul>
    )
  }
})
