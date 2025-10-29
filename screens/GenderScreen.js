import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/styles';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

function GenderScreen({ navigation }) {

const handleGender = async (selectedGenero) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("No hay usuario autenticado. Inicia sesión antes de continuar.");
      return;
    }

    const uid = user.uid;

    // crea o actualiza el documento
    await setDoc(
      doc(db, "usuarios", uid),
      { genero: selectedGenero },
      { merge: true } // 🔹 agrega o actualiza el campo sin borrar los demás
    );

    console.log("Género guardado correctamente:", selectedGenero);
    navigation.replace("EdadPesoScreen", { genero: selectedGenero });

  } catch (error) {
    console.error("Error guardando genero:", error);
    alert("Ocurrió un error guardando tu selección. Intenta nuevamente.");
  }
};





  const GeneroOption = ({ label, image }) => (
    <TouchableOpacity 
      onPress={() => handleGender(label)} 
      style={[
        styles.genderOption, 
        label === 'Mujer' ? { borderColor: '#9C27B0' } : { borderColor: '#2196F3' }
      ]}
    >
      <Image source={{ uri: image }} style={styles.genderImage} />
      <Text style={styles.genderText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.genderContainer}>
      <Text style={styles.title}>¿Qué eres?</Text>
      <GeneroOption label="Mujer" image='https://placehold.co/100x100/9C27B0/ffffff?text=F' />
      <GeneroOption label="Hombre" image='https://placehold.co/100x100/2196F3/ffffff?text=M' />
    </View>
  );
}

export default GenderScreen;
