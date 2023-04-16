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
import English from '../../../../../assets/1.png';
import Arabic from '../../../../../assets/0.png';
import French from '../../../../../assets/2.png';
import German from '../../../../../assets/3.png';
import Italian from '../../../../../assets/4.png';
import Espagnol from '../../../../../assets/5.png';
import Portugais from '../../../../../assets/6.png';
import {RealmContext} from '../../../../realm/models';
import {User} from '../../../../realm/models/User';
import {languages} from '../../../../../languages';
const {useQuery, useObject, useRealm} = RealmContext;

const ChangeUiLang = props => {
  const realm = useRealm();
  const user = useQuery(User);
  const {uiLangModalVisible, setUiLangModalVisible} = props;
  const [selectedId, setSelectedId] = useState(user[0].userUiLang);
  let userUiLang = user[0].userUiLang;
  const languagesVar = [
    {
      id: 0,
      lang: languages[userUiLang].settings.languages[0],
      flag: Arabic,
    },
    {
      id: 1,
      lang: languages[userUiLang].settings.languages[1],
      flag: English,
    },
    {
      id: 2,
      lang: languages[userUiLang].settings.languages[2],
      flag: French,
    },
    {
      id: 4,
      lang: languages[userUiLang].settings.languages[3],
      flag: Italian,
    },
    {
      id: 3,
      lang: languages[userUiLang].settings.languages[4],
      flag: German,
    },
    {
      id: 5,
      lang: languages[userUiLang].settings.languages[5],
      flag: Espagnol,
    },
    {
      id: 6,
      lang: languages[userUiLang].settings.languages[6],
      flag: Portugais,
    },
  ];
  const confirmChange = () => {
    console.log('confirmChange');
    realm.write(() => {
      user[0].userUiLang = selectedId;
    });
    setUiLangModalVisible(false);
  };
  const changeLangUi = itemId => {
    setSelectedId(itemId);
    console.log('itemId =>', selectedId);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={uiLangModalVisible}
      onRequestClose={() => {
        setUiLangModalVisible(!uiLangModalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView
            style={styles.listOfWord}
            contentContainerStyle={{
              flexGrow: 1,
              //   justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 20,
              //   marginBottom: 30,
            }}>
            {/* <View style={styles.modalTitle}>
              <Text style={styles.modalTitleTxt}>Ui Language</Text>
            </View> */}
            <View style={styles.languagesWrapper}>
              {languagesVar.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.langBtn]}
                    onPress={() => {
                      changeLangUi(item.id);
                    }}>
                    <View
                      style={[
                        styles.langView,
                        {
                          flexDirection:
                            userUiLang === 0 ? 'row-reverse' : 'row',
                          backgroundColor:
                            selectedId === item.id ? '#22268f' : '#1B1D4D',
                        },
                      ]}>
                      <Image source={item.flag} style={styles.flagImgStyle} />
                      <View style={styles.langBox}>
                        <Text style={styles.langTxt}>{item.lang}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
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

export default ChangeUiLang;

const styles = StyleSheet.create({
  langBox: {width: '80%'},
  langTxt: {
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
  },
  langView: {
    backgroundColor: '#1B1D4D',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    paddingVertical: 20,
  },
  langBtn: {
    // backgroundColor: 'red',
    // backgroundColor:'#1B1D4D',
    // justifyContent:'center',
    // alignItems:'center',
    // paddingHorizontal:20,
    // paddingVertical:10
    // marginLeft: '5%',
    width: '100%',
    marginVertical: 10,
  },
  languagesWrapper: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
  },
  flagImgStyle: {
    width: '10%',
    height: 25,
    marginRight: 20,
    marginLeft: 20,
  },
  modalTitleTxt: {
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
    textTransform: 'uppercase',
  },
  modalTitle: {
    // backgroundColor: 'red',
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
    height: 500,
    margin: 20,
    // backgroundColor: '#27294d',
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
