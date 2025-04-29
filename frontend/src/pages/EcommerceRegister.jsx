"use client"

import { useState } from "react"
import { useRegister } from "../services/useRegister"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, UserPlus, User, Mail, Lock, AlertCircle, CheckCircle, X } from "lucide-react"

const EcommerceRegister = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { register, message } = useRegister()
  const navigate = useNavigate()

  // Evaluar la fortaleza de la contraseña
  const evaluatePasswordStrength = (pass) => {
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    evaluatePasswordStrength(newPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !email || !password) {
      return // Evitar envío si hay campos vacíos
    }

    if (password !== confirmPassword) {
      return // Las contraseñas no coinciden
    }

    if (!acceptTerms) {
      return // No ha aceptado los términos
    }

    setIsLoading(true)
    try {
      await register(username, email, password)
    } catch (error) {
      console.error("Error durante el registro:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Card con efecto de vidrio */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-100/30 backdrop-blur-xl"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-teal-100/20 backdrop-blur-xl"></div>

          <div className="relative px-6 pt-10 pb-8 sm:px-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">Crear cuenta</h2>
              <p className="mt-2 text-center text-sm text-gray-600">Únete a nuestra comunidad de compradores</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Indicador de fortaleza de contraseña */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Fortaleza de la contraseña</span>
                      <span className="text-xs font-medium">
                        {passwordStrength === 0 && "Muy débil"}
                        {passwordStrength === 1 && "Débil"}
                        {passwordStrength === 2 && "Media"}
                        {passwordStrength === 3 && "Fuerte"}
                        {passwordStrength === 4 && "Muy fuerte"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 0
                            ? "w-1/4 bg-red-500"
                            : passwordStrength === 1
                              ? "w-2/4 bg-orange-500"
                              : passwordStrength === 2
                                ? "w-3/4 bg-yellow-500"
                                : passwordStrength === 3
                                  ? "w-full bg-emerald-500"
                                  : "w-full bg-green-500"
                        }`}
                      ></div>
                    </div>
                    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                      <li className="flex items-center">
                        {password.length >= 8 ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Mínimo 8 caracteres
                      </li>
                      <li className="flex items-center">
                        {/[A-Z]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Una mayúscula
                      </li>
                      <li className="flex items-center">
                        {/[0-9]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Un número
                      </li>
                      <li className="flex items-center">
                        {/[^A-Za-z0-9]/.test(password) ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        Un carácter especial
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 ${
                      confirmPassword
                        ? password === confirmPassword
                          ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                  />
                  {confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {password === confirmPassword ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    Acepto los{" "}
                    <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                      Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                      Política de Privacidad
                    </a>
                  </label>
                </div>
              </div>

              {message && (
                <div className="flex items-center p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !username ||
                    !email ||
                    !password ||
                    password !== confirmPassword ||
                    !acceptTerms ||
                    passwordStrength < 2
                  }
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-medium shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <UserPlus className="h-5 w-5 text-emerald-100 group-hover:text-white transition-colors" />
                  </span>
                  {isLoading ? (
                    <div className="flex items-center">
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
                      Registrando...
                    </div>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/ecommerce-login")}
                  className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcommerceRegister
