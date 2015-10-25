const PALETTE = require('../config/palette')

exports.deviceColor = function deviceColor(deviceName) {
  const charCodes = deviceName
    .split('')
    .reduce((num, char) => num + char.charCodeAt(0), '')
  return PALETTE[Number(charCodes) % PALETTE.length]
}
