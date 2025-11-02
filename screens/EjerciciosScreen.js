// screens/EjerciciosScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getExercisesByBodyPart } from "../services/exerciseApi";

const EjerciciosScreen = ({ route }) => {
  const { bodyPart } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercisesByBodyPart(bodyPart);
        console.log("✅ Datos obtenidos:", data.slice(0, 2)); // muestra solo los primeros 2
        setExercises(data);
      } catch (error) {
        console.error("❌ Error al obtener ejercicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [bodyPart]);

  // 🕒 Calcula el tiempo de descanso según dificultad
  const getRestTime = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "30–45 segundos";
      case "intermediate":
        return "45–90 segundos";
      case "expert":
      case "advanced":
        return "90–120 segundos";
      default:
        return "60 segundos";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Cargando ejercicios...
        </Text>
      </View>
    );
  }

  if (!exercises.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "white", fontSize: 18 }}>
          No se encontraron ejercicios para esta zona 😢
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Ejercicios para {bodyPart.toUpperCase()}
      </Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name?.toUpperCase()}</Text>

            {item.description && (
              <Text style={styles.text}>📖 {item.description}</Text>
            )}

            <Text style={styles.text}>
              🧠 Dificultad:{" "}
              <Text style={styles.highlight}>
                {item.difficulty || "No especificada"}
              </Text>
            </Text>

            <Text style={styles.text}>
              🏋️ Equipo:{" "}
              <Text style={styles.highlight}>
                {item.equipment || "Ninguno"}
              </Text>
            </Text>

            <Text style={styles.text}>
              🔥 Músculo principal:{" "}
              <Text style={styles.highlight}>
                {item.target || "Desconocido"}
              </Text>
            </Text>

            {item.secondaryMuscles?.length > 0 && (
              <Text style={styles.text}>
                💪 Secundarios: {item.secondaryMuscles.join(", ")}
              </Text>
            )}

            <Text style={styles.text}>
              ⏱️ Descanso sugerido: {getRestTime(item.difficulty)}
            </Text>

            {item.instructions && (
              <View style={styles.instructionsBox}>
                <Text style={styles.instructionsTitle}>📝 Instrucciones:</Text>
                {item.instructions.map((step, index) => (
                  <Text key={index} style={styles.instructionStep}>
                    {index + 1}. {step}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1520",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  card: {
    backgroundColor: "#14212E",
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },
  name: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  highlight: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  instructionsBox: {
    marginTop: 10,
    backgroundColor: "#0A1B2A",
    borderRadius: 10,
    padding: 10,
  },
  instructionsTitle: {
    color: "#16a34a",
    fontWeight: "bold",
    marginBottom: 5,
  },
  instructionStep: {
    color: "white",
    fontSize: 13,
    marginBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A1520",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EjerciciosScreen;
