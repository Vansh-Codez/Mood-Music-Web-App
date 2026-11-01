'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Mood } from '@/lib/mock-database';
import { Camera, CameraOff, Loader2, ScanFace, Check, AlertCircle } from 'lucide-react';

interface EmotionAnalysis {
  mood: Mood;
  label: string;
  confidence: number;
  rawExpression: string;
  scores: Record<Mood, number>;
}

// -------------------------------------------------------------
// Prior-Debiased Facial Emotion Calibration
// Compensates for FER2013 / FaceExpressionNet's heavy neutral bias
// -------------------------------------------------------------
function calibrateExpressions(expressions: faceapi.FaceExpressions): EmotionAnalysis {
  const {
    neutral = 0,
    happy = 0,
    sad = 0,
    angry = 0,
    fearful = 0,
    disgusted = 0,
    surprised = 0
  } = expressions;

  // 1. Sadness & Crying Distress Index
  // Real crying/sadness presents sad: 0.15-0.45 while neutral lingers around 0.3-0.5.
  // We boost sad with 2.6x and incorporate distress signals from trembling/fearful and grimace/disgusted.
  const sadScore = (sad * 2.6) + (fearful * 1.0) + (disgusted * 0.6);

  // 2. Joy / Happy
  const happyScore = happy * 1.25;

  // 3. Stressed / Tension / Anger
  const stressedScore = (angry * 1.8) + (disgusted * 0.9) + (fearful * (sad < 0.2 ? 0.9 : 0.2));

  // 4. Energetic / Expressive
  const energeticScore = (surprised * 1.6) + (happy > 0.75 ? 0.3 : 0);

  // 5. Calm / Resting (0.6x dampening on neutral to avoid drowning real emotions)
  const calmScore = neutral * 0.6;

  // 6. Focused / Concentrated
  const focusedScore = (neutral * 0.35) + (angry * 0.8);

  const scores: Record<Mood, number> = {
    Sad: sadScore,
    Happy: happyScore,
    Stressed: stressedScore,
    Energetic: energeticScore,
    Calm: calmScore,
    Focused: focusedScore
  };

  let chosenMood: Mood = 'Calm';
  let highestScore = -Infinity;

  for (const [mood, score] of Object.entries(scores) as [Mood, number][]) {
    if (score > highestScore) {
      highestScore = score;
      chosenMood = mood;
    }
  }

  // Definitively capture crying and sadness if elevated and higher than happy
  if ((sad >= 0.16 || (sad + fearful >= 0.25 && sad > 0.08)) && sad > happy) {
    chosenMood = 'Sad';
    highestScore = Math.max(highestScore, sadScore);
  }

  let label: string = chosenMood;
  let confidence = Math.min(Math.round(highestScore * 100), 99);

  if (chosenMood === 'Sad') {
    if (sad > 0.25 || fearful > 0.18 || (sad > 0.14 && disgusted > 0.14)) {
      label = 'Sad / Crying 🥺';
    } else {
      label = 'Sad / Feeling Down 🥺';
    }
    confidence = Math.min(Math.round(((sad * 2.2) + (fearful * 0.8)) * 100), 99);
  } else if (chosenMood === 'Happy') {
    label = 'Happy / Smiling 😊';
    confidence = Math.min(Math.round(happy * 100), 99);
  } else if (chosenMood === 'Stressed') {
    label = 'Stressed / Tense 😫';
    confidence = Math.min(Math.round(Math.max(angry, disgusted) * 100), 99);
  } else if (chosenMood === 'Energetic') {
    label = 'Energetic / Surprised ⚡';
    confidence = Math.min(Math.round(surprised * 100), 99);
  } else if (chosenMood === 'Focused') {
    label = 'Focused / Concentrating 🎯';
    confidence = Math.min(Math.round((neutral * 0.5 + angry * 0.5) * 100), 99);
  } else {
    label = 'Calm / Resting ☕';
    confidence = Math.min(Math.round(neutral * 100), 99);
  }

  const rawExpression = Object.entries(expressions).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  return {
    mood: chosenMood,
    label,
    confidence: Math.max(confidence, 50),
    rawExpression,
    scores
  };
}

