import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {COLORS_THEME} from '../constants';
import DayCard from '../components/dailyCardsComponents/dayCard';
import TodayCard from '../components/dailyCardsComponents/todayCard';
import HomeHeader from '../components/homeHeader';
import {useDispatch, useSelector} from 'react-redux';
import {collection, query, where, getDocs, limit} from 'firebase/firestore';
import {db} from '../firebase/utils';
import {todayWork} from '../redux/User/user.actions';
import {RealmContext} from '../realm/models';
import {User} from '../realm/models/User';
import {Loop} from '../realm/models/Loop';
import {Word} from '../realm/models/Word';

const {useQuery, useRealm} = RealmContext;

const mapState = ({user, words, loop}) => ({
  userId: user.userId,
  userNativeLang: user.userNativeLang,
  userLearnedLang: user.userLearnedLang,
  currentWeek: user.currentWeek,
  currentDay: user.currentDay,
  stepOfDefaultWordsBag: user.stepOfDefaultWordsBag,
  defaultWordsBag: user.defaultWordsBag,
  currentWord: user.currentWord,
  allWords: words.words,
  defaultWordsBagRoad: loop.defaultWordsBagRoad,
  isDefaultDiscover: user.isDefaultDiscover,
  daysBags: user.daysBags,
  loopId: loop.loopId,
  loopStep: loop.loopStep,
  loopRoad: loop.loopRoad,
  isReady: loop.isReady,
});
const Home2 = () => {
  const realm = useRealm();
  const user = useQuery(User);
  const loop = useQuery(Loop);
  const words = useQuery(Word).sorted('_id');
  // const ourWords = useMemo(() => words), [words]);
  const {
    userId,
    userNativeLang,
    userLearnedLang,
    currentWeek,
    currentDay,
    stepOfDefaultWordsBag,

    allWords,
    currentWord,
    defaultWordsBagRoad,
    isDefaultDiscover,
    daysBags,
    loopId,
    loopStep,
    loopRoad,
    isReady,
  } = useSelector(mapState);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [defaultWordsBag, setDefaultWordsBag] = useState([]);
  const renderDayCard = () => {
    const myItems = [];
    for (let i = 0; i < 7; i++) {
      if (i === user[0].currentDay - 1) {
        myItems.push(
          <View key={i} style={styles.todayCardStyle}>
            <TodayCard defaultWordsBag={defaultWordsBag} />
          </View>,
        );
      } else {
        myItems.push(
          <View key={i} style={styles.dayCardStyle}>
            <DayCard />
          </View>,
        );
      }
    }
    setItems(myItems);
  };
  // useEffect(() => {
  //   getWordsOfThisDay();
  // }, []);

  useEffect(() => {
    renderDayCard();
  }, [currentDay]);
  // Clean Code

  const addDefaultWordsBag = () => {
    let arr = [];
    const first3Words = words.slice(0, 3);
    // console.log('first3Words =>', first3Words);
    first3Words.forEach(elem => {
      // console.log('element =>', elem._id);
      arr.push(elem._id);
    });
    realm.write(() => {
      loop[0].defaultWordsBag = first3Words;
    });
  };
  useEffect(() => {
    // console.log('todayWork wordsBag =>', defaultWordsBag);
    if (loop[0].defaultWordsBag.length === 0) {
      console.log('we dont have YET', loop[0].defaultWordsBag);
      addDefaultWordsBag();
      // dispatch(todayWork(allWords, currentWord));
    } else {
      console.log('we already have something', loop[0].defaultWordsBag);
    }
  }, [loop]);
  // useEffect(() => {
  //   console.log('allWords =>>>>>>>>>>>>: ', allWords);
  // }, [allWords]);
  useEffect(() => {
    // console.log('default words bag from Home -----', defaultWordsBag);
    // console.log('defaultWordsBagRoad from Home -----', defaultWordsBagRoad);
    // console.log('stepOfDefaultWordsBag from Home -----', stepOfDefaultWordsBag);
    // console.log('isDefaultDiscover from Home -----', isDefaultDiscover);
    // console.log('daysBags from Home -----', daysBags);
    // console.log('loopId from Home -----', loopId);
    // console.log('loopStep from Home -----', loopStep);
    // console.log('loopRoad from Home -----', loopRoad);
    // console.log('isReady from Home -----', isReady);
    // console.log('allWords from Home -----', allWords);
    // console.log('defaultWordsBagRoad from Home -----', defaultWordsBagRoad);
  }, [
    stepOfDefaultWordsBag,
    isDefaultDiscover,
    daysBags,
    loopId,
    loopStep,
    loopRoad,
    isReady,
    defaultWordsBagRoad,
  ]);

  return (
    <ScrollView style={styles.container}>
      <HomeHeader />
      {items}
    </ScrollView>
  );
};

export default Home2;

const styles = StyleSheet.create({
  todayCardStyle: {
    // height: '100%',
    width: '100%',
    // marginHorizontal: '5%',
  },
  dayCardStyle: {
    height: 180,
    width: '100%',
    // marginHorizontal: '5%',
    marginVertical: 20,
  },
  container: {
    backgroundColor: COLORS_THEME.bgDark,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
