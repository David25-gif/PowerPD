import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export default function EdadPesoScreen({ navigation, route }) {
  const genero = route?.params?.genero || "No especificado";
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');

  const handleGuardar = async () => {
  if (!edad || !peso) {
    alert("Por favor completa todos los campos");
    return;
  }
  try {
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "usuarios", uid), { 
      edad, 
      peso, 
      profileComplete: true // <-- agregado
    });
    navigation.replace("Home");
  } catch (error) {
    console.log("Error actualizando perfil:", error);
    alert("Error al actualizar el perfil");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completa tu perfil</Text>
      <Text style={styles.subtitle}>Género seleccionado: {genero}</Text>
      <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="numeric" />
      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'#f5f7fa' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:10 },
  subtitle:{ fontSize:16, marginBottom:20 },
  input:{ width:"90%", borderWidth:1, borderColor:"#ccc", borderRadius:10, padding:10, marginBottom:15, backgroundColor:"#fff" }
});
