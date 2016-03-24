function supportsCommand(device, command) {
  return device.commands.includes(command)
}
export function isSwitch(device) {
  return supportsCommand(device, 'turnOn') && supportsCommand(device, 'turnOff')
}

export function isDimmable(device) {
  return supportsCommand(device, 'dim')
}
