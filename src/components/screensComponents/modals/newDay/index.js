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
import {User} from '../../../../realm/models/User';
import {RealmContext} from '../../../../realm/models';
import {languages} from '../../../../../languages';
import LottieView from 'lottie-react-native';
const {useQuery, useObject, useRealm} = RealmContext;

const NewDayModal = props => {
  const realm = useRealm();
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  const {newDayModalVisible, setNewDayModalVisible} = props;
  const confirmChange = () => {
    console.log('confirmChange');
    setNewDayModalVisible(!newDayModalVisible);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newDayModalVisible}
      onRequestClose={() => {
        setNewDayModalVisible(!newDayModalVisible);
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
            <View style={styles.newDayBox}>
              <Text style={styles.newDayBoxTxt}>
                New day is a new beginning
              </Text>
            </View>
            <LottieView
              source={require('../../../../../assets/animations/streak.json')}
              autoPlay={true}
              loop={true}
              style={{
                // backgroundColor: 'rgba(0,0,0,0.3)',
                // width: '100%',
                // height: '100%',
                position: 'relative',
                top: 0,
                left: 0,
                // elevation: 3,
                // zIndex: 3,
              }}
            />
          </ScrollView>
          <View style={styles.btnsWrapper}>
            <TouchableOpacity
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

export default NewDayModal;

const styles = StyleSheet.create({
  newDayBox: {},
  newDayBoxTxt: {
    fontSize: 22,
    color: '#fff',
    fontFamily: FONTS.enFontFamilyBold,
    textAlign: 'center',
  },
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
    height: 450,
    margin: 20,
    backgroundColor: '#1D1E37',
    // borderWidth: 1,
    // borderColor: '#fff',
    borderRadius: 8,
    padding: 20,
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
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
