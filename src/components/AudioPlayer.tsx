'use client';
import { useState, useEffect } from 'react';
import { Track } from '@/lib/mock-database';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

export default function AudioPlayer({ track, onSkip, reason }: { track: Track | null, onSkip: () => void, reason: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(async () => {
        try {
          const current = await player.getCurrentTime();
          const duration = await player.getDuration();
          if (duration) {
            setProgress((current / duration) * 100);
            setCurrentTimeStr(formatTime(current));
            setDurationStr(formatTime(duration));
          }
        } catch (e) {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const togglePlay = () => {
    if (player) {
      if (isPlaying) player.pauseVideo();
      else player.playVideo();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
        player.setVolume(volume);
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (player) {
      player.setVolume(val);
      if (val > 0 && isMuted) {
        player.unMute();
        setIsMuted(false);
      }
    }
  };

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.playVideo(); 
    event.target.setVolume(volume);
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) setIsPlaying(true);
    if (event.data === 2) setIsPlaying(false);
    if (event.data === 0) {
      setIsPlaying(false);
      onSkip(); 
    }
  };

  const onError = (event: YouTubeEvent) => {
    console.error("YouTube Player Error code:", event.data);
    onSkip(); 
  };

  if (!track) return null;

  const opts = {
    height: '200',
    width: '200',
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
  };

  return (
    <div className="fixed bottom-0 w-full bg-[#0a101f] border-t border-white/5 px-4 md:px-8 py-3 z-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 hidden md:flex">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">{track.title.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-white text-sm line-clamp-1">{track.title}</h3>
            <p className="text-xs text-gray-400">{track.artist}</p>
            {reason && <p className="text-[10px] text-blue-400 mt-0.5 line-clamp-1">{reason}</p>}
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <div className="flex items-center gap-6 mb-2">
            <button className="text-gray-500 hover:text-white transition"><Shuffle size={18} /></button>
            <button className="text-gray-400 hover:text-white transition"><SkipBack size={20} /></button>
            <button 
              onClick={togglePlay} 
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              disabled={!player}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onSkip} className="text-gray-400 hover:text-white transition"><SkipForward size={20} /></button>
            <button className="text-gray-500 hover:text-white transition"><Repeat size={18} /></button>
          </div>
          
          <div className="flex items-center gap-3 w-full text-xs text-gray-400 font-medium">
            <span>{currentTimeStr}</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden relative cursor-not-allowed">
              <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span>{durationStr}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center justify-end gap-3 hidden md:flex">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        <YouTube videoId={track.youtubeId} opts={opts} onReady={onReady} onStateChange={onStateChange} onError={onError} />
      </div>
    </div>
  );
}
