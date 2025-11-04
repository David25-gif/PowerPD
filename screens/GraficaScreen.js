import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

export default function GraficaScreen({ route }) {
  // Si pasas el usuario desde navegación: const { userId } = route.params;
  const userId = "user123"; // temporal, reemplázalo luego con el user real

  const [data, setData] = useState(null);
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [totalTiempo, setTotalTiempo] = useState(0);
  const [totalSesiones, setTotalSesiones] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, "usuarios", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const entrenamientos = userDocSnap.data().entrenamientos || [];

          const caloriasPorDia = {};
          let totalCal = 0;
          let totalDuracion = 0;

          entrenamientos.forEach((ent) => {
            const fecha = ent.fecha || "Sin fecha";
            caloriasPorDia[fecha] =
              (caloriasPorDia[fecha] || 0) + (ent.calorias || 0);
            totalCal += ent.calorias || 0;

            // Convertir duración "00:02:05" a segundos
            if (ent.duracion) {
              const [h, m, s] = ent.duracion.split(":").map(Number);
              totalDuracion += h * 3600 + m * 60 + s;
            }
          });

          const labels = Object.keys(caloriasPorDia);
          const values = Object.values(caloriasPorDia);

          setData({
            labels,
            datasets: [{ data: values }],
          });

          setTotalCalorias(totalCal);
          setTotalTiempo(totalDuracion);
          setTotalSesiones(entrenamientos.length);
        } else {
          console.log("No existe el usuario en Firestore");
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const tiempoEnMinutos = (totalTiempo / 60).toFixed(1);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0d1117",
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: "#00ff6a",
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        📊 Tu Progreso Semanal
      </Text>

      {data && data.labels && data.labels.length > 0 ? (
        <BarChart
          data={data}
          width={screenWidth - 20}
          height={250}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#0d1117",
            backgroundGradientTo: "#0d1117",
            color: (opacity = 1) => `rgba(0, 255, 106, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={{
            marginVertical: 25,
            borderRadius: 16,
            alignSelf: "center",
          }}
        />
      ) : (
        <Text
          style={{
            color: "#9ca3af",
            textAlign: "center",
            marginVertical: 50,
            fontSize: 16,
          }}
        >
          Aún no tienes registros de entrenamiento 🏋️‍♀️
        </Text>
      )}

      {/* Círculos de resumen */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 50,
        }}
      >
        <View
          style={{
            backgroundColor: "#1f2937",
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#00ff6a",
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}
        >
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>🔥</Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {totalCalorias}
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>kcal</Text>
        </View>

        <View
          style={{
            backgroundColor: "#1f2937",
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#00ff6a",
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}
        >
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>⏱️</Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {tiempoEnMinutos}
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>min</Text>
        </View>

        <View
          style={{
            backgroundColor: "#1f2937",
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#00ff6a",
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}
        >
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>💪</Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {totalSesiones}
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>sesiones</Text>
        </View>
      </View>
    </ScrollView>
  );
}
