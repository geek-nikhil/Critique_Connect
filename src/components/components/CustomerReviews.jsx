import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredDot, setHoveredDot] = useState(null);
  
  // Refs for animations
  const sectionRef = useRef(null);
  const streaksRef = useRef(null);
  const carouselRef = useRef(null);
  
  // For scroll animations
  const { ref: titleRef, inView: titleInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: reviewsRef, inView: reviewsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      position: 'Software Developer',
      rating: 5,
      review: 'The feedback I received was incredibly detailed and helped me improve my project significantly. The reviewer was knowledgeable and provided actionable suggestions.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      position: 'Startup Founder',
      rating: 4,
      review: 'Great platform for getting honest reviews! The critique I received was constructive and helped me see blind spots in my business proposal.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      position: 'UX Designer',
      rating: 5,
      review: 'I was impressed by how quickly I received detailed feedback. The reviewer understood exactly what I was trying to achieve and provided valuable insights.'
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 20 
      }
    }
  };
  
  // Handle mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // GSAP animations for light streaks
    if (streaksRef.current) {
      const streaks = streaksRef.current.children;
      gsap.set(streaks, {
        opacity: 0,
        x: (i) => -100 + (i * 30),
        y: (i) => 50 + (i * 20),
        scale: 0.5
      });
      
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      
      tl.to(streaks, {
        opacity: 0.6,
        x: "+=300",
        y: "-=150", 
        scale: 1.2,
        stagger: 0.3,
        duration: 2,
        ease: "power2.out"
      }).to(streaks, {
        opacity: 0,
        x: "+=200",
        duration: 1,
        stagger: 0.2,
        ease: "power1.in"
      }, "-=1");
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleNext = () => {
    gsap.to(carouselRef.current, {
      x: '-=50',
      opacity: 0.8,
      duration: 0.2,
      onComplete: () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        gsap.to(carouselRef.current, {
          x: '+=50',
          opacity: 1,
          duration: 0.3,
        });
      }
    });
  };

  const handlePrev = () => {
    gsap.to(carouselRef.current, {
      x: '+=50',
      opacity: 0.8,
      duration: 0.2,
      onComplete: () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
        gsap.to(carouselRef.current, {
          x: '-=50',
          opacity: 1,
          duration: 0.3,
        });
      }
    });
  };

  // Helper to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.svg 
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-[#ffb443]' : 'text-gray-600'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 * i, duration: 0.3 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      );
    }
    return stars;
  };

  return (
    <section 
      id="customer-reviews" 
      ref={sectionRef}
      className="relative py-24 bg-[#080312] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a0b2e] via-[#130822] to-[#080312] z-0"></div>
      
      {/* Dynamic grid lines */}
      <div 
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(138, 43, 226, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(138, 43, 226, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#9c4dff]/10 blur-[150px] animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#ff5089]/10 blur-[150px] animate-pulse-slow animation-delay-1000 z-0"></div>
      
      {/* Light streaks */}
      <div ref={streaksRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-[2px] rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'linear-gradient(90deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.8) 50%, rgba(138,43,226,0) 100%)' 
                : 'linear-gradient(90deg, rgba(255,80,137,0) 0%, rgba(255,80,137,0.8) 50%, rgba(255,80,137,0) 100%)',
              width: `${150 + i * 40}px`,
              boxShadow: `0 0 10px 1px ${i % 2 === 0 ? 'rgba(138,43,226,0.6)' : 'rgba(255,80,137,0.6)'}`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={titleRef}
          variants={containerVariants}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-extrabold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"
                  style={{ backgroundSize: '200%' }}
                  animate={{
                    backgroundPosition: ['0% center', '100% center'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
            >
              What Our Users Say
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-gray-300"
          >
            Trusted by professionals and students across various domains.
          </motion.p>
        </motion.div>

        {/* Reviews Carousel */}
        <motion.div 
          ref={reviewsRef}
          variants={containerVariants}
          initial="hidden"
          animate={reviewsInView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="overflow-hidden">
            <motion.div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              variants={itemVariants}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <motion.div 
                    className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 p-8 mx-auto max-w-3xl"
                    whileHover={{ boxShadow: '0 25px 50px -12px rgba(156, 77, 255, 0.25)' }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 mb-6 relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] p-1">
                          <img 
                            className="w-full h-full rounded-full object-cover"
                            src={review.avatar} 
                            alt={review.name} 
                          />
                        </div>
                        {/* Animated ring around avatar */}
                        <div className="absolute -inset-2 rounded-full border-2 border-[#9c4dff]/20 animate-spin-slow"></div>
                      </div>
                      
                      <div className="flex mb-4">
                        {renderStars(review.rating)}
                      </div>
                      
                      <motion.p 
                        className="text-gray-300 mb-8 italic text-lg leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        "{review.review}"
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] to-[#c840eb] text-xl mb-1">{review.name}</h3>
                        <p className="text-[#ff5089]">{review.position}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <motion.button 
            onClick={handlePrev}
            className="absolute top-1/2 left-2 md:left-8 transform -translate-y-1/2 bg-[#120822]/70 backdrop-blur-md p-3 rounded-full shadow-lg border border-[#9c4dff]/30 hover:bg-[#1a0b2e] focus:outline-none z-10 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-gray-200 group-hover:text-[#9c4dff] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-[#9c4dff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </motion.button>
          
          <motion.button 
            onClick={handleNext}
            className="absolute top-1/2 right-2 md:right-8 transform -translate-y-1/2 bg-[#120822]/70 backdrop-blur-md p-3 rounded-full shadow-lg border border-[#9c4dff]/30 hover:bg-[#1a0b2e] focus:outline-none z-10 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-gray-200 group-hover:text-[#9c4dff] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-[#9c4dff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </motion.button>
          
          {/* Indicator Dots */}
          <div className="flex justify-center mt-10 space-x-3">
            {reviews.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="relative"
                onHoverStart={() => setHoveredDot(index)}
                onHoverEnd={() => setHoveredDot(null)}
                whileHover={{ scale: 1.2 }}
              >
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-gradient-to-r from-[#9c4dff] to-[#ff5089]' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
                {(index === currentIndex || hoveredDot === index) && (
                  <motion.div
                    layoutId="dot-outline"
                    className="absolute -inset-1.5 rounded-full border-2 border-[#9c4dff]/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* See More Link */}
        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
          initial="hidden"
          animate={reviewsInView ? "visible" : "hidden"}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/reviews" 
            className="relative inline-flex items-center text-[#c840eb] font-medium hover:text-[#9c4dff] transition-colors overflow-hidden group px-4 py-2"
          >
            <span className="relative z-10 flex items-center">
              See more reviews
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#9c4dff] to-[#ff5089] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </motion.div>
      </div>
      
      {/* Add animations styling */}
      <style jsx>{`
        @keyframes pulse-slow {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default CustomerReviews; 