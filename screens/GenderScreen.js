import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/styles';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

function GenderScreen({ navigation }) {
  const handleGenero = async (selectedGenero) => {
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "usuarios", uid), { genero: selectedGenero });
    navigation.replace("EdadPesoScreen", { genero: selectedGenero });
  };

  const GeneroOption = ({ label, image }) => (
    <TouchableOpacity 
      onPress={() => handleGenero(label)} 
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
