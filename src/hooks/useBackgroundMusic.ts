import { useEffect, useRef } from 'react';
import backgroundMusic from '../assets/Background_music.mp3';

export function useBackgroundMusic(audioEnabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 创建音频元素
    if (!audioRef.current) {
      audioRef.current = new Audio(backgroundMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2; // 设置较低的音量
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;

    // 当音频状态改变时，播放或暂停音乐
    if (audioEnabled) {
      // 尝试播放音乐，如果失败则静默处理
      audio.play().catch((error) => {
        console.log('Background music play failed:', error);
        // 在用户交互后重试播放
        const retryPlay = () => {
          audio.play().catch(() => {});
          document.removeEventListener('click', retryPlay);
          document.removeEventListener('touchstart', retryPlay);
        };
        document.addEventListener('click', retryPlay);
        document.addEventListener('touchstart', retryPlay);
      });
    } else {
      audio.pause();
    }

    // 清理函数
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audioEnabled]);

  // 组件卸载时清理音频
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return audioRef.current;
}
