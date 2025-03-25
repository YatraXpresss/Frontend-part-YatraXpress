import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "./Pages/Home";
import Rides from "./Pages/Rides";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Riders from "./Pages/Riders";
import RiderProfile from "./Pages/RiderProfile";

import './App.css'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/riders" element={<Riders />} />
        <Route path="/rider/:id" element={<RiderProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
