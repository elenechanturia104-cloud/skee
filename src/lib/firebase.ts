
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDWiRN4HJs-ar5WWMPzfpyRLVZczfy9tGs",
  authDomain: "studio-2979618055-b24d9.firebaseapp.com",
  projectId: "studio-2979618055-b24d9",
  storageBucket: "studio-2979618055-b24d9.firebasestorage.app",
  messagingSenderId: "178325191079",
  appId: "1:178325191079:web:e34c29d2e571dcbc461e82"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
