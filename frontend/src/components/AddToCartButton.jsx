// AddToCartButton.js
import React from "react";
import { addToCart } from "../services/addcart";
import { useUser } from "../context/UserContext"; // Usar contexto de usuario
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";

const AddToCartButton = ({
  product,
  selectedQuantity,
  setProducts,
  setSelectedQuantities,
}) => {
  const { user } = useUser(); // Obtener usuario del contexto
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    const quantity = selectedQuantity;

    setIsAdding(true);

    try {
      if (user) {
        // Usuario autenticado: añadir al carrito real
        await addToCart(product.id, quantity);
      } else {
        // Usuario no autenticado: guardar en pendingCart
        const pendingCart = JSON.parse(
          localStorage.getItem("pendingCart") || "[]"
        );
        const existingItem = pendingCart.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          pendingCart.push({ productId: product.id, quantity });
        }

        localStorage.setItem("pendingCart", JSON.stringify(pendingCart));
      }
      // Resetear cantidad seleccionada
      setSelectedQuantities((prev) => ({
        ...prev,
        [product.id]: 1, // Usar product.id como key
      }));

      // ✅ Actualizar stock localmente (opcional)
      setProducts?.((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, stock: p.stock - quantity } : p
        )
      );

      setIsAdding(false); // ✅ ← ¡esto es clave!
    } catch (err) {
      console.error(`Error: ${err.message}`);
      setIsAdding(false); // ✅ ← también aquí, para salir del estado de carga en errores
    }
  };

  return (
    <button
      className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
    >
      {isAdding ? (
        <span className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Agregando...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir al carrito
        </span>
      )}
    </button>
  );
};

export default AddToCartButton;
