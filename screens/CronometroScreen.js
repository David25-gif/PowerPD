// screens/CronometroScreen.js
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function CronometroScreen() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const intervalo = useRef(null);

  const toggleCronometro = () => {
    if (activo) {
      clearInterval(intervalo.current);
    } else {
      intervalo.current = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    }
    setActivo(!activo);
  };

  const guardarTiempo = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const hoy = new Date().toISOString().split("T")[0];
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    const data = snap.exists() ? snap.data() : {};
    const nuevosTiempos = data.tiempos || {};

    nuevosTiempos[hoy] = segundos;

    await setDoc(ref, { tiempos: nuevosTiempos }, { merge: true });

    setActivo(false);
    clearInterval(intervalo.current);
    alert(`Tiempo de ${segundos} segundos guardado para ${hoy}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏱ Cronómetro</Text>
      <Text style={styles.timer}>{segundos}s</Text>

      <TouchableOpacity style={styles.button} onPress={toggleCronometro}>
        <Text style={styles.buttonText}>{activo ? "Detener" : "Iniciar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#16a34a" }]}
        onPress={guardarTiempo}
      >
        <Text style={styles.buttonText}>Guardar tiempo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", alignItems: "center", justifyContent: "center" },
  title: { color: "#16a34a", fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  timer: { color: "#fff", fontSize: 48, marginBottom: 30 },
  button: {
    backgroundColor: "#1f2937",
    padding: 15,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 18 },
});
