import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS_THEME, FONTS, IMAGES} from '../../constants';
import {useSelector} from 'react-redux';
import {RealmContext} from '../../realm/models';
import {User} from '../../realm/models/User';
import {useNavigation} from '@react-navigation/native';
import {languages} from '../../../languages';
import {flags} from '../../constants/images';
const {useQuery, useRealm} = RealmContext;

const HomeHeader = () => {
  const navigation = useNavigation();
  const realm = useRealm();

  const user = useQuery(User);
  let learnedLang = user[0].userLearnedLang;
  let userUiLang = user[0].userUiLang;
  useEffect(() => {
    if (user[0].userLearnedLang) {
      console.log('true =>', user[0].userLearnedLang);
    } else {
      console.log('false =>', user[0].userLearnedLang);
    }
  }, [user]);

  const goToProfile = () => {
    navigation.navigate('Profile');
  };
  return (
    <View style={styles.container}>
      <View style={styles.learnedLang}>
        {user[0].userLearnedLang !== null ? (
          <Image source={flags[learnedLang]} style={styles.falgStyle} />
        ) : (
          <Text style={styles.learnedLangTxt}>99</Text>
        )}
      </View>
      <View style={styles.week}>
        <Text style={styles.weekTxt}>
          {languages[userUiLang].home.week}{' '}
          {user[0].currentWeek !== null ? user[0].currentWeek : 'WW'}
        </Text>
      </View>
      <TouchableOpacity onPress={goToProfile}>
        <View style={styles.user}>
          <FontAwesome name="user" size={26} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  falgStyle: {
    width: 25,
    height: 25,
  },
  learnedLang: {},
  week: {},
  user: {},
  weekTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 22,
    color: '#fff',
    textTransform: 'capitalize',
  },

  learnedLangTxt: {
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 22,
    color: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 10,
    // backgroundColor: COLORS_THEME.textDark,
    // marginBottom: 100,
  },
});
