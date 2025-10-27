import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const mostrarAlerta = (titulo, mensaje) => {
    // Mostrar alertas que funcionen tanto en móvil como en web (Snack)
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
    // 🔥 Autenticación con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    mostrarAlerta('Inicio de sesión exitoso', `¡Bienvenido, ${user.displayName || user.email}!`);
    navigation.navigate('Home');

  } catch (error) {
    console.log("Error al iniciar sesión:", error.code);

    // Manejo de errores comunes de Firebase
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
      case 'auth/invalid-credential':
        mostrarAlerta('Error', 'Credenciales inválidas.');
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  link: {
    marginTop: 10,
    color: '#333',
  },
});
