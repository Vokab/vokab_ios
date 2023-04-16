import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  Platform,
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
} from 'react-native-iap';
import Subs from '../components/screensComponents/inAppPurchase/sub';

const {useQuery, useObject, useRealm} = RealmContext;

const subsIds = Platform.select({
  ios: ['vokab_year', 'vokab_monthly'],
  android: ['vokab_year', 'vokab_monthly'],
});

let purchaseUpdatePurchase;
let purchaseErrorPurchase;

const Store = () => {
  const user = useQuery(User);
  const [subscription, setSubscription] = useState([]); //used to store list of subs
  const [products, setProducts] = useState([]);
  let userUiLang = user[0].userUiLang;

  useEffect(() => {
    initConnection()
      .catch(e => {
        console.log('error connecting to store...', e);
      })
      .then(a => {
        console.log('we are connected ', a);
        flushFailedPurchasesCachedAsPendingAndroid()
          .catch(() => {
            // exception can happen here if:
            // - there are pending purchases that are still pending (we can't consume a pending purchase)
            // in any case, you might not want to do anything special with the error
          })
          .then(() => {
            // Products
            // getProducts({skus: productsIds})
            //   .catch(() => {
            //     console.log('error finding items');
            //   })
            //   .then(res => {
            //     // console.log('we found items', res);
            //     setProducts(res);
            //   });
            getSubscriptions({skus: subsIds})
              .then(res => {
                console.log('we found subss =>', res);
                setSubscription(res);
              })
              .catch(() => {
                console.log('error finding subs');
              });
            getPurchaseHistory()
              .catch(() => {})
              .then(res => {
                // console.log('getPurchaseHistory =>', res);
                try {
                  const receiptSubs = res[res.length - 1].transactionReceipt;
                  if (receiptSubs) {
                    // giveHimSomething(receiptSubs);
                  }
                } catch (error) {}
              });
            getAvailablePurchases()
              .catch(e => {
                console.log('getAvailablePurchases error =>', e);
              })
              .then(res => {
                console.log('getAvailablePurchases =>', res);
              });
          });
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
      if (receipt) {
        console.log('our purchase =>', purchase);
        if (productsIds.includes(purchase.productId)) {
          finishTransaction({purchase, isConsumable: true})
            .then(() => {
              switch (purchase.productId) {
                case 'sidegame_android_coins_199':
                  console.log('sidegame_android_coins_199', user.uid);
                  dispatch(updateAddUserCoins(user.uid, 1200));
                  break;
                case 'sidegame_android_coins_799':
                  console.log('sidegame_android_coins_799', user.uid);
                  dispatch(updateAddUserCoins(user.uid, 3000));
                  break;
                case 'sidegame_android_coins_999':
                  console.log('sidegame_android_coins_999', user.uid);
                  dispatch(updateAddUserCoins(user.uid, 6500));
                  break;
                default:
                  console.log('error in proccessing subscription');
                  break;
              }
              console.log('Transaction Finished');
            })
            .catch(e => {
              console.log('Transaction Not Success', e);
            });
        } else if (subsIds.includes(purchase.productId)) {
          finishTransaction({purchase, isConsumable: false})
            .then(() => {
              console.log('Transaction Finished 238', purchase);
              switch (purchase.productId) {
                case 'sidegame_android_sub_399_1m':
                  modifyUserToPremiumUser(1);
                  break;
                case 'sidegame_android_sub_1499_6m':
                  modifyUserToPremiumUser(6);
                  break;
                case 'sidegame_android_sub_2399_1y':
                  modifyUserToPremiumUser(12);
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
                  With the most practical and fun way to learn and memorize new
                  words ,
                </Text>
              </View>
              <Text style={styles.iapParagTxt}>
                unlock all{' '}
                <Text style={styles.iapVokabInParagTxt}>Vokab Plus</Text>{' '}
                features
              </Text>
            </View>
            <View style={styles.listFeatures}>
              <View style={styles.singleFeature}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                  No ads, Nothing will stop you
                </Text>
              </View>
              <View style={styles.singleFeature}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                  Examples of use-case with each word
                </Text>
              </View>
              <View style={styles.singleFeature}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>More Training modes</Text>
              </View>
              <View style={styles.singleFeature}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                  Adding images to custom words
                </Text>
              </View>
              <View style={styles.singleFeature}>
                <View style={styles.iconCircle}>
                  <FontAwesome
                    name={'check'}
                    size={16}
                    color={COLORS_THEME.bgDark}
                    style={styles.streakImgStyle}
                  />
                </View>
                <Text style={styles.singleFeatureTxt}>
                  Adding examples to custom words
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View style={[styles.plansWrapper]}>
          {subscription?.map((mySub, index) =>
            mySub.productId === 'vokab_year' ? (
              <Subs
                key={index}
                subscriptionOfferDetails={mySub.subscriptionOfferDetails}
                subElement={mySub}
                sku={mySub.productId}
                period={'Yearly'}
                price={'$ 3.99'}
              />
            ) : null,
          )}
          {/* <Subs /> */}
          {/* <View style={[styles.planBox, styles.planSelected]}>
            <View style={styles.absoBox}>
              <Text style={styles.absoBoxTxt}>save 60%</Text>
            </View>
            <View style={styles.planBoxFst}>
              <Text style={styles.planLengthTxt}>1 year plan</Text>
              <Text style={styles.howMuchTxt}>$48 billed every year</Text>
            </View>
            <View style={styles.planBoxScnd}>
              <Text style={styles.planLengthTxt}>4 /mo</Text>
            </View>
          </View> */}

          <View style={[styles.planBox]}>
            <View style={styles.planBoxFst}>
              <Text style={styles.planLengthTxt}>Unlimited Plan</Text>
              <Text style={styles.howMuchTxt}>$120 billed every year</Text>
            </View>
            {/* <View style={styles.planBoxScnd}>
              <Text style={styles.planLengthTxt}>4 /mo</Text>
            </View> */}
          </View>

          <View style={styles.planBox}>
            <View style={styles.planBoxFst}>
              <Text style={styles.planLengthTxt}>Monthly Plan</Text>
              {/* <Text style={styles.howMuchTxt}>$48 billed every year</Text> */}
            </View>
            <View style={styles.planBoxScnd}>
              <Text style={styles.planLengthTxt}>12 /mo</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Store;

const styles = StyleSheet.create({
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
  },
  singleFeature: {
    flexDirection: 'row',
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
