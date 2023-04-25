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
import {useDispatch, useSelector} from 'react-redux';
import {languages} from '../../../languages';
import {
  ResetErrorsState,
  getWordsDate,
  signInUser,
} from '../../redux/UserRedux/userRedux.actions';
import {RealmContext} from '../../realm/models';
import {getAllTheWords} from '../../redux/Words/words.actions';
import {Loop} from '../../realm/models/Loop';
import {User} from '../../realm/models/User';
import {Word} from '../../realm/models/Word';
import RNFetchBlob from 'rn-fetch-blob';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import {db} from '../../firebase/utils';
import ObjectID from 'bson-objectid';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const {useQuery, useRealm} = RealmContext;

const mapState = ({userRedux}) => ({
  userNativeLang: userRedux.userNativeLang,
  userLearnedLang: userRedux.userLearnedLang,
  userLevel: userRedux.userLevel,
  errors: userRedux.errors,
  userSignInSuccess: userRedux.userSignInSuccess,
  idUser: userRedux.idUser,
  userInfo: userRedux.userInfo,
});

const Login = () => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const users = useQuery(User);
  const words = useQuery(Word);
  const dispatch = useDispatch();

  const {
    userNativeLang,
    userLearnedLang,
    userLevel,
    errors,
    userSignInSuccess,
    idUser,
    userInfo,
  } = useSelector(mapState);

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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



  // Add User
  const addUser = async (id, userInfo) => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; //  months are 0-based
    const day = date.getDate();
    const newDate = currentYear + currentMonth + day;
    console.log('start add user');
    // getNotifTokenForThisDevice().then(res => {
    //   console.log('my token is =>', res);
    // });
    let token ='ios';
    let wordsDate = await getWordsDate();
    console.log('my token is =>', token);
    if (userInfo) {
      console.log('userInfo from addUser', userInfo);
    }

    try {
      let user;
      realm.write(() => {
        user = realm.create('User', {
          _id: 'user1',
          userNativeLang: userInfo
            ? userInfo.userNativeLang
            : userNativeLang
            ? userNativeLang
            : 0,
          userLearnedLang: userInfo
            ? userInfo.userLearnedLang
            : userLearnedLang
            ? userLearnedLang
            : 0,
          userLevel: userInfo ? userInfo.userLevel : userLevel ? userLevel : 0,
          startDate: new Date(),
          passedWordsIds: [],
          deletedWordsIds: [],
          currentWeek: 1,
          currentDay: 1,
          currentDate: newDate,
          isPremium: userInfo ? userInfo.subscription.isSubed : false,
          serverId: id ? id : '',
          userName: userInfo ? userInfo.name : '',
          userUiLang: userInfo ? userInfo.userUiLang : 1,
          passedDays: [],
          notifToken: token,
          wordsDate: wordsDate,
          endedAt: userInfo ? userInfo.subscription.endedAt : 0,
          startedAt: userInfo ? userInfo.subscription.startedAt : 0,
          type: userInfo ? userInfo.subscription.type : '',
        });
      });
      console.log('new user created:', user);
    } catch (err) {
      console.error('Failed to create the user', err.message);
      setIsLoading(false);
    }
  };

  // Add Word
  const addWords = async () => {
    console.log('start add words', userLevel);
    // let userLevel = userInfo.userLevel;
    try {
      const firebaseWords = await getAllTheWords(userInfo.userLevel + 1);
      console.log('firebaseWords LINE 177', firebaseWords);
      const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
      firebaseWords.forEach(item => {
        realm.write(() => {
          realm.create('Word', {
            _id: item.id.toString(),
            wordNativeLang: item[userInfo.userNativeLang].word,
            wordLearnedLang: item[userInfo.userLearnedLang].word,
            wordLearnedPhonetic: item[userInfo.userLearnedLang].phoentic,
            wordNativeExample: item[userInfo.userNativeLang].example,
            wordLearnedExample: item[userInfo.userLearnedLang].example,
            exNativeIndex: item[userInfo.userNativeLang].exampleIndex,
            exLearnedIndex: item[userInfo.userLearnedLang].exampleIndex,
            exNativeLength: item[userInfo.userNativeLang].exampleLength,
            exLearnedLength: item[userInfo.userLearnedLang].exampleLength,
            wordLevel: item.level,
            audioPath: destinationPath + '/' + item.id + '.mp3',
            remoteUrl: item[userInfo.userLearnedLang].audio,
            wordImage: item.image,
            defaultDay: item.defaultDay,
            defaultWeek: item.defaultWeek,
            passed: false,
            passedDate: new Date(),
            deleted: false,
            score: 0,
            viewNbr: 0,
            prog: 0,
            wordType: 0,
            wordDateInMs: item.wordDate,
          });
        });
        // console.log('firebaseWord =>', item);
      });
    } catch (error) {
      console.log('error occured when adding words=>', error);
    }
  };

  // Add Loop
  const addLoop = async () => {
    console.log('start add loop');
    try {
      let loop;
      realm.write(() => {
        loop = realm.create('Loop', {
          _id: 'userLoop',
          stepOfDefaultWordsBag: 0,
          stepOfCustomWordsBag: 0,
          stepOfReviewWordsBag: 0,
          stepOfDailyTest: 0,
          stepOfWeeklyTest: 0,
          isDefaultDiscover: 0,
          isCustomDiscover: 0,
        });
      });
      console.log('new lopp created:', loop);
    } catch (err) {
      console.error('Failed to create the loop', err.message);
    }
  };

  const downloadAudioOfLearnedLanguage = async () => {
    // setLoading(true);
    const ar = [];
    words.forEach(item => {
      let obj = {
        itemId: item._id,
        url: item.remoteUrl,
      };
      ar.push(obj);
    });
    console.log('Start Download Audio Of Learned Language', ar);
    const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
    var asyncLoop = new Promise((resolve, reject) => {
      ar.forEach((item, index, array) => {
        const fileName = item.itemId;
        // const fileExtention = url.split('.').pop();
        const fileExtention = 'mp3';
        const fileFullName = fileName + '.' + fileExtention;
        // console.log('fileName', fileName);
        // console.log('fileExtention', fileExtention);
        console.log('fileFullName', fileFullName);
        RNFetchBlob.config({
          path: destinationPath + '/' + fileFullName,
          fileCache: true,
        })
          .fetch('GET', item.url)
          .then(res => {
            console.log('The file saved to ', res.path());
            if (index === array.length - 1) resolve();
          });
      });
    });
    asyncLoop.then(() => {
      console.log('All done!');
      setIsLoading(false);
    });
    // setLoading(false);
  };

  // Add Audio
  const addAudio = async () => {
    await downloadAudioOfLearnedLanguage();
  };

  const addPassedAndDaysBagsFromServer = async () => {
    console.log('addPassedAndDaysBagsFromServer start');
    const q = query(collection(db, 'users', users[0].serverId, 'daysBags'));
    const q2 = query(collection(db, 'users', users[0].serverId, 'passedWords'));
    let dayBag;
    let passedWrd;
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach(doc => {
      // passedArr.push(doc.data());
      realm.write(() => {
        passedWrd = realm.create('PassedWords', {
          _id: doc.data().myId,
          score: doc.data().score,
          viewNbr: doc.data().viewNbr,
          prog: doc.data().prog,
          wordType: doc.data().wordType,
          dayPlusWeekPassedAt: doc.data().dayPlusWeekPassedAt,
          createDate: doc.data().createDate,
        });
      });
      console.log(doc.id, ' => ', doc.data());
    });

    querySnapshot.forEach(doc => {
      // passedArr.push(doc.data());
      realm.write(() => {
        dayBag = realm.create('DaysBags', {
          _id: ObjectID(),
          day: doc.data().day,
          week: doc.data().week,
          step: doc.data().step,
          words: doc.data().words,
          createdAt: doc.data().createdAt,
          createDate: doc.data().createDate,
        });
      });
      console.log(doc.id, ' => ', doc.data());
    });
  };

  const maybeLate = async (idUser, userInfo) => {
    setIsLoading(true);
    setIsStarted(true);
    try {
      await addWords();
      await addLoop();
      await addUser(idUser, userInfo);
      await addPassedAndDaysBagsFromServer();
      await addAudio();
    } catch (error) {
      console.log('There is an error Login.js Line 337', error);
      // setIsLoading(false);
    }
  };

  const loginFunct = () => {
    if (email.length > 3 && email.indexOf('@') !== -1 && password.length > 3) {
      try {
        setError('');
        dispatch(ResetErrorsState());
        console.log('email =>', email);
        console.log('password =>', password);
        setIsLoading(true);
        dispatch(signInUser({email, password}));
        // alert('Hamdulh User Sign Up Successfully');
      } catch (error) {
        console.log('Error Line 267 registerFunction');
        setIsLoading(false);
      }
    } else {
      alert('Please fill all the fields!');
    }
  };

  useEffect(() => {
    if (users.length !== 0) {
      navigation.navigate('TabScreen', {});
    }
  }, [isLoading, isStarted]);

  useEffect(() => {
    if (errors.length > 0) {
      console.log('error redux', errors);
      setIsLoading(false);
      setError(errors);
    }
  }, [userSignInSuccess, errors, isLoading]);

  useEffect(() => {
    console.log('BEFORE --- userSignInSuccess', userSignInSuccess);
    if (userSignInSuccess) {
      console.log('userSignInSuccess', userSignInSuccess);
      maybeLate(idUser, userInfo);
      // setIsLoading(false);
      // setError(errors);
    }
  }, [userSignInSuccess]);

  return (
    // <ScrollView style={{flex: 9, width: '100%', backgroundColor: '#181920'}}>
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      {!isKeyboardVisible && (
        <View style={styles.registerHeader}>
          <Text style={styles.registerHeaderTxt}>Welcome!</Text>
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
              loginFunct();
            }}>
            <Text style={styles.getStartedTxt}>Login</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.haveAccBtn}>
            <Text style={styles.haveAccTxt}>Dont have an account ?</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default Login;

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
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 18,
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
