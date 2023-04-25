import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
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
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import {Loop} from '../../../realm/models/Loop';
import {RealmContext} from '../../../realm/models';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import loopReduxTypes from '../../../redux/LoopRedux/loopRedux.types';
//import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';
import {PassedWords} from '../../../realm/models/PassedWords';
import LoopProgBar from '../../screensComponents/loopProgBar';
import {languages} from '../../../../languages';
import {User} from '../../../realm/models/User';
import {flags} from '../../../constants/images';

const {useQuery, useObject, useRealm} = RealmContext;
const mapState = ({loopRedux}) => ({
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
});
const Writing = props => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  let isDefaultDiscover = loop[0].isDefaultDiscover;
  let isCustomDiscover = loop[0].isCustomDiscover;
  const navigation = useNavigation();
  const {loopStep, loopRoad} = useSelector(mapState);
  const {loopType, userLearnedLang, userNativeLang} = props;
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [text, onChangeText] = React.useState('');
  // const [word, setWord] = useState(loopRoad[loopStep].wordObj.wordLearnedLang);
  const [trueOfFalse, setTrueOfFalse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [fadeInOut, setFadeInOut] = useState(false);
  const word = loopRoad[loopStep].wordObj.wordLearnedLang;
  const animElement = useRef();
  const animElementWrong = useRef();

  const fadeAnimnNative = useRef(new Animated.Value(1)).current;
  const fadeAnimLearn = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transalteAnim = useRef(new Animated.Value(-SIZES.width)).current;

//  const correctSound = useMemo(() => new Sound('correct.mp3'), []);
  //const wrongSound = useMemo(() => new Sound('wrong.mp3'), []);
  const passedWord = useObject(PassedWords, loopRoad[loopStep].wordObj._id); // REMOVED FOR ANIMATION TESTING

  const containerBg = {
    backgroundColor: darkMode
      ? loopRoad[loopStep].isReview
        ? '#0C4057'
        : COLORS_THEME.bgDark
      : COLORS_THEME.bgWhite,
  };
  const backgroundColor = {
    backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
  };
  const color = darkMode ? COLORS_THEME.textWhite : COLORS_THEME.textDark;

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
  const toogleFade = () => {
    setFadeInOut(!fadeInOut);
    // Will change fadeAnim value to 0 in 3 seconds

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const checkResponse = () => {
    setIsChecked(true);
    Keyboard.dismiss();
    console.log('hello there', word, text);
    if (word.toLowerCase() === text.toLowerCase().trim()) {
      setTrueOfFalse(true);
      //correctSound.play();
      SoundPlayer.playSoundFile('correct','mp3');
      // alert(`Correct Answer ${text}`);
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
      // alert(`Wrong answer : ${text}, Correct answer is: ${word}`);
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
      // it means Default
      realm.write(() => {
        loop[0].defaultWordsBagRoad = newRoad;
      });
    } else if (loopType === 1) {
      // it means Custom
      realm.write(() => {
        loop[0].customWordsBagRoad = newRoad;
      });
    } else if (loopType === 2) {
      // it means Review
      realm.write(() => {
        loop[0].reviewWordsBagRoad = newRoad;
      });
    }
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
        console.log(
          'HOOOOOOOOOOOOOOOOO 269 AS WELL',
          loopRoad[loopStep].wordObj,
        );
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
    onChangeText('');
    // fadeIn();
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
        console.log(
          'HERE We Will update default wordsBag step in the realm DB',
        );
        // update default wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfDefaultWordsBag = loop[0].stepOfDefaultWordsBag + 1;
        });
      } else if (loopType === 1) {
        console.log('HERE We Will update custom wordsBag step in the realm DB');
        // update custom wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag + 1;
        });
      } else if (loopType === 2) {
        console.log('HERE We Will update review wordsBag step in the realm DB');
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
              {languages[userUiLang].writing}
            </Text>
            <Entypo name="keyboard" size={25} color={'#fff'} />
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
          flex: 5.5,
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
        <View style={styles.foreignWordBox}>
          <View style={styles.foreignWordBoxContent}>
            <TouchableOpacity>
              <Icon name="speaker" size={80} color="#FF4C00" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputBox}>
          <View style={styles.inputBoxSubBox}>
            <Image
              source={flags[userLearnedLang]}
              style={styles.foreignFlag}
              // resizeMethod="resize"
              // resizeMode="stretch"
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="write here"
              placeholderTextColor="#ffffff40"
            />
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

export default Writing;

const styles = StyleSheet.create({
  foreignFlag: {
    width: 20,
    height: 20,
    // backgroundColor: 'red',
    marginRight: 20,
  },
  foreignWordBoxContent: {},
  inputBoxSubBox: {
    width: '100%',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  input: {
    width: '80%',
    // backgroundColor: 'red',
    color: '#fff',
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: FONTS.enFontFamilyMedium,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  checkBtnTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    color: '#000',
    fontSize: 26,
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
    alignItems: 'center',
    // backgroundColor: 'blue',
    // marginTop: 40,
    flex: 2,
    // //***************
    // backgroundColor: 'red',
    // width: '100%',
    ////***************
  },
  blurParrent: {
    position: 'relative',
    // backgroundColor: 'blue',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurEffectImg: {
    position: 'absolute',
    top: '-80%',
    left: '-60%',
    width: '220%',
    height: '260%',
    // backgroundColor: 'red',
    zIndex: -1,
    opacity: 0.25,
  },
  btnGoTxt: {
    color: '#1D1E37',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btnGo: {
    width: '80%',
    height: 70,
    borderRadius: 10,
    // backgroundColor: '#fff',  // Changed To DarkLight Code
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputBox: {
    // marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2.5,
    width: '100%',
    // //***************
    // backgroundColor: '#00bb0c',
    // width: '100%',
    // //***************
  },

  foreignWordBox: {
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
    marginTop: 10,
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
  wordImg: {
    width: '100%',
    height: '100%',
    // //***************
    // backgroundColor: '#00e2f7',
    // width: '100%',
    // //***************
  },
  wrapper: {
    // justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'blue',
    // height: windowHeight,
    flex: 11.5,
    width: '100%',
    // backgroundColor: '#181920',  // Changed To DarkLight Code
    alignItems: 'center',
    justifyContent: 'center',
  },
  conatiner: {},
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
