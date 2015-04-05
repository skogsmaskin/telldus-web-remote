import React from'react';

const TYPE_TEMPERATURE = 1;
const TYPE_HUMIDITY = 2;

export default React.createClass({
  displayName: 'Header',

  render() {
    const {sensors} = this.props;

    return (
      <div className="header">
        <ul className="sensors">
          {sensors.map(sensor => {
            let unit = sensor.type === TYPE_TEMPERATURE ? '°' : '%'
            return <li>{sensor.value + unit}</li>
          })}
        </ul>
      </div>
    );
  }
});
