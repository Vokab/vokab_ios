import loopTypes from './loop.types';
import userTypes from '../User/user.types';

import {TaskV4} from '../../realm/models/Task';
import {Word} from '../../realm/models/Word';
import {User} from '../../realm/models/User';
import {Loop, Road} from '../../realm/models/Loop';

export const loopFunct = () => async dispatch => {
  console.log('loopFunct start');
};

export const constructDef = async (
  defaultWordsBag,
  isDefaultDiscover,
  defOrCus,
) => {
  console.log('defOrCus', defOrCus);
  console.log('defaultWordsBag', defaultWordsBag);
  console.log('isDefaultDiscover', isDefaultDiscover);
  let screens = [];
  if (isDefaultDiscover === 0) {
    // This is for Default Bag :
    // screens = [1, 2, 3, 4]; // this is for discover
    // screens = [5, 6, 4, 7]; // this is for practice
    // screens = [8, 9, 10, 6]; // this is for master

    // This is for Custom Bag :
    // screens = [1, 2, 3, 4]; // this is for discover
    // screens = [5, 6, 4, 7]; // this is for practice
    // screens = [8, 4, 7, 6]; // this is for master
    // screens = [8, 9, 10, 6];
    screens = [1, 2, 3, 4];
  } else if (isDefaultDiscover === 1) {
    screens = [5, 6, 4, 7];
  } else if (isDefaultDiscover === 2) {
    if (defOrCus === 0) {
      screens = [8, 9, 10, 6];
    } else {
      screens = [8, 4, 7, 6];
    }
  }
  const roadArray = [];

  defaultWordsBag.forEach(item => {
    screens.forEach(screenItem => {
      let newObj = {};
      newObj.wordObj = item;
      newObj.screen = screenItem;
      newObj.string;
      const myJSON_Object = JSON.stringify(newObj);
      roadArray.push(myJSON_Object);
    });
  });

  if (isDefaultDiscover === 2) {
    return roadArray.sort(() => 0.5 - Math.random());
  } else {
    return roadArray;
  }
};

// const shuffle = async array => {
//   let currentIndex = array.length,
//     randomIndex;
//   // While there remain elements to shuffle.
//   while (currentIndex != 0) {
//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex],
//       array[currentIndex],
//     ];
//   }
//   // setShuffledArray(array);
//   return array;
// };

export const constructReview = async reviewWordsBag => {
  let screens = [3, 4];
  let result;
  let defaultScreens = [4, 6, 8, 7, 6, 12, 10, 9];
  let customScreens = [8, 4, 7, 6];
  const roadArray = [];
  reviewWordsBag.forEach(item => {
    if (item.wordType === 0) {
      const shuffledArray = defaultScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 3); // gets first n elements after shuffle
      console.log('result are =>', result);
    } else if (item.wordType === 1) {
      const shuffledArray = customScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 3); // gets first n elements after shuffle
      console.log('result are =>', result);
    }
    result.forEach(screenItem => {
      let newObj = {};
      newObj.wordObj = item;
      newObj.screen = screenItem;
      newObj.string;
      const myJSON_Object = JSON.stringify(newObj);
      roadArray.push(myJSON_Object);
    });
  });

  return roadArray;
};

export const constructReadyReview = async reviewWordsBag => {
  // const n = 3; // number of elements we want to get
  let screens = [1, 3];
  let result;
  let defaultScreens = [4, 6, 8, 7, 6, 12, 10, 9];
  let customScreens = [8, 4, 7, 6];
  const roadArray = [];
  reviewWordsBag.forEach(item => {
    if (item.wordType === 0) {
      const shuffledArray = defaultScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 3); // gets first n elements after shuffle
      console.log('result are =>', result);
    } else if (item.wordType === 1) {
      const shuffledArray = customScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 3); // gets first n elements after shuffle
      console.log('result are =>', result);
    }
    console.log('this word item is =>', item.wordType);
    result.forEach(screenItem => {
      let newObj = {};
      newObj.wordObj = item;
      newObj.screen = screenItem;
      newObj.string;
      roadArray.push(newObj);
    });
  });

  return roadArray.sort(() => 0.5 - Math.random());
};

export const constructDailyTest = async wordsPassedYesterday => {
  console.log('constructDailyTest start');
  let testArray = wordsPassedYesterday;
  let defaultScreens = [4, 6, 8, 7, 6, 12, 10, 9];
  let customScreens = [8, 4, 7, 6];
  let result;

  const roadArray = [];
  if (wordsPassedYesterday.length > 12) {
    const shuffledArray = wordsPassedYesterday.sort(() => 0.5 - Math.random()); // shuffles array
    testArray = shuffledArray.slice(0, 12); // gets first n elements after shuffle
  }
  testArray.forEach(item => {
    if (item.wordType === 0) {
      const shuffledArray = defaultScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 2); // gets first n elements after shuffle
    } else if (item.wordType === 1) {
      const shuffledArray = customScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 2); // gets first n elements after shuffle
    }
    result.forEach(screenItem => {
      let newObj = {};
      newObj.wordObj = item;
      newObj.screen = screenItem;
      newObj.string;
      const myJSON_Object = JSON.stringify(newObj);
      roadArray.push(myJSON_Object);
    });
  });
  return roadArray;
};

