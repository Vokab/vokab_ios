import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ShadowEffect from '../../assets/shadowImg.png';
import {COLORS_THEME, FONTS, SIZES} from '../constants';
import ProfileHeader from '../components/screensComponents/profileHeader';
import SettingsHeader from '../components/screensComponents/settingsHeader';
import IapBg from '../../assets/iap.png';
import Premium from '../../assets/premium.png';
import Thunder from '../../assets/thunder.png';
import Level from '../../assets/levelWhite.png';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChangeName from '../components/screensComponents/modals/changeName';
import ChangeUiLang from '../components/screensComponents/modals/changeUiLang';
import ChangeLevel from '../components/screensComponents/modals/changeLevel';
import {RealmContext} from '../realm/models';
import {User} from '../realm/models/User';
import {languages} from '../../languages';
import DeleteAccount from '../components/screensComponents/modals/deleteAccount';

const {useQuery, useObject, useRealm} = RealmContext;

const Settings = ({navigation}) => {
  const user = useQuery(User);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [uiLangModalVisible, setUiLangModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  let userName = user[0]?.userName;
  let userUiLang = user[0]?.userUiLang;
  let userLevel = user[0]?.userLevel;
  const languagesVar = [
    'Arabic',
    'English',
    'French',
    'German',
    'Italien',
    'Espagnol',
    'Portugais',
  ];
  const levelsVar = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
  const ChangeNameModal = () => {
    setNameModalVisible(true);
  };
  const ChangeUiModal = () => {
    setUiLangModalVisible(true);
  };
  const deleteAccount = () => {
    setAccountModalVisible(true);
  };
  useEffect(() => {
    // console.log('userUiLang', userUiLang);
  }, []);

  return (
    <ScrollView style={{flex: 1, width: '100%', backgroundColor: '#181920'}}>
      <View style={styles.screenWrapper}>
        <Image source={ShadowEffect} style={styles.shadowImageBg} />
        <SettingsHeader
          screenTitle={`${languages[userUiLang]?.settings.settings}`}
        />
        {!user[0]?.isPremium && (
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
        )}
        <View style={styles.statsBox}>
          {/* Name Setting Box */}
          <View style={styles.streakBox}>
            <View style={styles.streakBoxTitle}>
              <FontAwesome5
                name={'user-alt'}
                size={25}
                color={'#fff'}
                style={styles.streakImgStyle}
              />
              <Text style={styles.streakTxtStyle}>{userName}</Text>
            </View>
            <View style={styles.streakNbrBox}>
              <TouchableOpacity onPress={ChangeNameModal}>
                <MaterialIcons
                  name={'edit'}
                  size={26}
                  color={COLORS_THEME.primary}
                  style={styles.streakImgStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Level Setting Box */}
          <View style={styles.streakBox}>
            <View style={styles.streakBoxTitle}>
              <Image source={Level} style={styles.streakImgStyle} />
              {/* <Text style={styles.streakTxtStyle}>Level 2</Text> */}
              <View>
                <Text style={styles.languageTitle}>
                  {languages[userUiLang]?.profile.level}
                </Text>
                <Text style={styles.streakTxtStyle}>
                  {languages[userUiLang]?.settings.levels[userLevel]}
                </Text>
              </View>
            </View>
            <View style={styles.streakNbrBox}>
              <TouchableOpacity
                onPress={() => {
                  setLevelModalVisible();
                }}>
                <MaterialIcons
                  name={'edit'}
                  size={26}
                  color={COLORS_THEME.primary}
                  style={styles.streakImgStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* UI Language Setting Box */}
          <View style={styles.streakBox}>
            <View style={styles.streakBoxTitle}>
              <FontAwesome
                name={'language'}
                size={26}
                color={'#fff'}
                style={styles.streakImgStyle}
              />
              <View>
                <Text style={styles.languageTitle}>
                  {languages[userUiLang]?.settings.uiLanguage}
                </Text>
                <Text style={styles.streakTxtStyle}>
                  {languages[userUiLang]?.settings.languages[userUiLang]}
                  {/* {languagesVar[userUiLang]} */}
                </Text>
              </View>
            </View>
            <View style={styles.streakNbrBox}>
              <TouchableOpacity
                onPress={() => {
                  ChangeUiModal();
                }}>
                <MaterialIcons
                  name={'edit'}
                  size={26}
                  color={COLORS_THEME.primary}
                  style={styles.streakImgStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.logoutBox}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              deleteAccount();
            }}>
            <Text style={styles.logoutBtnTxt}>
              {languages[userUiLang]?.settings.delete_account}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.logoutBox}>
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutBtnTxt}>
              {languages[userUiLang].settings.logout}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {user[0] && (
        <>
          <ChangeName
            nameModalVisible={nameModalVisible}
            setNameModalVisible={setNameModalVisible}
          />
          <ChangeUiLang
            uiLangModalVisible={uiLangModalVisible}
            setUiLangModalVisible={setUiLangModalVisible}
          />
          <ChangeLevel
            levelModalVisible={levelModalVisible}
            setLevelModalVisible={setLevelModalVisible}
          />

          <DeleteAccount
            accountModalVisible={accountModalVisible}
            setAccountModalVisible={setAccountModalVisible}
          />
        </>
      )}
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  logoutBtn: {},
  logoutBtnTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyRegular,
  },
  logoutBox: {
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
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
    width: '100%',
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
