import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

function ProvideReview() {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [selectedTask, setSelectedTask] = useState(null); // Track the selected task
  const [feedback, setFeedback] = useState(''); // State to store feedback
  const location = useLocation();
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const email = currentUser?.email; // Use email from authenticated user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for animations
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const streaksRef = useRef(null);
  
  // For scroll animations
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  const { ref: contentRef, inView: contentInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    },
    hover: { 
      y: -10,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      }
    }
  };
  
  // Handle mouse movement for interactive background
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

  useEffect(() => {
    const fetchCategories = async () => {
      if (!email) {
        setLoading(false);
        setError('User not logged in. Please log in to view tasks.');
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // Skip the user role check and directly try to fetch categories
        console.log('Fetching categories for provider with email:', email);
        const response = await axios.get(`https://critiquebackend.onrender.com/categories/provider/${email}`);
        console.log('Fetched categories response:', response);
  
        // Check if response data is what we expect
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Invalid response format:', response.data);
          setError('Received invalid data format from server');
          setTasks([]);
          return;
        }
  
        // Map tasks with the category
        const taskList = response.data.flatMap((categoryItem) => {
          if (!categoryItem.tasks || !Array.isArray(categoryItem.tasks)) {
            console.warn('Category missing tasks array:', categoryItem);
            return [];
          }
          
          return categoryItem.tasks.map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            category: categoryItem.category, // Extract category from response data
          }));
        });
  
        setTasks(taskList); // Update state with tasks
        console.log('Mapped tasks:', taskList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        
        // More detailed error logging
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.error('Response error data:', error.response.data);
          console.error('Response error status:', error.response.status);
          
          if (error.response.status === 404) {
            setError(`User not found or not registered as a provider. Please ensure you've completed signup properly.`);
          } else {
            setError(`Server error: ${error.response.status}. Please try again later.`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          setError('No response from server. Please check your connection and try again.');
        } else {
          // Something happened in setting up the request
          console.error('Error message:', error.message);
          setError('Error setting up request. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories(); // Fetch data when component mounts or email changes
  }, [email]);
  

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleBack = () => {
    // Animate out
    gsap.to("#feedback-form", {
      y: 20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
    setSelectedTask(null);
    setFeedback(''); // Clear feedback when returning to the task list
      }
    });
  };

  const fetchCategoriesData = async () => {
    setLoading(true);
    setError('');
    
    if (!email) {
      setLoading(false);
      setError('User not logged in. Please log in to view tasks.');
      return;
    }
    
    try {
      // Skip the user role check and directly try to fetch categories
      console.log('Refreshing categories for provider with email:', email);
      const response = await axios.get(`https://critiquebackend.onrender.com/categories/provider/${email}`);
      console.log('Refreshed categories response:', response);
      
      // Check if response data is what we expect
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        setError('Received invalid data format from server');
        setTasks([]);
        return;
      }
      
      // Map tasks with the category
      const taskList = response.data.flatMap((categoryItem) => {
        if (!categoryItem.tasks || !Array.isArray(categoryItem.tasks)) {
          console.warn('Category missing tasks array:', categoryItem);
          return [];
        }
        
        return categoryItem.tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          category: categoryItem.category,
        }));
      });
      
      setTasks(taskList);
      console.log('Refreshed task list:', taskList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // More detailed error logging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
        
        if (error.response.status === 404) {
          setError(`User not found or not registered as a provider. Please ensure you've completed signup properly.`);
        } else {
          setError(`Server error: ${error.response.status}. Please try again later.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        setError('Error setting up request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('https://critiquebackend.onrender.com/categories/task/feedback', {
        category: selectedTask.category, // Use category from the selected task
        email: email,
        title: selectedTask.title,
        feedback,
      });
      console.log('Feedback submitted successfully:', response.data);
    
      // Success animation
      gsap.to("#feedback-form", {
        y: -20,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setSelectedTask(null);
          setFeedback('');
          fetchCategoriesData(); // Refresh the task list after submitting feedback
        }
      });
    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data || error.message);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      <Navbar />
      <div 
        ref={pageRef}
        className="relative min-h-screen bg-[#080312] pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1a0b2e] via-[#130822] to-[#080312] z-0"></div>
        
        {/* Dynamic grid lines */}
        <div 
          ref={gridRef}
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
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#9c4dff]/10 blur-[150px] animate-pulse-slow z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff5089]/10 blur-[150px] animate-pulse-slow animation-delay-1000 z-0"></div>
        
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
        
        {/* Main content container */}
        <div className="relative max-w-4xl mx-auto z-10">
          <AnimatePresence mode="wait">
            {loading ? (
              // Loading state
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-32"
              >
                <div className="relative">
                  {/* Animated loading spinner with glowing effect */}
                  <div className="w-16 h-16 border-4 border-[#9c4dff]/30 border-t-[#9c4dff] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 rounded-full blur-xl bg-[#9c4dff]/30 scale-75 animate-pulse"></div>
                </div>
              </motion.div>
            ) : selectedTask ? (
            // Feedback form for the selected task
              <motion.div 
                key="feedback-form"
                id="feedback-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden p-8 relative"
              >
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"></div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] text-center mb-6"
                  style={{ backgroundSize: '200%' }}
                >
                  Provide Feedback for {selectedTask.title}
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-6 bg-[#1a0b2e]/50 backdrop-blur-sm rounded-xl border border-[#9c4dff]/20 shadow-inner"
                >
                  <p className="text-gray-300 mb-3">
                    <span className="font-medium text-[#c840eb]">Description:</span> {selectedTask.description}
                  </p>
            <div>
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#c840eb] bg-[#9c4dff]/10 rounded-full shadow-sm">
                      {selectedTask.category}
                    </span>
                  </div>
                </motion.div>
                
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                <textarea
                    className="w-full p-4 border border-[#9c4dff]/30 rounded-lg bg-[#120822]/70 text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#c840eb] focus:border-transparent transition-all duration-300 mb-6"
                  rows="5"
                  placeholder="Write your feedback here..."
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-[#ff5089]/10 border border-[#ff5089]/40 text-[#ff5089] rounded-lg backdrop-blur-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                <div className="flex justify-between">
                    <motion.button
                    type="button"
                    onClick={handleBack}
                      className="relative px-6 py-3 text-gray-300 border border-[#9c4dff]/30 rounded-lg overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                      </span>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#9c4dff]/10 transition-opacity duration-300"></span>
                    </motion.button>
                    
                    <motion.button
                    type="submit"
                      disabled={isSubmitting}
                      className="relative px-8 py-3 text-white font-medium rounded-lg overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={isSubmitting ? {} : { scale: 1.05 }}
                      whileTap={isSubmitting ? {} : { scale: 0.95 }}
                    >
                      {/* Button background with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-lg"></div>
                      
                      {/* Button hover effect */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#9c4dff]/20 via-[#c840eb]/20 to-[#ff5089]/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Animated ripple effect on hover */}
                      <span className="absolute inset-0 w-0 h-0 rounded-lg bg-white opacity-10 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out"></span>
                      
                      {/* Loading spinner for submission */}
                      {isSubmitting ? (
                        <span className="relative z-10 flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center">
                    Submit Feedback
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                </div>
                </motion.form>
              </motion.div>
          ) : (
            // Task list
              <motion.div
                key="task-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div 
                  ref={headerRef}
                  variants={itemVariants}
                  className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden transition-all duration-500 hover:shadow-[#9c4dff]/30 hover:shadow-2xl p-8 mb-10 relative"
                >
                  {/* Top gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"></div>
                  
                  <motion.h2 
                    variants={itemVariants} 
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] text-center mb-6"
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
                Available Tasks for Review
                  </motion.h2>
                  
                  {error && (
                    <motion.div 
                      variants={itemVariants}
                      className="mb-6 p-4 bg-[#ff5089]/10 border border-[#ff5089]/40 text-[#ff5089] rounded-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  ref={contentRef}
                  variants={containerVariants}
                  className="space-y-6"
                >
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        variants={cardVariants}
                        whileHover="hover"
                        custom={index}
                        onClick={() => handleTaskClick(task)}
                        onHoverStart={() => setHoveredTaskId(task.id)}
                        onHoverEnd={() => setHoveredTaskId(null)}
                        className="group bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 overflow-hidden cursor-pointer relative"
                      >
                        {/* Left accent bar with animated gradient on hover */}
                        <div className="absolute top-0 left-0 bottom-0 w-1">
                          <div className="absolute inset-0 bg-gradient-to-b from-[#9c4dff] to-[#c840eb]"></div>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-b from-[#ff5089] via-[#c840eb] to-[#9c4dff]"
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: hoveredTaskId === task.id ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                        
                        <div className="p-6 pl-8">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-gray-100 group-hover:text-[#c840eb] transition-colors duration-200">{task.title}</h3>
                            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#c840eb] bg-[#9c4dff]/10 rounded-full shadow-sm">
                              {task.category}
                            </span>
                          </div>
                          <p className="text-gray-400 mt-2 line-clamp-3">{task.description}</p>
                          
                          <div className="mt-4 flex justify-end">
                            <motion.div 
                              className="text-sm text-[#9c4dff] font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              animate={{ x: hoveredTaskId === task.id ? 5 : 0 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              Provide feedback
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          </div>
                          
                          {/* Interactive background gradient on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#9c4dff]/5 to-transparent rounded-xl -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredTaskId === task.id ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                    </div>
                      </motion.div>
                  ))
                ) : (
                    <motion.div 
                      variants={itemVariants}
                      className="bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 p-8 text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks available</h3>
                      <p className="text-gray-400">There are no tasks available for review at the moment.</p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <Footer />
      
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
      `}</style>
    </>
  );
}

export default ProvideReview;