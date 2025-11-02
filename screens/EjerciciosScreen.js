import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getExercisesByBodyPart } from "../services/exerciseApi";

const EjerciciosScreen = ({ route }) => {
  const { bodyPart } = route.params; // viene desde RutinasScreen
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercisesByBodyPart(bodyPart);
        setExercises(data);
      } catch (error) {
        console.error("❌ Error al obtener ejercicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [bodyPart]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ color: "white", marginTop: 10 }}>Cargando ejercicios...</Text>
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.gifUrl }} style={styles.image} />
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
            <Text style={styles.text}>🏋️ Equipo: {item.equipment}</Text>
            <Text style={styles.text}>🔥 Músculo principal: {item.target}</Text>
            {item.secondaryMuscles?.length > 0 && (
              <Text style={styles.text}>
                💪 Secundarios: {item.secondaryMuscles.join(", ")}
              </Text>
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
    marginBottom: 15,
    padding: 12,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  text: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A1520",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EjerciciosScreen;
