import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CronometroScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const finalizarEntrenamiento = async () => {
    setIsRunning(false);

    if (seconds < 10) {
      Alert.alert("Aviso", "Necesitas entrenar al menos 10 segundos 😅");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "progreso"), {
        uid: user.uid,
        minutos: Math.round(seconds / 60),
        segundosTotales: seconds,
        caloriasEstimadas: Math.round(seconds * 0.15), // estimado
        fecha: serverTimestamp(),
      });

      Alert.alert("✅ Guardado", "Entrenamiento registrado con éxito 💪");
      setSeconds(0);
    } catch (error) {
      Alert.alert("❌ Error", "No se pudo guardar el progreso");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏱️ Cronómetro</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isRunning ? "#ef4444" : "#16a34a" }]}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? "Detener" : "Iniciar"}</Text>
      </TouchableOpacity>

      {!isRunning && seconds > 0 && (
        <TouchableOpacity style={styles.finishButton} onPress={finalizarEntrenamiento}>
          <Text style={styles.finishText}>Finalizar Entrenamiento</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, color: "#16a34a", fontWeight: "bold", marginBottom: 20 },
  time: { fontSize: 60, fontWeight: "bold", color: "#fff", marginBottom: 30 },
  button: { padding: 20, borderRadius: 15, width: "60%", alignItems: "center" },
  buttonText: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  finishButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#3b82f6",
    borderRadius: 15,
    width: "70%",
    alignItems: "center",
  },
  finishText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
