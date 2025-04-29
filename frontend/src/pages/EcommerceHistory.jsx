import { useState, useEffect } from "react"
import getOrderHistory from "../services/getOrderHistory"
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Loader2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Download,
  Clock,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

function EcommerceHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrders, setExpandedOrders] = useState({})
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  // Función para obtener el historial de órdenes
  const fetchOrderHistory = async () => {
    setLoading(true)
    try {
      const data = await getOrderHistory()
      console.log("Datos de órdenes:", data)
      setOrders(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("No se pudo cargar el historial de compras")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderHistory()
  }, [])

  // Función para alternar la expansión de una orden
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Función para obtener el estado de la orden (simulado)
  const getOrderStatus = (order) => {
    // Simulación de estados de orden basados en la fecha de creación
    // Esto convirte la fecha de creación en un entero de días desde la fecha actual
    // y asigna un estado basado en ese número
    const daysSinceOrder = Math.floor((new Date() - new Date(order.created_at)) / (1000 * 60 * 60 * 24))

    if (daysSinceOrder < 1) return "processing"
    if (daysSinceOrder < 3) return "shipped"
    if (daysSinceOrder < 5) return "delivered"
    return "completed"
  }

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-amber-100 text-amber-800"
      case "delivered":
        return "bg-emerald-100 text-emerald-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Función para obtener el icono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Filtrar y ordenar órdenes
  const filteredOrders = orders
    .filter((order) => {
      // Filtrar por estado
      if (filterStatus !== "all") {
        const status = getOrderStatus(order)
        if (status !== filterStatus) return false
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        // Buscar en ID, productos o fecha
        const matchesId = order.id.toString().includes(searchLower)
        const matchesProducts = order.items.some((item) => item.product_title.toLowerCase().includes(searchLower))
        const matchesDate = formatDate(order.created_at).toLowerCase().includes(searchLower)

        return matchesId || matchesProducts || matchesDate
      }

      return true
    })
    .sort((a, b) => {
      // Ordenar por fecha
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)

      if (sortOrder === "newest") {
        return dateB - dateA
      } else {
        return dateA - dateB
      }
    })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-16 md:mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-3 h-7 w-7 text-emerald-600" />
            Historial de Compras
          </h1>
          <p className="text-gray-500 mt-1">Revisa el estado de tus pedidos y compras anteriores</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Todos los estados</option>
              <option value="processing">En procesamiento</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="completed">Completado</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-emerald-500" />
          <p className="text-lg text-gray-600">Cargando tu historial de compras...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-lg font-medium text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchOrderHistory}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de órdenes */}
      {!loading && !error && (
        <>
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrders[order.id] || false
                const orderStatus = getOrderStatus(order)
                const statusColor = getStatusColor(orderStatus)
                const StatusIcon = getStatusIcon(orderStatus)

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                  >
                    {/* Cabecera de la orden */}
                    <div
                      className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <div className="flex items-center mb-2 md:mb-0">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <ShoppingBag className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Pedido</span>
                            <h3 className="text-lg font-bold text-gray-800">#{order.id}</h3>
                          </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-gray-200 mx-4"></div>

                        <div className="flex items-center mb-2 md:mb-0">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">{formatDate(order.created_at)}</span>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-gray-200 mx-4"></div>

                        <div className="flex items-center mb-2 md:mb-0">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-800">${order.total_price}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 md:mt-0">
                        <div className={`flex items-center px-3 py-1 rounded-full ${statusColor} mr-4`}>
                          {StatusIcon}
                          <span className="ml-1 text-xs font-medium capitalize">
                            {orderStatus === "processing" && "En procesamiento"}
                            {orderStatus === "shipped" && "Enviado"}
                            {orderStatus === "delivered" && "Entregado"}
                            {orderStatus === "completed" && "Completado"}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Detalles de la orden (expandible) */}
                    <div
                      className={`border-t border-gray-100 transition-all duration-300 overflow-hidden ${
                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-4 md:p-6">
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Detalles del pedido</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-xs text-gray-500">Método de pago</span>
                              <p className="font-medium text-gray-800">PayPal</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-xs text-gray-500">Dirección de envío</span>
                              <p className="font-medium text-gray-800">Calle Principal #123</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-xs text-gray-500">Fecha estimada de entrega</span>
                              <p className="font-medium text-gray-800">
                                {formatDate(new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000))}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Productos</h4>
                          <div className="bg-gray-50 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Producto
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Cantidad
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Precio
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item) => (
                                  <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                          <Package className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className="text-sm font-medium text-gray-800">{item.product_title}</div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-800">
                                      ${(item.product_price || 0)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td colSpan="2" className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                                    Total:
                                  </td>
                                  <td className="px-4 py-3 text-right text-sm font-bold text-gray-800">
                                    ${order.total_price}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tienes compras registradas</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "No se encontraron pedidos que coincidan con tus filtros."
                  : "Aún no has realizado ninguna compra en nuestra tienda."}
              </p>
              {searchTerm || filterStatus !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("all")
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Limpiar filtros
                </button>
              ) : (
                <button
                  onClick={() => navigate("/ecommerce")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Explorar productos
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default EcommerceHistory
