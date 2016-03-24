import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../reducers'
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware // lets us dispatch() functions
  , loggerMiddleware // neat middleware that logs actions
)(createStore)

export default function createAppStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
