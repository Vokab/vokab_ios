import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FONTS} from '../../../constants';

const HintHeaderBg = props => {
  const {text} = props;
  return (
    <View style={styles.hintBox}>
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
};

export default HintHeaderBg;

const styles = StyleSheet.create({
  hintBox: {
    backgroundColor: '#FF4C00',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  hintText: {
    color: '#fff',
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 14,
    opacity: 1,
  },
});
