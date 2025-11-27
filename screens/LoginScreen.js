import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  Platform, ImageBackground, ScrollView, KeyboardAvoidingView 
} from 'react-native';
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
    <ImageBackground
      source={require('../assets/ImageMusculo.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#ffffffff"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor="#ffffffff"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#ffffffff"
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
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(165, 165, 167, 0.29)', 
    marginHorizontal: 20,
    borderRadius: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fffdfdff', 
    marginBottom: 25,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#FF4500',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fa806bd3', 
    color: '#fff',
    marginTop: 60,
  },
  passwordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF4500',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fa806bd3',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#fff',
  },
  button: {
    width: '90%',
    backgroundColor: '#FF4500', 
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#ff4322ff', 
  },
  text: {
    color: '#fdebe4ff',
    marginTop: 10,
  },
});
