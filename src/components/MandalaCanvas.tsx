import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import type { MandalaLayer } from '../App';

interface MandalaCanvasProps {
  size: number;
  layers: MandalaLayer[];
  currentColor: string;
  currentTool: string;
  ringIndex: number;
  onPathsChange: (paths: string[]) => void;
  onCanvasInteraction?: () => boolean;
}

interface Point {
  x: number;
  y: number;
}

interface SandHill {
  x: number;
  y: number;
  size: number;
  color: string;
  pouring: boolean;
  symmetryPoints: Point[];
  textureSeed: number; // Fixed seed for consistent texture
}

export function MandalaCanvas({ 
  size, 
  layers, 
  currentColor, 
  currentTool, 
  ringIndex, 
  onPathsChange,
  onCanvasInteraction
}: MandalaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPouring, setIsPouring] = useState(false);
  const [sandHills, setSandHills] = useState<SandHill[]>([]);
  const [currentHill, setCurrentHill] = useState<SandHill | null>(null);
  const animationRef = useRef<number | null>(null);
  const pulseAnimationRef = useRef<number | null>(null);
  
  // Constants for sand pouring
  const initialDotSize = 3;
  const growthRate = 0.05; // Much slower growth rate, like breathing circle
  // No max size limit - let users grow as much as they want

  // Seeded random number generator for consistent textures
  const seededRandom = useCallback((seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }, []);

  // Create sand texture with fixed seed for consistency
  const createSandTexture = useCallback((color: string, seed: number, ctx: CanvasRenderingContext2D) => {
    // Parse color to RGB
    let r = 255, g = 255, b = 255;
    
    if (color.startsWith('#')) {
      // Handle hex colors
      const hex = color.slice(1);
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
      // Handle rgb/rgba colors
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        r = parseInt(matches[0]);
        g = parseInt(matches[1]);
        b = parseInt(matches[2]);
      }
    }
    
    // Create small texture canvas for noise pattern
    const textureSize = 32; // Small texture that will tile
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureSize;
    textureCanvas.height = textureSize;
    const textureCtx = textureCanvas.getContext('2d');
    
    if (!textureCtx) return color; // Fallback to solid color
    
    // Create texture with seeded noise
    const imageData = textureCtx.createImageData(textureSize, textureSize);
    const data = imageData.data;
    
    let currentSeed = seed;
    
    // Apply noise to each pixel using seeded random
    for (let i = 0; i < data.length; i += 4) {
      // Generate seeded noise (-15 to +15)
      currentSeed += 1;
      const noise = Math.floor(seededRandom(currentSeed) * 30) - 15;
      
      // Apply noise to RGB values with clamping
      data[i]     = Math.max(0, Math.min(255, r + noise)); // R
      data[i + 1] = Math.max(0, Math.min(255, g + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, b + noise)); // B
      data[i + 3] = 255; // A (full opacity)
    }
    
    textureCtx.putImageData(imageData, 0, 0);
    
    // Create repeating pattern
    return ctx.createPattern(textureCanvas, 'repeat');
  }, [seededRandom]);

  const canvasConfig = useMemo(() => {
    // RING SYSTEM FOR MANDALA DRAWING
    const canvasSize = size;
    const canvasRadius = canvasSize / 2;
    
    // Define rings as precise pixel radii
    const baseRadius = canvasRadius;
    
    const ringBoundaries = [
      0,                           // Center point (0px)
      Math.round(baseRadius * 0.25),  // Ring 1 outer edge (25% of canvas)
      Math.round(baseRadius * 0.50),  // Ring 2 outer edge (50% of canvas) 
      Math.round(baseRadius * 0.75),  // Ring 3 outer edge (75% of canvas)
      Math.round(baseRadius * 1.0)    // Ring 4 outer edge (100% of canvas)
    ];
    
    // Debug: Log exact pixel values
    console.log(`🎯 Ring boundaries (px): [${ringBoundaries.join(', ')}]`);
    console.log(`🎯 Canvas: ${canvasSize}x${canvasSize}, radius: ${canvasRadius}px`);
    
    return {
      canvasSize,
      canvasRadius,
      canvasCenter: canvasRadius, // Center point coordinate
      ringBoundaries,
      currentRingInner: ringBoundaries[ringIndex] || 0,
      currentRingOuter: ringBoundaries[ringIndex + 1] || canvasRadius,
      
      // Legacy compatibility (keep same variable names)
      actualCanvasSize: canvasSize,
      center: canvasRadius,
      ringRadii: ringBoundaries,
      innerRadius: ringBoundaries[ringIndex] || 0,
      outerRadius: ringBoundaries[ringIndex + 1] || canvasRadius
    };
  }, [size, ringIndex]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { canvasSize, canvasCenter, ringBoundaries } = canvasConfig;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Set up rendering
    ctx.imageSmoothingEnabled = true;

    // Fill the entire active area (from center to current ring) with semi-transparent background
    if (ringIndex >= 0 && ringIndex < 4) {
      const currentRingOuterRadius = ringBoundaries[ringIndex + 1] || canvasCenter;
      
      // Create full circle fill for entire active area (no inner hole)
      ctx.beginPath();
      ctx.arc(canvasCenter, canvasCenter, currentRingOuterRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    }
    
    // Draw only visible ring borders (current stage + completed stages)
    // Stage 1: show 1 ring, Stage 2: show 2 rings, Stage 3: show 3 rings, Stage 4: show 4 rings
    const maxVisibleRingIndex = Math.min(ringIndex + 1, ringBoundaries.length - 1);
    
    for (let i = 1; i <= maxVisibleRingIndex; i++) {
      const ringRadius = ringBoundaries[i];
      const isCurrentRing = (i - 1) === ringIndex; // Current drawing ring
      const isCompletedRing = (i - 1) < ringIndex; // Already completed rings
      
      ctx.beginPath();
      ctx.arc(canvasCenter, canvasCenter, ringRadius, 0, Math.PI * 2);
      
      if (isCurrentRing) {
        // Current ring: solid white border
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (isCompletedRing) {
        // Completed rings: slightly more visible  
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw completed layers sand hills
    if (layers.length > 0) {
      layers.forEach(layer => {
        if (layer.paths.length === 0) return;
        
        layer.paths.forEach(pathData => {
          try {
            const hills = JSON.parse(pathData) as SandHill[];
            
            hills.forEach(hill => {
              // Create sand texture for this hill using its fixed seed
              const sandTexture = createSandTexture(hill.color, hill.textureSeed || 0, ctx);
              
              // Draw main hill
              ctx.beginPath();
              ctx.arc(hill.x, hill.y, hill.size, 0, Math.PI * 2);
              ctx.fillStyle = sandTexture || hill.color; // Fallback to solid color if texture fails
              ctx.fill();
              
              // Draw 7 symmetry points
              hill.symmetryPoints.forEach(symPoint => {
                ctx.beginPath();
                ctx.arc(symPoint.x, symPoint.y, hill.size, 0, Math.PI * 2);
                ctx.fillStyle = sandTexture || hill.color; // Use same texture
                ctx.fill();
              });
            });
          } catch (e) {
            console.warn('Error parsing sand hills data:', e);
          }
        });
      });
    }

    // Draw current stage sand hills
    sandHills.forEach(hill => {
      // Create sand texture for this hill using its fixed seed
      const sandTexture = createSandTexture(hill.color, hill.textureSeed, ctx);
      
      // Draw main hill
      ctx.beginPath();
      ctx.arc(hill.x, hill.y, hill.size, 0, Math.PI * 2);
      ctx.fillStyle = sandTexture || hill.color; // Fallback to solid color if texture fails
      ctx.fill();
      
      // Add breathing pulse effect for pouring hills
      if (hill.pouring) {
        const pulseSize = hill.size + 2 + Math.sin(Date.now() / 200) * 1;
        ctx.beginPath();
        ctx.arc(hill.x, hill.y, pulseSize, 0, Math.PI * 2);
        // Use hill's color for pulse effect instead of white
        const pulseColor = hill.color.startsWith('#') ? hill.color + '80' : hill.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
        ctx.strokeStyle = pulseColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw 7 symmetry points
      hill.symmetryPoints.forEach(symPoint => {
        ctx.beginPath();
        ctx.arc(symPoint.x, symPoint.y, hill.size, 0, Math.PI * 2);
        ctx.fillStyle = sandTexture || hill.color; // Use same texture
        ctx.fill();
        
        // Add breathing pulse effect for symmetry points when pouring
        if (hill.pouring) {
          const pulseSize = hill.size + 2 + Math.sin(Date.now() / 200) * 1;
          ctx.beginPath();
          ctx.arc(symPoint.x, symPoint.y, pulseSize, 0, Math.PI * 2);
          // Use hill's color for pulse effect instead of white
          const pulseColor = hill.color.startsWith('#') ? hill.color + '80' : hill.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
          ctx.strokeStyle = pulseColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

  }, [canvasConfig, layers, sandHills, ringIndex, createSandTexture]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getPointFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const isPointInCurrentRing = useCallback((point: Point): boolean => {
    const { canvasCenter, currentRingInner, currentRingOuter } = canvasConfig;
    const distance = Math.sqrt(
      Math.pow(point.x - canvasCenter, 2) + Math.pow(point.y - canvasCenter, 2)
    );
    return distance >= currentRingInner && distance <= currentRingOuter;
  }, [canvasConfig]);

  // Start pulse animation for visual feedback
  const startPulseAnimation = useCallback(() => {
    if (pulseAnimationRef.current) {
      cancelAnimationFrame(pulseAnimationRef.current);
    }
    
    const pulse = () => {
      // Check if we still have pouring hills
      const hasPouringHills = sandHills.some(hill => hill.pouring);
      
      if (hasPouringHills && isPouring) {
        redrawCanvas(); // Redraw to update pulse effect
        pulseAnimationRef.current = requestAnimationFrame(pulse);
      } else {
        pulseAnimationRef.current = null;
      }
    };
    
    pulseAnimationRef.current = requestAnimationFrame(pulse);
  }, [sandHills, isPouring, redrawCanvas]);

  // Animation function with pulse effect redraw
  const startGrowthAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = () => {
      setSandHills(prev => {
        let hasGrowingHills = false;
        const updatedHills = prev.map(hill => {
          if (hill.pouring) {
            hasGrowingHills = true;
            const newSize = hill.size + growthRate;
            console.log(`⬆️ Growing hill from ${hill.size} to ${newSize}`);
            return { ...hill, size: newSize };
          }
          return hill;
        });
        
        // Continue animation if we have growing hills and still pouring
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

  const startPouring = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isPouring) return;
    e.preventDefault();
    
    // Check if color is selected before allowing interaction
    if (onCanvasInteraction && !onCanvasInteraction()) {
      return;
    }
    
    const point = getPointFromEvent(e);
    if (!isPointInCurrentRing(point)) return;
    
    console.log('🎯 Starting to pour sand at:', point);
    setIsPouring(true);
    
    // Calculate relative position from center
    const { canvasCenter } = canvasConfig;
    const relX = point.x - canvasCenter;
    const relY = point.y - canvasCenter;
    const distance = Math.sqrt(relX * relX + relY * relY);
    const angle = Math.atan2(relY, relX);
    
    // Generate 7 symmetry points (8-fold symmetry total)
    const symmetryPoints: Point[] = [];
    for (let i = 1; i < 8; i++) {
      const newAngle = angle + (Math.PI / 4) * i;
      const newX = canvasCenter + distance * Math.cos(newAngle);
      const newY = canvasCenter + distance * Math.sin(newAngle);
      symmetryPoints.push({ x: newX, y: newY });
    }
    
    const hill: SandHill = {
      x: point.x,
      y: point.y,
      size: initialDotSize,
      color: currentColor,
      pouring: true,
      symmetryPoints,
      textureSeed: Math.floor(Math.random() * 1000000) // Generate unique seed for this hill
    };
    
    console.log('🏔️ Created hill:', hill);
    setCurrentHill(hill);
    setSandHills(prev => {
      const newHills = [...prev, hill];
      console.log('📊 Updated sandHills:', newHills);
      return newHills;
    });
    
    // Start growth and pulse animations immediately
    startGrowthAnimation();
    startPulseAnimation();
  }, [isPouring, getPointFromEvent, isPointInCurrentRing, canvasConfig, currentColor, startGrowthAnimation, startPulseAnimation, onCanvasInteraction]);

  const stopPouring = useCallback(() => {
    console.log('⏹️ Stopping sand pour');
    setIsPouring(false);
    setCurrentHill(null);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (pulseAnimationRef.current) {
      cancelAnimationFrame(pulseAnimationRef.current);
      pulseAnimationRef.current = null;
    }
    
    // Finalize all hills
    setSandHills(prev => {
      const finalizedHills = prev.map(hill => ({ ...hill, pouring: false }));
      console.log('✅ Finalized hills:', finalizedHills);
      
      // Schedule the onPathsChange call for the next tick to avoid render conflicts
      if (finalizedHills.length > 0) {
        setTimeout(() => {
          const pathData = JSON.stringify(finalizedHills);
          onPathsChange([pathData]);
        }, 0);
      }
      
      return finalizedHills;
    });
    
    console.log('🎵 Gentle chime for completed sand pour');
  }, [onPathsChange]);

  // Monitor isPouring state and control animations
  useEffect(() => {
    if (!isPouring) {
      // Stop growing when not pouring
      setSandHills(prev => prev.map(hill => ({ ...hill, pouring: false })));
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
        pulseAnimationRef.current = null;
      }
    }
  }, [isPouring]);

  // Reset sand hills when ring changes (new stage)
  useEffect(() => {
    // Use a timeout to ensure this doesn't conflict with render cycles
    const resetState = () => {
      setSandHills([]);
      setCurrentHill(null);
      setIsPouring(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
        pulseAnimationRef.current = null;
      }
    };
    
    // Schedule for next tick to avoid render conflicts
    const timeoutId = setTimeout(resetState, 0);
    
    return () => clearTimeout(timeoutId);
  }, [ringIndex]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pulseAnimationRef.current) {
        cancelAnimationFrame(pulseAnimationRef.current);
      }
    };
  }, []);

  // Convert currentColor to rgba for breathing light
  const getColorForBreathing = useCallback(() => {
    if (!currentColor) return 'rgba(251, 146, 60, 0.3)'; // Default amber color

    // Convert hex to rgba
    if (currentColor.startsWith('#')) {
      const hex = currentColor.slice(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    }
    
    // Parse rgb/rgba
    if (currentColor.startsWith('rgb')) {
      const matches = currentColor.match(/\d+/g);
      if (matches && matches.length >= 3) {
        return {
          r: parseInt(matches[0]),
          g: parseInt(matches[1]),
          b: parseInt(matches[2])
        };
      }
    }
    
    // Default fallback
    return { r: 251, g: 146, b: 60 };
  }, [currentColor]);

  const colorValues = getColorForBreathing();
  const breathingLightStyle = currentColor ? {
    '--glow-core': `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, 0.3)`,
    '--glow-inner': `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, 0.2)`,
    '--glow-middle': `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, 0.15)`,
    '--glow-outer': `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, 0.1)`,
  } as React.CSSProperties : {};

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative stage-${ringIndex}`}
        style={{ width: size, height: size, ...breathingLightStyle }}
      >
        {/* Enhanced Four-Layer Breathing Light System */}
        <div className="mandala-breathing-light breathing-glow-outer" />
        <div className="mandala-breathing-light breathing-glow-middle" />
        <div className="mandala-breathing-light breathing-glow-inner" />
        <div className="mandala-breathing-light breathing-glow-core" />
        
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="mandala-canvas cursor-crosshair touch-none relative z-10"
          style={{ 
            backgroundColor: 'transparent',
            borderRadius: '50%',
            clipPath: 'circle(50% at 50% 50%)'
          }}
          onMouseDown={startPouring}
          onMouseUp={stopPouring}
          onMouseLeave={stopPouring}
          onTouchStart={startPouring}
          onTouchEnd={stopPouring}
          onTouchCancel={stopPouring}
        />
        

        
        {/* Pouring indicator */}
        {isPouring && currentColor && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none animate-pulse z-20"
            style={{ backgroundColor: currentColor }}
          />
        )}
      </motion.div>
    </div>
  );
}