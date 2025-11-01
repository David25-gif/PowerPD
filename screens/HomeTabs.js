// screens/HomeTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importa tus pantallas
import RutinasScreen from "./RutinasScreen";
import DesafiosScreen from "./DesafiosScreen";
import PerfilScreen from "./PerfilScreen";

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
          else if (route.name === "Desafíos") iconName = "trophy";
          else if (route.name === "Perfil") iconName = "person-circle";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Desafíos" component={DesafiosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
