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
import {Dimensions} from 'react-native';
import {languages} from '../../../languages';
import {useDispatch, useSelector} from 'react-redux';
import userReduxTypes from '../../redux/UserRedux/userRedux.types';

const mapState = ({userRedux}) => ({
  userNativeLang: userRedux.userNativeLang,
  userLearnedLang: userRedux.userLearnedLang,
});

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LangLevel = ({route, navigation}) => {
  const {userNativeLang, userLearnedLang} = useSelector(mapState);

  const dispatch = useDispatch();
  const {myId} = route.params;
  const levelsVar = [
    {id: 0, level: languages[myId].settings.levels[0]},
    {id: 1, level: languages[myId].settings.levels[1]},
    {id: 2, level: languages[myId].settings.levels[2]},
    {id: 3, level: languages[myId].settings.levels[3]},
  ];
  const languagesVar = [
    {
      id: 0,
      lang: languages[myId].settings.languages[0],
    },
    {
      id: 1,
      lang: languages[myId].settings.languages[1],
    },
    {
      id: 2,
      lang: languages[myId].settings.languages[2],
    },
    {
      id: 3,
      lang: languages[myId].settings.languages[3],
    },
    {
      id: 4,
      lang: languages[myId].settings.languages[4],
    },
    {
      id: 5,
      lang: languages[myId].settings.languages[5],
    },
    {
      id: 6,
      lang: languages[myId].settings.languages[6],
    },
  ];
  const chooseLevel = item => {
    console.log('item chooseLevel =>', item);
    dispatch({
      type: userReduxTypes.ADD_LEVEL,
      payload: item.id,
    });
    navigation.navigate('Register', {
      myId: item.id,
    });
  };
  useEffect(() => {
    console.log('userNativeLang =>', userNativeLang);
    console.log('userLearnedLang =>', userLearnedLang);
  }, [userNativeLang, userLearnedLang]);

  return (
    // <ScrollView style={{flex: 9, width: '100%', backgroundColor: '#181920'}}>
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      <View
        style={[
          styles.myNativeLang,
          {
            flexDirection: myId === 0 ? 'row-reverse' : 'row',
          },
        ]}>
        <Text style={styles.myNativeLangTxt}>
          {languages[myId].startingScreens.selectYourLevel}
        </Text>
        <Text style={styles.highlightedLangTxt}>
          {languagesVar[userLearnedLang].lang}
        </Text>
      </View>
      <ScrollView style={styles.listOfWord}>
        {/* <View style={styles.modalTitle}>
                <Text style={styles.modalTitleTxt}>Ui Language</Text>
              </View> */}
        <View style={styles.languagesWrapper}>
          {levelsVar.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.pickLang}
                onPress={() => {
                  chooseLevel(item);
                }}>
                <View style={styles.pickLangBox}>
                  <View style={styles.langBox}>
                    <Text style={styles.langTxt}>{item.level}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default LangLevel;

const styles = StyleSheet.create({
  listOfWord: {width: '100%'},
  languagesWrapper: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
  },
  langBox: {width: '100%', paddingHorizontal: 20},
  langTxt: {
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
  },
  flagImgStyle: {
    width: 30,
    height: 30,
    marginRight: 20,
    marginLeft: 20,
  },
  pickLangBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    fontSize: 20,
  },
  highlightedLangTxt: {
    color: COLORS_THEME.primary,
    fontFamily: FONTS.arFontFamilyBold,
    fontSize: 20,
    marginHorizontal: 10,
  },
  myNativeLang: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
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
    paddingTop: '20%',
    backgroundColor: '#181920',
    flex: 9,
    width: windowWidth,
    height: windowHeight,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 20,
  },
});
