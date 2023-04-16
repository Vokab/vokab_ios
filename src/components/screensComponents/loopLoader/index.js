import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS_THEME, FONTS} from '../../../constants';
import LottieView from 'lottie-react-native';

const LoopLoader = () => {
  return (
    <View style={styles.loopLoaderWrapper}>
      <LottieView
        source={require('../../../../assets/animations/loopLoader.json')}
        autoPlay={true}
        loop={true}
        style={
          {
            //   backgroundColor: 'rgba(0,0,0,0.3)',
            //   width: '100%',
            //   height: '100%',
            //   position: 'absolute',
            //   top: 0,
            //   left: 0,
            //   elevation: 3,
            //   zIndex: 3,
          }
        }
      />
      {/* <Text style={styles.loaderTxt}>...</Text> */}
      {/* <ActivityIndicator size="large" color={COLORS_THEME.primary} /> */}
    </View>
  );
};

export default LoopLoader;

const styles = StyleSheet.create({
  loaderTxt: {
    fontSize: 20,
    color: '#fff',
    fontFamily: FONTS.enFontFamilyMedium,
  },
  loopLoaderWrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS_THEME.bgDark,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
});
