import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dummy from '../images/nepal-hero-image.jpg';
import { FaMotorcycle, FaMapMarkerAlt, FaEnvelope, FaUserPlus, FaEdit, FaSignOutAlt } from 'react-icons/fa';

function UserProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    location: user?.location || 'Kalikot, Nepal',
    address: user?.address || 'Bijyapur, Raskot'
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Please login to view your profile</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-3xl p-6 mt-10 border border-gray-200">
      <div className="flex flex-col items-center">
        <img className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover shadow-md" src={user.avatar || Dummy} alt="Profile" />
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="mt-4 w-full max-w-sm">
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              placeholder="Name"
            />
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              placeholder="Location"
            />
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              placeholder="Address"
            />
            <div className="flex justify-center space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">{user.name}</h2>
            <span className="text-gray-500 text-sm mt-1">@{user.name.toLowerCase().replace(/\s+/g, '')}</span>
          </>
        )}
        
        <div className="flex space-x-8 mt-4">
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-800">0</p>
            <span className="text-gray-500 text-sm">Followers</span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg text-gray-800">0</p>
            <span className="text-gray-500 text-sm">Following</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-4 text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</div>
      
      <div className="mt-4 text-center text-gray-600 flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-red-500" />
          <p>{profileData.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-red-500" />
          <p>{profileData.address}</p>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600 flex items-center justify-center space-x-2">
        <FaMotorcycle className="text-blue-500 text-xl" />
        <span>Completed Rides: {user.completedRides || 0}+</span>
      </div>
      
      <div className="flex justify-center mt-6 space-x-4">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-40 h-12 border border-gray-400 rounded-full text-black font-semibold flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition-all shadow-md"
          >
            <FaEdit /> <span>Edit Profile</span>
          </button>
        )}
        <button className="w-40 h-12 border border-gray-400 rounded-full text-black font-semibold flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition-all shadow-md">
          <FaEnvelope /> <span>Message</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-40 h-12 border border-red-400 rounded-full text-red-500 font-semibold flex items-center justify-center space-x-2 hover:bg-red-500 hover:text-white transition-all shadow-md"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
