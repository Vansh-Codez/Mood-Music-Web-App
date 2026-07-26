'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mood, MOOD_COLORS } from '@/lib/mood-engine';

const NOTES = ['🎵', '🎶', '🎸', '🎧', '🎹', '🎼', '🎷'];

export default function AmbientBackground({ mood }: { mood: Mood | null }) {
  const colorClass = mood ? MOOD_COLORS[mood] : 'bg-gray-800';
  
  const [elements, setElements] = useState<{ id: number; icon: string; left: string; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    // Generate random music notes only on the client to avoid hydration mismatch
    const arr = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      icon: NOTES[Math.floor(Math.random() * NOTES.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 20, // 12 to 32 seconds to drift up
      size: 20 + Math.random() * 30, // 20px to 50px
    }));
    setElements(arr);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0b1120]">
      
      {/* Dynamic Background Glow */}
      <motion.div
        key={mood || 'default'}
        className={`absolute inset-0 opacity-40 blur-[100px] ${colorClass}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Floating Music Notes */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          style={{ left: el.left, fontSize: el.size }}
          initial={{ y: '100vh', opacity: 0, rotate: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.5, 1, 0.5, 0], 
            rotate: [0, 90, 180, 270, 360] 
          }}
          transition={{ 
            duration: el.duration, 
            delay: el.delay, 
            repeat: Infinity,
            ease: 'linear' 
          }}
        >
          {el.icon}
        </motion.div>
      ))}
      
      {/* Dark gradient overlay for a polished look */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1120]/50 to-[#0b1120] pointer-events-none" />
    </div>
  );
}
