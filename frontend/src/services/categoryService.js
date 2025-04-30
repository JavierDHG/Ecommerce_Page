// services/categoryService.js
import axios from "axios"

export const getCategories = async () => {
  const response = await axios.get("https://ecostore-api.onrender.com/api/v1/categories/")
  return response.data
}
