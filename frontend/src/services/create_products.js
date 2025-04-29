import axios from "axios";

const createProduct = async (product) => {
  const token = localStorage.getItem("accessToken");
  console.log("Data received in createProduct:", product); // 👈 Verifica que el producto tenga la estructura correcta
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/products/",
      product, // 👈 Axios lo convierte automáticamente a JSON
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // 👈 Axios ya te da el "data" directo
  } catch (error) {
    // Opcional: lanzar el mensaje de error que venga del backend
    throw new Error(error.response?.data?.detail || "Failed to create product");
  }
};

export default createProduct;
