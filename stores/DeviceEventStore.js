import Rx from "rx";
import DeviceActions from "../actions/DeviceActions";
import apiClient from "../lib/apiClient.js";
import io from 'socket.io-client'




const wsEvents = Rx.Observable.create(observable => {
  var socket = io(`ws://${document.domain}:${document.location.port}`);
  socket.on('connect', function () {
    socket.on('message', function (msg) {
      observable.onNext(JSON.parse(msg));
    });
  });

  //var ws = new WebSocket();
  //ws.onmessage = function (event) {
  //  observable.onNext(JSON.parse(event.data));
  //};
});

function createDeviceEvent(type, id, status) {
  return {type, device: {id, status}}
}

const dims = DeviceActions.dim.map(({deviceId, dimlevel}) => {
  return createDeviceEvent('queuestatus', deviceId, {dimmed: true, on: true, dimlevel})
});

const offs = DeviceActions.turnOff
  .map(({deviceId})=> ({deviceId, status: {dimmed: false, on: false}}));

const ons = DeviceActions.turnOn
  .map(({deviceId})=> ({deviceId, status: {dimmed: true, on: true}}));

const _switches = ons.merge(offs);

const switches = _switches.map(({deviceId, status})=> {
  return createDeviceEvent('queuestatus', deviceId, status)
});

const switchReqs = _switches.distinctUntilChanged()
  .flatMapLatest(({deviceId, status}) => {
    const command = status.on ? 'turnOn' : 'turnOff';
    return apiClient[command](deviceId).then(()=> {
      return createDeviceEvent('request', deviceId, {status})
    });
  });

const dimReqs = dims
  .distinctUntilChanged()
  .sample(2000)
  .flatMapLatest(ev => {
    return apiClient.dim(ev.device.id, ev.device.status.dimlevel).then(()=> {
      return createDeviceEvent('request', ev.device.id, ev.device.status)
    });
  });


export const deviceEvents = Rx.Observable.merge(dims.share(), switches.share(), switchReqs.share(), dimReqs.share(), wsEvents.share());

