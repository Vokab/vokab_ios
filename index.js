/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React, {useState, useEffect, useRef} from 'react';
import {
  AppRegistry,
  SafeAreaView,
  StatusBar,
  Text,
  Dimensions,
  Alert,
  BackHandler,
  View,
} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store, {persistor} from './src/redux/createStore';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {runMigration, RealmContext} from './src/realm/models';
import mobileAds from 'react-native-google-mobile-ads';

import {useNetInfo} from '@react-native-community/netinfo';
import NoInternet from './src/components/screensComponents/noInternet';
import {doc, getDoc} from 'firebase/firestore';
import {db} from './src/firebase/utils';
import {VERSION_IN_DANGER} from './settings.config';

const {RealmProvider, useQuery} = RealmContext;

const RNapp = () => {
  const [isUpdated, setIsUpdated] = useState(true);
  const netInfo = useNetInfo();
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Initialization complete!  ', adapterStatuses);
      });
  }, []);

  const checkIfVersionInDanger = async () => {
    const docRef = doc(db, 'updates', 'danger');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (VERSION_IN_DANGER === docSnap.data().version) {
        console.log('Yes We Are Good');
      } else {
        console.log(
          'No We Need To Update',
          docSnap.data().version,
          VERSION_IN_DANGER,
        );
        setIsUpdated(false);
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
    }
  };
  useEffect(() => {
    console.log('netInfo =>', netInfo);
  }, [netInfo]);
  useEffect(() => {
    checkIfVersionInDanger();
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar
            animated={true}
            backgroundColor="#fff"
            barStyle={'dark-content'}
            showHideTransition={'slide'}
            hidden={true}
          />
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <RealmProvider>
                {netInfo.isInternetReachable === null ||
                netInfo.isInternetReachable ? (
                  isUpdated ? (
                    <App isUpdated={isUpdated} />
                  ) : (
                    <App isUpdated={isUpdated} />
                  )
                ) : (
                  <NoInternet />
                )}
              </RealmProvider>
            </PersistGate>
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
};
// runMigration();
AppRegistry.registerComponent(appName, () => RNapp);
