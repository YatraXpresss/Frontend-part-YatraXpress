import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaArrowRight, FaShieldAlt, FaStar, FaHandshake, FaUserCircle } from 'react-icons/fa';

const Home = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);

  const findAvailableRiders = async () => {
    if (!pickupLocation || !passengers) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rides/available-riders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          pickup_location: pickupLocation,
          passengers: passengers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available riders');
      }

      const data = await response.json();
      setAvailableRiders(data.available_riders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    setPickupLocation(e.target.value);
    if (pickupLocation && dropoffLocation) {
      findAvailableRiders();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRider) {
      setError('Please select a rider');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          pickup_date: date,
          pickup_time: time,
          passengers: passengers,
          rider_id: selectedRider.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book ride');
      }

      const data = await response.json();
      // Handle successful booking
      console.log('Booking successful:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Your Journey Begins Here</h1>
            <p className="text-xl mb-12">Book a ride with our professional drivers and experience safe, comfortable travel</p>
            
            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Location */}
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pickup Location"
                    value={pickupLocation}
                    onChange={handleLocationChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                {/* Dropoff Location */}
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Dropoff Location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div className="relative">
                  <FaClock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                {/* Passengers */}
                <div className="relative md:col-span-2">
                  <FaUsers className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Riders */}
                {availableRiders.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Riders</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {availableRiders.map((rider) => (
                        <div
                          key={rider.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedRider?.id === rider.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedRider(rider)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              {rider.profile_image ? (
                                <img
                                  src={rider.profile_image}
                                  alt={rider.rider_name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <FaUserCircle className="text-2xl text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{rider.rider_name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>{rider.vehicle_type}</span>
                                <span>•</span>
                                <span>{rider.experience_years} years experience</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <FaStar className="text-yellow-400 mr-1" />
                                  {rider.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading || !selectedRider}
                    className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 text-lg ${
                      loading || !selectedRider
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white transition-colors`}
                  >
                    <span>{loading ? 'Booking...' : 'Book Your Ride Now'}</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600 text-lg">Your safety is our top priority. All our drivers are verified and trained professionals.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStar className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Premium Service</h3>
              <p className="text-gray-600 text-lg">Experience luxury and comfort with our premium fleet of vehicles.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHandshake className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Reliable & Punctual</h3>
              <p className="text-gray-600 text-lg">Count on us for timely pickups and professional service every time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Professional Drivers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
