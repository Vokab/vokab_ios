import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ReviewHeader from '../components/screensComponents/header';
import ShadowEffect from '../../assets/shadowImg.png';
import {FONTS, SIZES} from '../constants';
import HintHeader from '../components/screensComponents/hintHeader';
import ReviewWordComp from '../components/screensComponents/reviewWord';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RealmContext} from '../realm/models';
import {DaysBags} from '../realm/models/DaysBags';
import {Word} from '../realm/models/Word';
import {Loop} from '../realm/models/Loop';
import {useNavigation} from '@react-navigation/native';
import loopReduxTypes from '../redux/LoopRedux/loopRedux.types';
import {languages} from '../../languages';
import {User} from '../realm/models/User';

const {useQuery, useObject, useRealm} = RealmContext;
const mapState = ({loopRedux}) => ({
  reviewBagArray: loopRedux.reviewBagArray,
  isReady: loopRedux.isReady,
});

const Review = () => {
  const realm = useRealm();
  const words = useQuery(Word);
  const loop = useQuery(Loop);
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  const {reviewBagArray, isReady} = useSelector(mapState);
  const dispatch = useDispatch();
  let reviewWordsBag = loop[0].reviewWordsBag;
  let reviewWordsBagRoad = loop[0].reviewWordsBagRoad;
  let stepOfReviewWordsBag = loop[0].stepOfReviewWordsBag;
  // const reviewWordsBagRoadValidArr = JSON.parse(loop[0].reviewWordsBagRoad);
  const [validArr, setValidArr] = useState([]);
  const navigation = useNavigation();
  const myDaysBags = useQuery(DaysBags).sorted('createdAt', true);
  // const [reviewBagArray, setReviewBagArray] = useState([]);

  const buildValidArray = () => {
    const arr = [];
    reviewWordsBagRoad.forEach(item => {
      arr.push(JSON.parse(item).wordObj);
    });
    console.log('validArray', arr);
    setValidArr(arr);
  };
  useEffect(() => {
    // buildValidArray();
    // console.log('reviewWordsBagRoad.length >', reviewWordsBagRoad.length);
  }, []);

  const removeWordFromReviewArray = item => {
    const indexOfItem = reviewBagArray.indexOf(item);
    console.log('The indexOfItem is :', indexOfItem);
    let oldArray = reviewBagArray;
    const removedItem = oldArray.splice(indexOfItem, 1);
    console.log('oldArray =>', oldArray);
    dispatch({
      type: loopReduxTypes.REMOVE_FROM_REVIEW_BAG_ARRAY,
      payload: [...oldArray],
    });
  };
  const updateReviewWordsBag = async () => {
    realm.write(() => {
      loop[0].reviewWordsBag = reviewBagArray;
    });
  };
  const goToLoop = () => {
    console.log('goToLoop ===');
    navigation.navigate('Loop', {
      idType: 2,
    });
  };
  const reviewReadyBag = words => {
    console.log('goToLoop from reviewReadyBag');
    navigation.navigate('Loop', {
      idType: 5,
      readyReviewBag: words,
    });
  };
  const affichReviewBagContent = array => {
    console.log('array from affichReviewBagContent =>', array);
    array.map((item, index) => {
      return (
        <View key={index} style={styles.wordInBagBox}>
          <Text style={styles.wordInBagTxt}>{item.wordLearnedLang}</Text>
          <TouchableOpacity
            style={styles.removeWord}
            disabled={reviewWordsBagRoad.length > 0}
            onPress={() => {
              removeWordFromReviewArray(item);
            }}>
            <Ionicons name="ios-close-circle" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      );
    });
  };
  useEffect(() => {
    console.log('isReady now is =>', isReady);
  }, []);

  return (
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      <View style={styles.reviewBagContainer}>
        <ReviewHeader screenTitle={`${languages[userUiLang].home.review}`} />
        {/* <HintHeader text={'Add at least 6 words to start your review bag'} /> */}
        <View style={styles.bagContainer}>
          <View style={styles.bagContent}>
            <HintHeader
              text={
                reviewWordsBagRoad.length > 0
                  ? 'You are reviewing those words'
                  : 'Add at least 6 words to start your review bag'
              }
            />
            {reviewWordsBagRoad.length !== 0
              ? reviewWordsBag.map((item, index) => {
                  item = JSON.parse(item);
                  console.log('here is reviewBagArray');
                  return (
                    <View key={index} style={styles.wordInBagBox}>
                      <Text style={styles.wordInBagTxt}>
                        {item.wordLearnedLang}
                      </Text>
                    </View>
                  );
                })
              : reviewBagArray.map((item, index) => {
                  console.log('here is validArr');
                  return (
                    <View key={index} style={styles.wordInBagBox}>
                      <Text style={styles.wordInBagTxt}>
                        {item.wordLearnedLang}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeWord}
                        disabled={reviewWordsBagRoad.length > 0}
                        onPress={() => {
                          removeWordFromReviewArray(item);
                        }}>
                        <Ionicons
                          name="ios-close-circle"
                          size={20}
                          color="#000"
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
          </View>
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={[
              styles.goBtnStyle,
              {
                backgroundColor:
                  reviewWordsBagRoad.length === 0 && reviewBagArray.length < 6
                    ? '#FF4C0040'
                    : '#FF4C00',
              },
            ]}
            disabled={
              reviewWordsBagRoad.length === 0 && reviewBagArray.length < 6
            }
            onPress={() => {
              goToLoop();
            }}>
            <Text style={styles.goBtnStyleTxt}>
              {loop[0].reviewWordsBagRoad.length === 0
                ? `${languages[userUiLang].start}`
                : `${languages[userUiLang].continue}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* {items} */}
        {myDaysBags.map((bag, index) => {
          let words = JSON.parse(bag.words);
          return (
            <View key={index} style={[styles.reviewBagsContainer]}>
              <View style={styles.leftLine}></View>
              <View>
                <View style={styles.reviewBagHeader}>
                  <View style={styles.bagTitle}>
                    <Text style={styles.bagTitleTxt}>Bag {index}</Text>
                  </View>
                  <View style={styles.bagActions}>
                    <View style={styles.btnActionWrapper}>
                      <TouchableOpacity
                        style={styles.reviewBtnStyle}
                        onPress={() => {
                          reviewReadyBag(words);
                        }}>
                        <Text style={styles.reviewBtnStyleTxt}>Review</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity style={styles.closeBagStyle}>
                        <MaterialIcons
                          name="expand-more"
                          size={28}
                          color="#fff"
                        />
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
                <View style={styles.reviewWordsContainer}>
                  {words.map((item, index) => {
                    return (
                      <ReviewWordComp
                        key={index}
                        wordItem={item}
                        word={'candlelight'}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  bagContent: {
    flexDirection: 'row',
    padding: 5,
    flexWrap: 'wrap',
  },
  wordInBagTxt: {
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyRegular,
    color: '#1D1E37',
  },
  removeWord: {
    marginLeft: 5,
  },
  wordInBagBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 2,
  },
  leftLine: {
    width: 5,
    backgroundColor: '#fff',
    height: '100%',
  },
  btnActionWrapper: {
    flexDirection: 'row',
  },
  reviewBtnStyleTxt: {
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 16,
  },
  closeBagStyle: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 6,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewBtnStyle: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 6,
    // marginRight: 20,
  },
  bagActions: {
    // backgroundColor: 'red',
    marginRight: 10,
  },
  bagTitleTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    color: '#1D1E37',
    fontSize: 18,
  },
  bagTitle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: 100,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  reviewBagHeader: {
    // backgroundColor: 'yellow',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewBagsContainer: {
    // backgroundColor: 'rgba(255,255,255,0.1)',
    // height: 150 + 12 + 50,
    flexDirection: 'row',
    marginBottom: 30,
  },
  reviewWordsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'flex-start',
    width: SIZES.width - 5,
    flexWrap: 'wrap',
    // backgroundColor: 'red',
    // marginLeft: 10,
    paddingHorizontal: 8,
  },
  goBtnStyleTxt: {
    color: '#fff',
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyMedium,
    textTransform: 'capitalize',
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBtnStyle: {
    width: '60%',
    backgroundColor: '#FF4C00',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  bagContainer: {
    width: '94%',
    marginHorizontal: '3%',
    minHeight: 120,
    marginVertical: 15,
    backgroundColor: '#1D1E37',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.5)',
  },
  reviewBagContainer: {
    width: '100%',
    // height: 300,
    backgroundColor: 'rgba(29,30,55,.6)',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingBottom: 20,
    marginBottom: 15,
  },
  shadowImageBg: {
    width: 400,
    height: 500,
    opacity: 0.25,
    position: 'absolute',
    top: 0,
    left: SIZES.width / 2 - 200,
    // backgroundColor: 'red',
  },
  screenWrapper: {
    backgroundColor: '#181920',
    flex: 1,
    width: '100%',
  },
});
