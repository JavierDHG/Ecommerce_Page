import axios from "axios";

export const createOrder = async (total) => {
  try {
    const response = await axios.post(
      "https://front-ecommerce-page.onrender.com/api/v1/orders/",
      {total},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Envía el token de acceso
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error completo para pago:", error.response?.data); // ⬅️ Detalles del error
    throw error;
  }
};

export const createOrderItems = async (orderId, items) => {
  try {
    const itemsWithOrder = items.map(item => ({
      product: item.product, // extrae solo el ID
      quantity: item.quantity,
      order: orderId, // asigna el ID de la orden
      price: item.price, // extrae solo el ID
    }));

    const response = await axios.post(
      `https://front-ecommerce-page.onrender.com/api/v1/order_items/`,
      itemsWithOrder,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error completo:", error.response?.data);
    throw error;
  }
};


export const processPayment = async (orderId) => {
  try {
    const response = await axios.post(
      `https://front-ecommerce-page.onrender.com/api/v1/orders/${orderId}/pay/`, // Usa la URL del endpoint
      {}, // No necesita cuerpo, solo el order_id en la URL
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Envía el token de acceso
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al procesar el pago:", error.response?.data);
    throw error;
  }
};
