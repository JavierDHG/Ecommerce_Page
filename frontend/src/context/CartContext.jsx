// En tu CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] }); // Estado inicial mejorado
  const [cartVersion, setCartVersion] = useState(0); // Nuevo estado para forzar actualizaciones

  // Función para incrementar la versión y forzar recarga
  const refreshCart = () => setCartVersion(prev => prev + 1);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://127.0.0.1:8000/api/v1/carts/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Siempre mantener la estructura consistente
      setCart(response.data?.[0] || { items: [] });
      
    } catch (error) {
      if (error.response?.status === 404) {
        setCart({ items: [] });
      }
    }
  };

  const clearCart = async (cartId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/api/v1/carts/${cartId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Resetear estado y forzar recarga
      setCart({ items: [] });
      refreshCart();
      
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      throw error;
    }
  };

  // Escuchar cambios en cartVersion
  useEffect(() => {
    fetchCart();
  }, [cartVersion]); // <-- Se ejecutará cada vez que cambie cartVersion

  return (
    <CartContext.Provider value={{ 
      cart, 
      fetchCart, 
      clearCart,
      refreshCart // Expón esta función para usarla en componentes
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);