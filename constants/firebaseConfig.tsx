// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCCDSmDiEVQ36tG5JTzgQFzzVg-hyTgUqU',
  authDomain: 'myapp-dfc1a.firebaseapp.com',
  projectId: 'myapp-dfc1a',
  storageBucket: 'myapp-dfc1a.appspot.com',
  messagingSenderId: '343386610937',
  appId: '1:343386610937:web:14141262af176be0121628',
  measurementId: 'G-BDQX0TTK80',
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
