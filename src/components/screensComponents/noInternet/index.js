import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {COLORS_THEME, FONTS} from '../../../constants';
import Wifi from '../../../../assets/wifi.png';
const NoInternet = () => {
  return (
    <View style={styles.container}>
      <Image
        source={Wifi}
        style={styles.wifiImg}
        resizeMethod="resize"
        resizeMode="cover"
      />
      <Text style={styles.opsStyle}>Ooops!</Text>
      <Text style={styles.txtStyle}>Slow or no internet connection</Text>
      <Text style={styles.txtStyle}>Check your internet settings</Text>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  wifiImg: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  txtStyle: {
    fonts: 18,
    color: COLORS_THEME.bgWhite,
    fontFamily: FONTS.enFontFamilyMedium,
    marginBottom: 5,
  },
  opsStyle: {
    fontSize: 40,
    color: COLORS_THEME.primary,
    fontFamily: FONTS.enFontFamilyBold,
    marginBottom: 20,
  },
  container: {
    backgroundColor: COLORS_THEME.bgDark,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
