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
  // HAPPY / ENERGETIC (NCS & English Pop)
  { id: 't1', title: 'Fade', artist: 'Alan Walker (NCS)', youtubeId: 'bM7SZ5SBzyY', moods: ['Happy', 'Energetic'] },
  { id: 't2', title: 'Nova', artist: 'Ahrix (NCS)', youtubeId: 'J2X5mJ3HDYE', moods: ['Happy', 'Energetic'] },
  { id: 't3', title: 'Sky High', artist: 'Elektronomia (NCS)', youtubeId: 'TW9d8vYrVFQ', moods: ['Happy', 'Energetic'] },
  { id: 't4', title: 'The Nights', artist: 'Avicii', youtubeId: 'UtF6Jej8yb4', moods: ['Happy', 'Energetic'] },
  { id: 't5', title: 'Blinding Lights', artist: 'The Weeknd', youtubeId: '4NRXx6U8ABQ', moods: ['Happy', 'Energetic', 'Focused'] },
  { id: 't6', title: 'Levitating', artist: 'Dua Lipa', youtubeId: 'TUVcZfQe-Kw', moods: ['Happy', 'Energetic'] },
  { id: 't7', title: 'Sugar', artist: 'Maroon 5', youtubeId: '09R8_2nJtjg', moods: ['Happy', 'Energetic'] },
  { id: 't8', title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', youtubeId: 'ru0K8uYEZWw', moods: ['Happy', 'Energetic'] },
  { id: 't9', title: 'Watermelon Sugar', artist: 'Harry Styles', youtubeId: 'E07s5ZYygMg', moods: ['Happy', 'Calm'] },
  { id: 't10', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', youtubeId: 'OPf0YbXqDm0', moods: ['Happy', 'Energetic'] },
  { id: 't11', title: 'Happy', artist: 'Pharrell Williams', youtubeId: 'ZbZSe6N_BXs', moods: ['Happy', 'Energetic'] },
  { id: 't12', title: 'Heat Waves', artist: 'Glass Animals', youtubeId: 'mRD0-GxqHVo', moods: ['Happy', 'Calm'] },
  { id: 't13', title: 'Wake Me Up', artist: 'Avicii', youtubeId: 'IcrbM1l_BoI', moods: ['Happy', 'Energetic'] },

  // SAD / STRESSED (Lofi & Sad Pop)
  { id: 't14', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', youtubeId: 'jfKfPfyJRdk', moods: ['Sad', 'Stressed', 'Calm', 'Focused'] },
  { id: 't15', title: 'Coffee Shop Radio', artist: 'Lofi Chill', youtubeId: '-5KAN9_CzSA', moods: ['Sad', 'Stressed', 'Calm'] },
  { id: 't16', title: 'Someone Like You', artist: 'Adele', youtubeId: 'hLQl3WQQoQ0', moods: ['Sad', 'Stressed'] },
  { id: 't17', title: 'Fix You', artist: 'Coldplay', youtubeId: 'k4V3Mo61fJM', moods: ['Sad', 'Stressed', 'Calm'] },
  { id: 't18', title: 'Let Her Go', artist: 'Passenger', youtubeId: 'RBumHr8NU2c', moods: ['Sad', 'Calm'] },
  { id: 't19', title: 'Stay With Me', artist: 'Sam Smith', youtubeId: 'pB-5XG-DbAA', moods: ['Sad', 'Stressed'] },
  { id: 't20', title: 'Lovely', artist: 'Billie Eilish, Khalid', youtubeId: 'V1Pl8CzNzCw', moods: ['Sad', 'Stressed'] },
  { id: 't21', title: 'Dusk Till Dawn', artist: 'ZAYN ft. Sia', youtubeId: 'tt2k8PGm-TI', moods: ['Sad', 'Energetic'] },
  { id: 't22', title: 'Someone You Loved', artist: 'Lewis Capaldi', youtubeId: 'bCuhuePlP8o', moods: ['Sad', 'Stressed'] },
  { id: 't23', title: 'drivers license', artist: 'Olivia Rodrigo', youtubeId: 'ZmDBbnmKpqQ', moods: ['Sad', 'Stressed'] },
  { id: 't24', title: 'Jocelyn Flores', artist: 'XXXTENTACION', youtubeId: 'FAucVNRx_mU', moods: ['Sad', 'Calm'] },
  { id: 't25', title: 'SLOW DANCING IN THE DARK', artist: 'Joji', youtubeId: 'K3Qzzggn--s', moods: ['Sad', 'Stressed'] },

  // CALM / FOCUSED (Synthwave, Lofi, Calm Pop)
  { id: 't26', title: 'Synthwave Radio', artist: 'Lofi Girl', youtubeId: '4xDzrJKXOOY', moods: ['Calm', 'Focused', 'Energetic'] },
  { id: 't27', title: 'Chillhop Beats', artist: 'Chillhop Music', youtubeId: '5qap5aO4i9A', moods: ['Calm', 'Focused'] },
  { id: 't28', title: 'Perfect', artist: 'Ed Sheeran', youtubeId: '2Vv-BfVoq4g', moods: ['Calm', 'Happy'] },
  { id: 't29', title: 'All of Me', artist: 'John Legend', youtubeId: '450p7goxZqg', moods: ['Calm', 'Happy'] },
  { id: 't30', title: 'Yellow', artist: 'Coldplay', youtubeId: 'yKNxeF4KMsY', moods: ['Calm', 'Focused'] },
  { id: 't31', title: 'Night Changes', artist: 'One Direction', youtubeId: 'syFZfO_wfMQ', moods: ['Calm', 'Happy'] },
  { id: 't32', title: 'Clocks', artist: 'Coldplay', youtubeId: 'd020hcWA_Wg', moods: ['Calm', 'Focused'] },
  { id: 't33', title: 'A Sky Full of Stars', artist: 'Coldplay', youtubeId: 'VPRjCeoBqrI', moods: ['Calm', 'Focused', 'Energetic'] },
  { id: 't34', title: 'Counting Stars', artist: 'OneRepublic', youtubeId: 'hT_nvWreIhg', moods: ['Energetic', 'Focused'] },
  { id: 't35', title: 'Take Me To Church', artist: 'Hozier', youtubeId: 'PVjiKRfKpPI', moods: ['Focused', 'Stressed'] },
  { id: 't36', title: 'Sweater Weather', artist: 'The Neighbourhood', youtubeId: 'GCdwKhTtNNw', moods: ['Calm', 'Focused', 'Sad'] },
];