export default function WebcamCapture({ onMoodSelect }: { onMoodSelect: (mood: Mood, reason: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Concurrency lock to prevent WebGL GPU inference stacking
  const isInferringRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCameraActiveRef = useRef(false);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelLoadingText, setModelLoadingText] = useState('Loading Face Models...');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveEmotion, setLiveEmotion] = useState<EmotionAnalysis | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  // Load models on mount
  useEffect(() => {
    let isMounted = true;

    const loadAllModels = async () => {
      try {
        setModelLoadingText('Loading SSD MobileNet & Face Expression Models...');
        // Primary proven models for this project
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);

        // Also load TinyFaceDetector as a secondary fast fallback
        faceapi.nets.tinyFaceDetector.loadFromUri('/models').catch((e) => {
          console.warn("Tiny face detector load skipped:", e);
        });

        if (isMounted) {
          setIsModelLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load face detection models:", err);
        if (isMounted) {
          setErrorMessage("Failed to load facial recognition models. Please refresh the page.");
        }
      }
    };

    loadAllModels();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // Frame detection helper (single execution with mutex)
  const processFrame = useCallback(async (): Promise<EmotionAnalysis | null> => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended || video.readyState < 2 || video.videoWidth === 0) {
      return null;
    }

    try {
      let detection: faceapi.WithFaceExpressions<{ detection: faceapi.FaceDetection }> | undefined;

      // Primary detector: SSD MobileNet V1
      if (faceapi.nets.ssdMobilenetv1.isLoaded) {
        detection = await faceapi.detectSingleFace(
          video,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1 })
        ).withFaceExpressions();
      }

      // Fallback: TinyFaceDetector
      if (!detection && faceapi.nets.tinyFaceDetector.isLoaded) {
        detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.1 })
        ).withFaceExpressions();
      }

      if (detection && detection.expressions) {
        const calibrated = calibrateExpressions(detection.expressions);
        setFaceDetected(true);
        setLiveEmotion(calibrated);
        return calibrated;
      } else {
        setFaceDetected(false);
        return null;
      }
    } catch (err) {
      console.error("Frame detection error:", err);
      return null;
    }
  }, []);

  // Sequential live tracking loop that strictly waits for previous inference before scheduling next
  const runDetectionLoop = useCallback(() => {
    if (!isCameraActiveRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(async () => {
      if (!isCameraActiveRef.current) return;

      if (!isInferringRef.current) {
        isInferringRef.current = true;
        try {
          await processFrame();
        } finally {
          isInferringRef.current = false;
        }
      }

      // Schedule next frame only after current inference is done
      if (isCameraActiveRef.current) {
        runDetectionLoop();
      }
    }, 350);
  }, [processFrame]);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    isCameraActiveRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setLiveEmotion(null);
    setFaceDetected(false);
  }, []);

  // Start camera helper
  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
        setIsCameraOn(true);
        isCameraActiveRef.current = true;

        // Kick off sequential live detection loop
        runDetectionLoop();
      }
    } catch (err: unknown) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Could not access camera. Please allow camera permissions in your browser.");
    }
  };

  // Immediate Click-to-Detect Handler
  const captureAndDetect = async () => {
    const video = videoRef.current;
    if (!video || !isCameraOn) {
      alert("Please start the camera first.");
      return;
    }

    // 1. If we already have an active live emotion detected, apply it INSTANTLY!
    if (liveEmotion && faceDetected) {
      onMoodSelect(liveEmotion.mood, `Camera detected: ${liveEmotion.label} (${liveEmotion.confidence}% confidence)`);
      setJustApplied(true);
      setTimeout(() => setJustApplied(false), 2500);
      return;
    }

    // 2. Otherwise (if clicked before first live frame finished), process frame now
    setIsDetecting(true);
    try {
      let analysis = await processFrame();

      // Quick retry if needed
      if (!analysis) {
        await new Promise((r) => setTimeout(r, 200));
        analysis = await processFrame();
      }

      if (analysis) {
        onMoodSelect(analysis.mood, `Camera detected: ${analysis.label} (${analysis.confidence}% confidence)`);
        setJustApplied(true);
        setTimeout(() => setJustApplied(false), 2500);
      } else {
        alert("Could not detect a face clearly. Try looking directly at the camera with good room lighting.");
      }
    } catch (error) {
      console.error("Detection error:", error);
      alert("Failed to analyze facial expression. Please try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      {errorMessage && (
        <div className="w-full mb-4 bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle size={20} className="text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Video Viewport */}
      <div className="relative w-full aspect-video bg-black/60 rounded-3xl overflow-hidden mb-6 flex items-center justify-center shadow-2xl border border-white/10">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${!isCameraOn ? 'opacity-0 hidden' : 'opacity-100'}`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {!isCameraOn && (
          <div className="text-gray-400 flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <CameraOff size={28} className="opacity-60" />
            </div>
            <div>
              <p className="font-semibold text-gray-200 text-base">Camera is Offline</p>
              <p className="text-xs text-gray-400 mt-1">Click "Start Camera" to detect your mood via facial expressions</p>
            </div>
          </div>
        )}

        {/* Live Detected Badge & Face Status */}
        {isCameraOn && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-2 border transition-all ${
              faceDetected 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
              {faceDetected ? 'Face Tracking Active' : 'Scanning for face...'}
            </div>

            {liveEmotion && (
              <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-white/20 text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in">
                <span className="font-bold text-blue-300">{liveEmotion.label}</span>
                <span className="text-gray-400">({liveEmotion.confidence}%)</span>
              </div>
            )}
          </div>
        )}

        {/* Live Expression Breakdown Meter */}
        {isCameraOn && liveEmotion && (
          <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex flex-col gap-1.5 text-xs shadow-2xl">
            <div className="flex justify-between text-gray-300 font-medium">
              <span>Live Emotion Recognition</span>
              <span className="text-blue-300 font-bold">{liveEmotion.mood} detected</span>
            </div>
            
            {/* Multi-emotion visualizer */}
            <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-400 pt-1">
              <div>
                <div className="flex justify-between"><span>Sad / Cry</span><span>{Math.min(Math.round(liveEmotion.scores.Sad * 100), 99)}%</span></div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(liveEmotion.scores.Sad * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between"><span>Happy</span><span>{Math.min(Math.round(liveEmotion.scores.Happy * 100), 99)}%</span></div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-yellow-400 h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(liveEmotion.scores.Happy * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between"><span>Stressed</span><span>{Math.min(Math.round(liveEmotion.scores.Stressed * 100), 99)}%</span></div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-red-400 h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(liveEmotion.scores.Stressed * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between"><span>Calm</span><span>{Math.min(Math.round(liveEmotion.scores.Calm * 100), 99)}%</span></div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-teal-400 h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(liveEmotion.scores.Calm * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap gap-4 w-full justify-start items-center">
        <button
          onClick={isCameraOn ? stopCamera : startCamera}
          disabled={!isModelLoaded}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all text-gray-200 font-medium border border-white/10 active:scale-95"
        >
          {!isModelLoaded ? (
            <><Loader2 className="animate-spin text-blue-400" size={18} /> {modelLoadingText}</>
          ) : isCameraOn ? (
            <><CameraOff size={18} className="text-red-400" /> Stop Camera</>
          ) : (
            <><Camera size={18} className="text-blue-400" /> Start Camera</>
          )}
        </button>

        {isCameraOn && (
          <button
            onClick={captureAndDetect}
            disabled={isDetecting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 ${
              justApplied
                ? 'bg-green-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white'
            }`}
          >
            {isDetecting ? (
              <><Loader2 className="animate-spin" size={18} /> Analyzing Expression...</>
            ) : justApplied ? (
              <><Check size={18} /> Mood Applied!</>
            ) : liveEmotion && faceDetected ? (
              <><ScanFace size={18} /> Play {liveEmotion.mood} Music</>
            ) : (
              <><ScanFace size={18} /> Detect & Play Music</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
