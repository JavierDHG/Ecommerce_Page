import { useState, useEffect } from "react"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import updatePassword from "../services/update_password"
import updateEmail from "../services/update_email"
import updateUsername from "../services/update_name"
import deleteUser from "../services/delete_user"
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertTriangle,
  Check,
  X,
  Shield,
  Save,
  Trash2,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"

function EcommerceProfile() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  // Estados para formularios
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Estados para datos de perfil
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")

  // Estado para notificaciones
  const [notification, setNotification] = useState(null)

  // Estado para avatar
  const [avatar, setAvatar] = useState(user?.avatar || null)

  // Validación de contraseña
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray",
  })

  // Efecto para validar la fortaleza de la contraseña
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, message: "", color: "gray" })
      return
    }

    let score = 0
    if (newPassword.length >= 8) score += 1
    if (/[A-Z]/.test(newPassword)) score += 1
    if (/[0-9]/.test(newPassword)) score += 1
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1

    let message = ""
    let color = ""

    switch (score) {
      case 0:
      case 1:
        message = "Débil"
        color = "red"
        break
      case 2:
        message = "Moderada"
        color = "orange"
        break
      case 3:
        message = "Buena"
        color = "blue"
        break
      case 4:
        message = "Fuerte"
        color = "green"
        break
    }

    setPasswordStrength({ score, message, color })
  }, [newPassword])

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error")
      return
    }

    if (passwordStrength.score < 2) {
      showNotification("La contraseña es demasiado débil", "error")
      return
    }

    setIsLoading(true)
    try {
      await updatePassword(user.id, newPassword, currentPassword)
      showNotification("Contraseña actualizada con éxito", "success")
      setNewPassword("")
      setConfirmPassword("")
      setCurrentPassword("")
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error)
      showNotification("Error al actualizar la contraseña. Por favor, inténtelo de nuevo.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async () => {
    setIsLoading(true)
    try {
      // Actualizar nombre de usuario si ha cambiado
      if (username !== user.username) {
        await updateUsername(user.id, username)
      }

      // Actualizar email si ha cambiado
      if (email !== user.email) {
        await updateEmail(user.id, email)
      }

      // Actualizar otros campos (simulado)
      // En un caso real, estos serían llamadas a API adicionales

      // Actualizar el estado del usuario
      setUser({
        ...user,
        username,
        email,
      })

      showNotification("Perfil actualizado con éxito, asegurate de cerrar sesión y volver a iniciar sesión para reflejar los cambios", "success")
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      showNotification("Error al actualizar el perfil. Por favor, inténtelo de nuevo.", "error")
    } finally {
      setIsLoading(false)
    }
  }


  const handleDelete = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
    )

    if (!confirmed) return

    setIsLoading(true)
    try {
      await deleteUser(user.id)
      showNotification("Usuario eliminado con éxito", "success")
      // Cerrar sesión
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      navigate("/ecommerce-login")
    } catch (error) {
      console.error("Error al eliminar el usuario:", error)
      showNotification("Error al eliminar el usuario. Por favor, inténtelo de nuevo.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword)
        break
      case "new":
        setShowPassword(!showPassword)
        break
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-16 md:mt-20">
      {/* Notificación */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/ecommerce")}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Volver a la tienda</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Perfil resumido */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-emerald-600" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{user?.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              <div className="mt-2 text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">Cliente Premium</div>
            </div>

            {/* Menú de navegación */}
            <nav className="p-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeTab === "general"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                <span>Información personal</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeTab === "security"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <Shield className="h-5 w-5 mr-3" />
                <span>Seguridad</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
              <button
                onClick={() => setActiveTab("danger")}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                  activeTab === "danger"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <AlertTriangle className="h-5 w-5 mr-3" />
                <span>Zona de peligro</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Información personal */}
            {activeTab === "general" && (
              <div>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Información personal</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Actualiza tu información personal y de contacto
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre de usuario */}
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Nombre de usuario
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>     
                  </div>

                  {/* Botón de guardar */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleProfileSubmit}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeTab === "security" && (
              <div>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Seguridad de la cuenta</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Actualiza tu contraseña y configura opciones de seguridad
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Cambiar contraseña</h3>

                  {/* Contraseña actual */}
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva contraseña */}
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Indicador de fortaleza */}
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-xs font-medium"
                            style={{ color: `var(--tw-${passwordStrength.color}-500)` }}
                          >
                            {passwordStrength.message}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                          <div
                            className={`h-1.5 rounded-full bg-${passwordStrength.color}-500`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          ></div>
                        </div>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                          <li className={`flex items-center ${newPassword.length >= 8 ? "text-green-500" : ""}`}>
                            {newPassword.length >= 8 ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Al menos 8 caracteres
                          </li>
                          <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? "text-green-500" : ""}`}>
                            {/[A-Z]/.test(newPassword) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Al menos una mayúscula
                          </li>
                          <li className={`flex items-center ${/[0-9]/.test(newPassword) ? "text-green-500" : ""}`}>
                            {/[0-9]/.test(newPassword) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Al menos un número
                          </li>
                          <li
                            className={`flex items-center ${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-500" : ""}`}
                          >
                            {/[^A-Za-z0-9]/.test(newPassword) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Al menos un carácter especial
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Confirmar nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Mensaje de error si las contraseñas no coinciden */}
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <div className="mt-2 flex items-center text-red-500 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Las contraseñas no coinciden</span>
                      </div>
                    )}
                  </div>

                  {/* Botón de actualizar contraseña */}
                  <div className="pt-4">
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword ||
                        newPassword !== confirmPassword ||
                        isLoading
                      }
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Actualizar contraseña
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Zona de peligro */}
            {activeTab === "danger" && (
              <div>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Zona de peligro</h2>
                  <p className="text-red-500 dark:text-red-300 mt-1">
                    Las acciones en esta sección pueden tener consecuencias permanentes
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Eliminar cuenta</h3>
                    <p className="text-red-500 dark:text-red-300 mb-4">
                      Al eliminar tu cuenta, todos tus datos serán borrados permanentemente. Esta acción no se puede
                      deshacer.
                    </p>
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar mi cuenta
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcommerceProfile
