import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { addToCart } from "../services/addcart";
import { getProducts } from "../services/listproduct"; // Asegúrate de importar tu servicio

const SyncPendingCart = () => {
  const { user } = useUser();

  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        const pendingCart = JSON.parse(localStorage.getItem("pendingCart") || "[]");
        
        if (pendingCart.length > 0) {
          try {
            // Obtener la lista completa de productos
            const products = await getProducts();
            
            // Usar Promise.all para agregar en paralelo
            await Promise.all(
              pendingCart.map(async (item) => {
                // Buscar el producto correspondiente por su ID
                const product = products.find(p => p.id === item.productId);
                
                if (product) {
                  // Verificar si la cantidad en el carrito no excede el stock disponible
                  const updatedQuantity = Math.min(item.quantity, product.stock);

                  // Si la cantidad ha cambiado, actualizar el carrito en localStorage
                  if (updatedQuantity !== item.quantity) {
                    item.quantity = updatedQuantity;
                    localStorage.setItem("pendingCart", JSON.stringify(pendingCart));
                  }

                  // Agregar al carrito con la cantidad actualizada
                  await addToCart(item.productId, updatedQuantity);
                }
              })
            );
            
            localStorage.removeItem("pendingCart"); // Limpiar carrito pendiente
          } catch (error) {
            console.error("Error sincronizando carrito:", error);
          }
        }
      }
    };

    syncCart();
  }, [user]); // Se ejecuta solo cuando cambia el usuario

  return null; // No renderiza nada
};

export default SyncPendingCart;
