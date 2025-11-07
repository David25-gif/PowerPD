import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { UserContext } from "../App"; // 👈 importa el contexto desde App.js

// 🎨 Paleta azul
const BG = "#0F172A";         // Fondo azul oscuro
const BUTTON = "#1D4ED8";     // Azul brillante (botones)
const BUTTON_ALT = "#3B82F6"; // Azul claro (borde/sombra)
const TEXT = "#FFFFFF";       // Blanco
const SUBTEXT = "#94A3B8";    // Gris azulado suave

const EdadPesoScreen = ({ navigation }) => {
  const { updateUserData } = useContext(UserContext);

  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");

  const handleContinue = () => {
    if (!edad || !peso || !altura) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    updateUserData({
      edad: parseInt(edad),
      peso: parseFloat(peso),
      altura: parseFloat(altura),
    });

    navigation.replace("ObjetivoScreen");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Completa tu perfil</Text>

      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
        placeholder="Ej: 25"
        placeholderTextColor={SUBTEXT}
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
        placeholder="Ej: 70"
        placeholderTextColor={SUBTEXT}
      />

      <Text style={styles.label}>Altura (cm)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={altura}
        onChangeText={setAltura}
        placeholder="Ej: 175"
        placeholderTextColor={SUBTEXT}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default EdadPesoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: TEXT,
    marginBottom: 30,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    color: SUBTEXT,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BUTTON_ALT,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: TEXT,
  },
  button: {
    backgroundColor: BUTTON,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: TEXT,
    fontWeight: "600",
    fontSize: 16,
  },
});
