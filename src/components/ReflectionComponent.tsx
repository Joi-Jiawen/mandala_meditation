import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import type { MandalaLayer } from '../App';
import { MandalaRenderer, parseMandalaData, type MandalaData } from './shared/MandalaRenderer';
import imgImage50 from "figma:asset/8c726540e6da8df0912ce3b1ea7095fd7f970a4b.png";

interface ReflectionComponentProps {
  title: string;
  prompt: string;
  affirmation: string;
  mandalaLayers: MandalaLayer[];
  completeMandalaData?: MandalaData | null;
  onComplete: () => void;
  onJournalEntry: (entry: string) => void;
}

export function ReflectionComponent({
  title,
  prompt,
  affirmation,
  mandalaLayers,
  completeMandalaData,
  onComplete,
  onJournalEntry
}: ReflectionComponentProps) {
  const [showCard, setShowCard] = useState(false);
  const [breathingCycle, setBreathingCycle] = useState(0);

  // 使用存储的完整曼陀罗数据或实时解析
  const mandalaData = useMemo(() => {
    if (completeMandalaData) {
      console.log('🎨 Using stored complete mandala data');
      return completeMandalaData;
    }
    console.log('🎨 Parsing mandala data for reflection');
    return parseMandalaData(mandalaLayers);
  }, [completeMandalaData, mandalaLayers]);

  useEffect(() => {
    // Count breathing cycles (每8秒一个呼吸周期，5个周期约40秒)
    const breathingTimer = setInterval(() => {
      setBreathingCycle(prev => prev + 1);
    }, 8000);

    // 5个呼吸周期后显示卡片
    const cardTimer = setTimeout(() => {
      setShowCard(true);
    }, 40000);

    return () => {
      clearInterval(breathingTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Figma Sky Background */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${imgImage50}')` }}
      />
      
      {/* Black Overlay for Readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Enhanced Ambient Particles - 更大更多 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/50 rounded-full"
          animate={{
            y: [-10, -120],
            x: [0, Math.sin(i) * 40],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut"
          }}
          style={{
            left: `${5 + i * 7.5}%`,
            bottom: '8%',
          }}
        />
      ))}
      
      {/* Medium floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`medium-${i}`}
          className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
          animate={{
            y: [-5, -140],
            x: [0, Math.cos(i * 0.8) * 60],
            opacity: [0, 0.9, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 2.5 + 3,
            ease: "easeOut"
          }}
          style={{
            left: `${8 + i * 9}%`,
            bottom: '3%',
          }}
        />
      ))}
      
      {/* Large floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`large-${i}`}
          className="absolute w-3 h-3 bg-white/30 rounded-full"
          animate={{
            y: [-8, -160],
            x: [0, Math.sin(i * 1.2) * 80],
            opacity: [0, 0.7, 0],
            rotate: [0, 360],
            scale: [0.3, 1.5, 0.3],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            delay: i * 4 + 6,
            ease: "easeOut"
          }}
          style={{
            left: `${12 + i * 13}%`,
            bottom: '1%',
          }}
        />
      ))}
      
      {/* Golden accent particles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`golden-${i}`}
          className="absolute w-2.5 h-2.5 bg-yellow-300/40 rounded-full"
          animate={{
            y: [-12, -180],
            x: [0, Math.cos(i * 1.5) * 70],
            opacity: [0, 0.8, 0],
            scale: [0.4, 1.3, 0.4],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            delay: i * 5 + 8,
            ease: "easeOut"
          }}
          style={{
            left: `${20 + i * 20}%`,
            bottom: '0%',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 size-full flex flex-col items-center px-4">
        {/* Title - Matching DrawingStage spacing */}
        <div className="flex justify-center items-start pt-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl text-white text-center mb-4"
          >
            {title}
          </motion.h2>
        </div>

        {/* Meditation Instruction - Above Mandala, smaller text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center max-w-4xl mb-6"
        >
          <p className="text-base md:text-lg text-white/90 leading-relaxed">
            {prompt}
          </p>
        </motion.div>

        {/* Large Mandala Preview using unified renderer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center flex-1 items-center relative"
        >
          <div className="relative">
            <MandalaRenderer
              mandalaData={mandalaData}
              viewSize={800}
              padding={80}
              animate={!showCard}
              className="w-[800px] h-[800px]"
            />
            
            {/* Enhanced CSS-based breathing light system - Reflection special mode */}
            {!showCard && (
              <div className="mandala-breathing-light stage-reflection">
                <div className="breathing-glow-core"></div>
                <div className="breathing-glow-inner"></div>
                <div className="breathing-glow-middle"></div>
                <div className="breathing-glow-outer"></div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Breathing cycle indicator - Below mandala */}
        {!showCard && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i < breathingCycle ? 'bg-white/80 scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/50">
              {breathingCycle < 5 ? `Breath ${breathingCycle + 1} of 5` : 'Complete'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Completion Card - Appears after 5 breathing cycles - Centered */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center p-6"
          >
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl max-w-lg w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mx-auto flex items-center justify-center mb-3 text-2xl"
              >
                ✨
              </motion.div>
              
              <motion.h3
                className="text-2xl text-white drop-shadow-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Beautiful Work
              </motion.h3>
              
              <motion.p
                className="text-base text-white/90 drop-shadow-md leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                In traditional mandala practice, once the mandala is complete, it is released – 
                the sand is brushed into a jar and poured into a river, to symbolize the impermanence 
                of all things and to spread the mandala's blessings to the world.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-white/90 text-slate-800 hover:bg-white hover:text-slate-900 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg"
                >
                  Continue Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Audio Visualization */}
      <motion.div
        className="absolute bottom-6 left-6 z-10 flex space-x-1"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/40 rounded-full"
            animate={{ height: [6, 12, 6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}