import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";




export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validar formato del email
  const validarEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // Validar contraseña por detalle
  function validarPasswordDetalle(clave) {
    return {
      minLength: clave.length >= 8,
      hasLower: /[a-z]/.test(clave),
      hasUpper: /[A-Z]/.test(clave),
      hasNumber: /\d/.test(clave),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(clave),
    };
  }

  // Mostrar alertas (funciona en Snack)
  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const handleRegistro = async () => {
  if (!nombre || !email || !password || !confirmPassword) {
    mostrarAlerta('Campos incompletos', 'Por favor completa todos los campos.');
    return;
  }

  if (!validarEmail(email)) {
    mostrarAlerta('Correo inválido', 'Ingresa un correo electrónico válido.');
    return;
  }

  const detalle = validarPasswordDetalle(password);
  if (
    !detalle.minLength ||
    !detalle.hasLower ||
    !detalle.hasUpper ||
    !detalle.hasNumber ||
    !detalle.hasSymbol
  ) {
    let mensajes = [];
    if (!detalle.minLength) mensajes.push('- Mínimo 8 caracteres');
    if (!detalle.hasUpper) mensajes.push('- Al menos una letra MAYÚSCULA');
    if (!detalle.hasLower) mensajes.push('- Al menos una letra minúscula');
    if (!detalle.hasNumber) mensajes.push('- Al menos un número');
    if (!detalle.hasSymbol)
      mensajes.push('- Al menos un símbolo (ej: ! @ # $ % _ - . , etc.)');

    const texto = 'La contraseña debe cumplir:\n' + mensajes.join('\n');
    mostrarAlerta('Contraseña insegura', texto);
    return;
  }

  if (password !== confirmPassword) {
    mostrarAlerta('Error', 'Las contraseñas no coinciden.');
    return;
  }

  try {
    // ✅ Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // ✅ Guardar el nombre del usuario en su perfil
    await updateProfile(userCredential.user, { displayName: nombre });

    mostrarAlerta('✅ Registro exitoso', 'Tu cuenta ha sido creada con éxito.');

    // Redirigir al login
    navigation.navigate('Login');

    // Limpiar los campos
    setNombre('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  } catch (error) {
    console.log("Error en Firebase:", error.message);

    if (error.code === 'auth/email-already-in-use') {
      mostrarAlerta('Error', 'El correo ya está registrado.');
    } else if (error.code === 'auth/weak-password') {
      mostrarAlerta('Error', 'La contraseña es demasiado débil.');
    } else {
      mostrarAlerta('Error', 'No se pudo crear la cuenta.');
    }
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Contraseña */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Confirmar contraseña */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmar contraseña"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleRegistro} />
      </View>

      <Text style={styles.link}>¿Ya tienes cuenta?</Text>
      <Button title="Inicia sesión" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

// --- ESTILOS ---
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
