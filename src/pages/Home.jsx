import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, History, Zap, Shield, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import ListeningIndicator from '../components/ListeningIndicator';
import AlertBanner from '../components/AlertBanner';
import AudioClassifier from '../components/AudioClassifier';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import SoundCorrectionDialog from '../components/SoundCorrectionDialog';
import AudioVisualization from '../components/AudioVisualization';

export default function Home() {
  const [isListening, setIsListening] = useState(() => {
    return localStorage.getItem('audiowatch_listening') === 'true';
  });
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [modelLoading, setModelLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [detectionToCorrect, setDetectionToCorrect] = useState(null);
  const [detectionProbability, setDetectionProbability] = useState(0);
  const [currentDetectedSound, setCurrentDetectedSound] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastDetectionTimeRef = useRef(0);
  
  const queryClient = useQueryClient();

  const { data: onboardingStatus } = useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: async () => {
      const statuses = await api.entities.OnboardingStatus.list();
      if (statuses.length === 0) {
        const newStatus = await api.entities.OnboardingStatus.create({
          completed: false,
          step: 0,
          skipped: false
        });
        setShowOnboarding(true);
        return newStatus;
      }
      const status = statuses[0];
      if (!status.completed && !status.skipped) {
        setShowOnboarding(true);
      }
      return status;
    },
  });

  const { data: settings } = useQuery({
    queryKey: ['soundSettings'],
    queryFn: async () => {
      const allSettings = await api.entities.SoundSettings.list();
      if (allSettings.length === 0) {
        const defaultSettings = {
          enabled_sounds: ['Speech', 'Dog', 'Alarm', 'Doorbell', 'Baby cry, infant cry'],
          vibration_strength: 'medium',
          flash_alerts: true,
          sensitivity: 'medium',
        };
        return await api.entities.SoundSettings.create(defaultSettings);
      }
      return allSettings[0];
    },
  });

  const { data: corrections = [] } = useQuery({
    queryKey: ['soundCorrections'],
    queryFn: () => api.entities.SoundCorrection.list(),
  });

  const { data: recentDetections = [] } = useQuery({
    queryKey: ['recentDetections'],
    queryFn: () => api.entities.DetectedSound.list('-timestamp', 5),
  });

  const createDetectionMutation = useMutation({
    mutationFn: (data) => api.entities.DetectedSound.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recentDetections'] }),
  });

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      return true;
    } catch (err) {
      setPermissionStatus('denied');
      return false;
    }
  };

  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      const loaded = await AudioClassifier.loadModel();
      setModelLoaded(loaded);
      setModelLoading(false);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (corrections.length > 0) {
      AudioClassifier.loadUserCorrections(corrections);
    }
  }, [corrections]);

  useEffect(() => {
    if (isListening && settings && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      analyzeAudio();
    }
  }, [settings, isListening]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ 
        sampleRate: 16000 
      });
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      await AudioClassifier.startStreamingClassification(stream, audioContextRef.current);
      
      setIsListening(true);
      localStorage.setItem('audiowatch_listening', 'true');
      setPermissionStatus('granted');
      analyzeAudio();
    } catch (err) {
      console.error('Error starting audio:', err);
      localStorage.setItem('audiowatch_listening', 'false');
    }
  };

  const analyzeAudio = useCallback(async () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);
    setAudioLevel(normalizedLevel);
    
    const result = AudioClassifier.getLatestResult();
    
    if (result) {
      setDetectionProbability(result.confidence);
      setCurrentDetectedSound(result.soundType);
      
      const now = Date.now();
      if (settings?.enabled_sounds?.includes(result.soundType) && 
          result.confidence > 30 &&
          now - lastDetectionTimeRef.current > 2000) {
        lastDetectionTimeRef.current = now;
        
        const detection = {
          sound_type: result.soundType,
          confidence: result.confidence,
          timestamp: new Date().toISOString(),
          acknowledged: false,
          rawClass: result.rawClass,
          allPredictions: result.allPredictions
        };
        
        setCurrentAlert(detection);
        createDetectionMutation.mutate(detection);
      }
    } else {
      setDetectionProbability(prev => Math.max(0, prev - 2));
      if (detectionProbability < 10) {
        setCurrentDetectedSound(null);
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [settings, createDetectionMutation]);

  const stopListening = () => {
    AudioClassifier.stopStreamingClassification();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsListening(false);
    localStorage.setItem('audiowatch_listening', 'false');
    setAudioLevel(0);
    setDetectionProbability(0);
    setCurrentDetectedSound(null);
  };

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      if (permissionStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return;
      }
      startListening();
    }
  };

  useEffect(() => {
    const shouldListen = localStorage.getItem('audiowatch_listening') === 'true';
    if (shouldListen && modelLoaded && !isListening) {
      if (permissionStatus === 'granted') {
        startListening();
      }
    }
  }, [modelLoaded, isListening, permissionStatus]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' })
      .then(result => setPermissionStatus(result.state))
      .catch(() => {});
  }, []);

  const dismissAlert = async () => {
    if (currentAlert) {
      const detection = recentDetections.find(d => 
        d.sound_type === currentAlert.sound_type && 
        d.timestamp === currentAlert.timestamp
      );
      if (detection) {
        await api.entities.DetectedSound.update(detection.id, { acknowledged: true });
        queryClient.invalidateQueries({ queryKey: ['recentDetections'] });
      }
    }
    setCurrentAlert(null);
  };

  const handleCorrectSound = () => {
    setDetectionToCorrect(currentAlert);
    setCorrectionDialogOpen(true);
    setCurrentAlert(null);
  };

  const saveCorrection = async (correctedType) => {
    if (!detectionToCorrect) return;
    
    await api.entities.SoundCorrection.create({
      original_sound_type: detectionToCorrect.sound_type,
      corrected_sound_type: correctedType,
      yamnet_class: detectionToCorrect.rawClass || detectionToCorrect.sound_type,
      confidence: detectionToCorrect.confidence
    });
    
    queryClient.invalidateQueries({ queryKey: ['soundCorrections'] });
    setCorrectionDialogOpen(false);
    setDetectionToCorrect(null);
  };

  const completeOnboarding = async () => {
    if (onboardingStatus) {
      await api.entities.OnboardingStatus.update(onboardingStatus.id, {
        completed: true,
        step: 4
      });
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
    }
    setShowOnboarding(false);
  };

  const skipOnboarding = async () => {
    if (onboardingStatus) {
      await api.entities.OnboardingStatus.update(onboardingStatus.id, {
        skipped: true
      });
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
    }
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {showOnboarding && (
        <OnboardingFlow
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}

      <SoundCorrectionDialog
        detection={detectionToCorrect}
        open={correctionDialogOpen}
        onClose={() => setCorrectionDialogOpen(false)}
        onCorrect={saveCorrection}
      />

      <AlertBanner 
        alert={currentAlert} 
        onDismiss={dismissAlert}
        onCorrect={handleCorrectSound}
        flashEnabled={settings?.flash_alerts}
      />
      
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AudioWatch</h1>
              <p className="text-xs text-slate-400">Sound Recognition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              to={createPageUrl('History')}
              className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <History className="w-5 h-5 text-slate-300" />
            </Link>
            <Link 
              to={createPageUrl('Settings')}
              className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-300" />
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <motion.div 
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border border-slate-700/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center mb-8 pt-4">
            <button onClick={toggleListening} className="mb-8">
              <ListeningIndicator isListening={isListening} audioLevel={audioLevel} />
            </button>

            <AudioVisualization 
              audioLevel={audioLevel}
              detectionProbability={detectionProbability}
              isListening={isListening}
              detectedSound={currentDetectedSound}
            />
          </div>
          
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white">{settings?.enabled_sounds?.length || 0}</p>
              <p className="text-sm text-slate-400">Sounds Active</p>
            </div>
            <div className="w-px h-12 bg-slate-700" />
            <div>
              <p className="text-3xl font-bold text-white">{recentDetections.length}</p>
              <p className="text-sm text-slate-400">Recent Alerts</p>
            </div>
          </div>
        </motion.div>

        {(modelLoading || !modelLoaded) && (
          <motion.div
            className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mt-0.5" />
            <div>
              <p className="font-medium text-violet-400">Loading AI Model...</p>
              <p className="text-sm text-violet-400/70">Downloading YamNet sound classification model</p>
            </div>
          </motion.div>
        )}
        
        {modelLoaded && !modelLoading && (
          <motion.div
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p className="font-medium text-emerald-400">AI Model Ready</p>
              <p className="text-sm text-emerald-400/70">YamNet is ready to detect sounds</p>
            </div>
          </motion.div>
        )}

        {permissionStatus === 'denied' && (
          <motion.div
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Mic className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="font-medium text-red-400">Microphone Access Required</p>
              <p className="text-sm text-red-400/70">Please enable microphone access in your browser settings to detect sounds.</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link to={createPageUrl('SoundLibrary')}>
            <motion.div
              className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-violet-500/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-1">Sound Library</h3>
              <p className="text-sm text-slate-400">Configure detection</p>
            </motion.div>
          </Link>
          
          <Link to={createPageUrl('Settings')}>
            <motion.div
              className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-violet-500/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                <Settings className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-sm text-slate-400">Alerts & vibration</p>
            </motion.div>
          </Link>
        </div>

        {recentDetections.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Link to={createPageUrl('History')} className="text-sm text-violet-400">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {recentDetections.slice(0, 3).map((detection, index) => (
                  <motion.div
                    key={detection.id}
                    className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-1">
                      <p className="font-medium capitalize">
                        {detection.sound_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-slate-400">
                        {new Date(detection.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-sm text-slate-400">
                      {detection.confidence}%
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
