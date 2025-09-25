import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AudioToggle } from './AudioToggle';
import imgImage57 from "figma:asset/75e278b027357d5ee0710e360591dffc0bb4b078.png";

interface IntroTutorialProps {
  onComplete: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

interface SandHill {
  x: number;
  y: number;
  size: number;
  color: string;
  pouring: boolean;
  symmetryPoints: Array<{ x: number; y: number }>;
}

export function IntroTutorial({ onComplete, audioEnabled, setAudioEnabled }: IntroTutorialProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [sandHills, setSandHills] = useState<SandHill[]>([]);
  const [isPouring, setIsPouring] = useState(false);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Constants for sand pouring
  const initialDotSize = 3;
  const growthRate = 0.05; // Much slower growth rate, like breathing circle
  const maxDotSize = 20;

  const scenes = [
    {
      title: "Welcome",
      text: "You are about to embark on a journey of compassion and creativity.",
      narration: "In traditional Buddhist culture, wise ones create mandalas as a way to share love and blessings with the world. Today, you'll create your own mandala of kindness."
    },
    {
      title: "How It Works",
      text: "You'll draw your mandala step by step. Use your finger to pour sand, each touch will mirror around the circle, forming a beautiful symmetrical pattern with ease.",
      narration: "This experience is inspired by traditional mandalas made with colored sand. You'll feel the calm flow of sand as you create. Breathe and enjoy the peaceful process."
    },
    {
      title: "Try It Now",
      text: "Try pouring sand now with your finger. Watch how it creates a beautiful symmetric pattern.",
      narration: "There is no right or wrong in your drawing. Just an expression of yourself."
    }
  ];

  // Growth animation function
  const startGrowthAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = () => {
      setSandHills(prev => {
        let hasGrowingHills = false;
        const updatedHills = prev.map(hill => {
          if (hill.pouring && hill.size < maxDotSize) {
            hasGrowingHills = true;
            const newSize = Math.min(hill.size + growthRate, maxDotSize);
            return { ...hill, size: newSize };
          }
          return hill;
        });
        
        if (hasGrowingHills) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animationRef.current = null;
        }
        
        return updatedHills;
      });
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const startPouring = (e: React.TouchEvent | React.MouseEvent) => {
    if (isPouring) return;
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const point = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
    
    setIsPouring(true);
    
    // Calculate relative position from center
    const relX = point.x - centerX;
    const relY = point.y - centerY;
    const distance = Math.sqrt(relX * relX + relY * relY);
    const angle = Math.atan2(relY, relX);
    
    // Generate 7 symmetry points (8-fold symmetry total)
    const symmetryPoints: Array<{ x: number; y: number }> = [];
    for (let i = 1; i < 8; i++) {
      const newAngle = angle + (Math.PI / 4) * i;
      const newX = centerX + distance * Math.cos(newAngle);
      const newY = centerY + distance * Math.sin(newAngle);
      symmetryPoints.push({ x: newX, y: newY });
    }
    
    const hill: SandHill = {
      x: point.x,
      y: point.y,
      size: initialDotSize,
      color: 'white',
      pouring: true,
      symmetryPoints
    };
    
    setSandHills(prev => [...prev, hill]);
    startGrowthAnimation();
  };

  const stopPouring = useCallback(() => {
    setIsPouring(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setSandHills(prev => prev.map(hill => ({ ...hill, pouring: false })));
    
    console.log('🎵 Soft chime sound');
  }, []);

  // Monitor isPouring state and control animation
  useEffect(() => {
    if (!isPouring && animationRef.current) {
      setSandHills(prev => prev.map(hill => ({ ...hill, pouring: false })));
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isPouring]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Mandala Background Scene */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${imgImage57}')` }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Audio Toggle */}
      <AudioToggle 
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      {/* Floating Guide Orb */}
      <motion.div
        className="absolute top-20 left-20 z-20 w-4 h-4 bg-amber-300 rounded-full shadow-lg"
        animate={{
          y: [0, -10, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-amber-300 rounded-full animate-ping opacity-75" />
      </motion.div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-8">
        {/* Progress Indicator - Above Card */}
        <motion.div 
          className="flex space-x-2 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {scenes.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= currentScene ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            {/* Content Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center space-y-6">
              <motion.h2
                className="text-3xl text-white drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {scenes[currentScene].title}
              </motion.h2>

              <motion.p
                className="text-lg text-white/90 drop-shadow-md leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {scenes[currentScene].text}
              </motion.p>

              <motion.p
                className="text-base text-white/80 drop-shadow-md italic leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {scenes[currentScene].narration}
              </motion.p>

              {/* Practice Canvas for Scene 3 */}
              {currentScene === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mx-auto"
                >
                  <div 
                    ref={canvasRef}
                    className="relative w-64 h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-full border border-white/30 cursor-crosshair overflow-hidden"
                    onMouseDown={startPouring}
                    onMouseUp={stopPouring}
                    onMouseLeave={stopPouring}
                    onTouchStart={startPouring}
                    onTouchEnd={stopPouring}
                    onTouchCancel={stopPouring}
                  >
                    <svg className="w-full h-full pointer-events-none">
                      {/* Symmetry Guide Lines */}
                      <g className="opacity-30">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <line
                            key={i}
                            x1="50%"
                            y1="50%"
                            x2={`${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`}
                            y2={`${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`}
                            stroke="white"
                            strokeWidth="0.5"
                            opacity="0.3"
                          />
                        ))}
                      </g>
                      
                      {/* Sand Hills */}
                      {sandHills.map((hill, i) => (
                        <g key={i}>
                          {/* Main hill */}
                          <motion.circle
                            cx={hill.x}
                            cy={hill.y}
                            r={hill.size}
                            fill={hill.color}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Symmetry points */}
                          {hill.symmetryPoints.map((symPoint, j) => (
                            <motion.circle
                              key={j}
                              cx={symPoint.x}
                              cy={symPoint.y}
                              r={hill.size}
                              fill={hill.color}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ))}
                        </g>
                      ))}
                    </svg>
                    
                    {/* Center Point */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full pointer-events-none" />
                    
                    {/* Pouring indicator */}
                    {isPouring && (
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none animate-pulse bg-white/70"
                      />
                    )}
                  </div>
                  
                  <p className="text-sm text-white/70 mt-3">
                    Click and hold anywhere in the circle to pour sand and watch it grow!
                  </p>
                </motion.div>
              )}

              {/* Navigation Buttons - Inside Card */}
              <motion.div
                className="flex justify-between items-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {/* Skip Button - Left side */}
                <Button
                  onClick={onComplete}
                  variant="outline"
                  size="sm"
                  className="mobile-interactive bg-white/20 text-white/80 border-white/30 hover:bg-white/30 hover:text-white backdrop-blur-sm px-4 py-2 rounded-full relative z-50"
                >
                  Skip
                </Button>
                
                {/* Continue Button - Right side */}
                <Button
                  onClick={nextScene}
                  size="lg"
                  className="mobile-interactive bg-white/90 text-slate-800 hover:bg-white hover:text-slate-900 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg relative z-50"
                >
                  {currentScene === scenes.length - 1 ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Let's Begin
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}