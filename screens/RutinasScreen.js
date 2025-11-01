// screens/RutinasScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getBodyParts } from "../services/exerciseApi"; // ✅ Importa la API real

const screenWidth = Dimensions.get("window").width;

export default function RutinasScreen() {
  const navigation = useNavigation();
  const [bodyParts, setBodyParts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar partes del cuerpo desde la API ExerciseDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parts = await getBodyParts();
        setBodyParts(parts);
      } catch (error) {
        console.error("❌ Error al obtener las partes del cuerpo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔗 Cuando se toca una tarjeta, navega a EjerciciosScreen
  const handlePress = (muscle) => {
    navigation.navigate("EjerciciosScreen", { muscle });
  };

  // 🧍‍♀️ Mapeo de imágenes (solo las que tú tienes)
  const imagesMap = {
    "chest": require("../assets/pecho.png"),
    "back": require("../assets/espalda.png"),
    "upper legs": require("../assets/piernas.png"),
    "lower legs": require("../assets/piernas.png"),
    "upper arms": require("../assets/brazos.png"),
    "lower arms": require("../assets/brazos.png"),
    "waist": require("../assets/abdominales.png"),
  };

  // 🎨 Si aún está cargando, mostramos indicador
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Cargando rutinas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ZONA PRINCIPAL</Text>

      <FlatList
        data={bodyParts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card]}
            onPress={() => handlePress(item)}
          >
            <Image
              source={imagesMap[item] || require("../assets/pecho.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.text}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 20,
    textAlign: "center",
  },
  grid: {
    alignItems: "center",
    marginBottom: 30,
  },
  card: {
    width: screenWidth / 2.3,
    height: 150,
    borderRadius: 15,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
