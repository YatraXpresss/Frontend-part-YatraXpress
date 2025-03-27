import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const RiderProfile = () => {
  const { id } = useParams();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRiderDetails();
  }, [id]);

  const fetchRiderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const response = await fetch(`/api/riders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch rider details');
      }

      const data = await response.json();
      setRider(data.rider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching rider details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !rider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">{error || 'Rider not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/riders" 
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Riders
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                {rider.profile_image ? (
                  <img 
                    src={rider.profile_image} 
                    alt={rider.name} 
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-600">
                    {rider.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">{rider.name}</h1>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{rider.rating.toFixed(1)}</span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-500">{rider.total_rides} rides</span>
                </div>
              </div>
              <div className="ml-auto">
                <span 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${rider.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                >
                  {rider.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-600">{rider.vehicle_type}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <span className="text-gray-600">License: {rider.license_number}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{rider.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{rider.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience & Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{rider.experience_years}</div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{rider.total_rides}</div>
                  <div className="text-sm text-gray-500">Total Rides</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{rider.rating.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderProfile; 