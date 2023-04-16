import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ShadowEffect from '../../assets/shadowImg.png';
import Suceess from '../../assets/suceess.png';
import Arabic from '../../assets/sa.png';
import English from '../../assets/united-states.png';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS_THEME, FONTS} from '../constants/theme';
import {SIZES} from '../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {RealmContext} from '../realm/models';
import {Loop} from '../realm/models/Loop';
import loopReduxTypes from '../redux/LoopRedux/loopRedux.types';

const {useQuery, useObject, useRealm} = RealmContext;

const mapState = ({loopRedux}) => ({
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
});

const Discover = () => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const loopType = 0;

  const {loopStep, loopRoad} = useSelector(mapState);
  const dispatch = useDispatch();
  var wordSpellVariable = '';
  const [darkMode, setDarkMode] = useState(true);
  const [wordSpell, setWordSpell] = useState('');
  const [word, setWord] = useState('Erfolg');
  const [text, onChangeText] = React.useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const wordVar = 'Erfolg';
  const [wordAsArray, setWordAsArray] = useState(wordVar.split(''));
  const [times, setTimes] = useState(0);
  // const [isChecked, setIsChecked] = useState(false);
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
  const gotoNext = () => {
    console.log('gotNext start');
    if (loopStep < loopRoad.length) {
      // update loopRedux Step
      dispatch({
        type: loopReduxTypes.SET_LOOP_STEP,
        payload: loopStep + 1,
      });
      if (loopType === 0) {
        // update default wordsBag step in the real DB
        realm.write(() => {
          loop[0].stepOfDefaultWordsBag = loop[0].stepOfDefaultWordsBag + 1;
        });
      }
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
      if (wordVar === text) {
        console.warn('Yes we are fine');
        onChangeText('');
        howMuch.current += howMuch.current + 1;
        setTimes(times + 1);
        // times.current += 1;
      } else {
        // console.warn('No not good at all');
        alert(`Wrong answer : ${text}, Correct answer is: ${wordVar}`);
        onChangeText('');
        howMuch.current += howMuch.current + 1;
        setTimes(times + 1);
        // times.current += 1;
      }
    } else {
      // console.warn('That"s it let go next', howMuch.current);
      alert(`That"s it let go next`);
      onChangeText('');
      if (wordVar === text) {
        console.warn('Yes we are fine');
      } else {
        alert(`Wrong answer : ${text}, Correct answer is: ${wordVar}`);
      }
      setIsChecked(true);
    }
  };
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

  return (
    <View style={[styles.wrapper, containerBg]}>
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
            <View style={styles.questionContent}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={30}
                color={'#D2FF00'}
              />
              <Text style={styles.questionText}>Retype the word</Text>
              <Entypo name="keyboard" size={25} color={'#fff'} />
            </View>
          </View>
          <View style={styles.wordImgWrapper}>
            <Image
              resizeMethod={'resize'}
              resizeMode="contain"
              source={Suceess}
              style={styles.wordImg}
            />
          </View>
        </>
      )}

      <View
        style={[
          styles.nativeWordBox,
          {backgroundColor: darkMode ? '#00000040' : '#ffffff50'},
        ]}>
        <View style={styles.nativeWordBoxContent}>
          <Text style={[styles.nativeWordTxt, {color: color}]}>{'نجاح'}</Text>
          <Image source={Arabic} style={styles.nativeFlag} />
        </View>
      </View>
      <View style={styles.foreignWordBox}>
        <View style={styles.foreignWordBoxContent}>
          {wordAsArray.map((item, index) => {
            return (
              <Text key={index} style={[styles.foreignWordTxt, {color: color}]}>
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

      <View style={styles.btnContainer}>
        <View style={styles.blurParrent}>
          {!isChecked ? (
            <TouchableOpacity
              style={[styles.btnGo, backgroundColor]}
              onPress={() => checkResponse()}>
              <Text style={styles.checkBtnTxt}>check</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnGo, backgroundColor]}
              onPress={() => goToNext()}>
              <Text style={styles.checkBtnTxt}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={[styles.progressBarParent, backgroundColor]}>
          <View style={styles.progressBarChild}></View>
        </View>
      </View>
    </View>
  );
};

export default Discover;

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
    fontSize: 30,
    // fontWeight: 'bold',
    fontFamily: FONTS.enFontFamilyMedium,
    // Nunito-SemiBold
    // Nunito-Regular
    // Nunito-Medium
    // Nunito-Black
    letterSpacing: 8,
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
    fontSize: 35,
    // fontWeight: 'bold',
    fontFamily: 'Nunito-SemiBold',
  },
  nativeWordBoxContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  nativeFlag: {
    width: 40,
    height: 40,
    // backgroundColor: 'red',
    marginRight: 10,
    marginLeft: 20,
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
