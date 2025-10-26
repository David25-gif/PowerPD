import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AlertasScreen() {
  const alertas = [
    { id: '1', mensaje: '⚠️ Recuerda hidratarte después del entrenamiento.' },
    { id: '2', mensaje: '💧 Nueva rutina disponible: Cardio Express' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Alertas Recientes</Text>
      {alertas.map((a) => (
        <View key={a.id} style={styles.card}>
          <Text style={styles.text}>{a.mensaje}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 10,
  },
  text: { color: '#111827' },
});
