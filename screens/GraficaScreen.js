import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { db, auth } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

export default function GraficaScreen() {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [totalTiempo, setTotalTiempo] = useState(0);
  const [totalSesiones, setTotalSesiones] = useState(0);

  useEffect(() => {
    // Esperar a que el usuario esté autenticado
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(db, "usuarios", userId);

    const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
      if (userDocSnap.exists()) {
        const entrenamientos = userDocSnap.data().entrenamientos || [];

        const minutosPorDia = {};
        let totalMinutos = 0;
        let totalCal = 0;

        entrenamientos.forEach((ent) => {
          const fecha = ent.fecha || "Sin fecha";

          if (ent.duracion) {
            const [h, m, s] = ent.duracion.split(":").map(Number);
            const minutos = h * 60 + m + s / 60;
            minutosPorDia[fecha] = (minutosPorDia[fecha] || 0) + minutos;
            totalMinutos += minutos;
          }
          totalCal += ent.calorias || 0;
        });

        const labels = Object.keys(minutosPorDia);
        const values = Object.values(minutosPorDia).map((v) =>
          parseFloat(v.toFixed(1))
        );

        setData({
          labels,
          datasets: [{ data: values }],
        });
        setTotalCalorias(totalCal.toFixed(1));
        setTotalTiempo(totalMinutos.toFixed(1));
        setTotalSesiones(entrenamientos.length);
      } else {
        console.log("⚠️ No existe el usuario en Firestore");
      }
    });

    return () => unsubscribe();
  }, [userId]);

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

      {data && data.labels?.length > 0 ? (
        <BarChart
          data={data}
          width={screenWidth - 20}
          height={250}
          fromZero
          showValuesOnTopOfBars
          yAxisSuffix=" min"
          chartConfig={{
            backgroundGradientFrom: "#0d1117",
            backgroundGradientTo: "#0d1117",
            color: (opacity = 1) => `rgba(0, 255, 106, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            decimalPlaces: 1,
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
          }}
        >
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>⏱️</Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {totalTiempo}
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
