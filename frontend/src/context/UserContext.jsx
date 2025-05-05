// Importa React y hooks necesarios para manejar el contexto y efectos secundarios
import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
// Importa la función `jwtDecode` para decodificar tokens JWT
import { jwtDecode } from "jwt-decode";
// Importa las funciones `logout` desde el archivo de utilidades `auth.js`
import { logout, } from "../services/auth";

// Crea un contexto para almacenar y compartir información del usuario
const UserContext = createContext();

// Define el proveedor del contexto, que envolverá a los componentes hijos
export const UserProvider = ({ children }) => {
  // Estado para almacenar la información del usuario logueado
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // Función para actualizar el carrito
  const updateCart = async () => {
    try {
      const response = await axios.get("https://ecostore-api.onrender.com/api/v1/carts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  useEffect(() => {
    if (user) {
      updateCart();
    }
  }, [user]);

  

  // Función para renovar el token de acceso
  const refreshToken = async () => {
    try {
      // Realiza una solicitud al backend para renovar el token
      const response = await fetch("https://ecostore-api.onrender.com/token/refresh/", {
        method: "POST", // Especifica que el método HTTP es POST
        headers: { "Content-Type": "application/json" }, // Indica que el cuerpo de la solicitud está en formato JSON
        body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }), // Envía el token de refresco almacenado en localStorage
      });
      

      // Si la respuesta no es exitosa, lanza un error
      if (!response.ok) throw new Error("Error al renovar el token");

      // Extrae el nuevo token de acceso de la respuesta
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken); // Guarda el nuevo token en localStorage

      // Decodifica el nuevo token para obtener información del usuario
      const decoded = jwtDecode(data.accessToken);
      setUser(decoded); // Actualiza el estado del usuario con el email
    } catch (error) {
      // Si ocurre un error, cierra la sesión del usuario
      logout();
    }
  };

  // Efecto secundario para verificar la autenticación del usuario al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      // Obtiene el token de acceso desde localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) return; // Si no hay token, no hace nada

      try {
        // Decodifica el token para verificar su validez
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tiempo actual en segundos

        // Si el token ha expirado, intenta renovarlo
        if (decoded.exp < currentTime) {
          await refreshToken();
        } else {
          // Si el token es válido, actualiza el estado del usuario
          setUser(decoded);
        }
      } catch (err) {
        // Si ocurre un error al decodificar el token, muestra el error y limpia el estado del usuario
        console.error("Error al decodificar el token:", err);
        setUser(null);
      }
    };

    // Llama a la función para verificar la autenticación
    checkAuth();
  }, []); // Este efecto se ejecuta solo una vez al montar el componente

  // Retorna el proveedor del contexto con el estado del usuario y la función para actualizarlo
  return (
    <UserContext.Provider value={{ user, setUser, cart, updateCart }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto del usuario en otros componentes
export const useUser = () => useContext(UserContext);
