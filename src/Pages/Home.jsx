import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCar, FaUsers, FaClock, FaShieldAlt, FaSearch, FaArrowRight } from 'react-icons/fa';
import Map from '../components/Map';

const DISTRICTS = [
  { id: 'jhapa', name: 'Jhapa', description: 'Eastern Terai Region' },
  { id: 'kalikot', name: 'Kalikot', description: 'Karnali Province' },
  { id: 'kailali', name: 'Kailali', description: 'Sudurpashchim Province' }
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  // Sample markers for available rides
  const markers = [
    {
      position: [27.7172, 85.3240], // Kathmandu
      title: 'Available Ride',
      description: 'Kathmandu to Pokhara'
    },
    {
      position: [27.4716, 89.6387], // Thimphu
      title: 'Available Ride',
      description: 'Thimphu to Paro'
    },
    {
      position: [26.4521, 87.2718], // Biratnagar
      title: 'Available Ride',
      description: 'Biratnagar to Dharan'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedDistrict) {
      alert('Please select a district');
      return;
    }
    navigate('/book-ride', {
      state: {
        pickupLocation,
        dropoffLocation,
        passengers,
        district: selectedDistrict
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in">
              Your Journey, Our Priority
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100 animate-fade-in-up">
              Safe, comfortable, and reliable rides across Nepal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-red-600 transition-all transform hover:scale-105"
              >
                Book a Ride
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 transform hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Book Your Ride</h2>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter pickup location"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop-off Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter drop-off location"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Districts</option>
                  {DISTRICTS.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <div className="relative">
                  <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-[1.02] flex items-center justify-center shadow-lg"
            >
              <FaSearch className="mr-2" />
              Search Available Rides
              <FaArrowRight className="ml-2" />
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Available Rides
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Map
            height="500px"
            markers={markers}
            center={[27.7172, 85.3240]} // Kathmandu coordinates
            zoom={7}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCar className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Modern Fleet</h3>
            <p className="text-gray-600 text-center">
              Comfortable and well-maintained vehicles for your journey
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaClock className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">24/7 Service</h3>
            <p className="text-gray-600 text-center">
              Available round the clock for your convenience
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShieldAlt className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Safe Travel</h3>
            <p className="text-gray-600 text-center">
              Verified drivers and real-time tracking for your safety
            </p>
          </div>
        </div>
      </div>

      {/* Districts Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Available Districts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DISTRICTS.map((district) => (
              <div
                key={district.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedDistrict(district.id)}
              >
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaMapMarkerAlt className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{district.name}</h3>
                <p className="text-gray-600 text-center">{district.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of satisfied customers</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
