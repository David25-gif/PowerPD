// screens/CalendarioScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CalendarioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario 📅</Text>
      <Text style={styles.subtitle}>Aquí podrás ver tus días de entrenamiento.</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
  },
});
