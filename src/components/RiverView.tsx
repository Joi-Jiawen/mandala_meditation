import React from 'react';
import { motion } from 'motion/react';
import { AudioToggle } from './AudioToggle';
import imgImage61 from "figma:asset/73a48179bd1fa9cc566cb1c91f3a9199dc51f8ff.png";

interface RiverViewProps {
  onReturnHome: () => void;
  journalEntries: Record<string, string>;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

export function RiverView({ onReturnHome, audioEnabled, setAudioEnabled }: RiverViewProps) {

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Audio Toggle */}
      <AudioToggle 
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      {/* Lake Sunset Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${imgImage61}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Subtle Floating Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Small moving particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              x: [-20, typeof window !== 'undefined' ? window.innerWidth + 20 : 1200],
              y: [0, Math.sin(i) * 30],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            style={{
              top: `${60 + Math.random() * 40}%`,
            }}
          />
        ))}
        
        {/* Golden particles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`golden-${i}`}
            className="absolute w-2 h-2 bg-yellow-400/40 rounded-full"
            animate={{
              x: [-30, typeof window !== 'undefined' ? window.innerWidth + 30 : 1230],
              y: [Math.sin(i * 2) * 20, Math.sin(i * 2 + Math.PI) * 20],
              opacity: [0, 0.5, 0.5, 0],
              scale: [0.5, 1, 0.8, 0.5],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              delay: i * 4,
              ease: "easeInOut"
            }}
            style={{
              top: `${65 + Math.random() * 30}%`,
            }}
          />
        ))}
      </div>

      {/* Subtle stars in the evening sky */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/50 rounded-full"
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut"
          }}
          style={{
            top: `${15 + Math.random() * 35}%`,
            left: `${25 + Math.random() * 50}%`,
          }}
        />
      ))}

      {/* Peaceful message in the center */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center space-y-6 max-w-2xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-3xl md:text-4xl text-white drop-shadow-lg"
          >
            River of Compassion
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl text-white/90 drop-shadow-md leading-relaxed"
          >
            The mandala dissolves into the flowing water, carrying your intentions of love and kindness to all beings throughout the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-base text-white/80 drop-shadow-md italic"
          >
            "May all beings be happy. May all beings be free from suffering."
          </motion.div>
        </motion.div>
      </div>

      {/* Gentle water sound visualization */}
      <motion.div
        className="absolute bottom-8 left-8 z-20 flex space-x-1"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-blue-300/60 rounded-full"
            animate={{ height: [6, 16, 6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}