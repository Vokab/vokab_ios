import loopReduxTypes from './loopRedux.types';

const INITIAL_STATE = {
  loopId: null, // 0 if default 1 if custom 2 if review 3 if daily test 4 if weekly test
  loopStep: 0,
  loopRoad: [],
  isReady: false,
  reviewBagArray: [],
  customBagArray: [],
};

const loopReduxReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case loopReduxTypes.RESET_CUSTOM_BAG_ARRAY:
      return {
        ...state,
        customBagArray: [],
      };
    case loopReduxTypes.ADD_TO_CUSTOM_BAG_ARRAY:
      return {
        ...state,
        customBagArray: [...state.customBagArray, action.payload],
      };
    case loopReduxTypes.REMOVE_FROM_CUSTOM_BAG_ARRAY:
      return {
        ...state,
        customBagArray: [...action.payload],
      };
    ////////////////////////////////////////////////////////////////////////////////////
    case loopReduxTypes.RESET_REVIEW_BAG_ARRAY:
      return {
        ...state,
        reviewBagArray: [],
      };
    case loopReduxTypes.ADD_TO_REVIEW_BAG_ARRAY:
      return {
        ...state,
        reviewBagArray: [...state.reviewBagArray, action.payload],
      };
    case loopReduxTypes.REMOVE_FROM_REVIEW_BAG_ARRAY:
      return {
        ...state,
        reviewBagArray: [...action.payload],
      };
    case loopReduxTypes.UPDATE_LOOP_STATE:
      return {
        ...state,
        isReady: true,
      };

    case loopReduxTypes.RESET_LOOP_STATE:
      return {
        ...state,
        isReady: false,
      };

    case loopReduxTypes.SET_LOOP_STEP:
      return {
        ...state,
        loopStep: action.payload,
      };
    case loopReduxTypes.SET_LOOP_ROAD:
      return {
        ...state,
        loopRoad: action.payload,
        loopId: action.thisLoopId,
      };
    case loopReduxTypes.UPDATE_LOOP_ROAD:
      return {
        ...state,
        loopRoad: [...action.payload],
      };

    case loopReduxTypes.RESET_LOOP_ROAD:
      return {
        ...state,
        loopRoad: [],
      };

    case loopReduxTypes.RESET_LOOP:
      return {
        ...state,
        loopId: null,
        loopStep: 0,
        isReady: false,
        loopRoad: [],
      };
    default:
      return state;
  }
};
export default loopReduxReducer;
