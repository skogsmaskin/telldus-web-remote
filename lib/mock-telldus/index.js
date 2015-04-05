import mockDevices from "./devices.json";
import sensorEvents from "./sensor-events.json";
import deviceEvents from "./device-events.json";
import {EventEmitter} from "events";

const events = new EventEmitter();

function getDevice(id) {
  return devices.find(device=> device.id == id)
}
function map(devices, deviceId, mapFn) {
  return devices.map((device, i)=> {
    return device.id == deviceId ? mapFn(device, i) : device;
  });
}

function setStatus(deviceId, status) {
  return map(mockDevices, deviceId, device => {
    if (status.name == "ON" && device.methods.includes("DIM")) {
      status = {name: "DIM", level: device.status.level || 255};
    }
    const updated = Object.assign({}, device, {
      status: status
    });
    events.emit('device', deviceId, status);
    return updated;
  });
}

function defer(ms, callback) {
  setTimeout(callback, ms);
}

function randInt(upper) {
  return Math.floor(Math.random()*upper)
}

export default {

  getDevices(callback) {
    defer(10, () => callback(null, mockDevices));
  },

  turnOn(deviceId, callback) {
    defer(100, ()=> {
      callback(null, setStatus(deviceId, {name: 'ON'}))
    });
  },

  turnOff(deviceId, callback) {
    defer(100, () => callback(null, setStatus(deviceId, {name: 'OFF'})));
  },

  dim(deviceId, level, callback) {

    const name = level === 0 ? 'OFF' : 'DIM';

    defer(100, ()=> {
      callback(null, setStatus(deviceId, {level: level, name: name}))
    });
  },

  addSensorEventListener(listener) {
    events.addListener('sensor', listener);
    return;
    let i = 0;

    defer(1, emit);
    defer(10, emit);
    defer(randInt(1000), emit);
    defer(randInt(2000), emit);
    defer(randInt(3000), emit);
    defer(randInt(5000), emit);
    defer(randInt(10000), emit);
    defer(randInt(20000), emit);
    defer(randInt(40000), emit);
    defer(randInt(80000), emit);

    function emit() {
      const {deviceId,protocol,model,type,value,timestamp} = sensorEvents[i];
      events.emit('sensor', deviceId, protocol, model, type, value, timestamp);
      if (++i == sensorEvents.length - 1) {
        i = 0;
      }
    }
  },
  addDeviceEventListener(listener) {
    events.addListener('device', listener);

    return;
    let i = 0;

    defer(1, emit);
    defer(10, emit);
    defer(randInt(1000), emit);
    defer(randInt(2000), emit);
    defer(randInt(3000), emit);
    defer(randInt(5000), emit);
    defer(randInt(10000), emit);
    defer(randInt(20000), emit);
    defer(randInt(40000), emit);
    defer(randInt(80000), emit);

    function emit() {
      const [deviceId, newStatus] = deviceEvents[i];
      events.emit('device', deviceId, newStatus);
      if (++i == deviceEvents.length - 1) {
        i = 0;
      }
    }

  }

}
