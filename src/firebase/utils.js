import {initializeApp, getApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import {initializeFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAMzthd2CJxsdAgW77WOaLS8wMkAb0yS_4',
  authDomain: 'vokab-52dd5.firebaseapp.com',
  projectId: 'vokab-52dd5',
  storageBucket: 'vokab-52dd5.appspot.com',
  messagingSenderId: '28933578874',
  appId: '1:28933578874:web:4e757e4521a10527761bc3',
  measurementId: 'G-87BGTC9YXK',
};
initializeApp(firebaseConfig);

const app = getApp();
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const storage = getStorage(app);

export {app, auth, storage, db};
