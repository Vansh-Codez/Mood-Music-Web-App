'use client';
import { MOODS, Mood } from '@/lib/mock-database';
import { Smile, Frown, Zap, Coffee, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOOD_COLORS } from '@/lib/mood-engine';

const MOOD_ICONS: Record<Mood, React.ReactNode> = {
  Happy: <Smile size={24} />,
  Sad: <Frown size={24} />,
  Energetic: <Zap size={24} />,
  Calm: <Coffee size={24} />,
  Focused: <Target size={24} />,
  Stressed: <AlertCircle size={24} />
};

export default function ManualSelector({ onMoodSelect, currentMood }: { onMoodSelect: (mood: Mood, reason: string) => void, currentMood: Mood | null }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl mx-auto">
      {MOODS.map((mood) => {
        const isActive = currentMood === mood;
        return (
          <button
            key={mood}
            onClick={() => onMoodSelect(mood, `Manually selected: ${mood}`)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300",
              isActive 
                ? `bg-blue-500 text-white shadow-[0_10px_30px_rgba(59,130,246,0.3)] scale-105` 
                : "bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
            )}
          >
            <div className={cn("p-3 rounded-full mb-3", isActive ? "bg-white/20" : "bg-black/20")}>
              {MOOD_ICONS[mood]}
            </div>
            <span className="font-semibold">{mood}</span>
          </button>
        );
      })}
    </div>
  );
}
