import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { UserContext } from '../App';

// Paleta de colores
const BG = '#0F172A';         // Fondo azul oscuro
const BUTTON = '#1D4ED8';     // Azul brillante
const BUTTON_ALT = '#3B82F6'; // Azul claro (sombra)
const TEXT = '#FFFFFF';       // Blanco
const SUBTEXT = '#94A3B8';    // Gris azulado suave

export default function RegistroScreen({ navigation }) {
  const { updateUserData } = useContext(UserContext);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const validarEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const validarPasswordDetalle = (clave) => ({
    minLength: clave.length >= 8,
    hasLower: /[a-z]/.test(clave),
    hasUpper: /[A-Z]/.test(clave),
    hasNumber: /\d/.test(clave),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(clave),
  });

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
    if (!detalle.minLength || !detalle.hasLower || !detalle.hasUpper || !detalle.hasNumber || !detalle.hasSymbol) {
      let mensajes = [];
      if (!detalle.minLength) mensajes.push('- Mínimo 8 caracteres');
      if (!detalle.hasUpper) mensajes.push('- Al menos una letra MAYÚSCULA');
      if (!detalle.hasLower) mensajes.push('- Al menos una letra minúscula');
      if (!detalle.hasNumber) mensajes.push('- Al menos un número');
      if (!detalle.hasSymbol) mensajes.push('- Al menos un símbolo (ej: ! @ # $ % _ - . , etc.)');
      mostrarAlerta('Contraseña insegura', 'La contraseña debe cumplir:\n' + mensajes.join('\n'));
      return;
    }

    if (password !== confirmPassword) {
      mostrarAlerta('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nombre });

      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nombre,
        email,
        genero: "",
        edad: "",
        peso: "",
        profileComplete: false,
      });

      updateUserData({ nombre });

      mostrarAlerta(' Registro exitoso', 'Tu cuenta ha sido creada con éxito.');
      navigation.replace("Genero");

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
        placeholderTextColor={SUBTEXT}
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={SUBTEXT}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor={SUBTEXT}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={SUBTEXT} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmar contraseña"
          placeholderTextColor={SUBTEXT}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color={SUBTEXT} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegistro}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={styles.link}>¿Ya tienes cuenta?</Text>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonAltText}>Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BUTTON_ALT,
    marginBottom: 30,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: BUTTON_ALT,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#1E293B',
    color: TEXT,
    fontSize: 16,
  },
  passwordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BUTTON_ALT,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#1E293B',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: TEXT,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: BUTTON,
    paddingVertical: 14,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: BUTTON_ALT,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    color: SUBTEXT,
    fontSize: 14,
  },
  buttonSecondary: {
    marginTop: 10,
    borderColor: BUTTON_ALT,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonAltText: {
    color: BUTTON_ALT,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
