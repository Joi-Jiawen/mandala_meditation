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
  const [showTitle, setShowTitle] = useState(false);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showBreathingCounter, setShowBreathingCounter] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 800 });

  // 使用存储的完整曼陀罗数据或实时解析
  const mandalaData = useMemo(() => {
    if (completeMandalaData) {
      console.log('🎨 Using stored complete mandala data');
      return completeMandalaData;
    }
    console.log('🎨 Parsing mandala data for reflection');
    return parseMandalaData(mandalaLayers);
  }, [completeMandalaData, mandalaLayers]);

  // Handle window resize for responsive mandala
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      updateWindowSize();
      window.addEventListener('resize', updateWindowSize);
      return () => window.removeEventListener('resize', updateWindowSize);
    }
  }, []);

  // Calculate responsive mandala size - 优化曼陀罗完整显示
  const mandalaSize = useMemo(() => {
    const availableWidth = windowSize.width;
    const availableHeight = windowSize.height;
    
    // 手机端和桌面端分别处理
    if (availableWidth < 768) { // 手机端
      // 手机端：顶部144px（增加间隙） + 底部60px（呼吸计数器） = 204px
      const reservedVerticalSpace = 204;
      const availableVerticalSpace = availableHeight - reservedVerticalSpace;
      // 放大手机端曼陀罗尺寸
      return Math.min(
        availableWidth * 0.85,  // 从80%增加到85%
        availableVerticalSpace * 0.85, // 从80%增加到85%
        400 // 从350px增加到400px
      );
    } else { // 桌面端
      // 桌面端：顶部160px + 底部80px = 240px
      const reservedVerticalSpace = 240;
      const availableVerticalSpace = availableHeight - reservedVerticalSpace;
      return Math.min(
        availableWidth * 0.75,  // 从70%增加到75%
        availableVerticalSpace * 0.8, // 从75%增加到80%
        600 // 从550px增加到600px
      );
    }
  }, [windowSize]);

  useEffect(() => {
    // Animation sequence: Mandala appears first, then title, then texts, then breathing counter
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 1000); // 1s after mandala appears

    const firstTextTimer = setTimeout(() => {
      setShowFirstText(true);
    }, 2000); // 1s after title

    const secondTextTimer = setTimeout(() => {
      setShowSecondText(true);
    }, 8000); // 6s after first text appears

    const breathingTimer = setTimeout(() => {
      setShowBreathingCounter(true);
    }, 11000); // 3s after second text appears

    // Count breathing cycles (每8秒一个呼吸周期，5个周期约40秒)
    const breathingCycleTimer = setInterval(() => {
      setBreathingCycle(prev => prev + 1);
    }, 8000);

    // 5个呼吸周期后立即显示卡片 - 更快的timing
    const cardTimer = setTimeout(() => {
      setShowCard(true);
    }, 43000); // 11s (delay to counter) + 32s (4 breathing cycles) = immediate after 5th cycle

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(firstTextTimer);
      clearTimeout(secondTextTimer);
      clearTimeout(breathingTimer);
      clearInterval(breathingCycleTimer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="relative w-full h-full overflow-visible reflection-page-mobile">
      {/* Figma Sky Background */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${imgImage50}')` }}
      />
      
      {/* Black Overlay for Readability */}
      <div className="absolute inset-0 bg-black/30" />

      
      {/* Enhanced Ambient Particles */}
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

      {/* Fixed Layout Container - 重新设计为更舒适的垂直布局 */}
      <div className="relative z-10 w-full h-full overflow-visible flex flex-col">
        
        {/* Top section - Title and text - 响应式高度优化 */}
        <div className="flex-shrink-0 pt-8 md:pt-8 pb-4 md:pb-4 px-6 h-36 md:h-40 flex flex-col justify-center">
          {/* Title */}
          <AnimatePresence>
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="w-full flex justify-center z-30 mb-4"
              >
                <h2 className="text-2xl md:text-3xl text-white text-center">
                  5 Breaths of Reflection
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text content */}
          <div className="w-full flex flex-col items-center z-30">
            <AnimatePresence mode="wait">
              {showFirstText && !showSecondText && (
                <motion.div
                  key="first-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-4xl"
                >
                  <p className="text-base md:text-lg text-white/90 leading-relaxed">
                    Wonderful! Your mandala is now complete
                  </p>
                </motion.div>
              )}
              
              {showSecondText && (
                <motion.div
                  key="second-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-4xl"
                >
                  <p className="text-base md:text-lg text-white/90 leading-relaxed">
                    Let's focus and take some deep breaths to experience this open, unconditional compassion.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center section - Mandala */}
        <div className="flex-grow flex flex-col items-center justify-center z-20 overflow-visible reflection-mandala-container min-h-0 relative px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            className="relative overflow-visible reflection-mandala-container"
            data-mandala="true"
            style={{
              width: `${mandalaSize}px`,
              height: `${mandalaSize}px`,
              overflow: 'visible'
            }}
          >
            {/* Golden Glow Effect - BEHIND mandala */}
            {!showCard && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {/* Main Golden Glow - Circular breathing behind mandala */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.8) 0%, rgba(251, 146, 60, 0.4) 25%, rgba(251, 146, 60, 0.2) 50%, rgba(251, 146, 60, 0.1) 75%, transparent 100%)',
                    filter: 'blur(40px)',
                    transform: 'scale(1.5)'
                  }}
                  animate={{
                    opacity: [0.3, 0.9, 0.3],
                    scale: [1.2, 1.8, 1.2]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Inner Bright Golden Core */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.9) 0%, rgba(251, 191, 36, 0.5) 30%, rgba(251, 146, 60, 0.3) 60%, transparent 80%)',
                    filter: 'blur(20px)',
                    transform: 'scale(1.2)'
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.4, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />

                {/* Outer Subtle Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, transparent 60%, rgba(251, 191, 36, 0.3) 70%, rgba(251, 191, 36, 0.15) 85%, transparent 100%)',
                    filter: 'blur(10px)',
                    transform: 'scale(2)'
                  }}
                  animate={{
                    opacity: [0.1, 0.6, 0.1],
                    scale: [1.8, 2.4, 1.8]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />

                {/* Sharp Central Highlight */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(251, 191, 36, 0.7) 15%, rgba(251, 146, 60, 0.4) 35%, transparent 60%)',
                    filter: 'blur(5px)',
                    transform: 'scale(0.8)'
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                  }}
                />
              </div>
            )}

            {/* Mandala with breathing scaling animation - ON TOP */}
            <motion.div
              animate={!showCard ? {
                scale: [1.1, 1.15, 1.1] // 整体放大10-15%
              } : {}}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10 overflow-visible reflection-mandala-container"
              data-mandala="true"
              style={{
                width: `${mandalaSize}px`,
                height: `${mandalaSize}px`,
                overflow: 'visible',
                transform: 'scale(1.1)' // 基础放大10%
              }}
            >
              <MandalaRenderer
                mandalaData={mandalaData}
                viewSize={mandalaSize}
                padding={mandalaSize * 0.1}
                hillSizeMultiplier={1.15}
                animate={!showCard}
                className="transition-all duration-500 overflow-visible reflection-mandala-container mandala-container"
                data-mandala="true"
                style={{
                  width: `${mandalaSize}px`,
                  height: `${mandalaSize}px`,
                  overflow: 'visible'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Breathing counter - 响应式定位优化 */}
          <AnimatePresence>
            {showBreathingCounter && !showCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 z-30"
              >
                <div className="text-center">
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom section - 响应式预留空间 */}
        <div className="flex-shrink-0 h-12 md:h-20"></div>
      </div>

      {/* Completion Card - More transparent white background */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-40 flex items-center justify-center p-6"
          >
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl max-w-2xl w-full mx-4 sm:mx-8 md:mx-12">
              
              <motion.h3
                className="text-2xl text-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Good job
              </motion.h3>
              
              <motion.p
                className="text-base text-muted-foreground leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Now we'll dissolve the mandala into flowing water, sending compassion to all beings.
              </motion.p>

              <motion.p
                className="text-sm text-muted-foreground/70 italic leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                In traditional practice, sand mandalas are gently dismantled and poured into rivers, symbolizing impermanence and the sharing of blessings with all beings.
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full shadow-lg"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}