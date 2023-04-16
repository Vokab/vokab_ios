import loopTypes from './loop.types';

const INITIAL_STATE = {
  loopId: null, // 0 if default 1 if custom 2 if review 3 if daily test 4 if weekly test
  loopStep: 0,
  loopRoad: [],
  isReady: false,
  defaultWordsBagRoad: [],
  customWordsBagRoad: [],
  reviewWordsBagRoad: [],
  dailyTestRoad: [],
  weeklyTestRoad: [],
};

const loopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case loopTypes.UPDATE_WEEKLY_TEST_ROAD:
      return {
        ...state,
        weeklyTestRoad: action.payload,
      };
    case loopTypes.UPDATE_DAILY_TEST_ROAD:
      return {
        ...state,
        dailyTestRoad: action.payload,
      };
    case loopTypes.UPDATE_REVIEW_ROAD:
      return {
        ...state,
        reviewWordsBagRoad: [...action.payload],
      };
    case loopTypes.UPDATE_CUSTOM_ROAD:
      return {
        ...state,
        customWordsBagRoad: [...action.payload],
      };
    case loopTypes.CLEAR_DEFAULT_ROAD:
      return {
        ...state,
        defaultWordsBagRoad: [],
      };
    case loopTypes.UPDATE_DEFAULT_ROAD:
      // console.log('UPDATE_DEFAULT_ROAD', action.payload);
      return {
        ...state,
        defaultWordsBagRoad: [...action.payload],
      };
    case loopTypes.RESET_LOOP_STATE:
      return {
        ...state,
        isReady: false,
      };
    case loopTypes.SET_LOOP_STEP:
      return {
        ...state,
        loopStep: action.payload,
      };
    case loopTypes.SET_LOOP_ROAD:
      return {
        ...state,
        loopRoad: action.payload,
        loopId: action.thisLoopId,
      };
    case loopTypes.UPDATE_LOOP_ROAD:
      return {
        ...state,
        loopRoad: [...action.payload],
      };

    case loopTypes.RESET_LOOP_ROAD:
      return {
        ...state,
        loopRoad: [],
      };
    case loopTypes.UPDATE_LOOP_STATE:
      return {
        ...state,
        isReady: true,
      };
    case loopTypes.RESET_LOOP:
      return {
        ...state,
        loopId: null,
        loopStep: 0,
        isReady: false,
        defaultWordsBagRoad: [],
        customWordsBagRoad: [],
        reviewWordsBagRoad: [],
        dailyTestRoad: [],
        weeklyTestRoad: [],
      };
    default:
      return state;
  }
};
export default loopReducer;
