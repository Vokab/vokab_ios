import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';

import {COLORS_THEME, FONTS} from '../../../constants/theme';
import {SIZES} from '../../../constants/theme';
import Arabic from '../../../assets/sa.png';
import English from '../../../assets/united-states.png';
import ShadowEffect from '../../../assets/shadowImg.png';
import Icon from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Example = () => {
  const [darkMode, setDarkMode] = useState(true);

  const containerBg = {
    backgroundColor: darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite,
  };
  const backgroundColor = {
    backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
  };
  const color = darkMode ? COLORS_THEME.textWhite : COLORS_THEME.textDark;

  return (
    <View style={[styles.wrapper, containerBg]}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="exclamationcircleo" size={18} color={color} />
        </TouchableOpacity>
      </View>
      <View style={styles.questionWrapper}>
        <View style={styles.questionContent}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={30}
            color={'#D2FF00'}
          />
          <Text style={styles.questionText}>Type what mean</Text>
        </View>
      </View>
      <View style={styles.wordImgWrapper}>
        {/* <Image
            resizeMethod={'resize'}
            resizeMode="contain"
            source={Suceess}
            style={styles.wordImg}
          /> */}
      </View>

      <View
        style={[
          styles.nativeWordBox,
          {backgroundColor: darkMode ? '#00000040' : '#ffffff50'},
        ]}>
        <View style={styles.nativeWordBoxContent}>
          <Text style={[styles.nativeWordTxt, {color: color}]}>نجاح</Text>
          <Image source={Arabic} style={styles.nativeFlag} />
        </View>
      </View>
      <View style={styles.foreignWordBox}>
        <View style={styles.foreignWordBoxContent}>
          {/* <TouchableOpacity>
              <Icon name="speaker" size={80} color="#FF4C00" />
            </TouchableOpacity> */}
        </View>
      </View>

      <View style={styles.inputBox}>
        {/* <View style={styles.inputBoxSubBox}>
            <TextInput
              style={styles.input}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholder="write here"
              placeholderTextColor="#ffffff40"
            />
          </View> */}
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.blurParrent}>
          <Image
            source={ShadowEffect}
            style={styles.blurEffectImg}
            blurRadius={50}
          />
          <TouchableOpacity style={[styles.btnGo, backgroundColor]}>
            {/* <Fontisto
                name="check"
                size={30}
                color={darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite}
              /> */}
            <Text style={styles.checkBtnTxt}>check</Text>
          </TouchableOpacity>
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

export default Example;

const styles = StyleSheet.create({
  inputBoxSubBox: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    // backgroundColor: 'red',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 18,
    marginLeft: 15,
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
    width: 150,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurEffectImg: {
    position: 'absolute',
    top: '-10%',
    left: '-30%',
    width: '160%',
    height: '120%',
    // backgroundColor: 'red',
    zIndex: -1,
    opacity: 0.4,
  },
  btnGoTxt: {
    color: '#1D1E37',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btnGo: {
    width: 150,
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
    fontSize: 35,
    // fontWeight: 'bold',
    fontFamily: 'Nunito-SemiBold',
  },
  nativeWordBoxContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  nativeFlag: {
    width: 26,
    height: 26,
    // backgroundColor: 'red',
    // marginRight: 10,
    marginLeft: 15,
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
