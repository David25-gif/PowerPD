// screens/GraficaScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

export default function GraficaScreen() {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const tiempos = snap.data().tiempos || {};
        const fechas = Object.keys(tiempos).sort();
        setLabels(fechas);
        setData(fechas.map((f) => tiempos[f]));
      }
    };
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Progreso de Entrenamiento</Text>
      {data.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={screenWidth - 30}
          height={250}
          yAxisSuffix="s"
          chartConfig={{
            backgroundColor: "#111827",
            backgroundGradientFrom: "#111827",
            backgroundGradientTo: "#111827",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
          style={{ borderRadius: 10, marginVertical: 10 }}
        />
      ) : (
        <Text style={styles.empty}>Aún no hay datos para mostrar.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", padding: 20 },
  title: { color: "#16a34a", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  empty: { color: "#9ca3af", textAlign: "center", fontSize: 16, marginTop: 40 },
});
