import axios from "axios";

export const getCart = async () => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/v1/cart_items/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return [];
  }
};
