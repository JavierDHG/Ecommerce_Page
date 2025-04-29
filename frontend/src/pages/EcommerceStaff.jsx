import { useState, useEffect } from "react"
import createProduct from "../services/create_products"
import { getCategories } from "../services/categoryService"
import createCategories from "../services/create_categories"
import { BookmarkPlus, Upload, Tag, Package, DollarSign, FileText, LayoutGrid } from "lucide-react"

function EcommerceStaff() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categories, setCategories] = useState([{ id: "all", name: "Todas las categorías" }])
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productQuantity, setProductQuantity] = useState("")
  const [productImage, setProductImage] = useState("")
  const [fileName, setFileName] = useState("Ninguna imagen seleccionada")

  // Show the categories in the select input
  const fetchCategories = async () => {
    try {
      const data = await getCategories()

      const normalizedData = data.map((cat) => ({
        id: cat.id,
        name: cat.title,
      }))

      setCategories([{ id: "all", name: "Todas las categorías" }, ...normalizedData])
    } catch (err) {
      console.error("Error al cargar categorías", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Create the categories in the backend
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const newCategory = { title: newCategoryName }
      await createCategories(newCategory)
      setNewCategoryName("")
      fetchCategories()
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const handleCreateProduct = async () => {
    try {
      const formData = new FormData()
      formData.append("category", selectedCategory)
      formData.append("title", productName)
      formData.append("description", productDescription)
      formData.append("price", Number.parseInt(productPrice))
      formData.append("stock", Number.parseInt(productQuantity))
      formData.append("image", productImage)

      await createProduct(formData)
      console.log("Producto creado exitosamente")

      setSelectedCategory("all")
      setProductImage("")
      setFileName("No file chosen")
      setProductName("")
      setProductDescription("")
      setProductPrice("")
      setProductQuantity("")
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 container mx-auto px-4 py-8 md:py-12 lg:py-16 mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-8 md:mb-12">
          Ecommerce Staff Panel
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
              <Package className="mr-2" />
              Administración de Productos
            </h2>
            <p className="text-emerald-50 mt-1">Añade productos a tu tienda</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Category Section */}
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-emerald-600" />
                    Administrador de Categorías
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                        Seleccionar categoría
                      </label>
                      <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg py-2.5 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="category-name"
                        type="text"
                        placeholder="Nueva categoría"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg py-2.5 px-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center whitespace-nowrap"
                        onClick={handleCreateCategory}
                      >
                        <BookmarkPlus className="w-4 h-4 mr-1.5" />
                        Añade Categoría
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-emerald-600" />
                    Imagen del Producto
                  </h3>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors duration-200">
                    <input className="hidden" id="product-image" type="file" onChange={handleImageChange} />
                    <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center justify-center">
                      <Upload className="w-10 h-10 text-emerald-500 mb-2" />
                      <span className="text-sm font-medium text-emerald-600">Click para subir una imagen</span>
                      <span className="text-xs text-gray-500 mt-1">{fileName}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <LayoutGrid className="w-5 h-5 mr-2 text-emerald-600" />
                  Detalles del Producto
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-name">
                    Nombre del Producto
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      id="product-name"
                      type="text"
                      placeholder="Ingrese el nombre del producto"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                    <Package className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-price">
                    Precio
                  </label>
                  <div className="relative">
                    <input
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      id="product-price"
                      type="text"
                      placeholder="Ingrese el precio del producto"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-quantity">
                    Stock
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    id="product-quantity"
                    type="number"
                    placeholder="Ingrese la cantidad de stock del producto"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-description">
                    Descripción del Producto
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      id="product-description"
                      maxLength={200}
                      rows={4}
                      placeholder="Ingrese la descripción del producto. (máx. 200 caracteres)"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium py-3 px-8 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center mx-auto"
                onClick={handleCreateProduct}
              >
                <Package className="w-5 h-5 mr-2" />
                Crear Producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcommerceStaff
