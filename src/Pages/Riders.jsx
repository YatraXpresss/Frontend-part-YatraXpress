import React from "react";
import { Link } from "react-router-dom";

const Riders = () => {
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

  return (
    <div className="bg-white min-h-screen p-8">
      <main className="space-y-12">
        {/* Rider Profiles Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-4xl font-extrabold text-left text-gray-800 mb-10">Meet Our Riders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {riders.map((rider) => (
              <div key={rider.id} className="flex flex-col items-left bg-white p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105">
                <img
                  src="https://example.com/rider-photo.jpg"
                  alt={rider.name}
                  className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-gray-200 shadow-md"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{rider.name}</h3>
                <p className="text-md text-gray-600 mb-2">Experience: {rider.experience}</p>
                <p className="text-md text-gray-600 mb-2">Rating: {rider.rating}</p>
                <p className="text-md text-gray-600 mb-4">Vehicle: {rider.vehicle}</p>
                <Link to={`/rider/${rider.id}`}>
                  <button
                    className="py-2 px-6 bg-black text-white text-lg rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    View Profile
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Riders;
