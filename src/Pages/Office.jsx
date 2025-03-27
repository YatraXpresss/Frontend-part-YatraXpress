import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaBuilding, FaClock, FaSearch } from 'react-icons/fa';

const OFFICES = [
  {
    id: 'jhapa',
    name: 'Jhapa District Office',
    district: 'Jhapa',
    region: 'Eastern Terai Region',
    head: {
      name: 'Mr. Rajesh Kumar',
      position: 'District Manager',
      phone: '+977-23-520000',
      email: 'rajesh.kumar@adlut.com'
    },
    address: 'Damak Road, Birtamod, Jhapa',
    phone: '+977-23-520000',
    email: 'jhapa@adlut.com',
    workingHours: '8:00 AM - 6:00 PM',
    services: [
      'Rider Registration',
      'Customer Support',
      'Payment Processing',
      'Document Verification'
    ]
  },
  {
    id: 'kalikot',
    name: 'Kalikot District Office',
    district: 'Kalikot',
    region: 'Karnali Province',
    head: {
      name: 'Mr. Bishnu Thapa',
      position: 'District Manager',
      phone: '+977-87-420000',
      email: 'bishnu.thapa@adlut.com'
    },
    address: 'Manma Road, Kalikot',
    phone: '+977-87-420000',
    email: 'kalikot@adlut.com',
    workingHours: '8:00 AM - 6:00 PM',
    services: [
      'Rider Registration',
      'Customer Support',
      'Payment Processing',
      'Document Verification'
    ]
  },
  {
    id: 'kailali',
    name: 'Kailali District Office',
    district: 'Kailali',
    region: 'Sudurpashchim Province',
    head: {
      name: 'Ms. Sita Sharma',
      position: 'District Manager',
      phone: '+977-91-420000',
      email: 'sita.sharma@adlut.com'
    },
    address: 'Dhangadhi Road, Kailali',
    phone: '+977-91-420000',
    email: 'kailali@adlut.com',
    workingHours: '8:00 AM - 6:00 PM',
    services: [
      'Rider Registration',
      'Customer Support',
      'Payment Processing',
      'Document Verification'
    ]
  }
];

const Office = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredOffices, setFilteredOffices] = useState(OFFICES);

  useEffect(() => {
    const searchOffices = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = OFFICES.filter(office => 
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setFilteredOffices(filtered);
      setIsLoading(false);
    };

    searchOffices();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our District Offices</h1>
          <p className="text-xl text-gray-600">Find the nearest office for your district</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by office name, district, region, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-300 transition-colors"
            />
          </div>
        </div>

        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading State
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-red-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-red-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600">Searching offices...</p>
              </div>
            </div>
          ) : filteredOffices.length === 0 ? (
            // No Results State
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Offices Found</h3>
                <p className="text-gray-600">Try adjusting your search terms to find what you're looking for.</p>
              </div>
            </div>
          ) : (
            // Results Grid
            filteredOffices.map(office => (
              <div
                key={office.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Office Header */}
                <div className="bg-red-600 text-white p-6">
                  <div className="flex items-center mb-4">
                    <FaBuilding className="text-2xl mr-3" />
                    <h2 className="text-xl font-bold">{office.name}</h2>
                  </div>
                  <p className="text-red-100">{office.region}</p>
                </div>

                {/* Office Head */}
                <div className="p-6 border-b">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <FaUser className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{office.head.name}</h3>
                      <p className="text-sm text-gray-600">{office.head.position}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600">
                      <FaPhone className="mr-2 text-red-500" />
                      {office.head.phone}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-2 text-red-500" />
                      {office.head.email}
                    </p>
                  </div>
                </div>

                {/* Office Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-red-500 mt-1 mr-2" />
                      <p className="text-gray-600">{office.address}</p>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-red-500 mr-2" />
                      <p className="text-gray-600">{office.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-red-500 mr-2" />
                      <p className="text-gray-600">{office.email}</p>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-red-500 mr-2" />
                      <p className="text-gray-600">{office.workingHours}</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Services Offered</h4>
                    <ul className="space-y-2">
                      {office.services.map((service, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Office; 