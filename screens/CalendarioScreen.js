// screens/CalendarioScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { auth, db } from "../firebaseConfig"; // asegúrate de la ruta correcta
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CalendarioScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      cargarFechas();
    } else {
      console.log("No hay usuario autenticado");
    }
  }, [user]);

  // 🔹 Cargar las fechas guardadas desde Firestore
  const cargarFechas = async () => {
    try {
      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.fechasEntrenamiento) {
          const fechasMarcadas = {};
          data.fechasEntrenamiento.forEach((fecha) => {
            fechasMarcadas[fecha] = {
              selected: true,
              marked: true,
              selectedColor: "#16a34a",
            };
          });
          setMarkedDates(fechasMarcadas);
        }
      } else {
        console.log("No hay datos para este usuario");
      }
    } catch (error) {
      console.error("Error cargando fechas:", error);
    }
  };

  // 🔹 Cuando el usuario toca una fecha
  const marcarFecha = async (day) => {
    const fecha = day.dateString;
    const nuevasFechas = { ...markedDates };

    if (nuevasFechas[fecha]) {
      delete nuevasFechas[fecha];
      Alert.alert("Entrenamiento eliminado", `Eliminaste ${fecha}`);
    } else {
      nuevasFechas[fecha] = {
        selected: true,
        marked: true,
        selectedColor: "#16a34a",
      };
      Alert.alert("Entrenamiento registrado", `Guardado ${fecha}`);
    }

    setMarkedDates(nuevasFechas);

    // Guardar en Firestore
    try {
      const ref = doc(db, "usuarios", user.uid);
      await setDoc(
        ref,
        { fechasEntrenamiento: Object.keys(nuevasFechas) },
        { merge: true }
      );
      console.log("Fechas guardadas correctamente");
    } catch (error) {
      console.error("Error guardando fecha:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Calendario de Entrenamiento</Text>
      <Text style={styles.subtitle}>
        Toca un día para marcar o desmarcar tu entrenamiento.
      </Text>
      <Calendar
        onDayPress={marcarFecha}
        markedDates={markedDates}
        theme={{
          backgroundColor: "#111827",
          calendarBackground: "#111827",
          dayTextColor: "#fff",
          monthTextColor: "#16a34a",
          todayTextColor: "#16a34a",
          arrowColor: "#16a34a",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },
  title: {
    color: "#16a34a",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
});
