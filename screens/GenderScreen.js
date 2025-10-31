import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { UserContext } from "../App";
import Feather from "react-native-vector-icons/Feather";

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
            color={selectedGender === "Hombre" ? "#fff" : "#16a34a"}
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
            color={selectedGender === "Mujer" ? "#fff" : "#16a34a"}
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
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a",
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
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#16a34a",
    borderRadius: 20,
    padding: 20,
    width: 130,
    height: 160,
  },
  selectedCard: {
    backgroundColor: "#16a34a",
  },
  genderText: {
    marginTop: 10,
    fontSize: 18,
    color: "#16a34a",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
});
