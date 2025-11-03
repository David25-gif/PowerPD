import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { UserContext } from "../App";

export default function ProgressScreen() {
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState({});
  const [progressData, setProgressData] = useState({
    move: 0,
    exercise: 0,
    stand: 0,
  });

  // --- Cargar progreso guardado ---
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedDays = await AsyncStorage.getItem("rutinaProgressDays");
        const savedStats = await AsyncStorage.getItem("rutinaStats");

        if (savedDays) setSelectedDays(JSON.parse(savedDays));
        if (savedStats) setProgressData(JSON.parse(savedStats));
      } catch (err) {
        console.log("Error al cargar progreso:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  // --- Guardar progreso ---
  const saveProgress = async (newDays, newStats) => {
    try {
      await AsyncStorage.setItem("rutinaProgressDays", JSON.stringify(newDays));
      await AsyncStorage.setItem("rutinaStats", JSON.stringify(newStats));
    } catch (err) {
      console.log("Error al guardar progreso:", err);
    }
  };

  // --- Marcar día completado ---
  const handleDaySelect = (day) => {
    const newState = {
      ...selectedDays,
      [day.dateString]: !selectedDays[day.dateString],
    };

    const completados = Object.values(newState).filter(Boolean).length;
    const newStats = {
      move: Math.min(completados * 50, 800),
      exercise: Math.min(completados * 5, 30),
      stand: Math.min(completados * 1, 12),
    };

    setSelectedDays(newState);
    setProgressData(newStats);
    saveProgress(newState, newStats);
  };

  const getPercent = (value, goal) => Math.min((value / goal) * 100, 100);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A66EFF" />
        <Text style={{ color: "#CDB8FF", marginTop: 10 }}>Cargando progreso...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {userData?.nombre ? `Progreso de ${userData.nombre}` : "Progreso de Rutinas"}
      </Text>

      {/* --- Anillos de Actividad --- */}
      <View style={styles.ringsContainer}>
        {[
          { color: "#C084FC", label: "CAL", value: progressData.move, goal: 800 },
          { color: "#A78BFA", label: "MIN", value: progressData.exercise, goal: 30 },
          { color: "#7C3AED", label: "HRS", value: progressData.stand, goal: 12 },
        ].map((item, index) => (
          <View style={styles.ring} key={index}>
            <AnimatedCircularProgress
              size={120}
              width={10}
              fill={getPercent(item.value, item.goal)}
              tintColor={item.color}
              backgroundColor="#3B2A5F"
              rotation={0}
              lineCap="round">
              {() => (
                <Text style={[styles.ringText, { color: item.color }]}>
                  {item.value}/{item.goal}{"\n"}{item.label}
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>
        ))}
      </View>

      {/* --- Calendario --- */}
      <View style={styles.calendarBox}>
        <Text style={styles.subTitle}>Días Completados</Text>
        <Calendar
          onDayPress={handleDaySelect}
          markedDates={Object.fromEntries(
            Object.entries(selectedDays).map(([date, done]) => [
              date,
              {
                selected: true,
                selectedColor: done ? "#A66EFF" : "#5B21B6",
              },
            ])
          )}
          theme={{
            calendarBackground: "#2C1E4F",
            dayTextColor: "#EDE9FE",
            monthTextColor: "#CDB8FF",
            todayTextColor: "#A78BFA",
            arrowColor: "#CDB8FF",
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E0F3F",
    padding: 15,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    color: "#CDB8FF",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
  },
  ringsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  ring: {
    alignItems: "center",
  },
  ringText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  calendarBox: {
    borderWidth: 1,
    borderColor: "#A78BFA",
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#2C1E4F",
    shadowColor: "#A66EFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#CDB8FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E0F3F",
  },
});
