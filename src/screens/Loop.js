import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  constructDailyTest,
  constructDef,
  constructReadyReview,
  constructReview,
  constructWeeklyTest,
} from '../redux/Loop/loop.actions';
import {COLORS_THEME, FONTS} from '../constants';
import Discover from '../components/loopComponents/discover';
import Cards from '../components/loopComponents/cards';
import loopTypes from '../redux/Loop/loop.types';
import userTypes from '../redux/User/user.types';
import MissedChar from '../components/loopComponents/missedChar';
import FindIt from '../components/loopComponents/findit';
import {addThisBagToDaysBags} from '../redux/User/user.actions';
import {RealmContext} from '../realm/models';
import {User} from '../realm/models/User';
import {Word} from '../realm/models/Word';
import {Loop} from '../realm/models/Loop';
import loopReduxTypes from '../redux/LoopRedux/loopRedux.types';
import {DaysBags} from '../realm/models/DaysBags';
import Realm from 'realm';
import ObjectID from 'bson-objectid';
import ReType from '../components/loopComponents/retype';
import PlaceHolderComp from '../components/loopComponents/placeholder';
import Rehide from '../components/loopComponents/rehide';
import Matching from '../components/loopComponents/matching';
import Writing from '../components/loopComponents/writing';
import CardsImg from '../components/loopComponents/cardsImg';
import Hearing from '../components/loopComponents/hearing';
import SingleImg from '../components/loopComponents/singleImg';
import {PassedWords} from '../realm/models/PassedWords';
import {ADMOB_INTERSTITIAL,ADMOB_INTERSTITIAL_IOS, PRODUCTION} from '../../settings.config';
import {
  TestIds,
  useInterstitialAd,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import LoopLoader from '../components/screensComponents/loopLoader';
import ExDiscover from '../components/loopComponents/exDiscover';
import ExTest from '../components/loopComponents/exTest';

const adUnitId = PRODUCTION ? Platform.OS === 'ios' ? ADMOB_INTERSTITIAL_IOS : ADMOB_INTERSTITIAL : TestIds.INTERSTITIAL;

const {useQuery, useObject, useRealm} = RealmContext;
const mapState = ({loopRedux, userRedux}) => ({
  isReady: loopRedux.isReady,
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
  loopId: loopRedux.loopRoad,
  reviewBagArray: loopRedux.reviewBagArray,
  customBagArray: loopRedux.customBagArray,
  userTrackTransparency:userRedux.userTrackTransparency,
  euroConcent:userRedux.euroConcent

});

const LoopManager = ({route, navigation}) => {
  const {isReady, loopStep, loopRoad, reviewBagArray, customBagArray,userTrackTransparency,euroConcent} =
  useSelector(mapState);
  const {isLoaded, isClosed, load, show} = useInterstitialAd(
    PRODUCTION ?  ADMOB_INTERSTITIAL_IOS : TestIds.INTERSTITIAL,
    {
      requestNonPersonalizedAdsOnly: !userTrackTransparency || !euroConcent,
    },
  );
  const realm = useRealm();
  const user = useQuery(User);
  const isSubed = user[0].isPremium;
  const loop = useQuery(Loop);
  const words = useQuery(Word);
  const daysBags = useQuery(DaysBags);
  const passedWords = useQuery(PassedWords);

  let currentDay = user[0].currentDay;
  let currentWeek = user[0].currentWeek;
  let passedDays = user[0].passedDays;
  let userUiLang = user[0].userUiLang;
  let userLearnedLang = user[0].userLearnedLang;
  let userNativeLang = user[0].userNativeLang;
  const bagsOfYesterday = useQuery(DaysBags).filtered(`day == ${currentDay - 1}`);
  const bagsOfLastWeek = useQuery(DaysBags).filtered(`week == ${currentWeek}`);

  let defaultWordsBag = loop[0].defaultWordsBag;
  let defaultWordsBagRoad = loop[0].defaultWordsBagRoad;
  let stepOfDefaultWordsBag = loop[0].stepOfDefaultWordsBag;
  let isDefaultDiscover = loop[0].isDefaultDiscover;

  //
  let reviewWordsBag = loop[0].reviewWordsBag;
  let reviewWordsBagRoad = loop[0].reviewWordsBagRoad;
  let stepOfReviewWordsBag = loop[0].stepOfReviewWordsBag;

  //
  let customWordsBag = loop[0].customWordsBag;
  let customWordsBagRoad = loop[0].customWordsBagRoad;
  let stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag;
  let isCustomDiscover = loop[0].isCustomDiscover;

  //
  let dailyTestRoad = loop[0].dailyTestRoad;
  let stepOfDailyTest = loop[0].stepOfDailyTest;
  let weeklyTestRoad = loop[0].weeklyTestRoad;
  let stepOfWeeklyTest = loop[0].stepOfWeeklyTest;
  const [ready, setReady] = useState(false);
  const [adShowing, setAdShowing] = useState(false);
  const {idType, readyReviewBag} = route.params;

  const dispatch = useDispatch();

  function sleep(ms) {
    console.log('sleep start');
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const getThe3WordsForReview = async () => {
    let ourPassedWords = [...passedWords];
    let weekPlusDay = currentDay + currentWeek;
    const filtredArray = ourPassedWords.filter(
      word => word.dayPlusWeekPassedAt < weekPlusDay,
    );
    const ar = [];
    if (filtredArray.length >= 3) {
      console.log(
        'our PassedWord Length is =>',
        filtredArray.length,
        filtredArray,
      );
      // let defaultScreens = [4, 6, 8, 7, 6, 12, 10, 9];
      let screens = [8, 4, 7, 6];
      filtredArray?.sort(function (a, b) {
        return a.score - b.score || a.viewNbr - b.viewNbr;
      });
      for (let i = 0; i < 3; i++) {
        let newObj = {};
        // let myWord = realm.objectForPrimaryKey('Word', ourPassedWords[i]._id); // search for a realm object with a primary key that is an int.
        // let item = screens[Math.floor(Math.random() * screens.length)];
        // newObj.wordObj = myWord;
        // newObj.screen = item;
        // newObj.string;
        if (filtredArray[i].wordType === 0) {
          let myWord = realm.objectForPrimaryKey('Word', filtredArray[i]._id);
          let item = screens[Math.floor(Math.random() * screens.length)];
          newObj.wordObj = myWord;
          newObj.screen = item;
          newObj.isReview = true;
          newObj.string;
        } else if (filtredArray[i].wordType === 1) {
          let myWord = realm.objectForPrimaryKey(
            'CustomWords',
            filtredArray[i]._id,
          );
          let item = screens[Math.floor(Math.random() * screens.length)];
          newObj.wordObj = myWord;
          newObj.screen = item;
          newObj.isReview = true;
          newObj.string;
        }
        ar.push(newObj);
      }
    }

    return ar;
  };
  useEffect(() => {
    // getThe3WordsForReview();
    console.log('userTrackTransparency from Loop 173', userTrackTransparency);
    console.log('euroConcent from Loop 174', euroConcent);

  }, []);

  const buildLoopRoad = async (roadArray, step, idType) => {
    let newRoad = roadArray;
    if (currentDay + currentWeek > 2) {
      if (idType === 0 || idType === 1 || idType === 2 || idType === 5) {
        let indexToInsert = idType == 0 || idType === 1 ? 4 : 3;
        let indexUsed = indexToInsert;
        const reviewWords = await getThe3WordsForReview();
        reviewWords.forEach(item => {
          console.log('indexToInsert =>', indexToInsert);
          console.log('indexUsed =>', indexUsed);
          console.log('wordForReview here 137 =>', item);
          // newRoad.unshift(item);
          newRoad.splice(indexUsed, 0, item);
          indexUsed += indexToInsert;
        });
      }
    }

    console.log('roadArray now is =>', step);
    console.log('roadArray now is =>', roadArray);
    dispatch({
      type: loopReduxTypes.SET_LOOP_ROAD,
      payload: roadArray,
      thisLoopId: 0,
    });
    dispatch({
      type: loopReduxTypes.SET_LOOP_STEP,
      payload: step,
    });
    await sleep(3000);
    // setReady(true);
    dispatch({
      type: loopReduxTypes.UPDATE_LOOP_STATE,
    });
  };

  const addThisBagToDaysBagss = bagWord => {
    try {
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1; //  months are 0-based
      const day = date.getDate();
      let countOfThisDate = currentYear + currentMonth + day;
      let dayBag;
      realm.write(() => {
        dayBag = realm.create('DaysBags', {
          _id: ObjectID(),
          day: currentDay,
          week: currentWeek,
          step: 0,
          words: JSON.stringify(bagWord),
          createdAt: Date.now(),
          createDate: countOfThisDate,
        });
      });
      console.log('new dayBag created:', dayBag);
    } catch (err) {
      console.error('Failed to create the BagDay', err.message);
    }
  };
  const addThisBagWordsToPassedWords = async (bagWord, defOrCustBag) => {
    try {
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1; //  months are 0-based
      const day = date.getDate();
      let countOfThisDate = currentYear + currentMonth + day;
      let passedWord;

      bagWord.forEach(elem => {
        realm.write(() => {
          passedWord = realm.create('PassedWords', {
            _id: elem._id,
            score: 100,
            viewNbr: 0,
            prog: 0,
            wordType: defOrCustBag,
            dayPlusWeekPassedAt: currentDay + currentWeek - 1,
            createDate: countOfThisDate,
          });
        });
        console.log(
          'thisWord ------------>',
          elem._id,
          typeof elem._id,
          words[0]._id,
          typeof words[0]._id,
        );
        // let thisWord = words.filtered(`_id == ${elem._id}`);
        let thisWord = realm.objects('Word').filtered('_id == $0', elem._id);
        console.log('thisWord ------------>', thisWord);
        try {
          realm.write(() => {
            thisWord[0].passed = true;
          });
        } catch (error) {
          console.log('Error while updating passed to true', error);
        }
      });
    } catch (err) {
      console.error('Failed to create the PassedWords', err.message);
    }
  };
  const getBagsOfDayX = async () => {
    let words = [];
    bagsOfYesterday.forEach(item => {
      let wordArray = JSON.parse(item.words);
      words = words.concat(wordArray);
    });
    return words;
  };
  const getBagsOfWeekX = async () => {
    let words = [];
    bagsOfLastWeek.forEach(item => {
      let wordArray = JSON.parse(item.words);
      words = words.concat(wordArray);
    });
    return words;
  };
  const addThisDayForStreaks = () => {
    console.log('addThisDayForStreaks =>', addThisDayForStreaks);
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; //  months are 0-based
    const day = date.getDate();
    console.log('currentYear =>', currentYear);
    console.log('currentMonth =>', currentMonth);
    console.log('day =>', day);
    let countOfThisDate = currentYear + currentMonth + day;
    let alreadyDays = [...user[0].passedDays];
    alreadyDays.push(countOfThisDate);
    realm.write(() => {
      user[0].passedDays = alreadyDays;
    });
  };
  // useEffect(() => {
  //   getBagsOfDayX().then(res => {
  //     console.log('res test bag =>', res);
  //   });
  // }, []);

  useEffect(() => {
    if (idType === 0) {
      if (stepOfDefaultWordsBag === 0) {
        // we started now and we dont see those words before
        //--------------------------------------------
        // here we need to add this words bag to the daysBags array
        if (isDefaultDiscover === 0 && defaultWordsBagRoad.length === 0) {
          console.log(
            'we will add to the daybags and passedwords : ',
            defaultWordsBagRoad,
          );
          addThisDayForStreaks();
          addThisBagWordsToPassedWords(defaultWordsBag, 0);
          addThisBagToDaysBagss(defaultWordsBag);
        }
        updateDefaultRoad().then(() => {
          const arr = [];
          console.log(
            'default Words Bag Road as Strings =>',
            defaultWordsBagRoad,
          );
          // const myObjFromJson = JSON.parse(defaultWordsBagRoad);
          defaultWordsBagRoad.forEach(item => {
            arr.push(JSON.parse(item));
          });
          console.log('default Words Bag Road as Objects', arr);
          buildLoopRoad(arr, 0, idType).then(() => {
            // console.log('isReady =>', isReady);
            // console.log('loopStep =>', loopStep);
            // console.log('loopRoad =>', loopRoad);
          });
        });
      } else {
        // we continue what we already started.
        //--------------------------------------------
        const arr = [];
        defaultWordsBagRoad.forEach(item => {
          arr.push(JSON.parse(item));
        });
        console.log('default Words Bag Road as Objects', arr);
        buildLoopRoad(arr, stepOfDefaultWordsBag, idType);
      }
    } else if (idType === 1) {
      // We need to construct the custom words bag road
      if (stepOfCustomWordsBag === 0) {
        // we started now and we dont see those words before
        //--------------------------------------------
        // here we need to add this words bag to the daysBags array

        updateCustomRoad().then(() => {
          const arr = [];
          console.log(
            'custom Words Bag Road as Strings =>',
            customWordsBagRoad,
          );
          // const myObjFromJson = JSON.parse(defaultWordsBagRoad);
          customWordsBagRoad.forEach(item => {
            arr.push(JSON.parse(item));
          });
          console.log('Custom Words Bag Road as Objects', arr);
          buildLoopRoad(arr, 0, idType).then(() => {
            console.log('isReady =>', isReady);
            console.log('loopStep =>', loopStep);
            console.log('loopRoad =>', loopRoad);
          });
        });
      } else {
        // we continue what we already started.
        //--------------------------------------------
        const arr = [];
        customWordsBagRoad.forEach(item => {
          arr.push(JSON.parse(item));
        });
        console.log('Custom Words Bag Road as Objects', arr);
        buildLoopRoad(arr, stepOfCustomWordsBag, idType);
      }
    } else if (idType === 2) {
      if (stepOfReviewWordsBag === 0 && reviewWordsBagRoad.length === 0) {
        // We need to construct the Review words bag road
        updateReviewRoad().then(() => {
          const arr = [];
          console.log(
            'review Words Bag Road as Strings =>',
            reviewWordsBagRoad,
          );
          // const myObjFromJson = JSON.parse(defaultWordsBagRoad);
          reviewWordsBagRoad.forEach(item => {
            arr.push(JSON.parse(item));
          });
          console.log('review Words Bag Road as Objects', arr);
          buildLoopRoad(arr, 0, idType).then(() => {
            console.log('isReady =>', isReady);
            console.log('loopStep =>', loopStep);
            console.log('loopRoad =>', loopRoad);
          });
        });
      } else {
        // we continue what we already started in review bag
        console.log('we continue what we already started in review bag');
        const arr = [];
        reviewWordsBagRoad.forEach(item => {
          arr.push(JSON.parse(item));
        });
        console.log('review Words Bag Road as Objects', arr);
        buildLoopRoad(arr, stepOfReviewWordsBag, idType);
      }
    } else if (idType === 3) {
      // We need to build the daily test road
      if (stepOfDailyTest === 0 && dailyTestRoad.length === 0) {
        // We need to construct the daily test road
        updateDailyTestBag().then(res => {
          console.log('Daily Test Road is =>', dailyTestRoad);
          const arr = [];
          dailyTestRoad.forEach(item => {
            arr.push(JSON.parse(item));
          });
          buildLoopRoad(arr, 0, idType).then(() => {});
        });
      } else {
        console.log('we continue what we already started in the test road');
        const arr = [];
        dailyTestRoad.forEach(item => {
          arr.push(JSON.parse(item));
        });
        console.log('Daily test Words Bag Road as Objects', arr);
        buildLoopRoad(arr, stepOfDailyTest, idType);
      }
    } else if (idType === 4) {
      // We need to build the weekly test road
      if (stepOfWeeklyTest === 0 && weeklyTestRoad.length === 0) {
        // We need to construct the weekly test road
        updateWeeklyTestBag().then(res => {
          console.log('Weekly Test Road is =>', weeklyTestRoad);
          const arr = [];
          weeklyTestRoad.forEach(item => {
            arr.push(JSON.parse(item));
          });
          buildLoopRoad(arr, 0, idType).then(() => {});
        });
      } else {
        console.log('we continue what we already started in the test road');
        const arr = [];
        weeklyTestRoad.forEach(item => {
          arr.push(JSON.parse(item));
        });
        console.log('Weekly test Words Bag Road as Objects', arr);
        buildLoopRoad(arr, stepOfWeeklyTest, idType);
      }
    } else if (idType === 5) {
      // We need to build the review Ready-To-Review bag road
      console.log('We need to build the review Ready-To-Review bag road');
      console.log('ready review Bag Road as string', readyReviewBag);
      // buildLoopRoad(readyReviewBag, stepOfReviewWordsBag);
      constructReadyReview(readyReviewBag).then(res => {
        console.log('review Words Bag Road as Objects', res);
        buildLoopRoad(res, 0, idType).then(() => {});
      });
    }
    // return () => {
    //   alert('are you sure you want to exit');
    //   dispatch({
    //     type: loopReduxTypes.RESET_LOOP,
    //   });
    // };
    return () => {
      console.log('we quit loop now');
      dispatch({
        type: loopReduxTypes.RESET_LOOP,
      });
    };
  }, [idType]);

  const updateDefaultRoad = async () => {
    try {
      if (isDefaultDiscover === 3) {
        console.log('WE ARE THERE WE WILL REVIEW THE DEFAULT WORDS BAG');
        const road = await constructReview(defaultWordsBag);
        realm.write(() => {
          loop[0].defaultWordsBagRoad = road;
        });
      } else {
        const road = await constructDef(defaultWordsBag, isDefaultDiscover, 0,isSubed);
        realm.write(() => {
          loop[0].defaultWordsBagRoad = road;
        });
      }
    } catch (error) {
      console.log('error in updating Default Road =>', error);
    }
  };
  const updateCustomRoad = async () => {
    try {
      console.log(' customBagArray from updateCustomRoad :', customBagArray);

      if (isCustomDiscover === 0 && customWordsBagRoad.length === 0) {
        realm.write(() => {
          loop[0].customWordsBag = customBagArray;
        });
        console.log(
          'we will add to the daybags and passedwords : ',
          customWordsBagRoad,
        );
        addThisBagWordsToPassedWords(customWordsBag, 1);
        addThisBagToDaysBagss(customWordsBag);
      }

      const road = await constructDef(customWordsBag, isCustomDiscover, 1);
      realm.write(() => {
        loop[0].customWordsBagRoad = road;
      });
    } catch (error) {
      console.log('error in updating Custom Road =>', error);
    }
  };
  const convertReviewBagArrayToString = async reviewBagArray => {
    const newArr = [];
    reviewBagArray.forEach(item => {
      newArr.push(JSON.stringify(item));
    });
    return newArr;
  };
  const updateReviewRoad = async () => {
    try {
      const resultArray = await convertReviewBagArrayToString(reviewBagArray);
      realm.write(() => {
        loop[0].reviewWordsBag = resultArray;
      });
      const road = await constructReview(reviewBagArray);
      realm.write(() => {
        loop[0].reviewWordsBagRoad = road;
      });
    } catch (error) {
      console.log('error in updating Review Road =>', error);
    }
  };

  const updateDailyTestBag = async () => {
    try {
      const wordsPassedYesterday = await getBagsOfDayX();
      const road = await constructDailyTest(wordsPassedYesterday);
      realm.write(() => {
        loop[0].dailyTestRoad = road;
      });
      return road;
    } catch (error) {
      console.log('error in updating Review Road =>', error);
    }
  };

  const updateWeeklyTestBag = async () => {
    try {
      const wordsPassedThisWeek = await getBagsOfWeekX();
      const road = await constructWeeklyTest(wordsPassedThisWeek);
      realm.write(() => {
        loop[0].weeklyTestRoad = road;
      });
      return road;
    } catch (error) {
      console.log('error in updating Review Road =>', error);
    }
  };

  const deleteOldRoad = async () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.

      loop[0].defaultWordsBagRoad = [];
    });
  };
  const clearDefaultRoad = () => {
    console.log('clearDefaultRoad start');
  };

  useEffect(() => {
    if (!user[0].isPremium) {
    // Start loading the interstitial straight away
    console.log('isClosed =>', isClosed);
    console.log('show =>', show);
    if (!(loopStep % 12 === 0)) {
      if (!isLoaded) {
        console.log(' inside load() :::::::::::::::::::::::::::::::::::::::::');
        load();
      } else {
        console.log(' Ad Loaded Hamduleleh');
      }
    } else {
      console.log('Here we need to see an ad');
      if (
        loopStep % 12 === 0 &&
        loopStep !== 0 &&
        loopStep !== loopRoad.length - 1 &&
        isLoaded
      ) {
        dispatch({
          type: loopReduxTypes.RESET_LOOP_STATE,
        });
        console.log(' inside show() :::::::::::::::::::::::::::::::::::::::::');
        setAdShowing(true);
        try {
          show();
        } catch (error) {
          console.log('error while showing ad', error);
        }
        dispatch({
          type: loopReduxTypes.UPDATE_LOOP_STATE,
        });
      }
    }}
  }, [load, isLoaded, isClosed, show, loopStep]);

  return (
    <View style={styles.container}>
      {isReady ? (
        <View>
          {(() => {
            if (loopStep < loopRoad.length) {
              // console.log('loopStep =>', loopStep);
              switch (loopRoad[loopStep].screen) {
                case 1:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <Discover
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 2:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <ReType
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 3:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <PlaceHolderComp
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 4:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <Cards
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 5:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <Rehide
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 6:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <MissedChar
                        loopType={idType}
                        // adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 7:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <FindIt
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 8:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <Writing
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 9:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <Hearing
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 10:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <SingleImg
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 11:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <Matching
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 12:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <CardsImg
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                  case 13:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <ExDiscover
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                case 14:
                  return (
                    <View style={{width: '100%', height: '100%'}}>
                      {/* <Text>Hello There {loopRoad[loopStep].screen}</Text> */}
                      <ExTest
                        loopType={idType}
                        adShowing={adShowing}
                        userUiLang={userUiLang}
                        userLearnedLang={userLearnedLang}
                        userNativeLang={userNativeLang}
                      />
                    </View>
                  );
                default:
                  return (
                    <View>
                      <Text>Error !</Text>
                    </View>
                  );
              }
            }
          })()}
        </View>
      ) : (
        <LoopLoader />
      )}
    </View>
  );
};

export default LoopManager;

const styles = StyleSheet.create({
  clearBtn: {
    backgroundColor: 'red',
    padding: 15,
    marginTop: 20,
  },
  clearBtnTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 18,
    color: '#fff',
  },
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLORS_THEME.bgDark,
    // width: '100%',
  },
});
