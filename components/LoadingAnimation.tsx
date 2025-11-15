'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingAnimation() {
  const [stage, setStage] = useState(0)
  const [stars, setStars] = useState<Array<{ left: number; top: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate star positions on client side only to avoid SSR mismatch
    setStars(
      Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 50,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      }))
    )

    const stages = [
      { delay: 0, text: 'Loading Mountains...' },
      { delay: 500, text: 'Loading Terrain...' },
      { delay: 1000, text: 'Initializing Globe...' },
    ]

    stages.forEach(({ delay, text }, index) => {
      setTimeout(() => {
        setStage(index)
      }, delay)
    })
  }, [])

  const mountains = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="relative w-full h-full overflow-hidden">
        {/* Animated Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          {mountains.map((i) => (
            <motion.div
              key={i}
              className="absolute bottom-0"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
              style={{
                left: `${i * 20}%`,
                width: '200px',
                height: `${150 + i * 30}px`,
                background: `linear-gradient(to top, 
                  ${['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'][i]} 0%,
                  ${['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'][i]} 100%)`,
                clipPath: `polygon(0% 100%, 50% ${30 + i * 10}%, 100% 100%)`,
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {['Loading Mountains...', 'Loading Terrain...', 'Initializing Globe...'][stage]}
          </motion.h1>
          <motion.div
            className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 256 }}
            transition={{ duration: 3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>

        {/* Animated Stars */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>
    </div>
  )
}

