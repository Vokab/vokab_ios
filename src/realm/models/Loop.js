import {Realm} from '@realm/react';

export class Road extends Realm.Object {
  // constructor(realm, description, userId) {
  //   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  // }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Road',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      screen: 'int',
      wordObj: 'Word',
    },
  };
}

export class Loop extends Realm.Object {
  // constructor(realm, description, userId) {
  //   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  // }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Loop',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      defaultWordsBag: 'Word[]',
      customWordsBag: 'CustomWords[]',
      reviewWordsBag: 'string[]',
      defaultWordsBagRoad: 'string[]',
      customWordsBagRoad: 'string[]',
      reviewWordsBagRoad: 'string[]',
      dailyTestRoad: 'string[]',
      weeklyTestRoad: 'string[]',
      stepOfDefaultWordsBag: 'int',
      stepOfCustomWordsBag: 'int',
      stepOfReviewWordsBag: 'int',
      stepOfDailyTest: 'int',
      stepOfWeeklyTest: 'int',
      isDefaultDiscover: 'int',
      isCustomDiscover: 'int',
    },
  };
}
