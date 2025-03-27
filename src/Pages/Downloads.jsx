import { useState } from 'react';
import '../App.css';

const Downloads = () => {
  const [downloadCount, setDownloadCount] = useState({
    windows: 0,
    mac: 0,
    linux: 0
  });

  const desktopVersions = {
    windows: {
      version: '1.0.0',
      size: '45MB',
      url: '/downloads/adlut-setup-win-x64.exe'
    },
    mac: {
      version: '1.0.0',
      size: '42MB',
      url: '/downloads/adlut-setup-mac.dmg'
    },
    linux: {
      version: '1.0.0',
      size: '40MB',
      url: '/downloads/adlut-setup-linux.AppImage'
    }
  };

  const handleDownload = (platform) => {
    // Increment download count
    setDownloadCount(prev => ({
      ...prev,
      [platform]: prev[platform] + 1
    }));

    // Track download analytics
    try {
      fetch('/api/track-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          version: desktopVersions[platform].version,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }

    // Initiate download
    window.location.href = desktopVersions[platform].url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Download Adlut Desktop App</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Get the best experience with our desktop application. Available for Windows, Mac, and Linux.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {Object.entries(desktopVersions).map(([platform, info]) => (
          <div key={platform} className="bg-white rounded-lg shadow-lg p-8 transform transition-transform hover:-translate-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{platform.charAt(0).toUpperCase() + platform.slice(1)} Version</h2>
            <div className="space-y-2 mb-6">
              <p className="text-gray-600 text-center">Version: {info.version}</p>
              <p className="text-gray-600 text-center">Size: {info.size}</p>
            </div>
            <button
              onClick={() => handleDownload(platform)}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-md font-medium hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Download for {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">Why Download?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <li className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-700">Faster performance and better responsiveness</li>
          <li className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-700">Desktop notifications for new rides</li>
          <li className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-700">Offline access to your ride history</li>
          <li className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-700">Enhanced security features</li>
          <li className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-700">Automatic updates</li>
        </ul>
      </div>
    </div>
  );
};

export default Downloads;