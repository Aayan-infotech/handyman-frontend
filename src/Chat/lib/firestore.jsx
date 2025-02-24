import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyC_V9Z2fXnrk-AeIqPjj0v8jFOspJ3EggE",
  authDomain: "trade-hunter-4422d.firebaseapp.com",
  projectId: "trade-hunter-4422d",
  storageBucket: "trade-hunter-4422d.firebasestorage.app",
  messagingSenderId: "476249897831",
  appId: "1:476249897831:web:a8ad45ecfa4047ed774dc2",
  measurementId: "G-G8N6W355CL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const realtimeDb = getDatabase(app)
