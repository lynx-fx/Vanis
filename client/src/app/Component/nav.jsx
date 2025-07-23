"use client"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 caret-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">Vanis</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/") ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Upload
            </Link>
            <Link
              href="/download"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/download") ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Download
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
              <Link
                href="/upload"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/") ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                Upload
              </Link>
              <Link
                href="/download"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/download") ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                Download
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
