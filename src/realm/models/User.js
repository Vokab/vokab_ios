import {Realm} from '@realm/react';

export class User extends Realm.Object {
  // constructor(realm, description, userId) {
  //   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  // }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      serverId: 'string',
      userName: 'string',
      userUiLang: 'int',
      userNativeLang: 'int',
      userLearnedLang: 'int',
      userLevel: 'int',
      startDate: 'date',
      currentDate: 'int', // we will use day+month+year to define the current date
      passedWordsIds: 'string[]',
      deletedWordsIds: 'string[]',
      currentWeek: 'int',
      currentDay: 'int',
      isPremium: 'bool',
      endedAt: 'int',
      startedAt: 'int',
      type: 'string',
      passedDays: 'int[]', // This is used to get the streaks for the profile page // it is an array of integer which each value of day calculated like this : day+month+year
      notifToken: 'string',
      wordsDate: 'int',
    },
  };
}
