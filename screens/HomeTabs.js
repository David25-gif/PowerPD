import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Pantallas principales
import RutinasScreen from "./RutinasScreen";
import DesafiosScreen from "../screens/DesafiosScreen";
import PerfilScreen from "./PerfilScreen";
import ProgresoScreen from "./ProgresoScreen";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111827",
          borderTopWidth: 0,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Rutinas") iconName = "barbell";
          else if (route.name === "Desafios") iconName = "trophy";
          else if (route.name === "Progreso") iconName = "stats-chart";
          else if (route.name === "Perfil") iconName = "person-circle";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Desafios" component={DesafiosScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
