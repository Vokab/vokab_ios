import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {COLORS_THEME, FONTS} from '../../../constants/theme';
import {SIZES} from '../../../constants/theme';
import Arabic from '../../../../assets/sa.png';
import English from '../../../../assets/united-states.png';
import Review from '../../../../assets/review.png';
import ShadowEffect from '../../../../assets/shadowImg.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {wrapper} from '../../besmart/firstAlgo';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import {
  finishLoop,
  goNextRedux,
  resetLoopStepRedux,
  updateLoopRoad,
} from '../../../redux/Loop/loop.actions';
import {RealmContext} from '../../../realm/models';
import {Loop} from '../../../realm/models/Loop';
import loopReduxTypes from '../../../redux/LoopRedux/loopRedux.types';
import {PassedWords} from '../../../realm/models/PassedWords';

//import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';
import LoopProgBar from '../../screensComponents/loopProgBar';
import {alphabets, languages} from '../../../../languages';
import {User} from '../../../realm/models/User';
import {flags} from '../../../constants/images';

const {useQuery, useObject, useRealm} = RealmContext;
const mapState = ({loopRedux}) => ({
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
});

const MissedChar = props => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  let isDefaultDiscover = loop[0].isDefaultDiscover;
  let isCustomDiscover = loop[0].isCustomDiscover;
  const {loopType, userLearnedLang, userNativeLang} = props;
  const navigation = useNavigation();
  const {loopStep, loopRoad} = useSelector(mapState);
  const dispatch = useDispatch();

  const [darkMode, setDarkMode] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [wordMissed, setWordMissed] = useState();
  const [missedChars, setMissedChars] = useState([]);
  const [arrayOfSuggChars, setArayOfSuggChars] = useState([]);
  const [myIndex, setMyIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [trueOfFalse, setTrueOfFalse] = useState(false);
  const [fadeInOut, setFadeInOut] = useState(false);
  const animElement = useRef();
  const animElementWrong = useRef();

  const fadeAnimnNative = useRef(new Animated.Value(1)).current;
  const fadeAnimLearn = useRef(new Animated.Value(0)).current;
  //const correctSound = useMemo(() => new Sound('correct.mp3'), []);
  //const wrongSound = useMemo(() => new Sound('wrong.mp3'), []);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transalteAnim = useRef(new Animated.Value(-SIZES.width)).current;

  const word = loopRoad[loopStep].wordObj.wordLearnedLang;
  const passedWord = useObject(PassedWords, loopRoad[loopStep].wordObj._id);
  const containerBg = {
    backgroundColor: darkMode
      ? loopRoad[loopStep].isReview
        ? '#024659'
        : COLORS_THEME.bgDark
      : COLORS_THEME.bgWhite,
  };
  const backgroundColor = {
    backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
  };
  const color = darkMode ? COLORS_THEME.textWhite : COLORS_THEME.textDark;

  const alphabet = alphabets[userLearnedLang];

  const fadeIn = () => {
    setFadeInOut(!fadeInOut);
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnimnNative, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnimLearn, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    setFadeInOut(!fadeInOut);
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnimnNative, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnimLearn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    if (isChecked) {
      if (trueOfFalse === true) {
        animElement.current?.play();
        // correctSound.play();
      } else {
        animElementWrong.current?.play();
        // wrongSound.play();
      }
    }
  }, [trueOfFalse, isChecked]);

  useEffect(() => {
    if (isChecked && !trueOfFalse) {
      const interval = setInterval(fadeInOut ? fadeIn : fadeOut, 1000);
      return () => clearInterval(interval);
    }
  }, [fadeInOut, isChecked, trueOfFalse]);

  const shuffle = async array => {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    // setShuffledArray(array);
    return array;
  };
  const buildTheMissedWord = () => {
    let newObj = {};
    let secNewObj = {};
    const arr = [];
    originalWord = word.split('');
    stateWord = word.split('');
    wordToArray = word.split('');
    randomIndex = Math.floor(Math.random() * wordToArray.length); // for getting random index
    wordToArray.splice(randomIndex, 1); // for remove first one char
    secRandomIndex = Math.floor(Math.random() * wordToArray.length);
    wordToArray.splice(secRandomIndex, 1); // for remove second one char
    console.log('first randomIndex is =>', randomIndex);
    console.log('second secRandomIndex is =>', secRandomIndex);
    console.log('final word is =>', wordToArray);
    newObj.char = originalWord[randomIndex];
    newObj.index = randomIndex;
    arr.push(newObj);
    stateWord[randomIndex] = '_';
    if (secRandomIndex >= randomIndex) {
      secNewObj.char = originalWord[secRandomIndex + 1];
      secNewObj.index = secRandomIndex + 1;
      arr.push(secNewObj);
      stateWord[secRandomIndex + 1] = '_';
    } else {
      secNewObj.char = originalWord[secRandomIndex];
      secNewObj.index = secRandomIndex;
      arr.push(secNewObj);
      stateWord[secRandomIndex] = '_';
    }
    console.log('stateWordarr =>', stateWord);
    setMissedChars(arr);
    setWordMissed(stateWord);
    // wordToArrayForRemove = word.split('');
    // randomIndex = Math.floor(Math.random() * wordToArray.length);
    // wordToArray.splice(randomIndex, 0, randomItem);
    // secRandomIndex = Math.floor(Math.random() * wordToArray.length);
    const arr2 = [];
    for (let i = 0; i < 8; i++) {
      const randomCharacter =
        alphabet[Math.floor(Math.random() * alphabet.length)];
      arr2.push(randomCharacter);
    }
    arr.forEach(item => {
      arr2.push(item.char);
    });
    shuffle(arr2);
    setArayOfSuggChars(arr2);
    console.log('arr =>', arr2);
  };

  const fillChar = item => {
    // console.log('myIndex', myIndex);
    // console.log('missedChars[myIndex].index', missedChars);
    const ar = wordMissed;
    ar[wordMissed.indexOf('_')] = item;
    setWordMissed(ar);
    setMyIndex(myIndex + 1);
    // missedChars
    // wordMissed
  };

  useEffect(() => {
    buildTheMissedWord();
  }, [loopStep]);

  const checkResponse = () => {
    setIsChecked(true);
    if (word === wordMissed.join('')) {
      setTrueOfFalse(true);
      //correctSound.play();
      SoundPlayer.playSoundFile('correct','mp3');
      try {
        realm.write(() => {
          passedWord.score = passedWord.score + 1;
          passedWord.viewNbr = passedWord.viewNbr + 1;
          if (passedWord.prog < 20) {
            passedWord.prog = passedWord.prog + 1;
          }
        });
      } catch (err) {
        console.error(
          'Failed to update prog and score and viewNbr of this word',
          err.message,
        );
      }
    } else {
      setTrueOfFalse(false);
      //wrongSound.play();
      SoundPlayer.playSoundFile('wrong','mp3');
      try {
        realm.write(() => {
          passedWord.score = passedWord.score - 1;
          passedWord.viewNbr = passedWord.viewNbr + 1;
        });
      } catch (err) {
        console.error(
          'Failed to update prog and score and viewNbr of this word',
          err.message,
        );
      }
      if (loopType != 3 && loopType != 4) {
        updateLoopRoad();
      }
    }
  };

  const updateLoopRoad = () => {
    // update redux Loop Road
    loopRoad.push(loopRoad[loopStep]);
    dispatch({
      type: loopReduxTypes.UPDATE_LOOP_ROAD,
      payload: loopRoad,
    });
    // update the right road if its default custom or review
    const newRoad = [];
    loopRoad.forEach(item => {
      const myJSON_Object = JSON.stringify(item);
      newRoad.push(myJSON_Object);
    });

    if (loopType === 0) {
      // it means default
      realm.write(() => {
        loop[0].defaultWordsBagRoad = newRoad;
      });
    } else if (loopType === 1) {
      // it means custom
      realm.write(() => {
        loop[0].customWordsBagRoad = newRoad;
      });
    } else if (loopType === 2) {
      // it means review
      realm.write(() => {
        loop[0].reviewWordsBagRoad = newRoad;
      });
    }
  };

  const loopExit = async () => {
    // reset loopRedux Step
    // reset loopRedux Road
    // reset loopRedux isReady
    dispatch({
      type: loopReduxTypes.RESET_LOOP,
    });
    if (loopType === 0) {
      // update default wordsBag road in the real DB
      realm.write(() => {
        loop[0].stepOfDefaultWordsBag = 0;
      });
    } else if (loopType === 1) {
      realm.write(() => {
        loop[0].stepOfCustomWordsBag = 0;
      });
    } else if (loopType === 2) {
      realm.write(() => {
        loop[0].stepOfReviewWordsBag = 0;
        loop[0].reviewWordsBagRoad = [];
      });
      dispatch({
        type: loopReduxTypes.RESET_REVIEW_BAG_ARRAY,
      });
    }
  };

  const translateTo = () => {
    console.log('we start translateTo here');
    Animated.parallel(
      [
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(transalteAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ],
      {
        stopTogether: false,
      },
    ).start(() => {
      if (loopRoad[loopStep].wordObj.wordType === 0) {
        playAudio();
      }
    });
  };

  const translateOut = async () => {
    console.log('we start translateOut here');
    Animated.parallel(
      [
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(transalteAnim, {
          toValue: SIZES.width,
          duration: 300,
          useNativeDriver: true,
        }),
      ],
      {
        stopTogether: false,
      },
    ).start();
  };

  const goToNext = () => {
    console.log('goToNext start');
    fadeAnimnNative.setValue(1);
    fadeAnimLearn.setValue(0);
    setIsChecked(false);
    if (loopStep < loopRoad.length - 1) {
      translateOut().then(() => {
        transalteAnim.setValue(-SIZES.width);
        dispatch({
          type: loopReduxTypes.SET_LOOP_STEP,
          payload: loopStep + 1,
        });
      });
      if (loopType === 0) {
        // update default wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfDefaultWordsBag = loop[0].stepOfDefaultWordsBag + 1;
        });
      } else if (loopType === 1) {
        // update custom wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag + 1;
        });
      } else if (loopType === 2) {
        // update review wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfReviewWordsBag = loop[0].stepOfReviewWordsBag + 1;
        });
      } else if (loopType === 3) {
        console.log('HERE We Will update daily test road step in the realm DB');
        // update daily test wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfDailyTest = loop[0].stepOfDailyTest + 1;
        });
      } else if (loopType === 4) {
        console.log('HERE We Will update daily test road step in the realm DB');
        // update weekly test wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfWeeklyTest = loop[0].stepOfWeeklyTest + 1;
        });
      }
    } else {
      // if custom or default words bag we need to update the isDefaultDiscover variable by add 1
      // console.log('loopStep =>', loopStep);
      if (loopType === 0 && isDefaultDiscover < 3) {
        // add 1 to isDefaultDiscover in the realm DB
        realm.write(() => {
          loop[0].isDefaultDiscover = loop[0].isDefaultDiscover + 1;
        });
      } else if (loopType === 1 && isCustomDiscover < 3) {
        realm.write(() => {
          loop[0].isCustomDiscover = loop[0].isCustomDiscover + 1;
        });
      }
      loopExit().then(navigation.navigate('Congratulation'));
    }
  };

  const playAudio = () => {
    /*var audio = new Sound(loopRoad[loopStep].wordObj.audioPath, null, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      audio.play();
    });*/
    SoundPlayer.playUrl('file://'+loopRoad[loopStep].wordObj.audioPath)
  };
  useEffect(() => {
    try {
      SoundPlayer.onFinishedLoading((success)=>{
        console.log(success)
      })
    } catch (error) {
      
    }
    translateTo();
  }, [loopStep]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        containerBg,
        {opacity: fadeAnim, transform: [{translateX: transalteAnim}]},
      ]}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      {!isKeyboardVisible && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.exclamBtnStyle}>
            <AntDesign name="exclamationcircleo" size={18} color={color} />
          </TouchableOpacity>
          {loopRoad[loopStep].isReview && (
            <View style={styles.reviewBox}>
              <Image source={Review} style={styles.reviewStyle} />
              {/* <Text style={styles.reviewTxtStyle}>Review</Text> */}
            </View>
          )}
          <View style={{width: '10%'}}></View>
        </View>
      )}

      {!isKeyboardVisible && (
        <View style={styles.questionWrapper}>
          <View
            style={[
              styles.questionContent,
              {flexDirection: userUiLang === 0 ? 'row-reverse' : 'row'},
            ]}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={30}
              color={'#D2FF00'}
            />
            <Text style={styles.questionText}>
              {languages[userUiLang].missedChar}
            </Text>
          </View>
        </View>
      )}
      <View
        style={[
          styles.nativeWordBox,
          {backgroundColor: darkMode ? '#00000040' : '#ffffff50'},
        ]}>
        <Animated.View
          style={[styles.nativeWordBoxContent, {opacity: fadeAnimnNative}]}>
          <Text style={[styles.nativeWordTxt, {color: color}]}>
            {loopRoad[loopStep].wordObj.wordNativeLang}
          </Text>
          <Image source={flags[userNativeLang]} style={styles.nativeFlag} />
        </Animated.View>
        <Animated.View
          style={[styles.nativeWordBoxContent, {opacity: fadeAnimLearn}]}>
          <Image source={flags[userLearnedLang]} style={styles.learnedFlag} />
          <Text style={[styles.nativeWordTxt, {color: color}]}>
            {loopRoad[loopStep].wordObj.wordLearnedLang}
          </Text>
        </Animated.View>
      </View>
      <View
        style={{
          width: '100%',
          // marginTop: 40,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 6,
        }}>
        {isChecked ? (
          trueOfFalse ? (
            <LottieView
              ref={animElement}
              source={require('../../../../assets/animations/correct.json')}
              autoPlay={false}
              loop={true}
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                elevation: 3,
                zIndex: 3,
              }}
            />
          ) : (
            <LottieView
              ref={animElementWrong}
              source={require('../../../../assets/animations/wrong.json')}
              autoPlay={false}
              loop={true}
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                elevation: 1,
                zIndex: 1,
              }}
            />
          )
        ) : null}
        <View style={styles.cardsResponseContainer}>
          <View style={styles.cardsRes}>
            {wordMissed?.map((item, index) => {
              if (index === wordMissed.indexOf('_')) {
                return (
                  <Text
                    key={index}
                    style={[styles.cardsResText, {color: '#FF4C00'}]}>
                    {item}
                  </Text>
                );
              }
              return (
                <Text key={index} style={styles.cardsResText}>
                  {item}
                </Text>
              );
            })}
          </View>
        </View>
        <View style={styles.suggCardsContainer}>
          <View style={styles.suggCardsSubContainer}>
            {arrayOfSuggChars.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  disabled={wordMissed.indexOf('_') === -1}
                  style={styles.suggSingleCard}
                  onPress={() => {
                    fillChar(item);
                  }}>
                  <Text style={styles.suggSingleCardTxt}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.blurParrent}>
          {!isChecked ? (
            <TouchableOpacity
              style={[styles.btnGo, backgroundColor]}
              onPress={() => checkResponse()}>
              <Text style={styles.checkBtnTxt}>
                {languages[userUiLang].check}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnGo, backgroundColor]}
              onPress={() => goToNext()}>
              <Text style={styles.checkBtnTxt}>
                {languages[userUiLang].next}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <LoopProgBar darkMode={darkMode} />
    </Animated.View>
  );
};

