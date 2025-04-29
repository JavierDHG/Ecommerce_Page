import axios from "axios";

export const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/v1/products/${productId}/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener detalles del producto");
  }
};