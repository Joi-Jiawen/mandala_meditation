import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeScreen } from './components/HomeScreen';
import { IntroTutorial } from './components/IntroTutorial';
import { PreparationStage } from './components/PreparationStage';
import { DrawingStage } from './components/DrawingStage';
import { ReflectionComponent } from './components/ReflectionComponent';
import { ReleaseStage } from './components/ReleaseStage';
import { RiverView } from './components/RiverView';

import { parseMandalaData, type MandalaData } from './components/shared/MandalaRenderer';

export type AppStage = 
  | 'home'
  | 'intro'
  | 'preparation'
  | 'stage1'
  | 'preparation2'
  | 'stage2'
  | 'preparation4'
  | 'stage4'
  | 'preparation5'
  | 'stage5'
  | 'reflection'
  | 'release'
  | 'river';

export interface MandalaLayer {
  id: string;
  stage: number;
  color: string;
  paths: string[];
  intention: string;
}

// Move static data outside component to prevent recreation on every render
const STAGE_DATA = {
  stage1: {
    title: "Self-Compassion",
    description: "",
    intention: "self-compassion",
    ringIndex: 0
  },
  stage2: {
    title: "Compassion for Loved Ones", 
    description: "",
    intention: "loved-one",
    ringIndex: 1
  },
  stage4: {
    title: "Compassion for Difficult Relationships",
    description: "",
    intention: "difficult-person", 
    ringIndex: 2
  },
  stage5: {
    title: "Universal Compassion",
    description: "",
    intention: "universal",
    ringIndex: 3
  }
} as const;

// Preparation stages data for different phases
const PREPARATION_DATA = {
  preparation: {
    title: "Preparation",
    subtitle: "Beginning Your Journey",
    initialText: "Find a comfortable position. Take a few deep breaths.",
    prompt: "Let's recall warm feeling of kindness for yourself. Feeling this best wishes to start.",
    note: "Our practice follows a journey that begins with self-compassion and gradually expands to embrace all beings."
  },
  preparation2: {
    title: "Excellent",
    subtitle: "Expanding Your Heart",
    initialText: "We've finished our first layer. Take a few deep breaths.",
    prompt: "Then bring to mind someone you love dearly. Feel your gratitude and warmth toward them.",
    note: "Hold them in your heart as you prepare to create for them."
  },
  preparation4: {
    title: "Wonderful",
    subtitle: "Transforming Difficulty",
    initialText: "Breathe deeply and feel the love shared with your loved ones.",
    prompt: "Then picture someone who has upset you. Without excusing their actions, try offering them goodwill to free your own heart from anger.",
    note: "Take deep breaths and allow compassion to soften any resistance in your heart."
  },
  preparation5: {
    title: "Amazing", 
    subtitle: "Universal Embrace",
    initialText: "Take a few deep breaths and feel the strength of your growing compassion.",
    prompt: "Then embrace all living beings in your heart. Imagine your compassion expanding outward like an endless sky.",
    note: "Feel your heart expand to become as vast as the universe, embracing all beings with love."
  }
} as const;

// Final reflection after all drawing stages
const FINAL_REFLECTION = {
  title: "Reflecting on Your Journey",
  prompt: "Sit with the feeling of open, unconditional compassion. Your mandala is complete – it contains your goodwill for all beings. Notice the journey you have traveled.",
  affirmation: "Your heart has expanded. Remember that you can carry this loving feeling with you."
} as const;

