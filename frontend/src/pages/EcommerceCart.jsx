import { useState, useEffect } from "react";
import { getCart } from "../services/getcart";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { deleteItem } from "../services/delete_item";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CreditCard,
  Package,
  X,
  Loader2,
} from "lucide-react";// Asegúrate de que la ruta sea correcta

function EcommerceCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        navigate("/ecommerce");
        return;
      }

      try {
        const items = await getCart();
        // Asegúrate de que `items` sea un array
        const safeItems = Array.isArray(items) ? items : [];
        setCartItems(safeItems);
      } catch (err) {
        setError("Error al cargar el carrito");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handledeleteItem = async (id) => {
    try {
      
      setIsDeleting(id);
      await deleteItem(id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Calcular el total del carrito
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/ecommerce-pay", { state: { total } }); // Envía el total a la vista de pago
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-emerald-500" />
        <p className="text-lg font-medium">Cargando tu carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <X className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-lg font-medium text-red-700">{error}</p>
          <button
            onClick={() => navigate("/ecommerce")}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mt-20 max-w-md w-full text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Parece que aún no has añadido productos a tu carrito
          </p>
          <button
            onClick={() => navigate("/ecommerce")}
            className="inline-flex items-center px-5 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <Package className="mr-2 h-5 w-5" />
            Explorar productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ShoppingCart className="mr-3 h-7 w-7 text-emerald-600" />
          Tu Carrito
        </h1>
        <button
          onClick={() => navigate("/ecommerce")}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Seguir comprando
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {/* Encabezado de la tabla */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="md:col-span-6 pl-2">Producto</div>
            <div className="md:col-span-2 text-center">Precio</div>
            <div className="md:col-span-2 text-center">Cantidad</div>
            <div className="md:col-span-2 text-center">Acciones</div>
          </div>

          {/* Elementos del carrito */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
            >
              {/* Producto */}
              <div className="md:col-span-6 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {item.product.image ? (
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 md:hidden">
                    ${item.product.price} × {item.quantity}
                  </p>
                </div>
              </div>

              {/* Precio */}
              <div className="hidden md:block md:col-span-2 text-center font-medium">
                ${item.product.price}
              </div>

              {/* Cantidad */}
              <div className="hidden md:flex md:col-span-2 justify-center items-center">
                <span className="bg-gray-100 px-3 py-1 rounded-md font-medium">
                  {item.quantity}
                </span>
              </div>

              {/* Acciones */}
              <div className="md:col-span-2 flex justify-end md:justify-center">
                <button
                  onClick={() => handledeleteItem(item.id)}
                  disabled={isDeleting === item.id}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isDeleting === item.id
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {isDeleting === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen y acciones */}
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-medium text-gray-600">Subtotal:</span>
                <span className="font-bold text-gray-800">${total}</span>
              </div>
              <p className="text-sm text-gray-500">
                Impuestos y gastos de envío calculados en el checkout
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/ecommerce")}
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver a la tienda
              </button>

              <button
                onClick={handleCheckout}
                disabled={total === 0}
                className="inline-flex items-center justify-center px-5 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceder al pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EcommerceCart;
