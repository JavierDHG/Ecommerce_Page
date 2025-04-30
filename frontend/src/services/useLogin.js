// services/useLogin.js
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const useLogin = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const login = async (email, password) => {
    if (!email || !password) {
      setMessage("Por favor, ingresa tu email y contraseña.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("https://front-ecommerce-page.onrender.com/token/", {
        email,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const decoded = jwtDecode(access);
      setUser(decoded); // Actualiza el estado del usuario en el contexto

      setMessage("Login exitoso, redirigiendo...");
      navigate("/ecommerce");
    } catch (err) {
      console.error(err);
      setMessage("Credenciales incorrectas o error en el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, message, isLoading };
};
