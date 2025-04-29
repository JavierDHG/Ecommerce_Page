import { useState, useEffect } from "react"
import { getOrderItems, sendOrderItems } from "../services/shipping"
import { useNavigate } from "react-router-dom"
import { Truck, MapPin, CheckCircle, Loader2, ArrowLeft, Package, Home } from 'lucide-react'

const Shipping = () => {
  const [orderItems, setOrderItems] = useState([])
  const [orderId, setOrderId] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        setLoading(true)
        const data = await getOrderItems()
        setOrderItems(data)
      } catch (error) {
        console.error("Error fetching order items:", error)
        setError("No se pudieron cargar los pedidos. Por favor, inténtalo de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderItems()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await sendOrderItems({
        address,
        city,
        postal_code: postalCode,
        country,
        order: parseInt(orderId),
      })

      setSuccess(true)

      // Redirigir después de mostrar el éxito por un momento
      setTimeout(() => {
        navigate("/ecommerce")
      }, 2000)
    } catch (error) {
      console.error("Error sending shipping information:", error)
      setError("Hubo un problema al enviar la información de envío. Por favor, inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido Completado!</h1>
          <p className="text-gray-600 mb-6">Tu información de envío ha sido registrada correctamente.</p>
          <p className="text-sm text-gray-500 mb-4">Serás redirigido a la tienda en unos segundos...</p>
          <div className="animate-pulse">
            <Loader2 className="h-6 w-6 mx-auto text-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/ecommerce-pay")}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Volver al pago</span>
        </button>
      </div>

      {/* Indicador de progreso */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xs text-gray-500">Carrito</span>
          </div>
          <div className="flex-1 h-1 bg-emerald-100 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-xs text-gray-500">Pago</span>
          </div>
          <div className="flex-1 h-1 bg-emerald-100 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-2">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-emerald-600">Envío</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
              <MapPin className="mr-3 h-6 w-6 text-emerald-600" />
              Información de Envío
            </h1>
            <p className="text-gray-500">Ingresa los detalles de envío para completar tu pedido</p>
          </div>

          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-500">Cargando información del pedido...</p>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                    Selecciona tu pedido
                  </label>
                  <select
                    id="order"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">-- Selecciona un pedido --</option>
                    {orderItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        Pedido #{item.id}
                      </option>
                    ))}
                    {console.log(orderItems)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Calle y número"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Tu ciudad"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    placeholder="Ej: 28001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="Tu país"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/ecommerce-pay")}
                  className="sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:w-1/2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Truck className="mr-2 h-5 w-5" />
                      Completar Pedido
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shipping
