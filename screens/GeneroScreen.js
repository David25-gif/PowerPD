
import React from 'react';
import { View, Text, Button,TouchableOpacity ,Image , AuthScreenWrapper} from 'react-native';
import styles from '../styles/styles';

function GeneroScreen({ navigation }) {
    const GeneroOption = ({ label, image, target }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate(target)} 
            style={[styles.genderOption, label === 'Mujer' ? { borderColor: '#9C27B0' } : { borderColor: '#2196F3' }]}
        >
            <Image 
                source={{ uri: image }}
                style={styles.genderImage} 
            />
            <Text style={styles.genderText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <AuthScreenWrapper title="¿Qué eres?">
            <View style={styles.genderContainer}>
                <GeneroOption 
                    label="Mujer" 
                    image='https://placehold.co/100x100/9C27B0/ffffff?text=F' 
                    target='ProfileSetup'
                />
                <GeneroOption 
                    label="Hombre" 
                    image='https://placehold.co/100x100/2196F3/ffffff?text=M' 
                    target='ProfileSetup'
                />
            </View>
        </AuthScreenWrapper>
    );
}