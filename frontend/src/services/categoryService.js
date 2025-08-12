// services/categoryService.js
import axios from "axios"

export const getCategories = async () => {
  const response = await axios.get("###")
  return response.data
}
