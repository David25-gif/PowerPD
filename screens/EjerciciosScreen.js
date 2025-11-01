import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { getExercisesByBodyPart } from "../services/exerciseApi"; // ✅ usa tu API
import { Ionicons } from "@expo/vector-icons";

export default function EjerciciosScreen({ route }) {
  const { muscle } = route.params; // 💪 parte del cuerpo seleccionada
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Mapeo visual para mostrar títulos más bonitos
  const muscleNames = {
    chest: "Pecho",
    back: "Espalda",
    "upper legs": "Piernas",
    "lower legs": "Piernas Inferiores",
    "upper arms": "Brazos",
    "lower arms": "Antebrazos",
    waist: "Abdominales",
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercisesByBodyPart(muscle);
        setExercises(data);
      } catch (error) {
        console.error("❌ Error al obtener ejercicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [muscle]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Cargando ejercicios de {muscleNames[muscle] || muscle}...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Ejercicios para {muscleNames[muscle] || muscle}
      </Text>

      {exercises.length === 0 ? (
        <Text style={styles.noData}>No se encontraron ejercicios 😢</Text>
      ) : (
        exercises.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: item.gifUrl }}
              style={styles.gif}
              resizeMode="cover"
            />
            <View style={styles.cardInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Equipo:</Text>{" "}
                {item.equipment}
              </Text>
              <Text style={styles.details}>
                <Text style={{ fontWeight: "bold" }}>Músculo objetivo:</Text>{" "}
                {item.target}
              </Text>

              {/* 🔗 Enlace a la animación si se desea abrir en navegador */}
              <TouchableOpacity onPress={() => Linking.openURL(item.gifUrl)}>
                <Text style={styles.link}>
                  <Ionicons name="open-outline" size={16} color="#16a34a" />{" "}
                  Ver animación
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#101820",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },
  gif: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
  cardInfo: {
    padding: 15,
  },
  exerciseName: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 6,
  },
  details: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    color: "#16a34a",
    fontWeight: "bold",
    marginTop: 8,
  },
  noData: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
});
