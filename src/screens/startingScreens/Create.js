import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ShadowEffect from '../../../assets/shadowImg.png';
import {COLORS_THEME, FONTS, SIZES} from '../../constants';
import {Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import userReduxTypes from '../../redux/UserRedux/userRedux.types';
import {languages} from '../../../languages';
import {useDispatch, useSelector} from 'react-redux';
import {getAllTheWords} from '../../redux/Words/words.actions';
import {RealmContext} from '../../realm/models';
import {Loop} from '../../realm/models/Loop';
import {User} from '../../realm/models/User';
import {Word} from '../../realm/models/Word';
import RNFetchBlob from 'rn-fetch-blob';
import {
  ResetErrorsState,
  createAccount,
  getWordsDate,
  signUpUser,
} from '../../redux/UserRedux/userRedux.actions';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '../../firebase/utils';

const {useQuery, useRealm} = RealmContext;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const mapState = ({userRedux}) => ({
  errors: userRedux.errors,
  userSignUpSuccess: userRedux.userSignUpSuccess,
  idUser: userRedux.idUser,
});

const Create = ({route, navigation}) => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const users = useQuery(User);
  const words = useQuery(Word);
  const dispatch = useDispatch();
  // dispatch(ResetErrorsState);
  const {errors, userSignUpSuccess, idUser} = useSelector(mapState);
  const myId = 1;
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [rePassword, onChangeRePassword] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userNativeLang = users[0].userNativeLang;
  const userLearnedLang = users[0].userLearnedLang;
  const userLevel = users[0].userLevel;
  const startDate = users[0].startDate;
  const currentDate = users[0].currentDate;

  const [error, setError] = useState('');
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    console.log('userNativeLang =>', users[0].userNativeLang);
    console.log('userLearnedLang =>', users[0].userLearnedLang);
    console.log('userLevel =>', users[0].userLevel);
  }, []);

  const registerFunction = () => {
    if (
      name.length !== '' &&
      email.length > 3 &&
      email.indexOf('@') !== -1 &&
      password.length > 3
    ) {
      if (password === rePassword) {
        try {
          console.log('name =>', name);
          console.log('email =>', email);
          console.log('password =>', password);
          setIsLoading(true);
          dispatch(
            createAccount({
              name,
              email,
              password,
              userNativeLang,
              userLearnedLang,
              userLevel,
              startDate,
              currentDate,
            }),
          );
          // alert('Hamdulh User Sign Up Successfully');
        } catch (error) {
          console.log('Error Line 267 registerFunction');
          setIsLoading(false);
        }
      } else {
        alert('Please check your password!');
      }
    } else {
      alert('Please fill all the fields!');
    }
  };

  const updateUserServerId = () => {
    realm.write(() => {
      users[0].serverId = idUser;
    });
  };
  useEffect(() => {
    if (errors.length > 0) {
      console.log('error redux', errors);
      setIsLoading(false);
      setError(errors);
    }
  }, [userSignUpSuccess, errors, isLoading]);

  useEffect(() => {
    console.log('BEFORE --- userSignUpSuccess', userSignUpSuccess);
    if (userSignUpSuccess) {
      console.log('userSignUpSuccess', userSignUpSuccess);
      updateUserServerId();
      setIsLoading(false);
      navigation.navigate('TabScreen', {});
    }
  }, [userSignUpSuccess]);

  return (
    // <ScrollView style={{flex: 9, width: '100%', backgroundColor: '#181920'}}>
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      {!isKeyboardVisible && (
        <View style={styles.registerHeader}>
          <Text style={styles.registerHeaderTxt}>
            Create an account to save your learning progress
          </Text>
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={COLORS_THEME.primary}
          style={styles.loadingIndic}
        />
      ) : null}
      <View style={[styles.registerForm]}>
        {isLoading ? <View style={styles.overLay}></View> : null}

        <View style={styles.inputBoxStyle}>
          <View style={styles.iconStyle}>
            <FontAwesome
              name={'user'}
              size={25}
              color={'#fff'}
              style={styles.streakImgStyle}
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
            placeholder="username"
            placeholderTextColor={'rgba(255,255,255,0.5)'}
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputBoxStyle}>
          <View style={styles.iconStyle}>
            <MaterialCommunityIcons
              name={'email'}
              size={25}
              color={'#fff'}
              style={styles.streakImgStyle}
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="email"
            placeholderTextColor={'rgba(255,255,255,0.5)'}
            editable={!isLoading}
          />
        </View>
        <View style={styles.inputBoxStyle}>
          <View style={styles.iconStyle}>
            <FontAwesome
              name={'lock'}
              size={25}
              color={'#fff'}
              style={styles.streakImgStyle}
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder="password"
            placeholderTextColor={'rgba(255,255,255,0.5)'}
            editable={!isLoading}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputBoxStyle}>
          <View style={styles.iconStyle}>
            <FontAwesome
              name={'lock'}
              size={25}
              color={'#fff'}
              style={styles.streakImgStyle}
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeRePassword}
            value={rePassword}
            placeholder="re-type password"
            placeholderTextColor={'rgba(255,255,255,0.5)'}
            editable={!isLoading}
            secureTextEntry={true}
          />
        </View>
      </View>
      <View style={styles.registerAction}>
        <View style={styles.errorBox}>
          {error.length > 0 && (
            <Text
              style={[
                styles.fieldErrors,
                {
                  fontFamily: FONTS.enFontFamilyMedium,
                },
              ]}>
              {error}
            </Text>
          )}
        </View>
        <View style={styles.actionBtns}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            disabled={isLoading}
            onPress={() => {
              registerFunction();
            }}>
            <Text style={styles.getStartedTxt}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Create;
const styles = StyleSheet.create({
  errorBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldErrors: {
    marginVertical: 3,
    color: '#f70103',
    fontSize: 14,
    padding: 0,
    marginBottom: 20,
  },
  overLay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
    elevation: 2,
  },
  loadingIndic: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: windowWidth / 2 - 15,
    top: windowHeight / 2 - 15,
    zIndex: 3,
    elevation: 3,
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
  actionBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10%',
  },
  streakImgStyle: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  iconStyle: {width: '10%'},
  inputBoxStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // width: '100%',
    // height: '100%',
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: 10,
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  input: {
    color: '#fff',

    // textAlign: 'center',
    fontFamily: FONTS.enFontFamilyRegular,
    fontSize: 17,
    width: '90%',
    paddingHorizontal: 10,
  },
  registerAction: {
    flex: 3,
    // backgroundColor: 'pink',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  registerForm: {
    flex: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignContent: 'center',
    // flexGrow: 1,
  },
  registerHeaderTxt: {
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 24,
    color: '#fff',
  },
  registerHeader: {
    flex: 3,
    paddingHorizontal: 20,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
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
    // paddingTop: '20%',
    backgroundColor: '#181920',
    flex: 10,
    width: windowWidth,
    height: windowHeight,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 20,
  },
});
