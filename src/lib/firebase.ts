import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // 🔥 IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyBazdTjYJfGZ05tJpV8DHAs8_tIZXnHTXw",
  authDomain: "noiserpchoque.firebaseapp.com",
  databaseURL: "https://noiserpchoque-default-rtdb.firebaseio.com",
  projectId: "noiserpchoque",
  storageBucket: "noiserpchoque.firebasestorage.app",
  messagingSenderId: "938849680506",
  appId: "1:938849680506:web:5cbef0f9ac64c88b144fc3"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app); // 🔐 necessário pro login
