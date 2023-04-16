import wordsTypes from './words.types';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import {db} from '../../firebase/utils';
import RNFetchBlob from 'rn-fetch-blob';
import Realm from 'realm';

// ------- NEW CLEAN CODE WITH REALM START HERE -------
export const getNewWords = async dateVar => {
  const q = query(collection(db, 'words'), where('wordDate', '==', dateVar));
  const ar = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots

    ar.push(doc.data());
  });
  return ar;
};

export const checkIfThereIsNewWords = async () => {
  const docRef = doc(db, 'updates', 'wordsDate');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (user[0].wordsDate < docSnap.data().dateInMs) {
      const myData = await getNewWords(docSnap.data().dateInMs);
      await addNewWords(myData);
      console.log('we added the new words and we will start adding the sounds');
      // await downloadAudioOfLearnedLanguage(myData);
    } else {
      return;
    }
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!');
  }
};
const addNewWords = async myData => {
  setLoading(true);
  try {
    const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
    myData.forEach(item => {
      Realm.write(() => {
        Realm.create('Word', {
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

// ------- NEW CLEAN CODE WITH REALM START END -------
const downloadAudioOfLearnedLanguage = async (urls, dispatch) => {
  console.log('Start Download Audio Of Learned Language');
  const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
  let counter = 0;
  urls.forEach(item => {
    const fileName = item.id;
    // const fileExtention = url.split('.').pop();
    const fileExtention = 'mp3';
    const fileFullName = fileName + '.' + fileExtention;

    console.log('file remote url', item.audioPath);
    console.log('fileName', fileName);
    console.log('fileExtention', fileExtention);
    console.log('fileFullName', fileFullName);
    RNFetchBlob.config({
      path: destinationPath + '/' + fileFullName,
      fileCache: true,
    })
      .fetch('GET', item.remoteUrl)
      .then(res => {
        console.log('The file saved to ', res.path());
        counter++;
        if (counter === urls.length) {
          console.log('function Finished');

          dispatch({
            type: wordsTypes.AUDIO_LOADING,
            payload: false,
          });
        }
      });
  });

  // handleGetFileList();
};

export const addAllUserWords =
  (nativeLang, learnedLang, level) => async dispatch => {
    // console.log(
    //   ' getAllTheWords params : nativeLang : ',
    //   nativeLang,
    //   'learnedLang : ',
    //   learnedLang,
    //   'level : ',
    //   level,
    // );
    const newData = [];
    const allUrlsToDownload = [];
    dispatch({
      type: wordsTypes.WORDS_LOADING,
      payload: true,
    });
    try {
      const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';

      console.log('start addAllUserWords');
      const words = await getAllTheWords(level);
      words.forEach((item, index) => {
        newData.push({
          id: item.id,
          wordNativeLang: item[nativeLang].word,
          wordLearnedLang: item[learnedLang].word,
          wordLevel: item.level,
          audioPath: destinationPath + '/' + item.id + '.mp3',
          remoteUrl: item[learnedLang].audio,
          wordImage: item.image,
          defaultDay: item.defaultDay,
          defaultWeek: item.defaultWeek,
          passed: false,
          passedDate: null,
          deleted: false,
          score: 0,
          viewNbr: 0,
          prog: 0,
        });
        allUrlsToDownload.push(item[learnedLang].audio);
      });
      // console.log('words =>>>>>>>>>>>>', newData);
      // console.log('audiosUrls =>>>>>>>>>>>>', allUrlsToDownload);
      dispatch({
        type: wordsTypes.ADD_ALL_WORDS,
        payload: newData,
      });
    } catch (error) {
      // console.log('error addAllUserWords', error);
    }
    dispatch({
      type: wordsTypes.WORDS_LOADING,
      payload: false,
    });
    // dispatch({
    //   type: wordsTypes.AUDIO_LOADING,
    //   payload: true,
    // });
    // console.log('words =>>>>>>>>>>>>', newData);
    // try {
    //   await downloadAudioOfLearnedLanguage(newData, dispatch);
    // } catch (error) {
    //   dispatch({
    //     type: wordsTypes.AUDIO_LOADING,
    //     payload: false,
    //   });
    // }
    // dispatch({
    //   type: wordsTypes.AUDIO_LOADING,
    //   payload: false,
    // });
  };

export const clearAllWords = () => async dispatch => {
  dispatch({
    type: wordsTypes.CLEAR_ALL_WORDS,
  });
};
export const modifAllWords = updatedWords => async dispatch => {
  dispatch({
    type: wordsTypes.CLEAR_ALL_WORDS,
    payload: updatedWords,
  });
};

export const getAllTheWords = async level => {
  console.log(' getAllTheWords params start');
  const ar = [];
  const q = query(
    collection(db, 'words'),
    where('level', '==', level),
    orderBy('id'),
    limit(20),
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, ' => ', doc.data().english.audio);
    ar.push(doc.data());
  });
  console.log('List of words from getAllTheWords =>>>>>>>>>>>>>>>>');
  return ar;
};

export const setWordsLoading = () => async dispatch => {
  dispatch({
    type: wordsTypes.WORDS_LOADING,
    payload: true,
  });
};
