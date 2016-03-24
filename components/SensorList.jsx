import React, {PropTypes} from 'react'
import CustomPropTypes from '../lib/PropTypes'
import {flatten} from 'lodash'

export default React.createClass({
  displayName: 'SensorList',

  propTypes: {
    sensors: PropTypes.arrayOf(CustomPropTypes.sensor)
  },

  render() {
    const {sensors} = this.props
    const readings = sensors.map(sensor => {
      return Object.keys(sensor.data).map(dataType => {
        return {
          sensorId: sensor.id,
          type: dataType,
          value: sensor.data[dataType].value
        }
      })
    })
    return (
      <ul>
        {flatten(readings).map(reading => {
          const unit = reading.type === 'temperature' ? '°' : '%'
          return <li key={reading.sensorId+reading.type}>{reading.value}{unit}</li>
        })}
      </ul>
    )
  }
})
