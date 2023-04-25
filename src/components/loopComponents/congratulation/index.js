import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    Alert,
    Animated,
    Dimensions,
  } from 'react-native';
  import React, {useEffect, useState, useRef, useMemo} from 'react';
  import ShadowEffect from '../../../../assets/shadowImg.png';
  import {COLORS_THEME, FONTS} from '../../../constants/theme';
  import {SIZES} from '../../../constants/theme';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import LottieView from 'lottie-react-native';
  import {RealmContext} from '../../../realm/models';
  import {useNavigation} from '@react-navigation/native';
  import {languages} from '../../../../languages';
  import {User} from '../../../realm/models/User';
  import Premium from '../../../../assets/premium.png';
  import IapBg from '../../../../assets/iap.png';
  
  const {useQuery, useObject, useRealm} = RealmContext;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  const Congratulation = () => {
    const [darkMode, setDarkMode] = useState(true);
    const animElementWrong = useRef();
    const navigation = useNavigation();
    const user = useQuery(User);
    const isSubed = user[0].isPremium;
    let userUiLang = user[0].userUiLang;
  
    const gotoNext = () => {
      navigation.navigate('Home');
    };
    return (
      <Animated.View
        style={[
          styles.wrapper,
  
          // {opacity: fadeAnim, transform: [{translateX: transalteAnim}]},
        ]}>
        <Image source={ShadowEffect} style={styles.shadowImageBg} />
  
        <Image
          source={ShadowEffect}
          style={styles.blurEffectImg}
          blurRadius={50}
        />
        <LottieView
          ref={animElementWrong}
          source={require('../../../../assets/animations/congratulation.json')}
          autoPlay={true}
          loop={true}
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            elevation: 1,
            zIndex: -1,
          }}
        />
        <View style={styles.congratulationBox}>
          <Text style={styles.congratulationTxt}>
            {languages[userUiLang].congratulation}
          </Text>
          {!isSubed && (
            <View style={styles.askingForMoney}>
              <Text style={styles.premiumAsk}>
                {languages[userUiLang].congratulationMessage}
              </Text>
  
              <View style={styles.iapBtnProfile}>
                <TouchableOpacity
                  style={styles.iapBtn}
                  onPress={() => {
                    navigation.navigate('Store');
                  }}>
                  <ImageBackground
                    source={IapBg}
                    resizeMode="cover"
                    style={styles.image}
                    imageStyle={{borderRadius: 10}}>
                    <Text style={styles.iapBtnTxt}>Vokab Plus</Text>
                    <Image source={Premium} style={styles.premiumImage} />
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
  
        {/* <Text style={styles.btnGoTxt}>GO</Text> */}
  
        <View style={styles.blurParrent}>
          <Image
            source={ShadowEffect}
            style={styles.blurEffectImg}
            blurRadius={50}
          />
          <TouchableOpacity
            style={[styles.btnGo]}
            onPress={() => {
              gotoNext();
            }}>
            <AntDesign
              name="home"
              size={30}
              color={darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };
  
  export default Congratulation;
  
  const styles = StyleSheet.create({
    askingForMoney: {
      marginTop: 30,
      paddingHorizontal: 30,
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
    image: {
      padding: 20,
      borderRadius: 30,
    },
    iapBtnProfile: {borderRadius: 30, marginVertical: 10, marginTop: 30},
    iapBtn: {
      width: '90%',
      marginLeft: '5%',
      borderRadius: 30,
    },
    btnBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    congratulationBox: {
      height: '80%',
      flex: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    congratulationTxt: {
      color: '#fff',
      fontFamily: FONTS.enFontFamilyMedium,
      fontSize: 35,
      marginBottom: 20,
    },
    premiumAsk: {
      color: '#fff',
      fontFamily: FONTS.enFontFamilyRegular,
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    foreignFlag: {
      width: 20,
      height: 20,
      // backgroundColor: 'red',
      marginRight: 20,
    },
    foreignWordBoxContent: {},
    inputBoxSubBox: {
      width: '100%',
      // justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
    },
    input: {
      width: '80%',
      // backgroundColor: 'red',
      color: '#fff',
      fontSize: 20,
      // fontWeight: 'bold',
      fontFamily: FONTS.enFontFamilyMedium,
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
      fontSize: 16,
      marginLeft: 15,
      marginRight: 10,
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
      width: '100%',
      height: '100%',
      flex: 2.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    blurEffectImg: {
      position: 'absolute',
      top: '-80%',
      left: '-60%',
      // width: '220%',
      // height: '260%',
      // backgroundColor: 'red',
      zIndex: -1,
      opacity: 0.25,
    },
    btnGoTxt: {
      color: '#1D1E37',
      fontSize: 22,
      fontWeight: 'bold',
    },
    btnGo: {
      width: 100,
      height: 70,
      borderRadius: 10,
      backgroundColor: COLORS_THEME.bgWhite, // Changed To DarkLight Code
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
      fontSize: 28,
      // fontWeight: 'bold',
      fontFamily: 'Nunito-SemiBold',
    },
    nativeWordBoxContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      // backgroundColor: 'red',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    nativeFlag: {
      width: 26,
      height: 26,
      // backgroundColor: 'red',
      // marginRight: 10,
      marginLeft: 15,
    },
    learnedFlag: {
      width: 26,
      height: 26,
      // backgroundColor: 'red',
      // marginRight: 10,
      marginRight: 15,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    exclamBtnStyle: {width: '10%'},
    reviewBox: {
      flexDirection: 'row',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      marginTop: 10,
    },
    reviewStyle: {
      width: 30,
      height: 30,
      marginRight: 15,
    },
    reviewTxtStyle: {
      color: COLORS_THEME.primary,
      fontFamily: FONTS.enFontFamilyBold,
      fontSize: 24,
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
      backgroundColor: COLORS_THEME.bgDark,
      height: windowHeight,
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
  