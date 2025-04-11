import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SentimentDonutChart = ({ sentimentData = { positive: '60%', negative: '20%', neutral: '20%' } }) => {
  // State to track which segment is being hovered
  const [hoveredSegment, setHoveredSegment] = useState(null);
  // State to track mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Ref for the SVG container
  const svgRef = useRef(null);

  // Convert percentage strings to numbers
  const extractPercentage = (percentStr) => {
    return parseInt(percentStr?.replace('%', '') || 0);
  };

  const positivePercent = extractPercentage(sentimentData.positive);
  const negativePercent = extractPercentage(sentimentData.negative);
  const neutralPercent = extractPercentage(sentimentData.neutral);

  // Calculate angles for SVG paths instead of using stroke-dasharray
  // This gives us more control over the segments
  const calculateSegments = () => {
    const total = positivePercent + neutralPercent + negativePercent;
    const normalizedPositive = positivePercent / total;
    const normalizedNeutral = neutralPercent / total;
    const normalizedNegative = negativePercent / total;
    
    // Convert to angles (in degrees)
    const positiveAngle = normalizedPositive * 360;
    const neutralAngle = normalizedNeutral * 360;
    const negativeAngle = normalizedNegative * 360;
    
    // Calculate start and end angles for each segment
    const segments = [
      {
        id: 'positive',
        color: '#38a169',
        hoverColor: '#48bb7f',
        glowColor: 'rgba(56, 161, 105, 0.6)',
        percent: positivePercent,
        percentStr: sentimentData.positive,
        startAngle: 0,
        endAngle: positiveAngle,
        midAngle: positiveAngle / 2, // For label positioning
      },
      {
        id: 'neutral',
        color: '#ecc94b',
        hoverColor: '#f8df76',
        glowColor: 'rgba(236, 201, 75, 0.6)',
        percent: neutralPercent,
        percentStr: sentimentData.neutral,
        startAngle: positiveAngle,
        endAngle: positiveAngle + neutralAngle,
        midAngle: positiveAngle + (neutralAngle / 2),
      },
      {
        id: 'negative',
        color: '#e53e3e',
        hoverColor: '#f05252',
        glowColor: 'rgba(229, 62, 62, 0.6)',
        percent: negativePercent,
        percentStr: sentimentData.negative,
        startAngle: positiveAngle + neutralAngle,
        endAngle: 360,
        midAngle: positiveAngle + neutralAngle + ((360 - (positiveAngle + neutralAngle)) / 2),
      }
    ];
    
    return segments;
  };
  
  // Function to calculate a point on a circle at a given angle and radius
  function calculatePointOnCircle(angle, radius) {
    // Convert angle to radians and adjust for SVG coordinate system
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + radius * Math.cos(rad),
      y: 50 + radius * Math.sin(rad)
    };
  }
  
  const segments = calculateSegments();

  // Function to create donut segment path
  const createSegmentPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate coordinates
    const x1 = 50 + innerRadius * Math.cos(startRad);
    const y1 = 50 + innerRadius * Math.sin(startRad);
    const x2 = 50 + outerRadius * Math.cos(startRad);
    const y2 = 50 + outerRadius * Math.sin(startRad);
    const x3 = 50 + outerRadius * Math.cos(endRad);
    const y3 = 50 + outerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(endRad);
    const y4 = 50 + innerRadius * Math.sin(endRad);
    
    // Determine if the arc should be drawn the long way around
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    // Create path
    const path = [
      `M ${x1} ${y1}`, // Move to inner start point
      `L ${x2} ${y2}`, // Line to outer start point
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`, // Arc to outer end point
      `L ${x4} ${y4}`, // Line to inner end point
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`, // Arc back to start
      'Z' // Close path
    ].join(' ');
    
    return path;
  };

  // Determine dominant sentiment for center display
  const getDominantSentiment = () => {
    if (positivePercent >= neutralPercent && positivePercent >= negativePercent) {
      return { text: 'Positive', color: 'text-green-500' };
    }
    if (negativePercent >= positivePercent && negativePercent >= neutralPercent) {
      return { text: 'Negative', color: 'text-red-500' };
    }
    return { text: 'Neutral', color: 'text-yellow-500' };
  };

  const dominant = getDominantSentiment();

  // Handle mouse move events on the SVG
  const handleMouseMove = (e) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      // Calculate mouse position relative to SVG viewBox (0-100)
      const x = ((e.clientX - svgRect.left) / svgRect.width) * 100;
      const y = ((e.clientY - svgRect.top) / svgRect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  // Function to check if a point is inside a segment
  const isPointInSegment = (x, y, segment) => {
    // Center of the chart
    const centerX = 50;
    const centerY = 50;
    
    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if within donut ring radius bounds (25-45)
    if (distance < 25 || distance > 45) return false;
    
    // Calculate angle in degrees (0-360)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90) % 360; // Adjust for SVG coordinate system
    if (angle < 0) angle += 360;
    
    // Check if angle is within segment bounds
    return angle >= segment.startAngle && angle <= segment.endAngle;
  };

  // Effect to detect which segment the mouse is over
  useEffect(() => {
    if (svgRef.current) {
      const handleSegmentDetection = () => {
        // Find which segment contains the current mouse position
        const hoveredSegmentId = segments.find(segment => 
          isPointInSegment(mousePosition.x, mousePosition.y, segment)
        )?.id;
        
        if (hoveredSegmentId !== hoveredSegment) {
          setHoveredSegment(hoveredSegmentId || null);
        }
      };
      
      handleSegmentDetection();
    }
  }, [mousePosition, segments]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const donutVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren"
      }
    }
  };

  const segmentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: (segment) => ({ 
      scale: 1.05,
      rotate: segment.midAngle > 180 ? -2 : 2, // Slight rotation based on position
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const pulseVariants = {
    initial: { opacity: 0.2, scale: 0.95 },
    animate: { 
      opacity: [0.2, 0.6, 0.2], 
      scale: [0.95, 1.02, 0.95],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Get the hovered segment data
  const hoveredSegmentData = hoveredSegment 
    ? segments.find(segment => segment.id === hoveredSegment) 
    : null;

  return (
    <div className="w-full px-4 py-6 bg-[#120822]/80 backdrop-blur-sm rounded-xl border border-[#9c4dff]/30 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c840eb]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Sentiment Analysis
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center justify-center gap-8 px-4"
      >
        {/* Donut Chart */}
        <div className="relative w-60 h-60">
          {/* Inner circle (white space) */}
          <div className="absolute inset-0 rounded-full bg-[#120822] z-20 m-14"></div>
          
          <motion.svg 
            ref={svgRef}
            className="absolute inset-0 w-full h-full cursor-pointer" 
            viewBox="0 0 100 100"
            variants={donutVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {/* Gradient definitions */}
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(156, 77, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(156, 77, 255, 0)" />
              </radialGradient>
              
              {segments.map((segment) => (
                segment.percent > 0 && (
                  <React.Fragment key={`filters-${segment.id}`}>
                    <filter id={`glow-${segment.id}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feFlood floodColor={segment.color} result="color" />
                      <feComposite in="color" in2="blur" operator="in" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    
                    <linearGradient id={`gradient-${segment.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={segment.color} />
                      <stop offset="100%" stopColor={segment.hoverColor} />
                    </linearGradient>
                  </React.Fragment>
                )
              ))}
            </defs>
            
            {/* Glowing center effect */}
            <motion.circle 
              cx="50" 
              cy="50" 
              r="20" 
              fill="url(#centerGlow)"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            />
            
            {segments.map((segment, index) => (
              segment.percent > 0 && (
                <motion.g 
                  key={segment.id}
                  custom={segment}
                  variants={segmentVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  {/* Main segment path */}
                  <motion.path
                    d={createSegmentPath(segment.startAngle, segment.endAngle, 25, 45)}
                    fill={hoveredSegment === segment.id 
                      ? `url(#gradient-${segment.id})` 
                      : segment.color}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1 
                    }}
                    style={{
                      filter: hoveredSegment === segment.id ? `url(#glow-${segment.id})` : 'none',
                      transformOrigin: '50px 50px',
                    }}
                    animate={{
                      scale: hoveredSegment === segment.id ? 1.05 : 1,
                      rotate: hoveredSegment === segment.id 
                        ? segment.midAngle > 180 ? -2 : 2 
                        : 0
                    }}
                  />

                  {/* Animated outer glow when hovered */}
                  {hoveredSegment === segment.id && (
                    <motion.path
                      d={createSegmentPath(segment.startAngle, segment.endAngle, 24, 46)}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="0.5"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.7, 0], 
                        strokeWidth: [0.5, 2, 0.5],
                        filter: `drop-shadow(0 0 3px ${segment.color})`
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  
                  {/* Floating label that follows mouse cursor when segment is hovered */}
                  <AnimatePresence>
                    {hoveredSegment === segment.id && (
                      <motion.g
                        key={`label-${segment.id}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30 
                        }}
                      >
                        {/* Label background with pulsing effect */}
                        <motion.circle 
                          cx={mousePosition.x} 
                          cy={mousePosition.y} 
                          r="10" 
                          fill={segment.color}
                          animate={{
                            r: [10, 12, 10],
                            opacity: [0.9, 1, 0.9]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="drop-shadow-xl"
                        />
                        
                        {/* Percentage text */}
                        <text 
                          x={mousePosition.x} 
                          y={mousePosition.y} 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          fill="#ffffff" 
                          fontSize="10"
                          fontWeight="bold"
                          style={{
                            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          {segment.percentStr}
                        </text>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </motion.g>
              )
            ))}
          </motion.svg>
          
          {/* Center content */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-30"
            variants={contentVariants}
          >
            <AnimatePresence mode="wait">
              {hoveredSegment ? (
                <motion.div 
                  key="hovered-content"
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`text-xl font-bold mb-1 ${
                    hoveredSegment === 'positive' ? 'text-green-500' :
                    hoveredSegment === 'negative' ? 'text-red-500' : 
                    'text-yellow-500'
                  }`}>
                    {hoveredSegmentData?.percentStr}
                  </div>
                  <div className="text-sm text-gray-400">{hoveredSegment}</div>
                </motion.div>
              ) : (
                <motion.div 
                  key="default-content"
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`text-xl font-bold mb-1 ${dominant.color}`}>
                    {dominant.text}
                  </div>
                  <div className="text-sm text-gray-400">Sentiment</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Legend and percentages */}
        <div className="space-y-5 w-full max-w-xs">
          {segments.map((segment) => (
            segment.percent > 0 && (
              <motion.div 
                key={segment.id}
                className={`flex items-center space-x-4 bg-[#1a0b2e]/60 p-3 rounded-lg border ${
                  hoveredSegment === segment.id 
                    ? 'border-[#9c4dff]/50 shadow-lg shadow-[#9c4dff]/10' 
                    : 'border-[#9c4dff]/10'
                } hover:border-[#9c4dff]/30 transition-all duration-300`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  scale: hoveredSegment === segment.id ? 1.05 : 1,
                  boxShadow: hoveredSegment === segment.id 
                    ? `0 0 15px 2px ${segment.glowColor}` 
                    : 'none'
                }}
                transition={{ 
                  delay: 0.6 + (segments.indexOf(segment) * 0.1), 
                  duration: 0.5,
                  scale: {
                    duration: 0.2
                  }
                }}
                onMouseEnter={() => setHoveredSegment(segment.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className="w-6 h-6 rounded-full shadow-lg flex-shrink-0"
                  style={{
                    background: hoveredSegment === segment.id 
                      ? `linear-gradient(135deg, ${segment.color}, ${segment.hoverColor})` 
                      : segment.color,
                    boxShadow: `0 0 10px ${segment.glowColor}`,
                    transform: hoveredSegment === segment.id ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.2s ease-out, background 0.3s ease'
                  }}
                >
                  {/* Pulsing effect for the active segment indicator */}
                  {hoveredSegment === segment.id && (
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      style={{ background: `${segment.color}50` }}
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.7, 0, 0.7]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
                <div className="text-gray-300 flex-1 font-medium">{segment.id.charAt(0).toUpperCase() + segment.id.slice(1)}</div>
                <div 
                  className="font-bold text-lg"
                  style={{
                    color: segment.color,
                    textShadow: hoveredSegment === segment.id 
                      ? `0 0 8px ${segment.glowColor}` 
                      : 'none'
                  }}
                >
                  {segment.percentStr}
                </div>
              </motion.div>
            )
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SentimentDonutChart; 