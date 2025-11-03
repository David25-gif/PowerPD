import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function DashboardProgresoScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progreso de Rutinas</Text>

      {/* TARJETAS DE PROGRESO */}
      <View style={styles.progressRow}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressValue}>0/800</Text>
          <Text style={styles.progressLabel}>CAL</Text>
        </View>

        <View style={styles.progressCircle}>
          <Text style={styles.progressValue}>0/30</Text>
          <Text style={styles.progressLabel}>MIN</Text>
        </View>

        <View style={styles.progressCircle}>
          <Text style={styles.progressValue}>0/12</Text>
          <Text style={styles.progressLabel}>HRS</Text>
        </View>
      </View>

      {/* CALENDARIO SIMPLE ESTÁTICO */}
      <View style={styles.calendarBox}>
        <Text style={styles.calendarTitle}>Días Completados</Text>
        <Text style={{ textAlign: "center", color: "#aaa" }}>Calendario pronto ✅</Text>
      </View>

      {/* BOTÓN PARA IR AL MENÚ DEL PROGRESO */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Progreso")}
      >
        <Text style={styles.buttonText}>Abrir Panel de Herramientas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f1a",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  progressLabel: {
    fontSize: 14,
    color: "#a78bfa",
  },
  calendarBox: {
    backgroundColor: "#1e1b35",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
