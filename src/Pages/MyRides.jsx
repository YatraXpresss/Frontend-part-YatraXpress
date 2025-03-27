import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaClock, FaUser, FaStar, FaCheck, FaSpinner } from 'react-icons/fa';

const MyRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, cancelled

  useEffect(() => {
    fetchRides();
  }, [filter]);

  const fetchRides = async () => {
    try {
      const response = await fetch(`/api/rides/user-rides?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rides');
      }

      const data = await response.json();
      setRides(data.rides);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
        <p className="text-gray-600 mt-2">View and manage your ride history</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Rides
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-md ${
            filter === 'cancelled'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancelled
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No rides found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ride #{ride.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(ride.created_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                    {ride.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Locations */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">Pickup:</span>
                        <span className="text-sm text-gray-600">{ride.pickup_location}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium text-gray-900">Dropoff:</span>
                        <span className="text-sm text-gray-600">{ride.dropoff_location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rider Information */}
                  {ride.rider && (
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaUser className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">Rider:</span>
                          <span className="text-sm text-gray-600">{ride.rider.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-medium text-gray-900">Vehicle:</span>
                          <span className="text-sm text-gray-600">{ride.rider.vehicle_type}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaStar className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">{ride.rider.rating}</span>
                      </div>
                    </div>
                  )}

                  {/* Ride Details */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <FaClock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {ride.pickup_time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {ride.passengers} {ride.passengers === 1 ? 'Passenger' : 'Passengers'}
                      </span>
                    </div>
                    {ride.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <FaCheck className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides; 