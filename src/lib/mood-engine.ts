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

// -------------------------------------------------------------
// Advanced Multi-Signal Emotion & Sentiment Engine
// -------------------------------------------------------------

interface MoodPattern {
  mood: Mood;
  phrases: string[]; // multi-word high-confidence indicators (+8)
  keywords: string[]; // single word / root indicators (+3)
  emojis: string[]; // emotion emojis (+5)
}

const MOOD_PATTERNS: MoodPattern[] = [
  {
    mood: 'Sad',
    phrases: [
      'lost a match', 'lost the match', 'lost my match', 'lost a game', 'lost the game',
      'we lost', 'i lost', 'lost today', 'lost everything', 'lost someone', 'lost hope',
      'got defeated', 'were defeated', 'lost the final', 'lost the tournament',
      'broke up', 'broken up', 'break up', 'got dumped', 'dumped me',
      'broken heart', 'heart broken', 'heartbroken', 'broken hearted',
      'failed my', 'failed the', 'failed an', 'feeling down', 'feel down',
      'feeling low', 'feel low', 'feeling blue', 'feel blue', 'down in the dumps',
      'bad day', 'worst day', 'terrible day', 'awful day', 'horrible day', 'ruined my day',
      'miss him', 'miss her', 'miss them', 'miss you', 'hurts so much', 'it hurts',
      'crying myself', 'burst into tears', 'tears in my eyes', 'heavy heart',
      'all alone', 'feel alone', 'feeling alone', 'nobody to talk to', 'no one cares',
      'passed away', 'got rejected', 'job rejection', 'hopeless situation', 'gave up',
      'bummed out', 'unhappy with life', 'feeling worthless', 'crying all day'
    ],
    keywords: [
      'sad', 'sadness', 'saddened', 'cry', 'crying', 'cried', 'tear', 'tears',
      'weep', 'weeping', 'sob', 'sobbing', 'depressed', 'depression', 'depressing',
      'unhappy', 'sorrow', 'miserable', 'misery', 'gloomy', 'gloom', 'grief',
      'grieving', 'mourn', 'mourning', 'devastated', 'shattered', 'crushed',
      'lonely', 'loneliness', 'alone', 'isolated', 'abandoned', 'rejected', 'rejection',
      'hopeless', 'helpless', 'disappointed', 'disappointment', 'bummed',
      'downhearted', 'dejected', 'hurt', 'hurting', 'pain', 'painful',
      'melancholy', 'regret', 'remorse', 'upset', 'tragic', 'loss', 'losses',
      'lost', 'losing', 'loser', 'defeat', 'defeated', 'fail', 'failed', 'failing', 'failure'
    ],
    emojis: ['😢', '😭', '🥺', '💔', '😞', '😔', '🙁', '☹️', '😿', '🌧️', ':(', ":'(", ':/', ':[']
  },
  {
    mood: 'Happy',
    phrases: [
      'won a match', 'won the match', 'won my match', 'won a game', 'won the game',
      'we won', 'i won', 'won first', 'first place', 'got first', 'gold medal',
      'passed my exam', 'passed the exam', 'passed my test', 'passed the test',
      'got the job', 'got hired', 'got promoted', 'got accepted', 'aced the',
      'best day', 'amazing day', 'wonderful day', 'great day', 'feeling great',
      'feel great', 'feel good', 'feeling good', 'on cloud nine', 'over the moon',
      'love life', 'love my life', 'good mood', 'happy birthday', 'celebrate tonight',
      "let's celebrate", 'lets celebrate', 'time to celebrate', 'so proud of',
      'congrats', 'congratulations', 'won the final', 'won the tournament',
      'full of joy', 'made my day'
    ],
    keywords: [
      'happy', 'happily', 'happiness', 'joy', 'joyful', 'joyfully', 'cheerful', 'cheer', 'cheering',
      'glad', 'gladly', 'delighted', 'ecstatic', 'thrilled', 'excited', 'excitement',
      'celebrate', 'celebrating', 'celebration', 'yay', 'hurray', 'hooray', 'woohoo',
      'awesome', 'amazing', 'wonderfully', 'wonderful', 'fantastic', 'great', 'superb',
      'marvelous', 'brilliant', 'blessed', 'grateful', 'gratitude', 'radiant',
      'smile', 'smiling', 'smiles', 'laugh', 'laughing', 'laughter', 'hilarious',
      'won', 'win', 'winner', 'winning', 'victory', 'victorious', 'triumph',
      'champion', 'success', 'successful', 'succeeded', 'bliss', 'blissful',
      'content', 'elated', 'pleased', 'fun', 'uplifted', 'lucky'
    ],
    emojis: ['😊', '😄', '😃', '😁', '😆', '🎉', '🥳', '✨', '🌟', '❤️', '💖', '🥰', '🤩', ':)', ':-)', ':D', '<3']
  },
  {
    mood: 'Energetic',
    phrases: [
      'hit the gym', 'going to the gym', 'at the gym', 'beast mode', 'pumped up',
      "let's go", 'lets go', 'pump iron', 'working out', 'going for a run',
      'leg day', 'chest day', 'cardio day', 'full of energy', 'burst of energy',
      'hype is real', 'turn up', 'ready to rock', 'ready to conquer',
      'power up', 'high energy', 'dance floor', 'party hard', 'crush it today'
    ],
    keywords: [
      'energy', 'energetic', 'hyped', 'hype', 'pumped', 'workout', 'gym',
      'lifting', 'weights', 'cardio', 'running', 'run', 'runner', 'jogging',
      'sprint', 'sprinting', 'exercise', 'exercising', 'fitness', 'crossfit', 'athletic',
      'party', 'partying', 'club', 'clubbing', 'rave', 'raving', 'dance',
      'dancing', 'dancer', 'dynamite', 'lit', 'fire', 'amped', 'electrified',
      'adrenaline', 'unstoppable', 'power', 'powerful', 'hyper', 'blast',
      'speed', 'fast', 'intense', 'vitality', 'dynamism', 'jump', 'jumping'
    ],
    emojis: ['⚡', '🏃', '🏃‍♂️', '🏃‍♀️', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🔥', '💥', '💃', '🕺', '🚀', '🦾', '💯']
  },
  {
    mood: 'Stressed',
    phrases: [
      'stressed out', 'stressing out', 'panic attack', 'freaking out', 'freaked out',
      'too much pressure', 'under pressure', "can't take it", 'cant take it',
      'exam tomorrow', 'test tomorrow', 'exams coming', 'deadlines approaching',
      'running out of time', 'behind schedule', 'buried in work', 'swamped with',
      'too much work', 'burn out', 'burned out', 'burning out', 'losing my mind',
      'nervous wreck', 'pissed off', 'mad at', 'so annoyed with', "can't deal",
      'cant deal', 'overwhelmed by', 'breaking down', "can't focus", 'cant focus',
      "can't sleep", 'cant sleep', 'head is spinning'
    ],
    keywords: [
      'stress', 'stressed', 'stressful', 'stressing', 'anxious', 'anxiously', 'anxiety', 'panic',
      'panicking', 'panicky', 'panicked', 'overwhelmed', 'overwhelming', 'pressure',
      'pressured', 'tense', 'tension', 'nervous', 'nervously', 'nervousness', 'jittery',
      'restless', 'freaking', 'freaked', 'deadline', 'deadlines', 'overloaded', 'swamped',
      'hectic', 'chaos', 'chaotic', 'exhausted', 'exhaustion', 'burnout',
      'headache', 'migraine', 'irritated', 'irritating', 'annoyed', 'annoying',
      'frustrated', 'frustration', 'pissed', 'mad', 'angry', 'anger',
      'furious', 'infuriated', 'screwed', 'desperate', 'breakdown'
    ],
    emojis: ['😫', '😩', '😰', '😨', '😱', '😤', '😡', '🤬', '🤯', '🥵', '😖']
  },
  {
    mood: 'Focused',
    phrases: [
      'in the zone', 'flow state', 'deep work', 'study session', 'coding session',
      'finish this assignment', 'preparing for interview', 'prep for interview',
      'solving problems', 'debugging code', 'writing code', 'study for exams',
      'studying for exam', 'grinding hard', 'stay focused', 'lock in', 'locked in',
      'working on project', 'working on my', 'head down work'
    ],
    keywords: [
      'focus', 'focused', 'focusing', 'concentrate', 'concentrating', 'concentration',
      'study', 'studying', 'studies', 'homework', 'assignment', 'revision',
      'revising', 'read', 'reading', 'write', 'writing', 'essay', 'thesis',
      'code', 'coding', 'coder', 'programmer', 'programming', 'developer',
      'debugging', 'debug', 'grind', 'grinding', 'solve', 'solving',
      'productivity', 'productive', 'analyze', 'analyzing', 'research',
      'researching', 'learn', 'learning', 'office', 'logic'
    ],
    emojis: ['🎯', '💻', '📚', '✍️', '🧠', '🧐', '🔬', '📖', '🧑‍💻']
  },
  {
    mood: 'Calm',
    phrases: [
      'chill out', 'chilling out', 'take it easy', 'taking it easy', 'slow down',
      'cup of tea', 'cup of coffee', 'peace and quiet', 'winding down',
      'wind down', 'unwind after', 'ready for bed', 'going to sleep',
      'nap time', 'nature walk', 'lying in bed', 'laying in bed', 'hot bath',
      'watching the sunset', 'quiet evening'
    ],
    keywords: [
      'calm', 'calming', 'calmly', 'relax', 'relaxed', 'relaxing', 'relaxation',
      'peace', 'peaceful', 'peacefully', 'serene', 'serenity', 'chill',
      'chilling', 'chilled', 'tranquil', 'tranquility', 'zen', 'unwind',
      'unwinding', 'mellow', 'quiet', 'quietly', 'silence', 'silent', 'soothe',
      'soothing', 'soft', 'gentle', 'gently', 'breathe', 'breathing', 'meditate',
      'meditation', 'mindful', 'mindfulness', 'rest', 'resting', 'sleep',
      'sleeping', 'sleepy', 'nap', 'napping', 'cozy', 'comfort', 'comfortable',
      'comforting', 'tea', 'coffee', 'breeze', 'ambient'
    ],
    emojis: ['☕', '🧘', '🌿', '🍃', '☁️', '🕊️', '🌅', '🌌', '🛋️', '😌', '😴']
  }
];

const NEGATION_WORDS = new Set([
  'not', 'no', 'never', 'hardly', 'barely', 'scarcely',
  'cant', 'cannot', 'dont', 'didnt',
  'wasnt', 'isnt', 'arent',
  'wont', 'wouldnt', 'couldnt',
  'without'
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\bcan['’]?t\b/g, 'cannot')
    .replace(/\bwon['’]?t\b/g, 'wont')
    .replace(/\b(don|didn|wasn|isn|aren|wouldn|couldn|shouldn)['’]t\b/g, '$1t')
    .replace(/['’]m\b/g, ' am')
    .replace(/['’]s\b/g, ' is')
    .replace(/['’]re\b/g, ' are')
    .replace(/['’]ll\b/g, ' will')
    .replace(/['’]ve\b/g, ' have')
    .replace(/['’]d\b/g, ' would');
}

export interface MoodAnalysisResult {
  mood: Mood;
  reason: string;
  score: number;
  signals: string[];
}

export function analyzeTextWithDetails(rawText: string): MoodAnalysisResult {
  const normalized = normalizeText(rawText);
  const scores: Record<Mood, number> = {
    Happy: 0,
    Sad: 0,
    Energetic: 0,
    Calm: 0,
    Focused: 0,
    Stressed: 0
  };
  const matchedSignals: Record<Mood, string[]> = {
    Happy: [],
    Sad: [],
    Energetic: [],
    Calm: [],
    Focused: [],
    Stressed: []
  };

  // 1. Multi-word phrase matching (highest weight: +8)
  for (const pattern of MOOD_PATTERNS) {
    for (const phrase of pattern.phrases) {
      if (normalized.includes(phrase) || rawText.toLowerCase().includes(phrase)) {
        scores[pattern.mood] += 8;
        matchedSignals[pattern.mood].push(`"${phrase}"`);
      }
    }
  }

  // 2. Tokenize words and test negation & keywords
  const rawWords = normalized
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (let i = 0; i < rawWords.length; i++) {
    const word = rawWords[i];

    // Check if preceded by a negation word within 3 tokens
    const isNegated = (
      (i > 0 && NEGATION_WORDS.has(rawWords[i - 1])) ||
      (i > 1 && NEGATION_WORDS.has(rawWords[i - 2])) ||
      (i > 2 && NEGATION_WORDS.has(rawWords[i - 3]))
    );

    for (const pattern of MOOD_PATTERNS) {
      if (pattern.keywords.includes(word)) {
        if (isNegated) {
          // If negated, reverse emotional valence
          if (pattern.mood === 'Happy') {
            scores.Sad += 4;
            scores.Happy -= 3;
            matchedSignals.Sad.push(`not ${word}`);
          } else if (pattern.mood === 'Sad') {
            scores.Happy += 3;
            scores.Sad -= 3;
            matchedSignals.Happy.push(`not ${word}`);
          } else if (pattern.mood === 'Stressed') {
            scores.Calm += 4;
            scores.Stressed -= 3;
            matchedSignals.Calm.push(`not ${word}`);
          } else if (pattern.mood === 'Calm') {
            scores.Stressed += 4;
            scores.Calm -= 3;
            matchedSignals.Stressed.push(`not ${word}`);
          } else if (pattern.mood === 'Focused') {
            scores.Stressed += 4;
            scores.Focused -= 3;
            matchedSignals.Stressed.push(`not ${word}`);
          }
        } else {
          scores[pattern.mood] += 3;
          matchedSignals[pattern.mood].push(word);
        }
      }
    }
  }

  // 3. Emoji matching (+5 weight)
  for (const pattern of MOOD_PATTERNS) {
    for (const emoji of pattern.emojis) {
      if (rawText.includes(emoji)) {
        scores[pattern.mood] += 5;
        matchedSignals[pattern.mood].push(emoji);
      }
    }
  }

  // Find highest mood
  let bestMood: Mood = 'Calm';
  let highestScore = -Infinity;

  const moods: Mood[] = ['Sad', 'Happy', 'Energetic', 'Stressed', 'Focused', 'Calm'];
  let anyPositiveScore = false;

  for (const mood of moods) {
    if (scores[mood] > 0) anyPositiveScore = true;
    if (scores[mood] > highestScore) {
      highestScore = scores[mood];
      bestMood = mood;
    }
  }

  if (!anyPositiveScore) {
    return {
      mood: 'Calm',
      reason: `Could not detect strong emotional signals; playing a relaxing Calm playlist`,
      score: 0,
      signals: []
    };
  }

  const signals = matchedSignals[bestMood];
  const uniqueSignals = Array.from(new Set(signals)).slice(0, 3);
  const reason = uniqueSignals.length > 0
    ? `Detected ${bestMood} vibe (${uniqueSignals.join(', ')})`
    : `Detected ${bestMood} mood from your text`;

  return { mood: bestMood, reason, score: highestScore, signals: uniqueSignals };
}

export function analyzeTextToMood(text: string): Mood {
  return analyzeTextWithDetails(text).mood;
}

export const MOOD_COLORS: Record<Mood, string> = {
  Happy: 'bg-yellow-500',
  Sad: 'bg-blue-600',
  Energetic: 'bg-orange-500',
  Calm: 'bg-teal-400',
  Focused: 'bg-purple-500',
  Stressed: 'bg-red-500'
};
