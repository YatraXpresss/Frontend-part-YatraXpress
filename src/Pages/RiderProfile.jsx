import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RiderProfile = () => {
  const { id } = useParams();
  const [rider, setRider] = useState(null);

  // Dummy data for riders
  const riders = [
    { id: 1, name: "Ravi Kumar", experience: "5 years", rating: "4.8/5", vehicle: "Bolero", available: "Monday to Friday, 9 AM - 6 PM" },
    { id: 2, name: "Anjali Sharma", experience: "3 years", rating: "4.7/5", vehicle: "Bike", available: "Tuesday to Saturday, 10 AM - 5 PM" },
    { id: 3, name: "Sandeep Rai", experience: "6 years", rating: "4.9/5", vehicle: "Bolero", available: "Monday to Saturday, 8 AM - 7 PM" },
    { id: 4, name: "Pooja Adhikari", experience: "4 years", rating: "4.6/5", vehicle: "Bike", available: "Monday to Friday, 9 AM - 5 PM" },
    { id: 5, name: "Arjun Singh", experience: "7 years", rating: "5/5", vehicle: "Bolero", available: "Wednesday to Sunday, 10 AM - 6 PM" },
    { id: 6, name: "Neha Gurung", experience: "2 years", rating: "4.5/5", vehicle: "Bike", available: "Tuesday to Friday, 8 AM - 4 PM" },
    { id: 7, name: "Rajesh Thapa", experience: "8 years", rating: "4.9/5", vehicle: "Bolero", available: "Monday to Friday, 7 AM - 5 PM" },
    { id: 8, name: "Maya KC", experience: "5 years", rating: "4.7/5", vehicle: "Bike", available: "Monday to Saturday, 9 AM - 6 PM" }
  ];

  // Fetch rider details based on ID
  useEffect(() => {
    const riderData = riders.find((rider) => rider.id === parseInt(id));
    setRider(riderData);
  }, [id]);

  return (
    <div className="bg-white min-h-screen p-8">
      {rider ? (
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Rider Profile</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Rider Image on the left */}
            <div className="flex-shrink-0">
              <img
                src="https://example.com/rider-photo.jpg"
                alt={rider.name}
                className="w-40 h-40 object-cover rounded-full mb-4 shadow-lg"
              />
            </div>
            {/* Rider Information on the right */}
            <div className="flex-1">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">{rider.name}</h3>
              <p className="text-lg text-gray-700 mb-3">Experience: {rider.experience}</p>
              <p className="text-lg text-gray-700 mb-3">Rating: {rider.rating}</p>
              <p className="text-lg text-gray-700 mb-3">Vehicle: {rider.vehicle}</p>
              <p className="text-lg text-gray-700 mb-3">Available: {rider.available}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-left gap-8 mt-8">
            <button
              className="py-2 px-6 bg-black text-white text-xl rounded-lg border-2 border-black cursor-pointer transition-all hover:bg-gray-800"
              onClick={() => alert("Ride booked!")}
            >
              Book Ride
            </button>
            <button
              className="py-2 px-6 bg-black text-white text-xl rounded-lg border-2 border-black cursor-pointer transition-all hover:bg-gray-800"
              onClick={() => alert("Contacting the rider...")}
            >
              Contact
            </button>
          </div>
        </section>
      ) : (
        <p className="text-center text-xl text-gray-600">Loading rider details...</p>
      )}
    </div>
  );
};

export default RiderProfile;
