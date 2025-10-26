import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function CompletarPerfil({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const handleGuardar = () => {
    if (!nombre || !edad) {
      alert("Por favor completa todos los campos");
      return;
    }
    console.log("Perfil completado:", { nombre, edad });
    // Redirige a la pantalla Home
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completa tu perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
