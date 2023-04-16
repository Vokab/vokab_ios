import {Realm} from '@realm/react';

export class PassedWords extends Realm.Object {
  // constructor(realm, description, userId) {
  //   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  // }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'PassedWords',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      score: 'int',
      viewNbr: 'int',
      prog: 'int',
      wordType: 'int',
      dayPlusWeekPassedAt: 'int',
      createDate: 'int', // we will use day+month+year to define the custom createDate date
    },
  };
}
