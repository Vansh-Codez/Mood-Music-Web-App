'use client';
import { useState } from 'react';
import { Mood, Track } from '@/lib/mock-database';
import { getRandomTrackForMood } from '@/lib/mood-engine';
import AmbientBackground from './AmbientBackground';
import AudioPlayer from './AudioPlayer';
import TextMoodInput from './inputs/TextMoodInput';
import ManualSelector from './inputs/ManualSelector';
import dynamic from 'next/dynamic';
import { Music, FileText, Camera as CameraIcon, LayoutGrid } from 'lucide-react';

const WebcamCapture = dynamic(() => import('./inputs/WebcamCapture'), { ssr: false });

type Tab = 'Text' | 'Face' | 'Moods';

export default function MoodDashboard() {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [reason, setReason] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('Text');

  const handleMoodSelect = (mood: Mood, newReason: string) => {
    setCurrentMood(mood);
    setReason(newReason);
    const newTrack = getRandomTrackForMood(mood, currentTrack?.id);
    setCurrentTrack(newTrack);
  };

  const handleSkip = () => {
    if (currentMood) {
      const newTrack = getRandomTrackForMood(currentMood, currentTrack?.id);
      setCurrentTrack(newTrack);
    }
  };

  const MOOD_EMOJIS: Record<Mood, string> = {
    Happy: '😊',
    Sad: '🥺',
    Energetic: '⚡',
    Calm: '☕',
    Focused: '🎯',
    Stressed: '😫'
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8 relative">
      <AmbientBackground mood={currentMood} />
      
      <div className="max-w-3xl w-full flex flex-col items-center gap-6 z-10 pb-40 pt-10">
        
        {/* Header Section */}
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight flex items-center justify-center gap-3">
            MoodTunes <Music size={36} className="text-indigo-400" />
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">
            Music that feels you
          </p>
          
          {/* Active Mood Badge */}
          <div className="mt-6 h-10">
            {currentMood && (
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                <span>{MOOD_EMOJIS[currentMood]}</span>
                <span className="font-semibold">{currentMood}</span>
              </div>
            )}
          </div>
        </div>

        {/* Central Dashboard Card */}
        <div className="w-full bg-[#1a233a]/90 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden mt-2">
          
          {/* Tab Navigation */}
          <div className="flex bg-black/20 p-2 border-b border-white/5">
            {(['Text', 'Face', 'Moods'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-blue-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {tab === 'Text' && <FileText size={18} />}
                {tab === 'Face' && <CameraIcon size={18} />}
                {tab === 'Moods' && <LayoutGrid size={18} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 min-h-[320px] flex flex-col items-center justify-center">
            {activeTab === 'Text' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TextMoodInput onMoodSelect={handleMoodSelect} />
              </div>
            )}
            
            {activeTab === 'Face' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <WebcamCapture onMoodSelect={handleMoodSelect} />
              </div>
            )}

            {activeTab === 'Moods' && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ManualSelector currentMood={currentMood} onMoodSelect={handleMoodSelect} />
              </div>
            )}
          </div>
        </div>
        
        {/* Playlist Label (Aesthetic Placeholder) */}
        {currentMood && (
          <div className="w-full flex items-center justify-between bg-[#1a233a]/80 backdrop-blur-lg border border-white/5 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <div className="flex items-center gap-3">
              <Music size={20} className="text-gray-400" />
              <span className="font-semibold text-gray-200">{MOOD_EMOJIS[currentMood]} {currentMood} Playlist</span>
            </div>
            <div className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold border border-blue-500/30">
              Queue: 3
            </div>
          </div>
        )}

      </div>

      <AudioPlayer track={currentTrack} reason={reason} onSkip={handleSkip} />
    </div>
  );
}
