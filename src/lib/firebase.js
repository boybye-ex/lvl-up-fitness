import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDz1vLUN1SwJBl5h-mDy8_Q4nw5Lgjq6oM",
  authDomain: "lvl-up-fitness-37e87.firebaseapp.com",
  projectId: "lvl-up-fitness-37e87",
  storageBucket: "lvl-up-fitness-37e87.firebasestorage.app",
  messagingSenderId: "481638564150",
  appId: "1:481638564150:web:d815a4e231773c28437397",
  measurementId: "G-JV89JFN9CB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
