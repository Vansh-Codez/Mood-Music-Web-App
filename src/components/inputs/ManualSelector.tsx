'use client';
import { MOODS, Mood } from '@/lib/mock-database';
import { Smile, Frown, Zap, Coffee, Target, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodMeta {
  icon: React.ReactNode;
  emoji: string;
  tagline: string;
  colorName: string;
  accentText: string;
  cardGradient: string;
  activeGradient: string;
  activeBorder: string;
  activeGlow: string;
  hoverBorder: string;
  hoverGlow: string;
}

const MOOD_CONFIG: Record<Mood, MoodMeta> = {
  Happy: {
    icon: <Smile size={26} />,
    emoji: '😊',
    tagline: 'Joy & Celebration',
    colorName: 'Amber Yellow',
    accentText: 'text-amber-300',
    cardGradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    activeGradient: 'bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 text-slate-950 font-bold',
    activeBorder: 'border-amber-300/80',
    activeGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.5)]',
    hoverBorder: 'hover:border-amber-400/50',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]'
  },
  Sad: {
    icon: <Frown size={26} />,
    emoji: '🥺',
    tagline: 'Melancholy & Comfort',
    colorName: 'Ocean Blue',
    accentText: 'text-blue-300',
    cardGradient: 'from-blue-600/10 via-indigo-600/5 to-transparent',
    activeGradient: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white font-bold',
    activeBorder: 'border-blue-300/80',
    activeGlow: 'shadow-[0_0_35px_rgba(59,130,246,0.5)]',
    hoverBorder: 'hover:border-blue-400/50',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]'
  },
  Energetic: {
    icon: <Zap size={26} />,
    emoji: '⚡',
    tagline: 'High Power & Gym',
    colorName: 'Electric Orange',
    accentText: 'text-orange-300',
    cardGradient: 'from-orange-500/10 via-red-500/5 to-transparent',
    activeGradient: 'bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 text-white font-bold',
    activeBorder: 'border-orange-300/80',
    activeGlow: 'shadow-[0_0_35px_rgba(249,115,22,0.5)]',
    hoverBorder: 'hover:border-orange-400/50',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]'
  },
  Calm: {
    icon: <Coffee size={26} />,
    emoji: '☕',
    tagline: 'Chill & Peaceful',
    colorName: 'Serene Teal',
    accentText: 'text-teal-300',
    cardGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    activeGradient: 'bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600 text-white font-bold',
    activeBorder: 'border-teal-300/80',
    activeGlow: 'shadow-[0_0_35px_rgba(20,184,166,0.5)]',
    hoverBorder: 'hover:border-teal-400/50',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(20,184,166,0.2)]'
  },
  Focused: {
    icon: <Target size={26} />,
    emoji: '🎯',
    tagline: 'Deep Work & Study',
    colorName: 'Cyber Purple',
    accentText: 'text-purple-300',
    cardGradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    activeGradient: 'bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 text-white font-bold',
    activeBorder: 'border-purple-300/80',
    activeGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.5)]',
    hoverBorder: 'hover:border-purple-400/50',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]'
  },
  Stressed: {
    icon: <AlertCircle size={26} />,
    emoji: '😫',
    tagline: 'Decompress & Vent',
    colorName: 'Crimson Rose',
    accentText: 'text-rose-300',
    cardGradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    activeGradient: 'bg-gradient-to-br from-rose-600 via-red-600 to-orange-600 text-white font-bold',
    activeBorder: 'border-rose-300/80',
    activeGlow: 'shadow-[0_0_35px_rgba(239,68,68,0.5)]',
    hoverBorder: 'hover:border-rose-400/50',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]'
  }
};

export default function ManualSelector({
  onMoodSelect,
  currentMood
}: {
  onMoodSelect: (mood: Mood, reason: string) => void;
  currentMood: Mood | null;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full max-w-2xl mx-auto">
      {MOODS.map((mood) => {
        const isActive = currentMood === mood;
        const config = MOOD_CONFIG[mood];

        return (
          <button
            key={mood}
            onClick={() => onMoodSelect(mood, `Selected: ${mood} playlist`)}
            className={cn(
              "group relative flex flex-col items-center justify-between p-5 md:p-6 rounded-3xl transition-all duration-300 overflow-hidden text-center border",
              isActive
                ? cn(
                    config.activeGradient,
                    config.activeBorder,
                    config.activeGlow,
                    "scale-[1.03] ring-2 ring-white/30"
                  )
                : cn(
                    "bg-[#131b2e]/80 backdrop-blur-xl border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:-translate-y-1",
                    config.hoverBorder,
                    config.hoverGlow
                  )
            )}
          >
            {/* Background subtle atmospheric gradient glow */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b opacity-60 pointer-events-none transition-opacity duration-300",
                config.cardGradient,
                isActive ? "opacity-100" : "group-hover:opacity-100"
              )}
            />

            {/* Top Bar: Icon & Active State Indicator */}
            <div className="w-full flex items-center justify-between relative z-10 mb-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md",
                  isActive
                    ? mood === 'Happy'
                      ? "bg-slate-900/30 text-slate-950 backdrop-blur-sm"
                      : "bg-white/20 text-white backdrop-blur-sm"
                    : "bg-white/5 border border-white/10 text-gray-400 group-hover:text-white group-hover:scale-110 group-hover:border-white/20"
                )}
              >
                {config.icon}
              </div>

              {isActive ? (
                <div
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm animate-pulse",
                    mood === 'Happy'
                      ? "bg-slate-950/20 text-slate-950"
                      : "bg-white/25 text-white"
                  )}
                >
                  <Sparkles size={11} />
                  <span>Active</span>
                </div>
              ) : (
                <span className="text-xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  {config.emoji}
                </span>
              )}
            </div>

            {/* Bottom Content: Name & Tagline */}
            <div className="w-full flex flex-col items-start text-left relative z-10 mt-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-lg md:text-xl font-bold tracking-tight transition-colors",
                    isActive
                      ? mood === 'Happy'
                        ? "text-slate-950"
                        : "text-white"
                      : "text-gray-100 group-hover:text-white"
                  )}
                >
                  {mood}
                </span>
                {isActive && (
                  <span className="text-sm">
                    {config.emoji}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-0.5 line-clamp-1 transition-colors",
                  isActive
                    ? mood === 'Happy'
                      ? "text-slate-900/80 font-medium"
                      : "text-white/80 font-medium"
                    : "text-gray-400 group-hover:text-gray-300"
                )}
              >
                {config.tagline}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
