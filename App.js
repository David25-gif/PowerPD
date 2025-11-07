import React, { useState, createContext, useEffect } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig"; // 👈 importa Firebase

import RutinasScreen from "./screens/RutinasScreen";
import EjerciciosScreen from "./screens/EjerciciosScreen";
import ObjetivoScreen from "./screens/ObjetivoScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistroScreen from "./screens/RegistroScreen";
import GenderScreen from "./screens/GenderScreen";
import EdadPesoScreen from "./screens/EdadPesoScreen";
import HomeTabs from "./screens/HomeTabs";
import PerfilScreen from './screens/PerfilScreen';



export const UserContext = createContext();

const Stack = createStackNavigator();
const GREEN = "#16a34a";



export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // ✅ Cargar datos del usuario cuando inicia sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  // 📥 Obtener datos del usuario desde Firestore
  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Si no existe, crea uno nuevo
        const defaultData = {
          nombre: "Usuario Fitness",
          nivel: "Intermedio",
          genero: "Hombre",
          edad: 25,
          altura: 175,
          peso: 70,
          objetivo: "Tonificar",
          notificacionesActivas: true,
        };
        await setDoc(userRef, defaultData);
        setUserData(defaultData);
      }
    } catch (error) {
      console.error("❌ Error al cargar datos del usuario:", error);
    }
  };

  // 💾 Guardar cambios en Firestore
  const updateUserData = async (newData) => {
    try {
      if (!user?.uid) return;
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, newData);
      setUserData((prev) => ({ ...prev, ...newData }));
      console.log("✅ Datos actualizados en Firestore:", newData);
    } catch (error) {
      console.error("❌ Error al actualizar datos:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Iniciar Sesión" }}
          />
          <Stack.Screen
            name="Registro"
            component={RegistroScreen}
            options={{ title: "Registro" }}
          />
          <Stack.Screen
            name="Genero"
            component={GenderScreen}
            options={{ title: "Selecciona tu género" }}
          />
          <Stack.Screen
            name="EdadPesoScreen"
            component={EdadPesoScreen}
            options={{ title: "Completa tu perfil" }}
          />

          <Stack.Screen
           name="ObjetivoScreen"
           component={ObjetivoScreen}
           options={{ title: "Tu objetivo" }}
          />
          
          <Stack.Screen
           name="RutinasScreen"
           component={RutinasScreen}
           options={{ title: "Rutinas" }}
          />
          <Stack.Screen
           name="EjerciciosScreen"
           component={EjerciciosScreen}
           options={{ title: "Ejercicios" }}
          />
        
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
});
