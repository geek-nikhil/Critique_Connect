import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

const Review = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const email = currentUser?.email || location.state?.email; // Get email from auth context or location state
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  
  // Refs for GSAP animations
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
  
  const headerControls = useAnimation();
  const contentControls = useAnimation();

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

  // Handle mouse movement for interactive effects
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
  
  // Control animations based on visibility
  useEffect(() => {
    if (headerInView) {
      headerControls.start('visible');
    } else {
      headerControls.start('hidden');
    }
    
    if (contentInView) {
      contentControls.start('visible');
    } else {
      contentControls.start('hidden');
    }
  }, [headerControls, headerInView, contentControls, contentInView]);

  // Fetch tasks and their feedbacks for the current user
  useEffect(() => {
    const fetchTasksWithCategories = async () => {
      if (!email) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch categories and tasks
        const respCat = await axios.get(`https://critiquebackend.onrender.com/categories`);

        // Filter tasks relevant to the logged-in user
        const userTasks = [];
        respCat.data.forEach((category) => {
          category.tasks.forEach((task) => {
            if (task.seeker === email) {
              userTasks.push({
                ...task,
                categoryName: category.category, // Map the category name
              });
            }
          });
        });

        setTasks(userTasks); // Set tasks with mapped categories
        console.log(userTasks);
      } catch (error) {
        console.error('Error fetching categories and tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasksWithCategories();
  }, [email]);

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
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header Section */}
          <motion.div 
            ref={headerRef}
            variants={containerVariants}
            initial="hidden"
            animate={headerControls}
            className="mb-10"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden transition-all duration-500 hover:shadow-[#9c4dff]/30 hover:shadow-2xl p-8"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"></div>
              
              <motion.h1 
                variants={itemVariants} 
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] mb-2"
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
                My Tasks & Feedback
              </motion.h1>
              
              {email && (
                <motion.p variants={itemVariants} className="text-gray-300">
                  Viewing feedback for: <span className="font-medium text-[#c840eb]">{email}</span>
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* Tasks List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                {/* Animated loading spinner with glowing effect */}
                <div className="w-16 h-16 border-4 border-[#9c4dff]/30 border-t-[#9c4dff] rounded-full animate-spin"></div>
                <div className="absolute inset-0 rounded-full blur-xl bg-[#9c4dff]/30 scale-75 animate-pulse"></div>
              </div>
            </div>
          ) : tasks.length > 0 ? (
            <motion.div 
              ref={contentRef}
              variants={containerVariants}
              initial="hidden"
              animate={contentControls}
              className="grid grid-cols-1 gap-6"
            >
              {tasks.map((task, index) => (
                <motion.div
                  key={task._id || task.title}
                  className="group bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 overflow-hidden transition-all duration-300 hover:shadow-[#9c4dff]/30 hover:shadow-xl cursor-pointer relative"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                  onHoverStart={() => setHoveredTaskId(task._id)}
                  onHoverEnd={() => setHoveredTaskId(null)}
                >
                  {/* Left accent bar with animated gradient on hover */}
                  <div className="absolute top-0 left-0 bottom-0 w-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#9c4dff] to-[#c840eb]"></div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-b from-[#ff5089] via-[#c840eb] to-[#9c4dff]"
                      initial={{ scaleY: 0, originY: 0 }}
                      animate={{ scaleY: hoveredTaskId === task._id ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  
                  <div className="p-6 pl-8">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-100 group-hover:text-[#c840eb] transition-colors duration-200">{task.title}</h2>
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#c840eb] bg-[#9c4dff]/10 rounded-full shadow-sm">
                        {task.categoryName}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2 line-clamp-2">{task.description}</p>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c840eb] mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-300">
                          {task.feedback?.length || 0} {task.feedback?.length === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                      
                      <motion.div 
                        className="text-sm text-[#9c4dff] font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        animate={{ x: hoveredTaskId === task._id ? 5 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        View feedback
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* Interactive background gradient on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#9c4dff]/5 to-transparent rounded-xl -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredTaskId === task._id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-[#120822]/60 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 p-8 text-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks found</h3>
              <p className="text-gray-400">You haven't submitted any tasks for review yet.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal for displaying feedbacks */}
      <AnimatePresence>
        {showModal && selectedTask && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="bg-[#120822]/90 backdrop-blur-lg border border-[#9c4dff]/30 rounded-xl shadow-2xl max-w-3xl w-full p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9c4dff]/20 to-[#ff5089]/20 rounded-xl blur-md -z-10"></div>
              
              <motion.button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] mb-1">{selectedTask.title}</h2>
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#c840eb] bg-[#9c4dff]/10 rounded-full">
                    {selectedTask.categoryName}
                  </span>
                </div>
                <p className="text-gray-300">{selectedTask.description}</p>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c840eb]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Feedback from Reviewers
              </h3>
              
              <motion.div 
                className="space-y-4 max-h-96 overflow-y-auto pr-2"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {selectedTask.feedback && selectedTask.feedback.length > 0 ? (
                  selectedTask.feedback.map((feedback, index) => (
                    <motion.div 
                      key={feedback._id || index} 
                      className="bg-[#1a0b2e]/50 backdrop-blur-sm p-5 rounded-lg border border-[#9c4dff]/20 shadow-sm hover:border-[#9c4dff]/40 transition-colors duration-300"
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      custom={index}
                    >
                      <div className="flex items-start mb-3">
                        <div className="bg-[#9c4dff]/20 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-200">{feedback.participant}</h4>
                        </div>
                      </div>
                      <p className="text-gray-300 pl-11 whitespace-pre-line">{feedback.feedback}</p>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    variants={itemVariants}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-400 font-medium">No feedback available for this task yet.</p>
                  </motion.div>
                )}
              </motion.div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  className="relative px-6 py-2.5 text-white font-medium rounded-lg overflow-hidden group"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-lg"></div>
                  
                  {/* Button hover effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#9c4dff]/20 via-[#c840eb]/20 to-[#ff5089]/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  {/* Animated ripple effect on hover */}
                  <span className="absolute inset-0 w-0 h-0 rounded-lg bg-white opacity-10 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out"></span>
                  
                  <span className="relative z-10">Close</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add some global animation styles */}
      <style jsx>{`
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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
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
};

export default Review;
