import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Bell, Baby, Car, Dog, AlertTriangle, Phone, Volume2, Siren, Hand, Flame, Check } from 'lucide-react';

// Icon to use for each detected sound type
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

// User-friendly labels for each sound
const soundLabels = {
  alarm: 'Alarm',
  doorbell: 'Doorbell',
  baby_crying: 'Baby Crying',
  car_horn: 'Car Horn',
  dog_barking: 'Dog Barking',
  glass_breaking: 'Glass Breaking',
  smoke_alarm: 'Smoke Alarm',
  phone_ringing: 'Phone Ringing',
  knock: 'Door Knock',
  siren: 'Emergency Siren',
};

// Background + text color styles for each sound
const soundColors = {
  alarm: 'bg-amber-500/20 text-amber-400',
  doorbell: 'bg-blue-500/20 text-blue-400',
  baby_crying: 'bg-pink-500/20 text-pink-400',
  car_horn: 'bg-yellow-500/20 text-yellow-400',
  dog_barking: 'bg-emerald-500/20 text-emerald-400',
  glass_breaking: 'bg-red-500/20 text-red-400',
  smoke_alarm: 'bg-red-600/20 text-red-400',
  phone_ringing: 'bg-violet-500/20 text-violet-400',
  knock: 'bg-slate-500/20 text-slate-400',
  siren: 'bg-red-500/20 text-red-400',
};

export default function AlertHistoryItem({ detection, index }) {
  // Pick icon, label, and color based on detected sound
  const Icon = soundIcons[detection.sound_type] || Volume2;
  const label = soundLabels[detection.sound_type] || detection.sound_type;
  const colorClass = soundColors[detection.sound_type] || 'bg-slate-500/20 text-slate-400';
  
  return (
    <motion.div
      // Animated list item container
      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Icon badge */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Sound label and timestamp */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white truncate">{label}</h3>
          {/* Checkmark if user acknowledged the alert */}
          {detection.acknowledged && (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-slate-400">
          {format(new Date(detection.timestamp), 'MMM d, h:mm a')}
        </p>
      </div>
      
      {/* Confidence score */}
      <div className="text-right">
        <span className="text-sm font-medium text-slate-300">
          {detection.confidence}%
        </span>
        <p className="text-xs text-slate-500">confidence</p>
      </div>
    </motion.div>
  );
}
