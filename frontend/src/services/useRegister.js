// hooks/useRegister.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const register = async (username, email, password) => {
    if (!username || !email || !password) {
      setMessage("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post("#####", {
        username,
        email,
        password,
      });

      setMessage("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => {
        navigate("/ecommerce-login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage('Error en el registro, verifica tus datos.');
        console.error("Error en el registro:", err.response.data);
      } else {
        setMessage("Fallo en el registro");
      }
    }
  };

  return { register, message };
};
