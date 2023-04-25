import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ShadowEffect from '../../assets/shadowImg.png';
import {COLORS_THEME, FONTS, SIZES} from '../constants';
import {RealmContext} from '../realm/models';
import {User} from '../realm/models/User';
import {languages} from '../../languages';
import StoreBg from '../../assets/storeBg.png';
import Premium from '../../assets/premium.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import iap tools & logic
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
import Subs from '../components/screensComponents/inAppPurchase/sub';
import {doc, updateDoc, getDoc} from 'firebase/firestore';
import {db} from '../firebase/utils';

const {useQuery, useObject, useRealm} = RealmContext;

const subsIds = Platform.select({
  ios: ['vokab_plus_1y','vokab_plus_1m'],
});

let purchaseUpdatePurchase;
let purchaseErrorPurchase;

const Store = () => {
  const realm = useRealm();
  const user = useQuery(User);

  const [subscription, setSubscription] = useState([]); //used to store list of subs
  const [products, setProducts] = useState([]);
  let userUiLang = user[0].userUiLang;

  const modifyUserToPremiumUser = async howManyMonths => {
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
    if (user[0].serverId !== ''){
      const userDocRef = doc(db, 'users', user[0].serverId);

      console.log('timestamp =>', timestamp);
      await updateDoc(userDocRef, {
        isPremium: true,
        subscription: {
          endedAt: howManyMonths * 30 * 24 * 60 * 60 * 1000 + timestamp,
          isSubed: true,
          startedAt: timestamp,
          type:
            howManyMonths === 6
              ? '6months'
              : howManyMonths === 1
              ? '1month'
              : howManyMonths === 12
              ? '1year'
              : 'null',
        },
      }).catch(e => {
        console.log('error on update user subscription', e);
      });
    }
 
  };

  useEffect( () => {

    initConnection()
  
      .catch(e => {
        console.log('error connecting to store...', e);
      })
      .then(async (a) => {
        console.log('we are connected ', a);
         setup({storekitMode:'STOREKIT2_MODE'})
            const mySubAre =  await getSubscriptions({skus: subsIds})
            console.log('we found mySubAre =>', mySubAre);
            setSubscription(mySubAre);
      
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
      if (!(error['responseCode'] === '2')) {
        Alert.alert(
          'Error',
          'There has been an error with your purchase, error code' +
            error['code'],
        );
      }
    });
    purchaseUpdatePurchase = purchaseUpdatedListener(purchase => {
      const receipt = purchase.transactionReceipt;
      console.log('we are here in receipt',receipt)
      if (receipt) {
        console.log('our purchase =>', purchase);
          modifyUserToPremiumUser(6);
       if (subsIds.includes(purchase.productId)) {
          finishTransaction({purchase, isConsumable: false})
            .then(async () => {
              console.log('Transaction Finished 238', purchase);
              switch (purchase.productId) {
                case 'vokab_plus_1y':
                  await modifyUserToPremiumUser(12);
                  break;
                case 'vokab_plus_6m':
                  await  modifyUserToPremiumUser(6);
                  break;
                case 'vokab_plus_1m':
                  await  modifyUserToPremiumUser(1);
                  break;
                default:
                  console.log('error in proccessing subscription');
                  break;
              }

              console.log('giveHimSomething(receipt);');
            })
            .catch(e => {
              console.log('Transaction Not Success', e);
            });
        }
      }else{
        console.log('error iap here')
      }
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

  return (
    <ScrollView
      style={{
        flex: 1,
        // width: '100%',
        // height: '100%',
        backgroundColor: '#181920',
      }}>
      <View style={styles.screenWrapper}>
        <Image source={ShadowEffect} style={styles.shadowImageBg} />
        <ImageBackground
          source={StoreBg}
          resizeMode="cover"
          style={styles.image}
          imageStyle={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <View style={styles.storeWrapper}>
            <Image source={Premium} style={styles.premiumImage} />
            <View style={styles.iapBox}>
              <Text style={styles.iapVokab}>Vokab</Text>
              <Text style={styles.iapPlus}>Plus</Text>
            </View>
            <View style={styles.iapParag}>
              <View>
                <Text style={styles.iapParagTxt}>
                 {languages[userUiLang].with_the_most}
                </Text>
              </View>
              <Text style={styles.iapParagTxt}>
              {languages[userUiLang].unlock}{' '}
                <Text style={styles.iapVokabInParagTxt}>Vokab Plus</Text>{' '}
                {languages[userUiLang].feature}
              </Text>
            </View>
            <View style={styles.listFeatures}>
              <View style={[styles.singleFeature,{    flexDirection: userUiLang !== 0 ? 'row' : 'row-reverse',}]}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                {languages[userUiLang].no_ads}
                </Text>
              </View>
                   <View style={[styles.singleFeature,{    flexDirection: userUiLang !== 0 ? 'row' : 'row-reverse',}]}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                {languages[userUiLang].examples}
                </Text>
              </View>
              <View style={[styles.singleFeature,{    flexDirection: userUiLang !== 0 ? 'row' : 'row-reverse',}]}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}> {languages[userUiLang].more}</Text>
              </View>
              <View style={[styles.singleFeature,{    flexDirection: userUiLang !== 0 ? 'row' : 'row-reverse',}]}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                {languages[userUiLang].add}
                </Text>
              </View>
              <View style={[styles.singleFeature,{    flexDirection: userUiLang !== 0 ? 'row' : 'row-reverse',}]}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                {languages[userUiLang].add_ex}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View style={[styles.plansWrapper]}>
          {subscription?.map((mySub, index) =>
          //console.log("my sub is =>",mySub)
            mySub.productId === 'vokab_plus_1y' ? (
              <Subs
                key={index}
                subscriptionOfferDetails={mySub.subscriptionOfferDetails}
                subElement={mySub}
                sku={mySub.productId}
              />
            )  :   mySub.productId === 'vokab_plus_1m' ? (
              <Subs
                key={index}
                subscriptionOfferDetails={mySub.subscriptionOfferDetails}
                subElement={mySub}
                sku={mySub.productId}
              />
            ) 
            :null,
          )}



        </View>
        <View style={styles.cancelTextBox}>
          <Text style={styles.cancelTextTitle}>Renewal Deactivation</Text>
          <Text style={styles.cancelText}>any renewal will be invoiced within 24 hours following the end of the current period you can easily and at any time deactivate the automatic renewal: you will find the option to cancel or modify your subscription in the settings of your store account</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Store;

const styles = StyleSheet.create({
  cancelTextTitle:{
    color:'#ffff',
    fontSize:18,
    fontFamily:FONTS.enFontFamilyMedium,
    marginBottom:10
  },
  cancelText:{
    color:'#ffff',
    fontSize:14,
    
  },
  cancelTextBox:{
    paddingHorizontal:15,
    paddingBottom:10
  },
  absoBoxTxt: {
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyBold,
    color: COLORS_THEME.primary,
  },
  absoBox: {
    width: 80,
    height: 30,
    backgroundColor: COLORS_THEME.bgWhite,
    position: 'absolute',
    top: -10,
    right: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  howMuchTxt: {
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyRegular,
    color: '#fff',
    marginTop: 10,
  },
  planLengthTxt: {
    fontSize: 22,
    fontFamily: FONTS.enFontFamilyBold,
    color: '#fff',
  },
  planBoxScnd: {
    // backgroundColor: 'yellow',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planBoxFst: {
    justifyContent: 'center',
    // alignItems: 'center',
    width: '70%',
    height: '100%',
    // backgroundColor: 'red',
  },
  planSelected: {
    backgroundColor: COLORS_THEME.primary,
  },
  planBox: {
    height: 120,
    width: '95%',
    borderRadius: 15,
    // backgroundColor: 'rgba(255,255,255,.10)',
    backgroundColor: '#2f3049',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  plansWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  singleFeatureTxt: {
    color: COLORS_THEME.textWhite,
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyMedium,
    paddingHorizontal:10
  },
  singleFeature: {

    // justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  listFeatures: {
    width: '100%',
    height: '100%',
    marginTop: 30,
  },
  iapVokabInParagTxt: {
    color: COLORS_THEME.primary,
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  iapParagTxt2: {
    color: COLORS_THEME.textWhite,
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyRegular,
    textAlign: 'center',
  },
  iapParagTxt: {
    color: COLORS_THEME.textWhite,
    fontSize: 16,
    fontFamily: FONTS.enFontFamilyRegular,
    textAlign: 'center',
  },
  iapParag: {
    marginTop: 20,
  },
  iapBox: {
    flexDirection: 'row',
  },
  iapPlus: {
    color: COLORS_THEME.primary,
    fontSize: 26,
    fontFamily: FONTS.enFontFamilyBold,
  },
  iapVokab: {
    color: '#fff',
    fontSize: 26,
    fontFamily: FONTS.enFontFamilyBold,
    marginRight: 10,
  },
  storeWrapper: {
    height: '100%',
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  premiumImage: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  logoutBtn: {},
  logoutBtnTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyRegular,
  },
  logoutBox: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  statsBox: {
    marginTop: 40,
  },
  streakNbrTxt: {
    color: COLORS_THEME.primary,
    fontSize: 25,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakNbrBox: {
    // marginRight: 15,
  },
  languageTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.enFontFamilyRegular,
    textTransform: 'uppercase',
  },
  streakTxtStyle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.enFontFamilyBold,
  },
  streakImgStyle: {
    // width: 30,
    // height: 30,
    // marginRight: 15,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  streakBoxTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakBox: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#242536',
    paddingVertical: 20,
    marginVertical: 5,
  },
  iapBtnTxt: {
    color: '#fff',
    fontSize: 26,
    fontFamily: FONTS.enFontFamilyBold,
  },
  iapBtnProfile: {borderRadius: 30, marginVertical: 10, marginTop: 20},
  iapBtn: {
    width: '90%',
    marginLeft: '5%',
    borderRadius: 30,
  },
  image: {
    padding: 20,
    // borderRadius: 30,
    height: 500,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderBottomLeftRadius: 20,
  },
  screenWrapper: {
    // backgroundColor: 'red',
    flex: 1,
    // width: SIZES.width,
    // height: SIZES.height,
    // marginTop: 20,
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
});
