import { useState, useEffect } from "react"
import { getProducts } from "../services/listproduct"
import AddToCartButton from "../components/AddToCartButton"
import { Search, Filter, ShoppingBag, ChevronDown, Package, X } from "lucide-react"
import { getCategories } from "../services/categoryService"

const EcommercePages = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedQuantities, setSelectedQuantities] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("default")
  const [showFilters, setShowFilters] = useState(false)

  const [selectedImage, setSelectedImage] = useState(null)

  const [categories, setCategories] = useState([{ id: "all", name: "Todas las categorías" }])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        // Agrega "Todas" como opción al inicio
        setCategories([{ id: "all", name: "Todas las categorías" }, ...data])
      } catch (err) {
        console.error("Error al cargar categorías", err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)

        const initialQuantities = {}
        data.forEach((prod) => {
          initialQuantities[prod.id] = 1
        })
        setSelectedQuantities(initialQuantities)
      } catch (err) {
        setError("Error al cargar los productos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Number.parseInt(newQuantity),
    }))
  }

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter((product) => {
      // Filtrar por búsqueda
      const matchesSearch = product.title.includes(searchTerm)
      // Filtrar por categoría
      const matchesCategory =
        selectedCategory === "all" ||
        selectedCategory === "Todas las categorías" ||
        product.category_name === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Ordenar productos
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.title.localeCompare(b.title)
        case "name-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

  // Componente de esqueleto para carga
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
      <div className="bg-gray-200 h-48"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded-full w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded mt-4"></div>
        <div className="h-10 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  )

  const openModal = (imageUrl, description) => setSelectedImage({ imageUrl, description })
  const closeModal = () => setSelectedImage(null)

  // Función para cerrar el modal con la tecla Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeModal()
      }
    }

    if (selectedImage) {
      document.addEventListener("keydown", handleEscKey)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [selectedImage])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 mt-16 md:mt-20">
      {/* Encabezado y barra de búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Nuestros Productos</h1>

        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros y ordenación */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-emerald-600 font-medium mb-4 md:hidden"
        >
          <Filter className="h-5 w-5" />
          <span>{showFilters ? "Ocultar filtros" : "Mostrar filtros"}</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? "block" : "hidden md:grid"}`}>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.title || category.name}>
                  {category.title || category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="default">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Resultados</p>
              <p className="text-2xl font-bold text-emerald-600">{filteredProducts.length}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && !error && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
                >
                  {/* Contenedor de la imagen */}
                  <div className="relative bg-gray-100 h-48 w-full overflow-hidden group">
                    {prod.image ? (
                      <img
                        src={prod.image || "/placeholder.svg"}
                        alt={prod.title}
                        className="w-full object-cover object-center transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                        onClick={() => openModal(prod.image, prod.description)} // Abre el modal con la imagen específica
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Categoría */}
                    <div className="mb-2">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {prod.category_name || "General"}
                      </span>
                    </div>

                    {/* Título */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 h-14">{prod.title}</h2>

                    {/* Precio */}
                    <div className="flex items-baseline mb-3">
                      <span className="text-xl font-bold text-gray-900">${prod.price}</span>
                      {prod.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">${prod.originalPrice}</span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          prod.stock > 5
                            ? "bg-green-100 text-green-800"
                            : prod.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {prod.stock > 0 ? `${prod.stock} en stock` : "Agotado"}
                      </span>
                    </div>

                    {/* Selector de cantidad */}
                    <div className="flex items-center space-x-2 mt-4">
                      <label htmlFor={`quantity-${prod.id}`} className="text-sm text-gray-600">
                        Cantidad:
                      </label>
                      <select
                        id={`quantity-${prod.id}`}
                        value={selectedQuantities[prod.id]}
                        onChange={(e) => handleQuantityChange(prod.id, e.target.value)}
                        disabled={prod.stock === 0}
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                      >
                        {[...Array(Math.min(prod.stock, 10)).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Botón de añadir al carrito */}
                    <div className="mt-4">
                      <AddToCartButton
                        product={prod}
                        selectedQuantity={selectedQuantities[prod.id]}
                        setProducts={setProducts}
                        setSelectedQuantities={setSelectedQuantities}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron productos</h3>
              <p className="text-gray-500 mb-4">
                No hay productos que coincidan con tu búsqueda o filtros seleccionados.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSortBy("default")
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}

      {/* Estado vacío */}
      {!loading && !error && products.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay productos disponibles</h3>
          <p className="text-gray-500">Actualmente no hay productos disponibles en nuestra tienda.</p>
        </div>
      )}

      {/* Modal de imagen mejorado */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-40 backdrop-blur-md transition-opacity"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white bg-opacity-90 rounded-lg overflow-auto shadow-xl backdrop-filter"
            onClick={(e) => e.stopPropagation()} // Evita cerrar modal al hacer clic dentro
          >
            <div className="absolute top-0 right-0 p-2 z-10">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
              >
                X
              </button>
            </div>

            <img
              src={selectedImage.imageUrl}
              alt="Producto"
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />

            {/* Aquí agregamos la descripción */}
            {selectedImage.description && (
              <div className="p-4 text-gray-700 text-center">
                <p>{selectedImage.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EcommercePages
