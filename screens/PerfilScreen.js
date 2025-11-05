import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserContext } from "../App";
import FeatherIcon from "react-native-vector-icons/Feather";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth"; // 👈 Para cerrar sesión

const GREEN = "#16a34a";
const BACKGROUND = "#0F172A"; // 👈 Color de fondo personalizado
const TEXT_COLOR = "#E2E8F0"; // 👈 Color de texto claro sobre fondo oscuro

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
          console.log("✅ Perfil actualizado desde Firestore");
        } else {
          console.log("⚠️ No se encontró el documento del usuario.");
        }
      }
    } catch (error) {
      console.error("❌ Error al refrescar perfil:", error);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  const saveChanges = () => {
    updateUserData(formData);
    setIsEditing(false);
  };

  // 🚪 Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("👋 Sesión cerrada correctamente");
      navigation.replace("Login"); // 👈 Redirige al login (asegúrese de tener esta pantalla en el stack)
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: BACKGROUND }]}>
        <Text style={{ textAlign: "center", marginTop: 50, color: TEXT_COLOR }}>
          Cargando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: BACKGROUND }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[GREEN]} />
        }
      >
        <Text style={[styles.header, { color: TEXT_COLOR }]}>
          Bienvenido, {userData.nombre}
        </Text>

        {/* Tarjeta de perfil */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <FeatherIcon
              name={userData.genero === "Hombre" ? "user" : "user-check"}
              size={40}
              color={GREEN}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.name, { color: "#111" }]}>{userData.nombre}</Text>
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

        {/* Ajustes */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Ajustes</Text>
          <View style={styles.itemRow}>
            <View style={styles.itemContent}>
              <FeatherIcon name="bell" size={20} color={GREEN} style={styles.itemIcon} />
              <Text style={styles.itemLabel}>Notificaciones</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                updateUserData({
                  ...userData,
                  notificacionesActivas: !userData.notificacionesActivas,
                })
              }
            >
              <FeatherIcon
                name={userData.notificacionesActivas ? "toggle-right" : "toggle-left"}
                size={30}
                color={userData.notificacionesActivas ? GREEN : "#ccc"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 🚪 Botón de cierre de sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FeatherIcon name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(t) => handleChange("nombre", t)}
              placeholder="Nombre"
            />
            <TextInput
              style={styles.input}
              value={formData.genero}
              onChangeText={(t) => handleChange("genero", t)}
              placeholder="Género (Hombre/Mujer)"
            />
            <TextInput
              style={styles.input}
              value={formData.objetivo}
              onChangeText={(t) => handleChange("objetivo", t)}
              placeholder="Objetivo"
            />
            <TextInput
              style={styles.input}
              value={formData.nivel}
              onChangeText={(t) => handleChange("nivel", t)}
              placeholder="Nivel"
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.edad?.toString()}
              onChangeText={(t) => handleChange("edad", parseInt(t) || 0)}
              placeholder="Edad"
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.peso?.toString()}
              onChangeText={(t) => handleChange("peso", parseFloat(t) || 0)}
              placeholder="Peso (kg)"
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.altura?.toString()}
              onChangeText={(t) => handleChange("altura", parseFloat(t) || 0)}
              placeholder="Altura (cm)"
            />

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: GREEN }]}
              onPress={saveChanges}
            >
              <Text style={styles.modalButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#999" }]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const BG = "#0F172A"; // fondo azul oscuro
const TEXT = "#F1F5F9"; // texto principal claro
const SUBTEXT = "#94A3B8"; // texto secundario gris-azulado
const GREEN = "#22C55E"; // verde de acento
const BLUE = "#2563EB"; // azul brillante para botones
const RED = "#DC2626"; // rojo para cerrar sesión

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BG,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: TEXT,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    marginRight: 15,
    borderWidth: 2,
    borderColor: GREEN,
    padding: 10,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXT,
  },
  level: {
    fontSize: 14,
    color: SUBTEXT,
  },
  editButton: {
    backgroundColor: BLUE,
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: TEXT,
    fontWeight: "600",
  },
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
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 10,
    width: 20,
  },
  itemLabel: {
    fontSize: 16,
    color: TEXT,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "500",
    color: SUBTEXT,
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
    color: TEXT,
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#1E293B",
    padding: 25,
    borderRadius: 15,
    width: "90%",
    marginTop: 60,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: GREEN,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#475569",
    backgroundColor: "#0F172A",
    color: TEXT,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    backgroundColor: BLUE,
  },
  modalButtonText: {
    color: TEXT,
    fontWeight: "bold",
    textAlign: "center",
  },
});
