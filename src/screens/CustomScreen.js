import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS_THEME, FONTS, SIZES} from '../constants';
import {useDispatch, useSelector} from 'react-redux';
import ShadowEffect from '../../assets/shadowImg.png';
import ReviewHeader from '../components/screensComponents/header';
import HintHeaderBg from '../components/screensComponents/hintHeaderBg';
import UsaFlag from '../../assets/united-states.png';
import ArFlag from '../../assets/sa.png';
import Premium from '../../assets/premium.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HintHeader from '../components/screensComponents/hintHeader';
import loopReduxTypes from '../redux/LoopRedux/loopRedux.types';
import {RealmContext} from '../realm/models';
import {DaysBags} from '../realm/models/DaysBags';
import {Word} from '../realm/models/Word';
import {Loop} from '../realm/models/Loop';
import {CustomWords} from '../realm/models/CustomWords';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {useNavigation} from '@react-navigation/native';
import ObjectID from 'bson-objectid';
import {storage, db} from '../firebase/utils';
import ReviewWordComp from '../components/screensComponents/reviewWord';
import RNFetchBlob from 'rn-fetch-blob';
import CustomWordComp from '../components/screensComponents/customWord';
import Steps from '../components/screensComponents/steps';
import {User} from '../realm/models/User';
import {languages} from '../../languages';
import {flags} from '../constants/images';
const {useQuery, useObject, useRealm} = RealmContext;
const mapState = ({loopRedux}) => ({
  customBagArray: loopRedux.customBagArray,
  isReady: loopRedux.isReady,
});

