import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {COLORS_THEME, FONTS} from '../../../constants';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tester from '../../../../assets/tester.png';
import {useNavigation} from '@react-navigation/native';
import {RealmContext} from '../../../realm/models';
import {Loop} from '../../../realm/models/Loop';
import {languages} from '../../../../languages';
import {User} from '../../../realm/models/User';

const {useQuery, useRealm} = RealmContext;

const WeeklyTestCard = ({isTodayTest}) => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  const navigation = useNavigation();
  const isThisDayPassed = true;
  const goToLoop = () => {
    navigation.navigate('Loop', {
      idType: 4,
    });
  };
  useEffect(() => {
    console.log('loop[0].stepOfWeeklyTest', loop[0].stepOfWeeklyTest);
    console.log('weekly road length', loop[0].weeklyTestRoad.length);
  }, []);

  return (
    <View style={[styles.container]}>
      {isThisDayPassed ? (
        <View style={styles.titleWrapper}>
          {/* <Image source={Tester} style={styles.testImg} /> */}
          <Text style={styles.titleWeekly}>
            {languages[userUiLang].home.weekly_test}
          </Text>
          {isTodayTest ? (
            <Text style={styles.title}>
              {languages[userUiLang].home.test_end_week}
            </Text>
          ) : (
            <Text style={styles.title}>
              {languages[userUiLang].home.complete_all_the_days}
            </Text>
          )}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.buttonStyle}
              disabled={
                loop[0].stepOfWeeklyTest + 1 ===
                  loop[0].weeklyTestRoad.length || !isTodayTest
              }
              onPress={() => {
                goToLoop();
              }}>
              <Text style={styles.buttonTxtStyle}>
                {loop[0].stepOfWeeklyTest === 0
                  ? `${languages[userUiLang].home.test}`
                  : loop[0].stepOfWeeklyTest + 1 ===
                    loop[0].weeklyTestRoad.length
                  ? `${languages[userUiLang].finished}`
                  : `${languages[userUiLang].continue}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Fontisto name={'locked'} size={40} color="rgba(0, 0, 0, 0.7)" />
      )}

      {/* <View style={styles.cardDate}>
          <Text style={styles.cardDateTxt}>9 Wed</Text>
        </View> */}
      {/* <View style={styles.titleWrapper}>
          <Text style={styles.title}>Day 1</Text>
        </View> */}
      {/* <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.buttonStyle}>
            <Text style={styles.buttonTxtStyle}>Take test</Text>
          </TouchableOpacity>
        </View> */}
    </View>
  );
};

export default WeeklyTestCard;

const styles = StyleSheet.create({
  testImg: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  cardDateTxt: {
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#1D1E37',
  },
  cardDate: {
    position: 'absolute',
    width: 80,
    height: 30,
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // buttonWrapper: {flexDirection: 'row'},
  buttonTxtStyle: {
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  buttonStyle: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#1D1E37',
    marginTop: 20,
    width: '80%',
  },
  titleWeekly: {
    fontSize: 24,
    fontFamily: FONTS.enFontFamilyBold,
    color: COLORS_THEME.bgDark,
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyMedium,
    color: '#1D1E37',
    textAlign: 'center',
  },
  titleWrapper: {
    // width: '100%',
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgb(209, 210, 213)',
    zIndex: 2,
    elevation: 2,
    position: 'relative',
    // height: '100%',
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 50,
  },
});
