import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzioYfNd0r_R_HhCcHVjUUdssSqCtzADg",
  authDomain: "elbevalley-tom.firebaseapp.com",
  projectId: "elbevalley-tom",
  storageBucket: "elbevalley-tom.firebasestorage.app",
  messagingSenderId: "853615371111",
  appId: "1:853615371111:web:afe1dc3f7ee6401de785c2",
};

// Prevent re-initializing on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
