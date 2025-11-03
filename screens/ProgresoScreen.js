import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgresoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Progreso 💪</Text>


      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Calendario")}>
        <Ionicons name="calendar" size={40} color="#fff" />
        <Text style={styles.cardText}>Calendario de Entrenamiento</Text>
      </TouchableOpacity>

   
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Grafica")}>
        <Ionicons name="stats-chart" size={40} color="#fff" />
        <Text style={styles.cardText}>Gráfica de Progreso</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Cronometro")}>
        <Ionicons name="timer" size={40} color="#fff" />
        <Text style={styles.cardText}>Cronómetro</Text>
      </TouchableOpacity>

   
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Historial")}>
        <Ionicons name="journal" size={40} color="#fff" />
        <Text style={styles.cardText}>Historial de Rutinas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
