import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="user-circle" size={90} color="#9333ea" />
      <Text style={styles.name}>Paola Fit</Text>
      <Text style={styles.level}>Nivel: Intermedio</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  level: { color: '#6b7280', marginBottom: 20 },
  button: { backgroundColor: '#9333ea', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
