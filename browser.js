import 'babel/polyfill'
import attachFastClick from 'fastclick'
import {Provider} from 'react-redux'
import React from 'react'
import config from './config'
import ReactDOM from 'react-dom'
import App from './components/App'
import domready from 'domready'
import createAppStore from './lib/createAppStore'

import Debug from 'debug'

Debug.enable(config.debug)

domready(init)

function init() {
  attachFastClick(document.body)

  // Create Redux store with initial state
  const store = createAppStore(window.__SERVER_RENDERED_PROPS__)
  ReactDOM.render((
    <Provider store={store}>
      <App/>
    </Provider>
  ), document.getElementById('root'))
}