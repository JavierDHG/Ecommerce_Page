import axios from "axios";

const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(
            `http://127.0.0.1:8000/api/v1/users/${userId}/`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        console.log("Usuario eliminado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        console.error("Error response:", error.response);
        console.log("Detalle del error:", error.response?.data);
        throw error;
    }
};

export default deleteUser;