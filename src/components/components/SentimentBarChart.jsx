import React from 'react';
import { motion } from 'framer-motion';

const SentimentBarChart = ({ sentimentData = { positive: '60%', negative: '20%', neutral: '20%' } }) => {
  // Convert percentage strings to numbers
  const extractPercentage = (percentStr) => {
    return parseInt(percentStr?.replace('%', '') || 0);
  };

  const positivePercent = extractPercentage(sentimentData.positive);
  const negativePercent = extractPercentage(sentimentData.negative);
  const neutralPercent = extractPercentage(sentimentData.neutral);

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

  const barVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: height => ({
      height: `${height}%`,
      opacity: 1,
      transition: {
        height: {
          duration: 0.8,
          ease: [0.33, 1, 0.68, 1] // Custom cubic-bezier for springy effect
        },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="w-full px-2 pt-6 pb-8 bg-[#1a0b2e]/60 backdrop-blur-sm rounded-xl border border-[#9c4dff]/20 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c840eb]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Sentiment Analysis
      </h3>

      <div className="flex flex-row justify-center items-end h-52 mb-6 px-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-around items-end w-full max-w-md gap-4 px-4"
        >
          {/* Positive Bar */}
          <div className="flex flex-col items-center w-full">
            <motion.div
              custom={positivePercent}
              variants={barVariants}
              className="w-full bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg relative overflow-hidden"
              style={{ maxHeight: '100%' }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-400/20 to-green-500/60 blur-sm"></div>
              
              {/* Percentage Badge */}
              <div className="absolute top-2 left-0 right-0 flex justify-center">
                <div className="bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                  {sentimentData.positive}
                </div>
              </div>
              
              {/* Shimmering Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 skew-y-12"
                animate={{
                  y: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 2,
                  ease: 'linear',
                }}
              ></motion.div>
            </motion.div>
            <div className="mt-3 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#1a0b2e] flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-center text-sm font-medium text-green-400">Positive</span>
            </div>
          </div>

          {/* Neutral Bar */}
          <div className="flex flex-col items-center w-full">
            <motion.div
              custom={neutralPercent}
              variants={barVariants}
              className="w-full bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg relative overflow-hidden"
              style={{ maxHeight: '100%' }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-yellow-500/60 blur-sm"></div>
              
              {/* Percentage Badge */}
              <div className="absolute top-2 left-0 right-0 flex justify-center">
                <div className="bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                  {sentimentData.neutral}
                </div>
              </div>
              
              {/* Shimmering Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 skew-y-12"
                animate={{
                  y: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 2,
                  ease: 'linear',
                  delay: 0.3,
                }}
              ></motion.div>
            </motion.div>
            <div className="mt-3 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#1a0b2e] flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.707 5.293a1 1 0 011.414 0L12 13.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-center text-sm font-medium text-yellow-400">Neutral</span>
            </div>
          </div>

          {/* Negative Bar */}
          <div className="flex flex-col items-center w-full">
            <motion.div
              custom={negativePercent}
              variants={barVariants}
              className="w-full bg-gradient-to-t from-red-400 to-red-500 rounded-t-lg relative overflow-hidden"
              style={{ maxHeight: '100%' }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-400/20 to-red-500/60 blur-sm"></div>
              
              {/* Percentage Badge */}
              <div className="absolute top-2 left-0 right-0 flex justify-center">
                <div className="bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                  {sentimentData.negative}
                </div>
              </div>
              
              {/* Shimmering Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 skew-y-12"
                animate={{
                  y: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 2,
                  ease: 'linear',
                  delay: 0.6,
                }}
              ></motion.div>
            </motion.div>
            <div className="mt-3 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#1a0b2e] flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-4.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L12 13.586l-1.293-1.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-center text-sm font-medium text-red-400">Negative</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid lines for reference */}
      <div className="relative h-[1px] w-full max-w-md mx-auto mb-1">
        <div className="absolute inset-0 bg-gray-700/30"></div>
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#1a0b2e] px-1 text-xs text-gray-500">0%</div>
        <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#1a0b2e] px-1 text-xs text-gray-500">100%</div>
      </div>
    </div>
  );
};

export default SentimentBarChart; 