export const constructWeeklyTest = async wordsPassedThisWeek => {
  console.log('constructWeeklyTest start');
  let testArray = [];
  let defaultScreens = [4, 6, 8, 7, 6, 12, 10, 9];
  let customScreens = [8, 4, 7, 6];
  let result;

  const roadArray = [];

  const shuffledArray = wordsPassedThisWeek.sort(() => 0.5 - Math.random()); // shuffles array
  testArray = shuffledArray.slice(0, 50); // gets first n elements after shuffle

  testArray.forEach(item => {
    if (item.wordType === 0) {
      const shuffledArray = defaultScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 2); // gets first n elements after shuffle
    } else if (item.wordType === 1) {
      const shuffledArray = customScreens.sort(() => 0.5 - Math.random()); // shuffles array
      result = shuffledArray.slice(0, 2); // gets first n elements after shuffle
    }
    result.forEach(screenItem => {
      let newObj = {};
      newObj.wordObj = item;
      newObj.screen = screenItem;
      newObj.string;
      const myJSON_Object = JSON.stringify(newObj);
      roadArray.push(myJSON_Object);
    });
  });
  return roadArray;
};

function sleep(ms) {
  console.log('sleep start');
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const constructDefaultBagRoad =
  (defaultWordsBag, stepOfDefaultWordsBag, isDefaultDiscover) =>
  async dispatch => {
    console.log('constructDefaultBagRoad start', isDefaultDiscover); // 0
    const ar = await constructDef(defaultWordsBag, isDefaultDiscover);
    dispatch({
      type: loopTypes.UPDATE_DEFAULT_ROAD,
      payload: ar,
    });
    dispatch({
      type: loopTypes.SET_LOOP_STEP,
      payload: stepOfDefaultWordsBag,
    });
    dispatch({
      type: loopTypes.SET_LOOP_ROAD,
      payload: ar,
      thisLoopId: 0,
    });
    await sleep(3000);
    // console.log('sleep end');
    dispatch({
      type: loopTypes.UPDATE_LOOP_STATE,
    });
  };

export const continueDefaultBagRoad =
  (defaultWordsBag, stepOfDefaultWordsBag, defaultWordsBagRoad) =>
  async dispatch => {
    dispatch({
      type: loopTypes.SET_LOOP_ROAD,
      payload: defaultWordsBagRoad,
      thisLoopId: 0,
    });
    dispatch({
      type: loopTypes.SET_LOOP_STEP,
      payload: stepOfDefaultWordsBag,
    });
  };

export const goNextRedux = loopStep => async dispatch => {
  console.log('start goNextRedux');
  dispatch({
    type: loopTypes.SET_LOOP_STEP,
    payload: loopStep + 1,
  });
  dispatch({
    type: userTypes.UPDATE_STEP_OF_DEFAULT_WORDS_BAG,
  });
};

export const finishLoop = loopId => async dispatch => {
  console.log('start finishLoop');
  if (loopId === 0) {
    dispatch({
      type: userTypes.UPDATE_IS_DEFAULT_DISCOVER,
    });
  } else if (loopId === 1) {
    dispatch({
      type: userTypes.UPDATE_IS_CUSTOM_DISCOVER,
    });
  }
};

export const resetLoopStepRedux = loopStep => async dispatch => {
  console.log('start resetLoopStepRedux');
  dispatch({
    type: loopTypes.SET_LOOP_STEP,
    payload: 0,
  });
  dispatch({
    type: loopTypes.RESET_LOOP_ROAD,
  });
  dispatch({
    type: userTypes.RESET_DEFAULT_STEP,
  });
};

export const clearDefaultRoadRedux = () => async dispatch => {
  dispatch({
    type: loopTypes.CLEAR_DEFAULT_ROAD,
  });
};

export const resetLoopState = () => async dispatch => {
  dispatch({
    type: loopTypes.RESET_LOOP_STATE,
  });
};

export const updateLoopRoad =
  (loopRoad, loopStep, loopId) => async dispatch => {
    // console.log('loopRoad from updateLoopRoad =>', loopRoad);
    // console.log(
    //   'we need to add this word and this screen to the end of the loop =>', this if we are not in test
    //   loopRoad[loopStep],
    // );

    loopRoad.push(loopRoad[loopStep]);
    dispatch({
      type: loopTypes.UPDATE_LOOP_ROAD,
      payload: loopRoad,
    });
    if (loopId === 0) {
      // default words bag
      // console.log('we will update the default road now');
      dispatch({
        type: loopTypes.UPDATE_DEFAULT_ROAD,
        payload: loopRoad,
      });
    } else if (loopId === 1) {
      // custom words bag
      // console.log('we will update the custom road now');
      dispatch({
        type: loopTypes.UPDATE_CUSTOM_ROAD,
        payload: loopRoad,
      });
    } else if (loopId === 2) {
      // review words bag
      dispatch({
        type: loopTypes.UPDATE_REVIEW_ROAD,
        payload: loopRoad,
      });
    }
  };
