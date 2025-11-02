// screens/RutinasScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { getBodyParts } from "../services/exerciseApi";

const imagesMap = {
  chest: require("../assets/pecho.png"),
  back: require("../assets/espalda.png"),
  "upper legs": require("../assets/piernas.png"),
  "upper arms": require("../assets/brazos.png"),
  waist: require("../assets/abdominales.png"),
  cardio: require("../assets/cardio.png"),
};

// Mapeo personalizado (API → Español)
const labelsMap = {
  chest: "Pecho",
  back: "Espalda",
  "upper legs": "Piernas",
  "upper arms": "Brazos",
  waist: "Abdominales",
  cardio: "Cardio",
};

// Solo queremos estas 6 categorías
const allowedParts = ["chest", "back", "upper legs", "upper arms", "waist", "cardio"];

const RutinasScreen = ({ navigation }) => {
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const loadParts = async () => {
      try {
        const parts = await getBodyParts();
        const filtered = parts.filter((p) => allowedParts.includes(p.toLowerCase()));
        setBodyParts(filtered);
      } catch (error) {
        console.error("Error al cargar las rutinas:", error);
      }
    };
    loadParts();
  }, []);

  const handlePress = (part) => {
    navigation.navigate("EjerciciosScreen", { bodyPart: part });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ZONA PRINCIPAL</Text>
      <FlatList
        data={bodyParts}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Image source={imagesMap[item]} style={styles.image} />
            <Text style={styles.label}>{labelsMap[item]?.toUpperCase()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1520",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#14212E",
    borderRadius: 12,
    margin: 10,
    alignItems: "center",
    width: 150,
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RutinasScreen;
