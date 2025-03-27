import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Riders from './pages/riders';
import RiderProfile from './pages/RiderProfile';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import Downloads from './Pages/Downloads';
import PrivateRoute from './components/PrivateRoute';
import About from './pages/About';
import BookRide from './pages/BookRide';
import Office from './pages/Office';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { SocketProvider } from './context/SocketContext';

// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// serviceWorkerRegistration.register();

import './App.css'

const App = () => {
  return (
    <SocketProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/riders" element={<Riders />} />
                  <Route path="/book-ride" element={<BookRide />} />
                  <Route path="/my-rides" element={<PrivateRoute><MyRides /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/riders/:id" element={<RiderProfile />} />
                  <Route path="/office" element={<Office />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </SocketProvider>
  );
};

export default App;
