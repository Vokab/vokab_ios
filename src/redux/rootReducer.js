import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './User/user.reducer';
import wordsReducer from './Words/words.reducer';
import loopReducer from './Loop/loop.reducer';
import loopReduxReducer from './LoopRedux/loopRedux.reducer';
import userReduxReducer from './UserRedux/userRedux.reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // whitelist: ['bookmarks'],
};

export default combineReducers({
  user: persistReducer(persistConfig, userReducer),
  words: persistReducer(persistConfig, wordsReducer),
  loop: persistReducer(persistConfig, loopReducer),
  loopRedux: loopReduxReducer,
  userRedux: userReduxReducer,
});
