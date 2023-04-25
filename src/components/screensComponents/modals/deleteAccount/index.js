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
  import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
  import {User} from '../../../../realm/models/User';
  import {RealmContext} from '../../../../realm/models';
  import {languages} from '../../../../../languages';
  import {useNavigation} from '@react-navigation/native';
  import {doc, deleteDoc} from 'firebase/firestore';
  import {db} from '../../../../firebase/utils';
  import {getAuth, deleteUser} from 'firebase/auth';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  
  const {useQuery, useObject, useRealm} = RealmContext;
  
  const DeleteAccount = props => {
    const realm = useRealm();
    const user = useQuery(User);
    const navigation = useNavigation();
    let userUiLang = user[0].userUiLang;
    const {accountModalVisible, setAccountModalVisible} = props;
    const [text, onChangeText] = React.useState(user[0].userName);
    const confirmChange = async () => {
      console.log('confirmChange');
      try {
        if (user[0].serverId !== '') {
          try {
            const auth = getAuth();
            const user = auth.currentUser;
  
            deleteUser(user)
              .then(() => {
                // User deleted.
                console.log('user deleted from auth');
              })
              .catch(error => {
                // An error ocurred
                // ...
                console.log('An error ocurred when user deleted from auth');
              });
          } catch (error) {
            console.log('An error ocurred when user deleted from auth');
          }
          try {
            await deleteDoc(doc(db, 'users', user[0].serverId));
          } catch (error) {
            console.log('firebase delete error L37');
          }
        }
        realm.write(() => {
          // Delete the task from the realm.
          realm.deleteAll();
        });
      } catch (error) {
        console.log('error while deleting =>', error);
      }
      // navigation.navigate('BeforeSplash');
    };
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={accountModalVisible}
        onRequestClose={() => {
          setAccountModalVisible(!accountModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  setAccountModalVisible(!accountModalVisible);
                }}>
                <AntDesign name="closecircle" size={20} color={'#fff'} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.listOfWord}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                width: '100%',
                paddingHorizontal: 20,
              }}>
              <Text style={styles.confirmDeleteTxt}>
                {languages[userUiLang].settings.delete_account_msg}
              </Text>
            </ScrollView>
            <View style={styles.btnsWrapper}>
              <TouchableOpacity
                style={styles.confirmBtnStyle}
                onPress={confirmChange}>
                <Text style={styles.confirmBtnTxtStyle}>
                  {languages[userUiLang].settings.delete_account}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  export default DeleteAccount;
  
  const styles = StyleSheet.create({
    confirmDeleteTxt: {
      color: '#fff',
      fontSize: 16,
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
  