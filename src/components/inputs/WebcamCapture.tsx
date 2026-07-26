'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Mood } from '@/lib/mock-database';
import { Camera, CameraOff, Loader2, ScanFace } from 'lucide-react';

export default function WebcamCapture({ onMoodSelect }: { onMoodSelect: (mood: Mood, reason: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentScore, setCurrentScore] = useState<{ expression: string, score: number } | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelLoaded(true);
      } catch (e) {
        console.error("Failed to load models", e);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing camera", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      setCurrentScore(null);
    }
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || videoRef.current.videoWidth === 0) return;
    
    setIsDetecting(true);
    try {
      if (!faceapi.nets.ssdMobilenetv1.isLoaded) {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      }
      if (!faceapi.nets.faceExpressionNet.isLoaded) {
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      }

      const detections = await faceapi.detectSingleFace(
        videoRef.current, 
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1 })
      ).withFaceExpressions();
      
      if (detections) {
        const expressions = detections.expressions;
        let maxExpression = 'neutral';
        let maxScore = 0;
        
        Object.entries(expressions).forEach(([exp, score]) => {
          if (score > maxScore) {
            maxScore = score;
            maxExpression = exp;
          }
        });

        setCurrentScore({ expression: maxExpression, score: maxScore });

        let mood: Mood = 'Calm';
        if (maxExpression === 'happy') mood = 'Happy';
        else if (maxExpression === 'sad') mood = 'Sad';
        else if (maxExpression === 'angry' || maxExpression === 'disgusted') mood = 'Stressed';
        else if (maxExpression === 'surprised' || maxExpression === 'fearful') mood = 'Energetic';
        else if (maxExpression === 'neutral') mood = 'Calm';

        if (maxScore > 0.4) {
          onMoodSelect(mood, `Camera detected: ${maxExpression} (${(maxScore*100).toFixed(0)}%)`);
        } else {
          // If score is too low, we can just use the highest anyway as a fallback, or reject.
          // Let's just use it anyway since it was manually triggered.
          onMoodSelect(mood, `Camera slightly detected: ${maxExpression} (${(maxScore*100).toFixed(0)}%)`);
        }
      } else {
        alert("Could not detect a face clearly. Try adjusting lighting or angle.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="relative w-full aspect-video bg-black/50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center shadow-inner">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
          style={{ transform: 'scaleX(-1)' }}
        />
        {!isCameraOn && (
          <div className="text-gray-500 flex flex-col items-center gap-3">
            <CameraOff size={40} className="opacity-50" />
            <span className="text-sm font-medium">Camera Offline</span>
          </div>
        )}
        
        {isCameraOn && currentScore && (
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10 text-sm shadow-xl font-medium flex items-center gap-2">
            <ScanFace size={16} className="text-blue-400" />
            Detected: {currentScore.expression} ({(currentScore.score * 100).toFixed(0)}%)
          </div>
        )}
      </div>

      <div className="flex gap-4 w-full justify-start">
        <button
          onClick={isCameraOn ? stopCamera : startCamera}
          disabled={!isModelLoaded}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all text-gray-300 font-medium border border-white/10"
        >
          {!isModelLoaded ? (
            <><Loader2 className="animate-spin" size={18} /> Loading...</>
          ) : isCameraOn ? (
            <><CameraOff size={18} /> Stop Camera</>
          ) : (
            <><Camera size={18} /> Start Camera</>
          )}
        </button>

        {isCameraOn && (
          <button
            onClick={captureAndDetect}
            disabled={isDetecting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all text-white font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isDetecting ? (
              <><Loader2 className="animate-spin" size={18} /> Analyzing...</>
            ) : (
              <><ScanFace size={18} /> Detect Mood</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
