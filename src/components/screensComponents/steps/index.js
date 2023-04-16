import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RealmContext} from '../../../realm/models';
import {User} from '../../../realm/models/User';
import {Loop} from '../../../realm/models/Loop';
import {Word} from '../../../realm/models/Word';
import {COLORS_THEME, FONTS} from '../../../constants';
import Octicons from 'react-native-vector-icons/Octicons';
import {languages} from '../../../../languages';

const {useQuery, useObject, useRealm} = RealmContext;

const Steps = props => {
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  const realm = useRealm();
  const loop = useQuery(Loop);
  const words = useQuery(Word);
  const {stepOfWhat} = props;
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepsWrapper}>
        <Text
          style={[
            styles.stepTitle,
            {
              color:
                stepOfWhat === 0
                  ? loop[0].isDefaultDiscover === 0
                    ? COLORS_THEME.primary
                    : '#fff'
                  : loop[0].isCustomDiscover === 0
                  ? COLORS_THEME.primary
                  : '#fff',
            },
          ]}>
          {languages[userUiLang].home.discover}
        </Text>
        <Text
          style={[
            styles.stepTitle,
            {
              color:
                stepOfWhat === 0
                  ? loop[0].isDefaultDiscover === 1
                    ? COLORS_THEME.primary
                    : '#fff'
                  : loop[0].isCustomDiscover === 1
                  ? COLORS_THEME.primary
                  : '#fff',
            },
          ]}>
          {languages[userUiLang].home.practice}
        </Text>
        <Text
          style={[
            styles.stepTitle,
            {
              color:
                stepOfWhat === 0
                  ? loop[0].isDefaultDiscover === 2
                    ? COLORS_THEME.primary
                    : '#fff'
                  : loop[0].isCustomDiscover === 2
                  ? COLORS_THEME.primary
                  : '#fff',
            },
          ]}>
          {languages[userUiLang].home.master}
        </Text>
      </View>
      <View style={styles.stepsShapeWrapper}>
        <View style={styles.stepsShape}>
          <View
            style={[
              styles.stepCircle,
              {
                width:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 0
                      ? 20
                      : loop[0].isDefaultDiscover > 0
                      ? 30
                      : 15
                    : loop[0].isCustomDiscover === 0
                    ? 20
                    : loop[0].isCustomDiscover > 0
                    ? 30
                    : 15,

                height:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 0
                      ? 20
                      : loop[0].isDefaultDiscover > 0
                      ? 30
                      : 15
                    : loop[0].isCustomDiscover === 0
                    ? 20
                    : loop[0].isCustomDiscover > 0
                    ? 30
                    : 15,
                backgroundColor:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 0
                      ? COLORS_THEME.primary
                      : '#fff'
                    : loop[0].isCustomDiscover === 0
                    ? COLORS_THEME.primary
                    : '#fff',
              },
            ]}>
            {stepOfWhat === 0 ? (
              loop[0].isDefaultDiscover > 0 ? (
                <Octicons name="check" size={26} color="#000" />
              ) : null
            ) : loop[0].isCustomDiscover > 0 ? (
              <Octicons name="check" size={26} color="#000" />
            ) : null}
          </View>
          <View
            style={[
              styles.stepCircle,
              {
                width:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 1
                      ? 20
                      : loop[0].isDefaultDiscover > 1
                      ? 30
                      : 15
                    : loop[0].isCustomDiscover === 1
                    ? 20
                    : loop[0].isCustomDiscover > 1
                    ? 30
                    : 15,

                height:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 1
                      ? 20
                      : loop[0].isDefaultDiscover > 1
                      ? 30
                      : 15
                    : loop[0].isCustomDiscover === 1
                    ? 20
                    : loop[0].isCustomDiscover > 1
                    ? 30
                    : 15,
                backgroundColor:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 1
                      ? COLORS_THEME.primary
                      : '#fff'
                    : loop[0].isCustomDiscover === 1
                    ? COLORS_THEME.primary
                    : '#fff',
              },
            ]}>
            {stepOfWhat === 0 ? (
              loop[0].isDefaultDiscover > 1 ? (
                <Octicons name="check" size={26} color="#000" />
              ) : null
            ) : loop[0].isCustomDiscover > 1 ? (
              <Octicons name="check" size={26} color="#000" />
            ) : null}
          </View>
          <View
            style={[
              styles.stepCircle,
              {
                width:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 2
                      ? 20
                      : loop[0].isDefaultDiscover > 2
                      ? 30
                      : 15
                    : loop[0].isCustomDiscover === 2
                    ? 20
                    : loop[0].isCustomDiscover > 2
                    ? 30
                    : 15,

                height:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 2
                      ? 20
                      : loop[0].isDefaultDiscover > 2
                      ? 30
                      : 15
                    : loop[0].isCustomDiscover === 2
                    ? 20
                    : loop[0].isCustomDiscover > 2
                    ? 30
                    : 15,
                backgroundColor:
                  stepOfWhat === 0
                    ? loop[0].isDefaultDiscover === 2
                      ? COLORS_THEME.primary
                      : '#fff'
                    : loop[0].isCustomDiscover === 2
                    ? COLORS_THEME.primary
                    : '#fff',
              },
            ]}>
            {stepOfWhat === 0 ? (
              loop[0].isDefaultDiscover > 2 ? (
                <Octicons name="check" size={26} color="#000" />
              ) : null
            ) : loop[0].isCustomDiscover > 2 ? (
              <Octicons name="check" size={26} color="#000" />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Steps;

const styles = StyleSheet.create({
  stepContainer: {
    // paddingHorizontal: 20,
    marginVertical: 20,
  },
  stepsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  stepTitle: {
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
    textTransform: 'capitalize',
  },
  stepsShapeWrapper: {
    paddingHorizontal: 10,
  },
  stepsShape: {
    backgroundColor: 'red',

    height: 10,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff50',
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
