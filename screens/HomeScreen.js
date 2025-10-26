import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      <Text style={styles.text}>Selecciona una opción:</Text>

      <Button title="🏋️ Ver Rutinas" onPress={() => onNavigate('rutinas')} />
      <Button title="🏆 Desafíos" onPress={() => onNavigate('desafios')} />
      <Button title="🔔 Alertas" onPress={() => onNavigate('alertas')} />
      <Button title="👤 Perfil" onPress={() => onNavigate('perfil')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { marginBottom: 30, fontSize: 16 },
});
