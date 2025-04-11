import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

// Import SVG if available, otherwise use a placeholder or URL
const illustrationUrl = 'https://cdn-icons-png.flaticon.com/512/1329/1329016.png';

// Modern dark theme hero with premium light streaks and fluid animations
const AnimatedHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const heroRef = useRef(null);
  const streaksRef = useRef(null);
  const glowRef = useRef(null);
  const gridRef = useRef(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const controls = useAnimation();
  const titleControls = useAnimation();
  const subtitleControls = useAnimation();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Features list
  const features = [
    {
      number: '01',
      title: 'Tailored Feedback',
      description: 'Request specific types of critiques (technical, design, user experience), allowing for highly focused and useful insights.'
    },
    {
      number: '02',
      title: 'Diverse Expert Pool',
      description: 'Connect with a community of diverse experts from different domains who bring unique knowledge and perspectives to your project.'
    },
    {
      number: '03',
      title: 'Structured Review Process',
      description: 'Receive feedback in a structured format broken down into actionable parts, making it easy to understand and implement.'
    }
  ];

  // Handle mouse movement for parallax and interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate mouse position relative to center
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY
      });
    };
    
    // Handle scroll events for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // GSAP light streaks animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    
    if (streaksRef.current) {
      // Animate light streaks
      gsap.set(streaksRef.current.children, { 
        opacity: 0,
        x: (i) => -200 + (i * 50),
        y: (i) => -100 + (i * 30),
        rotate: (i) => i * 10,
        scale: 0.6
      });
      
      tl.to(streaksRef.current.children, {
        opacity: 0.7,
        x: (i) => 300 + (i * 100),
        y: (i) => 200 + (i * 50),
        rotate: (i) => i * 15 + 45,
        scale: 1.2,
        stagger: 0.15,
        duration: 5,
        ease: "power1.inOut"
      }).to(streaksRef.current.children, {
        opacity: 0,
        x: (i) => 800 + (i * 150),
        y: (i) => 400 + (i * 80),
        rotate: (i) => i * 20 + 90,
        scale: 0.5,
        stagger: 0.1,
        duration: 4,
        ease: "power1.in"
      }, "-=3");
    }
    
    // Set loaded state after initial animation
    const timer = setTimeout(() => setIsLoaded(true), 500);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      tl.kill();
    };
  }, []);
  
  // Control animations based on in-view status
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      titleControls.start({ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, type: "spring", stiffness: 50 }
      });
      subtitleControls.start({ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }
      });
    } else {
      controls.start('hidden');
      titleControls.start({ opacity: 0, y: 20 });
      subtitleControls.start({ opacity: 0, y: 20 });
    }
  }, [controls, inView, titleControls, subtitleControls]);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-[#080312] pt-32 pb-20 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-[#1a0b2e] via-[#130822] to-[#080312]"></div>
      
      {/* Dynamic grid lines */}
      <div 
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(138, 43, 226, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(138, 43, 226, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px) perspective(500px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * -5}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
      
      {/* Animated glow */}
      <div 
        ref={glowRef}
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] -mt-[300px] -ml-[300px] z-0 opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(138, 43, 226, 0.8) 0%, rgba(90, 24, 154, 0.5) 40%, rgba(90, 24, 154, 0) 70%)',
          transform: `translate(${mousePosition.x * 100 + 50}%, ${mousePosition.y * 100 + 50}%) translate3d(0, ${-scrollY * 0.1}px, 0)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      
      {/* Light streaks */}
      <div ref={streaksRef} className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-[2px] rounded-full"
            style={{
              background: i % 2 === 0 
                ? 'linear-gradient(90deg, rgba(138,43,226,0) 0%, rgba(138,43,226,0.8) 50%, rgba(138,43,226,0) 100%)' 
                : 'linear-gradient(90deg, rgba(255,0,255,0) 0%, rgba(255,0,255,0.8) 50%, rgba(255,0,255,0) 100%)',
              width: `${100 + i * 50}px`,
              opacity: 0,
              boxShadow: `0 0 15px 2px ${i % 2 === 0 ? 'rgba(138,43,226,0.6)' : 'rgba(255,0,255,0.6)'}`
            }}
          />
        ))}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(138,43,226,0.8) 0%, rgba(138,43,226,0.2) 70%)' 
                : i % 3 === 1
                  ? 'radial-gradient(circle, rgba(255,0,255,0.8) 0%, rgba(255,0,255,0.2) 70%)'
                  : 'radial-gradient(circle, rgba(75,0,130,0.8) 0%, rgba(75,0,130,0.2) 70%)',
              boxShadow: i % 4 === 0 ? '0 0 10px 2px rgba(138,43,226,0.4)' : 'none',
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, Math.random() * 0.5 + 1, 1]
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div ref={ref} className="container mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-col items-center justify-center text-center mb-20"
        >
          {/* Spotlight effect */}
          <motion.div
            className="absolute w-[80vw] h-[80vh] max-w-[800px] max-h-[800px] rounded-full opacity-5 filter blur-[100px]"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(138,43,226,0.3) 50%, transparent 80%)',
              transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={titleControls}
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight relative"
          >
            <AnimatePresence>
              {isLoaded && (
                <>
                  <motion.span 
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    Ideas meet feedback,
                  </motion.span>
                  <br />
                  <motion.span 
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#ff5089] via-[#c840eb] to-[#9c4dff]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    success follows.
                  </motion.span>
                  
                  {/* Animated underline */}
                  <motion.span
                    className="absolute -bottom-3 left-1/2 h-[3px] bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]"
                    initial={{ width: 0, x: "-50%" }}
                    animate={{ width: "60%", x: "-50%" }}
                    transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleControls}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10"
          >
            Connect to share your vision, receive genuine thoughtful feedback, and grow your ideas beyond boundaries.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="mb-16 relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button light effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089] rounded-full blur-lg opacity-70 group-hover:opacity-100 animate-pulse transition duration-1000"></div>
            
            <Link 
              to="/signup" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium overflow-hidden rounded-full bg-gradient-to-r from-[#9c4dff]/80 via-[#c840eb]/80 to-[#ff5089]/80 text-white shadow-lg backdrop-blur-sm"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#9c4dff]/20 via-[#c840eb]/20 to-[#ff5089]/20"></span>
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-96 group-hover:h-96 opacity-10"></span>
              <span className="relative flex items-center">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Interactive 3D element - Abstract shape */}
          <motion.div
            variants={itemVariants}
            className="relative w-64 h-64 md:w-80 md:h-80 mx-auto perspective-[1000px]"
            style={{
              transform: `rotateX(${mousePosition.y * 20}deg) rotateY(${mousePosition.x * 20}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Center element */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-40 h-40 -ml-20 -mt-20 rounded-full"
              style={{ 
                background: 'linear-gradient(135deg, rgba(156, 77, 255, 0.6) 0%, rgba(200, 64, 235, 0.6) 50%, rgba(255, 80, 137, 0.6) 100%)',
                boxShadow: '0 0 40px 10px rgba(138,43,226,0.3), inset 0 0 40px rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)'
              }}
              animate={{
                rotateZ: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Inner pulse */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#9c4dff]/50 to-[#c840eb]/50"
                animate={{
                  scale: [0.6, 1, 0.6],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Orbiting Elements */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60) * Math.PI / 180;
              const radius = 120;
              const color = i % 3 === 0 ? '#9c4dff' : i % 3 === 1 ? '#c840eb' : '#ff5089';
              
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ 
                    marginTop: '-12px', 
                    marginLeft: '-12px',
                    background: `rgba(${i % 3 === 0 ? '156, 77, 255' : i % 3 === 1 ? '200, 64, 235' : '255, 80, 137'}, 0.8)`,
                    boxShadow: `0 0 15px 3px rgba(${i % 3 === 0 ? '156, 77, 255' : i % 3 === 1 ? '200, 64, 235' : '255, 80, 137'}, 0.4)`
                  }}
                  animate={{
                    x: [
                      Math.cos(angle) * radius, 
                      Math.cos(angle + Math.PI * 2) * radius
                    ],
                    y: [
                      Math.sin(angle) * radius, 
                      Math.sin(angle + Math.PI * 2) * radius
                    ],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    x: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                    y: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                  }}
                >
                  {/* Light trail */}
                  <motion.div
                    className="absolute w-12 h-1 origin-left"
                    style={{
                      background: `linear-gradient(90deg, ${color}, transparent)`,
                      opacity: 0.6,
                      transformOrigin: 'left center',
                      rotate: `${(i * 60) + 180}deg`
                    }}
                  />
                </motion.div>
              );
            })}
            
            {/* Decorative Ring */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full"
              style={{ 
                marginTop: '-160px', 
                marginLeft: '-160px',
                border: '1px solid rgba(156, 77, 255, 0.3)',
                boxShadow: '0 0 20px rgba(156, 77, 255, 0.2)',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(75deg)'
              }}
              animate={{
                rotateZ: [0, 360]
              }}
              transition={{ 
                rotateZ: { duration: 30, repeat: Infinity, ease: "linear" }
              }}
            />
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9c4dff] via-[#c840eb] to-[#ff5089]">
              What sets us apart
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index + 0.8 }}
                className="relative group"
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-[#9c4dff]/20 to-[#ff5089]/20 rounded-xl blur-xl group-hover:opacity-100 transition-opacity duration-300 opacity-0"
                  style={{transform: 'translateY(10px) scale(0.95)'}}
                />
                
                <div className="relative bg-[#120822]/80 backdrop-blur-sm border border-[#9c4dff]/20 rounded-xl p-8 transition-all duration-300 group-hover:border-[#9c4dff]/40 group-hover:shadow-[0_0_30px_rgba(156,77,255,0.3)]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9c4dff] to-[#ff5089] flex items-center justify-center text-white font-bold mb-6">
                    {feature.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                  
                  <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-[#c840eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Add global CSS for radial gradient */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
        }
        
        .perspective-[1000px] {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default AnimatedHero; 