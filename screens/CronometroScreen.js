import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function CronometroScreen() {
  const [tiempo, setTiempo] = useState(0);
  const [activo, setActivo] = useState(false);
  const intervaloRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activo) {
      intervaloRef.current = setInterval(() => {
        setTiempo((t) => t + 1);
      }, 1000);
    } else if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
    }
    return () => clearInterval(intervaloRef.current);
  }, [activo]);

  const formatoTiempo = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const manejarInicioPausa = () => setActivo(!activo);

  const manejarReinicio = () => {
    setActivo(false);
    setTiempo(0);
  };

  const mostrarAnimacionGuardado = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const manejarGuardar = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Debes iniciar sesión para guardar tu progreso.");
        return;
      }

      // 🔹 Convertir segundos a minutos (con decimales)
      const minutos = tiempo / 60;
      const calorias = minutos * 8; // 8 kcal/minuto aprox.

      await addDoc(collection(db, "progresos"), {
        userId: user.uid,
        tiempo: minutos, // guardamos en minutos para la gráfica
        calorias,
        fecha: serverTimestamp(), // 🔹 Timestamp oficial de Firebase
      });

      manejarReinicio();
      mostrarAnimacionGuardado();
    } catch (error) {
      console.error("Error al guardar tiempo:", error);
      Alert.alert("Error", "No se pudo guardar el progreso.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cronómetro</Text>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatoTiempo(tiempo)}</Text>
      </View>

      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: activo ? "#ff5252" : "#00C851" }]}
          onPress={manejarInicioPausa}
        >
          <Text style={styles.botonTexto}>{activo ? "Pausar" : "Iniciar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.reiniciar]} onPress={manejarReinicio}>
          <Text style={styles.botonTexto}>Reiniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.guardar]} onPress={manejarGuardar}>
          <Text style={styles.botonTexto}>Guardar tiempo</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.mensajeExito, { opacity: fadeAnim }]}>
        <Text style={styles.mensajeTexto}>✅ Progreso guardado con éxito</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00D0FF",
    marginBottom: 30,
  },
  timerContainer: {
    borderWidth: 3,
    borderColor: "#00C851",
    borderRadius: 150,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  timer: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
  },
  botonesContainer: {
    width: "100%",
    alignItems: "center",
  },
  boton: {
    width: "80%",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  reiniciar: {
    backgroundColor: "#6c757d",
  },
  guardar: {
    backgroundColor: "#007bff",
  },
  mensajeExito: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#00C851",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mensajeTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
