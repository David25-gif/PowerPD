import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { getBodyParts } from "../services/exerciseApi";

const imagesMap = {
  chest: require("../assets/pecho.png"),
  back: require("../assets/espalda.png"),
  "upper legs": require("../assets/piernas.png"),
  "upper arms": require("../assets/brazos.png"),
  waist: require("../assets/abdominales.png"),
  cardio: require("../assets/cardio.png"),
};

// 🇪🇸 Traducción fija para las zonas que queremos mostrar
const labelsMap = {
  back: "Espalda",
  cardio: "Cardio",
  chest: "Pecho",
  "upper legs": "Piernas",
  "upper arms": "Brazos",
  waist: "Abdominales",
};

// 🔥 Solo las zonas principales que queremos mostrar
const allowedParts = [
  "back",
  "cardio",
  "chest",
  "upper legs",
  "upper arms",
  "waist",
];

const RutinasScreen = ({ navigation }) => {
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const loadParts = async () => {
      try {
        const parts = await getBodyParts();
        console.log("📦 Partes del cuerpo devueltas por API:", parts);

        // ⚙️ Filtramos solo las partes que queremos (por `original`)
        const filtered = parts
          .filter((p) => allowedParts.includes(p.original))
          .map((p) => ({
            original: p.original,
            translated: labelsMap[p.original] || p.translated,
          }));

        console.log("✅ Partes del cuerpo filtradas:", filtered);
        setBodyParts(filtered);
      } catch (error) {
        console.error("❌ Error al cargar las rutinas:", error);
      }
    };
    loadParts();
  }, []);

  const handlePress = (part) => {
    navigation.navigate("EjerciciosScreen", { bodyPart: part });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RUTINAS</Text>

      <FlatList
        data={bodyParts}
        keyExtractor={(item) => item.original}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.original)}
          >
            {imagesMap[item.original] ? (
              <Image source={imagesMap[item.original]} style={styles.image} />
            ) : (
              <Text style={{ color: "white" }}>Sin imagen</Text>
            )}
            <Text style={styles.label}>{item.translated.toUpperCase()}</Text>
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
    color: "#00D0FF",
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
