import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get user from AuthContext
  const email = currentUser?.email; // Use email from authenticated user
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // References for GSAP animations
  const dashboardRef = useRef(null);
  const lightStreaksRef = useRef(null);
  const titleRef = useRef(null);
  
  // Animations with framer-motion
  const controls = useAnimation();
  const { ref: welcomeRef, inView: welcomeInView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  const { ref: optionsRef, inView: optionsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Card hover states for interactive effects
  const [hoveredCard, setHoveredCard] = useState(null);
  
  useEffect(() => {
    // Track mouse movement for interactive effects
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
    
    // GSAP animations for floating elements
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
    
    // Light streaks animation
    if (lightStreaksRef.current) {
      const streaks = lightStreaksRef.current.children;
      gsap.set(streaks, {
        opacity: 0,
        scale: 0,
        x: (i) => -200 + (i * 20),
        y: (i) => 100 + (i * 30)
      });
      
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      
      tl.to(streaks, {
        opacity: 0.7,
        scale: 1,
        x: "+=400",
        y: "-=200",
        stagger: 0.2,
        duration: 1.5,
        ease: "power2.out"
      }).to(streaks, {
        opacity: 0,
        x: "+=400",
        duration: 1,
        stagger: 0.1,
        ease: "power1.in"
      }, "-=0.5");
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  
  // Control animations based on element visibility
  useEffect(() => {
    if (welcomeInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, welcomeInView]);

  const handleSeekReview = () => {
    navigate('/categories', { state: { email } });
  };

  const handleProvideReview = () => {
    navigate('/provide-review', { state: { email } });
  };

  const handleCheckTasks = async () => {
    if (!email) {
      setErrorMessage('You must be logged in to view tasks');
      setShowModal(true);
      return;
    }

    try {
      setIsTasksLoading(true);
      console.log('Fetching tasks for email:', email);
      
      const response = await axios.get(
        `https://critiquebackend.onrender.com/categories/feedbacks/${email}`
      );
      
      console.log('API response:', response);
      const fetchedTasks = response.data || [];
      setTasks(fetchedTasks);
      
      if (fetchedTasks.length > 0) {
        console.log(`Found ${fetchedTasks.length} tasks, navigating to review page`);
        navigate('/review', { state: { email } }); // Navigate to reviews if tasks exist
      } else {
        console.log('No tasks found, showing modal');
        setErrorMessage('No tasks found. Try submitting a project to get started.');
        setShowModal(true); // Show modal if no tasks
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Extract the specific error message
      const errorMsg = error.response?.data?.message || 
                       error.message || 
                       'Failed to load tasks. Please try again.';
      
      setErrorMessage(errorMsg);
      setShowModal(true); // Show modal in case of an error
    } finally {
      setIsTasksLoading(false);
    }
  };

  // Variants for animations
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
  
  const cardHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-[#080312]">
          <div className="relative">
            {/* Animated loading spinner with glowing effect */}
            <div className="w-20 h-20 border-4 border-[#9c4dff]/30 border-t-[#9c4dff] rounded-full animate-spin"></div>
            <div className="absolute inset-0 rounded-full blur-xl bg-[#9c4dff]/30 scale-75 animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div 
        ref={dashboardRef}
        className="relative min-h-screen bg-[#080312] pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1a0b2e] via-[#130822] to-[#080312]"></div>
        
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-10"
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
        <div className="absolute left-1/4 top-1/3 w-[500px] h-[500px] rounded-full bg-[#9c4dff]/10 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute right-1/4 bottom-1/3 w-[400px] h-[400px] rounded-full bg-[#ff5089]/10 blur-[100px] animate-pulse-slow animation-delay-1000"></div>
        
        {/* Light streaks */}
        <div ref={lightStreaksRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-[2px] rounded-full"
              style={{
                background: i % 2 === 0 
                  ? 'linear-gradient(90deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.8) 50%, rgba(138,43,226,0) 100%)' 
                  : 'linear-gradient(90deg, rgba(255,80,137,0) 0%, rgba(255,80,137,0.8) 50%, rgba(255,80,137,0) 100%)',
                width: `${150 + i * 50}px`,
                boxShadow: `0 0 10px 1px ${i % 2 === 0 ? 'rgba(138,43,226,0.6)' : 'rgba(255,80,137,0.6)'}`
              }}
            />
          ))}
        </div>
        
        {/* Content container with z-index to ensure it's above background elements */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div 
            ref={welcomeRef}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="mb-16"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden transition-all duration-500 hover:shadow-[#9c4dff]/30 hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <div className="p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative gradient lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9c4dff] to-[#ff5089]"></div>
                
                {/* Content with animated elements */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-6 md:mb-0">
                    <motion.h1 
                      ref={titleRef}
                      className="text-3xl font-extrabold sm:text-4xl animate-fade-in-up"
                    >
                      <motion.span 
                        className="bg-clip-text text-transparent bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"
                        animate={{ 
                          backgroundPosition: ['0% center', '100% center'],
                        }}
                        transition={{ 
                          duration: 8, 
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }}
                        style={{ backgroundSize: '200%' }}
                      >
                        Welcome to CritiqueConnect!
                      </motion.span>
                    </motion.h1>
                    {email && (
                      <motion.p 
                        variants={itemVariants}
                        className="mt-3 text-lg text-gray-300 animate-fade-in-up animation-delay-200"
                      >
                        Signed in as: <span className="font-semibold text-[#c840eb]">{email}</span>
                      </motion.p>
                    )}
                    <motion.p 
                      variants={itemVariants}
                      className="mt-2 text-gray-300 animate-fade-in-up animation-delay-300"
                    >
                      Connect with others, share ideas, and grow through valuable feedback.
                    </motion.p>
                  </div>
                  <motion.div 
                    variants={itemVariants}
                    className="flex space-x-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      onClick={handleCheckTasks}
                      disabled={isTasksLoading}
                      className="px-6 py-3 bg-[#120822]/80 text-gray-200 font-medium rounded-lg border border-[#9c4dff]/40 shadow-sm hover:shadow-[#9c4dff]/20 hover:shadow-lg hover:border-[#9c4dff]/60 transition-all duration-300 flex items-center space-x-2 relative"
                    >
                      {isTasksLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-[#9c4dff] rounded-full mr-2"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>My Tasks</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Options Section */}
          <motion.div
            ref={optionsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={optionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={optionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-100 mb-8 animate-fade-in-up animation-delay-400"
            >
              What would you like to do today?
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up animation-delay-500">
              {/* Seek Review Card */}
              <motion.div
                className="bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 overflow-hidden cursor-pointer group"
                onClick={handleSeekReview}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                onHoverStart={() => setHoveredCard('seek')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                {/* Animated gradient border */}
                <div className="relative h-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#9c4dff]"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: hoveredCard === 'seek' ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#9c4dff]/20 p-4 rounded-full mr-5 group-hover:bg-[#9c4dff]/30 transition-all duration-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-100 group-hover:text-[#c840eb] transition-colors duration-300">
                      Seek a Review
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Get valuable feedback on your project, solution, or idea from professionals and peers.
                  </p>
                  
                  <div className="flex justify-end">
                    <motion.div
                      className="text-[#9c4dff] font-medium flex items-center transition-transform transform"
                      animate={{ x: hoveredCard === 'seek' ? 5 : 0 }}
                    >
                      Get started
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Interactive background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#9c4dff]/5 to-transparent rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === 'seek' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Provide Review Card */}
              <motion.div
                className="bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 overflow-hidden cursor-pointer group"
                onClick={handleProvideReview}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                onHoverStart={() => setHoveredCard('provide')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                {/* Animated gradient border */}
                <div className="relative h-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-[#6366f1]"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#6366f1] via-[#c840eb] to-[#ff5089]"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: hoveredCard === 'provide' ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#6366f1]/20 p-4 rounded-full mr-5 group-hover:bg-[#6366f1]/30 transition-all duration-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-100 group-hover:text-[#6366f1] transition-colors duration-300">
                      Provide a Review
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Help others by providing thoughtful, constructive feedback on their work.
                  </p>
                  
                  <div className="flex justify-end">
                    <motion.div
                      className="text-[#6366f1] font-medium flex items-center transition-transform transform"
                      animate={{ x: hoveredCard === 'provide' ? 5 : 0 }}
                    >
                      Start reviewing
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Interactive background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 to-transparent rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === 'provide' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Categories Card */}
              <motion.div
                className="bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 overflow-hidden cursor-pointer group"
                onClick={() => navigate("/categories", { state: { email } })}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                onHoverStart={() => setHoveredCard('categories')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                {/* Animated gradient border */}
                <div className="relative h-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff5089] to-[#c840eb]"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#ff5089] via-[#c840eb] to-[#9c4dff]"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: hoveredCard === 'categories' ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#ff5089]/20 p-4 rounded-full mr-5 group-hover:bg-[#ff5089]/30 transition-all duration-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff5089]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-100 group-hover:text-[#ff5089] transition-colors duration-300">
                      Explore Categories
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Browse different categories of projects and find ones that match your interests.
                  </p>
                  
                  <div className="flex justify-end">
                    <motion.div
                      className="text-[#ff5089] font-medium flex items-center transition-transform transform"
                      animate={{ x: hoveredCard === 'categories' ? 5 : 0 }}
                    >
                      View categories
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Interactive background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#ff5089]/5 to-transparent rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === 'categories' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal with updated styling */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-[#120822]/90 backdrop-blur-lg rounded-xl border border-[#9c4dff]/30 shadow-2xl shadow-[#9c4dff]/20 p-8 max-w-md w-full mx-4 transform"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-[#9c4dff]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#9c4dff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-100 text-center mb-2">Tasks Information</h2>
            <p className="text-gray-300 text-center mb-6">{errorMessage || "You currently don't have any tasks to review. Submit a project to get started."}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <motion.button
                className="px-4 py-2 bg-gray-700/50 text-gray-200 rounded-lg hover:bg-gray-600/50 transition-colors"
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-[#9c4dff] to-[#ff5089] text-white rounded-lg shadow-md shadow-[#9c4dff]/20 hover:shadow-lg hover:shadow-[#9c4dff]/30 transition-all"
                onClick={() => {
                  setShowModal(false);
                  handleSeekReview();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add a Task
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add some global animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
        }
      `}</style>
    </>
  );
}

export default Dashboard;
