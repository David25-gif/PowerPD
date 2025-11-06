import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// 🔹 Importa solo las pantallas que tienes
import RutinasScreen from "../screens/RutinasScreen";
import HistorialScreen from "../screens/HistorialScreen";
import PerfilScreen from "../screens/PerfilScreen";
import ProgresoScreen from "../screens/ProgresoScreen"; // (puede ser tu "inicio" si quieres)

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0A1520",
          borderTopColor: "#14212E",
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Progreso") iconName = "home";
          else if (route.name === "Rutinas") iconName = "barbell";
          else if (route.name === "Historial") iconName = "time";
          else if (route.name === "Perfil") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Puedes cambiar “Progreso” por otra pantalla si quieres que sea la principal */}
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Historial" component={HistorialScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
