// screens/PerfilScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { UserContext } from '../App'; 
import FeatherIcon from 'react-native-vector-icons/Feather';

const GREEN = "#16a34a";

// Componente para una fila de información estática
const ProfileItem = ({ icon, label, value }) => (
    <View style={styles.itemRow}>
        <View style={styles.itemContent}>
            <FeatherIcon name={icon} size={20} color={GREEN} style={styles.itemIcon} />
            <Text style={styles.itemLabel}>{label}</Text>
        </View>
        <Text style={styles.itemValue}>{value}</Text>
    </View>
);

const PerfilScreen = ({ navigation }) => {
    const { userData, updateUserData } = useContext(UserContext); 
    const [isRatingModalVisible, setRatingModalVisible] = useState(false);
    const [tempRating, setTempRating] = useState(String(userData.valoracion || 5));
    const [ratingError, setRatingError] = useState('');

    // Evitar que userData sea undefined
    if (!userData) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={{ textAlign:'center', marginTop:50 }}>Cargando perfil...</Text>
            </SafeAreaView>
        );
    }

    const toggleNotifications = () => {
        updateUserData({ notificacionesActivas: !userData.notificacionesActivas });
    };
    
    const openRatingModal = () => {
        setRatingError('');
        setTempRating(String(userData.valoracion || 5));
        setRatingModalVisible(true);
    }

    const handleSaveRating = () => {
        setRatingError('');
        const newRating = parseFloat(tempRating);
        if (isNaN(newRating) || newRating < 1 || newRating > 5 || !Number.isInteger(newRating)) {
            setRatingError("La valoración debe ser un número entero entre 1 y 5.");
            return;
        }
        updateUserData({ valoracion: newRating });
        setRatingModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>Bienvenido, {userData.nombre}</Text>

                {/* Tarjeta de Resumen General */}
                <View style={styles.card}>
                    <View style={styles.profileHeader}>
                        <FeatherIcon 
                            name={userData.genero === 'Hombre' ? 'user' : 'user-check'} 
                            size={40} 
                            color={GREEN} 
                            style={styles.avatar} 
                        />
                        <View>
                            <Text style={styles.name}>{userData.nombre}</Text>
                            <Text style={styles.level}>Nivel: {userData.nivel}</Text>
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={() => navigation.navigate('Configuration')}
                    >
                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Tarjeta de Datos Físicos */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Datos Físicos y Objetivos</Text>
                    <ProfileItem icon="repeat" label="Objetivo" value={userData.objetivo} />
                    <ProfileItem icon="maximize" label="Altura" value={`${userData.altura} cm`} />
                    <ProfileItem icon="package" label="Peso" value={`${userData.peso} kg`} />
                    <ProfileItem icon="calendar" label="Edad" value={`${userData.edad} años`} />
                    <ProfileItem icon="user" label="Género" value={userData.genero} />
                </View>

                {/* Tarjeta de Ajustes */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>Ajustes</Text>
                    
                    <View style={styles.itemRow}>
                        <View style={styles.itemContent}>
                            <FeatherIcon name="bell" size={20} color={GREEN} style={styles.itemIcon} />
                            <Text style={styles.itemLabel}>Notificaciones</Text>
                        </View>
                        <TouchableOpacity onPress={toggleNotifications}>
                            <FeatherIcon 
                                name={userData.notificacionesActivas ? 'toggle-right' : 'toggle-left'} 
                                size={30} 
                                color={userData.notificacionesActivas ? GREEN : '#aaa'}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.itemRow} onPress={openRatingModal}>
                        <View style={styles.itemContent}>
                            <FeatherIcon name="star" size={20} color={GREEN} style={styles.itemIcon} />
                            <Text style={styles.itemLabel}>Valoración de la App</Text>
                        </View>
                        <Text style={styles.itemValue}>{`${userData.valoracion}/5`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Modal de Valoración */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isRatingModalVisible}
                onRequestClose={() => setRatingModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Valora nuestra App</Text>
                        <Text style={styles.modalText}>Ingresa tu valoración (1 a 5):</Text>
                        <TextInput 
                            style={styles.ratingInput}
                            value={tempRating}
                            onChangeText={setTempRating}
                            keyboardType="number-pad"
                            placeholder="1-5"
                            maxLength={1}
                        />
                        {ratingError ? <Text style={styles.errorText}>{ratingError}</Text> : null}
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: GREEN }]} onPress={handleSaveRating}>
                            <Text style={styles.buttonText}>Guardar Valoración</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#aaa' }]} onPress={() => setRatingModalVisible(false)}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
    container: { padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, shadowColor: "#000", shadowOffset: { width:0, height:1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation:2 },
    profileHeader: { flexDirection:'row', alignItems:'center', marginBottom:10 },
    avatar: { marginRight:15, borderWidth:2, borderColor:GREEN, padding:10, borderRadius:50 },
    name: { fontSize:20, fontWeight:'bold', color:'#333' },
    level: { fontSize:14, color:'#666' },
    editButton: { backgroundColor:'#f0f0f0', padding:10, borderRadius:25, marginTop:10, alignItems:'center' },
    editButtonText: { color:GREEN, fontWeight:'600' },
    cardHeader: { fontSize:18, fontWeight:'bold', marginBottom:10, color:GREEN, borderBottomWidth:1, borderBottomColor:'#eee', paddingBottom:5 },
    itemRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#f7f7f7' },
    itemContent: { flexDirection:'row', alignItems:'center' },
    itemIcon: { marginRight:10, width:20 },
    itemLabel: { fontSize:16, color:'#444' },
    itemValue: { fontSize:16, fontWeight:'500', color:'#666' },
    centeredView: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
    modalView: { margin:20, backgroundColor:'white', borderRadius:20, padding:35, alignItems:'center', shadowColor:'#000', shadowOffset:{ width:0, height:2 }, shadowOpacity:0.25, shadowRadius:4, elevation:5 },
    modalTitle: { fontSize:20, fontWeight:'bold', marginBottom:10, color:GREEN },
    modalText: { marginBottom:10, textAlign:'center', fontSize:16 },
    ratingInput: { borderWidth:1, borderColor:'#ccc', padding:10, borderRadius:8, width:80, textAlign:'center', fontSize:18, marginBottom:15 },
    errorText: { color:'#dc2626', marginBottom:10, fontSize:14, fontWeight:'600', textAlign:'center' },
    modalButton: { borderRadius:25, padding:12, elevation:2, marginTop:10, width:180 },
    buttonText: { color:'white', fontWeight:'bold', textAlign:'center' },
});

export default PerfilScreen;
