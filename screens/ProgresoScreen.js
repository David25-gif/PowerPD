import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Importa tus pantallas hijas
import HistorialScreen from "./HistorialScreen";
import GraficaScreen from "./GraficaScreen";
import CalendarioScreen from "./CalendarioScreen";
import CronometroScreen from "./CronometroScreen";

const Tab = createMaterialTopTabNavigator();

export default function ProgresoScreen() {
  return (
    <View style={styles.container}>
      {/* Título superior */}
      <Text style={styles.title}>
        Tu Progreso <Text style={styles.icon}>💪</Text>
      </Text>

      {/* Tabs de navegación */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true, // ✅ permite desplazamiento horizontal
            tabBarIndicatorStyle: { backgroundColor: "#16a34a", height: 3 },
            tabBarLabelStyle: {
              fontSize: 14,
              textTransform: "none",
              color: "white",
            },
            tabBarActiveTintColor: "#16a34a",
            tabBarInactiveTintColor: "#9ca3af",
            tabBarStyle: { backgroundColor: "#0f172a" },
          }}
        >
          <Tab.Screen
            name="Historial"
            component={HistorialScreen}
            options={{ title: "Historial" }}
          />
          <Tab.Screen
            name="Grafica"
            component={GraficaScreen}
            options={{ title: "Gráfica" }}
          />
          <Tab.Screen
            name="Calendario"
            component={CalendarioScreen}
            options={{ title: "Calendario" }}
          />
          <Tab.Screen
            name="Cronometro"
            component={CronometroScreen}
            options={{ title: "Cronómetro" }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

// 💅 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Fondo oscuro
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16a34a",
    textAlign: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 22,
  },
});
