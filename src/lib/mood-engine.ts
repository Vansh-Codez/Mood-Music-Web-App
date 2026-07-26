import { Track, mockTracks, Mood } from './mock-database';
export type { Mood };

export function getQueueForMood(mood: Mood): Track[] {
  const matchingTracks = mockTracks.filter((track) => track.moods.includes(mood));
  
  if (matchingTracks.length === 0) return [];

  // Fisher-Yates shuffle
  const shuffled = [...matchingTracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function analyzeTextToMood(text: string): Mood {
  const lower = text.toLowerCase();
  
  if (lower.includes('happy') || lower.includes('joy') || lower.includes('great')) return 'Happy';
  if (lower.includes('sad') || lower.includes('cry') || lower.includes('down')) return 'Sad';
  if (lower.includes('energy') || lower.includes('ready') || lower.includes('pumped') || lower.includes('gym')) return 'Energetic';
  if (lower.includes('calm') || lower.includes('relax') || lower.includes('chill') || lower.includes('sleep')) return 'Calm';
  if (lower.includes('focus') || lower.includes('study') || lower.includes('work') || lower.includes('code')) return 'Focused';
  if (lower.includes('stress') || lower.includes('anx') || lower.includes('exam') || lower.includes('overwhelm')) return 'Stressed';
  
  return 'Calm';
}

export const MOOD_COLORS: Record<Mood, string> = {
  Happy: 'bg-yellow-500',
  Sad: 'bg-blue-600',
  Energetic: 'bg-orange-500',
  Calm: 'bg-teal-400',
  Focused: 'bg-purple-500',
  Stressed: 'bg-red-500'
};

