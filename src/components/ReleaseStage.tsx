import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Download, Star, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { MandalaLayer } from '../App';
import { MandalaRenderer, parseMandalaData, downloadMandala, type MandalaData } from './shared/MandalaRenderer';
import imgImage61 from "figma:asset/73a48179bd1fa9cc566cb1c91f3a9199dc51f8ff.png";

interface ReleaseStageProps {
  mandalaLayers: MandalaLayer[];
  completeMandalaData?: MandalaData | null;
  onComplete: () => void;
  onReturnHome?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
}

export function ReleaseStage({ mandalaLayers, completeMandalaData, onComplete, onReturnHome }: ReleaseStageProps) {
  const [isReleasing, setIsReleasing] = useState(false);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mandalaOpacity, setMandalaOpacity] = useState(1);

  // 使用存储的完整曼陀罗数据或实时解析
  const mandalaData = useMemo(() => {
    if (completeMandalaData) {
      console.log('🌊 Using stored complete mandala data for release');
      return completeMandalaData;
    }
    console.log('🌊 Parsing mandala data for release');
    return parseMandalaData(mandalaLayers);
  }, [completeMandalaData, mandalaLayers]);

  // Responsive mandala size
  const mandalaSize = typeof window !== 'undefined' ? 
    Math.min(500, window.innerWidth * 0.6, window.innerHeight * 0.4) : 400;

  useEffect(() => {
    if (!isReleasing) return;

    const { allHills } = mandalaData;
    
    // Calculate screen positions for all hills
    if (allHills.length > 0) {
      // Calculate screen positions relative to the component
      const componentRect = { x: window.innerWidth / 2 - mandalaSize/2, y: window.innerHeight / 2 - mandalaSize/2 };
      
      allHills.forEach((hill: any) => {
        hill.screenPosition = {
          x: componentRect.x + Math.random() * mandalaSize,
          y: componentRect.y + Math.random() * mandalaSize
        };
      });
    }

    let particleId = 0;
    const interval = setInterval(() => {
      const newParticles: Particle[] = [];
      
      // Generate particles from actual hill positions
      const hillsWithScreenPos = allHills.filter((hill: any) => hill.screenPosition);
      for (let i = 0; i < Math.min(12, hillsWithScreenPos.length); i++) {
        const hill = hillsWithScreenPos[Math.floor(Math.random() * hillsWithScreenPos.length)] as any;
        // Create multiple particles per hill
        for (let j = 0; j < 2; j++) {
          newParticles.push({
            id: particleId++,
            x: hill.screenPosition.x + (Math.random() - 0.5) * 10,
            y: hill.screenPosition.y + (Math.random() - 0.5) * 10,
            color: hill.color || hill.layerColor || '#3b82f6',
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 3 + 2,
            life: 1
          });
        }
      }

      setParticles(prev => {
        const updated = [...prev, ...newParticles]
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.015,
            vy: p.vy + 0.1
          }))
          .filter(p => p.life > 0 && p.y < window.innerHeight + 100);
        
        return updated;
      });

      // Fade out mandala
      setMandalaOpacity(prev => Math.max(0, prev - 0.025));
    }, 60);

    // Show completion card after 6 seconds
    const completeTimer = setTimeout(() => {
      clearInterval(interval);
      setShowCompletionCard(true);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [isReleasing, mandalaData, mandalaSize]);

  const handleRelease = () => {
    setIsReleasing(true);
    console.log('🎵 Gentle whoosh sound as mandala dissolves');
  };

  const handleDownload = () => {
    downloadMandala(mandalaData, 'mandala-of-compassion.png');
  };

  const handleCardContinue = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Lake Sunset Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${imgImage61}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {!isReleasing ? (
            <motion.div
              key="release-interface"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center space-y-8 max-w-4xl w-full"
            >
              {/* Title */}
              <motion.h2 
                className="text-3xl md:text-4xl text-white drop-shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Release the Mandala
              </motion.h2>
              
              {/* Instruction Text - Moved under title */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90 drop-shadow-md leading-relaxed max-w-2xl mx-auto"
              >
                When you are ready, let the mandala go. Release it to the river, trusting that 
                the love you've put into it will flow to all beings.
              </motion.p>

              {/* Mandala with Frame */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="relative">
                  {/* Simple Frame */}
                  <div 
                    className="relative bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-3 shadow-2xl"
                    style={{
                      width: mandalaSize + 24,
                      height: mandalaSize + 24
                    }}
                  >
                    {/* Mandala using unified renderer without breathing light */}
                    <div className="relative">
                      <MandalaRenderer
                        mandalaData={mandalaData}
                        viewSize={mandalaSize}
                        padding={15}
                        animate={false}
                        style={{
                          opacity: mandalaOpacity,
                          width: `${mandalaSize}px`,
                          height: `${mandalaSize}px`
                        }}
                      />
                    </div>
                    
                    {/* Download Button - Bottom Right Corner - Icon Only */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="absolute bottom-2 right-2"
                    >
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="bg-white/20 text-white/90 border-white/40 hover:bg-white/30 hover:text-white backdrop-blur-sm rounded-full p-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Release Button - Primary Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="pt-4"
              >
                <Button
                  onClick={handleRelease}
                  size="lg"
                  className="mobile-interactive px-12 py-4 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                >
                  <Waves className="w-5 h-5 mr-3" />
                  Let it go
                </Button>
              </motion.div>
            </motion.div>
          ) : !showCompletionCard ? (
            <motion.div
              key="releasing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              {/* Instruction above mandala */}
              <motion.p
                className="text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Everything changes, and that's okay. By letting go, we make room in our heart for new compassion.
              </motion.p>

              {/* Mandala dissolution WITHOUT frame during letting go */}
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    style={{ opacity: mandalaOpacity }}
                    animate={isReleasing ? {
                      scale: [1, 1.1, 0.8],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={isReleasing ? 
                      { duration: 2, ease: "easeInOut" } : 
                      {}
                    }
                  >
                    <MandalaRenderer
                      mandalaData={mandalaData}
                      viewSize={mandalaSize}
                      padding={15}
                      animate={false}
                      style={{
                        width: `${mandalaSize}px`,
                        height: `${mandalaSize}px`
                      }}
                    />
                  </motion.div>
                  
                  {/* Release glow effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-radial from-blue-200/20 via-purple-100/10 to-transparent rounded-full"
                    animate={{
                      opacity: [0.4, 0.8, 0],
                      scale: [0.9, 1.2, 1.5],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Enhanced Completion Card */}
      <AnimatePresence>
        {showCompletionCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
            className="absolute inset-0 z-20 flex items-center justify-center p-6"
          >
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-10 text-center space-y-8 shadow-2xl max-w-2xl w-full mx-4 sm:mx-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-3xl text-foreground">Mandala of Compassion</h3>
                <p className="text-xl text-muted-foreground">
                  Journey Complete
                </p>
              </motion.div>
              
              <motion.p 
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "Well done. As the river carries away the mandala, it carries your kindness to the vast world. Take a moment to rest in this feeling of peace and connection."
              </motion.p>
              
              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="pt-4"
              >
                <Button
                  onClick={handleCardContinue}
                  size="lg"
                  className="mobile-interactive bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-full shadow-xl transition-all duration-300"
                >
                  <Home className="w-5 h-5 mr-3" />
                  Return Home
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: particle.x,
              top: particle.y,
              opacity: particle.life
            }}
            animate={{
              scale: [1, 0.5],
              opacity: [particle.life, 0]
            }}
            transition={{ duration: 2 }}
          />
        ))}
      </div>

      {/* Water Wave Dots */}
      <div className="absolute inset-0 z-5 pointer-events-none">
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
          key={`star-${i}`}
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

      {/* Sound Visualization */}
      <motion.div
        className="absolute top-8 right-8 z-10 flex space-x-1"
        animate={{ opacity: isReleasing ? [0.5, 1, 0.5] : 0.3 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-blue-400 rounded-full"
            animate={{ 
              height: isReleasing ? [8, 20, 8] : [8, 12, 8]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}