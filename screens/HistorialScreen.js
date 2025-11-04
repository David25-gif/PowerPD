import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function HistorialScreen() {
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      console.log("⛔ No hay usuario autenticado");
      setLoading(false);
      return;
    }

    const ref = doc(db, "usuarios", user.uid);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const fechasEntrenamiento = data.fechasEntrenamiento || {};

          let listaFechas = [];

          // 🧠 Si está guardado como objeto tipo {"2025-11-03": true}
          if (!Array.isArray(fechasEntrenamiento)) {
            listaFechas = Object.keys(fechasEntrenamiento);
          }
          // 🧠 Si está guardado como array tipo ["2025-11-03", "2025-11-13"]
          else {
            listaFechas = fechasEntrenamiento.filter((f) => typeof f === "string");
          }

          // 🧩 Ordena las fechas de más reciente a más antigua
          listaFechas.sort((a, b) => new Date(b) - new Date(a));

          setFechas(listaFechas);
        } else {
          setFechas([]);
        }

        setLoading(false);
      },
      (error) => {
        console.error("❌ Error al cargar historial:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={24} color="#16a34a" />
        <Text style={styles.title}>Historial de Entrenamientos</Text>
      </View>

      {fechas.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes entrenamientos registrados 📅</Text>
      ) : (
        <FlatList
          data={fechas}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Ionicons name="checkmark-done" size={20} color="#22c55e" />
              <Text style={styles.date}>{item}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: "#16a34a",
    fontWeight: "bold",
    marginLeft: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
  },
  date: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
});
