'use client';
import { useState } from 'react';
import { analyzeTextWithDetails } from '@/lib/mood-engine';
import { Mood } from '@/lib/mock-database';
import { Sparkles } from 'lucide-react';

const QUICK_EXAMPLES = [
  { label: 'Lost a match today 🥺', text: 'I lost a match today and feel so sad' },
  { label: 'Celebrating victory! 🎉', text: 'We won the championship! Time to celebrate!' },
  { label: 'Going to the gym 🔥', text: 'Pumped up for a heavy workout session at the gym' },
  { label: 'Stressed about exams 😫', text: 'I have an exam tomorrow and I am freaking out' },
  { label: 'Deep focus coding 🎯', text: 'Deep work mode: studying and debugging code' },
  { label: 'Relaxing with tea ☕', text: 'Unwinding with a warm cup of tea and soothing music' },
];

export default function TextMoodInput({ onMoodSelect }: { onMoodSelect: (mood: Mood, reason: string) => void }) {
  const [text, setText] = useState('');

  const processMood = (inputText: string) => {
    if (!inputText.trim()) return;
    const result = analyzeTextWithDetails(inputText);
    onMoodSelect(result.mood, result.reason);
    setText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processMood(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processMood(text);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How are you feeling right now? (e.g., 'I lost a match today', 'Pumped for a workout', 'Deep focus coding')..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-inner text-sm md:text-base"
        />

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center mr-1">Quick ideas:</span>
          {QUICK_EXAMPLES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(item.text);
                processMood(item.text);
              }}
              className="text-xs bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex justify-start mt-1">
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95"
          >
            <Sparkles size={18} className="text-yellow-300" />
            Detect My Mood
          </button>
        </div>
      </form>
    </div>
  );
}
