import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  // ⚙️ Configuración del inicio de sesión con Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "TU_CLIENT_ID_WEB.apps.googleusercontent.com", // <--- REEMPLAZA AQUÍ
  });

  // 🎯 Cuando el usuario inicia sesión correctamente
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    } else if (response?.type === "error") {
      Alert.alert("Error", "No se pudo iniciar sesión con Google.");
    }
  }, [response]);

  // 🧠 Obtener los datos del usuario
  const fetchUserInfo = async (token) => {
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await userInfoResponse.json();

      // Guarda los datos localmente
      await AsyncStorage.setItem("usuario", JSON.stringify(user));

      Alert.alert("Bienvenido", `Hola ${user.name}`);
      navigation.replace("Home"); // Redirige a la pantalla principal
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      Alert.alert("Error", "No se pudieron obtener los datos de Google.");
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="logo-google" size={80} color="#A66EFF" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Inicia sesión con Google</Text>

      <TouchableOpacity
        disabled={!request}
        style={styles.googleButton}
        onPress={() => promptAsync()}
      >
        <Ionicons name="logo-google" size={24} color="#fff" />
        <Text style={styles.googleButtonText}>Continuar con Google</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171320",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#A66EFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
