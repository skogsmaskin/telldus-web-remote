function translateMethod(method) {
  if (method === 'TURNON') {
    return 'turnOn';
  }
  if (method === 'TURNOFF') {
    return 'turnOff';
  }
  if (method === 'DIM') {
    return 'dim';
  }
}

// See https://github.com/Hexagon/node-telldus#addsensoreventlistener
// http://developer.telldus.com/doxygen/group__core.html
function translateSensorType(type) {
  switch (type) {
    case 1:
      return 'temperature';
    case 2:
      return 'humidity';
    default:
      return "n/a"
  }
}

export function fromDeviceStatusEvent(deviceId, status) {
  return {
    type: 'devicestatus',
    device: {
      id: deviceId,
      status: translateDeviceStatus(status)
    }
  }
}

export function fromSensorEvent(deviceId, protocol, model, type, value, timestamp) {
  return {
    type: 'sensordata',
    device: {
      type: translateSensorType(type),
      id: deviceId,
      model: {
        name: model,
        protocol: protocol
      },
      value: value,
      timestamp: timestamp,
      adapter: 'telldus'
    }
  }
}

export const translateDimlevel = {
  oct2percentage(dimlevel) {
    return (dimlevel / 255 * 100) || 0
  },
  percentage2octet(dimlevel) {
    return ((dimlevel / 100) * 255) || 0
  }
};

export function translateDeviceStatus(status) {
  const dimlevel = typeof status.level === 'number' ? translateDimlevel.oct2percentage(status.level) : undefined;
  const dimmed = status.name === 'DIM';
  const on = status.name === 'ON';

  return {
    on: on || dimmed,
    dimmed: dimmed,
    dimlevel: dimlevel
  }
}

export function fromDeviceData(deviceData) {
  const dimmable = deviceData.methods.includes("DIM");

  return {
    id: deviceData.id,
    name: deviceData.name,
    commands: deviceData.methods.map(translateMethod).filter(Boolean),
    model: {
      name: deviceData.model,
      protocol: deviceData.protocol
    },
    dimmable: dimmable,
    status: translateDeviceStatus(deviceData.status),
    timestamp: new Date().getTime(),
    adapter: 'telldus'
  }
}