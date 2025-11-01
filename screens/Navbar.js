// ./screens/Navbar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const GREEN = "#16a34a"; 

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => setActiveTab("rutinas")} style={styles.item}>
        <FontAwesome5 name="dumbbell" size={20} color={activeTab === "rutinas" ? GREEN : "#9ca3af"} />
        <Text style={activeTab === "rutinas" ? styles.activeText : styles.text}>Rutinas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveTab("desafios")} style={styles.item}>
        <FontAwesome5 name="trophy" size={20} color={activeTab === "desafios" ? GREEN : "#9ca3af"} />
        <Text style={activeTab === "desafios" ? styles.activeText : styles.text}>Desafíos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveTab("perfil")} style={styles.item}>
        <FontAwesome5 name="user" size={20} color={activeTab === "perfil" ? GREEN : "#9ca3af"} />
        <Text style={activeTab === "perfil" ? styles.activeText : styles.text}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
  },
  item: { 
    alignItems: "center" 
  },

  text: { 
    fontSize: 12, 
    color: "#9ca3af", 
    marginTop: 4 
  },

  activeText: { 
    fontSize: 12, 
    fontWeight: "bold", 
    color: GREEN, 
    marginTop: 4 
  },
});