const CustomScreen = () => {
  const realm = useRealm();
  const user = useQuery(User);
  let userNativeLang = user[0].userNativeLang;
  let userLearnedLang = user[0].userLearnedLang;
  let userUiLang = user[0].userUiLang;
  const words = useQuery(Word);
  const loop = useQuery(Loop);
  const myDaysBags = useQuery(DaysBags);
  const isSubed = true;
  // isSubed = true;
  const customWords = useQuery(CustomWords)
    .sorted('passedDate', true)
    .filtered('passed != true');
  const customWordsPassed = useQuery(CustomWords)
    .sorted('passedDate')
    .filtered('passed == true');
  //
  const {customBagArray, isReady} = useSelector(mapState);
  const navigation = useNavigation();
  let customWordsBag = loop[0].customWordsBag;
  let customWordsBagRoad = loop[0].customWordsBagRoad;
  let stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag;
  // const reviewWordsBagRoadValidArr = JSON.parse(loop[0].reviewWordsBagRoad);
  const [validArr, setValidArr] = useState([]);
  const destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'vokab';
  // const [reviewBagArray, setReviewBagArray] = useState([]);

  //   const {} = useSelector(mapState);
  const [nativeWord, setNativeWord] = useState('');
  const [learnedWord, setLearnedWord] = useState('');
  const [example, setExample] = useState('');
  const [exampleSplited, setExampleSplited] = useState([]);
  const [exampleIndex, setExampleIndex] = useState(-1);
  const [file, setFile] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();

  const uploadFile = async () => {
    let options = {
      mediaType:'photo',
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
      }
    });
  };

  const uploadToFirebase = async () => {
    try {
      const id = ObjectID();
      console.log('uploadToFirebase start', id);
      setLoad(true);
      let uri = null;
      let fileExtention = null;
      if (file !== null) {
        console.log('what file containe now', file);
        uri = file.assets[0].uri;
        fileExtention = uri.split('.').pop();
        console.log('uri is ,', uri);
        console.log('new uri is ,', uri.replace('file:///', ''));
        fileExtention = uri.split('.').pop();

        RNFetchBlob.fs
          .cp(
            uri.replace('file:///', ''),
            destinationPath + '/' + id.toString() + '.' + fileExtention,
          )
          .then(res => {
            console.log('image copied to the new destination', res);
            setLoad(false);
          })
          .catch(err => {
            console.log(
              'Error occured when copying image to new destination',
              err,
            );
            setLoad(false);
            setNativeWord('');
            setLearnedWord('');
            setExample('');
            setExampleSplited([]);
            setExampleIndex(-1);
            setFile(null);
            setLoad(false);
          });
      }

      realm.write(() => {
        realm.create('CustomWords', {
          _id: id.toString(),
          wordNativeLang: nativeWord,
          wordLearnedLang: learnedWord,
          wordLearnedExample: example,
          exampleWordIndex: exampleIndex,
          wordLevel: 4,
          localImagePath:
            file !== null
              ? destinationPath + '/' + id.toString() + '.' + fileExtention
              : '',
          wordImage: '',
          passed: false,
          passedDate: new Date(),
          deleted: false,
          wordType: 1,
        });
      });
      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      /* const blob = await new Promise((resolve, reject) => {
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
        // setProgressValue(snapshot.bytesTransferred / snapshot.totalBytes);
        console.log('Upload is ' + progress + '% done');
      },
      error => {
        console.error('Error uploading', error);
        setLoad(false);
      },
      () => {
        getDownloadURL(result.snapshot.ref).then(downloadURL => {
          console.log('File available at', downloadURL);
          // realm.write(() => {
          //   realm.create('CustomWords', {
          //     _id: ObjectID(),
          //     wordNativeLang: nativeWord,
          //     wordLearnedLang: learnedWord,
          //     wordLearnedExample: example,
          //     exampleWordIndex: exampleIndex,
          //     wordImage: downloadURL,
          //     passed: false,
          //     passedDate: new Date(),
          //     deleted: false,
          //   });
          // });
          setLoad(false);
        });
      },
    );*/
      setNativeWord('');
      setLearnedWord('');
      setExample('');
      setExampleSplited([]);
      setExampleIndex(-1);
      setFile(null);
      setLoad(false);
    } catch (error) {
      console.warn('Error occured', error);
      setNativeWord('');
      setLearnedWord('');
      setExample('');
      setExampleSplited([]);
      setExampleIndex(-1);
      setFile(null);
      setLoad(false);
    }
  };
  const addCustomWord = () => {
    uploadToFirebase();
  };

  const removeWordFromCustomArray = item => {
    const indexOfItem = customBagArray.indexOf(item);
    console.log('The indexOfItem is :', indexOfItem);
    let oldArray = customBagArray;
    const removedItem = oldArray.splice(indexOfItem, 1);
    console.log('oldArray =>', oldArray);
    dispatch({
      type: loopReduxTypes.REMOVE_FROM_CUSTOM_BAG_ARRAY,
      payload: [...oldArray],
    });
  };

  const goToLoop = () => {
    console.log('goToLoop Custom', customBagArray);
    navigation.navigate('Loop', {
      idType: 1,
    });
  };

  useEffect(() => {
    console.log('custom words bag is =>', customWordsBag);
    console.log('customWordsBagRoad is =>', customWordsBagRoad);
    console.log('stepOfCustomWordsBag is =>', stepOfCustomWordsBag);
    console.log('isCustomDiscover is =>', loop[0].isCustomDiscover);
  }, []);

  const clearThisCustomWordsBag = () => {
    console.log('clearThisCustomWordsBag start');
    dispatch({
      type: loopReduxTypes.RESET_CUSTOM_BAG_ARRAY,
    });
    realm.write(() => {
      loop[0].customWordsBag = [];
      loop[0].customWordsBagRoad = [];
      loop[0].stepOfCustomWordsBag = 0;
      loop[0].isCustomDiscover = 0;
    });
  };
  const chooseExampleIndex = index => {
    setExampleIndex(index);
  };
  useEffect(() => {
    if (isSubed) {
      let split = example.split(' ');
      newAr = [];
      split.forEach((item, index) => {
        if (item !== '') newAr.push(item);
        if (item === learnedWord && item !== '') {
          console.log('yes item = learnedWord', item, learnedWord);
          setExampleIndex(index);
        }
      });
      setExampleSplited(newAr);
      console.log('split =>', newAr);
      console.log('example index is ', exampleIndex);
    }
  }, [example]);

  useEffect(() => {
    console.log('is user subed =>', isSubed);
  }, []);

  return (
    <View style={styles.screenWrapper}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      <ReviewHeader screenTitle={`${languages[userUiLang].home.add}`} />
      <ScrollView>
        <View style={styles.reviewBagContainer}>
          <HintHeaderBg
            text={`${languages[userUiLang].custom.add_custom_word}`}
          />
          <View style={styles.dataInContainer}>
            {/* The Word in the Native Language */}
            <View style={styles.inputWrapper}>
              <View style={styles.flagImgBox}>
                <Image source={flags[userNativeLang]} style={styles.flagImg} />
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  onChangeText={setNativeWord}
                  value={nativeWord}
                  placeholder={`${languages[userUiLang].settings.languages[userNativeLang]}`}
                  placeholderTextColor={'#ff4c00'}
                />
              </View>
            </View>
            {/* The Word in the Native Language */}
            <View style={styles.inputWrapper}>
              <View style={styles.flagImgBox}>
                <Image source={flags[userLearnedLang]} style={styles.flagImg} />
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  onChangeText={setLearnedWord}
                  value={learnedWord}
                  placeholder={`${languages[userUiLang].settings.languages[userLearnedLang]}`}
                  placeholderTextColor={'#ff4c00'}
                />
              </View>
            </View>
            {/* The Example in the Native Language */}
            <View>
              {!isSubed ? (
                <Image source={Premium} style={styles.premiumImage} />
              ) : null}
              <View style={[styles.inputWrapper, {opacity: isSubed ? 1 : 0.3}]}>
                <View style={styles.flagImgBox}>
                  <Image
                    source={flags[userLearnedLang]}
                    style={styles.flagImg}
                  />
                </View>
                <View style={styles.inputBox}>
                  <TextInput
                    editable={isSubed}
                    style={[styles.input, {height: 100}]}
                    onChangeText={setExample}
                    value={example}
                    placeholder={`${languages[userUiLang].custom.add_an_example}`}
                    placeholderTextColor={'#ff4c0080'}
                    multiline={true}
                    textAlignVertical={'top'}
                  />
                </View>
              </View>
              {isSubed && exampleSplited.length !== 0 ? (
                <View style={styles.exIndexStyle}>
                  <Text style={styles.exIndexHintStyle}>
                    Choose the word that belong to the expression : "
                    {learnedWord}"
                  </Text>
                  <View style={styles.exSplitedStyle}>
                    {exampleSplited.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            chooseExampleIndex(index);
                          }}
                          style={[
                            styles.wordInBagBox,
                            {
                              backgroundColor:
                                index === exampleIndex
                                  ? COLORS_THEME.true
                                  : '#fff',
                            },
                          ]}>
                          <View>
                            <Text style={styles.wordInBagTxt}>{item}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </View>
            {/* The Word IMAGE */}
            <View style>
              {!isSubed ? (
                <Image source={Premium} style={styles.premiumImageBtn} />
              ) : null}

              <View style={[styles.addImageBox, {opacity: isSubed ? 1 : 0.3}]}>
                <TouchableOpacity
                  disabled={!isSubed}
                  style={styles.btnBox}
                  onPress={() => {
                    uploadFile();
                  }}>
                  <View style={styles.btnInternBox}>
                    {file !== null ? (
                      <Image
                        style={{width: 100, height: 100}}
                        source={{uri: file.assets[0].uri}}
                        resizeMethod={'resize'}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <FontAwesome name="image" size={30} color="#fff" />
                    )}
                    {file !== null ? null : (
                      <Text style={styles.btnText}>
                        {languages[userUiLang].custom.add_image}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {load ? <ActivityIndicator size="large" color="#00ff00" /> : null}

          <View style={styles.btnAddBox}>
            <TouchableOpacity
              style={[
                styles.goBtnStyle,
                {
                  opacity:
                    nativeWord === '' ||
                    learnedWord === '' ||
                    (isSubed &&
                      exampleSplited.length !== 0 &&
                      exampleIndex === null)
                      ? 0.3
                      : 1,
                },
              ]}
              disabled={
                nativeWord === '' ||
                learnedWord === '' ||
                (isSubed &&
                  exampleSplited.length !== 0 &&
                  exampleIndex === null)
              }
              onPress={() => {
                //   goToLoop();
                uploadToFirebase();
              }}>
              <Text style={styles.goBtnStyleTxt}>
                {languages[userUiLang].home.add}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <HintHeaderBg text={`${languages[userUiLang].custom.add_at_least}`} />
        <View style={{marginBottom: 20}}></View>

        <View style={styles.reviewBagContainer}>
          <View style={styles.bagContainer}>
            <View style={styles.bagContent}>
              {/* <HintHeader
                text={
                  customWordsBagRoad.length > 0
                    ? 'You are learning those words'
                    : 'Add at least 6 words to start your review bag'
                }
              /> */}
              {customWordsBagRoad.length !== 0
                ? customWordsBag.map((item, index) => {
                    console.log('here is customBagArray');
                    return (
                      <View key={index} style={styles.wordInBagBox}>
                        <Text style={styles.wordInBagTxt}>
                          {item.wordLearnedLang}
                        </Text>
                      </View>
                    );
                  })
                : customBagArray.map((item, index) => {
                    console.log('here is validArr');
                    return (
                      <View key={index} style={styles.wordInBagBox}>
                        <Text style={styles.wordInBagTxt}>
                          {item.wordLearnedLang}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeWord}
                          disabled={customWordsBagRoad.length > 0}
                          onPress={() => {
                            removeWordFromCustomArray(item);
                          }}>
                          <Ionicons
                            name="ios-close-circle"
                            size={20}
                            color="#000"
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
            </View>
          </View>
          {customWordsBagRoad.length !== 0 ? (
            <View style={styles.customStepContainer}>
              <Steps stepOfWhat={1} />
            </View>
          ) : null}
          <View style={styles.btnWrapper}>
            <TouchableOpacity
              style={[
                styles.goBtnStyle,
                {
                  backgroundColor:
                    customWordsBagRoad.length === 0 && customBagArray.length < 6
                      ? '#FF4C0040'
                      : '#FF4C00',
                  width: loop[0].isCustomDiscover === 3 ? '40%' : '60%',
                  marginHorizontal: loop[0].isCustomDiscover === 3 ? 10 : 0,
                },
              ]}
              disabled={
                customWordsBagRoad.length === 0 && customBagArray.length < 6
              }
              onPress={() => {
                goToLoop();
              }}>
              <Text style={styles.goBtnStyleTxt}>
                {/* {loop[0].customWordsBagRoad.length === 0 ? 'Start' : 'Continue'} */}
                {loop[0].stepOfCustomWordsBag === 0
                  ? loop[0].isCustomDiscover < 3
                    ? `${languages[userUiLang].start}`
                    : `${languages[userUiLang].home.review}`
                  : `${languages[userUiLang].continue}`}
              </Text>
            </TouchableOpacity>
            {loop[0].isCustomDiscover === 3 ? (
              <TouchableOpacity
                style={[
                  styles.goBtnStyle,
                  {
                    width: '40%',
                    marginHorizontal: 10,
                    backgroundColor: COLORS_THEME.bgWhite,
                    // flexDirection: 'row',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                  },
                ]}
                onPress={() => {
                  clearThisCustomWordsBag();
                }}>
                <Text style={styles.clearBtnStyleTxt}>
                  Clear{' '}
                  <Ionicons name="ios-close-circle" size={18} color="#000" />
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.reviewWordsContainer}>
          {customWords.map((item, index) => {
            return <CustomWordComp key={index} wordItem={item} />;
          })}
          {customWordsPassed.map((item, index) => {
            return (
              <CustomWordComp key={index} wordItem={item} isPassed={true} />
            );
          })}
        </View>

        {/* <View style={{height: 800}}></View> */}
      </ScrollView>
    </View>
  );
};

export default CustomScreen;

const styles = StyleSheet.create({
  premiumImageBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    right: 50,
    top: 30,
  },
  premiumImage: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 50,
    top: 20,
  },
  exSplitedStyle: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  exIndexHintStyle: {
    color: '#fff',
  },
  exIndexStyle: {
    justifyContent: 'center',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  customStepContainer: {
    paddingHorizontal: 20,
  },
  btnAddBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addImageBox: {
    paddingHorizontal: 20,
    width: '90%',
    marginLeft: '10%',
    marginVertical: 20,
  },
  btnText: {
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 20,
    color: '#fff',
    marginLeft: 20,
  },
  btnInternBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnBox: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  inputWrapper: {
    flexDirection: 'row',
    width: '100%',
    // backgroundColor: 'red',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  flagImg: {
    width: 20,
    height: 20,
  },
  input: {
    height: 60,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,.2)',
    color: '#fff',
    fontSize: 18,
    fontWeight: '300',
    fontFamily: FONTS.enFontFamilyMedium,
  },
  flagImgBox: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 10,
  },
  dataInContainer: {
    marginTop: 20,
  },
  bagContent: {
    flexDirection: 'row',
    padding: 5,
    flexWrap: 'wrap',
  },
  wordInBagTxt: {
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyRegular,
    color: '#1D1E37',
  },
  removeWord: {
    marginLeft: 5,
  },
  wordInBagBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 5,
  },
  leftLine: {
    width: 5,
    backgroundColor: '#fff',
    height: '100%',
  },
  btnActionWrapper: {
    flexDirection: 'row',
  },
  reviewBtnStyleTxt: {
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 16,
  },
  closeBagStyle: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 6,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewBtnStyle: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 6,
  },
  bagActions: {},
  bagTitleTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    color: '#1D1E37',
    fontSize: 18,
  },
  bagTitle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: 100,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  reviewBagHeader: {
    // backgroundColor: 'yellow',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewBagsContainer: {
    // backgroundColor: 'rgba(255,255,255,0.1)',
    // height: 150 + 12 + 50,
    flexDirection: 'row',
    marginBottom: 30,
  },
  reviewWordsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'flex-start',
    width: SIZES.width - 5,
    flexWrap: 'wrap',
    // backgroundColor: 'red',
    // marginLeft: 10,
    paddingHorizontal: 8,
    marginTop: 20,
  },
  goBtnStyleTxt: {
    color: '#fff',
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyMedium,
    textTransform: 'capitalize',
  },
  clearBtnStyleTxt: {
    color: '#000',
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyMedium,
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  goBtnStyle: {
    width: '60%',
    backgroundColor: '#FF4C00',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // marginBottom: 20,
  },
  bagContainer: {
    width: '94%',
    marginHorizontal: '3%',
    minHeight: 120,
    marginVertical: 15,
    backgroundColor: '#1D1E37',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.5)',
  },
  reviewBagContainer: {
    width: '100%',
    // height: 300,
    backgroundColor: 'rgba(29,30,55,.6)',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingBottom: 30,
    marginBottom: 15,
  },
  shadowImageBg: {
    width: 400,
    height: 500,
    opacity: 0.25,
    position: 'absolute',
    top: 0,
    left: SIZES.width / 2 - 200,
    // backgroundColor: 'red',
  },
  screenWrapper: {
    backgroundColor: '#181920',
    flex: 1,
    width: '100%',
  },
});
