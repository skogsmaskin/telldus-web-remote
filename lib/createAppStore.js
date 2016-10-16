import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../reducers'
import createLogger from 'redux-logger'
import config from '../config'
import {compact} from 'lodash'

const middlewares = compact([
  thunkMiddleware,
  // config.env === 'development' && createLogger()
])

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

export default function createAppStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
