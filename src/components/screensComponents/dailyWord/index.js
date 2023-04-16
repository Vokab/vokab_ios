import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, COLORS_THEME, FONTS, IMAGES} from '../../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {flags} from '../../../constants/images';

const DailyWord = props => {
  const {
    item,
    index,
    setItemWillChange,
    words,
    loop,
    setSuggestions,
    setVisible,
    setDeleteModalVisible,
    setItemWillDeleted,
    learnedLang,
  } = props;
  let weCanChangeOrDelete =
    loop[0].stepOfDefaultWordsBag !== 0 ||
    loop[0].isDefaultDiscover !== 0 ||
    loop[0].defaultWordsBagRoad.length !== 0;
  const changeWordModal = async (item, index) => {
    console.log('Start changeWord', item);
    const ids = await getIdsOfWordsBag();
    const idsQuery = ids.map(id => `_id != "${id}"`).join(' AND ');
    setItemWillChange(index);
    const newOnes = words.filtered(
      `(${idsQuery}) AND deleted != true AND passed != true`,
    );
    setSuggestions(newOnes);
    setVisible(true);
  };

  const getIdsOfWordsBag = async () => {
    const array = [];
    loop[0].defaultWordsBag.forEach(item => {
      array.push(item._id);
    });
    // console.log('array =>',array)
    return array;
  };

  const disappearWordModal = (item, index) => {
    console.log('Start disappearWord', item);
    setDeleteModalVisible(true);
    setItemWillDeleted(index);
  };

  return (
    <View key={index} style={styles.container}>
      <Image source={flags[learnedLang]} style={styles.falgStyle} />
      <Text style={styles.wordTxt}>{item.wordLearnedLang}</Text>
      <View style={styles.btnBox}>
        <TouchableOpacity
          disabled={weCanChangeOrDelete}
          style={[styles.changeBtn, {opacity: weCanChangeOrDelete ? 0.5 : 1}]}
          onPress={() => {
            changeWordModal(item, index);
          }}>
          <FontAwesome name={'refresh'} size={18} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={weCanChangeOrDelete}
          style={[
            styles.disappearBtn,
            {opacity: weCanChangeOrDelete ? 0.5 : 1},
          ]}
          onPress={() => {
            disappearWordModal(item, index);
          }}>
          <Feather name={'eye-off'} size={18} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailyWord;

const styles = StyleSheet.create({
  falgStyle: {
    width: 20,
    height: 20,
  },
  disappearBtn: {
    // backgroundColor: '#1D1E37',
    padding: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#fff',
    opacity: 0.4,
  },
  changeBtn: {
    backgroundColor: COLORS_THEME.primary,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  btnBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  wordTxt: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyBold,
  },
  wordBox: {
    backgroundColor: '#00000030',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: '#1D1E37',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,.10)',
    width: '48%',
    height: 150,
    borderRadius: 20,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 6,
    marginHorizontal: '1%',
  },
});
