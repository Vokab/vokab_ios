import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS_THEME, FONTS, SIZES} from '../../../../constants';
import {requestSubscription} from 'react-native-iap';

const Subs = ({sku, period, price, subscriptionOfferDetails, subElement}) => {
  return (
    <View>
      {subElement.subscriptionOfferDetails.map((offer, index) => (
        <TouchableOpacity
          style={[styles.planBox, styles.planSelected]}
          key={index}
          onPress={() =>
            requestSubscription({
              subscriptionOffers: [
                {sku: subElement.productId, offerToken: offer.offerToken},
              ],
            })
          }>
          <View style={styles.absoBox}>
            <Text style={styles.absoBoxTxt}>save 60%</Text>
          </View>
          <View style={styles.planBoxFst}>
            <Text style={styles.planLengthTxt}>1 year plan</Text>
            <Text style={styles.howMuchTxt}>$48 billed every year</Text>
          </View>
          <View style={styles.planBoxScnd}>
            <Text style={styles.planLengthTxt}>4 /mo</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Subs;

const styles = StyleSheet.create({
  absoBoxTxt: {
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyBold,
    color: COLORS_THEME.primary,
  },
  absoBox: {
    width: 80,
    height: 30,
    backgroundColor: COLORS_THEME.bgWhite,
    position: 'absolute',
    top: -10,
    right: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  howMuchTxt: {
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyRegular,
    color: '#fff',
    marginTop: 10,
  },
  planLengthTxt: {
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
  },
  planBoxScnd: {
    // backgroundColor: 'yellow',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planBoxFst: {
    justifyContent: 'center',
    // alignItems: 'center',
    width: '70%',
    height: '100%',
    // backgroundColor: 'red',
  },
  planSelected: {
    backgroundColor: COLORS_THEME.primary,
  },
  planBox: {
    height: 120,
    width: '95%',
    borderRadius: 15,
    // backgroundColor: 'rgba(255,255,255,.10)',
    backgroundColor: '#2f3049',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  plansWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  singleFeatureTxt: {
    color: COLORS_THEME.textWhite,
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyMedium,
  },
  singleFeature: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  listFeatures: {
    width: '100%',
    height: '100%',
    marginTop: 30,
  },
  iapVokabInParagTxt: {
    color: COLORS_THEME.primary,
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  iapParagTxt2: {
    color: COLORS_THEME.textWhite,
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyRegular,
    textAlign: 'center',
  },
  iapParagTxt: {
    color: COLORS_THEME.textWhite,
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyRegular,
    textAlign: 'center',
  },
  iapParag: {
    marginTop: 20,
  },
  iapBox: {
    flexDirection: 'row',
  },
  iapPlus: {
    color: COLORS_THEME.primary,
    fontSize: 26,
    fontFamily: FONTS.enFontFamilyBold,
  },
  iapVokab: {
    color: '#fff',
    fontSize: 26,
    fontFamily: FONTS.enFontFamilyBold,
    marginRight: 10,
  },
  storeWrapper: {
    height: '100%',
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  premiumImage: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
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
    // width: 30,
    // height: 30,
    // marginRight: 15,
    // justifyContent: 'center',
    // alignItems: 'center',
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
  iapBtnTxt: {
    color: '#fff',
    fontSize: 26,
    fontFamily: FONTS.enFontFamilyBold,
  },
  iapBtnProfile: {borderRadius: 30, marginVertical: 10, marginTop: 20},
  iapBtn: {
    width: '90%',
    marginLeft: '5%',
    borderRadius: 30,
  },
  image: {
    padding: 20,
    // borderRadius: 30,
    height: 500,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderBottomLeftRadius: 20,
  },
  screenWrapper: {
    // backgroundColor: 'red',
    flex: 1,
    // width: SIZES.width,
    // height: SIZES.height,
    // marginTop: 20,
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
