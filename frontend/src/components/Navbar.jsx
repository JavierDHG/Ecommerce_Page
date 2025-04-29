"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { useUser } from "../context/UserContext";
import {
  Home,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  ChevronDown,
  Package,
  PackagePlus,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Efecto para detectar el scroll y cambiar la apariencia de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate("/ecommerce");
  };

  // Función para navegar y cerrar el menú móvil
  const navigateTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Función para alternar el menú de usuario
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md text-gray-800"
          : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo("/ecommerce")}
              className="flex items-center space-x-2 font-bold text-xl transition-transform duration-300 hover:scale-105"
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="hidden sm:inline">EcoStore</span>
            </button>
          </div>

          {/* Navegación para escritorio */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigateTo("/ecommerce")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                scrolled
                  ? "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => navigateTo("/ecommerce-cart")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 relative ${
                scrolled
                  ? "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user?.is_staff && (
              <button
                onClick={() => navigateTo("/ecommerce-staff")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 relative ${
                  scrolled
                    ? "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                <PackagePlus className="h-4 w-4" />
                <span>Añadir Productos</span>
              </button>
            )}
          </nav>

          {/* Sección de usuario para escritorio */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled
                      ? "hover:bg-gray-100 text-gray-800"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      scrolled
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Menú desplegable de usuario */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo("/ecommerce-profile")}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => navigateTo("/ecommerce-history")}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      Mis Pedidos
                    </button>
                    <div className="border-t border-gray-100 mt-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigateTo("/ecommerce-login")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-emerald-600 hover:bg-emerald-50"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigateTo("/ecommerce-register")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    scrolled
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-white text-emerald-600 hover:bg-white/90"
                  }`}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md focus:outline-none"
          >
            {isMenuOpen ? (
              <X
                className={`h-6 w-6 ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-white shadow-inner">
          <button
            onClick={() => navigateTo("/ecommerce")}
            className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </button>
          <button
            onClick={() => navigateTo("/ecommerce-cart")}
            className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="absolute top-3 left-7 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          {user?.is_staff && (
            <button
              onClick={() => navigateTo("/ecommerce-staff")}
              className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Administrar</span>
            </button>
          )}
          <div className="border-t border-gray-200 my-2"></div>

          {user ? (
            <>
              <div className="px-4 py-2">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateTo("/ecommerce-profile")}
                className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <User className="h-5 w-5" />
                <span>Mi Perfil</span>
              </button>
              <button
                onClick={() => navigateTo("/ecommerce-history")}
                className="w-full flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Package className="h-5 w-5" />
                <span>Mis Pedidos</span>
              </button>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-4 py-3">
              <button
                onClick={() => navigateTo("/ecommerce-login")}
                className="w-full py-2 text-center rounded-md border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigateTo("/ecommerce-register")}
                className="w-full py-2 text-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Espacio para evitar que el contenido quede debajo de la navbar */}
      <div className={`h-16 md:h-20 ${isMenuOpen ? "hidden" : "hidden"}`}></div>
    </header>
  );
};

export default Navbar;
