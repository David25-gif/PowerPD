import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function CronometroScreen() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const intervalRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const iniciarPausar = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (activo) {
      clearInterval(intervalRef.current);
      setActivo(false);
    } else {
      setActivo(true);
      intervalRef.current = setInterval(() => setSegundos((prev) => prev + 1), 1000);
    }
  };

  const reiniciar = () => {
    clearInterval(intervalRef.current);
    setActivo(false);
    setSegundos(0);
  };

  const formatoTiempo = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Guardar tiempo
  const guardarTiempo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Debes iniciar sesión.");

      const duracion = formatoTiempo(segundos);
      const calorias = Math.round((segundos / 60) * 8);
      const fecha = new Date().toISOString().split("T")[0];

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          entrenamientos: arrayUnion({ fecha, duracion, calorias }),
          fechasEntrenamiento: arrayUnion(fecha),
        });

        // Animación de guardado
        setGuardado(true);
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.delay(1000),
          Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => setGuardado(false));

        reiniciar();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al guardar el tiempo.");
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏱ Cronómetro</Text>

      <AnimatedCircularProgress
        size={220}
        width={10}
        fill={(segundos % 60) * (100 / 60)}
        tintColor="#22c55e"
        backgroundColor="#1f2937"
        rotation={0}
      >
        {() => <Text style={styles.time}>{formatoTiempo(segundos)}</Text>}
      </AnimatedCircularProgress>

      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "75%" }}>
          <TouchableOpacity
            style={[styles.button, activo ? styles.pauseBtn : styles.startBtn]}
            onPress={iniciarPausar}
          >
            <Text style={styles.buttonText}>{activo ? "Pausar" : "Iniciar"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity style={[styles.smallButton, styles.resetBtn]} onPress={reiniciar}>
            <Text style={styles.smallButtonText}>Reiniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.smallButton, styles.saveBtn]} onPress={guardarTiempo}>
            <Text style={styles.smallButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Animación de guardado */}
      {guardado && (
        <Animated.View style={[styles.savedMessage, { opacity: fadeAnim }]}>
          <Text style={styles.savedText}>✅ Guardado en tu historial</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#22c55e", marginBottom: 30 },
  time: { fontSize: 38, color: "#fff", fontWeight: "bold" },
  buttons: { marginTop: 40, width: "100%", alignItems: "center" },
  button: { alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 14 },
  startBtn: { backgroundColor: "#22c55e" },
  pauseBtn: { backgroundColor: "#facc15" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  secondaryButtons: { flexDirection: "row", justifyContent: "space-between", width: "75%", gap: 12 },
  smallButton: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 10, paddingVertical: 12 },
  resetBtn: { backgroundColor: "#6b7280" },
  saveBtn: { backgroundColor: "#2563eb" },
  smallButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  savedMessage: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  savedText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
