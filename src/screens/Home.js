import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {COLORS_THEME, FONTS} from '../constants';
import DayCard from '../components/dailyCardsComponents/dayCard';
import TodayCard from '../components/dailyCardsComponents/todayCard';
import HomeHeader from '../components/homeHeader';
import {RealmContext} from '../realm/models';
import {User} from '../realm/models/User';
import {Loop} from '../realm/models/Loop';
import {Word} from '../realm/models/Word';
import Dev from './Dev';
import WeeklyTestCard from '../components/dailyCardsComponents/weeklyTestCard';
import HomeShape from '../components/screensComponents/homeShape';
import Bg3 from '../../assets/wp4330055.png';
import {languages} from '../../languages';
import NewDayModal from '../components/screensComponents/modals/newDay';
import {DaysBags} from '../realm/models/DaysBags';
import {PassedWords} from '../realm/models/PassedWords';
import {doc, getDoc, setDoc, collection} from 'firebase/firestore';
import {storage, db} from '../firebase/utils';
import RNFetchBlob from 'rn-fetch-blob';
import {getNewWords} from '../redux/Words/words.actions';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';
import {useDispatch,useSelector} from 'react-redux';
import { setTrackTransparency, setUserConcent } from '../redux/UserRedux/userRedux.actions';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import userReduxTypes from '../redux/UserRedux/userRedux.types';

const {useQuery, useRealm} = RealmContext;

const mapState = ({userRedux}) => ({
  userSignUpSuccess: userRedux.userSignUpSuccess,
  userSignInSuccess: userRedux.userSignInSuccess,
});

