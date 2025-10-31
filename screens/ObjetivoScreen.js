import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserContext } from "../App";

const objetivos = ["Tonificar", "Perder peso", "Ganar músculo"];
const niveles = ["Principiante", "Intermedio", "Avanzado"];

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
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#16a34a",
  },
  option: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  optionSelected: {
    backgroundColor: "#16a34a",
  },
  optionText: {
    textAlign: "center",
    color: "#374151",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#16a34a",
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
