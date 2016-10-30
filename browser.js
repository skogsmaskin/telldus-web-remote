import 'babel-polyfill'
import {Provider} from 'react-redux'
import React from 'react'
import config from './config'
import ReactDOM from 'react-dom'
import App from './components/App'
import domready from 'domready'
import createAppStore from './lib/createAppStore'
import apiClient from './config/apiClient'
import 'eventsource-polyfill'
import {
  RECEIVE_DEVICE_EVENT,
  RECEIVE_SENSOR_EVENT
} from './actions/actionTypes'

import Debug from 'debug'

Debug.enable(config.debug)

domready(init)

function init() {

  // Create Redux store with initial state
  const store = createAppStore(window.__SERVER_RENDERED_PROPS__)

  apiClient.addDeviceListener(event => {
    store.dispatch({type: RECEIVE_DEVICE_EVENT, event})
  })

  apiClient.addSensorListener(event => {
    store.dispatch({type: RECEIVE_SENSOR_EVENT, event})
  })

  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'))
}
