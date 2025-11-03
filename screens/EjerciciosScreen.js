import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { getBodyParts, getExercisesByBodyPart } from "../services/exerciseApi";

const EjerciciosScreen = () => {
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar las partes del cuerpo al iniciar
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const parts = await getBodyParts();
        setBodyParts(parts);
      } catch (err) {
        console.error("Error cargando partes del cuerpo:", err);
      }
    };
    fetchParts();
  }, []);

  // 🔹 Cargar los ejercicios cuando se selecciona una parte
  const handleSelectPart = async (part) => {
    try {
      setSelectedPart(part);
      setLoading(true);
      const data = await getExercisesByBodyPart(part.original);
      setExercises(data);
    } catch (err) {
      console.error("Error cargando ejercicios:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Render de cada parte del cuerpo
  const renderBodyPart = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bodyPartButton,
        selectedPart?.original === item.original && styles.selectedButton,
      ]}
      onPress={() => handleSelectPart(item)}
    >
      <Text style={styles.bodyPartText}>{item.translated}</Text>
    </TouchableOpacity>
  );

  // 🔹 Render de cada ejercicio
  const renderExercise = ({ item }) => (
    <View style={styles.exerciseCard}>
      <Image
        source={{ uri: item.gifUrl }}
        style={styles.exerciseImage}
        resizeMode="cover"
      />
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDetail}>
          🎯 <Text style={styles.label}>Objetivo:</Text> {item.target}
        </Text>
        <Text style={styles.exerciseDetail}>
          🦾 <Text style={styles.label}>Equipo:</Text> {item.equipment}
        </Text>
        <Text style={styles.exerciseDetail}>
          💪 <Text style={styles.label}>Parte del cuerpo:</Text> {item.bodyPart}
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
      <Text style={styles.title}>Selecciona una zona del cuerpo</Text>

      {bodyParts.length === 0 ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bodyParts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.original}
          renderItem={renderBodyPart}
          contentContainerStyle={styles.bodyPartList}
        />
      )}

      <View style={styles.separator} />

      {loading ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 20 }} />
      ) : selectedPart ? (
        exercises.length > 0 ? (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={renderExercise}
            contentContainerStyle={styles.exerciseList}
          />
        ) : (
          <Text style={styles.noExercises}>No se encontraron ejercicios para esta zona.</Text>
        )
      ) : (
        <Text style={styles.helperText}>Selecciona una parte del cuerpo para ver ejercicios</Text>
      )}
    </View>
  );
};

export default EjerciciosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#f97316",
    textAlign: "center",
  },
  bodyPartList: {
    paddingVertical: 10,
  },
  bodyPartButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: "#f97316",
  },
  bodyPartText: {
    color: "#111827",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  exerciseList: {
    paddingBottom: 80,
  },
  exerciseCard: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  exerciseImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  exerciseInfo: {
    flex: 1,
    padding: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    color: "#4b5563",
  },
  label: {
    fontWeight: "600",
    color: "#f97316",
  },
  instructionsContainer: {
    marginTop: 6,
  },
  instructionStep: {
    fontSize: 13,
    color: "#374151",
    marginLeft: 10,
  },
  noExercises: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
  },
  helperText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
  },
});
