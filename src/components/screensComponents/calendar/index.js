import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS_THEME, FONTS} from '../../../constants';
import {languages} from '../../../../languages';
import {RealmContext} from '../../../realm/models';
import {User} from '../../../realm/models/User';

const {useQuery, useObject, useRealm} = RealmContext;

const ProfileCalendar = props => {
  const users = useQuery(User);
  const {userUiLang} = props;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const usedDays = [...users[0].passedDays];
  const [items, setItems] = useState([]);
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; //  months are 0-based
  //  Current Month
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  console.log(daysInCurrentMonth);
  // Get the first day of the current month

  (y = date.getFullYear()), (m = date.getMonth());
  var firstDay = new Date(y, m, 1);
  var firstDayIndex = firstDay.getDay();
  var firstDayName = days[firstDay.getDay()];

  var lastDay = new Date(y, m + 1, 0);
  var lastDayIndex = lastDay.getDay();
  var lastDayName = days[lastDay.getDay()];

  console.log('dayName is =>', firstDayName, 'index =>', firstDayIndex);
  console.log('lastDayName is =>', lastDayName, 'index =>', lastDayIndex);
  const constructDays = () => {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; //  months are 0-based
    const renderDays = [];
    let index = 1;
    for (let i = 0; i < 42; i++) {
      if (i >= firstDayIndex && index <= daysInCurrentMonth) {
        renderDays.push(
          <View key={i} style={[styles.dayBox]}>
            {usedDays.includes(index + currentYear + currentMonth) && (
              <View
                style={{
                  backgroundColor: COLORS_THEME.primary,
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  borderRadius: 30,
                }}></View>
            )}
            <Text style={styles.daysNumberText}>{index}</Text>
          </View>,
        );
        index += 1;
      } else {
        renderDays.push(
          <View key={i} style={styles.dayBox}>
            <Text style={styles.daysNumberText}></Text>
          </View>,
        );
      }
    }
    console.log('renderDays =>', renderDays);
    setItems(renderDays);
  };
  useEffect(() => {
    constructDays();
  }, []);

  return (
    <View style={styles.calendarWrapper}>
      <View style={styles.monthStyle}>
        <Text style={styles.monthTxtStyle}>
          {languages[userUiLang].month[currentMonth - 1]}
        </Text>
      </View>
      <View style={styles.daysWrapper}>
        {days.map((item, index) => {
          return (
            <View style={styles.weekDayBox} key={index}>
              <Text style={styles.daysText}>{item}</Text>
            </View>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}>
        {items}
      </View>
    </View>
  );
};

export default ProfileCalendar;

const styles = StyleSheet.create({
  monthTxtStyle: {
    color: '#fff',
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyMedium,
  },
  monthStyle: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  weekDayBox: {
    width: '14.28%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBox: {
    width: '14.28%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  calendarWrapper: {
    // backgroundColor: 'red',
    paddingHorizontal: 10,
    // marginTop: 30,
  },
  daysText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: FONTS.enFontFamilyRegular,
    fontSize: 14,
  },
  daysNumberText: {
    color: 'rgba(255,255,255,1)',
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 14,
  },
  daysWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
