import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import type { MandalaLayer } from '../../App';

export interface MandalaData {
  allHills: Array<{
    x: number;
    y: number;
    size?: number;
    color?: string;
    layerColor: string;
    layerIndex: number;
    pathIndex: number;
    textureSeed?: number;
  }>;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

// 解析曼陀罗数据的核心函数 - 统一处理所有层的数据
export function parseMandalaData(mandalaLayers: MandalaLayer[]): MandalaData {
  console.log('🎨 Parsing mandala layers:', mandalaLayers);
  
  const allHills: any[] = [];
  
  mandalaLayers.forEach((layer, layerIndex) => {
    layer.paths.forEach((pathData, pathIndex) => {
      try {
        const sandHills = JSON.parse(pathData);
        if (Array.isArray(sandHills)) {
          sandHills.forEach(hill => {
            if (hill && typeof hill === 'object' && hill.x !== undefined && hill.y !== undefined) {
              allHills.push({
                ...hill,
                layerColor: layer.color,
                layerIndex,
                pathIndex
              });
              
              // 添加对称点
              if (hill.symmetryPoints && Array.isArray(hill.symmetryPoints)) {
                hill.symmetryPoints.forEach((symPoint: any) => {
                  if (symPoint && symPoint.x !== undefined && symPoint.y !== undefined) {
                    allHills.push({
                      ...hill,
                      x: symPoint.x,
                      y: symPoint.y,
                      layerColor: layer.color,
                      layerIndex,
                      pathIndex
                    });
                  }
                });
              }
            }
          });
        }
      } catch (e) {
        console.warn('Error parsing sand hills data:', e);
      }
    });
  });

  console.log('🏔️ Total hills collected:', allHills.length);

  if (allHills.length === 0) {
    return {
      allHills: [],
      bounds: { minX: 0, maxX: 400, minY: 0, maxY: 400 }
    };
  }

  // 计算边界
  const xs = allHills.map(h => h.x);
  const ys = allHills.map(h => h.y);
  const bounds = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };

  console.log('📐 Calculated bounds:', bounds);

  return { allHills, bounds };
}

// 计算渲染参数的函数
export function calculateRenderParams(
  bounds: MandalaData['bounds'], 
  viewSize: number, 
  padding: number = 80
) {
  const dataWidth = bounds.maxX - bounds.minX;
  const dataHeight = bounds.maxY - bounds.minY;
  const dataCenterX = (bounds.minX + bounds.maxX) / 2;
  const dataCenterY = (bounds.minY + bounds.maxY) / 2;
  
  const availableSize = viewSize - padding * 2;
  
  const scale = Math.min(
    availableSize / Math.max(dataWidth, 200),
    availableSize / Math.max(dataHeight, 200)
  );
  
  const viewCenterX = viewSize / 2;
  const viewCenterY = viewSize / 2;

  return {
    scale,
    dataCenterX,
    dataCenterY,
    viewCenterX,
    viewCenterY
  };
}

// Canvas渲染组件，支持完整的纹理效果
interface CanvasRendererProps {
  mandalaData: MandalaData;
  viewSize: number;
  padding: number;
  hillSizeMultiplier: number;
  opacity: number;
}

function CanvasRenderer({ mandalaData, viewSize, padding, hillSizeMultiplier, opacity }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 种子随机数生成器，确保纹理一致性
  const seededRandom = useCallback((seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }, []);

  // 创建沙子纹理，与原始MandalaCanvas相同的逻辑
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
      data[i + 3] = Math.floor(255 * opacity); // A with opacity
    }
    
    textureCtx.putImageData(imageData, 0, 0);
    
    // Create repeating pattern
    return ctx.createPattern(textureCanvas, 'repeat');
  }, [seededRandom, opacity]);

  // 渲染画布
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { allHills, bounds } = mandalaData;
    
    if (allHills.length === 0) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, viewSize, viewSize);
    
    // Set up rendering
    ctx.imageSmoothingEnabled = true;

    const renderParams = calculateRenderParams(bounds, viewSize, padding);
    const { scale, dataCenterX, dataCenterY, viewCenterX, viewCenterY } = renderParams;

    // 渲染所有hills，带纹理效果
    allHills.forEach(hill => {
      const screenX = viewCenterX + (hill.x - dataCenterX) * scale;
      const screenY = viewCenterY + (hill.y - dataCenterY) * scale;
      const screenSize = Math.max(2, (hill.size || 5) * scale * hillSizeMultiplier);
      
      const color = hill.color || hill.layerColor || '#3b82f6';
      const textureSeed = hill.textureSeed || 0;
      
      // 创建纹理
      const sandTexture = createSandTexture(color, textureSeed, ctx);
      
      // 绘制hill
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2);
      ctx.fillStyle = sandTexture || color; // 使用纹理或后备颜色
      ctx.fill();
    });
  }, [mandalaData, viewSize, padding, hillSizeMultiplier, createSandTexture]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={viewSize}
      height={viewSize}
      className="absolute inset-0 overflow-visible"
      style={{ 
        width: viewSize, 
        height: viewSize, 
        overflow: 'visible',
        borderRadius: '50%',
        clipPath: 'circle(48% at 50% 50%)' // 稍微小一点确保边缘完整显示
      }}
    />
  );
}

