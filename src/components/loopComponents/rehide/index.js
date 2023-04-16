import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import ShadowEffect from '../../../../assets/shadowImg.png';
import Suceess from '../../../../assets/suceess.png';
import Arabic from '../../../../assets/sa.png';
import English from '../../../../assets/united-states.png';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS_THEME, FONTS} from '../../../constants/theme';
import {SIZES} from '../../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {RealmContext} from '../../../realm/models';
import {Loop} from '../../../realm/models/Loop';
import loopReduxTypes from '../../../redux/LoopRedux/loopRedux.types';

import LottieView from 'lottie-react-native';
//import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';
import LoopProgBar from '../../screensComponents/loopProgBar';
import {User} from '../../../realm/models/User';
import {languages} from '../../../../languages';
import {flags} from '../../../constants/images';

const {useQuery, useObject, useRealm} = RealmContext;

const mapState = ({loopRedux}) => ({
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
});

const Rehide = props => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const user = useQuery(User);
  const {userLearnedLang, userNativeLang} = props;
  let userUiLang = user[0].userUiLang;
  const loopType = 0;
  const {loopStep, loopRoad} = useSelector(mapState);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(true);
  const [text, onChangeText] = React.useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const wordVar = loopRoad[loopStep].wordObj.wordLearnedLang;
  const [wordAsArray, setWordAsArray] = useState(wordVar.split(''));
  const [times, setTimes] = useState(0);
  const [trueOfFalse, setTrueOfFalse] = useState(false);
  const [fadeInOut, setFadeInOut] = useState(false);

  const howMuch = useRef(0);
  // let times = 0;
  const indicesTab = useRef([]);
  const containerBg = {
    backgroundColor: darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite,
  };
  const backgroundColor = {
    backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
  };
  const color = darkMode ? COLORS_THEME.textWhite : COLORS_THEME.textDark;

  const animElement = useRef();
  const animElementWrong = useRef();

  const fadeAnimnNative = useRef(new Animated.Value(1)).current;
  const fadeAnimLearn = useRef(new Animated.Value(0)).current;

  //const correctSound = useMemo(() => new Sound('correct.mp3'), []);
 // const wrongSound = useMemo(() => new Sound('wrong.mp3'), []);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transalteAnim = useRef(new Animated.Value(-SIZES.width)).current;

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

  const gotoNext = () => {
    console.log('gotNext start');
    fadeAnimnNative.setValue(1);
    fadeAnimLearn.setValue(0);
    if (loopStep < loopRoad.length) {
      // update loopRedux Step
      translateOut().then(() => {
        transalteAnim.setValue(-SIZES.width);
        dispatch({
          type: loopReduxTypes.SET_LOOP_STEP,
          payload: loopStep + 1,
        });
      });
      if (loopType === 0) {
        // update default wordsBag step in the real DB
        realm.write(() => {
          loop[0].stepOfDefaultWordsBag = loop[0].stepOfDefaultWordsBag + 1;
        });
      } else if (loopType === 1) {
        console.log('HERE We Will update custom wordsBag step in the realm DB');
        // update custom wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag + 1;
        });
      }
      // Retype screen will never used in the review bag or tests
    } else {
      loopExit().then(navigation.navigate('Home'));
    }
  };
  useEffect(() => {
    console.log('wordAsArray =>', wordAsArray);
    for (let i = 0; i < wordVar.length; i++) {
      indicesTab.current.push(i);
    }
    console.log('indicesTab =>', indicesTab.current);
  }, []);

  useEffect(() => {
    if (times > 0) {
      let newArrayString = wordAsArray;
      for (let j = 0; j < times; j++) {
        const randomElement =
          indicesTab.current[
            Math.floor(Math.random() * indicesTab.current.length)
          ];
        indicesTab.current = indicesTab.current.filter(
          item => item !== randomElement,
        );
        newArrayString[randomElement] = '-';
      }
      setWordAsArray([...newArrayString]);
      console.log('second useeffect =>', newArrayString);
    } else {
      console.log('times is under 0');
    }
  }, [times]);

  const checkResponse = () => {
    if (howMuch.current < wordVar.length) {
      // console.warn('Hi there are', howMuch.current);
      console.log(
        'wordVar =>',
        wordVar.toLowerCase(),
        'respoArToString',
        text.toLowerCase(),
      );
      if (wordVar.toLowerCase() === text.toLowerCase().trim()) {
        // console.warn('Yes we are fine');
        //correctSound.play();
        SoundPlayer.playSoundFile('correct','mp3');
        onChangeText('');
        howMuch.current += howMuch.current + 1;
        setTimes(times + 1);
        // times.current += 1;
      } else {
        // console.warn('No not good at all');
        // alert(`Wrong answer : ${text}, Correct answer is: ${wordVar}`);
        //wrongSound.play();
        SoundPlayer.playSoundFile('wrong','mp3');
        onChangeText('');
        howMuch.current += howMuch.current + 1;
        setTimes(times + 1);
        // times.current += 1;
      }
    } else {
      // console.warn('That"s it let go next', howMuch.current);
      // alert(`That"s it let go next`);
      setIsChecked(true);
      onChangeText('');
      if (wordVar.toLowerCase() === text.toLowerCase().trim()) {
        // console.warn('Yes we are fine');
        setTrueOfFalse(true);
        //correctSound.play();
        SoundPlayer.playSoundFile('correct','mp3');
      } else {
        // alert(`Wrong answer : ${text}, Correct answer is: ${wordVar}`);
        setTrueOfFalse(false);
        //wrongSound.play();
        SoundPlayer.playSoundFile('wrong','mp3');
      }
    }
  };
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
        try {
          animElement.current?.play();
          // correctSound.play();
        } catch (error) {
          console.log('error on animElement play', error);
        }
      } else {
        try {
          animElementWrong.current?.play();
          // wrongSound.play();
        } catch (error) {
          console.log('error on animElementWrong play', error);
        }
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

  useEffect(() => {
    try {
      SoundPlayer.onFinishedLoading((success)=>{
        console.log(success)
      })
    } catch (error) {
      
    }
    translateTo();
  }, [loopStep]);

  const playAudio = () => {
    /*console.log('play sound now');
    var audio = new Sound(loopRoad[loopStep].wordObj.audioPath, null, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      audio.play();
    });*/
    SoundPlayer.playUrl('file://'+loopRoad[loopStep].wordObj.audioPath)
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
          <TouchableOpacity>
            <AntDesign name="exclamationcircleo" size={18} color={color} />
          </TouchableOpacity>
        </View>
      )}

      {!isKeyboardVisible && (
        <>
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

          {loopRoad[loopStep].wordObj.wordType === 0 ||
          (loopRoad[loopStep].wordObj.wordType === 1 &&
            loopRoad[loopStep].wordObj.localImagePath !== '') ? (
            <View style={styles.wordImgWrapper}>
              <Image
                resizeMethod={'resize'}
                resizeMode="contain"
                source={{
                  uri:
                    loopRoad[loopStep].wordObj.wordType === 1
                      ? 'file:///' + loopRoad[loopStep].wordObj.localImagePath
                      : loopRoad[loopStep].wordObj.wordImage,
                }}
                // src={}
                style={styles.wordImg}
              />
            </View>
          ) : null}
        </>
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
          flex: 3,
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
            {wordAsArray.map((item, index) => {
              return (
                <Text
                  key={index}
                  style={[styles.foreignWordTxt, {color: color}]}>
                  {item}
                </Text>
              );
            })}
          </View>
        </View>
        <View style={styles.inputBox}>
          <View style={styles.inputBoxSubBox}>
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
              onPress={() => gotoNext()}>
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

export default Rehide;

const styles = StyleSheet.create({
  checkBtnTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    color: '#000',
    fontSize: 24,
  },
  questionWrapper: {
    flex: 1.5,
    width: '100%',
    // backgroundColor: 'red',
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

  input: {
    width: '80%',
    // backgroundColor: 'red',
    color: '#fff',
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: FONTS.enFontFamilyMedium,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    textAlign: 'center',
  },
  inputBox: {
    // marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    // //***************
    // backgroundColor: '#00bb0c',
    // width: '100%',
    // //***************
  },
  inputBoxSubBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
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
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  blurEffectImg: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    // backgroundColor: 'red',
    zIndex: -1,
    opacity: 0.7,
  },
  btnGoTxt: {
    color: '#1D1E37',
    fontSize: 22,
    fontWeight: 'bold',
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

  typingIndicator: {
    width: 5,
    height: '80%',
    marginLeft: 5,
    // backgroundColor: '#fff', // Changed To DarkLight Code
  },
  typingAnimSubBox: {
    height: '70%',
    width: '80%',
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: '#FF4C00',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  typingAnimBox: {
    // marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    width: '100%',
    // //***************
    // backgroundColor: '#00bb0c',
    // width: '100%',
    // //***************
  },
  typingText: {
    color: '#fff',
    fontSize: 30,
    // fontWeight: 'bold',
    fontFamily: 'Nunito-SemiBold',
  },
  foreignSpellingBox: {
    flexDirection: 'row',
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foreignSpellingTxt: {
    color: '#FF4C00',
    fontSize: 30,
    // fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Nunito-Bold',
  },
  foreignWordTxt: {
    // color: '#fff',  // Changed To DarkLight Code
    fontSize: 22,
    // fontWeight: 'bold',
    fontFamily: FONTS.enFontFamilyMedium,
    // Nunito-SemiBold
    // Nunito-Regular
    // Nunito-Medium
    // Nunito-Black
    letterSpacing: 6,
  },
  foreignFlag: {
    width: 20,
    height: 20,
    // backgroundColor: 'red',
    marginRight: 20,
  },
  foreignWordBoxContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    borderColor: '#fff',
    borderWidth: 1,
    // paddingHorizontal: 30,
    paddingVertical: 5,
    marginBottom: 10,
    width: '80%',
  },
  foreignWordBox: {
    width: '100%',
    // marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
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
    width: 40,
    height: 40,
    // backgroundColor: 'red',
    marginRight: 10,
    marginLeft: 20,
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
    flex: 1,
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
    paddingVertical: 5,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  wordImgWrapper: {
    width: '70%',
    // height: 180,
    // //***************
    // backgroundColor: '#00e2f7',
    // width: '100%',
    // //***************
    flex: 2,
    // marginHorizontal: '15%',
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 10,
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
