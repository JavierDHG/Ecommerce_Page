import axios from "axios";

const updateName = async (userId, newname) => {
    try {
        const response = await axios.put(
            `https://ecostore-api.onrender.com/api/v1/users/${userId}/`,
            { username: newname },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        console.log("Datos actualizados:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el nombre:", error);
        console.error("Error response:", error.response);
        console.log("Detalle del error:", error.response?.data);
        throw error;
    }
};

export default updateName;