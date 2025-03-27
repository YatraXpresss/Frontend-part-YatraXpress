import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCar, FaUsers, FaClock, FaMoneyBillWave, FaStar, FaComments } from 'react-icons/fa';
import Map from '../components/Map';
import Chat from '../components/Chat';

const BookRide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [activeSelection, setActiveSelection] = useState(null); // 'pickup' or 'dropoff'
  const [selectedRider, setSelectedRider] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Sample available riders
  const availableRiders = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      vehicle: 'Toyota Camry',
      rating: 4.8,
      totalRides: 156,
      price: 2500,
      estimatedTime: '2 hours',
      position: [29.2097, 81.6177] // Kalikot
    },
    {
      id: 2,
      name: 'Sita Sharma',
      vehicle: 'Honda Civic',
      rating: 4.9,
      totalRides: 89,
      price: 2300,
      estimatedTime: '2.5 hours',
      position: [26.5455, 87.8942] // Jhapa
    },
    {
      id: 3,
      name: 'Bishnu Thapa',
      vehicle: 'Suzuki Swift',
      rating: 4.7,
      totalRides: 234,
      price: 2100,
      estimatedTime: '3 hours',
      position: [28.6862, 80.9823] // Kailali
    }
  ];

  useEffect(() => {
    if (location.state) {
      setPickupLocation(location.state.pickupLocation);
      setDropoffLocation(location.state.dropoffLocation);
      setPassengers(location.state.passengers);
      setSelectedDistrict(location.state.district);
    }
  }, [location]);

  const handleLocationSelect = (type, position) => {
    if (type === 'pickup') {
      setSelectedPickup(position);
      setPickupLocation(`${position[0].toFixed(4)}, ${position[1].toFixed(4)}`);
    } else {
      setSelectedDropoff(position);
      setDropoffLocation(`${position[0].toFixed(4)}, ${position[1].toFixed(4)}`);
    }
    setActiveSelection(null);
  };

  const handleBookRide = (rider) => {
    // Here you would typically make an API call to book the ride
    navigate('/my-rides', {
      state: {
        booking: {
          rider,
          pickup: pickupLocation,
          dropoff: dropoffLocation,
          passengers,
          date: new Date().toISOString()
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Ride</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveSelection('pickup')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSelection === 'pickup'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Select Pickup
                  </button>
                  <button
                    onClick={() => setActiveSelection('dropoff')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSelection === 'dropoff'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Select Drop-off
                  </button>
                </div>
              </div>
              <Map
                height="500px"
                markers={[
                  ...(selectedPickup ? [{
                    position: selectedPickup,
                    title: 'Pickup Location',
                    description: pickupLocation
                  }] : []),
                  ...(selectedDropoff ? [{
                    position: selectedDropoff,
                    title: 'Drop-off Location',
                    description: dropoffLocation
                  }] : []),
                  ...availableRiders.map(rider => ({
                    position: rider.position,
                    title: rider.name,
                    description: `${rider.vehicle} - Rating: ${rider.rating}`
                  }))
                ]}
                center={[28.3949, 84.1240]} // Center of Nepal
                zoom={7}
                onLocationSelect={activeSelection ? handleLocationSelect : null}
              />
            </div>
            
            {/* Chat Section */}
            {showChat && selectedRider && (
              <div className="mt-8">
                <Chat
                  riderId={selectedRider.id}
                  riderName={selectedRider.name}
                  userId="user123" // Replace with actual user ID
                  userName="John Doe" // Replace with actual user name
                />
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Ride Details</h2>
              <div className="space-y-6">
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
                      placeholder="Select on map"
                      readOnly
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
                      placeholder="Select on map"
                      readOnly
                    />
                  </div>
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
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Riders</h3>
                  <div className="space-y-4">
                    {availableRiders.map((rider) => (
                      <div
                        key={rider.id}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{rider.name}</h4>
                            <p className="text-sm text-gray-600">{rider.vehicle}</p>
                          </div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{rider.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            {rider.estimatedTime}
                          </div>
                          <div className="flex items-center">
                            <FaMoneyBillWave className="mr-1" />
                            Rs. {rider.price}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleBookRide(rider)}
                            className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRider(rider);
                              setShowChat(true);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                          >
                            <FaComments />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide; 