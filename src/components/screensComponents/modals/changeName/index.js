import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS_THEME, FONTS, SIZES} from '../../../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {User} from '../../../../realm/models/User';
import {RealmContext} from '../../../../realm/models';
import {languages} from '../../../../../languages';

const {useQuery, useObject, useRealm} = RealmContext;

const ChangeName = props => {
  const realm = useRealm();
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  const {nameModalVisible, setNameModalVisible} = props;
  const [text, onChangeText] = React.useState(user[0].userName);
  const confirmChange = () => {
    console.log('confirmChange');
    realm.write(() => {
      user[0].userName = text;
    });
    setNameModalVisible(!nameModalVisible);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={nameModalVisible}
      onRequestClose={() => {
        setNameModalVisible(!nameModalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView
            style={styles.listOfWord}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              width: '100%',
              paddingHorizontal: 20,
            }}>
            <View style={styles.inputBoxStyle}>
              <View style={styles.iconStyle}>
                <AntDesign
                  name={'user-alt'}
                  size={25}
                  color={'#fff'}
                  style={styles.streakImgStyle}
                />
              </View>

              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
              />
            </View>
          </ScrollView>
          <View style={styles.btnsWrapper}>
            <TouchableOpacity
              disabled={text.length === 0}
              style={styles.confirmBtnStyle}
              onPress={confirmChange}>
              <Text style={styles.confirmBtnTxtStyle}>
                {languages[userUiLang].settings.confirm}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeName;

const styles = StyleSheet.create({
  iconStyle: {width: '10%'},
  inputBoxStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  streakImgStyle: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  input: {
    color: '#fff',

    // textAlign: 'center',
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 18,
    width: '90%',
    paddingHorizontal: 20,
  },
  cancelBtTxtnStyle: {
    fontSize: 18,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#000',
  },
  confirmBtnTxtStyle: {
    fontSize: 18,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
  },
  confirmBtnStyle: {
    backgroundColor: COLORS_THEME.primary,
    width: '90%',
    // marginLeft: '10%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelBtnStyle: {
    backgroundColor: 'yellow',
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  loaderWrapper: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: 250,
    margin: 20,
    backgroundColor: '#1D1E37',
    // borderWidth: 1,
    // borderColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
