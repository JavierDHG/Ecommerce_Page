import axios from "axios";

export const deleteItem = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/cart_items/${id}/`, {
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