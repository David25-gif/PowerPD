import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserContext } from "../App";
import Feather from "react-native-vector-icons/Feather";

// 🎨 Paleta azul
const BG = "#0F172A";         // Fondo azul oscuro
const BUTTON = "#1D4ED8";     // Azul brillante (botones)
const BUTTON_ALT = "#3B82F6"; // Azul claro (acento)
const TEXT = "#FFFFFF";       // Blanco
const SUBTEXT = "#94A3B8";    // Gris azulado suave

const GenderScreen = ({ navigation }) => {
  const { updateUserData } = useContext(UserContext);
  const [selectedGender, setSelectedGender] = useState("");

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    updateUserData({ genero: gender });
    setTimeout(() => navigation.replace("EdadPesoScreen"), 400);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu género</Text>

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderCard,
            selectedGender === "Hombre" && styles.selectedCard,
          ]}
          onPress={() => handleSelect("Hombre")}
        >
          <Feather
            name="user"
            size={80}
            color={selectedGender === "Hombre" ? TEXT : BUTTON}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === "Hombre" && styles.selectedText,
            ]}
          >
            Hombre
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderCard,
            selectedGender === "Mujer" && styles.selectedCard,
          ]}
          onPress={() => handleSelect("Mujer")}
        >
          <Feather
            name="user-check"
            size={80}
            color={selectedGender === "Mujer" ? TEXT : BUTTON}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === "Mujer" && styles.selectedText,
            ]}
          >
            Mujer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXT,
    marginBottom: 40,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  genderCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BG,
    borderWidth: 2,
    borderColor: BUTTON,
    borderRadius: 20,
    padding: 20,
    width: 130,
    height: 160,
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedCard: {
    backgroundColor: BUTTON,
  },
  genderText: {
    marginTop: 10,
    fontSize: 18,
    color: BUTTON,
    fontWeight: "600",
  },
  selectedText: {
    color: TEXT,
  },
});