import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {COLORS_THEME, FONTS} from '../../../constants/theme';
import {SIZES} from '../../../constants/theme';
import ShadowEffect from '../../../../assets/shadowImg.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
//import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';
import {RealmContext} from '../../../realm/models';
import {Loop} from '../../../realm/models/Loop';
import loopReduxTypes from '../../../redux/LoopRedux/loopRedux.types';
import LoopProgBar from '../../screensComponents/loopProgBar';

const {useQuery, useObject, useRealm} = RealmContext;
const mapState = ({loopRedux}) => ({
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
});

const Matching = props => {
  const navigation = useNavigation();
  const realm = useRealm();
  const loop = useQuery(Loop);
  let isDefaultDiscover = loop[0].isDefaultDiscover;
  let isCustomDiscover = loop[0].isCustomDiscover;
  const {loopType} = props;
  const dispatch = useDispatch();
  const {loopStep, loopRoad} = useSelector(mapState);
  const [darkMode, setDarkMode] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [matchingArray, setMatchingArray] = useState([]);

  const [a1Checked, setA1Checked] = useState(false);
  const [a2Checked, setA2Checked] = useState(false);
  const [a3Checked, setA3Checked] = useState(false);
  const [checkedArray, setCheckedArray] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [borderState, setBorderState] = useState('#fff');
  //const correctSound = useMemo(() => new Sound('correct.mp3'), []);
  //const wrongSound = useMemo(() => new Sound('wrong.mp3'), []);
  const dummyData = [
    {
      id: 1,
      wordLang1: 'hello',
      wordLang2: 'مرحبا',
      image:
        'https://www.incimages.com/uploaded_files/image/1920x1080/getty_495142964_198701.jpg',
    },
    {
      id: 2,
      wordLang1: 'Door',
      wordLang2: 'الباب',
      image:
        'https://www.energy.gov/sites/default/files/styles/full_article_width/public/door_5481543.jpg',
    },
    {
      id: 3,
      wordLang1: 'dog',
      wordLang2: 'كلب',
      image:
        'https://thumbs.dreamstime.com/b/golden-retriever-dog-21668976.jpg',
    },
  ];

  const buildArrayFromData = async () => {
    const arr = [];
    let item;

    let randomArrIndex = Math.floor(Math.random() * 3); // it can be 0 or 1 or 2 //// and if we want it to be from 1 to 9 we writ 10
    console.log('randomArrIndex is', randomArrIndex);

    for (let i = randomArrIndex; i < 3; i++) {
      item = loop[0].defaultWordsBag[i];
      let myFirstObj = {
        a: '',
        fKey: '',
        type: '',
      };
      let mySecondObj = {
        a: '',
        fKey: '',
        type: '',
      };
      myFirstObj.a = item.wordLearnedLang;
      myFirstObj.fKey = `${i + 1}`;
      myFirstObj.type = 0;
      mySecondObj.a = item.wordImage;
      mySecondObj.fKey = `${i + 1}`;
      mySecondObj.type = 1;
      arr.push(myFirstObj, mySecondObj);
    }

    // loop[0].defaultWordsBag.forEach((item, index) => {
    //   // let myFirstObj = {
    //   //   a: '',
    //   //   fKey: '',
    //   //   type: '',
    //   // };
    //   // let mySecondObj = {
    //   //   a: '',
    //   //   fKey: '',
    //   //   type: '',
    //   // };
    //   // myFirstObj.a = item.wordLearnedLang;
    //   // myFirstObj.fKey = `${index + 1}`;
    //   // myFirstObj.type = 0;
    //   // mySecondObj.a = item.wordImage;
    //   // mySecondObj.fKey = `${index + 1}`;
    //   // mySecondObj.type = 1;
    //   // arr.push(myFirstObj, mySecondObj);
    // });

    let shuffledArray = await shuffle(arr);
    setMatchingArray(shuffledArray);
    console.log('my new array is =>', arr);
  };

  const shuffle = async array => {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    // setShuffledArray(array);
    return array;
  };

  const checkIfFieldsCorrect = item => {
    // console.log('checkedArray =>', checkedArray);
    if (selectedArray.length >= 1) {
      // console.log('we are here 93');
      setSelectedArray([]);
    } else {
      // console.log('we are here 96');
      setSelectedArray([...selectedArray, JSON.stringify(item)]);
    }
    if (checkedArray.includes(item.fKey)) {
      // console.log('we are in L 100');
      //correctSound.play();
      switch (item.fKey) {
        case '1':
          setA1Checked(true);
          break;
        case '2':
          setA2Checked(true);
          break;
        case '3':
          setA3Checked(true);
          break;

        default:
          break;
      }
      setCheckedArray([]);
    } else {
      // console.log('we are in L 121');
      if (checkedArray.length >= 1) {
        // alert('Wrong Answer');
        //wrongSound.play();
        setCheckedArray([]);
      } else {
        setCheckedArray([item.fKey, ...checkedArray]);
      }
      // console.log('checkedArray.includes(item)=>', checkedArray.includes(item));
    }
  };
  useEffect(() => {
    buildArrayFromData();
  }, []);

  const containerBg = {
    backgroundColor: darkMode ? COLORS_THEME.bgDark : COLORS_THEME.bgWhite,
  };
  const backgroundColor = {
    backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
  };
  const color = darkMode ? COLORS_THEME.textWhite : COLORS_THEME.textDark;

  const checkResponse = () => {
    console.log('Matching Next');
    if (loopStep < loopRoad.length - 1) {
      dispatch({
        type: loopReduxTypes.SET_LOOP_STEP,
        payload: loopStep + 1,
      });
      if (loopType === 0) {
        console.log(
          'HERE We Will update default wordsBag step in the realm DB',
        );
        // update default wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfDefaultWordsBag = loop[0].stepOfDefaultWordsBag + 1;
        });
      } else if (loopType === 1) {
        console.log('HERE We Will update custom wordsBag step in the realm DB');
        // update custom wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfCustomWordsBag = loop[0].stepOfCustomWordsBag + 1;
        });
      } else if (loopType === 2) {
        console.log('HERE We Will update review wordsBag step in the realm DB');
        // update review wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfReviewWordsBag = loop[0].stepOfReviewWordsBag + 1;
        });
      } else if (loopType === 3) {
        console.log('HERE We Will update daily test road step in the realm DB');
        // update daily test wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfDailyTest = loop[0].stepOfDailyTest + 1;
        });
      } else if (loopType === 4) {
        console.log('HERE We Will update daily test road step in the realm DB');
        // update weekly test wordsBag step in the realm DB
        realm.write(() => {
          loop[0].stepOfWeeklyTest = loop[0].stepOfWeeklyTest + 1;
        });
      }
    } else {
      // if custom or default words bag we need to update the isDefaultDiscover variable by add 1
      // console.log('loopStep =>', loopStep);
      if (loopType === 0 && isDefaultDiscover < 3) {
        // add 1 to isDefaultDiscover in the realm DB
        realm.write(() => {
          loop[0].isDefaultDiscover = loop[0].isDefaultDiscover + 1;
        });
      } else if (loopType === 1 && isCustomDiscover < 3) {
        realm.write(() => {
          loop[0].isCustomDiscover = loop[0].isCustomDiscover + 1;
        });
      }
      loopExit().then(navigation.navigate('Home'));
    }
  };

  const loopExit = async () => {
    dispatch({
      type: loopReduxTypes.RESET_LOOP,
    });
    if (loopType === 0) {
      // update default wordsBag road in the real DB
      realm.write(() => {
        loop[0].stepOfDefaultWordsBag = 0;
      });
    } else if (loopType === 1) {
      realm.write(() => {
        loop[0].stepOfCustomWordsBag = 0;
      });
    } else if (loopType === 2) {
      realm.write(() => {
        loop[0].stepOfReviewWordsBag = 0;
        loop[0].reviewWordsBagRoad = [];
      });
      dispatch({
        type: loopReduxTypes.RESET_REVIEW_BAG_ARRAY,
      });
    }
  };
  return (
    <View style={[styles.wrapper, containerBg]}>
      <Image source={ShadowEffect} style={styles.shadowImageBg} />
      {!isKeyboardVisible && (
        <View style={styles.header}>
          <TouchableOpacity>
            <AntDesign name="exclamationcircleo" size={18} color={color} />
          </TouchableOpacity>
        </View>
      )}

      {!isKeyboardVisible && (
        <View style={styles.questionWrapper}>
          <View style={styles.questionContent}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={30}
              color={'#D2FF00'}
            />
            <Text style={styles.questionText}>Build with cards what mean</Text>
          </View>
        </View>
      )}

      <View style={styles.cardsContainer}>
        {matchingArray.map((item, index) => {
          return (
            <View
              key={index}
              style={[
                styles.singleFieldDesign,
                selectedArray.includes(JSON.stringify(item))
                  ? {borderColor: borderState}
                  : null,
                //   : (a1Checked && item.fKey === '1') ||
                //     (a2Checked && item.fKey === '2') ||
                //     (a3Checked && item.fKey === '3')
                //   ? {backgroundColor: '#f78a0b'}
                //   : {backgroundColor: '#37e7f5'},
              ]}>
              {/* <View style={styles.mistakeOverlay}></View> */}
              <TouchableOpacity
                disabled={
                  selectedArray.includes(JSON.stringify(item)) ||
                  (a1Checked && item.fKey === '1') ||
                  (a2Checked && item.fKey === '2') ||
                  (a3Checked && item.fKey === '3')
                }
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => checkIfFieldsCorrect(item)}>
                {(a1Checked && item.fKey === '1') ||
                (a2Checked && item.fKey === '2') ||
                (a3Checked && item.fKey === '3') ? (
                  //   <Icon name="checkbox" size={18} color={'#000000'} sty />
                  <Text style={styles.checkIndicator}>{item.fKey}</Text>
                ) : null}
                {item.type === 0 ? (
                  <Text
                    style={[
                      styles.singleFieldTxtDesign,
                      {
                        fontFamily: FONTS.enFontFamilyMedium,
                      },
                    ]}>
                    {item.a}
                  </Text>
                ) : (
                  <Image source={{uri: item.a}} style={styles.imgCard} />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.blurParrent}>
          <TouchableOpacity
            style={[
              styles.btnGo,
              backgroundColor,
              {opacity: !a1Checked || !a2Checked || !a3Checked ? 0.4 : 1},
            ]}
            disabled={!a1Checked || !a2Checked || !a3Checked}
            onPress={() => checkResponse()}>
            <Text style={styles.checkBtnTxt}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoopProgBar darkMode={darkMode} />
    </View>
  );
};

export default Matching;

const styles = StyleSheet.create({
  mistakeOverlay: {
    position: 'absolute',
    top: '-1%',
    left: '-1%',
    width: '102%',
    height: '102%',
    // backgroundColor: '#820b0b90',
    borderWidth: 5,
    borderColor: '#820b0b',
    zIndex: 0,
    elevation: 2,
  },
  checkIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#000',
    zIndex: 3,
    elevation: 3,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 18,
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 18,
    borderBottomLeftRadius: 10,
  },
  imgCard: {
    width: '100%',
    height: '100%',
  },
  singleFieldTxtDesign: {
    textAlign: 'center',
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
  },
  singleFieldDesign: {
    width: '46%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 12,
    marginHorizontal: '2%',
    marginVertical: '2%',
    // paddingHorizontal: 10,
    backgroundColor: '#00000030',
    borderColor: '#FF4C0030',
    borderWidth: 4,
  },

  checkBtnTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    color: '#000',
    fontSize: 24,
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
    alignItems: 'flex-end',
    // backgroundColor: 'blue',
    // marginTop: 40,
    flex: 2,
    // //***************
    // backgroundColor: 'red',
    // width: '100%',
    // //***************
  },
  blurParrent: {
    position: 'relative',
    // backgroundColor: 'blue',
    width: '100%',
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  btnGo: {
    width: '80%',
    height: 60,
    borderRadius: 10,
    // backgroundColor: '#fff',  // Changed To DarkLight Code
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardsContainer: {
    // marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 7.5,
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // //***************
    // backgroundColor: '#00bb0c',
    // width: '100%',
    // //***************
    marginTop: 25,
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
  },

  wrapper: {
    // justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'blue',
    // height: windowHeight,
    flex: 12,
    width: '100%',
    // backgroundColor: '#181920',  // Changed To DarkLight Code
    alignItems: 'center',
    justifyContent: 'center',
  },
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
