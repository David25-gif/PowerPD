import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, Dimensions, Modal 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// 🎨 Paleta de colores
const PRIMARY = '#A66EFF';
const DARK = '#171320';
const MID = '#2C2340';
const LIGHT = '#D1B3FF';
const WHITE = '#FFFFFF';
const CANCEL_COLOR = '#888888';
const INPUT_BACKGROUND = '#3E3163';
const LOGOUT_COLOR = '#FF6347';

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

            <TextInput
              style={stylesModal.input}
              value={tempData.nombre}
              onChangeText={(v) => handleChange('nombre', v)}
              placeholder="Nombre"
              placeholderTextColor={LIGHT}
            />

            <TextInput
              style={stylesModal.input}
              value={tempData.genero}
              onChangeText={(v) => handleChange('genero', v)}
              placeholder="Género"
              placeholderTextColor={LIGHT}
            />

            <TextInput
              style={stylesModal.input}
              value={tempData.objetivo}
              onChangeText={(v) => handleChange('objetivo', v)}
              placeholder="Objetivo"
              placeholderTextColor={LIGHT}
            />

            <TextInput
              style={stylesModal.input}
              value={tempData.nivelExperiencia}
              onChangeText={(v) => handleChange('nivelExperiencia', v)}
              placeholder="Nivel"
              placeholderTextColor={LIGHT}
            />

            <TextInput
              style={stylesModal.input}
              value={String(tempData.edad)}
              keyboardType="numeric"
              onChangeText={(v) => handleChange('edad', v)}
              placeholder="Edad"
              placeholderTextColor={LIGHT}
            />

            <TextInput
              style={stylesModal.input}
              value={String(tempData.peso)}
              keyboardType="numeric"
              onChangeText={(v) => handleChange('peso', v)}
              placeholder="Peso (kg)"
              placeholderTextColor={LIGHT}
            />

            <TextInput
              style={stylesModal.input}
              value={String(tempData.altura)}
              keyboardType="numeric"
              onChangeText={(v) => handleChange('altura', v)}
              placeholder="Altura (cm)"
              placeholderTextColor={LIGHT}
            />

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
            <Ionicons name="create-outline" size={20} color={WHITE} />
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="exit-outline" size={20} color={WHITE} />
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
// ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: DARK },
  container: { padding: 20 },
  headerTitle: { fontSize: 22, color: PRIMARY, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: MID, padding: 20, borderRadius: 10 },
  sectionTitle: { fontSize: 18, color: LIGHT, marginBottom: 10, fontWeight: '600' },
  info: { color: WHITE, fontSize: 16, marginBottom: 5 },
  button: {
    backgroundColor: PRIMARY,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButton: {
    backgroundColor: LOGOUT_COLOR,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { color: WHITE, fontWeight: 'bold' },
});

// ==========================================================
// ESTILOS MODAL
// ==========================================================
const stylesModal = StyleSheet.create({
  modalBackground: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'
  },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  editCard: { backgroundColor: MID, padding: 20, borderRadius: 10, width: '85%' },
  headerText: { fontSize: 18, color: PRIMARY, textAlign: 'center', marginBottom: 15 },
  input: {
    backgroundColor: INPUT_BACKGROUND,
    color: LIGHT,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: PRIMARY,
    borderWidth: 1,
  },
  saveButton: { backgroundColor: PRIMARY, padding: 12, borderRadius: 8, marginTop: 10 },
  saveButtonText: { color: WHITE, fontWeight: 'bold', textAlign: 'center' },
  cancelButton: { backgroundColor: CANCEL_COLOR, padding: 12, borderRadius: 8, marginTop: 10 },
  cancelButtonText: { color: WHITE, fontWeight: 'bold', textAlign: 'center' },
});