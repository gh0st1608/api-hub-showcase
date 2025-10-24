import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="relative bg-gray-800 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* --- Mobile Menu Button --- */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* --- Logo + Links --- */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <a href="/" className="flex shrink-0 items-center">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="APIHub"
                className="h-8 w-auto"
              />
              <span className="ml-2 font-semibold text-white">APIHub</span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Dashboard
                </a>
              </div>
            </div>
          </div>

          {/* --- Right Icons --- */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <Bell size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Configuración
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Dropdown --- */}
      {isOpen && (
        <div className="sm:hidden bg-gray-900">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a
              href="#"
              className="block rounded-md bg-gray-800 px-3 py-2 text-base font-medium text-white"
            >
              Dashboard
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
