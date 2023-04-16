import userReduxTypes from './userRedux.types';

const INITIAL_STATE = {
  userNativeLang: null, // 0 if default 1 if custom 2 if review 3 if daily test 4 if weekly test
  userLearnedLang: null,
  userLevel: null,
  errors: [],
  userSignUpSuccess: false,
  userSignInSuccess: false,
  idUser: null,
  userInfo: null,
  userTrackTransparency:true,
  euroConcent:true
};

const userReduxReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userReduxTypes.USER_EURO_CONCENT:
      return {
        ...state,
        euroConcent: action.payload,
      };
    case userReduxTypes.USER_TRACK_TRANSPARENCY:
    return {
      ...state,
      userTrackTransparency: action.payload,
    };
    case userReduxTypes.USER_SIGN_UP_SUCCESS:
      return {
        ...state,
        userSignUpSuccess: action.payload,
      };
    case userReduxTypes.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case userReduxTypes.USER_SIGN_IN_SUCCESS:
      return {
        ...state,
        userSignInSuccess: action.payload,
      };
    case userReduxTypes.SET_ID_USER:
      return {
        ...state,
        idUser: action.payload,
      };
    case userReduxTypes.ADD_NATIVE_LANG:
      return {
        ...state,
        userNativeLang: action.payload,
      };
    case userReduxTypes.ADD_LEARNED_LANG:
      return {
        ...state,
        userLearnedLang: action.payload,
      };
    case userReduxTypes.ADD_LEVEL:
      return {
        ...state,
        userLevel: action.payload,
      };
    // Errors
    case userReduxTypes.RESET_ERRORSSTATE_FORMS:
      return {
        ...state,
        errors: '',
      };
    case userReduxTypes.SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case userReduxTypes.RESET_USER:
      return {
        ...state,
        userNativeLang: null,
        userLearnedLang: null,
        userLevel: null,
      };
    default:
      return state;
  }
};
export default userReduxReducer;
