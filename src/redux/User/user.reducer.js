import userTypes from './user.types';

const INITIAL_STATE = {
  userId: null,
  userNativeLang: null,
  userLearnedLang: null,
  userLevel: null,
  startDate: null,
  passedWordsIds: [],
  deletedWordsIds: [],
  currentWeek: null,
  currentDay: null,
  currentWord: 0,
  subList: [],
  defaultWordsBagIds: [],

  // Words Bags
  defaultWordsBag: [],
  customWordsBag: [],
  reviewWordsBag: [],

  // Steps Of Words Bags
  stepOfDefaultWordsBag: 0,
  stepOfCustomWordsBag: 0,
  stepOfReviewWordsBag: 0,

  // this for default and custom wordsbag // we can set 0 if discover 1 if practice 2 if master 3 if review and we can change it on the finishLoop function
  isDefaultDiscover: 0,
  isCustomDiscover: 0,
  defaultDiscPracMastPercentage: 0,

  // days and review
  daysBags: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userTypes.CLEAR_DAYS_BAGS:
      return {
        ...state,
        daysBags: [],
      };
    case userTypes.MODIFY_DAYS_BAGS:
      return {
        ...state,
        daysBags: [action.payload, ...state.daysBags],
      };

    case userTypes.RESET_IS_DEFAULT_DISCOVER:
      return {
        ...state,
        isDefaultDiscover: 0,
      };
    case userTypes.RESET_DEFAULT_STEP:
      return {
        ...state,
        stepOfDefaultWordsBag: 0,
      };
    case userTypes.UPDATE_STEP_OF_DEFAULT_WORDS_BAG:
      // console.log(
      //   'UPDATE_STEP_OF_DEFAULT_WORDS_BAG =>',
      //   state.stepOfDefaultWordsBag,
      // );
      return {
        ...state,
        stepOfDefaultWordsBag: state.stepOfDefaultWordsBag + 1,
      };
    case userTypes.UPDATE_IS_CUSTOM_DISCOVER:
      return {
        ...state,
        isCustomDiscover: state.isCustomDiscover + 1,
      };
    case userTypes.UPDATE_IS_DEFAULT_DISCOVER:
      return {
        ...state,
        isDefaultDiscover: state.isDefaultDiscover + 1,
      };

    case userTypes.MODIFY_DEFAULT_WORDS_BAG:
      const updatedWordsBag = action.payload;
      return {
        ...state,
        defaultWordsBag: [...updatedWordsBag],
      };

    case userTypes.UPDATE_CURRENT_WORD:
      return {
        ...state,
        currentWord: action.payload,
      };

    case userTypes.MODIFY_SUB_LIST:
      const updatedSubList = action.payload;
      return {
        ...state,
        subList: [...updatedSubList],
      };
    case userTypes.ADD_SUBLIST:
      return {
        ...state,
        subList: action.payload,
      };
    case userTypes.ADD_TODAY_WORDSBAG:
      return {
        ...state,
        defaultWordsBag: action.payload,
        defaultWordsBagIds: action.arrOfIds,
      };
    case userTypes.CLEAR_TODAY_WORDSBAG:
      return {
        ...state,
        defaultWordsBag: [],
        defaultWordsBagIds: [],
        stepOfDefaultWordsBag: 0,
      };

    // AUTH
    case userTypes.USER_DATA_ADDED:
      return {
        ...state,
        userId: '1255',
        userNativeLang: 0,
        userLearnedLang: 1,
        userLevel: 4,
        startDate: '8-2-2023',
        currentWeek: 1,
        currentDay: 1,
        defaultWordsBag: [],
        defaultWordsBagIds: [],
        stepOfDefaultWordsBag: 0,
        currentWord: 0,
        subList: [],
      };
    case userTypes.REDUX_DATA_CLEARED:
      return {
        ...state,
        userId: null,
        userNativeLang: null,
        userLearnedLang: null,
        userLevel: null,
        startDate: null,
        currentWeek: null,
        currentDay: null,
        defaultWordsBag: [],
        defaultWordsBagIds: [],
        stepOfDefaultWordsBag: 0,
        currentWord: 0,
        subList: [],
      };

    default:
      return state;
  }
};
export default userReducer;
