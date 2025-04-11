import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

const ProjectForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const email = currentUser?.email;
  
  // Get category from location state, or redirect if missing
  const categoryFromState = location.state?.category?.toLowerCase();
  const [category, setCategory] = useState(categoryFromState || '');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'problem',
    link: '',
    statement: '',
    description: '',
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs for animations
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const streaksRef = useRef(null);
  const orbitRef = useRef(null);
  
  // For scroll animations
  const { ref: formRef, inView: formInView } = useInView({
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
    
    // Orbit animation
    if (orbitRef.current) {
      const orbitElements = orbitRef.current.children;
      
      gsap.to(orbitElements, {
        rotation: (i) => i % 2 === 0 ? 360 : -360,
        transformOrigin: "center center",
        duration: (i) => 15 + i * 5,
        repeat: -1,
        ease: "none"
      });
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Redirect if no category is provided
  useEffect(() => {
    if (!categoryFromState) {
      setError('No category selected. Please choose a category first.');
    }
  }, [categoryFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('You must be logged in to submit a review request.');
      return;
    }
    
    if (!category) {
      setError('Category is required. Please go back and select a category.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const task = {
      title: formData.title,
      type: formData.type,
      url: formData.link,
      description: formData.description || formData.statement,
    };
    
    try {
      const response = await axios.post('https://critiquebackend.onrender.com/categories/task', {
        category: category,
        seeker: email,
        task,
      });
      console.log('Task submitted successfully:', response);
      
      // Show success animation
      const formElement = document.getElementById('review-form');
      if (formElement) {
        gsap.to(formElement, {
          y: -20,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            navigate('/dashboard');
          }
        });
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting task:', error.response ? error.response.data : error.message);
      setError('Failed to submit the task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/categories');
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
        
        {/* Orbital rings */}
        <div 
          ref={orbitRef}
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
        >
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full border opacity-10"
              style={{
                width: `${600 + i * 200}px`,
                height: `${600 + i * 200}px`,
                borderWidth: `${2 - i * 0.5}px`,
                borderColor: i % 2 === 0 ? '#9c4dff' : '#ff5089',
                transform: `rotate(${i * 30}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Main content container */}
        <div className="relative max-w-5xl mx-auto z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-[#120822]/60 backdrop-blur-md rounded-2xl shadow-xl border border-[#9c4dff]/20 overflow-hidden p-8 mb-10 w-full relative"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"></div>
              
              <motion.h2 
                variants={itemVariants} 
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] text-center mb-3"
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
                Submit Your {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''} Review Request
              </motion.h2>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#ff5089]/10 border border-[#ff5089]/40 text-[#ff5089] rounded-lg backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}
              
              {!categoryFromState ? (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-10"
                >
                  <p className="mb-6 text-gray-300">
                    Please select a category first to submit your review request.
                  </p>
                  <motion.button
                    onClick={handleCancel}
                    className="relative px-8 py-3 text-white font-medium rounded-full overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Button background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-full"></div>
                    
                    {/* Button hover effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#9c4dff]/20 via-[#c840eb]/20 to-[#ff5089]/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Animated ripple effect on hover */}
                    <span className="absolute inset-0 w-0 h-0 rounded-full bg-white opacity-10 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out"></span>
                    
                    <span className="relative z-10 flex items-center">
                      Go to Categories
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  id="review-form"
                  ref={formRef}
                  variants={containerVariants}
                  initial="hidden"
                  animate={formInView ? "visible" : "hidden"}
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                >
                  <motion.div variants={itemVariants}>
                    <label htmlFor="type" className="block text-lg font-medium text-gray-200">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                      required
                    >
                      <option value="problem">problem</option>
                      <option value="idea">idea</option>
                      <option value="survey">survey</option>
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-200">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                      placeholder="Enter project title"
                      required
                    />
                  </motion.div>

                  {formData.type === 'problem' && (
                    <motion.div variants={itemVariants}>
                      <label htmlFor="statement" className="block text-lg font-medium text-gray-200">
                        Problem Statement
                      </label>
                      <textarea
                        id="statement"
                        name="statement"
                        value={formData.statement}
                        onChange={handleChange}
                        className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                        placeholder="Describe the problem in detail"
                        rows="3"
                        required
                      ></textarea>
                    </motion.div>
                  )}

                  {formData.type === 'idea' && (
                    <>
                      <motion.div variants={itemVariants}>
                        <label htmlFor="link" className="block text-lg font-medium text-gray-200">
                          Project Link
                        </label>
                        <input
                          type="url"
                          id="link"
                          name="link"
                          value={formData.link}
                          onChange={handleChange}
                          className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                          placeholder="Enter project link (if available)"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-200">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                          placeholder="Describe your idea in detail"
                          rows="3"
                          required
                        ></textarea>
                      </motion.div>
                    </>
                  )}

                  {formData.type === 'survey' && (
                    <>
                      <motion.div variants={itemVariants}>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-200">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                          placeholder="Describe your survey"
                          rows="3"
                          required
                        ></textarea>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label htmlFor="link" className="block text-lg font-medium text-gray-200">
                          Survey URL
                        </label>
                        <input
                          type="url"
                          id="link"
                          name="link"
                          value={formData.link}
                          onChange={handleChange}
                          className="mt-2 block w-full p-3 border border-[#9c4dff]/30 rounded-md bg-[#120822]/70 text-gray-200 shadow-sm focus:ring-[#c840eb] focus:border-[#c840eb] transition duration-200 ease-in-out hover:border-[#c840eb]"
                          placeholder="Enter survey URL"
                          required
                        />
                      </motion.div>
                    </>
                  )}

                  <motion.div variants={itemVariants} className="flex justify-between">
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      className="relative px-6 py-3 text-gray-300 border border-[#9c4dff]/30 rounded-lg overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">Cancel</span>
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
                          Submit
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </motion.div>
          </motion.div>
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
};

export default ProjectForm;