export type Mood = 'Happy' | 'Sad' | 'Energetic' | 'Calm' | 'Focused' | 'Stressed';
export const MOODS: Mood[] = ['Happy', 'Sad', 'Energetic', 'Calm', 'Focused', 'Stressed'];
export interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  moods: Mood[];
}

export const mockTracks: Track[] = [
  // Happy
  {
    id: 'h1',
    title: 'High Rated Gabru',
    artist: 'Guru Randhawa',
    youtubeId: 'hjWf8A0YNSE',
    moods: ['Happy', 'Energetic'],
  },
  {
    id: 'h2',
    title: 'Galti Se Mistake',
    artist: 'Arijit Singh',
    youtubeId: '05TA9jNnCdU',
    moods: ['Happy', 'Energetic'],
  },
  {
    id: 'h3',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal',
    youtubeId: 'II2EO3Nw4m0',
    moods: ['Happy', 'Energetic'],
  },
  
  // Sad
  {
    id: 's1',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    youtubeId: 'Umqb9KENgmk',
    moods: ['Sad'],
  },
  {
    id: 's2',
    title: 'Channa Mereya',
    artist: 'Arijit Singh',
    youtubeId: 'bzSTpdcs-EI',
    moods: ['Sad'],
  },
  {
    id: 's3',
    title: 'Kabira',
    artist: 'Arijit Singh, Harshdeep Kaur',
    youtubeId: 'jHNNMj5bNQw',
    moods: ['Sad', 'Calm'],
  },

  // Energetic
  {
    id: 'e1',
    title: 'Lahore',
    artist: 'Guru Randhawa',
    youtubeId: 'dZ0fwJvkhrs',
    moods: ['Energetic', 'Happy'],
  },
  {
    id: 'e2',
    title: 'Suit Suit',
    artist: 'Guru Randhawa',
    youtubeId: 'uQ763Vvjqcg',
    moods: ['Energetic', 'Happy'],
  },
  {
    id: 'e3',
    title: 'Malhari',
    artist: 'Vishal Dadlani',
    youtubeId: 'l_MyUGq7pgs',
    moods: ['Energetic'],
  },

  // Calm
  {
    id: 'c1',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan',
    youtubeId: 'mt9xg0vanxA',
    moods: ['Calm', 'Focused'],
  },
  {
    id: 'c2',
    title: 'Raabta',
    artist: 'Arijit Singh',
    youtubeId: 'pjTj-_55WZ8',
    moods: ['Calm', 'Focused'],
  },
  {
    id: 'c3',
    title: 'Iktara',
    artist: 'Kavita Seth',
    youtubeId: 'fB8q5qwOUB4',
    moods: ['Calm', 'Happy'],
  },

  // Focused
  {
    id: 'f1',
    title: 'Ilahi',
    artist: 'Arijit Singh',
    youtubeId: 'fdubeMFwuZI',
    moods: ['Focused', 'Energetic'],
  },
  {
    id: 'f2',
    title: 'Safarnama',
    artist: 'Lucky Ali',
    youtubeId: 'z3E6wO9T7wI',
    moods: ['Focused', 'Calm'],
  },
  {
    id: 'f3',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman',
    youtubeId: 'T94PHkuydcw',
    moods: ['Focused', 'Calm', 'Sad'],
  },

  // Stressed (Soothing Relief)
  {
    id: 'str1',
    title: 'Khairiyat',
    artist: 'Arijit Singh',
    youtubeId: 'hoNb6HuNmU0',
    moods: ['Stressed', 'Sad'],
  },
  {
    id: 'str2',
    title: 'Agar Tum Saath Ho',
    artist: 'Arijit Singh, Alka Yagnik',
    youtubeId: 'sK7riqg2mrA',
    moods: ['Stressed', 'Sad', 'Calm'],
  },
  {
    id: 'str3',
    title: 'Kal Ho Naa Ho',
    artist: 'Sonu Nigam',
    youtubeId: 'g0eO74OmFQg',
    moods: ['Stressed', 'Calm'],
  }
];
