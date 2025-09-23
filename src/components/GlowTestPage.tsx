import React from 'react';
import { motion } from 'motion/react';

interface GlowTestPageProps {
  onBack: () => void;
}

export function GlowTestPage({ onBack }: GlowTestPageProps) {
  const canvasSize = 450; // Fixed size for testing
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-white mb-4">Golden Glow Effect Test</h1>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            返回应用
          </button>
        </div>
        
        {/* New Golden Glow Test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Single Mandala with Golden Glow */}
          <div className="text-center">
            <h3 className="text-white mb-4 text-xl">Mandala with Golden Glow Behind</h3>
            <div className="relative mx-auto" style={{ width: canvasSize, height: canvasSize }}>
              {/* Golden Glow Effect - BEHIND mandala (z-index 5) */}
              <div 
                className="absolute inset-0 pointer-events-none z-5"
                style={{
                  width: `${canvasSize}px`,
                  height: `${canvasSize}px`
                }}
              >
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

              {/* Mock Mandala - ON TOP (z-index 10) */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-radial from-purple-400 via-blue-400 to-green-400 rounded-full border-4 border-white/30 z-10"
                style={{ width: canvasSize, height: canvasSize }}
              >
                <div className="absolute inset-4 bg-gradient-radial from-red-400 via-yellow-400 to-orange-400 rounded-full">
                  <div className="absolute inset-8 bg-gradient-radial from-pink-400 via-purple-300 to-blue-300 rounded-full">
                    <div className="absolute inset-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">Mock Mandala</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Static Version for Comparison */}
          <div className="text-center">
            <h3 className="text-white mb-4 text-xl">Static Golden Glow Behind (No Animation)</h3>
            <div className="relative mx-auto" style={{ width: canvasSize, height: canvasSize }}>
              {/* Static Golden Glow - BEHIND (z-index 5) */}
              <div 
                className="absolute inset-0 pointer-events-none z-5"
                style={{
                  width: `${canvasSize}px`,
                  height: `${canvasSize}px`
                }}
              >
                {/* Static Main Glow */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.8) 0%, rgba(251, 146, 60, 0.4) 25%, rgba(251, 146, 60, 0.2) 50%, rgba(251, 146, 60, 0.1) 75%, transparent 100%)',
                    filter: 'blur(40px)',
                    transform: 'scale(1.5)',
                    opacity: 0.6
                  }}
                />
                
                {/* Static Inner Glow */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.9) 0%, rgba(251, 191, 36, 0.5) 30%, rgba(251, 146, 60, 0.3) 60%, transparent 80%)',
                    filter: 'blur(20px)',
                    transform: 'scale(1.2)',
                    opacity: 0.7
                  }}
                />

                {/* Static Central Highlight */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(251, 191, 36, 0.7) 15%, rgba(251, 146, 60, 0.4) 35%, transparent 60%)',
                    filter: 'blur(5px)',
                    transform: 'scale(0.8)',
                    opacity: 0.5
                  }}
                />
              </div>

              {/* Mock Mandala - ON TOP (z-index 10) */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-radial from-purple-400 via-blue-400 to-green-400 rounded-full border-4 border-white/30 z-10"
                style={{ width: canvasSize, height: canvasSize }}
              >
                <div className="absolute inset-4 bg-gradient-radial from-red-400 via-yellow-400 to-orange-400 rounded-full">
                  <div className="absolute inset-8 bg-gradient-radial from-pink-400 via-purple-300 to-blue-300 rounded-full">
                    <div className="absolute inset-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">Mock Mandala</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Details */}
        <div className="mt-12 bg-white/10 rounded-lg p-6">
          <h4 className="text-white text-lg mb-4">Golden Glow Technical Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/80">
            <div>
              <h5 className="text-yellow-300 font-medium mb-2">Glow Layers (4 layers)</h5>
              <ul className="space-y-1">
                <li>🟡 Main Glow: Radial ellipse with blur(20px)</li>
                <li>🟠 Inner Bright: Scaled 70% with blur(10px)</li>
                <li>🟣 Outer Ring: Scaled 140% with blur(5px)</li>
                <li>⭐ Highlight: Scaled 40% with blur(2px)</li>
              </ul>
            </div>
            <div>
              <h5 className="text-yellow-300 font-medium mb-2">Animation Properties</h5>
              <ul className="space-y-1">
                <li>🔄 Duration: 8 seconds per cycle</li>
                <li>📐 Scale X: 0.8 → 1.3 → 0.8</li>
                <li>📏 Scale Y: 0.6 → 1.1 → 0.6</li>
                <li>💫 Opacity: 0.3 → 0.9 → 0.3</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Color Information */}
        <div className="mt-6 bg-white/5 rounded-lg p-4">
          <h4 className="text-white text-base mb-4">Golden Glow Color Palette</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-radial from-orange-400 to-orange-600 mb-2"></div>
              <div className="text-orange-300 font-medium">Main Orange</div>
              <div className="text-white/70">rgba(251, 146, 60, 0.6)</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-radial from-yellow-400 to-yellow-600 mb-2"></div>
              <div className="text-yellow-300 font-medium">Bright Yellow</div>
              <div className="text-white/70">rgba(251, 191, 36, 0.8)</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-radial from-white to-yellow-200 mb-2"></div>
              <div className="text-white font-medium">Highlight</div>
              <div className="text-white/70">rgba(255, 255, 255, 0.8)</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-radial from-yellow-200/20 to-transparent mb-2 border border-yellow-400/30"></div>
              <div className="text-yellow-200 font-medium">Subtle Ring</div>
              <div className="text-white/70">rgba(251, 191, 36, 0.2)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}