import axios from "axios";

const getOrderHistory = async () => {
  const response = await axios.get("####", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

export default getOrderHistory;
