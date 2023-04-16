import userTypes from './user.types';
import {collection, query, where, getDocs, limit} from 'firebase/firestore';
import {db} from '../../firebase/utils';
import RNFetchBlob from 'rn-fetch-blob';
import wordsTypes from '../Words/words.types';
import loopTypes from '../Loop/loop.types';

const passedIds = [0, 2, 3, 5, 6];
export const addUserData = () => ({
  type: userTypes.USER_DATA_ADDED,
});

export const clearUserData = () => ({
  type: userTypes.REDUX_DATA_CLEARED,
});

export const clearTodayWordsBag = () => ({
  type: userTypes.CLEAR_TODAY_WORDSBAG,
});
export const resetIsDiscover = () => async dispatch => {
  console.log('resetIsDiscover start');
  dispatch({
    type: userTypes.RESET_IS_DEFAULT_DISCOVER,
  });
  dispatch({
    type: loopTypes.SET_LOOP_STEP,
    payload: 0,
  });
  dispatch({
    type: userTypes.RESET_DEFAULT_STEP,
  });
};

export const updateStepOfDefaultWordsBag =
  (defWordsBag, indexDef, selected) => async dispatch => {
    console.log('updateStepOfDefaultWordsBag start');
    dispatch({
      type: userTypes.UPDATE_STEP_OF_DEFAULT_WORDS_BAG,
    });
  };

export const modDefWoBagChange =
  (defWordsBag, indexDef, selected) => async dispatch => {
    console.log('modDefWoBagChange start');
    console.log('we will change the words bag right now');
    let oldWordsBag = defWordsBag;
    // console.log('new words bag as well', oldWordsBag);
    oldWordsBag[indexDef] = selected;
    dispatch({
      type: userTypes.MODIFY_DEFAULT_WORDS_BAG,
      payload: oldWordsBag,
    });
  };

export const modDefWoBagDelete =
  (defWordsBag, indexDef, subList, allWords) => async dispatch => {
    console.log('modDefWoBagDelete start');

    allWords[defWordsBag[indexDef].indexInAllWords].deleted = true;
    dispatch({
      type: wordsTypes.MODIF_ALL_WORDS,
      payload: allWords,
    });

    let oldWordsBag = defWordsBag;
    let oldSubList = subList;
    oldWordsBag[indexDef] = subList[0];
    oldSubList.splice(0, 1);
    dispatch({
      type: userTypes.MODIFY_DEFAULT_WORDS_BAG,
      payload: oldWordsBag,
    });
    dispatch({
      type: userTypes.MODIFY_SUB_LIST,
      payload: oldSubList,
    });
    // console.log(
    //   'allWords[defWordsBag[indexDef].indexInAllWords].deleted =>',
    //   allWords[defWordsBag[indexDef].indexInAllWords],
    //   allWords[defWordsBag[indexDef].indexInAllWords].deleted,
    // );
  };

export const loadSubList = (allWords, idsOfWordsBag) => async dispatch => {
  console.log('start loadSubList');
  let counter = 0;
  const mySubList = [];

  for (let i = 0; i < allWords.length; i++) {
    // console.log('nooon');
    if (
      !allWords[i].passed &&
      !allWords[i].deleted &&
      !idsOfWordsBag.includes(allWords[i].id)
    ) {
      // console.log('yeah we are here');
      if (counter < 3) {
        mySubList.push({
          myId: allWords[i].id,
          wordNativeLang: allWords[i].wordNativeLang,
          wordLearnedLang: allWords[i].wordLearnedLang,
          wordLevel: allWords[i].wordLevel,
          audioPath: allWords[i].audioPath,
          wordImage: allWords[i].wordImage,
          indexInAllWords: i,
        });
        counter = counter + 1;
      } else {
        break;
      }
    }
  }
  dispatch({
    type: userTypes.ADD_SUBLIST,
    payload: mySubList,
  });
};
export const todayWork = (allWords, currentWord) => async dispatch => {
  let counter = 0;
  const newData = [];
  const mySubList = [];
  const arrOfIds = [];
  // console.log('We dont have any word in the default words bag', currentWord);
  // console.log('allWords from user action', allWords);
  dispatch({
    type: userTypes.CLEAR_TODAY_WORDSBAG,
  });
  for (let i = 0; i < allWords.length; i++) {
    // if (!passedIds.includes(allWords[i].id)) {
    if (!allWords[i].passed && !allWords[i].deleted) {
      /* it will be 13 to count 12 words for the words bag*/
      if (counter < 3) {
        newData.push({
          myId: allWords[i].id,
          wordNativeLang: allWords[i].wordNativeLang,
          wordLearnedLang: allWords[i].wordLearnedLang,
          wordLevel: allWords[i].wordLevel,
          audioPath: allWords[i].audioPath,
          wordImage: allWords[i].wordImage,
          indexInAllWords: i,
        });
        arrOfIds.push(allWords[i].id);
        counter = counter + 1;
        /* it will be 23 to count 10 words for the sub list when user remove a word we can replace by a word from it*/
      } else if (counter < 6) {
        mySubList.push({
          myId: allWords[i].id,
          wordNativeLang: allWords[i].wordNativeLang,
          wordLearnedLang: allWords[i].wordLearnedLang,
          wordLevel: allWords[i].wordLevel,
          audioPath: allWords[i].audioPath,
          wordImage: allWords[i].wordImage,
          indexInAllWords: i,
        });
        counter = counter + 1;
      } else {
        break;
      }
    }
  }
  // console.log('newData =>', newData);
  dispatch({
    type: userTypes.ADD_TODAY_WORDSBAG,
    payload: newData,
    ourIds: arrOfIds,
  });
  dispatch({
    type: userTypes.ADD_SUBLIST,
    payload: mySubList,
  });
  dispatch({
    type: userTypes.UPDATE_CURRENT_WORD,
    payload: counter,
  });
};

export const addThisBagToDaysBags =
  (daysBags, defaultWordsBag, currentDay, currentWeek) => async dispatch => {
    console.log('addThisBagToDaysBags start');
    // console.log('daysBags =>', daysBags[daysBags.length]?.day);
    // console.log('defaultWordsBag =>', defaultWordsBag);
    // console.log('currentDay =>', currentDay);
    // console.log('currentWeek =>', currentWeek);
    bagObj = {};
    bagObj.day = currentDay;
    bagObj.week = currentWeek;
    bagObj.step = 0;
    const ar = [];
    defaultWordsBag.forEach(element => {
      ar.push({
        id: element.myId,
        type: 0,
        // prog: 0,
      });
    });
    bagObj.words = ar;
    // console.log('this day"s bag =>', bagObj);
    dispatch({
      type: userTypes.MODIFY_DAYS_BAGS,
      payload: bagObj,
    });
  };

export const clearDaysBags = () => async dispatch => {
  console.log('Start clearDaysBags');
  dispatch({
    type: userTypes.CLEAR_DAYS_BAGS,
  });
};
