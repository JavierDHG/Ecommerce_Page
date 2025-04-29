import axios from "axios";

// Función para obtener los productos desde la API
export const getProducts = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // Obtiene el token del localStorage
    
    const response = await axios.get("http://127.0.0.1:8000/api/v1/products/", {
    });
    
    return response.data;
  } catch (err) {
    console.error("Error al obtener los productos:", err);
    throw err;
  }
};