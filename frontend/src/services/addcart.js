import axios from "axios";

export const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem("accessToken");
  
  try {
    await axios.post(
      "https://ecostore-api.onrender.com/api/v1/cart_items/", // <--- Asegúrate de usar la URL correcta
      { product_id: productId , quantity }, // <--- Campo "product_id" y "quantity"
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true;
  } catch (error) {
    console.error("Error al añadir al carrito:", error.response?.data);
    return false;
  }
};