import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function HistorialScreen() {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "progresos"),
      where("userId", "==", user.uid),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        // ✅ Convertir minutos decimales a minutos + segundos reales
        const tiempoDecimal = d.tiempo || 0;
        const minutosEnteros = Math.floor(tiempoDecimal);
        const segundos = Math.round((tiempoDecimal - minutosEnteros) * 60);

        // ✅ Formatear duración en texto
        let duracion = "";
        if (minutosEnteros > 0 && segundos > 0)
          duracion = `${minutosEnteros} min ${segundos} s`;
        else if (minutosEnteros > 0)
          duracion = `${minutosEnteros} min`;
        else
          duracion = `${segundos} s`;

        return {
          id: doc.id,
          duracion,
          calorias: d.calorias ? d.calorias.toFixed(1) : "0",
          fecha: d.fecha?.toDate().toLocaleString("es-SV", {
            hour12: true,
          }) || "Sin fecha",
        };
      });
      setEntrenamientos(data);
    });

    return () => unsubscribe();
  }, []);

  // 🗑️ Eliminar registro de Firestore
  const eliminarRegistro = async () => {
    if (!registroSeleccionado) return;
    try {
      await deleteDoc(doc(db, "progresos", registroSeleccionado.id));
      setModalVisible(false);
      setRegistroSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️‍♀️ Historial de Entrenamientos</Text>

      {entrenamientos.length === 0 ? (
        <Text style={styles.emptyText}>
          Aún no tienes entrenamientos guardados.
        </Text>
      ) : (
        <FlatList
          data={entrenamientos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.date}>{item.fecha}</Text>
                <Text style={styles.text}>Duración: {item.duracion}</Text>
                <Text style={styles.text}>Calorías: {item.calorias} kcal</Text>
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
          )}
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
  title: {
    color: "#22c55e",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#22c55e",
  },
  date: { color: "#facc15", fontWeight: "bold", marginBottom: 5 },
  text: { color: "#fff", fontSize: 16 },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#334155",
  },
  deleteIcon: { fontSize: 20, color: "#ef4444" },
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
