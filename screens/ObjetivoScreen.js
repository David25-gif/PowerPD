import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserContext } from "../App";

// 🎯 Datos
const objetivos = ["Tonificar", "Perder peso", "Ganar músculo"];
const niveles = ["Principiante", "Intermedio", "Avanzado"];

// 🎨 Paleta azul
const BG = "#0F172A";         // Fondo azul oscuro
const BUTTON = "#1D4ED8";     // Azul brillante
const BUTTON_ALT = "#3B82F6"; // Azul claro (sombra/acento)
const TEXT = "#FFFFFF";       // Blanco
const SUBTEXT = "#94A3B8";    // Gris azulado suave

const ObjetivoScreen = ({ navigation }) => {
  const { updateUserData } = useContext(UserContext);
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");

  const handleContinue = () => {
    if (!objetivo || !nivel) {
      alert("Selecciona un objetivo y un nivel.");
      return;
    }

    updateUserData({ objetivo, nivel });
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu objetivo</Text>
      {objetivos.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            objetivo === item && styles.optionSelected,
          ]}
          onPress={() => setObjetivo(item)}
        >
          <Text
            style={[
              styles.optionText,
              objetivo === item && styles.optionTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.title, { marginTop: 30 }]}>Selecciona tu nivel</Text>
      {niveles.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.option, nivel === item && styles.optionSelected]}
          onPress={() => setNivel(item)}
        >
          <Text
            style={[
              styles.optionText,
              nivel === item && styles.optionTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ObjetivoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: TEXT,
  },
  option: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: BUTTON_ALT,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: BG,
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  optionSelected: {
    backgroundColor: BUTTON,
  },
  optionText: {
    textAlign: "center",
    color: SUBTEXT,
  },
  optionTextSelected: {
    color: TEXT,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: BUTTON,
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 4 },
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
