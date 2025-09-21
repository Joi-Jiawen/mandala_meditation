import React from 'react';

interface GlowTestPageProps {
  onBack: () => void;
}

export function GlowTestPage({ onBack }: GlowTestPageProps) {
  const canvasSize = 400; // Fixed size for testing
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-white mb-4">呼吸光圈大小对比</h1>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            返回应用
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Core Glow - 36% */}
          <div className="text-center">
            <h3 className="text-white mb-4">核心光圈 (36%)</h3>
            <div className="relative mx-auto border border-white/30 rounded-full" style={{ width: canvasSize, height: canvasSize }}>
              <div className="stage-0">
                <div className="mandala-breathing-light breathing-glow-core" />
              </div>
            </div>
          </div>
          
          {/* Inner Glow - 60% */}
          <div className="text-center">
            <h3 className="text-white mb-4">内圈光圈 (60%)</h3>
            <div className="relative mx-auto border border-white/30 rounded-full" style={{ width: canvasSize, height: canvasSize }}>
              <div className="stage-1">
                <div className="mandala-breathing-light breathing-glow-inner" />
              </div>
            </div>
          </div>
          
          {/* Middle Glow - 90% */}
          <div className="text-center">
            <h3 className="text-white mb-4">中圈光圈 (90%)</h3>
            <div className="relative mx-auto border border-white/30 rounded-full" style={{ width: canvasSize, height: canvasSize }}>
              <div className="stage-2">
                <div className="mandala-breathing-light breathing-glow-middle" />
              </div>
            </div>
          </div>
          
          {/* Outer Glow - 120% */}
          <div className="text-center">
            <h3 className="text-white mb-4">外圈光圈 (120%)</h3>
            <div className="relative mx-auto border border-white/30 rounded-full" style={{ width: canvasSize, height: canvasSize }}>
              <div className="stage-3">
                <div className="mandala-breathing-light breathing-glow-outer" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Combined view */}
        <div className="mt-12 text-center">
          <h3 className="text-white mb-4 text-xl">所有光圈叠加效果</h3>
          <div className="relative mx-auto border border-white/30 rounded-full" style={{ width: canvasSize * 1.2, height: canvasSize * 1.2 }}>
            <div className="stage-0">
              <div className="mandala-breathing-light breathing-glow-outer" />
              <div className="mandala-breathing-light breathing-glow-middle" />
              <div className="mandala-breathing-light breathing-glow-inner" />
              <div className="mandala-breathing-light breathing-glow-core" />
            </div>
            {/* Canvas representation */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/50 rounded-full bg-black/20"
              style={{ width: canvasSize, height: canvasSize }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/70 text-sm">
                Canvas Area
              </div>
            </div>
          </div>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            白色圆圈代表canvas绘画区域。120%光圈超出整个canvas，为用户的宇宙慈悲绘画提供更加扩展的呼吸引导。
          </p>
        </div>
        
        {/* Size specifications */}
        <div className="mt-8 bg-white/10 rounded-lg p-6">
          <h4 className="text-white text-lg mb-4">光圈规格与亮度设定</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-orange-300 font-medium">核心光圈</div>
              <div className="text-white/70">36% × 36%</div>
              <div className="text-white/60">Stage0: 0.3</div>
              <div className="text-white/60">其他: 隐藏</div>
            </div>
            <div className="text-center">
              <div className="text-pink-300 font-medium">内圈光圈</div>
              <div className="text-white/70">60% × 60%</div>
              <div className="text-white/60">Stage0: 0.2</div>
              <div className="text-white/60">Stage1: 0.3</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-300 font-medium">中圈光圈</div>
              <div className="text-white/70">90% × 90%</div>
              <div className="text-white/60">Stage0: 0.15, Stage1: 0.2</div>
              <div className="text-white/60">Stage2: 0.3</div>
            </div>
            <div className="text-center">
              <div className="text-purple-300 font-medium">外圈光圈</div>
              <div className="text-white/70">120% × 120%</div>
              <div className="text-white/60">Stage1: 0.15, Stage2: 0.2</div>
              <div className="text-white/60">Stage3: 0.3</div>
            </div>
          </div>
        </div>
        
        {/* Stage-specific brightness table */}
        <div className="mt-6 bg-white/5 rounded-lg p-4">
          <h4 className="text-white text-base mb-4">各阶段光圈亮度设定表</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-white/80">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2">阶段</th>
                  <th className="text-center p-2">🟠 核心<br/>(36%)</th>
                  <th className="text-center p-2">🟡 内圈<br/>(60%)</th>
                  <th className="text-center p-2">🟢 中圈<br/>(90%)</th>
                  <th className="text-center p-2">🔵 外圈<br/>(120%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-2">
                    <div className="text-orange-300 font-medium">Stage 0</div>
                    <div className="text-white/60">自我慈悲</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.3</div>
                    <div className="text-white/60">显示</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.2</div>
                    <div className="text-white/60">显示</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.15</div>
                    <div className="text-white/60">显示</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2">
                    <div className="text-pink-300 font-medium">Stage 1</div>
                    <div className="text-white/60">爱人慈悲</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.3</div>
                    <div className="text-white/60">显示</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.2</div>
                    <div className="text-white/60">显示</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.15</div>
                    <div className="text-white/60">显示</div>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2">
                    <div className="text-emerald-300 font-medium">Stage 2</div>
                    <div className="text-white/60">困难人物</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.3</div>
                    <div className="text-white/60">显示</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.2</div>
                    <div className="text-white/60">显示</div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <div className="text-purple-300 font-medium">Stage 3</div>
                    <div className="text-white/60">宇宙慈悲</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                  <td className="text-center p-2 bg-red-500/20 rounded">
                    <div className="font-medium">0</div>
                    <div className="text-white/60">隐藏</div>
                  </td>
                  <td className="text-center p-2 bg-green-500/20 rounded">
                    <div className="font-medium">0.3</div>
                    <div className="text-white/60">显示</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500/40 rounded"></div>
                <span>显示光圈</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500/40 rounded"></div>
                <span>隐藏光圈</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}