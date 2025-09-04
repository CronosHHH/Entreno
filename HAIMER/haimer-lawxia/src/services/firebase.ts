import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBmEb1Kn9OnhcTE-90nTBD0Jld3J-M4kcM",
  authDomain: "haimer-41e06.firebaseapp.com",
  projectId: "haimer-41e06",
  storageBucket: "haimer-41e06.firebasestorage.app",
  messagingSenderId: "681813870021",
  appId: "1:681813870021:web:99725ea3406e871e9577ac",
  measurementId: "G-87NF0SGBL0"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined;

export { app, auth, db, analytics }; 