export default MissedChar;

const styles = StyleSheet.create({
  suggCardsSubContainer: {
    width: '80%',
    // height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggSingleCard: {
    backgroundColor: '#fff',
    width: 40,
    marginHorizontal: '2.5%',
    marginVertical: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FF4C00',
    borderWidth: 1,
  },
  suggSingleCardTxt: {
    color: '#000',
    fontSize: 18,
    fontFamily: FONTS.enFontFamilyBold,
  },
  cardsResText: {
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 24,
    letterSpacing: 4,
  },
  cardsRes: {
    backgroundColor: '#1D1E3775',
    width: '80%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkBtnTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    color: '#000',
    fontSize: 24,
  },
  questionWrapper: {
    flex: 1,
    width: '100%',
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    height: '100%',
    width: '100%',
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    marginRight: 10,
    fontFamily: FONTS.enFontFamilyBold,
  },

  progressBarChild: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 8,
    backgroundColor: '#FF4C00',
    borderRadius: 6,
  },
  progressBarParent: {
    position: 'relative',
    width: 80,
    height: 8,
    // backgroundColor: '#FFFFFF',   // Changed To DarkLight Code
    borderRadius: 6,
  },
  footer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    //***************
    width: '100%',
    // backgroundColor: 'yellow',
    //***************
  },
  btnContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: 'blue',
    // marginTop: 40,
    flex: 2,
    // //***************
    // backgroundColor: 'red',
    // width: '100%',
    // //***************
  },
  blurParrent: {
    position: 'relative',
    // backgroundColor: 'blue',
    width: '100%',
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnGo: {
    width: '80%',
    height: 60,
    borderRadius: 10,
    // backgroundColor: '#fff',  // Changed To DarkLight Code
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggCardsContainer: {
    width: '100%',
    // marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    // //***************
    // backgroundColor: '#23af0d',
    // width: '100%',
    // //***************
  },
  cardsResponseContainer: {
    width: '100%',
    // marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    // //***************
    // backgroundColor: '#a79d08',
    // width: '100%',
    // //***************
  },
  nativeWordTxt: {
    // color: '#fff',  // Changed To DarkLight Code
    fontSize: 28,
    // fontWeight: 'bold',
    fontFamily: 'Nunito-SemiBold',
  },
  nativeWordBoxContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nativeFlag: {
    width: 26,
    height: 26,
    // backgroundColor: 'red',
    // marginRight: 10,
    marginLeft: 15,
  },
  learnedFlag: {
    width: 26,
    height: 26,
    // backgroundColor: 'red',
    // marginRight: 10,
    marginRight: 15,
  },
  nativeWordBox: {
    width: '100%',
    // height: 80,
    flex: 1.5,
    // //***************
    // backgroundColor: '#ce3207',
    // width: '100%',
    // //***************
    // backgroundColor: '#00000040',  // Changed To DarkLight Code
    marginTop: 20,
  },
  header: {
    width: '100%',
    height: 40,
    flex: 0.5,
    // //***************
    // backgroundColor: '#a300c4',
    // width: '100%',
    // //***************
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exclamBtnStyle: {width: '10%'},
  reviewBox: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  reviewStyle: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  reviewTxtStyle: {
    color: COLORS_THEME.primary,
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 24,
  },

  wrapper: {
    // justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'blue',
    // height: windowHeight,
    flex: 12,
    width: '100%',
    // backgroundColor: '#181920',  // Changed To DarkLight Code
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowImageBg: {
    width: 400,
    height: 500,
    opacity: 0.25,
    position: 'absolute',
    top: SIZES.height / 2 - 200 - 50,
    left: SIZES.width / 2 - 200,
    // backgroundColor: 'red',
  },
});
