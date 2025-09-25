import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MandalaCanvas } from './MandalaCanvas';
import { AudioToggle } from './AudioToggle';
import type { MandalaLayer } from '../App';
import imgImage23 from "figma:asset/05d06e7e1d508e78ecdb2f2deeeba5d09cd87bb2.png";
import imgImage28 from "figma:asset/ac79442a1654f7a786d5de872e343e40b8bbe463.png";
import imgImage50Sky from "figma:asset/9ca5e171c3ee64e68e7a68aec14b5bcc420ac327.png";
import imgImage50Sunset from "figma:asset/8c726540e6da8df0912ce3b1ea7095fd7f970a4b.png";

interface DrawingStageProps {
  title: string;
  subtitle?: string;
  description: string;
  intention: string;
  ringIndex: number;
  mandalaLayers: MandalaLayer[];
  onComplete: (layer: MandalaLayer) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const colorPalette = [
  { name: 'Pure White', color: '#ffffff', meaning: 'Clarity and new beginnings' },
  { name: 'Warm Gold', color: '#EABB36', meaning: 'Joy and enlightenment' },
  { name: 'Passionate Red', color: '#D24639', meaning: 'Love and courage' },
  { name: 'Peaceful Blue', color: '#418FD1', meaning: 'Wisdom and calm' },
  { name: 'Healing Green', color: '#5AC26E', meaning: 'Growth and compassion' },
  { name: 'Deep Black', color: '#121212', meaning: 'Strength and grounding' }
];



export function DrawingStage({ 
  title, 
  subtitle, 
  description, 
  intention, 
  ringIndex, 
  mandalaLayers,
  onComplete,
  audioEnabled,
  setAudioEnabled 
}: DrawingStageProps) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedTool, setSelectedTool] = useState('brush');
  const [paths, setPaths] = useState<string[]>([]);
  const [showColorHint, setShowColorHint] = useState(false);
  const [mobileTooltipOpen, setMobileTooltipOpen] = useState<string | null>(null);

  const stageNumber = ringIndex + 1;

  const handleComplete = () => {
    const layer: MandalaLayer = {
      id: `layer-${Date.now()}`,
      stage: stageNumber,
      color: selectedColor,
      paths,
      intention
    };
    onComplete(layer);
  };

  const handleCanvasInteraction = () => {
    // 关闭手机端tooltip（不影响已选择的颜色）
    setMobileTooltipOpen(null);
    
    if (!selectedColor) {
      // Show enhanced color selection glow for all stages
      setShowColorHint(true);
      setTimeout(() => setShowColorHint(false), 2000);
      return false;
    }
    return true;
  };

  const getBackgroundGradient = () => {
    switch (stageNumber) {
      case 1: return 'from-green-50 to-emerald-100'; // Self-compassion
      case 2: return 'from-pink-50 to-rose-100'; // Loved one
      case 3: return 'from-blue-50 to-sky-100'; // Neutral person
      case 4: return 'from-purple-50 to-violet-100'; // Difficult person
      case 5: return 'from-amber-50 to-orange-100'; // Universal
      default: return 'from-slate-50 to-blue-50';
    }
  };

  const getTimeOfDay = () => {
    switch (stageNumber) {
      case 1: return 'Dawn - New Beginnings';
      case 2: return 'Morning - Growing Light';
      case 3: return 'Midday - Clear Vision';
      case 4: return 'Afternoon - Inner Strength';
      case 5: return 'Sunset - Universal Embrace';
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <div className={`relative h-screen w-full overflow-hidden ${[1, 2, 3, 4].includes(stageNumber) ? 'bg-white' : `bg-gradient-to-br ${getBackgroundGradient()}`}`}>
        {/* Audio Toggle */}
        <AudioToggle 
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
        />
        
        {/* Audio Toggle */}
        <AudioToggle 
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
        />
        {/* Stage Backgrounds - Matching PreparationStage */}
        
        {/* Stage 1: Self-Compassion - 淡黄蓝色调，深邃 */}
        {stageNumber === 1 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 via-amber-900 to-blue-900">
              {/* Floating Lotus Petals */}
              {Array.from({ length: 8 }).map((_, i) => (
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
              ))}
            </div>
            {/* No black overlay - pure gradient background */}
          </>
        )}
        
        {/* Stage 2: Compassion for Loved One - Rose gradient */}
        {stageNumber === 2 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-red-900">
              {/* Floating Lotus Petals */}
              {Array.from({ length: 8 }).map((_, i) => (
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
              ))}
            </div>
            {/* No black overlay - pure gradient background */}
          </>
        )}
        
        {/* Stage 3: Compassion for Difficult Person - 深蓝绿色调 */}
        {stageNumber === 3 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-teal-900 to-green-900">
              {/* Floating Lotus Petals */}
              {Array.from({ length: 8 }).map((_, i) => (
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
              ))}
            </div>
            {/* No black overlay - pure gradient background */}
          </>
        )}
        
        {/* Stage 4: Universal Compassion - Warm terracotta/brown */}
        {stageNumber === 4 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-red-900 to-orange-900">
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
            </div>
            {/* No black overlay - pure gradient background */}
          </>
        )}

        {/* Top Bar with Stage Info - Centered */}
        <div className="relative z-10 flex justify-center items-start p-8 pb-2 lg:pb-4 w-full">
          <div className="flex flex-col items-center text-center w-full">
            <p className="text-sm text-white/70 mb-2 text-center">Stage {stageNumber} of 4</p>
            <h1 className="text-xl lg:text-3xl text-white mb-2 lg:mb-4 text-center">{title}</h1>
            
            {/* Mobile Remember Text - Hidden as requested */}
            <div className="hidden">
              <h3 className="text-white mb-2">Remember</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                There is no right or wrong in your drawing – just an expression of kindness. 
                Each stroke will mirror beautifully around the circle.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Color Palette - Moved down further */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative z-10 flex justify-center px-8 mb-4 mt-12 lg:hidden"
        >
          <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 shadow-lg transition-all duration-500 ${
            showColorHint ? 'shadow-yellow-300/40 shadow-2xl ring-2 ring-yellow-300/30' : ''
          }`}>
            <div className="flex space-x-2 justify-center">
              {colorPalette.map((colorOption) => (
                <Tooltip key={colorOption.color} open={mobileTooltipOpen === colorOption.color} onOpenChange={(open) => {
                  if (!open) setMobileTooltipOpen(null);
                }}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        // 在手机端，点击时同时选择颜色并显示tooltip信息
                        if (window.innerWidth < 1024) {
                          // 如果点击了其他颜色，立刻关闭当前tooltip
                          if (mobileTooltipOpen && mobileTooltipOpen !== colorOption.color) {
                            setMobileTooltipOpen(null);
                          }
                          
                          // 同时选择颜色和显示tooltip
                          setSelectedColor(colorOption.color);
                          setMobileTooltipOpen(colorOption.color);
                          // 6秒后自动关闭tooltip
                          setTimeout(() => setMobileTooltipOpen(null), 6000);
                        } else {
                          // 桌面端直接选择颜色
                          setSelectedColor(colorOption.color);
                        }
                      }}
                      className={`mobile-interactive relative w-12 h-10 rounded-lg transition-all duration-200 z-50 ${
                        selectedColor === colorOption.color 
                          ? 'ring-3 ring-white shadow-xl scale-110 shadow-white/30' 
                          : mobileTooltipOpen === colorOption.color
                          ? 'ring-2 ring-blue-300/70 shadow-lg scale-105'
                          : 'ring-1 ring-white/40 hover:ring-white/60 shadow-md hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorOption.color }}
                    >
                      {/* Enhanced selection indicator */}
                      {selectedColor === colorOption.color && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-1 bg-white/40 rounded-md border border-white/60"
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">{colorOption.name}</p>
                      <p className="text-sm text-muted-foreground">{colorOption.meaning}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Remember Section - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-32 left-4 md:left-8 z-10 max-w-xs hidden lg:block"
        >
          <div className="space-y-4">
            <h3 className="text-white">Remember</h3>
            <p className="text-white/80 leading-relaxed">
              There is no right or wrong in your drawing – just an expression of kindness. 
              Each stroke will mirror beautifully around the circle.
            </p>
          </div>
        </motion.div>

        {/* Main Layout - Canvas and Color Palette */}
        <div className="relative z-10 flex items-center justify-center px-8 pb-8 h-[calc(100dvh-240px)] lg:h-[calc(100vh-140px)]">

          {/* Canvas Container - Centered with maximum size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center justify-center relative"
          >

            <div className="relative">

              
              <MandalaCanvas
                size={typeof window !== 'undefined' ? Math.min(
                  800, // Maximum size increased
                  window.innerWidth > 1400 ? window.innerWidth * 0.5 : window.innerWidth * 0.8, // Even larger on mobile
                  window.innerWidth > 1024 ? window.innerHeight * 0.55 : window.innerHeight * 0.6 // More space on mobile
                ) : 600}
                layers={mandalaLayers}
                currentColor={selectedColor}
                currentTool={selectedTool}
                ringIndex={ringIndex}
                onPathsChange={setPaths}
                onCanvasInteraction={handleCanvasInteraction}
              />
            </div>
            
            {/* Complete Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-3 lg:mt-4"
            >
              <Button
                onClick={handleComplete}
                size="lg"
                className="mobile-interactive px-8 py-3 rounded-full bg-white text-black hover:bg-white/90 shadow-lg relative z-50"
                disabled={paths.length === 0}
              >
                Complete
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Color Palette Card - Desktop (Right Side) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
          >
            <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg transition-all duration-500 ${
              showColorHint ? 'shadow-yellow-300/50 shadow-2xl ring-2 ring-yellow-300/40' : ''
            }`}>
              <h3 className="text-white/80 text-center text-sm mb-4">Colors</h3>
              <div className="flex flex-col space-y-2">
                {colorPalette.map((colorOption) => (
                  <Tooltip key={colorOption.color}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedColor(colorOption.color)}
                        className={`mobile-interactive relative w-12 h-12 rounded-xl transition-all duration-200 z-50 ${
                          selectedColor === colorOption.color 
                            ? 'ring-2 ring-white/90 shadow-lg scale-105' 
                            : 'ring-1 ring-white/40 hover:ring-white/60 shadow-md hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorOption.color }}
                      >
                        {/* Simple selection indicator */}
                        {selectedColor === colorOption.color && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-3 bg-white/30 rounded-lg"
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{colorOption.name}</p>
                        <p className="text-sm text-muted-foreground">{colorOption.meaning}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </motion.div>


        </div>

        {/* Ambient Particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            animate={{
              y: [-10, -100],
              x: [0, Math.sin(i) * 30],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              bottom: '10%',
            }}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}