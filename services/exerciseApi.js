//  API principal de ejercicios
const BASE_URL = "https://exercisedb.p.rapidapi.com";
const API_KEY = "80f3e86ff2msh76d861fc55ac931p101772jsn2d8f5ef4cc02";
const API_HOST = "exercisedb.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
};

//  Servidores de LibreTranslate (incluye uno que sí permite móviles)
const TRANSLATE_SERVERS = [
  "https://translate.fedilab.app/translate", // este funciona mejor en móvil
  "https://translate.argosopentech.com/translate",
  "https://libretranslate.com/translate",
  "https://lt.vern.cc/translate",
];

//  Función de traducción con respaldo
const translateText = async (text) => {
  if (!text) return "";

  for (const baseUrl of TRANSLATE_SERVERS) {
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: "es",
          format: "text",
        }),
      });

      if (!res.ok) {
        console.warn(`⚠️ Servidor ${baseUrl} falló`);
        continue;
      }

      const data = await res.json();
      if (data?.translatedText) return data.translatedText;
    } catch (err) {
      console.warn(`⚠️ Error con ${baseUrl}:`, err.message);
      continue;
    }
  }

  // Si todos los servidores fallan, devolvemos el texto original
  return text;
};

//  Traducción local de partes del cuerpo
const translateBodyPart = (part) => {
  const map = {
    back: "Espalda",
    chest: "Pecho",
    cardio: "Cardio",
    "upper legs": "Piernas",
    "lower legs": "Piernas inferiores",
    "upper arms": "Brazos",
    "lower arms": "Antebrazos",
    shoulders: "Hombros",
    waist: "Abdominales",
    neck: "Cuello",
  };
  return map[part?.toLowerCase()] || part;
};

//  Traducción de músculos
const translateTarget = (target) => {
  const map = {
    lats: "Dorsales",
    abs: "Abdominales",
    quads: "Cuádriceps",
    glutes: "Glúteos",
    biceps: "Bíceps",
    triceps: "Tríceps",
    calves: "Pantorrillas",
    delts: "Hombros",
    hamstrings: "Isquiotibiales",
    traps: "Trapecios",
    chest: "Pectorales",
    forearms: "Antebrazos",
    adductors: "Aductores",
    abductors: "Abductores",
  };
  return map[target?.toLowerCase()] || target;
};

//  Obtener lista de partes del cuerpo traducidas
export const getBodyParts = async () => {
  try {
    const url = `${BASE_URL}/exercises/bodyPartList`;
    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();

    // Traducimos localmente para que no dependa de internet
    return data.map((p) => ({
      original: p.trim().toLowerCase(),
      translated: translateBodyPart(p),
    }));
  } catch (error) {
    console.error(" Error en getBodyParts:", error);
    return [];
  }
};

//  Obtener ejercicios por parte del cuerpo y traducir sus campos
export const getExercisesByBodyPart = async (bodyPart) => {
  try {
    const normalized = bodyPart.toLowerCase().trim();
    const response = await fetch(`${BASE_URL}/exercises/bodyPart/${normalized}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    // Traducimos dinámicamente usando LibreTranslate (y respaldo local)
    const translatedData = await Promise.all(
      data.map(async (ex) => ({
        ...ex,
        name: await translateText(ex.name),
        target: translateTarget(ex.target),
        equipment: await translateText(ex.equipment),
        bodyPart: translateBodyPart(ex.bodyPart),
        instructions: ex.instructions
          ? await Promise.all(ex.instructions.map((t) => translateText(t)))
          : [],
      }))
    );

    return translatedData;
  } catch (error) {
    console.error(" Error en getExercisesByBodyPart:", error);
    throw error;
  }
};
