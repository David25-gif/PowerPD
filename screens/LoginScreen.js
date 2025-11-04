import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
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
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#ccc"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <Text style={styles.text}>¿No tienes cuenta?</Text>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.buttonText}>REGÍSTRATE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A', // azul oscuro
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 25,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
  },
  passwordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#1E293B',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#FFFFFF',
  },
  button: {
    width: '80%',
    backgroundColor: '#1D4ED8', // azul brillante
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#3B82F6', // azul más claro
  },
  text: {
    color: '#94A3B8',
    marginTop: 10,
  },
});
