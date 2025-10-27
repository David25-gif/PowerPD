// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚙️ Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1EmYNCYuEanjP7N4zI2coY25Em54uA8k",
  authDomain: "powerpd.firebaseapp.com",
  projectId: "powerpd",
  // ❌ Cambia esta línea ↓
  storageBucket: "powerpd.appspot.com", // ✅ Esta es la forma correcta
  messagingSenderId: "163160749521",
  appId: "1:163160749521:web:916173501f6f867d581cf0",
  measurementId: "G-CJM66TGPY2",
};

// 🚀 Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Exporta los servicios que usarás
export const auth = getAuth(app); // Autenticación
export const db = getFirestore(app); // Base de datos (Firestore)
