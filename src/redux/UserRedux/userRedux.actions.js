import userReduxTypes from './userRedux.types';
import {auth, db} from '../../firebase/utils';
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {collection, query, where, getDocs} from 'firebase/firestore';

// export const getNewWords = async dateVar => {
//   const q = query(collection(db, 'words'), where('wordDate', '==', dateVar));
//   const ar = [];
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach(doc => {
//     // doc.data() is never undefined for query doc snapshots

//     ar.push(doc.data());
//   });
//   return ar;
// };

export const getWordsDate = async () => {
  const docRef = doc(db, 'updates', 'wordsDate');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data().dateInMs);
    return docSnap.data().dateInMs;
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!');
    return 0;
  }
};

export const createAccount =
  ({
    name,
    email,
    password,
    userNativeLang,
    userLearnedLang,
    userLevel,
    startDate,
    currentDate,
    isPremium,
    endedAt,
    startedAt,
    type,
  }) =>
  async dispatch => {
    try {
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1; //  months are 0-based
      const day = date.getDate();
      const newDate = currentYear + currentMonth + day;
      console.log('name =>', name);
      console.log('email =>', email);
      console.log('password =>', password);
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          const timestemps = new Date();
          const user = {
            uid: userCredential.user.uid,
            name,
            email,
            password,
            userUiLang: userNativeLang,
            userNativeLang: userNativeLang,
            userLearnedLang: userLearnedLang,
            userLevel: userLevel,
            startDate: startDate,
            currentDate: currentDate, // we will use day+month+year to define the current date
            passedWordsIds: [],
            deletedWordsIds: [],
            currentWeek: 1,
            currentDay: 1,
            isPremium: false,
            passedDays: [],
            streaks: 0,
            // subscription: check evrytime app open if isSubed: true && endedAt - new Date() > 0 otherwise remove subscription
            createdAt: timestemps,
            subscription: {
              endedAt: endedAt,
              startedAt: startedAt,
              isSubed: isPremium,
              type: type,
            },
          };
          await setDoc(doc(db, 'users', `${userCredential.user.uid}`), user);
          dispatch({
            type: userReduxTypes.SET_ID_USER,
            payload: userCredential.user.uid,
          });
          dispatch({
            type: userReduxTypes.USER_SIGN_UP_SUCCESS,
            payload: true,
          });
        })
        .catch(err => {
          if (err.code === 'auth/email-already-in-use') {
            const error = 'This email address is already in use!';
            console.log(error);
            dispatch({
              type: userReduxTypes.SET_ERRORS,
              payload: error,
            });
          }
          if (err.code === 'auth/invalid-email') {
            const error = 'This email address is invalid!';
            console.log(error);
            dispatch({
              type: userReduxTypes.SET_ERRORS,
              payload: error,
            });
          }
          console.log(err);
        });
    } catch (err) {
      const error = 'Please check your information again';
      dispatch({
        type: userReduxTypes.SET_ERRORS,
        payload: error,
      });
      console.log(error);
    }
  };

export const signUpUser =
  ({name, email, password, userNativeLang, userLearnedLang, userLevel}) =>
  async dispatch => {
    try {
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1; //  months are 0-based
      const day = date.getDate();
      const newDate = currentYear + currentMonth + day;
      console.log('name =>', name);
      console.log('email =>', email);
      console.log('password =>', password);
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          const timestemps = new Date();
          const user = {
            uid: userCredential.user.uid,
            name,
            email,
            password,
            userUiLang: userNativeLang,
            userNativeLang: userNativeLang,
            userLearnedLang: userLearnedLang,
            userLevel: userLevel,
            startDate: timestemps,
            currentDate: newDate, // we will use day+month+year to define the current date
            passedWordsIds: [],
            deletedWordsIds: [],
            currentWeek: 1,
            currentDay: 1,
            isPremium: false,
            passedDays: [],
            streaks: 0,
            // subscription: check evrytime app open if isSubed: true && endedAt - new Date() > 0 otherwise remove subscription
            createdAt: timestemps,
            subscription: {
              endedAt: 0,
              startedAt: 0,
              isSubed: false,
              type: '',
            },
          };
          await setDoc(doc(db, 'users', `${userCredential.user.uid}`), user);
          dispatch({
            type: userReduxTypes.SET_ID_USER,
            payload: userCredential.user.uid,
          });
          dispatch({
            type: userReduxTypes.USER_SIGN_UP_SUCCESS,
            payload: true,
          });
        })
        .catch(err => {
          if (err.code === 'auth/email-already-in-use') {
            const error = 'This email address is already in use!';
            console.log(error);
            dispatch({
              type: userReduxTypes.SET_ERRORS,
              payload: error,
            });
          }
          if (err.code === 'auth/invalid-email') {
            const error = 'This email address is invalid!';
            console.log(error);
            dispatch({
              type: userReduxTypes.SET_ERRORS,
              payload: error,
            });
          }
          console.log(err);
        });
    } catch (err) {
      const error = 'Please check your information again';
      dispatch({
        type: userReduxTypes.SET_ERRORS,
        payload: error,
      });
      console.log(error);
    }
  };

const getUserInfo = async id => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
};
export const signInUser =
  ({email, password}) =>
  async dispatch => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          const userInfo = await getUserInfo(userCredential.user.uid);
          dispatch({
            type: userReduxTypes.SET_USER_INFO,
            payload: userInfo,
          });
          dispatch({
            type: userReduxTypes.SET_ID_USER,
            payload: userCredential.user.uid,
          });
          dispatch({
            type: userReduxTypes.USER_SIGN_IN_SUCCESS,
            payload: true,
          });
        })
        .catch(err => {
          console.log('error  login => ', err);
          const error = ["These credientials dosn't much !!"];
          dispatch({
            type: userReduxTypes.SET_ERRORS,
            payload: error,
          });
        });
    } catch (err) {
      console.log('from catch in login redux actions', err);
      const error = ['Login problem'];
      dispatch({
        type: userReduxTypes.SET_ERRORS,
        payload: error,
      });
    }
  };

export const ResetErrorsState = () => async dispatch => {
  console.log('ResetErrorsState start here');
  dispatch({
    type: userReduxTypes.RESET_ERRORSSTATE_FORMS,
  });
};


export const setTrackTransparency = (isEnable) => async dispatch => {
  console.log('setTrackTransparency start here');
  dispatch({
    type: userReduxTypes.USER_TRACK_TRANSPARENCY,
    payload:isEnable
  });
};

export const setUserConcent = (isEnable) => async dispatch => {
  console.log('setTrackTransparency start here');
  dispatch({
    type: userReduxTypes.USER_EURO_CONCENT,
    payload:isEnable
  });
};
