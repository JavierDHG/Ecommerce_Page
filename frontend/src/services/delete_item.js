import axios from "axios";

export const deleteItem = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
        await axios.delete(`####`, {
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
