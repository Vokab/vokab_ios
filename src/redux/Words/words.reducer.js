import wordsTypes from './words.types';

const INITIAL_STATE = {
  words: [],
  wordsLoading: false,
  audioLoading: false,
};

const wordsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case wordsTypes.MODIF_ALL_WORDS:
      // console.log('MODIF_ALL_WORDS action');
      return {
        ...state,
        words: [...action.payload],
      };

    case wordsTypes.ADD_ALL_WORDS:
      return {
        ...state,
        words: action.payload,
      };
    case wordsTypes.CLEAR_ALL_WORDS:
      return {
        ...state,
        words: [],
      };
    case wordsTypes.WORDS_LOADING:
      return {
        ...state,
        wordsLoading: action.payload,
      };
    case wordsTypes.AUDIO_LOADING:
      return {
        ...state,
        audioLoading: action.payload,
      };

    default:
      return state;
  }
};
export default wordsReducer;
