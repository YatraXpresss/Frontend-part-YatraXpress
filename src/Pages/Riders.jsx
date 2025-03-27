import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch('/api/riders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch riders');
      }

      const data = await response.json();
      setRiders(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching riders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRiders = filter === 'all' 
    ? riders 
    : riders.filter(rider => rider.vehicle_type.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Riders</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('bike')}
              className={`px-4 py-2 rounded-lg ${filter === 'bike' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
              Bike
            </button>
            <button 
              onClick={() => setFilter('car')}
              className={`px-4 py-2 rounded-lg ${filter === 'car' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
              Car
            </button>
            <button 
              onClick={() => setFilter('scooter')}
              className={`px-4 py-2 rounded-lg ${filter === 'scooter' ? 'bg-black text-white' : 'bg-gray-200'}`}
            >
              Scooter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRiders.map((rider) => (
            <Link 
              key={rider.id} 
              to={`/rider/${rider.id}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {rider.profile_image ? (
                      <img 
                        src={rider.profile_image} 
                        alt={rider.name} 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-600">
                        {rider.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">{rider.name}</h2>
                    <p className="text-sm text-gray-500">{rider.vehicle_type}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">{rider.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {rider.experience_years} years experience
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {rider.total_rides} total rides
                  </div>
                  <div className="flex items-center text-sm">
                    <span className={rider.is_available ? 'text-green-500' : 'text-red-500'}>
                      {rider.is_available ? '● Available now' : '● Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Riders;
