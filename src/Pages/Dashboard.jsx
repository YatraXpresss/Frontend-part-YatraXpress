import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaMotorcycle, FaMapMarkerAlt, FaClock, FaStar, FaChartLine, FaBell, FaHistory } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    completedRides: 0,
    rating: 0,
    earnings: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentRides(data.recentRides);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">Error loading dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user.user_type === 'rider' ? 'Track your rides and earnings' : 'Manage your rides and bookings'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaMotorcycle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rides</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRides}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Rides</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedRides}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaStar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rating}</p>
            </div>
          </div>
        </div>

        {user.user_type === 'rider' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.earnings}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {recentRides.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100">
                      <FaHistory className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {ride.pickup_location} → {ride.dropoff_location}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(ride.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                      ride.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ride.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.user_type === 'rider' ? (
          <>
            <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <FaBell className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">View Ride Requests</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">Update Location</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <FaUser className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">Edit Profile</span>
            </button>
          </>
        ) : (
          <>
            <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <FaMotorcycle className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">Book a Ride</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <FaHistory className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">Ride History</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <FaUser className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">Edit Profile</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 