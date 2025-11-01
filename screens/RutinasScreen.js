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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const predefinedRoutines = [
  {
    id: "1",
    name: "Todo el cuerpo",
    image: require("../assets/todo_cuerpo.png"),
    color: "#FF4500",
    key: "full-body",
  },
  {
    id: "2",
    name: "Abdominales",
    image: require("../assets/abdominales.png"),
    color: "#4169E1",
    key: "abs",
  },
  {
    id: "3",
    name: "Pecho",
    image: require("../assets/pecho.png"),
    color: "#1E90FF",
    key: "chest",
  },
  {
    id: "4",
    name: "Brazos",
    image: require("../assets/brazo.png"),
    color: "#9370DB",
    key: "upper-arms",
  },
  {
    id: "5",
    name: "Piernas",
    image: require("../assets/piernas.png"),
    color: "#32CD32",
    key: "upper-legs",
  },
  {
    id: "6",
    name: "Espalda",
    image: require("../assets/espalda.png"),
    color: "#00BFFF",
    key: "back",
  },
];

export default function RutinasScreen() {
  const navigation = useNavigation();
  const [customRoutines, setCustomRoutines] = useState([]);

  useEffect(() => {
    fetchUserRoutines();
  }, []);

  // 🔄 Cargar rutinas personalizadas del usuario
  const fetchUserRoutines = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "rutinas"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const routines = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCustomRoutines(routines);
    } catch (error) {
      console.error("❌ Error al obtener rutinas personalizadas:", error);
    }
  };

  // ➕ Crear rutina personalizada (simplificada)
  const handleAddRoutine = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const newRoutine = {
        userId: user.uid,
        name: `Mi rutina ${customRoutines.length + 1}`,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "rutinas"), newRoutine);
      fetchUserRoutines();
    } catch (error) {
      console.error("❌ Error al crear rutina:", error);
    }
  };

  const handlePress = (muscle) => {
    // 🔗 Lleva a EjerciciosScreen para mostrar ejercicios desde ExerciseDB
    navigation.navigate("EjerciciosScreen", { muscle });
  };

  const renderPredefinedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.color }]}
      onPress={() => handlePress(item.key)}
    >
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>{item.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  const renderCustomItem = ({ item }) => (
    <View style={styles.customCard}>
      <Text style={styles.customText}>{item.name}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Sección de rutinas predefinidas */}
      <Text style={styles.title}>ZONA PRINCIPAL</Text>
      <FlatList
        data={predefinedRoutines}
        renderItem={renderPredefinedItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
      />

      {/* Sección de rutinas personalizadas */}
      <View style={styles.customSection}>
        <Text style={styles.subtitle}>Mis Rutinas</Text>
        {customRoutines.length === 0 ? (
          <Text style={styles.noRoutinesText}>No tienes rutinas aún.</Text>
        ) : (
          <FlatList
            data={customRoutines}
            renderItem={renderCustomItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
          <Ionicons name="add-circle" size={28} color="#fff" />
          <Text style={styles.addButtonText}>Crear nueva rutina</Text>
        </TouchableOpacity>
      </View>
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
  },
  customSection: {
    paddingHorizontal: 20,
  },
  subtitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noRoutinesText: {
    color: "#aaa",
    marginBottom: 10,
  },
  customCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  customText: {
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
