import React, { useState, useEffect } from "react";
import RideRating from "../components/RideRating";
import { useNavigate } from "react-router-dom";

const RidePage = () => {
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideRatings, setRideRatings] = useState({
    bolero: { average_rating: 0 },
    bike: { average_rating: 0 }
  });
  const [rideCounts, setRideCounts] = useState({
    bolero: { completed_rides: 0 },
    bike: { completed_rides: 0 }
  });

  useEffect(() => {
    // Fetch ratings and counts for each ride type
    const fetchData = async () => {
      try {
        const [ratingsResponse, countsResponse] = await Promise.all([
          fetch('/api/rides/ratings'),
          fetch('/api/rides/counts')
        ]);
        
        const ratingsData = await ratingsResponse.json();
        const countsData = await countsResponse.json();
        
        setRideRatings(ratingsData.ratings);
        setRideCounts(countsData.counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRatingSubmit = async (rideId, rating) => {
    try {
      const response = await fetch('/api/ratings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rideId, rating })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit rating');
      }

      const data = await response.json();
      
      setRideRatings(prev => ({
        ...prev,
        [rideId]: {
          ...prev[rideId],
          average_rating: data.average_rating
        }
      }));

      // Refresh ride counts after successful rating
      const countsResponse = await fetch('/api/rides/counts');
      const countsData = await countsResponse.json();
      setRideCounts(countsData.counts);
    } catch (error) {
      console.error('Error updating rating:', error);
      // You might want to show this error to the user through a toast notification
      alert(error.message || 'Failed to submit rating. Please try again.');
    }
  };
  return (
    <div className="bg-white min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <header className="text-center mb-20">
        <h1 className="text-6xl font-extrabold text-black mb-6 tracking-tight">Choose Your Ride</h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Experience comfort and reliability with our premium ride options</p>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* Bolero Ride */}
        <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
          <div className="flex flex-col md:flex-row relative">
            <div className="md:w-2/5 relative overflow-hidden">
              <img
                src="https://example.com/bolero.jpg"
                alt="Bolero Vehicle"
                className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm bg-opacity-90 tracking-wide">
                Available Now
              </div>
            </div>
            <div className="md:w-3/5 p-12 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Bolero</h2>
                  <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-sm">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="font-semibold text-lg">{rideRatings.bolero?.average_rating || 0}</span>
                    <span className="text-gray-500">({rideCounts.bolero?.completed_rides || 0} rides)</span>
                  </div>
                </div>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">Comfortable and spacious SUV, perfect for family trips or group rides. Includes AC and premium seating.</p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span className="font-medium">Up to 7 seats</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    <span className="font-medium">Card Payment</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Starting from</p>
                  <p className="text-4xl font-bold text-black mt-1">₹500 <span className="text-xl font-normal text-gray-500">/ 10km</span></p>
                </div>
                <button 
                  onClick={() => navigate('/riders', { state: { vehicleType: 'bolero' } })}
                  className="bg-black text-white px-10 py-4 rounded-2xl font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bike Ride */}
        <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
          <div className="flex flex-col md:flex-row relative">
            <div className="md:w-2/5 relative overflow-hidden">
              <img
                src="https://example.com/bike.jpg"
                alt="Bike Vehicle"
                className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm bg-opacity-90 tracking-wide">
                Available Now
              </div>
            </div>
            <div className="md:w-3/5 p-12 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Bike</h2>
                  <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-sm">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="font-semibold text-lg">{rideRatings.bike?.average_rating || 0}</span>
                    <span className="text-gray-500">({rideCounts.bike?.completed_rides || 0} rides)</span>
                  </div>
                </div>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">Fast, efficient, and fun ride option perfect for solo travelers and short trips. Includes helmet and safety gear.</p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span className="font-medium">Quick arrival</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    <span className="font-medium">Card Payment</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Starting from</p>
                  <p className="text-4xl font-bold text-black mt-1">₹150 <span className="text-xl font-normal text-gray-500">/ 10km</span></p>
                </div>
                <button 
                  onClick={() => navigate('/riders', { state: { vehicleType: 'bike' } })}
                  className="bg-black text-white px-10 py-4 rounded-2xl font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wide"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How We Hire Riders Section */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 mt-16 shadow-inner">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">How We Ensure Quality Service</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Rider Selection</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Thorough background verification</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Minimum 3 years of experience</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Professional training program</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Regular vehicle maintenance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Real-time ride tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RidePage;
