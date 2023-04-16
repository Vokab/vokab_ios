/* eslint-disable prettier/prettier */
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import {persistStore} from 'redux-persist';

// export const middlewares  = [logger, thunk];
export const middlewares = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

export const persistor = persistStore(store);
export default store;
