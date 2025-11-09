import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserContext } from "../App";
import FeatherIcon from "react-native-vector-icons/Feather";
import { db, auth, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🎨 Colores
const BACKGROUND = "#0F172A";
const TEXT_COLOR = "#E2E8F0";
const GREEN = "#22C55E";
const BLUE = "#2563EB";
const RED = "#DC2626";
const SUBTEXT = "#94A3B8";

// 📋 Item del perfil
const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.itemRow}>
    <View style={styles.itemContent}>
      <FeatherIcon name={icon} size={20} color={GREEN} style={styles.itemIcon} />
      <Text style={[styles.itemLabel, { color: TEXT_COLOR }]}>{label}</Text>
    </View>
    <Text style={[styles.itemValue, { color: TEXT_COLOR }]}>{value}</Text>
  </View>
);

const PerfilScreen = () => {
  const { userData, updateUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔄 Refrescar datos desde Firestore
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          updateUserData(docSnap.data());
        }
      }
    } catch (error) {
      console.error("Error al refrescar perfil:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  // 💾 Guardar cambios
  const saveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("❌ Error", "No se encontró usuario autenticado.");
        return;
      }
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, formData);
      updateUserData(formData);
      Alert.alert("✅ Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("❌ Error", "No se pudo actualizar el perfil");
    }
  };

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // 📸 Elegir imagen
  const pickImage = async () => {
    Alert.alert(
      "Seleccionar imagen",
      "¿De dónde deseas obtener la foto?",
      [
        { text: "Cámara", onPress: openCamera },
        { text: "Galería", onPress: openGallery },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  // 📷 Abrir cámara
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso Requerido", "Se necesita permiso para usar la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImageToFirebase(uri);
    }
  };

  // 🖼️ Abrir galería
  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso Requerido", "Se necesita permiso para acceder a la galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImageToFirebase(uri);
    }
  };

  // ☁️ Subir imagen con XHR
  const uploadImageToFirebase = async (uri) => {
    setUploading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("❌ Error", "Usuario no autenticado para subir la foto.");
      setUploading(false);
      return;
    }

    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new TypeError("Error al crear Blob"));
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const storageRef = ref(storage, `perfil/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { foto: downloadURL });
      updateUserData({ ...userData, foto: downloadURL });

      Alert.alert("✅ Éxito", "Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      Alert.alert("❌ Error", "Hubo un problema al subir la foto.");
    } finally {
      setUploading(false);
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 50, color: TEXT_COLOR }}>
          Cargando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 120 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[GREEN]}
          />
        }
      >
        <Text style={[styles.header, { color: "#F1F5F9" }]}>Perfil</Text>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
              {userData.foto ? (
                <Image source={{ uri: userData.foto }} style={styles.avatarImage} />
              ) : (
                <FeatherIcon name="user" size={40} color={GREEN} style={styles.avatar} />
              )}
            </TouchableOpacity>
            <View>
              <Text style={[styles.name, { color: "#F1F5F9" }]}>{userData.nombre}</Text>
              <Text style={styles.level}>Nivel: {userData.nivel}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setFormData({ ...userData });
              setIsEditing(true);
            }}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Datos Físicos y Objetivos</Text>
          <ProfileItem icon="user" label="Género" value={userData.genero} />
          <ProfileItem icon="repeat" label="Objetivo" value={userData.objetivo} />
          <ProfileItem icon="award" label="Nivel" value={userData.nivel} />
          <ProfileItem icon="calendar" label="Edad" value={`${userData.edad} años`} />
          <ProfileItem icon="package" label="Peso" value={`${userData.peso} kg`} />
          <ProfileItem icon="maximize" label="Altura" value={`${userData.altura} cm`} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FeatherIcon name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            {["nombre", "edad", "peso", "altura", "objetivo", "nivel", "genero"].map((field) => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                placeholderTextColor="#9ca3af"
                value={String(formData[field] || "")}
                onChangeText={(text) => handleChange(field, text)}
                style={styles.input}
              />
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: GREEN }]}
                onPress={saveChanges}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: RED }]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND },
  container: { flexGrow: 1, padding: 20, backgroundColor: BACKGROUND },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  profileHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: {
    marginRight: 15,
    borderWidth: 2,
    borderColor: GREEN,
    padding: 10,
    borderRadius: 50,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: GREEN,
    marginRight: 15,
  },
  name: { fontSize: 20, fontWeight: "bold" },
  level: { fontSize: 14, color: SUBTEXT },
  editButton: {
    backgroundColor: BLUE,
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
  },
  editButtonText: { color: TEXT_COLOR, fontWeight: "600" },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: GREEN,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  itemContent: { flexDirection: "row", alignItems: "center" },
  itemIcon: { marginRight: 10 },
  itemLabel: { fontSize: 16 },
  itemValue: { fontSize: 16, fontWeight: "500", color: SUBTEXT },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: RED,
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  logoutText: { color: TEXT_COLOR, fontWeight: "bold", marginLeft: 10, fontSize: 16 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1E293B",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: { color: GREEN, fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    backgroundColor: "#334155",
    borderRadius: 10,
    padding: 10,
    color: TEXT_COLOR,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
});

export default PerfilScreen;
