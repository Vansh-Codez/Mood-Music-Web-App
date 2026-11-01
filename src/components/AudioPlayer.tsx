'use client';
import { useState, useEffect, useRef } from 'react';
import { Track } from '@/lib/mock-database';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX, Radio } from 'lucide-react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

export default function AudioPlayer({ track, onSkip, reason }: { track: Track | null, onSkip: () => void, reason: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [isLiveStream, setIsLiveStream] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const sessionElapsedRef = useRef(0);

  // Robust time formatter supporting mm:ss and hh:mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const totalSecs = Math.floor(seconds);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Reset when track changes
  useEffect(() => {
    setProgress(0);
    setCurrentTimeStr('0:00');
    setDurationStr('0:00');
    setIsLiveStream(false);
    sessionElapsedRef.current = 0;
  }, [track?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(async () => {
        try {
          const current = await player.getCurrentTime();
          const duration = await player.getDuration();

          // 24/7 Live streams (e.g. Lofi Girl, Synthwave Radio) return huge DVR buffer durations
          // Normal songs are rarely over 2-3 hours; anything > 8 hours (28,800s) is a live broadcast
          const isLive = Boolean(
            (duration && duration > 28800) ||
            (track?.title.toLowerCase().includes('radio') ?? false) ||
            (track?.artist.toLowerCase().includes('radio') ?? false)
          );

          setIsLiveStream(isLive);

          if (isLive) {
            sessionElapsedRef.current += 1;
            setCurrentTimeStr('LIVE');
            setDurationStr('24/7');
            setProgress(100);
          } else if (duration && duration > 0) {
            const validCurrent = Math.max(0, current);
            const validProgress = Math.min(Math.max((validCurrent / duration) * 100, 0), 100);
            setProgress(validProgress);
            setCurrentTimeStr(formatTime(validCurrent));
            setDurationStr(formatTime(duration));
          }
        } catch {}
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player, track]);

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
    <div className="fixed bottom-0 w-full bg-[#0a101f]/95 backdrop-blur-xl border-t border-white/10 px-4 md:px-8 py-3.5 z-50 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center max-w-7xl mx-auto">
        
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 hidden md:flex">
          <div className="w-13 h-13 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 relative border border-white/10 p-3">
            {isLiveStream ? (
              <Radio size={22} className="text-white animate-pulse" />
            ) : (
              <span className="text-white font-black text-lg">{track.title.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm truncate">{track.title}</h3>
              {isLiveStream && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5">{track.artist}</p>
            {reason && <p className="text-[10px] text-blue-400 line-clamp-1 mt-0.5">{reason}</p>}
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <div className="flex items-center gap-6 mb-2">
            <button className="text-gray-500 hover:text-white transition" title="Shuffle"><Shuffle size={18} /></button>
            <button className="text-gray-400 hover:text-white transition" title="Previous"><SkipBack size={20} /></button>
            <button 
              onClick={togglePlay} 
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
              disabled={!player}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={onSkip} className="text-gray-400 hover:text-white transition" title="Next"><SkipForward size={20} /></button>
            <button className="text-gray-500 hover:text-white transition" title="Repeat"><Repeat size={18} /></button>
          </div>
          
          {/* Progress Section */}
          <div className="w-full">
            {isLiveStream ? (
              <div className="flex items-center gap-3 w-full text-xs font-medium">
                <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 text-red-400 px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>LIVE BROADCAST</span>
                </div>

                {/* Live stream ambient audio bar */}
                <div className="flex-1 h-2 bg-gradient-to-r from-red-500/30 via-indigo-500/30 to-purple-500/30 rounded-full overflow-hidden relative border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/50 via-blue-500/40 to-purple-500/50 animate-pulse" />
                </div>

                <span className="text-gray-400 font-semibold text-[11px] shrink-0">24/7 Stream</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full text-xs text-gray-400 font-medium">
                <span className="w-10 text-right tabular-nums text-gray-300">{currentTimeStr}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress || 0}
                  onChange={async (e) => {
                    const newProgress = Number(e.target.value);
                    setProgress(newProgress);
                    if (player) {
                      const duration = await player.getDuration();
                      if (duration && !isLiveStream) {
                        player.seekTo((newProgress / 100) * duration, true);
                      }
                    }
                  }}
                  className="flex-1 h-1.5 bg-gray-700 hover:bg-gray-600 rounded-full appearance-none cursor-pointer accent-blue-500 transition-colors"
                />
                <span className="w-10 text-left tabular-nums text-gray-300">{durationStr}</span>
              </div>
            )}
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
            className="w-24 h-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        <YouTube videoId={track.youtubeId} opts={opts} onReady={onReady} onStateChange={onStateChange} onError={onError} />
      </div>
    </div>
  );
}
