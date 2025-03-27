import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaClock, FaUser, FaMoneyBillWave, FaCar, FaStar, FaChartLine } from 'react-icons/fa';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How to Maximize Your Earnings as a YatraXpress Driver',
    excerpt: 'Learn proven strategies to increase your income while providing excellent service to passengers.',
    content: `
      <h2>Introduction</h2>
      <p>As a YatraXpress driver, your earning potential is directly tied to your dedication and strategic approach. Here are proven strategies to maximize your income:</p>
      
      <h3>1. Optimize Your Working Hours</h3>
      <p>Focus on peak hours when demand is highest. Early mornings, late evenings, and weekends often offer the best earning opportunities.</p>
      
      <h3>2. Maintain High Ratings</h3>
      <p>Excellent ratings lead to more ride requests and better earnings. Always provide a clean, comfortable ride and excellent customer service.</p>
      
      <h3>3. Strategic Location Management</h3>
      <p>Position yourself in high-demand areas and learn the patterns of your district to minimize downtime between rides.</p>
      
      <h3>4. Vehicle Maintenance</h3>
      <p>Regular maintenance ensures your vehicle stays in top condition, preventing unexpected downtime and repair costs.</p>
      
      <h3>5. Customer Service Excellence</h3>
      <p>Go above and beyond for your passengers. Help with luggage, maintain conversation, and ensure a comfortable ride experience.</p>
    `,
    author: 'Rajesh Kumar',
    date: '2024-03-15',
    readTime: '5 min read',
    category: 'Earnings',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Top Tips for New YatraXpress Drivers',
    excerpt: 'Essential tips and tricks for new drivers to start their journey successfully.',
    content: `
      <h2>Getting Started with YatraXpress</h2>
      <p>Starting your journey as a YatraXpress driver can be both exciting and challenging. Here's what you need to know:</p>
      
      <h3>1. Complete Your Profile</h3>
      <p>Take time to create a professional profile with a clear photo and accurate information. This helps build trust with passengers.</p>
      
      <h3>2. Understand the App</h3>
      <p>Familiarize yourself with all features of the YatraXpress driver app to maximize efficiency and earnings.</p>
      
      <h3>3. Start in Familiar Areas</h3>
      <p>Begin driving in areas you know well to build confidence and provide better service to passengers.</p>
      
      <h3>4. Track Your Expenses</h3>
      <p>Keep detailed records of your fuel, maintenance, and other expenses to better manage your earnings.</p>
      
      <h3>5. Build Your Network</h3>
      <p>Connect with other drivers to learn from their experiences and share knowledge.</p>
    `,
    author: 'Sita Sharma',
    date: '2024-03-14',
    readTime: '4 min read',
    category: 'Getting Started',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Understanding YatraXpress Incentives and Bonuses',
    excerpt: 'A comprehensive guide to all earning opportunities and bonus programs available to drivers.',
    content: `
      <h2>Maximizing Your Earnings Through Incentives</h2>
      <p>YatraXpress offers various ways to boost your income beyond regular fares:</p>
      
      <h3>1. Peak Hour Bonuses</h3>
      <p>Earn extra during high-demand periods. Plan your schedule around these peak hours.</p>
      
      <h3>2. Weekly Incentives</h3>
      <p>Complete a certain number of rides to earn weekly bonuses and rewards.</p>
      
      <h3>3. Special Event Bonuses</h3>
      <p>Take advantage of increased earnings during festivals, holidays, and special events.</p>
      
      <h3>4. Referral Program</h3>
      <p>Earn rewards by referring new drivers to the platform.</p>
      
      <h3>5. Quality Bonuses</h3>
      <p>Maintain high ratings to qualify for additional earnings and benefits.</p>
    `,
    author: 'Bishnu Thapa',
    date: '2024-03-13',
    readTime: '6 min read',
    category: 'Incentives',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['all', ...new Set(BLOG_POSTS.map(post => post.category))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">YatraXpress Blog</h1>
          <p className="text-xl text-gray-600">Tips, guides, and insights for drivers</p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-300 transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading State
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-red-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-red-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="mt-4 text-gray-600">Loading articles...</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            // No Results State
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
              </div>
            </div>
          ) : (
            // Blog Posts
            filteredPosts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <FaUser className="mr-1" />
                      {post.author}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      {post.category}
                    </span>
                    <span className="text-red-600 hover:text-red-700 font-medium">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 