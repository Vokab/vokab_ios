import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Thunder from '../../assets/thunder.png';
import Level from '../../assets/level.png';
import ShadowEffect from '../../assets/shadowImg.png';
import {COLORS_THEME, FONTS, SIZES} from '../constants';
import ProfileHeader from '../components/screensComponents/profileHeader';
import ProfileCalendar from '../components/screensComponents/calendar';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import IapBg from '../../assets/iap.png';
import Premium from '../../assets/premium.png';
import {RealmContext} from '../realm/models';
import {PassedWords} from '../realm/models/PassedWords';
import {User} from '../realm/models/User';
import {languages} from '../../languages';
import {useNavigation} from '@react-navigation/native';
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  getProducts,
  Product,
  flushFailedPurchasesCachedAsPendingAndroid,
  requestPurchase,
  getPurchaseHistory,
  finishTransaction,
  getSubscriptions,
  getAvailablePurchases,
  endConnection,
  acknowledgePurchaseAndroid,
  setup,
  requestSubscription
} from 'react-native-iap';

const {useQuery, useObject, useRealm} = RealmContext;
const subsIds = Platform.select({
  ios: ['vokab_plus_1y','vokab_plus_1m'],
});

let purchaseUpdatePurchase;
let purchaseErrorPurchase;

const Profile = () => {
  const privacy_url="https://www.privacypolicies.com/live/a7ae8485-7d20-4189-a980-8cb6b4ab06e9";
  const termsofuse_url="https://vokab-privacy.vercel.app/terms-of-use"
  const realm = useRealm();
  const navigation = useNavigation();
  const passedWords = useQuery(PassedWords);
  let levelByPassedWord = (passedWords.length / 1000) * 100;
  const user = useQuery(User);
  const [userStreaks, setUserStreaks] = useState(0);
  let passedDays = user[0].passedDays;
  let userName = user[0].userName;
  let userUiLang = user[0].userUiLang;
  useEffect(() => {
    console.log('passedDays =>', passedDays);
    let streaks = 0;
    if (passedDays.length > 2) {
      let i = 0;
      do {
        if (passedDays[i] + 2 === passedDays[i + 2]) {
          streaks = streaks + 1;
          i += 3;
        } else {
          i = i + 1;
        }
      } while (i < passedDays.length - 3);
      setUserStreaks(streaks);
    }
  }, []);

  const createAcc = () => {
    console.log('createAcc start');
    navigation.navigate('Create');
  };

  useEffect( () => {

    initConnection()
  
      .catch(e => {
        console.log('error connecting to store...', e);
      })
      .then(async (a) => {
        console.log('we are connected ', a);
         setup({storekitMode:'STOREKIT2_MODE'})
            getPurchaseHistory()
              .catch(() => {})
              .then(res => {
                // console.log('getPurchaseHistory =>', res);
                try {
                  const receiptSubs = res[res.length - 1].transactionReceipt;
                  if (receiptSubs) {
                    // giveHimSomething(receiptSubs);
                    console.log('getPurchaseHistory')
                  }
                } catch (error) {}
              });
/*             getAvailablePurchases()
              .catch(e => {
                console.log('getAvailablePurchases error =>', e);
              })
              .then(res => {
                console.log('getAvailablePurchases =>', res);
              }); */
        
      });

    purchaseErrorPurchase = purchaseErrorListener(error => {
  
    });
    purchaseUpdatePurchase = purchaseUpdatedListener(purchase => {

    });

    return () => {
      try {
        purchaseUpdatePurchase.remove();
      } catch (error) {
        console.log('hello var ');
      }
      try {
        purchaseErrorPurchase.remove();
      } catch (error) {}
      try {
        endConnection();
      } catch (error) {}
    };
  }, []);
  const restorePurchaseForThisUser = async () => {
    let howManyMonths = 12;
    console.log(
      'from restorePurchaseForThisUser we need to restore this purchase',
    );
    try {
      const timestamp = new Date().getTime();
      realm.write(() => {
        user[0].isPremium = true;
        user[0].endedAt = howManyMonths * 30 * 24 * 60 * 60 * 1000 + timestamp;
        user[0].startedAt = timestamp;
        user[0].type =
          howManyMonths === 6
            ? '6months'
            : howManyMonths === 1
            ? '1month'
            : '1year';
      });
      Alert.alert("You're all set", 'Your purchase restored successfuly');
    } catch (error) {}
  };


  const restorePurchase = () => {
    console.log('restorePurchase start');
 
try {
  getAvailablePurchases()
  .catch(e => {
    console.log('getAvailablePurchases error =>', e);
  })
  .then(res => {
    console.log('getAvailablePurchases =>', res);
    if (res.length > 0) {
      restorePurchaseForThisUser();
      //Alert.alert('Ok lets restore');
    } else {
      //restorePurchaseForThisUser();
      Alert.alert('Nothing to restore');
    }
  });

} catch (error) {
  console.log('w')
}

  };

  return (
    <ScrollView style={{felx: 1, width: '100%', backgroundColor: '#181920'}}>
      <View style={styles.screenWrapper}>
        <Image source={ShadowEffect} style={styles.shadowImageBg} />
        <ProfileHeader
          screenTitle={`${languages[userUiLang].profile.profile}`}
        />
        {user[0].serverId === '' && (
          <View style={styles.createAccountBox}>
            <Feather name={'user'} size={40} color={'#fff'} />
            <Text style={styles.createAccBtnTxt}>
            {languages[userUiLang].profile.create_to_save}
            </Text>
            <TouchableOpacity
              style={styles.createAccBtn}
              onPress={() => {
                createAcc();
              }}>
              <Text style={styles.createAccBtnInTxt}>{languages[userUiLang].profile.create}</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Vokab Premium Btn */}
        {!user[0].isPremium && (
        <View style={styles.iapBtnProfile}>
          <TouchableOpacity style={styles.iapBtn}    onPress={() => {
                navigation.navigate('Store');
              }}>
            <ImageBackground
              source={IapBg}
              resizeMode="cover"
              style={styles.image}
              imageStyle={{borderRadius: 10}}>
              <Text style={styles.iapBtnTxt}>Vokab Plus</Text>
              <Image source={Premium} style={styles.premiumImage} />
            </ImageBackground>
          </TouchableOpacity>
        </View>)}
        <ProfileCalendar userUiLang={userUiLang} />
        <View style={styles.statsBox}>
          {/* Straks Box */}
          <View style={styles.streakBox}>
            <View style={styles.streakBoxTitle}>
              <Image source={Thunder} style={styles.streakImgStyle} />
              <Text style={styles.streakTxtStyle}>
                {languages[userUiLang].profile.streaks}
              </Text>
            </View>
            <View style={styles.streakNbrBox}>
              <Text style={styles.streakNbrTxt}>{userStreaks}</Text>
            </View>
          </View>
          {/* Words Box */}
          <View style={styles.streakBox}>
            <View style={styles.streakBoxTitle}>
              <Entypo
                name={'open-book'}
                size={25}
                color={COLORS_THEME.primary}
                style={styles.streakImgStyle}
              />
              <Text style={styles.streakTxtStyle}>
                {languages[userUiLang].profile.words}
              </Text>
            </View>
            <View style={styles.streakNbrBox}>
              <Text style={styles.streakNbrTxt}>{passedWords.length}</Text>
            </View>
          </View>
          {/* Level Box */}
          <View style={styles.streakBox}>
            <View style={styles.streakBoxTitle}>
              <Image source={Level} style={styles.streakImgStyle} />
              <Text style={styles.streakTxtStyle}>
                {languages[userUiLang].profile.level}
              </Text>
            </View>
            <View style={styles.streakNbrBox}>
              <View style={[styles.progressBarParent]}>
                <View
                  style={[
                    styles.progressBarChild,
                    {width: `${levelByPassedWord}%`},
                  ]}></View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionsBox}>
        <TouchableOpacity
            style={[styles.actionBtn, styles.borderBtm]}
            onPress={() => {
              restorePurchase();
            }}>
            <Text style={styles.actionBtnTxt}>
              {languages[userUiLang].profile.restore_purchase}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.borderBtm]}
            onPress={() => {
              Linking.openURL(
                'mailto:vokab.app@gmail.com?subject=Vokab Support CC',
              );
            }}>
            <Text style={styles.actionBtnTxt}>
              {languages[userUiLang].profile.contact_us}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.borderBtm]} onPress={()=>{Linking.openURL(privacy_url)}}>
            <Text style={styles.actionBtnTxt}>
              Privacy policy
            </Text>
          </TouchableOpacity> 
        <TouchableOpacity style={[styles.actionBtn]} onPress={()=>{Linking.openURL(termsofuse_url)}} >
            <Text style={styles.actionBtnTxt}>
              Terms of use
            </Text>
          </TouchableOpacity> 
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  createAccBtnInTxt: {
    color: COLORS_THEME.bgWhite,
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 18,
    textAlign: 'center',
  },
  createAccTxt: {
    color: COLORS_THEME.primary,
    fontFamily: FONTS.enFontFamilyBold,
    fontSize: 18,
    textAlign: 'center',
  },
  createAccBtnTxt: {
    color: COLORS_THEME.bgWhite,
    fontFamily: FONTS.enFontFamilyMedium,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  createAccountBox: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS_THEME.bgDark,
  },
  createAccBtn: {
    backgroundColor: COLORS_THEME.primary,
    width: '80%',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: '10%',
    marginTop: 20,
  },
  premiumImage: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 50,
    top: 5,
  },
  iapBtnTxt: {
    color: '#fff',
    fontSize: 24,
    fontFamily: FONTS.enFontFamilyBold,
    marginLeft: '5%',
  },
  iapBtnProfile: {borderRadius: 30, marginVertical: 10, marginTop: 20},
  iapBtn: {
    width: '90%',
    marginLeft: '5%',
    borderRadius: 30,
  },
  image: {
    padding: 20,
    borderRadius: 30,
  },
  borderBtm: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
  },
  actionBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyMedium,
    textTransform: 'uppercase',
  },
  actionBtn: {
    // borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    // borderTopWidth: 1,
  },
  actionsBox: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.009)',
  },
  progressBarChild: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 8,
    backgroundColor: COLORS_THEME.primary,
    borderRadius: 6,
  },
  progressBarParent: {
    position: 'relative',
    width: 100,
    height: 8,
    backgroundColor: '#FFFFFF', // Changed To DarkLight Code
    borderRadius: 6,
  },
  statsBox: {
    marginTop: 40,
  },
  streakNbrBox: {
    marginRight: 15,
  },
  streakNbrTxt: {
    color: COLORS_THEME.primary,
    fontSize: 25,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakBoxTitle: {flexDirection: 'row'},
  streakBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#242536',
    paddingVertical: 20,
    marginVertical: 5,
  },
  streakTxtStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakImgStyle: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  shadowImageBg: {
    width: 400,
    height: 500,
    opacity: 0.15,
    position: 'absolute',
    top: 0,
    left: SIZES.width / 2 - 200,
    // backgroundColor: 'red',
  },
  screenWrapper: {
    backgroundColor: '#181920',
    flex: 1,
    width: '100%',
    // marginTop: 20,
  },
});
