// import React, { useState } from 'react'

// export default function Categories() {
//     const [category, setCategory] = useState('')
//     const categories = ['Social', 'Business', 'Technology', 'Art', 'Science', 'Health', 'Education', 'Other']
//   return (
//     <div className='rounded-3xl bg-slate-500'>
//       <div>
//         <h2 className='text-white text-2xl font-bold'>Select Category</h2>
    
//         <div className='grid grid-cols-4 gap-4'>
//             {categories.map((cat) => (
//                 <div
//                 key={cat}
//                 onClick={() => setCategory(cat)}
//                 className={`cursor-pointer p-4 rounded-xl ${
//                     category === cat ? 'bg-slate-400' : 'bg-slate-300'
//                 }`}
//                 >
//                 <p className='text-white text-center'>{cat}</p>
//                 </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// this is test
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Navbar from './Navbar';
import Footer from './Footer';

function CategoriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  const categories = ['Social', 'Business', 'Technology', 'Art', 'Science', 'Health', 'Education', 'Other'];
  
  // Refs for animations
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const streaksRef = useRef(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.08,
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
    },
    selected: {
      scale: 1.05,
      y: -10,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
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

  const handleProceed = () => {
    navigate('/seek-review', { state: { email, category: selectedCategory } });
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
        <div className="relative max-w-3xl mx-auto z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center"
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
                Select a Category
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-300 text-center mb-8"
              >
                Choose a category for your work to get relevant feedback
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
            >
              {categories.map((cat, index) => (
                <motion.div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variants={cardVariants}
                  whileHover="hover"
                  animate={selectedCategory === cat ? "selected" : "visible"}
                  onHoverStart={() => setHoveredCategory(cat)}
                  onHoverEnd={() => setHoveredCategory(null)}
                  className={`relative cursor-pointer p-6 rounded-xl backdrop-blur-sm shadow-lg border overflow-hidden group
                    ${selectedCategory === cat 
                      ? 'bg-[#9c4dff]/20 border-[#9c4dff]/60 shadow-[#9c4dff]/20' 
                      : 'bg-[#120822]/60 border-[#9c4dff]/20 hover:border-[#9c4dff]/40'
                    }
                  `}
                >
                  {/* Border gradient animation on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 rounded-xl border border-[#9c4dff]/40 scale-90 group-hover:scale-100 transition-transform duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                  
                  <div className="flex justify-center mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedCategory === cat 
                        ? 'bg-[#9c4dff]/30' 
                        : 'bg-[#9c4dff]/10 group-hover:bg-[#9c4dff]/20'
                      } transition-colors duration-300`}>
                      <motion.div
                        animate={
                          selectedCategory === cat 
                            ? { rotate: 360, scale: 1.1 } 
                            : hoveredCategory === cat 
                              ? { scale: 1.1 } 
                              : { scale: 1 }
                        }
                        transition={{ 
                          rotate: { duration: 0.5 },
                          scale: { type: "spring", stiffness: 300, damping: 10 } 
                        }}
                      >
                        {getCategoryIcon(cat)}
                      </motion.div>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-semibold text-center transition duration-300 ${
                    selectedCategory === cat 
                      ? 'text-[#c840eb]'
                      : 'text-gray-100 group-hover:text-[#c840eb]'
                  }`}>{cat}</h3>
                  
                  {/* Background gradient effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#9c4dff]/5 via-transparent to-transparent rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCategory === cat || selectedCategory === cat ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                className="mt-10"
              >
                <motion.button
                  onClick={handleProceed}
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
                    Proceed with {selectedCategory}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </motion.button>
              </motion.div>
            )}
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
}

// Helper function to get icons for each category
function getCategoryIcon(category) {
  switch(category) {
    case 'Social':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'Business':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'Technology':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'Art':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'Science':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case 'Health':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'Education':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export default CategoriesPage;


