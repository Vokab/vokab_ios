import {Realm} from '@realm/react';

export class CustomWords extends Realm.Object {
  // constructor(realm, description, userId) {
  //   super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  // }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'CustomWords',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      wordNativeLang: 'string',
      wordLearnedLang: 'string',
      wordLearnedExample: 'string',
      exampleWordIndex: 'int',
      localImagePath: 'string',
      wordImage: 'string',
      passed: 'bool',
      passedDate: 'date',
      deleted: 'bool',
      wordType: 'int',
    },
  };
}
