import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ShadowEffect from '../../../assets/shadowImg.png';
import {COLORS_THEME, FONTS, SIZES} from '../../constants';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dimensions} from 'react-native';
import English from '../../../assets/1.png';
import Arabic from '../../../assets/0.png';
import French from '../../../assets/2.png';
import German from '../../../assets/3.png';
import Italian from '../../../assets/4.png';
import Espagnol from '../../../assets/5.png';
import Portugais from '../../../assets/6.png';
import {languages} from '../../../languages';
import {useDispatch, useSelector} from 'react-redux';
import userReduxTypes from '../../redux/UserRedux/userRedux.types';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LearnedLang = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {myId} = route.params;
  // const myId = 0;
  const languagesVar = [
    {
      id: 0,
      lang: languages[myId].settings.languages[0],
      flag: Arabic,
    },
    {
      id: 1,
      lang: languages[myId].settings.languages[1],
      flag: English,
    },
    {
      id: 2,
      lang: languages[myId].settings.languages[2],
      flag: French,
    },
    {
      id: 3,
      lang: languages[myId].settings.languages[3],
      flag: German,
    },
    {
      id: 4,
      lang: languages[myId].settings.languages[4],
      flag: Italian,
    },
    {
      id: 5,
      lang: languages[myId].settings.languages[5],
      flag: Espagnol,
    },
    {
      id: 6,
      lang: languages[myId].settings.languages[6],
      flag: Portugais,
    },
  ];
  const chooseLang = item => {
    console.log('item =>', item);
    dispatch({
      type: userReduxTypes.ADD_LEARNED_LANG,
      payload: item.id,
    });
    navigation.navigate('LangLevel', {
      myId: myId,
    });
  };
  return (
    // <ScrollView style={{flex: 9, width: '100%', backgroundColor: '#181920'}}>
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      <View style={styles.langPicked}>
        <Text style={styles.myNativeLangTxt}>
          {languages[myId].startingScreens.myNativeLan}
        </Text>

        <View
          style={[
            styles.langPickedBox,
            {
              flexDirection: myId === 0 ? 'row-reverse' : 'row',
            },
          ]}>
          <Image source={languagesVar[myId].flag} style={styles.flagImgStyle} />
          <Text style={styles.langPickedTxt}>{languagesVar[myId].lang}</Text>
        </View>
      </View>
      <View style={styles.myNativeLang}>
        <Text style={styles.myNativeLangTxt}>
          {languages[myId].startingScreens.iWantToLearn}
        </Text>
      </View>
      <ScrollView style={styles.listOfWord}>
        {/* <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>Ui Language</Text>
              </View> */}
        <View style={styles.languagesWrapper}>
          {languagesVar.map((item, index) => {
            if (item.id !== myId) {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.pickLang}
                  onPress={() => {
                    chooseLang(item);
                  }}>
                  <View
                    style={[
                      styles.pickLangBox,
                      {
                        flexDirection: myId === 0 ? 'row-reverse' : 'row',
                      },
                    ]}>
                    <Image source={item.flag} style={styles.flagImgStyle} />
                    <View style={styles.langBox}>
                      <Text style={styles.langTxt}>{item.lang}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default LearnedLang;

const styles = StyleSheet.create({
  langPicked: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
  },
  listOfWord: {width: '100%'},
  languagesWrapper: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
  },
  langBox: {
    width: '80%',
  },
  langPickedBox: {
    width: '80%',
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  langPickedTxt: {
    fontSize: 24,
    fontFamily: FONTS.enFontFamilyBold,
    color: COLORS_THEME.primary,
  },
  langTxt: {
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
  },
  flagImgStyle: {
    width: 20,
    height: 20,
    // marginRight: 20,
    marginHorizontal: 15,
  },
  pickLangBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
    width: '100%',
    paddingVertical: 20,
  },
  pickLang: {
    width: '100%',

    marginVertical: 5,
  },
  streakNbrTxt: {
    color: COLORS_THEME.primary,
    fontSize: 25,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakNbrBox: {
    marginRight: 15,
  },
  streakTxtStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakBoxTitle: {flexDirection: 'row'},
  streakBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#242536',
    paddingVertical: 20,
    marginVertical: 5,
  },
  myNativeLangTxt: {
    color: '#fff',
    fontFamily: FONTS.arFontFamilyBold,
    fontSize: 22,
  },
  myNativeLang: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  shadowImageBg: {
    width: 400,
    height: 500,
    opacity: 0.15,
    position: 'absolute',
    top: 0,
    left: SIZES.width / 2 - 200,
    // backgroundColor: 'red',
  },
  screenWrapper: {
    // paddingTop: '20%',
    backgroundColor: '#181920',
    // flex: 9,
    width: windowWidth,
    height: windowHeight,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 20,
  },
});
