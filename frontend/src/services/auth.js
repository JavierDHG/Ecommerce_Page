// Importa la función `jwtDecode` desde la librería "jwt-decode" para decodificar tokens JWT
import { jwtDecode } from "jwt-decode"; // Nota: Esto debería ser `import jwtDecode from "jwt-decode";` si estás usando la versión correcta de la librería

// Verifica si el usuario está autenticado
export const isAuthenticated = () => {
  // Obtiene el token de acceso almacenado en localStorage
  const token = localStorage.getItem("accessToken");

  // Si no hay token, el usuario no está autenticado
  if (!token) return false;

  try {
    // Decodifica el token para obtener su información (payload)
    const decoded = jwtDecode(token);

    // Verifica si el token ha expirado comparando su tiempo de expiración con el tiempo actual
    // `decoded.exp` es el tiempo de expiración del token en segundos desde la época Unix
    // `Date.now() / 1000` convierte el tiempo actual a segundos
    return decoded.exp > Date.now() / 1000; // Retorna `true` si el token es válido y no ha expirado
  } catch (err) {
    // Si ocurre un error al decodificar el token (por ejemplo, si es inválido), retorna `false`
    return false;
  }
};

// Cierra la sesión del usuario
export const logout = () => {
  // Elimina el token de acceso y el token de refresco de localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Redirige al usuario a la página de inicio de sesión
  window.location.href = "/ecommerce-login";
};