// src/components/PrivateRoute.jsx
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useUser();

  const token = localStorage.getItem("accessToken");

  // Si no hay token y no hay usuario, redirige a la página de inicio
  if (!token && !user) {
    return <Navigate to="/ecommerce" replace />;
  }

  // Si hay token pero no hay usuario, muestra un mensaje de cargado
  // Esto puede suceder si el token es válido pero el usuario no está autenticado en el contexto
  if (!user && token) {
    return (
      <div className="text-center mt-20 text-gray-500 animate-pulse">
        Cargando...
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
