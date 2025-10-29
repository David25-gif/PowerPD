import axios from "axios";

const options = {
  method: "GET",
  url: "https://exercisedb.p.rapidapi.com/exercises",
  headers: {
    "x-rapidapi-key": "80f3e86ff2msh76d861fc55ac931p101772jsn2d8f5ef4cc02",
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  },
};

export const getExercises = async () => {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error al obtener ejercicios:", error);
    return [];
  }
};
