import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';

// 🎨 Nueva paleta de colores (azules)
const BG = '#0F172A';         // Fondo oscuro
const INPUT_BG = '#1E293B';   // Azul grisáceo
const BUTTON = '#1D4ED8';     // Azul brillante
const BUTTON_ALT = '#3B82F6'; // Azul claro
const TEXT = '#FFFFFF';       // Blanco puro
const SUBTEXT = '#94A3B8';    // Gris azulado suave

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 💪 Logo animado */}
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        easing="ease-in-out"
        duration={1500}
        style={styles.logoContainer}
      >
        <Text style={styles.logo}>💪</Text>
      </Animatable.View>

      {/* ✨ Título */}
      <Animatable.Text
        animation="fadeInUp"
        delay={300}
        duration={1000}
        style={styles.title}
      >
        ¡Bienvenido a Power PD!
      </Animatable.Text>

      {/* 🏋 Subtítulo */}
      <Animatable.Text
        animation="fadeInUp"
        delay={700}
        duration={1000}
        style={styles.subtitle}
      >
        Tu compañero para entrenar y mantenerte en forma.
      </Animatable.Text>

      {/* 🚀 Botón principal */}
      <Animatable.View
        animation="fadeInUp"
        delay={1200}
        duration={1000}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: SUBTEXT,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: BUTTON,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: BUTTON_ALT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
