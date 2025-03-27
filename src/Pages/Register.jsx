import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import debounce from 'lodash/debounce';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    user_type: 'customer'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [lastSubmitAttempt, setLastSubmitAttempt] = useState(null);
  const submitCooldown = 2000; // 2 seconds cooldown
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validationCache = new Map();
  const validateField = useCallback((name, value) => {
    const cacheKey = `${name}:${value}`;
    
    if (validationCache.has(cacheKey)) {
      return validationCache.get(cacheKey);
    }

    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!validateEmail(value.trim())) error = 'Please enter a valid email';
        break;
      case 'password':
        if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phone':
        if (value && !value.trim().match(/^[0-9]{10}$/)) error = 'Enter a valid 10-digit number';
        break;
      default:
        break;
    }

    validationCache.set(cacheKey, error);
    return error;
  }, [formData.password]);

  const debouncedValidation = useCallback(
    debounce((name, value) => {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }, 300),
    [validateField]
  );

  useEffect(() => {
    const isValid = Object.values(fieldErrors).every(error => !error) &&
      formData.name && formData.email && formData.password && formData.confirmPassword;
    setIsFormValid(isValid);
  }, [fieldErrors, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
    debouncedValidation(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError('Please fix all errors before submitting');
      return;
    }

    const now = Date.now();
    if (lastSubmitAttempt && (now - lastSubmitAttempt) < submitCooldown) {
      setError('Please wait a moment before trying again');
      return;
    }
    setLastSubmitAttempt(now);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

    setLoading(true);

    try {
      await register({
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
        phone: trimmedPhone,
        user_type: formData.user_type
      });
      
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } catch (err) {
      if (!navigator.onLine) {
        setError('Network connection lost. Please check your internet connection and try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please try again later.');
      } else if (err.message.includes('Email already registered')) {
        setError('This email is already registered. Please use a different email.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 transform transition-all duration-500 ease-in-out hover:scale-[1.01]">

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-fade-in transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${fieldErrors.name ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out hover:border-blue-300`}
                  placeholder="Full Name"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{fieldErrors.name}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${fieldErrors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out hover:border-blue-300`}
                  placeholder="Email address"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${fieldErrors.phone ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out hover:border-blue-300`}
                  placeholder="Phone Number"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`appearance-none rounded-md block w-full pl-10 pr-10 py-2 border ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'} text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{fieldErrors.confirmPassword}</p>
                )}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`appearance-none rounded-md block w-full pl-10 pr-10 py-2 border ${fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{fieldErrors.confirmPassword}</p>
                )}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Register as
              </label>
              <div className="mt-1 relative">
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-2 text-base rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-400 shadow-sm"
                >
                  <option value="customer" className="py-2">Customer</option>
                  <option value="rider" className="py-2">Rider</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transform transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5 transition-all duration-300" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;