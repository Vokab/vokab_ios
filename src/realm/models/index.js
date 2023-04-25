import {createRealmContext} from '@realm/react';
import {CustomWords} from './CustomWords';
import {DaysBags} from './DaysBags';
import {Loop, Road} from './Loop';
import {PassedWords} from './PassedWords';
import {TaskV3, TaskV4} from './Task';
import {User} from './User';
import {Word} from './Word';

export const RealmContext = createRealmContext({
  schema: [TaskV4, Word, User, Loop, Road, DaysBags, PassedWords, CustomWords],
  schemaVersion: 46,
});
// TaskRealmContextV2
export const schemas = [TaskV3.schema, TaskV4.schema];
export const schemaVersion = 7;
export const runMigration = () => {
  const realm = new Realm({
    schema: schemas,
    schemaVersion: schemaVersion,
    migration: (oldRealm, newRealm) => {},
  });

  realm.close();
};
