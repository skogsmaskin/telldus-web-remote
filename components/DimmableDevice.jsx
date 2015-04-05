import React from "react";
import cx from "react/lib/cx";

import DeviceActions from "../actions/DeviceActions";
import {deviceEvents} from "../stores/DeviceEventStore"

import Spinner from './Spinner.jsx';
import Dimmer from './Dimmer.jsx';
import Switch from './Switch.jsx';

function connect(stateKey, observableFn) {
  let subscriber;
  return {
    componentDidMount() {
      subscriber = observableFn.call(this).subscribe(val => {
        this.setState({[stateKey]: val});
      })
    },
    componentWillUnmount() {
      subscriber.dispose();
    }
  }
}

function diff(n1, n2) {
  return Math.max(n1, n2) - Math.min(n1, n2);
}
export default React.createClass({
  displayName: 'DimmableDevice',

  mixins: [
    connect('queuedStatus', function () {
      return deviceEvents
        .filter(event => event.device.id == this.props.device.id)
        .filter(event => event.type == 'queuestatus')
        .map(ev => ev.device.status)
    }),
    connect('syncedStatus', function () {
      return deviceEvents
        .filter(event => event.device.id == this.props.device.id)
        .filter(event => event.type == 'devicestatus')
        .map(ev => ev.device.status)
    })
  ],

  getInitialState() {
    return {};
  },

  handleDim(ev) {
    const {device} = this.props;
    var newLevel = ev.dimlevel;
    console.log("newLevel", newLevel)
    DeviceActions.dim({deviceId: device.id, dimlevel: newLevel});
  },

  handleToggle() {
    const {device} = this.props;
    const status = this.readStatus(this.getSyncedDeviceStatus());
    const action = status.on ? 'turnOff' : 'turnOn';
    DeviceActions[action]({deviceId: device.id})
  },
  readStatus(status) {
    if (!status) {
      return null;
    }
    //const roundedDimLevel = Math.round(status.dimlevel);
    var on = status.on;
    return {
      on: on,
      dimmed: status.dimmed,
      dimlevel: (typeof status.dimlevel === 'number') ? status.dimlevel : (status.on && !status.dimmed) ? 100 : 0
    }
  },
  getSyncedDeviceStatus() {
    return this.state.syncedStatus || this.props.device.status;
  },
  isInSync() {
    if (!this.state.queuedStatus) {
      return true;
    }
  },
  render() {

    const {device} = this.props;
    const syncedStatus = this.readStatus(this.getSyncedDeviceStatus());
    const queuedStatus = this.readStatus(this.state.queuedStatus);

    const inSync = !queuedStatus || (
      diff(queuedStatus.dimlevel, syncedStatus.dimlevel) < 1 && queuedStatus.on == syncedStatus.on
    );

    const {dimlevel, on, dimmed} = (queuedStatus || syncedStatus);

    console.log("device=%s, on=%s dimlevel=%s, dimmed=%s", device.name, on, dimlevel, dimmed)

    const opacity = (dimlevel / 100) * 0.5;
    return (
      <Switch className={cx({isOn: on, isOff: !on})} on={on} onToggle={this.handleToggle}>
        <Dimmer
          value={dimlevel}
          min={0}
          max={100}
          step={1}
          amplify={1.9}
          onDim={this.handleDim}
          style={{backgroundColor: `rgba(255, 255, 200, ${opacity})`}}
          >
          <h3>
            {device.name}
          </h3>
          {!inSync && <Spinner/>}
          <span className="dimlevel">
            {
              !on ? 'OFF' : `${Math.round(dimlevel)}%`
            }
          </span>
        </Dimmer>
      </Switch>
    );
  }
});
