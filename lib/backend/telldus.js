import Rx from "rx";
import Bluebird from "bluebird";

const telldus = process.env.TELLDUS === 'mock' ? require("../mock-telldus") : require("telldus");

import {
  fromDeviceData,
  fromSensorEvent,
  fromDeviceEvent,
  fromDeviceStatusEvent,
  mergeStatus,
  translateDeviceStatus,
  translateDimlevel
} from "./DeviceDataAdapter";

const sensorsCache = {};

const tdSensorEvents = Rx.Observable.create(observable => {
  telldus.addSensorEventListener((...args) => {
    observable.onNext(fromSensorEvent(...args))
  });
});

const tdDeviceEvents = Rx.Observable.create(observable => {
  telldus.addDeviceEventListener((...args) => {
    observable.onNext(fromDeviceStatusEvent(...args))
  });
});

tdDeviceEvents.subscribe(ev => {
  sensorsCache[ev.device.id] = ev.device;
});

export const deviceEvents = Rx.Observable.merge(tdDeviceEvents.share(), tdSensorEvents.share())
export function getDevices() {
  return new Bluebird.fromNode(callback => telldus.getDevices(callback))
    .map(fromDeviceData);
}

export function getSensors() {
  return Bluebird.resolve(Object.keys(sensorsCache).map(id => sensorsCache[id]));
}

export function dim(deviceId, dimlevel) {
  return new Bluebird.fromNode(callback => telldus.dim(deviceId, translateDimlevel.percentage2octet(dimlevel), callback))
    .then(()=> translateDeviceStatus({level: dimlevel}));
}

export function turnOn(deviceId) {
  return new Bluebird.fromNode(callback => telldus.turnOn(deviceId, callback));
}

export function turnOff(deviceId) {
  return new Bluebird.fromNode(callback => telldus.turnOff(deviceId, callback));
}