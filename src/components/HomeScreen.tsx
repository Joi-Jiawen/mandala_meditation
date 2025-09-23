import React from 'react';
import { motion } from 'motion/react';
import { Play, Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  onBeginJourney: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  onGlowTest?: () => void;
}

export function HomeScreen({ onBeginJourney, audioEnabled, setAudioEnabled, onGlowTest }: HomeScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1727061949575-2007109d3cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3R1cyUyMGZsb3dlciUyMG1lZGl0YXRpb24lMjBzdW5yaXNlfGVufDF8fHx8MTc1ODMzNzI4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Peaceful lotus at sunrise"
          className="w-screen h-screen object-cover fixed inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
      </div>

      {/* Pulsating Lotus Animation */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-radial from-amber-200/20 via-transparent to-transparent" />
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/40 rounded-full"
          animate={{
            y: [-20, -100],
            x: [0, Math.sin(i) * 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut"
          }}
          style={{
            left: `${20 + i * 10}%`,
            bottom: '10%',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-20 text-center space-y-8 px-6">
        {/* App Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl text-white drop-shadow-lg">
            Mandala Meditation
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md max-w-md mx-auto">
            A journey of loving-kindness through mindful creation
          </p>
        </motion.div>

        {/* Begin Journey Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onBeginJourney}
            size="lg"
            className="bg-white/90 text-slate-800 hover:bg-white hover:text-slate-900 backdrop-blur-sm px-8 py-4 text-lg rounded-full shadow-lg transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Journey
          </Button>
        </motion.div>


      </div>

      {/* Settings Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute top-6 right-6 z-30 flex items-center space-x-3"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
        >
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGlowTest}
          className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
          title="查看光圈大小"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Gentle Breathing Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-3 h-3 bg-white/60 rounded-full" />
      </motion.div>
    </div>
  );
}