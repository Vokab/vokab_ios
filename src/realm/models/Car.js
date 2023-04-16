import {Realm} from '@realm/react';
import {createRealmContext} from '@realm/react';
const Car = {
  name: 'Car',
  properties: {
    _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
    make: 'string',
    model: 'string',
    miles: 'int?',
  },
  primaryKey: '_id',
};

export const carContext = createRealmContext({
  schema: [Car],
});
