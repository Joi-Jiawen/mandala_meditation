import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface PreparationStageProps {
  title?: string;
  subtitle?: string;
  initialText?: string;
  prompt?: string;
  note?: string;
  onComplete: () => void;
}

export function PreparationStage({ 
  title = "Preparation",
  subtitle = "Beginning Your Journey",
  initialText = "Find a comfortable position. Take a few deep breaths.",
  prompt = "Recall warm feelings of kindness for yourself – you deserve your own love.",
  note = "Let these feelings fill your heart as you prepare to create.",
  onComplete 
}: PreparationStageProps) {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [showInitialText, setShowInitialText] = useState(true);

  // Get background gradient based on stage
  const getBackgroundGradient = () => {
    switch (subtitle) {
      case "Beginning Your Journey":
        return "from-yellow-900 via-amber-900 to-blue-900"; // Self-compassion - 淡黄蓝色调，深邃
      case "Expanding Your Heart": 
        return "from-rose-900 via-pink-900 to-red-900"; // Loved one
      case "Opening to Others":
        return "from-blue-900 via-cyan-900 to-teal-900"; // Neutral person
      case "Transforming Difficulty":
        return "from-blue-900 via-teal-900 to-green-900"; // Difficult person - 深蓝绿色调
      case "Universal Embrace":
        return "from-amber-900 via-red-900 to-orange-900"; // Universal - Warm terracotta/brown
      default:
        return "from-indigo-900 via-purple-900 to-blue-900";
    }
  };

  useEffect(() => {
    // Transition from initial text to prompt after 6 seconds
    const textTimer = setTimeout(() => {
      setShowInitialText(false);
    }, 6000);

    return () => clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    const breathingCycle = () => {
      // Inhale for 3 seconds
      setBreathingPhase('inhale');
      setTimeout(() => {
        // Hold for 1 second
        setBreathingPhase('hold');
        setTimeout(() => {
          // Exhale for 4 seconds
          setBreathingPhase('exhale');
          setTimeout(() => {
            setBreathCount(prev => prev + 1);
          }, 4000);
        }, 1000);
      }, 3000);
    };

    const interval = setInterval(breathingCycle, 8000); // Complete cycle every 8 seconds
    breathingCycle(); // Start immediately

    // Show continue button 6 seconds after text transitions (12 seconds total)
    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(continueTimer);
    };
  }, []);

  const getBreathingInstructions = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold gently...';
      case 'exhale':
        return 'Breathe out and release...';
    }
  };

  const getCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 1.3;
      case 'hold':
        return 1.3;
      case 'exhale':
        return 0.8;
    }
  };

  const getAnimationDuration = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 3;
      case 'hold':
        return 1;
      case 'exhale':
        return 4;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Calming Background */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br ${getBackgroundGradient()}`}>
        {/* Floating Lotus Petals or Universal Particles */}
        {subtitle === "Universal Embrace" ? (
          <>
            {/* More Universal Floating Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                animate={{
                  y: [-20, -300],
                  x: [0, Math.sin(i * 0.3) * 150],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 12 + Math.random() * 8,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
                style={{
                  left: `${5 + i * 4.5}%`,
                  bottom: '-10%',
                }}
              />
            ))}
            
            {/* Larger Stardust Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-2 h-2 bg-white/40 rounded-full"
                animate={{
                  y: [-30, -400],
                  x: [0, Math.cos(i * 0.7) * 200],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 20 + Math.random() * 10,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${10 + i * 6.5}%`,
                  bottom: '-20%',
                }}
              />
            ))}
          </>
        ) : (
          /* Regular Floating Lotus Petals for other stages */
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-6 bg-white/10 rounded-full"
              animate={{
                y: [-20, -200],
                x: [0, Math.sin(i * 0.5) * 100],
                rotate: [0, 360],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeOut"
              }}
              style={{
                left: `${10 + i * 10}%`,
                bottom: '-10%',
              }}
            />
          ))
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 px-6 max-w-2xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <h2 className="text-3xl text-white">
            {title}
          </h2>
          
          {/* Transitioning Text */}
          <div className="min-h-[4rem] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {showInitialText ? (
                <motion.p
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-lg text-white/80 leading-relaxed"
                >
                  {initialText}
                </motion.p>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-2"
                >
                  <p className="text-lg text-white/80 leading-relaxed">
                    {prompt}
                  </p>
                  <p className="text-white/60 text-sm">
                    {note}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Breathing Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              className="w-48 h-48 border-2 border-white/30 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {/* Inner Breathing Circle */}
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center"
                animate={{ scale: getCircleScale() }}
                transition={{ 
                  duration: getAnimationDuration(),
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-white/30 rounded-full"
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: getAnimationDuration(),
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-white/20 rounded-full"
              animate={{ 
                scale: [1, 1.5],
                opacity: [0.5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </div>

          {/* Breathing Instructions */}
          <motion.p
            className="text-xl text-white/90 min-h-[2rem]"
            key={breathingPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getBreathingInstructions()}
          </motion.p>
        </motion.div>



        {/* Breath Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-white/50 text-sm"
        >
          Breath cycle: {breathCount + 1}
        </motion.div>
      </div>

      {/* Continue Button */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-8 z-20"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="bg-white/90 text-slate-800 hover:bg-white hover:text-slate-900 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
            >
              {subtitle === "Beginning Your Journey" 
                ? "Begin Creating with Love"
                : "I'm Ready"
              }
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}