import React from "react";

const About = () => {
  return (
    <div className="mt-12 p-6 md:p-10 bg-white shadow-none max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-black mb-4">Welcome to YatraXpress 🚗</h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        YatraXpress is your go-to ride-sharing service in Kalikot, Nepal! 🏔️ Whether you're commuting, exploring, or heading on an adventure, we've got you covered.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed mt-4">
        Ride with experienced locals, enjoy safe and reliable transportation, and experience travel like never before. Simple, seamless, and stress-free! 🚐✨
      </p>
      <button className="mt-6 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition">
        Ride with Us
      </button>
      <p className="mt-6 text-gray-500 text-sm">Founder: Abhaya Bikram Shahi</p>
    </div>
  );
};

export default About;
