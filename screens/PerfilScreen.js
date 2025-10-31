import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { UserContext } from "../App";
import FeatherIcon from "react-native-vector-icons/Feather";

const GREEN = "#16a34a";

const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.itemRow}>
    <View style={styles.itemContent}>
      <FeatherIcon name={icon} size={20} color={GREEN} style={styles.itemIcon} />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <Text style={styles.itemValue}>{value}</Text>
  </View>
);

const PerfilScreen = () => {
  const { userData, updateUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  // Estado temporal para edición
  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    updateUserData(formData);
    setIsEditing(false);
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Cargando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Bienvenido, {userData.nombre}</Text>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <FeatherIcon
              name={userData.genero === "Hombre" ? "user" : "user-check"}
              size={40}
              color={GREEN}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{userData.nombre}</Text>
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
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            {/* Campos editables */}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  container: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  profileHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: {
    marginRight: 15,
    borderWidth: 2,
    borderColor: GREEN,
    padding: 10,
    borderRadius: 50,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#333" },
  level: { fontSize: 14, color: "#666" },
  editButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
  },
  editButtonText: { color: GREEN, fontWeight: "600" },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: GREEN,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f7f7f7",
  },
  itemContent: { flexDirection: "row", alignItems: "center" },
  itemIcon: { marginRight: 10, width: 20 },
  itemLabel: { fontSize: 16, color: "#444" },
  itemValue: { fontSize: 16, fontWeight: "500", color: "#666" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
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
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  modalButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});

export default PerfilScreen;
