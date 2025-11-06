import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

export default function GraficaScreen() {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [totalTiempo, setTotalTiempo] = useState(0);
  const [totalSesiones, setTotalSesiones] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const progresosRef = collection(db, "progresos");
    const q = query(progresosRef, where("userId", "==", userId), orderBy("fecha", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setData(null);
        setTotalCalorias(0);
        setTotalTiempo(0);
        setTotalSesiones(0);
        return;
      }

      const registros = snapshot.docs.map((doc) => doc.data());
      const minutosPorDia = {};
      let totalMinutos = 0;
      let totalCal = 0;

      registros.forEach((reg) => {
        let fechaSoloDia = "Sin fecha";
        if (reg.fecha && typeof reg.fecha.toDate === "function") {
          const fecha = reg.fecha.toDate();
          if (!isNaN(fecha)) {
            fechaSoloDia = fecha.toISOString().split("T")[0];
          }
        }

        // ✅ `tiempo` ya está en minutos decimales
        const minutos = parseFloat(reg.tiempo || 0);
        minutosPorDia[fechaSoloDia] =
          (minutosPorDia[fechaSoloDia] || 0) + minutos;

        totalMinutos += minutos;
        totalCal += reg.calorias || 0;
      });

      const labels = Object.keys(minutosPorDia);
      const values = Object.values(minutosPorDia).map((v) =>
        parseFloat(v.toFixed(2))
      );

      setData({
        labels,
        datasets: [{ data: values }],
      });

      setTotalCalorias(totalCal.toFixed(1));
      setTotalTiempo(totalMinutos.toFixed(1));
      setTotalSesiones(registros.length);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0d1117", paddingHorizontal: 10 }}>
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 50,
        }}
      >
        <View style={circleStyle}>
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>🔥</Text>
          <Text style={circleValue}>{totalCalorias}</Text>
          <Text style={circleLabel}>kcal</Text>
        </View>

        <View style={circleStyle}>
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>⏱️</Text>
          <Text style={circleValue}>{totalTiempo}</Text>
          <Text style={circleLabel}>min</Text>
        </View>

        <View style={circleStyle}>
          <Text style={{ color: "#00ff6a", fontSize: 18 }}>💪</Text>
          <Text style={circleValue}>{totalSesiones}</Text>
          <Text style={circleLabel}>sesiones</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const circleStyle = {
  backgroundColor: "#1f2937",
  width: 100,
  height: 100,
  borderRadius: 50,
  alignItems: "center",
  justifyContent: "center",
};

const circleValue = {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
};

const circleLabel = {
  color: "#9ca3af",
  fontSize: 12,
};
