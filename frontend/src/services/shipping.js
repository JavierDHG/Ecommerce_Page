import axios from "axios";

export const getOrderItems = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/v1/orders_available/"
      , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    
  } catch (error) {
    console.error("Error al obtener los metodos de envio:", error);
    throw error;
  }
};

export const sendOrderItems = async (shippingData) => {
  try {
    const token = localStorage.getItem("accessToken"); // Obtener el token de autenticación
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    

    // Realizar la petición POST para enviar los datos de envío
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/shippings/",
      shippingData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en las cabeceras
        },
      }
      
    );

    return response.data; // Retornar la respuesta del servidor
  } catch (error) {
    console.error("Error al enviar los items de la orden:", error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};