import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface AudioToggleProps {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  className?: string;
}

export function AudioToggle({ audioEnabled, setAudioEnabled, className = "" }: AudioToggleProps) {
  // 使用背景音乐hook
  useBackgroundMusic(audioEnabled);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`absolute top-6 right-6 z-30 ${className}`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
      >
        {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>
    </motion.div>
  );
}