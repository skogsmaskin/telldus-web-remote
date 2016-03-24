import express from 'express'
import path from 'path'
import config from './config'
import {Provider} from 'react-redux'
import createAppStore from './lib/createAppStore'
import helmet from 'helmet'
import quickreload from 'quickreload'
import serve from 'staticr/serve'
import capture from 'error-capture-middleware'
import apiClient from './config/apiClient'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Layout from './components/Layout'
import App from './components/App'
import browserifyBundles from './static-routes/browserify-bundles'
import sassBundles from './static-routes/stylesheets'
import createWSApi from 'telldus-ws'

const app = express()

export default app

app.use(helmet())

if (config.env === 'development') {
  app.use(quickreload())
}

if (config.env === 'development') {
  app.use(serve([browserifyBundles, sassBundles]))
}

if (config.env === 'development') {
  app.use('/', capture.js())
  app.use('/', capture.css())
}

app.get('/ping', (req, res) => {
  res.status(200).send('PONG')
})

app.use(express.static(path.join(__dirname, 'public')))

const backend = config.backendName == 'mock'
  ? require('telldus-ws/build/backend-mock.js') // eslint-disable-line import/no-commonjs
  : require('telldus-ws/build/backend-telldus.js') // eslint-disable-line import/no-commonjs

app.use('/api', createWSApi({backend}))

app.get('/', (req, res, next) => {

  const fetchDevices = apiClient.getDevices()
  const fetchSensors = apiClient.getSensors()

  const loadInitialState = Promise.all([fetchDevices, fetchSensors])
    .then(([devices, sensors]) => {
      return {
        devices: {status: 'success', items: devices},
        sensors: {status: 'success', items: sensors}
      }
    })

  const getMarkup = loadInitialState.then(initialState => {
    return ReactDOMServer.renderToString(
      <Provider store={createAppStore(initialState)}>
        <App />
      </Provider>
    )
  })

  Promise.all([loadInitialState, getMarkup]).then(([initialState, markup]) => {
    res.status(200).send(
      ReactDOMServer.renderToStaticMarkup(
        <Layout serverRenderedMarkup={markup} serverRenderedProps={initialState} />
      )
    )
  })
  .catch(next)
})

if (config.env === 'development') {
  app.use(require('dev-error-handler'))
}
