import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc,
} from "firebase/firestore";

export default function HistorialScreen() {
  const [rutinas, setRutinas] = useState([]);
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "progresos"),
      where("userId", "==", user.uid),
      orderBy("fecha", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rutinasData = [];
      const entrenamientosData = [];

      snapshot.docs.forEach((docSnap) => {
        const d = docSnap.data();
        const fechaStr =
          d.fecha?.toDate().toLocaleString("es-SV", { hour12: true }) ||
          "Sin fecha";

        if (d.tiempo && d.calorias) {
          //  Entrenamiento cronometrado
          const minutos = Math.floor(d.tiempo);
          const segundos = Math.round((d.tiempo - minutos) * 60);
          entrenamientosData.push({
            id: docSnap.id,
            fecha: fechaStr,
            duracion:
              minutos > 0
                ? `${minutos} min ${segundos} s`
                : `${segundos} s`,
            calorias: d.calorias ? d.calorias.toFixed(1) : "0",
          });
        } else if (d.nombreRutina) {
          // 🏋️ Rutina guardada
          rutinasData.push({
            id: docSnap.id,
            nombre: d.nombreRutina,
            parte: d.parteCuerpo,
            fecha: fechaStr,
          });
        }
      });

      setRutinas(rutinasData);
      setEntrenamientos(entrenamientosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //  Eliminar registro
  const eliminarRegistro = async () => {
    if (!registroSeleccionado) return;
    try {
      await deleteDoc(doc(db, "progresos", registroSeleccionado.id));
      setModalVisible(false);
      setRegistroSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const renderRutina = ({ item }) => (
    <View style={[styles.card, { borderLeftColor: "#f97316" }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>🏋️ {item.nombre}</Text>
        <Text style={styles.text}>💪 Parte: {item.parte}</Text>
        <Text style={styles.date}>🗓️ {item.fecha}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setRegistroSeleccionado(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEntrenamiento = ({ item }) => (
    <View style={[styles.card, { borderLeftColor: "#22c55e" }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>⏱️ Entrenamiento Cronometrado</Text>
        <Text style={styles.text}>Duración: {item.duracion}</Text>
        <Text style={styles.text}>Calorías: {item.calorias} kcal</Text>
        <Text style={styles.date}>🗓️ {item.fecha}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setRegistroSeleccionado(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00D0FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Historial de Entrenamientos</Text>

      {/* Sección Rutinas */}
      <Text style={styles.sectionTitle}>🏋️ Rutinas Guardadas</Text>
      {rutinas.length === 0 ? (
        <Text style={styles.empty}>No hay rutinas guardadas.</Text>
      ) : (
        <FlatList
          data={rutinas}
          keyExtractor={(item) => item.id}
          renderItem={renderRutina}
        />
      )}

      {/*  Sección Entrenamientos */}
      <Text style={styles.sectionTitle}>⏱️ Entrenamientos Cronometrados</Text>
      {entrenamientos.length === 0 ? (
        <Text style={styles.empty}>No hay entrenamientos cronometrados.</Text>
      ) : (
        <FlatList
          data={entrenamientos}
          keyExtractor={(item) => item.id}
          renderItem={renderEntrenamiento}
        />
      )}

      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Eliminar este registro?</Text>
            <Text style={styles.modalText}>
              Esta acción no se puede deshacer.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ef4444" }]}
                onPress={eliminarRegistro}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#22c55e" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  header: {
    color: "#00D0FF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#00D0FF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  title: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 4 
  },
  text: { 
    color: "#e5e7eb", 
    fontSize: 14 
  },
  date: {
     color: "#9ca3af", 
     fontSize: 12, 
     marginTop: 4 
    },
  deleteButton: {
    backgroundColor: "#334155",
    padding: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  deleteIcon: { fontSize: 20, color: "#ef4444" },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center"
   },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
