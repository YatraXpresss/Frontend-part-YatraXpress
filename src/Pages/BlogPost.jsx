import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaClock, FaCalendar } from 'react-icons/fa';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'How to Maximize Your Earnings as a YatraXpress Driver',
    excerpt: 'Learn proven strategies to increase your income while providing excellent service to passengers.',
    content: `
      <h2>Introduction</h2>
      <p>As a YatraXpress driver, your earning potential is directly tied to your dedication and strategic approach. Here are proven strategies to maximize your income:</p>
      
      <h3>1. Optimize Your Working Hours</h3>
      <p>Focus on peak hours when demand is highest. Early mornings, late evenings, and weekends often offer the best earning opportunities. Plan your schedule around these times to maximize your income.</p>
      
      <h3>2. Maintain High Ratings</h3>
      <p>Excellent ratings lead to more ride requests and better earnings. Always provide a clean, comfortable ride and excellent customer service. Remember that happy passengers are more likely to give you high ratings and become repeat customers.</p>
      
      <h3>3. Strategic Location Management</h3>
      <p>Position yourself in high-demand areas and learn the patterns of your district to minimize downtime between rides. Study the local events calendar and plan your locations accordingly.</p>
      
      <h3>4. Vehicle Maintenance</h3>
      <p>Regular maintenance ensures your vehicle stays in top condition, preventing unexpected downtime and repair costs. A well-maintained vehicle also provides a better experience for passengers.</p>
      
      <h3>5. Customer Service Excellence</h3>
      <p>Go above and beyond for your passengers. Help with luggage, maintain conversation, and ensure a comfortable ride experience. Small gestures can lead to better ratings and more tips.</p>
      
      <h3>6. Smart Route Planning</h3>
      <p>Use the YatraXpress app's features to optimize your routes and reduce fuel costs. Plan your trips to minimize empty return journeys.</p>
      
      <h3>7. Build Regular Customers</h3>
      <p>Develop relationships with regular passengers. They can provide steady income and valuable referrals.</p>
      
      <h3>8. Stay Updated with Incentives</h3>
      <p>Keep track of current promotions and incentives. Participate in special events and peak hour bonuses to boost your earnings.</p>
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
      <p>Take time to create a professional profile with a clear photo and accurate information. This helps build trust with passengers and increases your chances of getting ride requests.</p>
      
      <h3>2. Understand the App</h3>
      <p>Familiarize yourself with all features of the YatraXpress driver app to maximize efficiency and earnings. Learn about navigation, payment processing, and customer communication features.</p>
      
      <h3>3. Start in Familiar Areas</h3>
      <p>Begin driving in areas you know well to build confidence and provide better service to passengers. As you gain experience, gradually expand your service area.</p>
      
      <h3>4. Track Your Expenses</h3>
      <p>Keep detailed records of your fuel, maintenance, and other expenses to better manage your earnings. Use the YatraXpress driver dashboard to monitor your performance.</p>
      
      <h3>5. Build Your Network</h3>
      <p>Connect with other drivers to learn from their experiences and share knowledge. Join driver communities and participate in training sessions.</p>
      
      <h3>6. Safety First</h3>
      <p>Always prioritize safety for yourself and your passengers. Follow traffic rules and maintain your vehicle in good condition.</p>
      
      <h3>7. Customer Service Basics</h3>
      <p>Learn the fundamentals of good customer service. Be polite, professional, and helpful to all passengers.</p>
      
      <h3>8. Financial Planning</h3>
      <p>Set realistic income goals and create a budget. Plan for both regular expenses and unexpected costs.</p>
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
      <p>Earn extra during high-demand periods. Plan your schedule around these peak hours to maximize your earnings. Peak hours typically include early mornings, late evenings, and weekends.</p>
      
      <h3>2. Weekly Incentives</h3>
      <p>Complete a certain number of rides to earn weekly bonuses and rewards. Track your progress in the driver dashboard and plan your schedule to meet these targets.</p>
      
      <h3>3. Special Event Bonuses</h3>
      <p>Take advantage of increased earnings during festivals, holidays, and special events. Stay updated with the YatraXpress calendar to know about upcoming events.</p>
      
      <h3>4. Referral Program</h3>
      <p>Earn rewards by referring new drivers to the platform. Share your success story and help others join the YatraXpress community.</p>
      
      <h3>5. Quality Bonuses</h3>
      <p>Maintain high ratings to qualify for additional earnings and benefits. Focus on providing excellent service to every passenger.</p>
      
      <h3>6. Long-Distance Trip Bonuses</h3>
      <p>Earn extra for completing long-distance trips. These trips often offer better earning potential per kilometer.</p>
      
      <h3>7. Weekend Warrior Program</h3>
      <p>Special incentives for drivers who maintain high activity levels during weekends.</p>
      
      <h3>8. Loyalty Rewards</h3>
      <p>Earn additional benefits based on your tenure and consistent performance with YatraXpress.</p>
    `,
    author: 'Bishnu Thapa',
    date: '2024-03-13',
    readTime: '6 min read',
    category: 'Incentives',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <Link to="/blog" className="text-red-600 hover:text-red-700">
              Return to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <FaUser className="mr-1" />
                {post.author}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <FaCalendar className="mr-1" />
                {post.date}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <FaClock className="mr-1" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Category Tag */}
            <div className="mt-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {post.category}
              </span>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 