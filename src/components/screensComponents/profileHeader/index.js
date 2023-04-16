import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS_THEME} from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FONTS} from '../../../constants';
import {useNavigation} from '@react-navigation/native';

const ProfileHeader = props => {
  const navigation = useNavigation();
  const {screenTitle} = props;
  const openSetting = () => {
    console.log('openSetting start');
    navigation.navigate('settings');
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerBox}></View>
      <View style={[styles.reviewHeaderBox, styles.headerBox]}>
        <Text style={styles.reviewHeader}>{screenTitle}</Text>
      </View>
      <View style={[styles.headerIcon, styles.headerBox]}>
        <TouchableOpacity
          onPress={() => {
            openSetting();
          }}>
          <Ionicons name="settings-sharp" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  headerBox: {
    width: '33.3333333%',
  },
  headerIcon: {alignItems: 'flex-end'},
  reviewHeaderBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewHeader: {
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 24,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});
