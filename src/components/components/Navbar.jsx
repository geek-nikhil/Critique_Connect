import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import companyLogo from '../assets/images/Screenshot (279)_enhanced.png';
import gsap from 'gsap';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { currentUser, signOut } = useAuth();
  
  // Ref for logo animation
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const glowRef = useRef(null);
  
  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    
    // GSAP animations for logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    // GSAP animation for glow effect
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#080312]/90 backdrop-blur-lg shadow-xl border-b border-[#9c4dff]/20 h-20' 
          : 'bg-[#080312]/70 h-24'
      }`}
    >
      {/* Background glow effect */}
      <div 
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-r from-[#9c4dff]/5 via-[#c840eb]/5 to-[#ff5089]/5 opacity-0 pointer-events-none"
      ></div>
      
      {/* Top edge gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#9c4dff]/40 via-[#c840eb]/40 to-[#ff5089]/40"></div>
      
      {/* Flex Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center">
            <motion.div
              ref={logoRef}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={companyLogo} 
                alt="CritiqueConnect Logo" 
                className="h-10 w-auto object-contain transition-transform duration-300"
              />
              
              {/* Logo backdrop glow */}
              <div className="absolute -inset-1 bg-[#9c4dff]/20 rounded-full blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Menu Items for Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                }
              }
            }}
            className="flex items-center space-x-8"
          >
            <motion.div variants={navItemVariants} whileHover="hover">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-[#c840eb] font-medium text-sm transition duration-300 ease-in-out relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9c4dff] to-[#ff5089] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
            
            {currentUser && (
              <motion.div variants={navItemVariants} whileHover="hover">
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-[#c840eb] font-medium text-sm transition duration-300 ease-in-out relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9c4dff] to-[#ff5089] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            )}
            
            <motion.div variants={navItemVariants} whileHover="hover">
              <Link 
                to="/categories" 
                className="text-gray-300 hover:text-[#c840eb] font-medium text-sm transition duration-300 ease-in-out relative group"
              >
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9c4dff] to-[#ff5089] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
            
            <motion.div variants={navItemVariants} whileHover="hover">
              <Link 
                to="/reviews" 
                className="text-gray-300 hover:text-[#c840eb] font-medium text-sm transition duration-300 ease-in-out relative group"
              >
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9c4dff] to-[#ff5089] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
            
            <motion.div variants={navItemVariants} whileHover="hover">
              <Link 
                to="/about-us" 
                className="text-gray-300 hover:text-[#c840eb] font-medium text-sm transition duration-300 ease-in-out relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9c4dff] to-[#ff5089] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Auth Buttons */}
        <motion.div 
          className="hidden lg:flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                {currentUser.email}
              </span>
              <motion.button
                onClick={handleLogout}
                className="relative py-2 px-5 text-white font-medium rounded-full overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></div>
                
                {/* Button hover effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600/20 via-rose-500/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Animated ripple effect on hover */}
                <span className="absolute inset-0 w-0 h-0 rounded-full bg-white opacity-10 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out"></span>
                
                <span className="relative flex items-center">
                  Log Out
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
              </motion.button>
            </div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="relative py-2 px-8 text-[#c840eb] font-medium border-2 border-[#9c4dff] rounded-full transition-all duration-300 hover:bg-[#9c4dff]/10"
                >
                  Log In
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="relative py-2 px-8 text-white font-medium bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-full flex items-center"
                >
                  <span>Sign Up</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden flex items-center p-2 rounded-md focus:outline-none"
          onClick={() => setToggleMenu(!toggleMenu)}
          aria-expanded={toggleMenu}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="sr-only">Open main menu</span>
          <div className="relative w-6 h-5">
            <span
              className={`absolute top-0 left-0 w-6 h-0.5 bg-[#c840eb] transform transition-all duration-300 ${
                toggleMenu ? 'rotate-45 translate-y-2.5' : ''
              }`}
            ></span>
            <span
              className={`absolute top-2 left-0 w-6 h-0.5 bg-[#c840eb] transition-opacity duration-300 ${
                toggleMenu ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`absolute top-4 left-0 w-6 h-0.5 bg-[#c840eb] transform transition-all duration-300 ${
                toggleMenu ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            ></span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`lg:hidden absolute w-full bg-[#080312]/95 backdrop-blur-lg shadow-xl border-b border-[#9c4dff]/20 overflow-hidden z-40`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: toggleMenu ? 'auto' : 0,
          opacity: toggleMenu ? 1 : 0
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 pb-4">
            <Link 
              to="/"
              onClick={() => setToggleMenu(false)}
              className="text-gray-300 hover:text-[#c840eb] font-medium px-4 py-2 rounded-lg hover:bg-[#9c4dff]/10 transition duration-300 flex items-center"
            >
              <span>Home</span>
              <div className="ml-auto bg-[#9c4dff]/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            {currentUser && (
              <Link 
                to="/dashboard"
                onClick={() => setToggleMenu(false)}
                className="text-gray-300 hover:text-[#c840eb] font-medium px-4 py-2 rounded-lg hover:bg-[#9c4dff]/10 transition duration-300 flex items-center"
              >
                <span>Dashboard</span>
                <div className="ml-auto bg-[#9c4dff]/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}
            
            <Link 
              to="/about-us"
              onClick={() => setToggleMenu(false)}
              className="text-gray-300 hover:text-[#c840eb] font-medium px-4 py-2 rounded-lg hover:bg-[#9c4dff]/10 transition duration-300 flex items-center"
            >
              <span>About Us</span>
              <div className="ml-auto bg-[#9c4dff]/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            <Link 
              to="/categories"
              onClick={() => setToggleMenu(false)}
              className="text-gray-300 hover:text-[#c840eb] font-medium px-4 py-2 rounded-lg hover:bg-[#9c4dff]/10 transition duration-300 flex items-center"
            >
              <span>Categories</span>
              <div className="ml-auto bg-[#9c4dff]/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            <Link 
              to="/reviews"
              onClick={() => setToggleMenu(false)}
              className="text-gray-300 hover:text-[#c840eb] font-medium px-4 py-2 rounded-lg hover:bg-[#9c4dff]/10 transition duration-300 flex items-center"
            >
              <span>Reviews</span>
              <div className="ml-auto bg-[#9c4dff]/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#c840eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            <div className="flex flex-col space-y-3 mt-4">
              {currentUser ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-300 truncate">
                    {currentUser.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setToggleMenu(false);
                    }}
                    className="w-full text-center py-2.5 px-4 text-white font-medium bg-gradient-to-r from-red-500 to-pink-600 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-pink-600/20 flex items-center justify-center"
                  >
                    <span>Log Out</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setToggleMenu(false)}
                    className="w-full text-center py-2.5 px-4 text-[#c840eb] font-medium border-2 border-[#9c4dff] rounded-lg transition-all duration-300 hover:bg-[#9c4dff]/10"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setToggleMenu(false)}
                    className="w-full text-center py-2.5 px-4 text-white font-medium bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-lg flex items-center justify-center"
                  >
                    <span>Sign Up</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
  