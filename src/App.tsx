import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeScreen } from './components/HomeScreen';
import { IntroTutorial } from './components/IntroTutorial';
import { PreparationStage } from './components/PreparationStage';
import { DrawingStage } from './components/DrawingStage';
import { ReflectionComponent } from './components/ReflectionComponent';
import { ReleaseStage } from './components/ReleaseStage';
import { RiverView } from './components/RiverView';
import { GlowTestPage } from './components/GlowTestPage';
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
  | 'river'
  | 'glowtest';

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
    title: "Stage 1: Self-Compassion",
    description: "",
    intention: "self-compassion",
    ringIndex: 0
  },
  stage2: {
    title: "Stage 2: Compassion for a Loved One", 
    description: "",
    intention: "loved-one",
    ringIndex: 1
  },
  stage4: {
    title: "Stage 3: Compassion for a Difficult Person",
    description: "",
    intention: "difficult-person", 
    ringIndex: 2
  },
  stage5: {
    title: "Stage 4: Universal Compassion",
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
    prompt: "Recall warm feelings of kindness for yourself – you deserve your own love.",
    note: "Let these feelings fill your heart as you prepare to create."
  },
  preparation2: {
    title: "Excellent",
    subtitle: "Expanding Your Heart",
    initialText: "Take a deep breath and feel the kindness you gave yourself.",
    prompt: "Then bring to mind someone you love dearly. Feel your gratitude and warmth for them.",
    note: "Hold this person in your heart as you prepare to create for them."
  },
  preparation4: {
    title: "Wonderful",
    subtitle: "Transforming Difficulty",
    initialText: "Take a deep breath and feel the love you shared with your dear one.",
    prompt: "Then picture someone who has upset you. You are not excusing their actions, but offering goodwill to free your heart from anger.",
    note: "Breathe deeply and let compassion soften any hardness in your heart."
  },
  preparation5: {
    title: "Amazing", 
    subtitle: "Universal Embrace",
    initialText: "Take a deep breath and feel the strength of your growing compassion.",
    prompt: "Then embrace all living beings in your heart. Imagine your compassion expanding like an endless sky.",
    note: "Feel your heart become as vast as the universe, holding all beings with love."
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

  const renderCurrentStage = () => {
    try {
      switch (currentStage) {
        case 'home':
          return <HomeScreen onBeginJourney={nextStage} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} onGlowTest={() => setCurrentStage('glowtest')} />;
        
        case 'intro':
          return <IntroTutorial onComplete={nextStage} />;
        
        case 'preparation':
        case 'preparation2':
        case 'preparation4':
        case 'preparation5':
          const prepKey = currentStage as keyof typeof PREPARATION_DATA;
          const prepData = PREPARATION_DATA[prepKey];
          if (!prepData) {
            throw new Error(`Invalid preparation stage: ${currentStage}`);
          }
          return <PreparationStage {...prepData} onComplete={nextStage} />;
        
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
              onReturnHome={() => setCurrentStage('home')}
            />
          );
        
        case 'river':
          return (
            <RiverView 
              onReturnHome={() => setCurrentStage('home')}
              journalEntries={journalEntries}
            />
          );
        
        case 'glowtest':
          return <GlowTestPage onBack={() => setCurrentStage('home')} />;
        
        default:
          return <HomeScreen onBeginJourney={nextStage} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} onGlowTest={() => setCurrentStage('glowtest')} />;
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
    <div className="w-screen h-screen h-dvh bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden fixed inset-0">
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {renderCurrentStage()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}