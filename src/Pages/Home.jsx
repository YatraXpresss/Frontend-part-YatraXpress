import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black px-6 mt-12 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mt-12">
        <h1 className="text-6xl font-extrabold text-black mb-6">
        YatraXpress: Your Ride to Riches, Minutes Away
        </h1>
        <p className="text-2xl text-gray-800 mt-6 leading-relaxed font-medium">
          Ride Online and Start Earning in Just Minutes. With YatraXpress, Opportunities are at Your Fingertips!
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {/* Start Your Journey Button */}
          <button className="px-10 py-6 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all transform hover:scale-105 flex items-center gap-2 group">
            Start Your Journey
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Learn More Button */}
          <button className="px-10 py-6 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-all transform hover:scale-105">
            Learn More
          </button>
        </div>
        <div className="slim">
          <p className="mt-3">Try 15 days for free.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
