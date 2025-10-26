// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración ya existente
const firebaseConfig = {
  apiKey: "AIzaSyA1EmYNCYuEanjP7N4zI2coY25Em54uA8k",
  authDomain: "powerpd.firebaseapp.com",
  projectId: "powerpd",
  storageBucket: "powerpd.firebasestorage.app",
  messagingSenderId: "163160749521",
  appId: "1:163160749521:web:916173501f6f867d581cf0",
  measurementId: "G-CJM66TGPY2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta servicios que usarás
export const auth = getAuth(app); // Para login/registro
export const db = getFirestore(app); // Para rutinas
