import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';


const FIRE = '#FF4500';      
const FIRE_LIGHT = '#FF6347'; 
const TEXT = '#FFFFFF';      

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/ImageHombre.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      
      <SafeAreaView style={styles.container}>
        
        {/* Título animado con efecto de zoom */}
        <Animatable.Text
          animation="pulse" // 🔹 efecto de zoom
          iterationCount="infinite"
          easing="ease-in-out"
          duration={1500}
          style={styles.title}
        >
          ¡Bienvenido a Power PD!
        </Animatable.Text>

        {/* Subtítulo animado */}
        <Animatable.Text
          animation="fadeIn"
          delay={500}
          duration={1500}
          style={styles.subtitle}
        >
          Tu compañero para entrenar y mantenerte en forma.
        </Animatable.Text>

        {/* Botón animado */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end', // todo más abajo
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: FIRE, // 🔥 Color fuego
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: FIRE_LIGHT, // 🔥 Subtítulo fuego
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: FIRE, // 🔥 Botón fuego
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: FIRE_LIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  buttonText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
