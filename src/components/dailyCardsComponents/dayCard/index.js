import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS_THEME, FONTS} from '../../../constants';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Loop} from '../../../realm/models/Loop';
import {RealmContext} from '../../../realm/models';

const {useQuery, useRealm} = RealmContext;

const DayCard = ({alreadyPassed, isDailyTest}) => {
  const loop = useQuery(Loop);
  const isThisDayPassed = alreadyPassed;

  return (
    <View style={[styles.container, {height: !isThisDayPassed ? 150 : null}]}>
      {isThisDayPassed ? (
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            Congratulation you finished this day words
          </Text>
          {isDailyTest && (
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                disabled={
                  loop[0].stepOfDailyTest + 1 === loop[0].dailyTestRoad.length
                }
                style={styles.buttonStyle}
                onPress={() => {
                  goToLoop();
                }}>
                <Text style={styles.buttonTxtStyle}>
                  {loop[0].stepOfDailyTest === 0 ? 'Test' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <Fontisto name={'locked'} size={40} color="#fff" />
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

export default DayCard;

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: 10,
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
  },
  buttonStyle: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: COLORS_THEME.primary,
    marginTop: 20,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
    textAlign: 'center',
  },
  titleWrapper: {
    // width: '100%',
    // marginTop: 20,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#36386c',
    zIndex: 2,
    elevation: 2,
    position: 'relative',
    // height: '100%',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 50,
  },
});
