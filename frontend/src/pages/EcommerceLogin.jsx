"use client"

import { useState } from "react"
import { useLogin } from "../services/useLogin"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, LogIn, User, Lock, AlertCircle } from "lucide-react"

const EcommerceLogin = () => {
  const { login, message, isLoading } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
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
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">Bienvenido de nuevo</h2>
              <p className="mt-2 text-center text-sm text-gray-600">Inicia sesión para acceder a tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
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
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
                    onClick={() => navigate("/forgot-password")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
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
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-medium shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className="h-5 w-5 text-emerald-100 group-hover:text-white transition-colors" />
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
                      Iniciando sesión...
                    </div>
                  ) : (
                    "Iniciar sesión"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/ecommerce-register")}
                  className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Regístrate ahora
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcommerceLogin
