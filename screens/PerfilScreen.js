import React, { useContext, useState, useCallback } from "react";
<<<<<<< HEAD
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
    Alert 
=======
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
>>>>>>> 8112228 (Estuve tratando de arreglar el perfil por el error que no se puede subir la foto)
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

// Definición de colores
const BACKGROUND = "#0F172A";
const TEXT_COLOR = "#E2E8F0";
const GREEN = "#22C55E";
const BLUE = "#2563EB";
const RED = "#DC2626";
const SUBTEXT = "#94A3B8";

// Componente para mostrar un ítem del perfil
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 8112228 (Estuve tratando de arreglar el perfil por el error que no se puede subir la foto)
        }
        setRefreshing(false);
    };

<<<<<<< HEAD
=======
<<<<<<< HEAD
    // Refrescar datos cada vez que la pantalla está enfocada
>>>>>>> c58a0bb (Ese --continuestuve tratando de arreglar el perfil por el error que no se puede subir la foto)
    useFocusEffect(
        useCallback(() => {
            handleRefresh();
        }, [])
=======
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  // 💾 Guardar cambios
  const saveChanges = async () => {
    try {
      const user = auth.currentUser;
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
>>>>>>> 8112228 (Estuve tratando de arreglar el perfil por el error que no se puede subir la foto)
    );

    // 💾 Guardar cambios en Firestore
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

    // Menú de selección de imagen
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

    // Abrir cámara
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

    // Abrir galería
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

    // ☁️ FUNCIÓN CLAVE: Subir imagen a Firebase Storage (SOLUCIÓN XHR para evitar el error _location)
    const uploadImageToFirebase = async (uri) => {
        setUploading(true);
        const user = auth.currentUser;

        if (!user) {
            Alert.alert("❌ Error", "Usuario no autenticado para subir la foto.");
            setUploading(false);
            return;
        }

        try {
            // --- 🔑 CLAVE: Usar XMLHttpRequest para crear el Blob de manera compatible ---
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    // La respuesta es un Blob
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.error("XHR Error:", e);
                    reject(new TypeError("Fallo al crear el Blob desde la URI local."));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            if (!blob) {
                 throw new Error("No se pudo obtener el Blob de la imagen.");
            }
            
            // 2. Subir a Firebase Storage
            const storageRef = ref(storage, `perfil/${user.uid}.jpg`);
            await uploadBytes(storageRef, blob);

            // 3. Obtener URL y actualizar Firestore
            const downloadURL = await getDownloadURL(storageRef);

            const userRef = doc(db, "usuarios", user.uid);
            await updateDoc(userRef, { foto: downloadURL });
            updateUserData({ ...userData, foto: downloadURL });

            Alert.alert("✅ Éxito", "Foto de perfil actualizada correctamente");

        } catch (error) {
            // Este console.error mostrará el detalle técnico del error
            console.error("Error al subir imagen (XHR):", error);
            
            // Este Alert es el feedback que ve el usuario
            Alert.alert("❌ Error", "Hubo un problema al subir la foto. Inténtalo de nuevo.");

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

<<<<<<< HEAD
=======
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

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Se necesita permiso para acceder a la galería");
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

  const uploadImageToFirebase = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;

      const storageRef = ref(storage, `perfil/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { foto: downloadURL });
      updateUserData({ ...userData, foto: downloadURL });

      alert("✅ Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("❌ Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  if (!userData) {
>>>>>>> 8112228 (Estuve tratando de arreglar el perfil por el error que no se puede subir la foto)
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

                {/* Tarjeta de perfil */}
                <View style={styles.card}>
                    <View style={styles.profileHeader}>
                        {/* BOTÓN PARA SUBIR/CAMBIAR FOTO */}
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

                {/* Datos físicos */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Datos Físicos y Objetivos</Text>
                    <ProfileItem icon="user" label="Género" value={userData.genero} />
                    <ProfileItem icon="repeat" label="Objetivo" value={userData.objetivo} />
                    <ProfileItem icon="award" label="Nivel" value={userData.nivel} />
                    <ProfileItem icon="calendar" label="Edad" value={`${userData.edad} años`} />
                    <ProfileItem icon="package" label="Peso" value={`${userData.peso} kg`} />
                    <ProfileItem icon="maximize" label="Altura" value={`${userData.altura} cm`} />
                </View>

                {/* Cerrar sesión */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <FeatherIcon name="log-out" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* MODAL DE EDICIÓN */}
            <Modal visible={isEditing} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Perfil</Text>

                        <TextInput
                            placeholder="Nombre"
                            placeholderTextColor="#9ca3af"
                            value={formData.nombre}
                            onChangeText={(text) => handleChange("nombre", text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Edad"
                            placeholderTextColor="#9ca3af"
                            value={String(formData.edad || "")}
                            onChangeText={(text) => handleChange("edad", text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Peso (kg)"
                            placeholderTextColor="#9ca3af"
                            value={String(formData.peso || "")}
                            onChangeText={(text) => handleChange("peso", text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Altura (cm)"
                            placeholderTextColor="#9ca3af"
                            value={String(formData.altura || "")}
                            onChangeText={(text) => handleChange("altura", text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Objetivo"
                            placeholderTextColor="#9ca3af"
                            value={formData.objetivo}
                            onChangeText={(text) => handleChange("objetivo", text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Nivel"
                            placeholderTextColor="#9ca3af"
                            value={formData.nivel}
                            onChangeText={(text) => handleChange("nivel", text)}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Género"
                            placeholderTextColor="#9ca3af"
                            value={formData.genero}
                            onChangeText={(text) => handleChange("genero", text)}
                            style={styles.input}
                        />

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
<<<<<<< HEAD
};

// Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: BACKGROUND },
    container: { flexGrow: 1, 
        padding: 20, 
        backgroundColor: BACKGROUND 
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    profileHeader: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 10 
    },
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
    level: { fontSize: 14, 
        color: SUBTEXT 
    },

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
    itemContent: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    itemIcon: { marginRight: 10 },
    itemLabel: { fontSize: 16 },

    itemValue: { fontSize: 16, 
        fontWeight: "500", 
        color: SUBTEXT 
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: RED,
        padding: 15,
        borderRadius: 12,
        marginBottom: 30,
    },
    logoutText: {
        color: TEXT_COLOR,
        fontWeight: "bold",
        marginLeft: 10,
        fontSize: 16,
    },
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
    modalTitle: {
        color: GREEN,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#334155",
        borderRadius: 10,
        padding: 10,
        color: TEXT_COLOR,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 10 
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    modalButtonText: { 
        color: "#fff", 
        fontWeight: "bold" 
    },
=======
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
            <TouchableOpacity onPress={pickImage}>
              {userData.foto ? (
                <Image source={{ uri: userData.foto }} style={styles.avatarImage} />
              ) : (
                <FeatherIcon
                  name="user"
                  size={40}
                  color={GREEN}
                  style={styles.avatar}
                />
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

      {/* ✏️ MODAL DE EDICIÓN */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#9ca3af"
              value={formData.nombre}
              onChangeText={(text) => handleChange("nombre", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Edad"
              placeholderTextColor="#9ca3af"
              value={String(formData.edad || "")}
              onChangeText={(text) => handleChange("edad", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Peso (kg)"
              placeholderTextColor="#9ca3af"
              value={String(formData.peso || "")}
              onChangeText={(text) => handleChange("peso", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Altura (cm)"
              placeholderTextColor="#9ca3af"
              value={String(formData.altura || "")}
              onChangeText={(text) => handleChange("altura", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Objetivo"
              placeholderTextColor="#9ca3af"
              value={formData.objetivo}
              onChangeText={(text) => handleChange("objetivo", text)}
              style={styles.input}
            />

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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND },
  container: { flexGrow: 1, padding: 20, backgroundColor: BACKGROUND },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
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
  logoutText: {
    color: TEXT_COLOR,
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  // 🔹 Modal
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
  modalTitle: {
    color: GREEN,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
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
>>>>>>> 8112228 (Estuve tratando de arreglar el perfil por el error que no se puede subir la foto)
});

export default PerfilScreen;