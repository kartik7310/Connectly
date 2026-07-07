import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-primary-600 text-white flex items-center justify-center text-sm">
                C
              </div>
              Connexto
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              A professional platform for building meaningful connections and sharing knowledge.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/feed" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Feed</Link></li>
              <li><Link to="/connections" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Connections</Link></li>
              <li><Link to="/blogs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Blogs</Link></li>
              <li><Link to="/premium" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Premium</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Connexto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer