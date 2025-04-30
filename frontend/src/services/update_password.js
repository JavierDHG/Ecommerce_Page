import axios from "axios";

const updatePassword = async (userId, newPassword) => {
    try {
        const response = await axios.put(
            `https://front-ecommerce-page.onrender.com/api/v1/users/${userId}/`,
            { password: newPassword },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        console.log("Datos actualizados:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        console.error("Error response:", error.response);
        console.log("Detalle del error:", error.response?.data);
        throw error;
    }
};

export default updatePassword;