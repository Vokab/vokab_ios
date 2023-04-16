import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Custom from './Custom';
import Review2 from './Review2';
import Review from './Review';
import {Image, StyleSheet, View} from 'react-native';
import {FONTS, icons} from '../constants';
import {COLORS_THEME} from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import Test from './Test';
import CustomScreen from './CustomScreen';
import Dev from './Dev';
import Rehide from '../components/loopComponents/rehide';
import SingleImg from '../components/loopComponents/singleImg';
import Writing from '../components/loopComponents/writing';
import Cards from '../components/loopComponents/cards';
import PlaceHolderComp from '../components/loopComponents/placeholder';
import MissedChar from '../components/loopComponents/missedChar';
import FindIt from '../components/loopComponents/findit/index';
import CardsImg from '../components/loopComponents/cardsImg';
import ReType from '../components/loopComponents/retype';
import Hearing from '../components/loopComponents/hearing';
import Initialize from './Initialize';
import Matching from '../components/loopComponents/matching';
import Profile from './Profile';
import BeforeSplash from './startingScreens/BeforeSp';
import NativeLang from './startingScreens/NativeLang';
import LearnedLang from './startingScreens/LearnedLang';
import LangLevel from './startingScreens/LangLevel';
import Register from './startingScreens/Register';
import Login from './startingScreens/Login';
import {RealmContext} from '../realm/models';
import {User} from '../realm/models/User';
import {languages} from '../../languages';
import Store from './Store';
const Tab = createBottomTabNavigator();
const {useQuery, useRealm} = RealmContext;
const TabScreen = () => {
  const darkTheme = true;
  const user = useQuery(User);
  let userUiLang = user[0].userUiLang;
  return (
    <Tab.Navigator
      // barStyle={{}}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarIndicatorStyle: {
          position: 'absolute',
          top: 0,
          height: 20,
          width: '100%',
          backgroundColor: COLORS_THEME.secondary,
        },
        tabBarActiveTintColor: '#f5610a',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: FONTS.enFontFamilyBold,
          // margin: 0,
          // padding: 0,
          paddingBottom: 5,
          // backgroundColor: 'red',
          textTransform: 'capitalize',
        },
        tabBarStyle: [
          {
            display: 'flex',
            paddingTop: 4,
            height: 60,
            zIndex: 100,
            backgroundColor: COLORS_THEME.textDark,
            borderTopWidth: 2,
            borderTopColor: '#2b2c55',
          },
          null,
        ],
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          // tabBarStyle: {display: 'none'},
          tabBarLabel: `${languages[userUiLang].home.today}`,
          tabBarIcon: ({focused}) => (
            <View style={focused ? styles.shadow_o : styles.shadow_w}>
              <AntDesign
                name={'home'}
                size={22}
                color={focused ? COLORS_THEME.primary : '#fff'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={CustomScreen}
        options={{
          tabBarLabel: `${languages[userUiLang].home.add}`,
          tabBarIcon: ({focused}) => (
            <View style={focused ? styles.shadow_o : styles.shadow_w}>
              <Entypo
                name={'add-to-list'}
                size={22}
                color={focused ? COLORS_THEME.primary : '#fff'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Review"
        component={Review}
        options={{
          tabBarLabel: `${languages[userUiLang].home.review}`,
          tabBarIcon: ({focused}) => (
            <View style={focused ? styles.shadow_o : styles.shadow_w}>
              <MaterialCommunityIcons
                name={'dumbbell'}
                size={22}
                color={focused ? COLORS_THEME.primary : '#fff'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: `${languages[userUiLang].home.profile}`,
          tabBarIcon: ({focused}) => (
            <View style={focused ? styles.shadow_o : styles.shadow_w}>
              <Feather
                name={'user'}
                size={22}
                color={focused ? COLORS_THEME.primary : '#fff'}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Store"
        component={Test}
        options={{
          // tabBarStyle: {display: 'none'},
          tabBarLabel: `${languages[userUiLang].home.premium}`,
          tabBarIcon: ({focused}) => (
            <View style={focused ? styles.shadow_o : styles.shadow_w}>
              <SimpleLineIcons
                name={'diamond'}
                size={22}
                color={focused ? COLORS_THEME.primary : '#fff'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 25,
    height: 25,
  },
  shadow_w: {
    shadowColor: '#b8e1fd',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0,
    shadowRadius: 16,
    elevation: 4,
  },
  shadow_o: {
    shadowColor: '#f78a0b',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0,
    shadowRadius: 16,
    elevation: 4,
  },
});

export default TabScreen;
