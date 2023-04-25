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
  import SoundPlayer from 'react-native-sound-player';
  // import Sound from 'react-native-sound';
  import LoopProgBar from '../../screensComponents/loopProgBar';
  import {flags} from '../../../constants/images';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import {languages} from '../../../../languages';
  import LottieView from 'lottie-react-native';
  import {PassedWords} from '../../../realm/models/PassedWords';
  import {useNavigation} from '@react-navigation/native';
  
  const {useQuery, useObject, useRealm} = RealmContext;
  
  const mapState = ({loopRedux}) => ({
    loopStep: loopRedux.loopStep,
    loopRoad: loopRedux.loopRoad,
  });
  
  const ExTest = props => {
    const realm = useRealm();
    const loop = useQuery(Loop);
    const user = useQuery(User);
    let userUiLang = user[0].userUiLang;
    const {loopType, userLearnedLang, userNativeLang} = props;
    let isDefaultDiscover = loop[0].isDefaultDiscover;
    let isCustomDiscover = loop[0].isCustomDiscover;
    const navigation = useNavigation();
    const {loopStep, loopRoad} = useSelector(mapState);
    const dispatch = useDispatch();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const transalteAnim = useRef(new Animated.Value(-SIZES.width)).current;
    var wordSpellVariable = '';
    const [darkMode, setDarkMode] = useState(true);
    const [wordSpell, setWordSpell] = useState('');
    const [fadeInOut, setFadeInOut] = useState(false);
    const [suggWords, setSuggWords] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [trueOfFalse, setTrueOfFalse] = useState(false);
  
    const wordVar = loopRoad[loopStep].wordObj.wordLearnedLang;
    const word = loopRoad[loopStep].wordObj.wordLearnedLang;
    const passedWord = useObject(PassedWords, loopRoad[loopStep].wordObj._id); // REMOVED FOR ANIMATION TESTING
  
    const fadeAnimnNative = useRef(new Animated.Value(1)).current;
    const fadeAnimLearn = useRef(new Animated.Value(0)).current;
    const animElement = useRef();
    const animElementWrong = useRef();
  
   // correctSound = useMemo(() => new Sound('correct.mp3'), []);
   // const wrongSound = useMemo(() => new Sound('wrong.mp3'), []);
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
    const myWord = loopRoad[loopStep].wordObj;
    let ourWord = myWord.wordLearnedExample.substring(
      myWord.exLearnedIndex - 1,
      myWord.exLearnedLength + myWord.exLearnedIndex,
    );
  
    const buildSuggFromBag = async () => {
      let arr = [];
      let randomArray = [];
      // console.log('this word bag array =>', loop[0].defaultWordsBag);
      loop[0].defaultWordsBag.forEach(item => {
        // console.log('this word is =>', item.wordLearnedLang);
        arr.push(item.wordLearnedLang);
      });
      console.log('array before remove word =>', arr);
      const index = arr.indexOf(word);
      arr.splice(index, 1);
      console.log('array after remove word =>', arr);
      for (let i = 0; i < 3; i++) {
        var randomWord = arr[Math.floor(Math.random() * arr.length)];
        randomArray.push(randomWord);
        // here we need to remove this random word from the arr array to dont duplicate // DONE
        let indexOfRandom = arr.indexOf(randomWord);
        arr.splice(indexOfRandom, 1);
      }
  
      randomArray.push(ourWord);
      let shuffledArray = await shuffle(randomArray);
      setSuggWords(shuffledArray);
      //  item = items[Math.floor(Math.random()*items.length)];
    };
    useEffect(() => {
      buildSuggFromBag();
    }, [loopStep]);
  
    // const loopExit = async () => {
    //   dispatch({
    //     type: loopReduxTypes.RESET_LOOP,
    //   });
    //   if (loopType === 0) {
    //     // update default wordsBag road in the real DB
    //     realm.write(() => {
    //       loop[0].stepOfDefaultWordsBag = 0;
    //     });
    //   }
    // };
  
    useEffect(() => {
      translateTo();
    }, [loopStep]);
  
    useEffect(() => {
      if (trueOfFalse === true) {
        animElement.current?.play();
        // correctSound.play();
      } else {
        animElementWrong.current?.play();
        // wrongSound.play();
      }
    }, [trueOfFalse, isChecked]);
  
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
      }
    };
  
    const goToNext = () => {
      console.log('goToNext start');
      fadeAnimnNative.setValue(1);
      fadeAnimLearn.setValue(0);
      setSelectedItem(null);
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
    const checkResponse = () => {
      setIsChecked(true);
  
      if (ourWord === selectedItem) {
        setTrueOfFalse(true);
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
       // wrongSound.play();
       SoundPlayer.playSoundFile('wrong','mp3');
        // animElementWrong.current?.play();
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
      // setSelectedItem(null);
    };
    const selectItem = item => {
      console.log('selectItem => ', selectedItem);
      setSelectedItem(item);
    };
  
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
        myWord.exNativeIndex + myWord.exLearnedLength,
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
      // let ourWord = myWord.wordLearnedExample.substring(
      //   myWord.exLearnedIndex - 1,
      //   myWord.exLearnedLength + myWord.exLearnedIndex,
      // );
      let afterWb = myWord.wordLearnedExample.substring(
        myWord.exLearnedIndex + myWord.exLearnedLength,
        myWord.wordLearnedExample.length,
      );
      // console.log('beforeWb =>', beforeWb);
      // console.log('ourWord =>', ourWord);
      // console.log('afterWb =>', afterWb);
      return (
        <Text style={styles.nativeExampleTxt}>
          {beforeWb}
          <Text style={[styles.nativeExampleTxt, styles.highlitedWord]}>
            {'------ '}
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
        {/* <View
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
        </View> */}
  
        <View style={styles.foreignWordBox}>
          <View style={styles.learnedExampleBox}>
            <WordLearnedBelong />
          </View>
          <View style={styles.separtor}></View>
          <View style={styles.nativeExampleBox}>
            <WordNativeBelong />
          </View>
        </View>
  
        <View style={styles.cardsResponseContainer}>
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
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignContent: 'center',
            }}>
            {suggWords.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  disabled={isChecked}
                  style={[
                    styles.suggCard,
                    {
                      backgroundColor: isChecked
                        ? selectedItem === item
                          ? selectedItem === word
                            ? '#178b2e'
                            : '#6d0303'
                          : item === word
                          ? '#178b2e'
                          : '#1D1E3750'
                        : selectedItem === item
                        ? '#FF4C00'
                        : '#1D1E3750',
                    },
                  ]}
                  onPress={() => {
                    selectItem(item);
                  }}>
                  <Text style={styles.suggCardText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
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
  
  export default ExTest;
  
  const styles = StyleSheet.create({
    checkBtnTxt: {
      fontFamily: FONTS.enFontFamilyBold,
      color: '#000',
      fontSize: 24,
    },
    suggCardText: {
      fontFamily: FONTS.enFontFamilyBold,
      color: '#fff',
      fontSize: 16,
    },
    suggCard: {
      width: '40%',
      height: 70,
      backgroundColor: '#1D1E3750',
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#FF4C0030',
      borderWidth: 5,
    },
  
    cardsResponseContainer: {
      width: '100%',
      // marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 4,
      // //***************
      // backgroundColor: '#a79d08',
      // width: '100%',
      // //***************
    },
    separtor: {
      height: 1,
      width: '100%',
      marginVertical: 10,
      backgroundColor: '#fff',
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
      alignItems: 'flex-start',
      paddingVertical: 10,
    },
    nativeExampleBox: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingVertical: 10,
    },
    nativeExampleTxt: {
      fontSize: 22,
      fontFamily: FONTS.enFontFamilyMedium,
      color: '#fff',
    },
    learnedExampleTxt: {
      fontSize: 22,
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
    // btnGo: {
    //   width: 70,
    //   height: 70,
    //   borderRadius: 10,
    //   // backgroundColor: '#fff',  // Changed To DarkLight Code
    //   // marginTop: 20,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   // shadowColor: '#FF4C00',
    //   // // borderWidth: 5,
    //   // // borderColor: '#ff4d0025',
    //   // shadowOffset: {
    //   //   width: 0,
    //   //   height: 12,
    //   // },
    //   // shadowOpacity: 0.58,
    //   // shadowRadius: 16.0,
  
    //   // elevation: 24,
    //   // // zIndex: 24,
    // },
  
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
      flex: 5,
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
      justifyContent: 'center',
      // alignItems: 'center',
      paddingHorizontal: 25,
      flex: 3.5,
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
  