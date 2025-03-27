import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCar, FaMapMarkerAlt, FaBuilding, FaBook } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaCar className="text-2xl text-red-600" />
              <span className="text-xl font-bold text-gray-800">YatraXpress</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors">
              Contact
            </Link>
            <Link to="/office" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
              <FaBuilding className="mr-1" />
              Offices
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
              <FaBook className="mr-1" />
              Blog
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-red-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/my-rides" className="text-gray-600 hover:text-red-600 transition-colors">
                  My Rides
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                  <FaUser className="mr-1" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/office"
              className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FaBuilding className="mr-2" />
              Offices
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <FaBook className="mr-2" />
              Blog
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-rides"
                  className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Rides
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:text-red-600 transition-colors flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;