const STAGE_FLOW: AppStage[] = [
  'home', 'intro', 'preparation',
  'stage1', 'preparation2',
  'stage2', 'preparation4',
  'stage4', 'preparation5',
  'stage5', 'reflection',
  'release'
] as const;

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('home');
  const [mandalaLayers, setMandalaLayers] = useState<MandalaLayer[]>([]);
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // 存储完整的曼陀罗数据，在stage4完成后生成
  const [completeMandalaData, setCompleteMandalaData] = useState<MandalaData | null>(null);

  // Add error boundary-like error state
  const [error, setError] = useState<string | null>(null);

  // Reset error when stage changes
  useEffect(() => {
    setError(null);
  }, [currentStage]);

  const nextStage = useCallback(() => {
    const currentIndex = STAGE_FLOW.indexOf(currentStage);
    if (currentIndex < STAGE_FLOW.length - 1) {
      setCurrentStage(STAGE_FLOW[currentIndex + 1]);
    }
  }, [currentStage]);

  const addMandalaLayer = useCallback((layer: MandalaLayer) => {
    setMandalaLayers(prev => {
      const newLayers = [...prev, layer];
      // 如果这是最后一个阶段(stage4，实际是第4个stage)，解析并存储完整的曼陀罗数据
      if (layer.stage === 4) {
        console.log('🎨 Final stage (4) complete, parsing final mandala data');
        const mandalaData = parseMandalaData(newLayers);
        setCompleteMandalaData(mandalaData);
        console.log('✅ Complete mandala data stored:', mandalaData);
      }
      return newLayers;
    });
  }, []);

  const addJournalEntry = useCallback((stage: string, entry: string) => {
    setJournalEntries(prev => ({ ...prev, [stage]: entry }));
  }, []);

  // Clear all stored data when returning to home
  const clearAllData = useCallback(() => {
    setMandalaLayers([]);
    setJournalEntries({});
    setCompleteMandalaData(null);
    console.log('🧹 Cleared all stored mandala and journal data');
  }, []);

  const renderCurrentStage = () => {
    try {
      switch (currentStage) {
        case 'home':
          return <HomeScreen onBeginJourney={nextStage} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />;
        
        case 'intro':
          return <IntroTutorial onComplete={nextStage} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />;
        
        case 'preparation':
        case 'preparation2':
        case 'preparation4':
        case 'preparation5':
          const prepKey = currentStage as keyof typeof PREPARATION_DATA;
          const prepData = PREPARATION_DATA[prepKey];
          if (!prepData) {
            throw new Error(`Invalid preparation stage: ${currentStage}`);
          }
          return <PreparationStage {...prepData} onComplete={nextStage} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />;
        
        case 'stage1':
        case 'stage2':
        case 'stage4':
        case 'stage5':
          const stageKey = currentStage as keyof typeof STAGE_DATA;
          const stageData = STAGE_DATA[stageKey];
          if (!stageData) {
            throw new Error(`Invalid stage: ${currentStage}`);
          }
          return (
            <DrawingStage
              {...stageData}
              mandalaLayers={mandalaLayers}
              onComplete={(layer) => {
                addMandalaLayer(layer);
                nextStage();
              }}
              audioEnabled={audioEnabled}
              setAudioEnabled={setAudioEnabled}
            />
          );
        
        case 'reflection':
          return (
            <ReflectionComponent
              {...FINAL_REFLECTION}
              mandalaLayers={mandalaLayers}
              completeMandalaData={completeMandalaData}
              onComplete={nextStage}
              onJournalEntry={(entry) => addJournalEntry(currentStage, entry)}
            />
          );
        
        case 'release':
          return (
            <ReleaseStage 
              mandalaLayers={mandalaLayers}
              completeMandalaData={completeMandalaData}
              onComplete={() => setCurrentStage('river')} 
              onReturnHome={() => {
                clearAllData();
                setCurrentStage('home');
              }}
              audioEnabled={audioEnabled}
              setAudioEnabled={setAudioEnabled}
            />
          );
        
        case 'river':
          return (
            <RiverView 
              onReturnHome={() => {
                clearAllData();
                setCurrentStage('home');
              }}
              journalEntries={journalEntries}
              audioEnabled={audioEnabled}
              setAudioEnabled={setAudioEnabled}
            />
          );
        

        
        default:
          // Also clear data when falling back to home due to errors
          clearAllData();
          return <HomeScreen onBeginJourney={nextStage} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />;
      }
    } catch (err) {
      console.error('Error rendering stage:', err);
      setError(`Error loading ${currentStage}. Returning to home.`);
      setTimeout(() => setCurrentStage('home'), 2000);
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <h2>Something went wrong</h2>
            <p className="text-muted-foreground">Returning to home screen...</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      className="w-screen h-screen h-dvh bg-gradient-to-br from-slate-50 to-blue-50 fixed inset-0"
      style={{ 
        overflow: currentStage === 'reflection' ? 'visible' : 'hidden' 
      }}
    >
      {error ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center space-y-4">
            <h2>Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: currentStage === 'release' ? 1.2 : 0.3, 
              ease: "easeInOut" 
            }}
            className="w-full h-full overflow-visible"
            style={{ overflow: currentStage === 'reflection' ? 'visible' : 'hidden' }}
          >
            {renderCurrentStage()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}