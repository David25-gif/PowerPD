// screens/EjerciciosScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EjerciciosScreen({ route }) {
  const { muscle } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicios para: {muscle}</Text>
      <Text style={styles.text}>Aquí se mostrarán los ejercicios específicos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});
