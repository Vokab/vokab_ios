import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS_THEME, FONTS} from '../constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  addThisBagToDaysBags,
  addUserData,
  clearDaysBags,
  clearTodayWordsBag,
  clearUserData,
  resetIsDiscover,
} from '../redux/User/user.actions';
import {addAllUserWords, clearAllWords} from '../redux/Words/words.actions';
import {clearDefaultRoadRedux} from '../redux/Loop/loop.actions';
import loopTypes from '../redux/Loop/loop.types';

const mapState = ({user, words}) => ({
  userId: user.userId,
  userNativeLang: user.userNativeLang,
  userLearnedLang: user.userLearnedLang,
  userLevel: user.userLevel,
  currentWeek: user.currentWeek,
  currentDay: user.currentDay,
  stepOfDefaultWordsBag: user.stepOfDefaultWordsBag,
  defaultWordsBag: user.defaultWordsBag,
  allWords: words.words,
  wordsLoading: words.wordsLoading,
  audioLoading: words.audioLoading,
  daysBags: user.daysBags,
  currentWeek: user.currentWeek,
  currentDay: user.currentDay,
});

const Custom = () => {
  const {
    userId,
    userNativeLang,
    userLearnedLang,
    userLevel,
    currentWeek,
    currentDay,
    daysBags,
    stepOfDefaultWordsBag,
    defaultWordsBag,
    allWords,
    wordsLoading,
    audioLoading,
  } = useSelector(mapState);

  const dispatch = useDispatch();

  const addWordsToRedux = () => {
    dispatch(addAllUserWords(userNativeLang, userLearnedLang, userLevel));
    console.log('addDataToRedux');
  };

  const addDataToRedux = () => {
    dispatch(addUserData());
    console.log('addUserData');
  };
  const clearRedux = () => {
    dispatch(clearUserData());
    console.log('clearRedux');
  };
  const clearWords = () => {
    dispatch(clearAllWords());
    console.log('clearRedux');
  };

  const clearTodayWords = () => {
    dispatch(clearTodayWordsBag());
    console.log('clearTodayWords');
  };
  const resetIsDefaultDiscover = () => {
    console.log('resetIsDefaultDiscover');
    dispatch(resetIsDiscover());
  };
  const addBagToDaysBags = () => {
    dispatch(
      addThisBagToDaysBags(daysBags, defaultWordsBag, currentDay, currentWeek),
    );
  };
  const clearDaysBagsFunc = () => {
    dispatch(clearDaysBags());
  };
  const clearDefaultRoadFunc = () => {
    dispatch(clearDaysBags());
  };
  const clearDefaultRoad = () => {
    console.log('clearDefaultRoad start');
    dispatch(clearDefaultRoadRedux());
  };
  const clearLoopRoad = () => {
    console.log('clearLoopRoad start');
    dispatch({
      type: loopTypes.RESET_LOOP_ROAD,
    });
  };

  useEffect(() => {
    // console.log('daysBags =>', daysBags);
  }, [daysBags]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {wordsLoading ? (
          <ActivityIndicator
            color={COLORS_THEME.bgDark}
            style={{marginVertical: 11}}
            size={'large'}
          />
        ) : null}
        {audioLoading ? (
          <ActivityIndicator
            color={COLORS_THEME.textWhite}
            style={{marginVertical: 11}}
            size={'large'}
          />
        ) : null}

        <TouchableOpacity style={styles.addBtn} onPress={addWordsToRedux}>
          <Text style={styles.addBtnTxt}>Add Words to Redux</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={addDataToRedux}>
          <Text style={styles.addBtnTxt}>Add Data to Redux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addBtn} onPress={addBagToDaysBags}>
          <Text style={styles.addBtnTxt}>Add Bag to DaysBags</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearLoopRoad}>
          <Text style={styles.clearBtnTxt}>Clear LOOP ROAD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearDefaultRoad}>
          <Text style={styles.clearBtnTxt}>Clear DEFAULT ROAD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearDaysBagsFunc}>
          <Text style={styles.clearBtnTxt}>Clear DaysBags</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={clearRedux}>
          <Text style={styles.clearBtnTxt}>Clear Redux</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={clearWords}>
          <Text style={styles.clearBtnTxt}>Clear Words From Redux</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={resetIsDefaultDiscover}>
          <Text style={styles.clearBtnTxt}>Clear IsDefaultDiscover</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearTodayWords}>
          <Text style={styles.clearBtnTxt}>Clear Today Words Bag</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Custom;

const styles = StyleSheet.create({
  clearBtnTxt: {
    color: '#d7d1d1',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  clearBtn: {
    minWidth: 250,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#7fb113',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 20,
  },
  addBtn: {
    // width: 200,
    minWidth: 250,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  addBtnTxt: {
    color: '#000',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  container: {
    flex: 1,
    backgroundColor: 'red',
    paddingVertical: 20,
    // paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
