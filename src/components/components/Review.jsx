import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import SentimentDonutChart from './SentimentDonutChart';

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
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
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

  // Fetch summary data for the selected task
  const fetchSummary = async (task) => {
    if (!task || !task.categoryName || !task.title) return;
    
    setSummaryLoading(true);
    setSummaryData(null);
    
    try {
      const response = await axios.post('https://critiquebackend.onrender.com/summary', {
        category: task.categoryName.toLowerCase(),
        title: task.title
      });
      
      console.log('Summary data:', response.data);
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Handle task selection and fetch summary
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowModal(true);
    fetchSummary(task);
  };

  // Function to convert percentage string to number
  const percentToNumber = (percentStr) => {
    return parseInt(percentStr?.replace('%', '') || 0);
  };
  
  // Function to determine dominant sentiment
  const getDominantSentiment = (sentimentData) => {
    if (!sentimentData) return 'neutral';
    
    const positive = percentToNumber(sentimentData.positive);
    const neutral = percentToNumber(sentimentData.neutral);
    const negative = percentToNumber(sentimentData.negative);
    
    if (positive >= neutral && positive >= negative) return 'positive';
    if (negative >= positive && negative >= neutral) return 'negative';
    return 'neutral';
  };

  return (
    <>
      <Navbar />
      <div 
        ref={pageRef}
        className="relative min-h-screen bg-[#080312] pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1a0b2e] via-[#130822] to-[#080312] z-0"></div>
        
        {/* Dynamic grid lines - subtle background pattern */}
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
        
        {/* Animated glow orbs - create depth */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#9c4dff]/10 blur-[150px] animate-pulse-slow z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff5089]/10 blur-[150px] animate-pulse-slow animation-delay-1000 z-0"></div>
        
        {/* Light streaks - dynamic effect */}
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
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header Section with page title */}
          <motion.div 
            ref={headerRef}
            variants={containerVariants}
            initial="hidden"
            animate={headerControls}
            className="mb-10"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-[#120822]/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden transition-all duration-500 hover:shadow-[#9c4dff]/30 hover:shadow-2xl p-8"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"></div>
              
              <motion.h1 
                variants={itemVariants} 
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] mb-3"
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
                <motion.p variants={itemVariants} className="text-gray-300 text-lg">
                  Viewing feedback for: <span className="font-medium text-[#c840eb]">{email}</span>
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                {/* Animated loading spinner with glowing effect */}
                <div className="w-16 h-16 border-4 border-[#9c4dff]/30 border-t-[#9c4dff] rounded-full animate-spin"></div>
                <div className="absolute inset-0 rounded-full blur-xl bg-[#9c4dff]/30 scale-75 animate-pulse"></div>
              </div>
            </div>
          ) : tasks.length > 0 ? (
            /* Tasks List */
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
                  className="group bg-[#120822]/80 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 overflow-hidden transition-all duration-300 hover:shadow-[#9c4dff]/30 hover:shadow-xl cursor-pointer relative"
                  onClick={() => handleTaskSelect(task)}
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <h2 className="text-xl font-semibold text-gray-100 group-hover:text-[#c840eb] transition-colors duration-200">{task.title}</h2>
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#c840eb] bg-[#9c4dff]/10 rounded-full shadow-sm self-start">
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
            /* Empty state */
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-[#120822]/80 backdrop-blur-md rounded-xl shadow-md border border-[#9c4dff]/20 p-8 text-center"
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
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="bg-[#120822]/90 backdrop-blur-lg border border-[#9c4dff]/30 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9c4dff]/20 to-[#ff5089]/20 rounded-xl blur-md -z-10"></div>
              
              {/* Modal header */}
              <div className="sticky top-0 bg-[#120822]/95 backdrop-blur-md border-b border-[#9c4dff]/20 p-6 pb-4">
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
                
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] mb-1">{selectedTask.title}</h2>
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-[#c840eb] bg-[#9c4dff]/10 rounded-full">
                    {selectedTask.categoryName}
                  </span>
                </div>
                <p className="text-gray-300">{selectedTask.description}</p>
              </div>
              
              {/* Modal content - scrollable area */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Summary Section */}
                {summaryLoading ? (
                  <div className="mb-6 p-5 bg-[#1a0b2e]/70 rounded-lg border border-[#9c4dff]/20">
                    <div className="flex items-center justify-center space-x-2 py-4">
                      <div className="w-4 h-4 rounded-full bg-[#9c4dff] animate-pulse"></div>
                      <div className="w-4 h-4 rounded-full bg-[#c840eb] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-4 h-4 rounded-full bg-[#ff5089] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="ml-2 text-gray-300">Loading summary data...</span>
                    </div>
                  </div>
                ) : summaryData ? (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Use the new SentimentDonutChart component */}
                    <SentimentDonutChart sentimentData={summaryData.sentiment_analysis} />
                    
                    {/* Keep the existing Overall Summary section */}
                    <div className="mb-5 mt-6 bg-[#1a0b2e]/40 backdrop-blur-md p-5 rounded-lg border border-[#9c4dff]/30 shadow-lg relative overflow-hidden group">
                      {/* Animated gradient border effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#9c4dff]/0 via-[#9c4dff]/30 to-[#9c4dff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
                      
                      <h4 className="font-semibold text-[#c840eb] mb-3 flex items-center text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Overall Summary
                      </h4>
                      
                      <div className="relative z-10">
                        {/* Quote marks for summary */}
                        <svg className="absolute -top-2 -left-2 w-8 h-8 text-[#9c4dff]/20" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14.2 4.73333 12.7333 5.53333 11.3333C6.33333 10 7.33333 8.86667 8.53333 7.93333L10.6667 10.1333C9.66667 10.9333 8.93333 11.7333 8.46667 12.5333C8 13.3333 7.86667 14.0667 8.06667 14.7333C8.4 14.6 8.73333 14.5333 9.06667 14.5333C10.2 14.5333 11.1333 14.9333 11.8667 15.7333C12.6 16.5333 12.9667 17.4667 12.9667 18.5333C12.9667 19.6 12.6 20.5333 11.8667 21.3333C11.1333 22.1333 10.3333 21.4667 9.33333 21.3333ZM21.3333 21.3333C19.8667 21.3333 18.6667 20.8 17.7333 19.7333C16.8 18.6667 16.3333 17.3333 16.3333 15.7333C16.3333 14.2 16.7333 12.7333 17.5333 11.3333C18.3333 10 19.3333 8.86667 20.5333 7.93333L22.6667 10.1333C21.6667 10.9333 20.9333 11.7333 20.4667 12.5333C20 13.3333 19.8667 14.0667 20.0667 14.7333C20.4 14.6 20.7333 14.5333 21.0667 14.5333C22.2 14.5333 23.1333 14.9333 23.8667 15.7333C24.6 16.5333 24.9667 17.4667 24.9667 18.5333C24.9667 19.6 24.6 20.5333 23.8667 21.3333C23.1333 22.1333 22.3333 21.4667 21.3333 21.3333Z" />
                        </svg>
                        
                        <p className="text-gray-300 leading-relaxed pl-6 italic">{summaryData.overall_summary}</p>
                        
                        {/* Bottom quote mark */}
                        <svg className="absolute -bottom-2 -right-2 w-8 h-8 text-[#9c4dff]/20 transform rotate-180" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14.2 4.73333 12.7333 5.53333 11.3333C6.33333 10 7.33333 8.86667 8.53333 7.93333L10.6667 10.1333C9.66667 10.9333 8.93333 11.7333 8.46667 12.5333C8 13.3333 7.86667 14.0667 8.06667 14.7333C8.4 14.6 8.73333 14.5333 9.06667 14.5333C10.2 14.5333 11.1333 14.9333 11.8667 15.7333C12.6 16.5333 12.9667 17.4667 12.9667 18.5333C12.9667 19.6 12.6 20.5333 11.8667 21.3333C11.1333 22.1333 10.3333 21.4667 9.33333 21.3333ZM21.3333 21.3333C19.8667 21.3333 18.6667 20.8 17.7333 19.7333C16.8 18.6667 16.3333 17.3333 16.3333 15.7333C16.3333 14.2 16.7333 12.7333 17.5333 11.3333C18.3333 10 19.3333 8.86667 20.5333 7.93333L22.6667 10.1333C21.6667 10.9333 20.9333 11.7333 20.4667 12.5333C20 13.3333 19.8667 14.0667 20.0667 14.7333C20.4 14.6 20.7333 14.5333 21.0667 14.5333C22.2 14.5333 23.1333 14.9333 23.8667 15.7333C24.6 16.5333 24.9667 17.4667 24.9667 18.5333C24.9667 19.6 24.6 20.5333 23.8667 21.3333C23.1333 22.1333 22.3333 21.4667 21.3333 21.3333Z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Keep the existing Improvement Points section */}
                    {summaryData.improvement_points && summaryData.improvement_points.length > 0 && (
                      <div className="bg-[#1a0b2e]/40 backdrop-blur-md p-5 rounded-lg border border-[#9c4dff]/30 shadow-lg">
                        <h4 className="font-semibold text-[#c840eb] mb-3 flex items-center text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Areas for Improvement
                        </h4>
                        
                        <div className="space-y-3">
                          {summaryData.improvement_points.map((point, index) => (
                            <div 
                              key={index} 
                              className="flex items-start p-3 bg-[#1a0b2e]/60 rounded-lg border border-[#9c4dff]/10 transition-all duration-300 hover:border-[#9c4dff]/30 hover:shadow-md"
                            >
                              <div className="bg-[#9c4dff]/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <p className="text-gray-300">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : null}
                
                {/* Individual Feedback Section */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c840eb]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Individual Feedback
                  </h3>
                
                  <motion.div 
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    {selectedTask.feedback && selectedTask.feedback.length > 0 ? (
                      selectedTask.feedback.map((feedback, index) => (
                        <motion.div 
                          key={feedback._id || index} 
                          className="bg-[#1a0b2e]/70 backdrop-blur-sm p-5 rounded-lg border border-[#9c4dff]/20 shadow-sm hover:border-[#9c4dff]/40 transition-colors duration-300"
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
                        className="text-center py-8 bg-[#1a0b2e]/40 rounded-lg border border-[#9c4dff]/10"
                        variants={itemVariants}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-gray-400 font-medium">No feedback available for this task yet.</p>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="sticky bottom-0 bg-[#120822]/95 backdrop-blur-md border-t border-[#9c4dff]/20 p-4 flex justify-end">
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

      {/* Animation styles */}
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
