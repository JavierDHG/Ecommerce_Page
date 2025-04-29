// services/categoryService.js
import axios from "axios"

export const getCategories = async () => {
  const response = await axios.get("http://localhost:8000/api/v1/categories/")
  return response.data
}
