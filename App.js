import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistroScreen from "./screens/RegistroScreen";
import GenderScreen from "./screens/GenderScreen";
import EdadPesoScreen from "./screens/EdadPesoScreen";

import RutinasScreen from "./screens/RutinasScreen";
import DesafiosScreen from "./screens/DesafiosScreen";
import AlertasScreen from "./screens/AlertasScreen";
import PerfilScreen from "./screens/PerfilScreen";
import Navbar from "./screens/Navbar";

const Stack = createStackNavigator();
const GREEN = "#16a34a";

// Home con Navbar
function HomeTabs() {
  const [activeTab, setActiveTab] = useState("rutinas");

  const renderScreen = () => {
    switch (activeTab) {
      case "desafios":
        return <DesafiosScreen />;
      case "alertas":
        return <AlertasScreen />;
      case "perfil":
        return <PerfilScreen />;
      default:
        return <RutinasScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} color={GREEN} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
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
          name="Home"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
});
