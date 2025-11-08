import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert, StatusBar, Platform, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DesafiosScreen = () => {
  const [desafios, setDesafios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [selectedDesafio, setSelectedDesafio] = useState(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [iniciado, setIniciado] = useState(false);

  const fadeAnim1 = useState(new Animated.Value(0))[0];
  const scaleAnim1 = useState(new Animated.Value(0.9))[0];
  const fadeAnim2 = useState(new Animated.Value(0))[0];
  const scaleAnim2 = useState(new Animated.Value(0.9))[0];

  const DESAFIOS_KEY = "@desafios_guardados";
  const HISTORIAL_KEY = "@historial_desafios";

  const desafiosBase = [
    { id: "1", titulo: "Reto de resistencia", descripcion: "Corre 10 km en una semana." },
    { id: "2", titulo: "Cardio extremo", descripcion: "Haz 20 minutos de HIIT 3 veces por semana." },
    { id: "3", titulo: "Piernas fuertes", descripcion: "Realiza 100 sentadillas al día durante 5 días." },
    { id: "4", titulo: "Brazos de acero", descripcion: "Completa 50 flexiones diarias durante 7 días." },
    { id: "5", titulo: "Día de abdominales", descripcion: "Haz 200 abdominales en total durante la semana." },
    { id: "6", titulo: "Cuerpo completo", descripcion: "Entrena todos los grupos musculares 4 veces esta semana." },
    { id: "7", titulo: "Reto de flexibilidad", descripcion: "Practica estiramientos 15 min diarios por 5 días." },
    { id: "8", titulo: "Entrenamiento rápido", descripcion: "Realiza una rutina de 15 minutos cada día durante 7 días." },
  ];

  useEffect(() => {
    cargarDesafios();
  }, []);

  const cargarDesafios = async () => {
    try {
      const guardados = await AsyncStorage.getItem(DESAFIOS_KEY);
      if (guardados) {
        setDesafios(JSON.parse(guardados));
      } else {
        setDesafios(desafiosBase);
        await AsyncStorage.setItem(DESAFIOS_KEY, JSON.stringify(desafiosBase));
      }
    } catch (error) {
      console.log("Error cargando desafíos:", error);
    }
  };

  const guardarDesafios = async (lista) => {
    try {
      await AsyncStorage.setItem(DESAFIOS_KEY, JSON.stringify(lista));
    } catch (error) {
      console.log("Error guardando desafíos:", error);
    }
  };

  const abrirDesafio = (item) => {
    setSelectedDesafio(item);
    setIniciado(false);
    setModalVisible(true);
    animarModal(fadeAnim1, scaleAnim1);
  };

  const iniciarDesafio = () => setIniciado(true);

  const completarDesafio = async () => {
    if (!iniciado) return;
    try {
      const completados = (await AsyncStorage.getItem(HISTORIAL_KEY)) || "[]";
      const listaCompletados = JSON.parse(completados);
      listaCompletados.push({
        ...selectedDesafio,
        completadoEn: new Date().toISOString(),
      });
      await AsyncStorage.setItem(HISTORIAL_KEY, JSON.stringify(listaCompletados));
      Alert.alert("¡Desafío completado!", "Se ha agregado al historial.");
      setModalVisible(false);
    } catch (error) {
      console.log("Error al guardar en historial:", error);
    }
  };

  const crearDesafio = async () => {
    if (!nuevoTitulo.trim() || !nuevaDescripcion.trim()) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }
    const nuevo = { id: Date.now().toString(), titulo: nuevoTitulo, descripcion: nuevaDescripcion };
    const nuevos = [...desafios, nuevo];
    setDesafios(nuevos);
    await guardarDesafios(nuevos);
    setNuevoTitulo("");
    setNuevaDescripcion("");
    setModalCrearVisible(false);
  };

  // Nueva versión: elimina solo los completados
  const eliminarCompletados = async () => {
    Alert.alert(
      "Eliminar desafíos completados",
      "¿Deseas borrar los desafíos completados de la lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const completados = await AsyncStorage.getItem(HISTORIAL_KEY);
              if (completados) {
                const listaCompletados = JSON.parse(completados);
                const idsCompletados = listaCompletados.map((d) => d.id);

                const desafiosRestantes = desafios.filter(
                  (d) => !idsCompletados.includes(d.id)
                );

                setDesafios(desafiosRestantes);
                await guardarDesafios(desafiosRestantes);

                Alert.alert(
                  "Desafíos eliminados",
                  "Se eliminaron los desafíos completados de la lista."
                );
              } else {
                Alert.alert("Sin completados", "No hay desafíos completados para eliminar.");
              }
            } catch (error) {
              console.log("Error eliminando desafíos completados:", error);
            }
          },
        },
      ]
    );
  };

  const animarModal = (fade, scale) => {
    fade.setValue(0);
    scale.setValue(0.9);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => abrirDesafio(item)}>
      <Text style={styles.cardTitle}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnCrear}
        onPress={() => {
          setModalCrearVisible(true);
          animarModal(fadeAnim2, scaleAnim2);
        }}
      >
        <Text style={styles.btnText}>Crear desafío</Text>
      </TouchableOpacity>

      {desafios.length === 0 ? (
        <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
          No hay desafíos disponibles. ¡Crea uno nuevo!
        </Text>
      ) : (
        <FlatList
          data={desafios}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.btnEliminar} onPress={eliminarCompletados}>
        <Text style={styles.btnText}>Eliminar desafíos completados</Text>
      </TouchableOpacity>

      {/* Modal detalle */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim1, transform: [{ scale: scaleAnim1 }] }]}>
            <Text style={styles.modalTitle}>{selectedDesafio?.titulo}</Text>
            <Text style={styles.modalDesc}>{selectedDesafio?.descripcion}</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.btnAccion, iniciado && styles.btnDeshabilitado]}
                onPress={iniciarDesafio}
                disabled={iniciado}
              >
                <Text style={styles.btnText}>Iniciar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnAccion, !iniciado && styles.btnDeshabilitado]}
                onPress={completarDesafio}
                disabled={!iniciado}
              >
                <Text style={styles.btnText}>Completado</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnCerrar} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCerrarText}>Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal crear */}
      <Modal visible={modalCrearVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim2, transform: [{ scale: scaleAnim2 }] }]}>
            <Text style={styles.modalTitle}>Nuevo desafío</Text>
            <TextInput
              placeholder="Título del desafío"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={nuevoTitulo}
              onChangeText={setNuevoTitulo}
            />
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#aaa"
              style={[styles.input, { height: 80 }]}
              multiline
              value={nuevaDescripcion}
              onChangeText={setNuevaDescripcion}
            />
            <TouchableOpacity style={styles.btnGuardar} onPress={crearDesafio}>
              <Text style={styles.btnText}>Guardar desafío</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCerrar} onPress={() => setModalCrearVisible(false)}>
              <Text style={styles.btnCerrarText}>Cancelar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1120",
    padding: 16,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 20) + 40 : 70,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    marginVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#10b981",
  },
  cardTitle: { color: "#facc15", fontSize: 18, fontWeight: "bold" },
  btnCrear: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  btnEliminar: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 15,
    width: "85%",
  },
  modalTitle: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDesc: {
    color: "#e5e7eb",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  btnAccion: {
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnContainer: { flexDirection: "row", justifyContent: "space-between" },
  btnDeshabilitado: { backgroundColor: "#374151" },
  btnCerrar: {
    backgroundColor: "#64748b",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  btnCerrarText: { color: "#fff", fontWeight: "bold" },
  btnGuardar: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
});

export default DesafiosScreen;
