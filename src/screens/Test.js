import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import Realm, {BSON} from 'realm';
import {RealmContext} from '../realm/models';
import {TaskV4} from '../realm/models/Task';
import {Word} from '../realm/models/Word';

import {useCallback} from 'react';
import {getAllTheWords} from '../redux/Words/words.actions';
import RNFetchBlob from 'rn-fetch-blob';
import {User} from '../realm/models/User';
import {Loop} from '../realm/models/Loop';
import {DaysBags} from '../realm/models/DaysBags';
import {PassedWords} from '../realm/models/PassedWords';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import ObjectID from 'bson-objectid';
import {storage, db} from '../firebase/utils';
// import Sound from 'react-native-sound';
import loopReduxTypes from '../redux/LoopRedux/loopRedux.types';
import {useDispatch} from 'react-redux';
import {
  TestIds,
  useInterstitialAd,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {ADMOB_INTERSTITIAL, PRODUCTION,ADMOB_INTERSTITIAL_IOS} from '../../settings.config';
const {useQuery, useRealm} = RealmContext;
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import {getNewWords} from '../redux/UserRedux/userRedux.actions';
import SoundPlayer from 'react-native-sound-player';

const adUnitId = PRODUCTION ? ADMOB_INTERSTITIAL : TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const Test = () => {
  const dispatch = useDispatch();
  const {isLoaded, isClosed, load, show} = useInterstitialAd(
    PRODUCTION ? Platform.OS === 'ios' ? ADMOB_INTERSTITIAL_IOS : ADMOB_INTERSTITIAL : TestIds.INTERSTITIAL,
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );
  const realm = useRealm();
  const loop = useQuery(Loop);
  const user = useQuery(User);
  const daysBags = useQuery(DaysBags);
  const passedWords = useQuery(PassedWords);
  const [myTasks, setMyTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [text, onChangeText] = React.useState('');
  const [loading, setLoading] = useState(false);
  // const realm = useRealm();
  const result = useQuery(TaskV4);
  const words = useQuery(Word).sorted('_id');
  const usersList = useQuery(User);
  const tasks = useMemo(() => result.sorted('createdAt'), [result]);
  const ourWords = useMemo(() => words.sorted('_id'), [words]);
  const getData = async () => {
    // Open a local realm file with a particular path & predefined Car schema
    try {
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema],
      });
      // Add a couple of Tasks in a single, atomic transaction
      let task1, task2;
      realm.write(() => {
        task1 = realm.create('Task', {
          _id: 4,
          name: 'go grocery shopping',
          status: 'Open',
        });
        task2 = realm.create('Task', {
          _id: 5,
          name: 'go exercise',
          status: 'Open',
        });
        console.log(`created two tasks: ${task1.name} & ${task2.name}`);
      });
      // use task1 and task2
      realm.close();
    } catch (err) {
      console.error('Failed to open the realm', err.message);
    }
  };
  const alertData = async () => {
    try {
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema],
      });
      // query realm for all instances of the "Task" type.
      const tasks = realm.objects('Task');
      console.log('now we will affect tasks to array', tasks);
      setMyTasks(tasks);
      console.log(`The lists of tasks are: ${tasks.map(task => task.name)}`);
      //   realm.close();
    } catch (err) {
      console.error('Failed to open the realm', err.message);
    }
  };

  const addTask = () => {
    try {
      let codeTask;
      realm.write(() => {
        codeTask = realm.create('TaskV4', {
          description: text,
          createdAt: new Date(),
          userId: 'oussama',
        });
      });
      console.log('new item created:', codeTask);
    } catch (err) {
      console.error('Failed to open the realm', err.message);
    }
  };

  const deleteThisItem = element => {
    console.log('item to delelted =>', element);
    try {
      realm.write(() => {
        // Delete the task from the realm.
        realm.delete(element);
      });
    } catch (error) {
      console.log('error while deleting =>', error);
    }
  };

  const updateThisItem = element => {
    realm.write(() => {
      element.wordLearnedLang = 'Updated';
    });
  };
  useEffect(() => {
    // console.log('usersList from useQuery =>', ourWords);
    // addWords();
  }, [usersList]);

  const addWords = async () => {
    setLoading(true);
    try {
      const firebaseWords = await getAllTheWords(4);
      const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
      firebaseWords.forEach(item => {
        realm.write(() => {
          realm.create('Word', {
            _id: item.id.toString(),
            wordNativeLang: item[0].word,
            wordLearnedLang: item[1].word,
            wordLevel: item.level,
            audioPath: destinationPath + '/' + item.id + '.mp3',
            remoteUrl: item[0].audio,
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
          });
        });
        console.log('firebaseWord =>', item);
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error occured =>', error);
    }
  };
  const addUser = async () => {
    try {
      let user;
      realm.write(() => {
        user = realm.create('User', {
          _id: 'user1',
          userNativeLang: 0,
          userLearnedLang: 1,
          userLevel: 4,
          startDate: new Date(),
          passedWordsIds: [],
          deletedWordsIds: [],
          currentWeek: 1,
          currentDay: 1,
          isPremium: false,
        });
      });
      console.log('new user created:', user);
    } catch (err) {
      console.error('Failed to create the user', err.message);
    }
  };
  const addLoop = async () => {
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
  const resetDefaultRoadAndStep = async () => {
    try {
      realm.write(() => {
        loop[0].defaultWordsBagRoad = [];
        loop[0].isDefaultDiscover = 0;
        loop[0].stepOfDefaultWordsBag = 0;
      });
    } catch (err) {
      console.error('Failed to reset the default road and step', err.message);
    }
  };
  const resetCustomRoadAndStep = async () => {
    try {
      dispatch({
        type: loopReduxTypes.RESET_CUSTOM_BAG_ARRAY,
      });
      realm.write(() => {
        loop[0].customWordsBagRoad = [];
        loop[0].isCustomDiscover = 0;
        loop[0].stepOfCustomWordsBag = 0;
      });
    } catch (err) {
      console.error('Failed to reset the default road and step', err.message);
    }
  };

  const showDaysBagsContent = async () => {
    daysBags.forEach(item => {
      console.log('new DayBag =>', item);
    });
  };
  const showPassedWordsContent = async () => {
    passedWords.forEach(item => {
      console.log('new passedWords =>', item);
    });
  };
  const showLoopContent = async () => {
    loop.forEach(item => {
      console.log('new passedWords =>', item);
    });
  };
  const showUserContent = async () => {
    user.forEach(item => {
      console.log('new passedWords =>', item);
    });
  };

  const resetDaysBags = async () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      realm.delete(realm.objects('DaysBags'));
    });
  };
  const resetPassedWords = async () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      realm.delete(realm.objects('PassedWords'));
    });
  };

  const [file, setFile] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const uploadFile = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, res => {
      console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        const source = {uri: res.uri};
        console.log('response', JSON.stringify(res));
        setFile(res);
        // this.setState({
        //   filePath: res,
        //   fileData: res.data,
        //   fileUri: res.uri
        // });
      }
    });
  };
  const uploadToFirebase = async () => {
    const uri = file.assets[0].uri;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, 'custom/' + ObjectID());
    console.log('Blob =================', blob);
    const result = uploadBytesResumable(fileRef, blob);
    result.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressValue(snapshot.bytesTransferred / snapshot.totalBytes);
        console.log('Upload is ' + progress + '% done');
      },
      error => {
        console.error('Error uploading', error);
      },
      () => {
        getDownloadURL(result.snapshot.ref).then(downloadURL => {
          console.log('File available at', downloadURL);
          // const newVideoRef = doc(collection(db, "feed"));
          // setDoc(newVideoRef, {
          //   userId: userId,
          //   LikesNumber: 12,
          //   id: "04",
          //   userName: user.name,
          //   userImg: user.avatar,
          //   likes: {},
          //   comments: {},
          //   url: downloadURL,
          //   createdAt: new Date(),
          //   updatedAt: null,
          //   deletedAt: null,
          // });
          // navigation.goBack();
        });
      },
    );
  };
  // const loadAds = async () => {
  //   if (!isLoaded) {
  //     console.log(' inside load() :::::::::::::::::::::::::::::::::::::::::');
  //     load();
  //   }
  // };
  useEffect(() => {
    // Start loading the interstitial straight away
    if (!isLoaded) {
      console.log(' inside load()');
      load();
    } else {
      console.log(' Ad Loaded Hamduleleh');
    }
  }, [load, isLoaded]);

  const showAds = async () => {
    console.log('show ads start');
    // await loadAds();
    try {
      show();
    } catch (error) {
      console.log('error while showing ad', error);
    }
  };
  useEffect(() => {
    console.log('uri', file?.assets[0].uri);
    //Sound.setCategory('Playback')
  }, []);
  const playThisItem = item => {
    console.log('this item =>', item.audioPath);


    SoundPlayer.playUrl('file://'+item.audioPath)
    //SoundPlayer.playUrl('soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')

/*    var audio = new Sound('soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
         console.log('failed to load the sound', error);
        return;
      }
      // if loaded successfully
      console.log(
        'duration in seconds: ' +
          audio.getDuration() +
          'number of channels: ' +
          audio.getNumberOfChannels(),
      );
      audio.play();
    }); */
  };
  async function handleGetFileList() {
    const path = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';

    await RNFetchBlob.fs
      .isDir(path)
      .then(isDir => {
        console.log('isDir', isDir);
        if (isDir == true) {
          RNFetchBlob.fs
            .lstat(path)
            .then(filesList => {
              console.log('filesList', filesList);
              // setFiles(filesList);
            })
            .catch(e => {
              console.log('Unable to get files list', e);
            });
        }
      })
      .catch(e => {
        console.log('Error isDir', e);
      });
  }

  async function onDisplayNotification() {
    // Request permissions (required for iOS)

  }
  const onDisplayRemoteNotification = async () => {
    console.log('Remote Notification');
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await messaging()
        .getToken()
        .then(fcmToken => {
          console.log('Fcm Token =>', fcmToken);
        })
        .catch(e => {
          console.log('error =<', e);
        });
    } else {
      console.log('Not Authorized status:', authStatus);
    }
  };

  const deleteDefaultWordsBag = () => {
    realm.write(() => {
      loop[0].defaultWordsBag = [];
    });
  };

  const downloadAudioOfLearnedLanguage = async newWords => {
    // setLoading(true);
    const ar = [];
    newWords.forEach(item => {
      let obj = {
        itemId: item.id.toString(),
        url: item[3].audio,
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

  const addNewWords = async myData => {
    setLoading(true);
    try {
      const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
      myData.forEach(item => {
        realm.write(() => {
          realm.create('Word', {
            _id: item.id.toString(),
            wordNativeLang: item[0].word,
            wordLearnedLang: item[3].word,
            wordLevel: item.level,
            audioPath: destinationPath + '/' + item.id + '.mp3',
            remoteUrl: item[3].audio,
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error occured when adding words=>', error);
    }
  };

  const checkIfThereIsNewWords = async () => {
    console.log('the wordsDate of this user =>', user[0].wordsDate);
    console.log(
      'the actual number of words in the user device =>',
      words.length,
    );
    const docRef = doc(db, 'updates', 'wordsDate');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data().dateInMs);
      if (user[0].wordsDate < docSnap.data().dateInMs) {
        console.log(
          '---- Here we need to update the words in this user app ---- ',
        );
        const myData = await getNewWords(docSnap.data().dateInMs);
        // console.log('myData', myData[15]);
        // await addNewWords(myData);
        console.log(
          'we added the new words and we will start adding the sounds',
        );
        // await downloadAudioOfLearnedLanguage(myData);
      } else {
        console.log(
          '---- The words are updated and all the words in the server are updated here in this user app ---- ',
        );
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
    }
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
        console.log('my obj is =>', obj);

        // Add a new document in collection "cities"
        const docRef = doc(db, 'users', userId, 'daysBags', obj.myId);
        setDoc(docRef, obj);
      });
  };

  const addNewPassedWordsToServer = async userId => {
    passedWords
      .filtered(`createDate == ${user[0].currentDate}`)
      .forEach(async item => {
        console.log('new DayBag =>', item);
        const obj = {};
        obj.myId = item._id.toString();
        obj.score = item.score;
        obj.viewNbr = item.viewNbr;
        obj.prog = item.prog;
        obj.wordType = item.wordType;
        obj.dayPlusWeekPassedAt = item.dayPlusWeekPassedAt;
        console.log('my obj is =>', obj);

        // Add a new document in collection "cities"
        const docRef = doc(db, 'users', userId, 'passedWords', obj.myId);
        setDoc(docRef, obj);
      });
  };

  const checkIfTheUserHaveAnAccount = () => {
    if (user[0].serverId !== '') {
      console.log('yes this user have an account');
    } else {
      console.log('No he dont has an account', user[0].serverId);
    }
  };

  const addPassedAndDaysBagsFromServer = async () => {
    console.log('addPassedAndDaysBagsFromServer start');
    const q = query(
      collection(db, 'users', 'QYBjT1IU72QTchj6VUEBNCDuyz12', 'daysBags'),
    );
    const q2 = query(
      collection(db, 'users', 'QYBjT1IU72QTchj6VUEBNCDuyz12', 'passedWords'),
    );
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
          createDate: 2022,
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
          createDate: doc.data().createdAt,
        });
      });
      console.log(doc.id, ' => ', doc.data());
    });
  };

  /*useEffect(() => {
    try {
      SoundPlayer.onFinishedLoading((success)=>{
        console.log(success)
      })
    } catch (error) {
      
    }
  }, []);*/
  const playMyAudio = () => {
    try {
      SoundPlayer.playSoundFile('correct','mp3');
    } catch (error) {
      console.log('cannot play the sound file',error)
    }
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.addWrapper}>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'blue'}]}
          onPress={() => {
            playMyAudio();
          }}>
          <Text style={[styles.functionBtnTxt, {color: '#fff'}]}>
            Add From Server
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'green'}]}
          onPress={() => {
            checkIfTheUserHaveAnAccount();
          }}>
          <Text style={[styles.functionBtnTxt, {color: '#fff'}]}>
            Add PassedWords To Server
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'green'}]}
          onPress={() => {
            addNewDaysBagsToServer();
          }}>
          <Text style={[styles.functionBtnTxt, {color: '#fff'}]}>
            Add DaysBags To Server
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'green'}]}
          onPress={() => {
            checkIfThereIsNewWords();
          }}>
          <Text style={[styles.functionBtnTxt, {color: '#fff'}]}>
            Check new words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'yellow'}]}
          onPress={() => {
            onDisplayNotification();
          }}>
          <Text style={[styles.functionBtnTxt, {color: '#000'}]}>
            Push Notif
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'red'}]}
          onPress={() => {
            uploadToFirebase();
          }}>
          <Text style={styles.functionBtnTxt}>
            uploadToFirebase : {progressValue} %
          </Text>
        </TouchableOpacity>
        {file !== null ? (
          <Image
            style={{width: 200, height: 100}}
            source={{uri: file.assets[0].uri}}
            resizeMethod={'resize'}
            resizeMode={'contain'}
          />
        ) : null}
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'red'}]}
          onPress={() => {
            uploadFile();
          }}>
          <Text style={styles.functionBtnTxt}>UploadFile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'red'}]}
          onPress={() => {
            resetDaysBags();
          }}>
          <Text style={styles.functionBtnTxt}>Reset DaysBags Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: 'red'}]}
          onPress={() => {
            resetPassedWords();
          }}>
          <Text style={styles.functionBtnTxt}>Reset PassedWords Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: '#ab1c7b'}]}
          onPress={() => {
            showAds();
          }}>
          <Text style={[styles.functionBtnTxt, {color: '#fff'}]}>SHOW ADS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            showLoopContent();
          }}>
          <Text style={styles.functionBtnTxt}>Show Loop Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            showUserContent();
          }}>
          <Text style={styles.functionBtnTxt}>Show User Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            showPassedWordsContent();
          }}>
          <Text style={styles.functionBtnTxt}>Show PassedWords Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            showDaysBagsContent();
          }}>
          <Text style={styles.functionBtnTxt}>Show DaysBags Content</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: '#f4f'}]}
          onPress={() => {
            resetCustomRoadAndStep();
          }}>
          <Text style={styles.functionBtnTxt}>Reset Custom Road and Step</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.functionBtn, {backgroundColor: '#f4f'}]}
          onPress={() => {
            deleteDefaultWordsBag();
          }}>
          <Text style={styles.functionBtnTxt}>DeleteDefaultBag</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            resetDefaultRoadAndStep();
          }}>
          <Text style={styles.functionBtnTxt}>Reset Default Road and Step</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            addLoop();
          }}>
          <Text style={styles.functionBtnTxt}>Add Loop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.functionBtn}
          onPress={() => {
            addUser();
          }}>
          <Text style={styles.functionBtnTxt}>Add User</Text>
        </TouchableOpacity>
      </View>

      {!loading ? (
        ourWords?.map((element, index) => {
          return (
            <View key={index} style={styles.taskStyle}>
              <Text style={styles.taskName}>
                {element.wordLearnedLang} /{element.passed ? 'True' : 'False'} /{' '}
                {element._id}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.taskUpdateStyle}
                  onPress={() => {
                    updateThisItem(element);
                  }}>
                  <Text style={styles.taskUpdateTxtStyle}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.taskDeleteStyle}
                  onPress={() => {
                    deleteThisItem(element);
                  }}>
                  <Text style={styles.taskDeleteTxtStyle}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.taskDeleteStyle}
                  onPress={() => {
                    playThisItem(element);
                  }}>
                  <Text style={styles.taskDeleteTxtStyle}>Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}

      <View style={styles.addWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            addWords();
          }}>
          <Text style={styles.addBtnTxt}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            deleteWords();
          }}>
          <Text style={styles.addBtnTxt}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Test;

const styles = StyleSheet.create({
  functionBtn: {
    padding: 20,
    backgroundColor: 'green',
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: 10,
  },
  functionBtnTxt: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  addBtnTxt: {
    fontSize: 18,
    color: '#fff',
  },
  addWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
    marginHorizontal: 10,
  },
  input: {
    width: '90%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  taskDeleteTxtStyle: {
    color: '#fff',
  },
  taskDeleteStyle: {
    backgroundColor: 'red',
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginHorizontal: 5,
  },
  taskUpdateTxtStyle: {
    color: '#000',
  },
  taskUpdateStyle: {
    backgroundColor: 'yellow',
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginHorizontal: 5,
  },
  taskName: {
    color: '#fff',
  },
  taskStyle: {
    backgroundColor: '#430996',
    marginVertical: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    // paddingVertical: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
