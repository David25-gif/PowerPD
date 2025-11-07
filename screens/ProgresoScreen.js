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
      {/* 1. Título superior: Color VERDE */}
      <Text style={styles.title}>
        Tu Progreso <Text style={styles.icon}>💪</Text>
      </Text>

      {/* Tabs de navegación */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true, 
            
            // 2. INDICADOR ACTIVO: CAMBIO A CELESTE/AZUL
            tabBarIndicatorStyle: { 
                backgroundColor: "#00D0FF", // 🔵 CELESTE
                height: 3 
            },
            tabBarLabelStyle: {
              fontSize: 14,
              textTransform: "none",
              // El texto inactivo puede seguir siendo blanco/gris
              color: "white", 
            },
            
            // 2. TEXTO DE PESTAÑA ACTIVA: CAMBIO A CELESTE/AZUL
            tabBarActiveTintColor: "#00D0FF", // 🔵 CELESTE para el texto activo
            
            tabBarInactiveTintColor: "#9ca3af", // Texto inactivo gris
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
  // 1. Título superior: CAMBIO A VERDE
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#22C55E", // 🟢 VERDE
    textAlign: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 22,
  },
});