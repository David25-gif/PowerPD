import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function HistorialScreen() {
  const [entrenamientos, setEntrenamientos] = useState([]);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setEntrenamientos(data.entrenamientos || []);
        }
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };

    obtenerHistorial();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️‍♀️ Historial de Entrenamientos</Text>

      {entrenamientos.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes entrenamientos guardados.</Text>
      ) : (
        <FlatList
          data={entrenamientos.slice().reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>{item.fecha}</Text>
              <Text style={styles.text}>Duración: {item.duracion}</Text>
              <Text style={styles.text}>Calorías: {item.calorias} kcal</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  title: { color: "#22c55e", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  emptyText: { color: "#9ca3af", textAlign: "center", fontSize: 16, marginTop: 50 },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#22c55e",
  },
  date: { color: "#facc15", fontWeight: "bold", marginBottom: 5 },
  text: { color: "#fff", fontSize: 16 },
});
