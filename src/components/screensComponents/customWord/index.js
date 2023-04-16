import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FONTS} from '../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {RealmContext} from '../../../realm/models';
import {Word} from '../../../realm/models/Word';
import {DaysBags} from '../../../realm/models/DaysBags';
import {PassedWords} from '../../../realm/models/PassedWords';
import {Loop} from '../../../realm/models/Loop';
import loopReduxTypes from '../../../redux/LoopRedux/loopRedux.types';

const {useQuery, useObject, useRealm} = RealmContext;

const mapState = ({loopRedux}) => ({
  customBagArray: loopRedux.customBagArray,
});

const CustomWordComp = props => {
  const {wordItem, isPassed} = props;
  const realm = useRealm();
  const loop = useQuery(Loop);
  const passedIds = useQuery(PassedWords);
  let passedIdsAr = [...passedIds];
  //
  let customWordsBag = loop[0].customWordsBag;
  let customWordsBagRoad = loop[0].customWordsBagRoad;
  let stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag;
  //
  const {customBagArray} = useSelector(mapState);
  const dispatch = useDispatch();
  const addWordToCustomArray = wrdItem => {
    dispatch({
      type: loopReduxTypes.ADD_TO_CUSTOM_BAG_ARRAY,
      payload: wrdItem,
    });
  };
  useEffect(() => {
    console.log('customBagArray =>', customBagArray);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.wordStyle}>{wordItem.wordLearnedLang}</Text>
      {/* <View style={[styles.progressBarParent]}>
        <View
          style={[
            styles.progressBarChild,
            {width: `${(passedWords.prog * 100) / 20}%`},
          ]}></View>
      </View> */}
      <TouchableOpacity
        style={[
          styles.btnStyle,
          {
            backgroundColor:
              customBagArray.some(e => e._id === wordItem._id) ||
              passedIdsAr.some(e => e._id === wordItem._id) ||
              customWordsBagRoad.length > 0
                ? '#FF4C0020'
                : '#FF4C00',
          },
        ]}
        disabled={
          customBagArray.some(e => e._id === wordItem._id) ||
          passedIdsAr.some(e => e._id === wordItem._id) ||
          customWordsBagRoad.length > 0
        }
        onPress={() => {
          addWordToCustomArray(wordItem);
        }}>
        <Ionicons name="ios-add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomWordComp;

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: '#FF4C00',
    width: 50,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordStyle: {
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 16,
    color: '#fff',
  },
  container: {
    backgroundColor: '#1D1E37',
    borderWidth: 2,
    // borderColor: 'rgba(255,255,255,.60)',
    borderColor: '  rgba(255, 76, 0,.40)',

    width: '49%',
    height: 140,
    borderRadius: 20,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 6,
    // marginHorizontal: '1%',
  },
  progressBarParent: {
    position: 'relative',
    width: '80%',
    height: 6,
    backgroundColor: '#FFFFFF', // Changed To DarkLight Code
    borderRadius: 6,
  },
  progressBarChild: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20%',
    height: 6,
    backgroundColor: '#FF4C00',
    borderRadius: 6,
  },
});
