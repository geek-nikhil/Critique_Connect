import React, { useState } from 'react';
import Navbar from './Navbar';

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Example review data
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2 weeks ago',
      rating: 5,
      category: 'technology',
      review: 'The feedback I received was incredibly detailed and helped me improve my project significantly. The reviewer was knowledgeable and provided actionable suggestions.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '1 month ago',
      rating: 4,
      category: 'business',
      review: 'Great platform for getting honest reviews! The critique I received was constructive and helped me see blind spots in my business proposal.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      date: '3 days ago',
      rating: 5,
      category: 'technology',
      review: 'I was impressed by how quickly I received detailed feedback. The reviewer understood exactly what I was trying to achieve and provided valuable insights.'
    },
    {
      id: 4,
      name: 'Thomas Wright',
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
      date: '2 months ago',
      rating: 4,
      category: 'social',
      review: 'CritiqueConnect helped me refine my social media campaign strategy. The feedback was thoughtful and the reviewer had extensive knowledge in digital marketing.'
    },
    {
      id: 5,
      name: 'Aisha Patel',
      avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      date: '1 week ago',
      rating: 5,
      category: 'business',
      review: 'The professional who reviewed my startup pitch deck transformed it completely. Their expertise was evident and the suggestions were practical.'
    }
  ];

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(review => review.category === activeTab);

  // Helper to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Customer Reviews
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-xl text-gray-600">
              See what our users are saying about their experience with CritiqueConnect.
            </p>
          </div>

          {/* Rating Overview */}
          <div className="bg-white rounded-2xl shadow-xl mb-12 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">4.8</h2>
                  <div className="flex space-x-1 mb-2">
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-600">Based on 48 reviews</p>
                </div>
                
                <div className="w-full md:w-2/3">
                  {/* Rating Bars */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((num) => (
                      <div key={num} className="flex items-center">
                        <div className="flex items-center w-28">
                          <span className="text-sm font-medium text-gray-600 mr-2">{num} stars</span>
                          <div className="flex space-x-1">
                            {renderStars(num)}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${num === 5 ? 70 : num === 4 ? 20 : num === 3 ? 7 : num === 2 ? 2 : 1}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-10 text-right">
                          {num === 5 ? 70 : num === 4 ? 20 : num === 3 ? 7 : num === 2 ? 2 : 1}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'all' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                All Reviews
              </button>
              <button 
                onClick={() => setActiveTab('technology')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'technology' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Technology
              </button>
              <button 
                onClick={() => setActiveTab('business')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'business' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Business
              </button>
              <button 
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'social' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Social
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full capitalize">
                      {review.category}
                    </span>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to experience it yourself?</h3>
            <button 
              onClick={() => window.location.href='/signup'} 
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow hover:shadow-lg transform transition hover:-translate-y-0.5"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage; 