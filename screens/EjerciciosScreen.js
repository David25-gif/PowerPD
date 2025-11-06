import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getExercisesByBodyPart } from "../services/exerciseApi";

// 🇪🇸 Traducciones
const bodyPartNames = {
  chest: "Pecho",
  back: "Espalda",
  "upper legs": "Piernas",
  "upper arms": "Brazos",
  waist: "Abdominales",
  cardio: "Cardio",
};

const EjerciciosScreen = ({ route }) => {
  const { bodyPart } = route.params || {};
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const translatedPart = bodyPartNames[bodyPart] || bodyPart;

  useEffect(() => {
    if (bodyPart) fetchExercises(bodyPart);
  }, [bodyPart]);

  const fetchExercises = async (partName) => {
    try {
      setLoading(true);
      const data = await getExercisesByBodyPart(partName);
      setExercises(data);
    } catch (err) {
      console.error("❌ Error cargando ejercicios:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderExercise = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.gifUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.detail}>
          🎯 <Text style={styles.label}>Objetivo:</Text> {item.target}
        </Text>
        <Text style={styles.detail}>
          🦾 <Text style={styles.label}>Equipo:</Text> {item.equipment}
        </Text>

        {item.instructions && item.instructions.length > 0 && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.label}>📋 Instrucciones:</Text>
            {item.instructions.map((step, index) => (
              <Text key={index} style={styles.instructionStep}>
                • {step}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Título limpio debajo del header */}
      <Text style={styles.screenTitle}>
        Ejercicios de {translatedPart?.toUpperCase()}
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#f97316"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExercise}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default EjerciciosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1520",
    paddingTop: 15,
    paddingHorizontal: 14,
  },
  screenTitle: {
    color: "#f97316",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    textTransform: "uppercase",
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#14212E",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 14,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  detail: {
    color: "#e5e7eb",
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    color: "#f97316",
    fontWeight: "600",
  },
  instructionsContainer: {
    marginTop: 10,
  },
  instructionStep: {
    color: "#d1d5db",
    fontSize: 13,
    marginLeft: 10,
    marginTop: 2,
  },
});
