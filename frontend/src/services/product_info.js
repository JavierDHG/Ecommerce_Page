import axios from "axios";

export const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(
      `####`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener detalles del producto");
  }
};
