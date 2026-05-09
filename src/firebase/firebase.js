import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOIa6W_gMxNFvhHETMldHV-FX_jLk0pPM",
  authDomain: "streamflix-61883.firebaseapp.com",
  projectId: "streamflix-61883",
  storageBucket: "streamflix-61883.firebasestorage.app",
  messagingSenderId: "148028904308",
  appId: "1:148028904308:web:96d7634f67c72412f15221",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);