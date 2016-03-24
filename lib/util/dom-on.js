export default function on(element, events, listener, capture) {

  const addEventListener = (element.addEventListener || element.attachEvent)

  const eventNames = Array.isArray(events) ? events : events.split(' ')

  const handler = ev => {
    listener(ev)
  }

  eventNames.forEach(eventName => {
    addEventListener.call(element, eventName, handler, capture)
  })

  return function off() {
    const removeEventListener = (element.removeEventListener || element.detachEvent)

    eventNames.forEach(eventName => {
      removeEventListener.call(element, eventName, handler, capture)
    })
  }
}