const Home = () => {
  const realm = useRealm();
  const dispatch = useDispatch()
  const {userSignUpSuccess, userSignInSuccess} = useSelector(mapState);
  const user = useQuery(User);
  const daysBags = useQuery(DaysBags);
  const passedWords = useQuery(PassedWords);
  let userUiLang = user[0].userUiLang;
  let userNativeLang = user[0].userNativeLang;
  let userLearnedLang = user[0].userLearnedLang;
  let userLevel = user[0].userLevel;
  const loop = useQuery(Loop);
  const words = useQuery(Word)
    .sorted('_id')
    .filtered('passed != true && deleted != true');
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; //  months are 0-based
  const day = date.getDate();
  const newDate = currentYear + currentMonth + day;
  const [items, setItems] = useState([]);
  const [newDayModalVisible, setNewDayModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const trackingTrans = async () => {
    const trackingStatus = await getTrackingStatus();
    if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      // enable tracking features
      dispatch(setTrackTransparency(true))
    }else if (trackingStatus === 'not-determined'){
      const trackingStatus2 = await requestTrackingPermission();
      if (trackingStatus2 === 'authorized' || trackingStatus === 'unavailable') {
        // enable tracking features
        dispatch(setTrackTransparency(true))
      }
    }else{
      // Disable tracking features
      dispatch(setTrackTransparency(false))
    }
      
    
  }


  const euroConcent = async () => {


const consentInfo = await AdsConsent.requestInfoUpdate();

if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
  const { status } = await AdsConsent.showForm();

  console.log('status of cncent info is =>',status)

  
}
if (consentInfo.status === AdsConsentStatus.OBTAINED){
  const {
    selectPersonalisedAds,
  } = await AdsConsent.getUserChoices();
  if (selectPersonalisedAds){
    console.log('yes we are fine and we can serve personalized Ads',selectPersonalisedAds)
    dispatch(setUserConcent(true))
  }else{
    console.log('No personalized Ads',selectPersonalisedAds)
    dispatch(setUserConcent(false))
  }

  
}else{
  return
}

  }
  useEffect(()=>{
    euroConcent()
    trackingTrans()
  },[])

  const renderDayCard = () => {
    const myItems = [];
    for (let i = 0; i < 7; i++) {
      if (i === user[0].currentDay - 1) {
        myItems.push(
          <View
            key={i}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                marginVertical: 60,
                borderWidth: 2,
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderColor: '#fff',
                zIndex: 2,
                elevation: 2,
                position: 'relative',
                backgroundColor: COLORS_THEME.bgDark,
              }}>
              <Text
                style={{
                  fontFamily: FONTS.enFontFamilyBold,
                  fontSize: 20,
                  color: '#fff',
                  textTransform: 'capitalize',
                }}>
                {languages[userUiLang].home.day} {i + 1}
              </Text>
            </View>
            <View style={styles.todayCardStyle}>
              <TodayCard />
            </View>
          </View>,
        );
      } else {
        myItems.push(
          <View
            key={i}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                marginVertical: 60,
                borderWidth: 2,
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderColor: '#fff',
                zIndex: 2,
                elevation: 2,
                position: 'relative',
                backgroundColor: COLORS_THEME.bgDark,
              }}>
              <Text
                style={{
                  fontFamily: FONTS.enFontFamilyBold,
                  fontSize: 20,
                  color: '#fff',
                  textTransform: 'capitalize',
                }}>
                {languages[userUiLang].home.day} {i + 1}
              </Text>
            </View>
            <View style={styles.dayCardStyle}>
              <DayCard
                alreadyPassed={i < user[0].currentDay - 1}
                isDailyTest={user[0].currentDay - 1 - i === 1}
                userUiLang={user[0].userUiLang}
              />
            </View>
          </View>,
        );
      }
    }
    setItems(myItems);
  };
  const addNewPassedWordsToServer = async userId => {
    passedWords
      .filtered(`createDate == ${user[0].currentDate}`)
      .forEach(async item => {
        console.log('new PassedWord =>', item);
        const obj = {};
        obj.myId = item._id.toString();
        obj.score = item.score;
        obj.viewNbr = item.viewNbr;
        obj.prog = item.prog;
        obj.wordType = item.wordType;
        obj.dayPlusWeekPassedAt = item.dayPlusWeekPassedAt;
        obj.createDate = item.createDate;
        console.log('my obj is =>', obj);

        // Add a new document in collection "cities"
        const docRef = doc(db, 'users', userId, 'passedWords', obj.myId);
        setDoc(docRef, obj);
      });
  };
  const addNewDaysBagsToServer = async userId => {
    daysBags
      .filtered(`createDate == ${user[0].currentDate}`)
      .forEach(async item => {
        console.log('new DayBag =>', item);
        const obj = {};
        obj.myId = item._id.toString();
        obj.day = item.day;
        obj.week = item.week;
        obj.step = item.step;
        obj.words = item.words;
        obj.createdAt = item.createdAt;
        obj.createDate = item.createDate;
        console.log('my obj is =>', obj);

        // Add a new document in collection "cities"
        const docRef = doc(db, 'users', userId, 'daysBags', obj.myId);
        setDoc(docRef, obj);
      });
  };
  const addNewWords = async (myData, newDate) => {
    setLoading(true);
    try {
      const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
      myData.forEach(item => {
        realm.write(() => {
          realm.create('Word', {
            _id: item.id.toString(),
            wordNativeLang: item[userNativeLang].word,
            wordLearnedLang: item[userLearnedLang].word,
            wordLearnedPhonetic: item[userLearnedLang].phoentic,
            wordNativeExample: item[userNativeLang].example,
            wordLearnedExample: item[userLearnedLang].example,
            exNativeIndex: item[userNativeLang].exampleIndex,
            exLearnedIndex: item[userLearnedLang].exampleIndex,
            exNativeLength: item[userNativeLang].exampleLength,
            exLearnedLength: item[userLearnedLang].exampleLength,
            wordLevel: item.level,
            audioPath: destinationPath + '/' + item.id + '.mp3',
            remoteUrl: item[userLearnedLang].audio,
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
        console.log('firebaseWord =>', item);
      });

      try {
        realm.write(() => {
          user[0].wordsDate = newDate;
        });
      } catch (err) {
        console.error(
          'Failed to update the user wordsDate after download the new words',
          err,
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error occured when adding words=>', error);
    }
  };
  const downloadAudioOfLearnedLanguage = async newWords => {
    // setLoading(true);
    const ar = [];
    newWords.forEach(item => {
      let obj = {
        itemId: item.id.toString(),
        url: item[userLearnedLang].audio,
      };
      ar.push(obj);
    });
    console.log('Start Download Audio Of Learned Language', ar);
    const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
    var asyncLoop = new Promise((resolve, reject) => {
      ar.forEach((item, index, array) => {
        const fileName = item.itemId;
        const fileExtention = 'mp3';
        const fileFullName = fileName + '.' + fileExtention;
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
      // setIsLoading(false);
    });
  };
  const checkIfThereIsNewWords = async () => {
    const docRef = doc(db, 'updates', 'wordsDate');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (user[0].wordsDate < docSnap.data().dateInMs) {
        // ---- Here we need to update the words in this user app ----
        const myData = await getNewWords(docSnap.data().dateInMs,userLevel);
        // console.log('myData', myData[15]);
        await addNewWords(myData, docSnap.data().dateInMs);
        console.log(
          'we added the new words and we will start adding the sounds',
        );
        await downloadAudioOfLearnedLanguage(myData);
      } else {
        // ---- The words are updated and all the words in the server are updated here in this user app ----
        console.log('The words are updated');
      }
    } else {
      console.log('No such document!');
    }
  };
  const addDefaultWordsBag = () => {
    let arr = [];
    const first3Words = words.slice(0, 10);
    first3Words.forEach(elem => {
      // console.log('element =>', elem._id);
      arr.push(elem._id);
    });
    realm.write(() => {
      loop[0].defaultWordsBag = first3Words;
      user[0].currentDate = newDate;
    });
  };
  const changeDefaultWordsBag = () => {
    let arr = [];
    let newDay = 0;
    let newWeek = 0;
    const first3Words = words.slice(0, 10);
    // console.log('first3Words =>', first3Words);
    first3Words.forEach(elem => {
      // console.log('element =>', elem._id);
      arr.push(elem._id);
    });

    if (user[0].currentDay < 7) {
      newDay = user[0].currentDay + 1;
      newWeek = user[0].currentWeek;
    } else {
      newDay = 1;
      newWeek = user[0].currentWeek + 1;
    }

    realm.write(() => {
      loop[0].defaultWordsBag = first3Words;
      loop[0].defaultWordsBagRoad = [];
      loop[0].stepOfDefaultWordsBag = 0;
      loop[0].isDefaultDiscover = 0;
      user[0].currentDate = newDate;
      user[0].currentDay = newDay;
      user[0].currentWeek = newWeek;
    });
  };
  let passedDaysVar = [2052, 2555];
  let currentDateVar = 2022;
  let newDateVar = 2023;
  const passedDayss = [...user[0].passedDays];
  useEffect(() => {
    if (userSignUpSuccess || userSignInSuccess) {
      dispatch({
        type: userReduxTypes.USER_SIGN_IN_SUCCESS,
        payload: false,
      });
      dispatch({
        type: userReduxTypes.USER_SIGN_UP_SUCCESS,
        payload: false,
      });
    }
    // console.log('todayWork wordsBag =>', defaultWordsBag);
    checkIfThereIsNewWords();
    if (user[0].passedDays.length === 0) {
      // if (passedDaysVar.length === 0) {
      // here we are in the first day and the first launch
      console.log('// here we are in the first day and the first launch');
      if (loop[0].defaultWordsBag.length === 0) {
        // here there is no default words bag and we need to build it
        console.log(
          '// here there is no default words bag and we need to build it',
        );
        // console.log('loop[0].defaultWordsBag =>', words);
        addDefaultWordsBag();
      } else {
        // here we already have a default words bag and we dont need to do any thing
        console.log('we already have something', loop[0].defaultWordsBag);
      }
    } else {
      console.log(
        '// here we are  NOT in the first day and first launch and we need to check if the day changed to load an other bag or not',
      );
      // here we are  NOT in the first day and first launch and we need to check if the day changed to load an other bag or not
      if (
        user[0].currentDate !== newDate &&
        passedDayss.includes(user[0].currentDate)
      ) {
        console.log(
          '// here we are in an other day',
          user[0].currentDate,
          newDate,
          user[0].passedDays,
        );
        setNewDayModalVisible(true);
        changeDefaultWordsBag();
        if (user[0].serverId !== '') {
          addNewPassedWordsToServer(user[0].serverId);
          addNewDaysBagsToServer(user[0].serverId);
        } else {
          console.log('hi there');
        }
        // checkIfTheUserHaveAnAccount();
      } else {
        console.log(
          '// we are good we are in the same day',
          passedDayss,
          user[0].currentDate,
          newDate,
          passedDayss.includes(user[0].currentDate),
        );
      }
    }
  }, []);
  useEffect(() => {
    renderDayCard();
  }, [userUiLang]);

  // useEffect(() => {
  //   console.log('notifToken =>>>>>>>>>>>>: ', user[0].notifToken);
  // }, []);
  return (
    <ImageBackground style={styles.container} source={Bg3} resizeMode="cover">
      <HomeHeader userUiLang={userUiLang} />
      <ScrollView style={styles.subContainer}>
        <View style={styles.subContent}>
          <HomeShape />
          <View style={{marginBottom: 50}}>{items}</View>
        </View>
        <WeeklyTestCard
          userUiLang={userUiLang}
          isTodayTest={user[0].currentDay === 7}
        />
        <NewDayModal
          newDayModalVisible={newDayModalVisible}
          setNewDayModalVisible={setNewDayModalVisible}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  subContent: {},
  todayCardStyle: {
    // height: '100%',
    width: '100%',
    // marginHorizontal: '5%',
  },
  dayCardStyle: {
    // height: 200,
    width: '100%',
    // marginHorizontal: '5%',
    // marginVertical: 20,
  },
  container: {
    backgroundColor: COLORS_THEME.bgDark,
    // paddingVertical: 20,

    // marginBottom: 20,
    // paddingBottom: 200,
  },
  subContainer: {
    // paddingVertical: 100,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
