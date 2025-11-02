// services/exerciseApi.js
const BASE_URL = "https://exercisedb.p.rapidapi.com";
const API_KEY = "80f3e86ff2msh76d861fc55ac931p101772jsn2d8f5ef4cc02";
const API_HOST = "exercisedb.p.rapidapi.com";

// ✅ Configuración base de la API
const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

export const getBodyParts = async () => {
  try {
    const url = `${BASE_URL}/exercises/bodyPartList`;
    console.log("📡 Solicitando partes del cuerpo desde:", url);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const text = await response.text(); // 👈 leemos el texto crudo
    console.log("🧾 Respuesta cruda de la API:", text);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${text}`);
    }

    const data = JSON.parse(text);
    console.log("✅ Partes del cuerpo obtenidas:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en getBodyParts:", error);
    return [];
  }
};


// 💪 Obtener ejercicios por parte del cuerpo
export const getExercisesByBodyPart = async (bodyPart) => {
  try {
    const response = await fetch(`${BASE_URL}/exercises/bodyPart/${bodyPart}`, {
      method: "GET",
      headers,
    });
    if (!response.ok)
      throw new Error("Error al obtener ejercicios por parte del cuerpo");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getExercisesByBodyPart:", error);
    return [];
  }
};

// 🔍 Buscar ejercicio por nombre
export const searchExercise = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/exercises/name/${name}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) throw new Error("Error al buscar ejercicio");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en searchExercise:", error);
    return [];
  }
};
