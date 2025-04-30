import axios from "axios";

const createCategories = async (categories) => {
  const token = localStorage.getItem("accessToken");
  console.log("Data received in createCategories:", categories);
  try {
    const response = await axios.post(
        "https://front-ecommerce-page.onrender.com/api/v1/categories/",
        categories,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        }
    );

    return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

export default createCategories;
