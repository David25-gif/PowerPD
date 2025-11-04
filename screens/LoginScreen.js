import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      mostrarAlerta('Campos incompletos', 'Por favor, completa ambos campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      mostrarAlerta('Inicio de sesión exitoso', `¡Bienvenido, ${user.displayName || user.email}!`);

      // 🔹 Verificar perfil del usuario en Firestore
      const uid = user.uid;
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);
      const perfil = docSnap.exists() ? docSnap.data() : {};

      if (!perfil.genero) {
        navigation.replace("Genero");
      } else if (!perfil.edad || !perfil.peso) {
        navigation.replace("EdadPesoScreen", { genero: perfil.genero });
      } else {
        navigation.replace("Home");
      }

    } catch (error) {
      console.log("Error al iniciar sesión:", error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          mostrarAlerta('Correo inválido', 'El formato del correo no es correcto.');
          break;
        case 'auth/user-not-found':
          mostrarAlerta('Usuario no encontrado', 'No existe una cuenta con ese correo.');
          break;
        case 'auth/wrong-password':
          mostrarAlerta('Contraseña incorrecta', 'La contraseña ingresada no es válida.');
          break;
        default:
          mostrarAlerta('Error', 'No se pudo iniciar sesión. Intenta más tarde.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} />
      </View>

      <Text style={styles.link}>¿No tienes cuenta?</Text>
      <Button title="Regístrate" onPress={() => navigation.navigate('Registro')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25 },
  input: { width: '90%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
  passwordContainer: { width: '90%', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff' },
  passwordInput: { flex: 1, padding: 10 },
  buttonContainer: { width: '80%', marginVertical: 10 },
  link: { marginTop: 10, color: '#333' },
});
