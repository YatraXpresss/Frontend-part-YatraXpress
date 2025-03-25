import React from "react";

const RidePage = () => {
  return (
    <div className="bg-white min-h-screen p-8">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-black">Choose Your Ride</h1>
        <p className="text-xl text-gray-600 mt-4">Select your ride and hit the road!</p>
      </header>

      <main className="space-y-12">
        {/* Bolero Ride */}
        <div className="flex items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg">
          <div className="w-1/3">
            <img
              src="https://example.com/bolero.jpg"
              alt="Bolero Vehicle"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="w-2/3 pl-8">
            <h2 className="text-3xl font-semibold text-black">Bolero</h2>
            <p className="text-lg text-gray-700 mt-2">
              Comfortable and spacious, perfect for family trips or group rides.
            </p>
            <p className="text-xl text-gray-900 mt-4 font-bold">₹500 for 10km</p>
            <button className="mt-6 py-2 px-4 bg-black text-white text-xl rounded-lg w-[150px] cursor-pointer transition-all hover:bg-gray-700">
              Book
            </button>
          </div>
        </div>

        {/* Bike Ride */}
        <div className="flex items-center justify-center bg-gray-100 p-8 rounded-lg shadow-lg">
          <div className="w-1/3">
            <img
              src="https://example.com/bike.jpg"
              alt="Bike Vehicle"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="w-2/3 pl-8">
            <h2 className="text-3xl font-semibold text-black">Bike</h2>
            <p className="text-lg text-gray-700 mt-2">
              Fast, efficient, and fun, perfect for solo rides and short trips.
            </p>
            <p className="text-xl text-gray-900 mt-4 font-bold">₹150 for 10km</p>
            <button className="mt-6 py-2 px-4 bg-black text-white text-xl rounded-lg w-[150px] cursor-pointer transition-all hover:bg-gray-700">
              Book
            </button>
          </div>
        </div>

        {/* How We Hire Riders Section */}
        <section className="text-center bg-white text-black p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">How We Hire Riders</h2>
          <p className="text-lg mb-4">
            We ensure only the best riders are on board. Our hiring process includes:
          </p>
          <ul className="text-left mx-auto w-2/3">
            <li className="text-lg mb-2">1. Background check and verification.</li>
            <li className="text-lg mb-2">2. Experience in safe and efficient driving.</li>
            <li className="text-lg mb-2">3. Customer feedback and reviews.</li>
            <li className="text-lg mb-2">4. Regular vehicle maintenance and checks.</li>
          </ul>
          <p className="mt-4">
            Our goal is to provide you with the safest and most comfortable ride.
          </p>
        </section>
      </main>
    </div>
  );
};

export default RidePage;
