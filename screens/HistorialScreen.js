import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function HistorialScreen() {
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      console.log("⛔ No hay usuario autenticado");
      return;
    }

    const ref = doc(db, "usuarios", user.uid);

    // Escuchar cambios en tiempo real al documento del usuario
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const fechasEntrenamiento = data.fechasEntrenamiento || {};

        // Convertir el objeto a un array ordenado
        const listaFechas = Object.keys(fechasEntrenamiento)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((fecha) => ({ id: fecha, fecha }));

        setFechas(listaFechas);
      } else {
        setFechas([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Historial de Entrenamientos</Text>

      {fechas.length === 0 ? (
        <Text style={styles.emptyText}>No hay registros todavía 😅</Text>
      ) : (
        <FlatList
          data={fechas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.date}>✅ {item.fecha}</Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    backgroundColor: "#1e293b",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  date: {
    color: "white",
    fontSize: 16,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20,
  },
});
