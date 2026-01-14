import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Baby, Car, Dog, AlertTriangle, Phone, Volume2, Siren, Hand, Flame } from 'lucide-react';
import { Button } from './ui/button';

const soundIcons = {
  alarm: AlertTriangle,
  doorbell: Bell,
  baby_crying: Baby,
  car_horn: Car,
  dog_barking: Dog,
  glass_breaking: Volume2,
  smoke_alarm: Flame,
  phone_ringing: Phone,
  knock: Hand,
  siren: Siren,
};

const soundLabels = {
  alarm: 'ALARM DETECTED',
  doorbell: 'DOORBELL',
  baby_crying: 'BABY CRYING',
  car_horn: 'CAR HORN',
  dog_barking: 'DOG BARKING',
  glass_breaking: 'GLASS BREAKING',
  smoke_alarm: 'SMOKE ALARM',
  phone_ringing: 'PHONE RINGING',
  knock: 'DOOR KNOCK',
  siren: 'EMERGENCY SIREN',
};

const alertColors = {
  alarm: { bg: 'bg-amber-500', text: 'text-amber-500' },
  doorbell: { bg: 'bg-blue-500', text: 'text-blue-500' },
  baby_crying: { bg: 'bg-pink-500', text: 'text-pink-500' },
  car_horn: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  dog_barking: { bg: 'bg-emerald-500', text: 'text-emerald-500' },
  glass_breaking: { bg: 'bg-red-500', text: 'text-red-500' },
  smoke_alarm: { bg: 'bg-red-600', text: 'text-red-600' },
  phone_ringing: { bg: 'bg-violet-500', text: 'text-violet-500' },
  knock: { bg: 'bg-slate-500', text: 'text-slate-400' },
  siren: { bg: 'bg-red-500', text: 'text-red-500' },
};

const getCategoryForSound = (soundName) => {
  const lower = soundName.toLowerCase();
  
  if (lower.includes('speech') || lower.includes('conversation') || lower.includes('talk') || 
      lower.includes('voice') || lower.includes('narration') || lower.includes('whisper') ||
      lower.includes('shout') || lower.includes('scream')) {
    return 'Human Voice';
  }
  if (lower.includes('cry') || lower.includes('baby') || lower.includes('infant') || 
      lower.includes('laugh') || lower.includes('giggle') || lower.includes('chuckle')) {
    return 'Human Emotion';
  }
  if (lower.includes('dog') || lower.includes('bark') || lower.includes('cat') || 
      lower.includes('meow') || lower.includes('purr') || lower.includes('bird') ||
      lower.includes('animal') || lower.includes('chirp')) {
    return 'Animal Sound';
  }
  if (lower.includes('alarm') || lower.includes('siren') || lower.includes('buzzer') ||
      lower.includes('smoke detector') || lower.includes('fire alarm')) {
    return 'Alarm & Alert';
  }
  if (lower.includes('music') || lower.includes('instrument') || lower.includes('guitar') ||
      lower.includes('piano') || lower.includes('drum') || lower.includes('sing')) {
    return 'Music';
  }
  if (lower.includes('car') || lower.includes('vehicle') || lower.includes('motor') ||
      lower.includes('truck') || lower.includes('train') || lower.includes('aircraft')) {
    return 'Vehicle';
  }
  if (lower.includes('door') || lower.includes('knock') || lower.includes('bell') ||
      lower.includes('tap') || lower.includes('slam')) {
    return 'Door & Entry';
  }
  if (lower.includes('telephone') || lower.includes('phone') || lower.includes('ring')) {
    return 'Communication';
  }
  if (lower.includes('water') || lower.includes('rain') || lower.includes('wind') ||
      lower.includes('thunder') || lower.includes('ocean') || lower.includes('wave')) {
    return 'Nature';
  }
  if (lower.includes('glass') || lower.includes('shatter') || lower.includes('break') ||
      lower.includes('crash')) {
    return 'Emergency';
  }
  
  return 'General Sound';
};

export default function AlertBanner({ alert, onDismiss, onCorrect, flashEnabled }) {
  const Icon = soundIcons[alert?.sound_type] || Volume2;
  const label = soundLabels[alert?.sound_type] || alert?.sound_type?.toUpperCase() || 'SOUND DETECTED';
  const colors = alertColors[alert?.sound_type] || { bg: 'bg-violet-500', text: 'text-violet-500' };
  const category = alert?.sound_type ? getCategoryForSound(alert.sound_type) : null;
  
  useEffect(() => {
    if (alert && navigator.vibrate) {
      const patterns = {
        alarm: [200, 100, 200, 100, 200],
        smoke_alarm: [500, 200, 500, 200, 500],
        baby_crying: [100, 50, 100, 50, 100, 200, 100, 50, 100],
        doorbell: [200, 100, 200],
        car_horn: [300, 100, 300],
        siren: [100, 100, 100, 100, 100, 100, 300],
        default: [200, 100, 200],
      };
      navigator.vibrate(patterns[alert.sound_type] || patterns.default);
    }
  }, [alert]);

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {flashEnabled && (
            <motion.div
              className={`absolute inset-0 ${colors.bg}`}
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
            />
          )}
          
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className={`${colors.bg} p-8 flex flex-col items-center`}>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                  }}
                >
                  <Icon className="w-20 h-20 text-white" />
                </motion.div>
              </div>
              
              <div className="p-6 text-center">
                <motion.h2
                  className="text-2xl font-bold text-white mb-2"
                  animate={{
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  {label}
                </motion.h2>
                {category && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 mb-3">
                    <span className="text-xs font-medium text-slate-300">{category}</span>
                  </div>
                )}
                <p className="text-slate-400 mb-6">
                  Confidence: {alert?.confidence || 95}%
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={onDismiss}
                    className="w-full h-14 text-lg font-semibold bg-slate-800 hover:bg-slate-700 rounded-xl"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Dismiss
                  </Button>
                  {onCorrect && (
                    <button
                      onClick={onCorrect}
                      className="w-full text-sm text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      Wrong sound? Correct it
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
