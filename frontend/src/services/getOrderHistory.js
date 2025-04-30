import axios from "axios";

const getOrderHistory = async () => {
  const response = await axios.get("https://ecostore-api.onrender.com/api/v1/orders_history/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export default getOrderHistory;
