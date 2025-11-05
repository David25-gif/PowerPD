import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// 🎨 Paleta de colores
const BG = '#171320';
const TEXT = '#FFFFFF';
const SUBTEXT = '#B8A1E0';
const BUTTON = '#A66EFF';
const BUTTON_ALT = '#6F4BA1';
const CARD = '#2C2340';
const INPUT_BG = '#3E3163';
const ALERT = '#FF6347';
const CANCEL = '#888888';

const INITIAL_PROFILE_DATA = {
  nombre: 'Usuario Invitado',
  genero: 'No especificado',
  objetivo: 'Sin establecer',
  nivelExperiencia: 'Nuevo',
  edad: 0,
  peso: 0,
  altura: 0,
};

// ==========================================================
// MODAL DE EDICIÓN
// ==========================================================
function EditProfileModal({ visible, onClose, profileData, onSave }) {
  const [tempData, setTempData] = useState(profileData);

  useEffect(() => {
    setTempData(profileData);
  }, [profileData]);

  const handleChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handleGuardar = () => {
    if (!tempData.nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }
    onSave({
      ...tempData,
      edad: parseInt(tempData.edad) || 0,
      peso: parseFloat(tempData.peso) || 0,
      altura: parseFloat(tempData.altura) || 0,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={stylesModal.modalBackground}>
        <ScrollView contentContainerStyle={stylesModal.scrollContainer}>
          <View style={stylesModal.editCard}>
            <Text style={stylesModal.headerText}>Editar Perfil</Text>

            {["nombre", "genero", "objetivo", "nivelExperiencia", "edad", "peso", "altura"].map((field) => (
              <TextInput
                key={field}
                style={stylesModal.input}
                value={String(tempData[field])}
                onChangeText={(v) => handleChange(field, v)}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                placeholderTextColor={SUBTEXT}
                keyboardType={["edad", "peso", "altura"].includes(field) ? "numeric" : "default"}
              />
            ))}

            <TouchableOpacity style={stylesModal.saveButton} onPress={handleGuardar}>
              <Text style={stylesModal.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesModal.cancelButton} onPress={onClose}>
              <Text style={stylesModal.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ==========================================================
// PANTALLA PRINCIPAL
// ==========================================================
export default function PerfilScreen() {
  const [profileData, setProfileData] = useState(INITIAL_PROFILE_DATA);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('userProfile');
      if (data) setProfileData(JSON.parse(data));
    };
    load();
  }, []);

  const saveProfile = async (data) => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(data));
    setProfileData(data);
    setModalVisible(false);
    Alert.alert("Guardado", "Datos actualizados correctamente");
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userProfile');
    setProfileData(INITIAL_PROFILE_DATA);
    Alert.alert("Sesión cerrada", "Has salido correctamente");
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Hola, {profileData.nombre}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos del Perfil</Text>
          <Text style={styles.info}>Nombre: {profileData.nombre}</Text>
          <Text style={styles.info}>Género: {profileData.genero}</Text>
          <Text style={styles.info}>Objetivo: {profileData.objetivo}</Text>
          <Text style={styles.info}>Nivel: {profileData.nivelExperiencia}</Text>
          <Text style={styles.info}>Edad: {profileData.edad} años</Text>
          <Text style={styles.info}>Peso: {profileData.peso} kg</Text>
          <Text style={styles.info}>Altura: {profileData.altura} cm</Text>

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Ionicons name="create-outline" size={20} color={TEXT} />
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="exit-outline" size={20} color={TEXT} />
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <EditProfileModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          profileData={profileData}
          onSave={saveProfile}
        />
      </View>
    </ScrollView>
  );
}

// ==========================================================
// ESTILOS PRINCIPALES
// ==========================================================
const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BG },
  container: { padding: 20 },
  headerTitle: { fontSize: 24, color: TEXT, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: CARD,
    padding: 20,
    borderRadius: 15,
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: { fontSize: 18, color: SUBTEXT, marginBottom: 10, fontWeight: '600' },
  info: { color: TEXT, fontSize: 16, marginBottom: 6 },
  button: {
    backgroundColor: BUTTON,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  logoutButton: {
    backgroundColor: ALERT,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { color: TEXT, fontWeight: 'bold', fontSize: 16 },
});

// ==========================================================
// ESTILOS MODAL
// ==========================================================
const stylesModal = StyleSheet.create({
  modalBackground: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'
  },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  editCard: {
    backgroundColor: CARD,
    padding: 20,
    borderRadius: 15,
    width: '85%',
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  headerText: { fontSize: 20, color: SUBTEXT, textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  input: {
    backgroundColor: INPUT_BG,
    color: TEXT,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: BUTTON,
    borderWidth: 1,
  },
  saveButton: { backgroundColor: BUTTON, padding: 12, borderRadius: 8, marginTop: 10 },
  saveButtonText: { color: TEXT, fontWeight: 'bold', textAlign: 'center' },
  cancelButton: { backgroundColor: CANCEL, padding: 12, borderRadius: 8, marginTop: 10 },
  cancelButtonText: { color: TEXT, fontWeight: 'bold', textAlign: 'center' },
});
