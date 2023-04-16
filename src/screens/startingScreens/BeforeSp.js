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
import {useNavigation} from '@react-navigation/native';
import {RealmContext} from '../../realm/models';
import {Loop} from '../../realm/models/Loop';
import {User} from '../../realm/models/User';
import {Word} from '../../realm/models/Word';

const {useQuery, useRealm} = RealmContext;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BeforeSplash = () => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const users = useQuery(User);
  const words = useQuery(Word);

  const navigation = useNavigation();
  const goToLogin = () => {
    navigation.navigate('Login');
  };
  const getStarted = () => {
    navigation.navigate('NativeLang');
  };

  // const getNotifTokenForThisDevice = async () => {
  //   let myToken = '';
  //   console.log('getNotifTokenForThisDevice');
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     await messaging()
  //       .getToken()
  //       .then(fcmToken => {
  //         console.log('Fcm Token =>', fcmToken);

  //         myToken = fcmToken;
  //         // storeToken(fcmToken);
  //       })
  //       .catch(e => {
  //         console.log('error =<', e);
  //       });
  //     return myToken;
  //   } else {
  //     console.log('Not Authorized status:', authStatus);
  //   }
  // };

  // useEffect(() => {
  //   // console.log('users', users[0].notifToken);
  //   getNotifTokenForThisDevice().then(res => {
  //     console.log('my token is =>', res);
  //   });
  // }, []);

  return (
    // <ScrollView style={{flex: 9, width: '100%', backgroundColor: '#181920'}}>
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      <View style={styles.welcomeBlock}>
        {/* <View style={styles.welcomeStyle}>
          <Text style={styles.welcomeTxt}>Welcome to</Text>
        </View> */}
        <View style={styles.vokabWrapper}>
          <View style={styles.vokabBox}>
            <Text style={styles.vokabTxt}>Vokab</Text>
          </View>
        </View>
      </View>
      <View style={styles.quoteBlock}>
        <View style={styles.quoteStyle}>
          <Text style={styles.quoteTxtStyle}>‘‘ Teaching you </Text>
          <Text style={styles.highlightedTxt}>new words </Text>
          <Text style={styles.quoteTxtStyle}>and making them </Text>
          <Text style={styles.highlightedTxt}>unforgettable </Text>
          <Text style={styles.quoteTxtStyle}>is </Text>
          <Text style={styles.highlightedTxt}>our responsability </Text>
          <Text style={styles.quoteTxtStyle}>’’</Text>
        </View>
        <View style={styles.vokabTeamBox}>
          <Text style={styles.vokabTeamTxt}>Vokab team</Text>
        </View>
      </View>
      <View style={styles.btnsBlock}>
        <View style={styles.actionBtns}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={() => {
              getStarted();
            }}>
            <Text style={styles.getStartedTxt}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.haveAccBtn}
            onPress={() => {
              goToLogin();
            }}>
            <Text style={styles.haveAccTxt}>Already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // </ScrollView>
  );
};

export default BeforeSplash;

const styles = StyleSheet.create({
  btnsBlock: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quoteBlock: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBlock: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  haveAccTxt: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: FONTS.enFontFamilyRegular,
    textAlign: 'center',
  },
  haveAccBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
  },
  actionBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  getStartedTxt: {
    color: '#fff',
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: FONTS.enFontFamilyBold,
    textAlign: 'center',
  },
  getStartedBtn: {
    backgroundColor: COLORS_THEME.primary,
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: '10%',
    marginBottom: 20,
  },
  vokabTeamBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  vokabTeamTxt: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 18,
    fontFamily: FONTS.enFontFamilyMedium,
  },
  highlightedTxt: {
    fontSize: 20,
    letterSpacing: 1,
    color: COLORS_THEME.primary,
    fontFamily: FONTS.enFontFamilyBold,
  },
  quoteTxtStyle: {
    color: '#fff',
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: FONTS.enFontFamilyRegular,
  },
  quoteStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    // marginBottom: 20,
  },
  vokabWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 50,
  },
  vokabTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 28,
    color: COLORS_THEME.primary,
    letterSpacing: 2,
  },
  vokabBox: {
    paddingHorizontal: 70,
    paddingVertical: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  welcomeTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 20,
    color: '#fff',
  },
  welcomeStyle: {
    marginBottom: 20,
  },
  shadowImageBg: {
    width: 400,
    height: 500,
    opacity: 0.2,
    position: 'absolute',
    top: 0,
    left: SIZES.width / 2 - 200,
    // backgroundColor: 'red',
    // zIndex: 3,
    // elevation: 3,
  },
  screenWrapper: {
    backgroundColor: '#181920',
    flex: 9,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
  },
});
