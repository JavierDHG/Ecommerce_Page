import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createOrder,
  createOrderItems,
  processPayment,
} from "../services/paymethod";
import { useCart } from "../context/CartContext";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Lock,
} from "lucide-react";

function EcommercePay() {
  const { state } = useLocation();
  const { total } = state || { total: 0 };
  const { cart: cartItems, fetchCart, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  // Esto es para asegurarte de que el carrito se refresque al cargar la página
  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    if (!total && !loading && !success) {
      navigate("/ecommerce-cart");
    }
  }, [total, loading, success, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Cart items:", cartItems);
      // Verifica que el carrito no esté vacío
      if (!cartItems || cartItems.length === 0) {
        console.error("El carrito está vacío. No se puede procesar el pago.");
        setError(
          "El carrito está vacío. Por favor, agrega productos antes de pagar."
        );
        return;
      }

      const currentCartId = cartItems.id;
      // refrescar el carrito para obtener los items reales
      await fetchCart(); // Asegúrate de que el carrito esté actualizado
      const realItems = cartItems.items;

      console.log("Real items:", realItems);
      // Paso 1: Crear orden
      const order = await createOrder(total);

      // Paso 2: Mapear correctamente los items
      const itemsToSend = realItems.map((item) => ({
        product: item.product.id, // Ahora sí existe product.id
        quantity: item.quantity,
        price: item.product.price, // Asegúrate de que esto sea correcto
      }));

      await createOrderItems(order.id, itemsToSend);

      // Paso 3: Procesar el pago
      await processPayment(order.id);

      fetchCart(true); // Actualiza el carrito después de procesar el pago

      // Paso 4: Vaciar el carrito con validación
      if (currentCartId) {
        await clearCart(cartItems.id);
      } else {
        console.warn("No hay carrito para limpiar");
      }

      //refreshCart(); // Forzar recarga del carrito
      console.log("Real items:", realItems);

      setError(null); // Limpia cualquier error previo
      setSuccess(true);
      setTimeout(() => {
        navigate("/ecommerce-shipping", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Error en el pago:", error);
      setError(error.response?.data?.detail || "Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado correctamente.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Serás redirigido a la página de envío en unos segundos...
          </p>
          <div className="animate-pulse">
            <Loader2 className="h-6 w-6 mx-auto text-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/ecommerce-cart")}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Volver al carrito</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Resumen del pedido */}
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${(total * 0.81).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (19%)</span>
                  <span className="font-medium">
                    ${(total * 0.19).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-gray-800">${total}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Pago 100% seguro</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Tus datos están protegidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="md:col-span-2 order-1 md:order-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Finalizar compra
              </h1>
              <p className="text-gray-500">
                Completa tu información de pago para procesar tu pedido
              </p>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Método de pago
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === "card"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod("card")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedMethod === "card"
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "card" && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium">
                        Tarjeta de crédito/débito
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === "paypal"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod("paypal")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedMethod === "paypal"
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "paypal" && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7.4 3h9.2c1.1 0 2 0.9 2 2v14c0 1.1-0.9 2-2 2H7.4c-1.1 0-2-0.9-2-2V5c0-1.1 0.9-2 2-2z"
                          fill="#003087"
                        />
                        <path
                          d="M16.1 9.8c0 1.2-0.9 2.2-2.1 2.2h-1.4c-0.2 0-0.4 0.2-0.4 0.4v1.2c0 0.2-0.2 0.4-0.4 0.4h-0.8c-0.2 0-0.4-0.2-0.4-0.4V7.4c0-0.2 0.2-0.4 0.4-0.4h2.6c1.2 0 2.1 1 2.1 2.2v0.6z"
                          fill="#fff"
                        />
                      </svg>
                      <span className="font-medium">PayPal</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMethod === "card" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiry"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Fecha de expiración
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CVC/CVV
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === "paypal" && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Al hacer clic en "Confirmar Pago", serás redirigido a PayPal
                    para completar tu compra de forma segura.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Procesando...
                  </>
                ) : (
                  <>Confirmar Pago</>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al completar tu compra, aceptas nuestros{" "}
                <a href="#" className="text-emerald-600 hover:underline">
                  Términos y Condiciones
                </a>{" "}
                y{" "}
                <a href="#" className="text-emerald-600 hover:underline">
                  Política de Privacidad
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EcommercePay;
