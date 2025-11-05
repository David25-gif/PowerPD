import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function CalendarioScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [nota, setNota] = useState("");
  const [hora, setHora] = useState("");
  const [rutinas, setRutinas] = useState({});
  const user = auth.currentUser;

  // 📅 Escucha en tiempo real las rutinas del usuario
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "rutinas"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevasRutinas = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        nuevasRutinas[data.fecha] = { id: doc.id, ...data };
      });
      setRutinas(nuevasRutinas);
    });

    return () => unsubscribe();
  }, [user]);

  const abrirModal = (day) => {
    setSelectedDate(day.dateString);
    const rutinaExistente = rutinas[day.dateString];
    if (rutinaExistente) {
      setTitulo(rutinaExistente.titulo || "");
      setNota(rutinaExistente.nota || "");
      setHora(rutinaExistente.hora || "");
    } else {
      setTitulo("");
      setNota("");
      setHora("");
    }
    setModalVisible(true);
  };

  const guardarRutina = async () => {
    if (!selectedDate || !titulo.trim()) return;
    const existente = rutinas[selectedDate];
    try {
      if (existente) {
        // 🔄 Actualizar rutina existente
        await updateDoc(doc(db, "rutinas", existente.id), {
          titulo,
          nota,
          hora,
        });
      } else {
        // 🆕 Crear nueva rutina
        await addDoc(collection(db, "rutinas"), {
          userId: user.uid,
          fecha: selectedDate,
          titulo,
          nota,
          hora,
        });
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error al guardar rutina:", error);
    }
  };

  const eliminarRutina = async () => {
    const existente = rutinas[selectedDate];
    if (!existente) return;
    try {
      await deleteDoc(doc(db, "rutinas", existente.id));
      setModalVisible(false);
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
    }
  };

  // 🎯 Marcar fechas con rutinas
  const markedDates = Object.keys(rutinas).reduce((acc, fecha) => {
    acc[fecha] = {
      marked: true,
      dotColor: "#22c55e",
      selected: fecha === selectedDate,
      selectedColor: "#14532d",
    };
    return acc;
  }, {});

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: "#14532d" };
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Tu Calendario Fitness</Text>

      <Calendar
        theme={{
          calendarBackground: "#0f172a",
          dayTextColor: "#fff",
          monthTextColor: "#22c55e",
          arrowColor: "#22c55e",
          todayTextColor: "#facc15",
        }}
        onDayPress={abrirModal}
        markedDates={markedDates}
      />

      {/* 🔹 Modal de creación / edición */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {rutinas[selectedDate] ? "Editar Rutina" : "Nueva Rutina"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="¿Qué entrenarás este día?"
              placeholderTextColor="#94a3b8"
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notas o ejercicios..."
              placeholderTextColor="#94a3b8"
              value={nota}
              onChangeText={setNota}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Hora (opcional)"
              placeholderTextColor="#94a3b8"
              value={hora}
              onChangeText={setHora}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={guardarRutina}>
                <Text style={styles.buttonText}>💾 Guardar</Text>
              </TouchableOpacity>

              {rutinas[selectedDate] && (
                <TouchableOpacity style={styles.deleteButton} onPress={eliminarRutina}>
                  <Text style={styles.buttonText}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 10 },
  title: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1e293b",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#334155",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  cancelButton: { marginTop: 10, alignItems: "center" },
  cancelText: { color: "#94a3b8", fontSize: 16 },
});
