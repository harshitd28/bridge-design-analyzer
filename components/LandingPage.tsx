'use client'

import { motion } from 'framer-motion'

interface LandingPageProps {
  onEnter: () => void
}

export default function LandingPage({ onEnter }: LandingPageProps) {

  return (
    <motion.div 
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image - More Visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/LandingPage.jpeg)',
        }}
      />
      
      {/* Light Overlay for text readability - Much lighter */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Main Title - No Glow */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-center mb-6 text-white"
        >
          Bridge Design Analyzer
        </motion.h1>

        {/* Subtitle - No Glow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl text-center mb-12 max-w-3xl font-light text-white/90"
        >
          IT-based tool to redesign bridge structures based on geomorphic conditions
          <br />
          <span className="text-lg mt-2 inline-block">
            Especially optimized for hilly terrain
          </span>
        </motion.p>

        {/* Simple Enter Button - No Glow */}
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="px-12 py-6 text-xl font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all border border-white/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Dive In
        </motion.button>
      </div>
    </motion.div>
  )
}

