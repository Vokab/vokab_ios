import {Realm} from '@realm/react';

export class Word extends Realm.Object {
  // constructor(realm, description, userId) {
  //   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  // }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'Word',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      wordNativeLang: 'string',
      wordLearnedLang: 'string',
      wordLevel: 'int',
      audioPath: 'string',
      remoteUrl: 'string',
      wordImage: 'string',
      defaultDay: 'int',
      defaultWeek: 'int',
      passed: 'bool',
      passedDate: 'date',
      deleted: 'bool',
      score: 'int',
      viewNbr: 'int',
      prog: 'int',
      wordType: 'int',
      wordDateInMs: 'int',
    },
  };
}
