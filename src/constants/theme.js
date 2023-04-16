/* eslint-disable prettier/prettier */
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

// export const COLORS_THEME = darkTheme ? darkColors : lightColors;
export const COLORS_THEME = {
  // Primary
  primary: '#FF4C00',
  secondary: '#1D1E37',

  // light mode
  bgWhite: '#FDFCFF',
  textWhite: '#FFFFFF',

  // dark mode
  bgDark: '#181920',
  textDark: '#1D1E37',

  // true & false
  true: '#33C255',
  false: '#A02C2C',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,
  // app dimensions
  width,
  height,
};

export const FONTS = {
  // en
  enFontFamilyBold: 'Nunito-Bold',
  enFontFamilyMedium: 'Nunito-Medium',
  enFontFamilyRegular: 'Nunito-Regular',
  // // ar
  // arFontFamilyBold: 'NotoSansArabic-SemiBold',
  // arFontFamilyRegular: 'NotoSansArabic-Medium',
};

const appTheme = {SIZES, FONTS, COLORS_THEME};

export default appTheme;
