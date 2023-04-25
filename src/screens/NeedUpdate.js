import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import ShadowEffect from '../../assets/shadowImg.png';
import {COLORS_THEME, FONTS, SIZES} from '../constants';

const NeedUpdate = () => {
  return (
    <ScrollView
      style={{
        flex: 1,
        width: SIZES.width,
        height: SIZES.height,
        backgroundColor: '#181920',
      }}>
      <View style={styles.screenWrapper}>
        <Image source={ShadowEffect} style={styles.shadowImageBg} />
        <Text
          style={{
            color: '#fff',
            fontSize: 30,
            fontFamily: FONTS.enFontFamilyBold,
            textAlign: 'center',
          }}>
          Thanks to update the app from the store
        </Text>
      </View>
    </ScrollView>
  );
};

export default NeedUpdate;

const styles = StyleSheet.create({
  logoutBtn: {},
  logoutBtnTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyRegular,
  },
  logoutBox: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  statsBox: {
    marginTop: 40,
  },
  streakNbrTxt: {
    color: COLORS_THEME.primary,
    fontSize: 25,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakNbrBox: {
    // marginRight: 15,
  },
  languageTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyRegular,
    textTransform: 'uppercase',
  },
  streakTxtStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakImgStyle: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  streakBoxTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#242536',
    paddingVertical: 20,
    marginVertical: 5,
  },
  premiumImage: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 50,
    top: 5,
  },
  iapBtnTxt: {
    color: '#fff',
    fontSize: 24,
    fontFamily: FONTS.enFontFamilyBold,
    marginLeft: '5%',
  },
  iapBtnProfile: {borderRadius: 30, marginVertical: 10, marginTop: 20},
  iapBtn: {
    width: '90%',
    marginLeft: '5%',
    borderRadius: 30,
  },
  image: {
    padding: 20,
    borderRadius: 30,
  },
  screenWrapper: {
    backgroundColor: '#181920',
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
});
