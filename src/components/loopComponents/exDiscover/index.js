import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
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
  import {
    goNextRedux,
    resetLoopStepRedux,
  } from '../../../redux/Loop/loop.actions';
  import {RealmContext} from '../../../realm/models';
  import {Loop} from '../../../realm/models/Loop';
  import {Word} from '../../../realm/models/Word';
  import {User} from '../../../realm/models/User';
  import loopReduxTypes from '../../../redux/LoopRedux/loopRedux.types';
 // import Sound from 'react-native-sound';
  import SoundPlayer from 'react-native-sound-player';
  import LoopProgBar from '../../screensComponents/loopProgBar';
  import {flags} from '../../../constants/images';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import {languages} from '../../../../languages';
  
  const {useQuery, useObject, useRealm} = RealmContext;
  
  const mapState = ({loopRedux}) => ({
    loopStep: loopRedux.loopStep,
    loopRoad: loopRedux.loopRoad,
  });
  
  const ExDiscover = props => {
    const realm = useRealm();
    const loop = useQuery(Loop);
    const user = useQuery(User);
    let userUiLang = user[0].userUiLang;
    const {loopType, userLearnedLang, userNativeLang} = props;
    const {loopStep, loopRoad} = useSelector(mapState);
    const dispatch = useDispatch();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const transalteAnim = useRef(new Animated.Value(-SIZES.width)).current;
    var wordSpellVariable = '';
    const [darkMode, setDarkMode] = useState(true);
    const [wordSpell, setWordSpell] = useState('');
    const [fadeInOut, setFadeInOut] = useState(false);
    const wordVar = loopRoad[loopStep].wordObj.wordLearnedLang;
    const fadeAnimnNative = useRef(new Animated.Value(1)).current;
    const fadeAnimLearn = useRef(new Animated.Value(0)).current;
    const displayChar = () => {
      if (wordSpellVariable.length === wordVar.length) {
        // console.log('yess');
        setWordSpell('');
        wordSpellVariable = '';
      } else {
        // console.log('Else', wordSpellVariable.length);
        wordSpellVariable = wordSpellVariable + wordVar[wordSpellVariable.length];
      }
      setWordSpell(wordSpellVariable);
      // console.log('hi mela', wordSpellVariable, 'wordSpell =>', wordSpell);
    };
  
    useEffect(() => {
      const interval = setInterval(displayChar, 800);
      return () => clearInterval(interval);
    }, []);
  
    const containerBg = {
      backgroundColor: darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite,
    };
    const backgroundColor = {
      backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
    };
    const color = darkMode ? COLORS_THEME.textWhite : COLORS_THEME.textDark;
  
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
          // Animated.timing(transalteAnim, {
          //   toValue: SIZES.width,
          //   duration: 300,
          //   useNativeDriver: true,
          // }),
        ],
        {
          stopTogether: false,
        },
      ).start();
    };
  
    const loopExit = async () => {
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
    const gotoNext = () => {
      console.log('gotNext start');
      fadeAnimnNative.setValue(1);
      fadeAnimLearn.setValue(0);
      if (loopStep < loopRoad.length) {
        translateOut().then(() => {
          transalteAnim.setValue(-SIZES.width);
          dispatch({
            type: loopReduxTypes.SET_LOOP_STEP,
            payload: loopStep + 1,
          });
        });
        // update loopRedux Step
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
      } else {
        loopExit().then(navigation.navigate('Congratulation'));
      }
    };
    useEffect(() => {
      translateTo();
    }, [loopStep]);
  
    const playAudio = () => {
/*       console.log('play sound now');
      var audio = new Sound(loopRoad[loopStep].wordObj.audioPath, null, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        audio.play();
      });*/
      SoundPlayer.playUrl('file://'+loopRoad[loopStep].wordObj.audioPath) 
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
      const interval = setInterval(fadeInOut ? fadeIn : fadeOut, 1500);
      return () => clearInterval(interval);
    }, [fadeInOut]);
    const myWord = loopRoad[loopStep].wordObj;
    const WordNativeBelong = () => {
      let beforeWb = myWord.wordNativeExample.substring(
        0,
        myWord.exNativeIndex - 1,
      );
      let ourWord = myWord.wordNativeExample.substring(
        myWord.exNativeIndex - 1,
        myWord.exNativeLength + myWord.exNativeIndex,
      );
      let afterWb = myWord.wordNativeExample.substring(
        myWord.exNativeIndex + myWord.exNativeLength,
        myWord.wordNativeExample.length,
      );
      // console.log('beforeWb =>', beforeWb);
      // console.log('ourWord =>', ourWord);
      // console.log('afterWb =>', afterWb);
      return (
        <Text style={styles.nativeExampleTxt}>
          {beforeWb}
          <Text style={[styles.nativeExampleTxt, styles.highlitedWord]}>
            {ourWord}
          </Text>
          {afterWb}
        </Text>
      );
    };
    const WordLearnedBelong = () => {
      let beforeWb = myWord.wordLearnedExample.substring(
        0,
        myWord.exLearnedIndex - 1,
      );
      let ourWord = myWord.wordLearnedExample.substring(
        myWord.exLearnedIndex - 1,
        myWord.exLearnedLength + myWord.exLearnedIndex,
      );
      let afterWb = myWord.wordLearnedExample.substring(
        myWord.exLearnedIndex + myWord.exNativeLength,
        myWord.wordLearnedExample.length,
      );
      // console.log('beforeWb =>', beforeWb);
      // console.log('ourWord =>', ourWord);
      // console.log('afterWb =>', afterWb);
      return (
        <Text style={styles.nativeExampleTxt}>
          {beforeWb}
          <Text style={[styles.nativeExampleTxt, styles.highlitedWord]}>
            {ourWord}
          </Text>
          {afterWb}
        </Text>
      );
    };
  
    return (
      // <ScrollView style={styles.conatiner}>
      <Animated.View
        style={[
          styles.wrapper,
          containerBg,
          {opacity: fadeAnim, transform: [{translateX: transalteAnim}]},
        ]}>
        <Image source={ShadowEffect} style={styles.shadowImageBg} />
        <View style={styles.header}>
          <TouchableOpacity>
            <AntDesign name="exclamationcircleo" size={18} color={color} />
          </TouchableOpacity>
        </View>
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
              {languages[userUiLang].exDiscvoer}
            </Text>
          </View>
        </View>
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
        <View style={styles.foreignWordBox}>
          <View style={styles.learnedExampleBox}>
            <WordLearnedBelong />
          </View>
          <View style={styles.separtor}></View>
          <View style={styles.nativeExampleBox}>
            <WordNativeBelong />
          </View>
          {/* <View style={styles.foreignWordBoxContent}>
            <Image source={flags[userLearnedLang]} style={styles.foreignFlag} />
            <Text style={[styles.foreignWordTxt, {color: color}]}>
              {loopRoad[loopStep].wordObj.wordLearnedLang}
            </Text>
          </View>
          {loopRoad[loopStep].wordObj.wordType === 0 && (
            <View style={styles.foreignSpellingBox}>
              <Text style={styles.foreignSpellingTxt}>/ˈaɣja̝/</Text>
              <TouchableOpacity
                onPress={() => {
                  if (loopType === 0) {
                    playAudio();
                  }
                }}>
                <Icon name="speaker" size={35} color="#FF4C00" />
              </TouchableOpacity>
            </View>
          )} */}
        </View>
  
        <View style={styles.typingAnimBox}>
          {/* <View style={styles.typingAnimSubBox}>
            <Text style={[styles.typingText, {color: color}]}>{wordSpell}</Text>
            <View style={[styles.typingIndicator, backgroundColor]}></View>
          </View> */}
        </View>
        <View style={styles.btnContainer}>
          {/* <Text style={styles.btnGoTxt}>GO</Text> */}
          <View style={styles.blurParrent}>
            <Image
              source={ShadowEffect}
              style={styles.blurEffectImg}
              blurRadius={50}
            />
            <TouchableOpacity
              style={[styles.btnGo, backgroundColor]}
              onPress={() => {
                gotoNext();
              }}>
              <Fontisto
                name="check"
                size={30}
                color={darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite}
              />
            </TouchableOpacity>
          </View>
        </View>
        <LoopProgBar darkMode={darkMode} />
      </Animated.View>
    );
  };
  
  export default ExDiscover;
  
  const styles = StyleSheet.create({
    separtor: {
      height: 1,
      width: '100%',
      marginVertical: 10,
      backgroundColor: '#fff',
      // flex: 0.5,
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
  
    highlitedWord: {
      color: COLORS_THEME.primary,
    },
    learnedExampleBox: {
      justifyContent: 'center',
      // alignItems: 'flex-start',
      flex: 4,
      paddingVertical: 10,
    },
    nativeExampleBox: {
      justifyContent: 'center',
      flex: 4,
      paddingVertical: 10,
    },
    nativeExampleTxt: {
      fontSize: 24,
      fontFamily: FONTS.enFontFamilyMedium,
      color: '#fff',
    },
    learnedExampleTxt: {
      fontSize: 24,
      fontFamily: FONTS.enFontFamilyMedium,
      color: '#fff',
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
      width: 70,
      height: 70,
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
      width: 70,
      height: 70,
      borderRadius: 10,
      // backgroundColor: '#fff',  // Changed To DarkLight Code
      // marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      // shadowColor: '#FF4C00',
      // // borderWidth: 5,
      // // borderColor: '#ff4d0025',
      // shadowOffset: {
      //   width: 0,
      //   height: 12,
      // },
      // shadowOpacity: 0.58,
      // shadowRadius: 16.0,
  
      // elevation: 24,
      // // zIndex: 24,
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
      flex: 0,
      width: '100%',
      // //***************
      // backgroundColor: '#00bb0c',
      // width: '100%',
      // //***************
    },
    typingText: {
      color: '#fff',
      fontSize: 26,
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
      fontSize: 24,
      // fontWeight: 'bold',
      marginRight: 10,
      fontFamily: 'Nunito-Bold',
    },
    foreignWordTxt: {
      // color: '#fff',  // Changed To DarkLight Code
      fontSize: 35,
      // fontWeight: 'bold',
      fontFamily: 'Nunito-Bold',
      // Nunito-SemiBold
      // Nunito-Regular
      // Nunito-Medium
      // Nunito-Black
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
      marginBottom: 10,
    },
    foreignWordBox: {
      width: '100%',
      // marginTop: 40,
      // justifyContent: 'center',
      // alignItems: 'center',
      paddingHorizontal: 25,
      flex: 8.5,
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
      marginLeft: 15,
    },
    learnedFlag: {
      width: 26,
      height: 26,
      // backgroundColor: 'red',
      marginRight: 15,
    },
    nativeWordBox: {
      width: '100%',
      // height: 80,
      flex: 2,
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
    },
    wordImgWrapper: {
      width: '70%',
      // height: 180,
      // //***************
      // backgroundColor: '#00e2f7',
      // width: '100%',
      // //***************
      flex: 4,
      // marginHorizontal: '15%',
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
      flex: 11,
      width: '100%',
      // backgroundColor: '#181920',  // Changed To DarkLight Code
      alignItems: 'center',
      justifyContent: 'center',
    },
    conatiner: {},
    shadowImageBg: {
      width: 400,
      height: 500,
      opacity: 0.15,
      position: 'absolute',
      top: SIZES.height / 2 - 200 - 50,
      left: SIZES.width / 2 - 200,
      // backgroundColor: 'red',
    },
  });
  