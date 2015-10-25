import express from 'express'
import path from 'path'
import config from './config'
import {Provider} from 'react-redux'
import createAppStore from './lib/createAppStore'
import devErrorHandler from 'dev-error-handler'
import helmet from 'helmet'
import quickreload from 'quickreload'
import serve from 'staticr/serve'
import capture from 'error-capture-middleware'
import apiClient from './config/apiClient'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Layout from './components/Layout'
import App from './components/App'

const app = express()

export default app

app.use(helmet())

if (config.env === 'development') {
  app.use(quickreload())
}

if (config.env === 'development') {
  app.use(serve(require('./static-routes')))
}

if (config.env === 'development') {
  app.use('/', capture.js())
  app.use('/', capture.css())
}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res, next) => {

  const fetchDevices = apiClient.getDevices()
  const fetchSensors = apiClient.getSensors()

  let initialState
  try {
    initialState = {
      devices: {status: 'success', items: await fetchDevices},
      sensors: {status: 'success', items: await fetchSensors}
    }
  } catch (error) {
    return next(error)
  }
  try {

    const markup = ReactDOMServer.renderToString(
      <Provider store={createAppStore(initialState)}>
        <App/>
      </Provider>
    )

    res.status(200).send(
      ReactDOMServer.renderToStaticMarkup(
        <Layout serverRenderedMarkup={markup} serverRenderedProps={initialState}/>
      )
    )
  } catch (error) {
    return next(error)
  }
})

if (config.env === 'development') {
  app.use(devErrorHandler)
}