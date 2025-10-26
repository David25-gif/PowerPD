import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function RutinasScreen() {
  const rutinas = [
    { id: "1", nombre: "Rutina de Brazos Intensa", duracion: "30 min", nivel: "Intermedio" },
    { id: "2", nombre: "Yoga para Flexibilidad", duracion: "60 min", nivel: "Avanzado" },
    { id: "3", nombre: "Full Body Express", duracion: "20 min", nivel: "Principiante" },
  ];

  const renderRutina = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardText}>
        Duración: {item.duracion} | Nivel: {item.nivel}
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver Rutina</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutinas Disponibles 🏋️</Text>
      <FlatList
        data={rutinas}
        renderItem={renderRutina}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#1f2937" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#16a34a",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  cardText: { color: "#6b7280", marginBottom: 12 },
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