interface MandalaRendererProps {
  mandalaData: MandalaData;
  viewSize: number;
  padding?: number;
  className?: string;
  hillSizeMultiplier?: number;
  animate?: boolean;
  opacity?: number;
  onHillsReady?: (hills: MandalaData['allHills']) => void;
}

export function MandalaRenderer({
  mandalaData,
  viewSize,
  padding = 80,
  className = '',
  hillSizeMultiplier = 1.0,
  animate = false,
  opacity = 0.9,
  onHillsReady
}: MandalaRendererProps) {
  const { allHills } = mandalaData;
  
  React.useEffect(() => {
    if (onHillsReady && allHills.length > 0) {
      onHillsReady(allHills);
    }
  }, [allHills, onHillsReady]);

  if (allHills.length === 0) {
    return (
      <div 
        className={`relative mx-auto flex items-center justify-center border-2 border-dashed border-white/50 rounded-full ${className}`}
        style={{ width: viewSize, height: viewSize }}
      >
        <p className="text-white/80">No mandala data</p>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative mx-auto overflow-visible ${className}`}
      style={{ width: viewSize, height: viewSize, overflow: 'visible' }}
      animate={animate ? {
        scale: [1, 1.08, 1, 0.95, 1],
        rotate: [0, 1, 0, -1, 0],
      } : {}}
      transition={animate ? {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      <CanvasRenderer 
        mandalaData={mandalaData}
        viewSize={viewSize}
        padding={padding}
        hillSizeMultiplier={hillSizeMultiplier}
        opacity={opacity}
      />
    </motion.div>
  );
}

// 下载曼陀罗的工具函数，带纹理支持
export function downloadMandala(mandalaData: MandalaData, filename: string = 'mandala-of-compassion.png') {
  const { allHills } = mandalaData;
  
  if (allHills.length === 0) {
    console.warn('No mandala data to download');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 800;
  canvas.width = size;
  canvas.height = size;

  if (ctx) {
    // 白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const renderParams = calculateRenderParams(mandalaData.bounds, size, 80);
    const { scale, dataCenterX, dataCenterY, viewCenterX, viewCenterY } = renderParams;

    // Seeded random function for texture generation
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Create sand texture function
    const createSandTexture = (color: string, seed: number) => {
      let r = 255, g = 255, b = 255;
      
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (color.startsWith('rgb')) {
        const matches = color.match(/\d+/g);
        if (matches && matches.length >= 3) {
          r = parseInt(matches[0]);
          g = parseInt(matches[1]);
          b = parseInt(matches[2]);
        }
      }
      
      const textureSize = 32;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = textureSize;
      textureCanvas.height = textureSize;
      const textureCtx = textureCanvas.getContext('2d');
      
      if (!textureCtx) return color;
      
      const imageData = textureCtx.createImageData(textureSize, textureSize);
      const data = imageData.data;
      
      let currentSeed = seed;
      
      for (let i = 0; i < data.length; i += 4) {
        currentSeed += 1;
        const noise = Math.floor(seededRandom(currentSeed) * 30) - 15;
        
        data[i]     = Math.max(0, Math.min(255, r + noise));
        data[i + 1] = Math.max(0, Math.min(255, g + noise));
        data[i + 2] = Math.max(0, Math.min(255, b + noise));
        data[i + 3] = 255;
      }
      
      textureCtx.putImageData(imageData, 0, 0);
      return ctx.createPattern(textureCanvas, 'repeat');
    };

    // 绘制所有hills with texture
    allHills.forEach(hill => {
      const screenX = viewCenterX + (hill.x - dataCenterX) * scale;
      const screenY = viewCenterY + (hill.y - dataCenterY) * scale;
      const screenSize = Math.max(2, (hill.size || 5) * scale * 1.2);
      
      const color = hill.color || hill.layerColor || '#3b82f6';
      const textureSeed = hill.textureSeed || 0;
      const sandTexture = createSandTexture(color, textureSeed);
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, screenSize, 0, 2 * Math.PI);
      ctx.fillStyle = sandTexture || color;
      ctx.fill();
    });

    // 下载
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  }
}