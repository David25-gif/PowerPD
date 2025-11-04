import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DesafiosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Desafíos Activos</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reto de Core - 7 Días</Text>
        <Text style={styles.cardText}>Progreso: 3/7 completado</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#f59e0b' }]}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  cardText: { color: '#6b7280', marginBottom: 10 },
  button: { borderRadius: 8, alignItems: 'center', paddingVertical: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
