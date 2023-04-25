import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabScreen from './src/screens/TabScreen';
import LoopManager from './src/screens/Loop';
import Settings from './src/screens/Settings';
import BeforeSplash from './src/screens/startingScreens/BeforeSp';
import NativeLang from './src/screens/startingScreens/NativeLang';
import LearnedLang from './src/screens/startingScreens/LearnedLang';
import Register from './src/screens/startingScreens/Register';
import LangLevel from './src/screens/startingScreens/LangLevel';
import Login from './src/screens/startingScreens/Login';
import {RealmContext} from './src/realm/models';
import {User} from './src/realm/models/User';
import NeedUpdate from './src/screens/NeedUpdate';
import Create from './src/screens/startingScreens/Create';
import Congratulation from './src/components/loopComponents/congratulation';



const {useQuery, useRealm} = RealmContext;

const Stack = createStackNavigator();
const App = ({isUpdated}) => {
  const users = useQuery(User);


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name="Home" component={Discover} /> */}
        {isUpdated ? (
          users.length === 0 ? (
            <>
              <Stack.Screen name="BeforeSplash" component={BeforeSplash} />
              <Stack.Screen name="NativeLang" component={NativeLang} />
              <Stack.Screen name="LearnedLang" component={LearnedLang} />
              <Stack.Screen name="LangLevel" component={LangLevel} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Login" component={Login} />
            </>
          ) : (
            <>
              <Stack.Screen name="TabScreen" component={TabScreen} />
              <Stack.Screen name="Loop" component={LoopManager} />
              <Stack.Screen name="settings" component={Settings} />
              <Stack.Screen name="Create" component={Create} />
              <Stack.Screen name="Congratulation" component={Congratulation} />
            </>
          )
        ) : (
          <Stack.Screen name="NeedUpdate" component={NeedUpdate} />
        )}
      </Stack.Navigator>
      {/* <Discover /> */}
      {/* <Writing /> */}
      {/* <Cards /> */}
      {/* <Matching /> */}
      {/* <FindIt /> */}
      {/* <PlaceHolderComp /> */}
      {/* <MissedChar /> */}
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({});

export default App;
