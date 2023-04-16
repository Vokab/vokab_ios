import {Realm} from '@realm/react';
import {createRealmContext} from '@realm/react';
export class TaskV3 extends Realm.Object {
  constructor(realm, description, userId) {
    super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'TaskV3',
    // primaryKey: '_id',
    properties: {
      //   _id: {type: 'objectId'},
      description: 'string',
      isComplete: {type: 'bool', default: false},
      createdAt: {type: 'date', default: () => new Date()},
      userId: 'string',
    },
  };
}

export class TaskV4 extends Realm.Object {
  constructor(realm, description, userId) {
    super(realm, {description, userId: userId || '_SYNC_DISABLED_'});
  }

  // To use a class as a Realm object type in JS, define the object schema on the static property "schema".
  static schema = {
    name: 'TaskV4',
    // primaryKey: '_id',
    properties: {
      //   _id: {type: 'objectId'},
      description: 'string',
      isComplete: {type: 'bool', default: false},
      createdAt: {type: 'date'},
      userId: 'string',
    },
  };
}
