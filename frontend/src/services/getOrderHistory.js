import axios from "axios";

const getOrderHistory = async () => {
  const response = await axios.get("https://front-ecommerce-page.onrender.com/api/v1/orders_history/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export default getOrderHistory;
