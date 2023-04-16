import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {FONTS} from '../constants';
import Realm, {BSON} from 'realm';
import {RealmContext} from '../realm/models';
import {Loop} from '../realm/models/Loop';
import {DaysBags} from '../realm/models/DaysBags';
import {PassedWords} from '../realm/models/PassedWords';
import {User} from '../realm/models/User';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import ObjectID from 'bson-objectid';
import {storage, db} from '../firebase/utils';
import {getAllTheWords} from '../redux/Words/words.actions';
import RNFetchBlob from 'rn-fetch-blob';
import {Word} from '../realm/models/Word';

const {useQuery, useRealm} = RealmContext;

const Initialize = () => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const users = useQuery(User);
  const daysBags = useQuery(DaysBags);
  const passedWords = useQuery(PassedWords);
  const words = useQuery(Word);
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [files, setFiles] = useState([]);

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

  const resetUser = () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      realm.delete(realm.objects('User'));
    });
  };

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
            remoteUrl: item[1].audio,
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
        // console.log('firebaseWord =>', item);
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log('error occured =>', error);
    }
  };

  const resetWords = () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      realm.delete(realm.objects('Word'));
    });
  };

  function handleDeleteFiles() {
    const path = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
    console.log('path =>', path);
    RNFetchBlob.fs
      .unlink(path)
      .then(() => {
        console.log('all files are deleted successfuly');
        setFiles([]);
      })
      .catch(err => {
        console.log('an problem occured when deleting');
      });
  }

  const downloadAudioOfLearnedLanguage = async () => {
    setLoading(true);
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
    ar.forEach(item => {
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
        });
    });
    setLoading(false);
  };
  const addAudio = () => {
    downloadAudioOfLearnedLanguage();
  };
  const resetAudio = () => {
    handleDeleteFiles();
  };

  const resetCustomWords = () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      realm.delete(realm.objects('CustomWords'));
    });
  };
  const resetReviewBag = () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      loop[0].reviewWordsBag = [];
      loop[0].reviewWordsBagRoad = [];
      loop[0].stepOfReviewWordsBag = 0;
    });
  };

  const resetDailyTest = () => {
    realm.write(() => {
      // Delete all instances of Cat from the realm.
      loop[0].dailyTestRoad = [];
      loop[0].stepOfDailyTest = 0;
    });
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            marginVertical: 20,
          }}>
          {loading ? <ActivityIndicator size="large" color="#00ff00" /> : null}
        </View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text style={styles.addTitle}>Adding & Reset User Like SignUp</Text>
          <TouchableOpacity
            style={styles.addUserBtn}
            onPress={() => {
              addUser();
            }}>
            <Text style={styles.addUserTxtBtn}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addUserBtn}
            onPress={() => {
              resetUser();
            }}>
            <Text style={styles.addUserTxtBtn}>Reset User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addUserBtn,
              {backgroundColor: '#ab9c13', marginVertical: 10},
            ]}
            onPress={() => {
              resetDailyTest();
            }}>
            <Text style={styles.addUserTxtBtn}>Reset Daily Test</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text style={styles.addTitle}>Adding & Reset Words After SignUp</Text>
          <TouchableOpacity
            style={styles.addWordsBtn}
            onPress={() => {
              addWords();
            }}>
            <Text style={styles.addWordsTxtBtn}>Add Words</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addWordsBtn}
            onPress={() => {
              resetWords();
            }}>
            <Text style={styles.addWordsTxtBtn}>Reset Words</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addWordsBtn, {backgroundColor: '#076122'}]}
            onPress={() => {
              resetCustomWords();
            }}>
            <Text style={styles.addWordsTxtBtn}>Reset Custom Words</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addWordsBtn, {backgroundColor: '#645197'}]}
            onPress={() => {
              resetReviewBag();
            }}>
            <Text style={styles.addWordsTxtBtn}>Reset Review Words</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text style={styles.addTitle}>
            Adding & Reset Audio After Adding Words
          </Text>
          <TouchableOpacity
            style={styles.addAudioBtn}
            onPress={() => {
              addAudio();
            }}>
            <Text style={styles.addAudioTxtBtn}>Add Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addAudioBtn}
            onPress={() => {
              resetAudio();
            }}>
            <Text style={styles.addAudioTxtBtn}>Reset Audio</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text style={styles.addTitle}>
            Initialize and Reset Realm Tables For The First Time
          </Text>
          <TouchableOpacity style={styles.initializeBtn}>
            <Text style={styles.initializeTxtBtn}>Initialize Tables</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.initializeBtn}>
            <Text style={styles.initializeTxtBtn}>Reset Initialize Tables</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <Text style={styles.addTitle}>
            Add & Reset Default Words Bag Of This Day
          </Text>
          <TouchableOpacity style={styles.addDefaultBagBtn}>
            <Text style={styles.addDefaultBagTxtBtn}>Add Default Bag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addDefaultBagBtn}>
            <Text style={styles.addDefaultBagTxtBtn}>Reset Default Bag</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Initialize;

const styles = StyleSheet.create({
  addDefaultBagBtn: {
    backgroundColor: '#e50fcc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  addDefaultBagTxtBtn: {
    fontSize: 20,
    color: '#000',
    fontFamily: FONTS.enFontFamilyMedium,
    textAlign: 'center',
  },
  initializeBtn: {
    backgroundColor: '#18a516',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  initializeTxtBtn: {
    fontSize: 20,
    color: '#fff',
    fontFamily: FONTS.enFontFamilyMedium,
    textAlign: 'center',
  },
  addAudioTxtBtn: {
    fontSize: 20,
    color: '#fff',
    fontFamily: FONTS.enFontFamilyMedium,
    textAlign: 'center',
  },
  addAudioBtn: {
    backgroundColor: '#0a2c87',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  addWordsTxtBtn: {
    fontSize: 20,
    color: '#fff',
    fontFamily: FONTS.enFontFamilyMedium,
    textAlign: 'center',
  },
  addWordsBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  addTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    fontFamily: FONTS.enFontFamilyBold,
    width: '100%',
    textAlign: 'center',
  },
  addUserTxtBtn: {
    fontSize: 20,
    color: '#000',
    fontFamily: FONTS.enFontFamilyMedium,
    textAlign: 'center',
  },
  addUserBtn: {
    backgroundColor: 'yellow',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});
