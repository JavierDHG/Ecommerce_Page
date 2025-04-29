import axios from "axios";

const getOrderHistory = async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/v1/orders_history/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export default getOrderHistory;
