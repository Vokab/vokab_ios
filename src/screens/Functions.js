import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RealmContext} from '../realm/models';
import {doc, getDoc, setDoc, collection} from 'firebase/firestore';
import {storage, db} from '../firebase/utils';

import {DaysBags} from '../realm/models/DaysBags';
import {PassedWords} from '../realm/models/PassedWords';
import {User} from '../realm/models/User';
import {Word} from '../realm/models/Word';
import {Loop} from '../realm/models/Loop';

const {useQuery, useRealm} = RealmContext;
const Functions = () => {
  const realm = useRealm();
  const loop = useQuery(Loop);
  const user = useQuery(User);
  const daysBags = useQuery(DaysBags);
  const passedWords = useQuery(PassedWords);
  const words = useQuery(Word).sorted('_id');

  const addNewDaysBagsToServer = async userId => {
    daysBags
      .filtered(`createDate == ${user[0].currentDate}`)
      .forEach(async item => {
        console.log('new DayBag =>', item);
        const obj = {};
        obj.myId = item._id.toString();
        obj.day = item.day;
        obj.week = item.week;
        obj.step = item.step;
        obj.words = item.words;
        obj.createdAt = item.createdAt;
        console.log('my obj is =>', obj);

        // Add a new document in collection "cities"
        const docRef = doc(db, 'users', userId, 'daysBags', obj.myId);
        setDoc(docRef, obj);
      });
  };
  return <View></View>;
};

export default Functions;

const styles = StyleSheet.create({});
