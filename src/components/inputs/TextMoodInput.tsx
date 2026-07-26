'use client';
import { useState } from 'react';
import { analyzeTextToMood } from '@/lib/mood-engine';
import { Mood } from '@/lib/mock-database';
import { Sparkles } from 'lucide-react';

export default function TextMoodInput({ onMoodSelect }: { onMoodSelect: (mood: Mood, reason: string) => void }) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const mood = analyzeTextToMood(text);
    onMoodSelect(mood, `Based on your text: "${text}"`);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Let's celebrate! 🎉"
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-inner"
      />
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <Sparkles size={18} className="text-yellow-300" />
          Detect My Mood
        </button>
      </div>
    </form>
  );
}
