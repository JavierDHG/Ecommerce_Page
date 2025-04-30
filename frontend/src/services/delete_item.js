import axios from "axios";

export const deleteItem = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
        await axios.delete(`https://ecostore-api.onrender.com/api/v1/cart_items/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true;
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        return false;
    }
};