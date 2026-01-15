import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import {
  Bell, Baby, Car, Dog, AlertTriangle,
  Phone, Volume2, Siren, Hand, Flame
} from 'lucide-react';

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

const soundColors = {
  // Tailwind gradient classes for each sound type
  alarm: 'from-amber-500 to-orange-600',
  doorbell: 'from-blue-500 to-cyan-600',
  baby_crying: 'from-pink-500 to-rose-600',
  car_horn: 'from-yellow-500 to-amber-600',
  dog_barking: 'from-emerald-500 to-green-600',
  glass_breaking: 'from-red-500 to-rose-600',
  smoke_alarm: 'from-red-600 to-orange-600',
  phone_ringing: 'from-violet-500 to-purple-600',
  knock: 'from-slate-500 to-slate-600',
  siren: 'from-red-500 to-pink-600',
};

export default function SoundCard({ soundType, enabled, onToggle }) {
  // Pick the icon (fallback to Volume2 if unknown)
  const Icon = soundIcons[soundType] || Volume2;
  // Pick the label (fallback to the raw soundType)
  const label = soundLabels[soundType] || soundType;
  // Pick the gradient (fallback to gray)
  const gradient = soundColors[soundType] || 'from-slate-500 to-slate-600';

  return (
    <motion.div
      // Card styling changes based on enabled/disabled
      className={`relative overflow-hidden rounded-2xl p-4 ${
        enabled
          ? 'bg-slate-800/80 border border-slate-700'
          : 'bg-slate-900/50 border border-slate-800/50'
      }`}
      // Small hover/tap animations
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Icon bubble */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${
              enabled ? gradient : 'from-slate-700 to-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${enabled ? 'text-white' : 'text-slate-500'}`} />
          </div>

          {/* Sound name */}
          <span className={`font-medium ${enabled ? 'text-white' : 'text-slate-500'}`}>
            {label}
          </span>
        </div>

        {/* Toggle switch for enabling/disabling this sound */}
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-violet-600"
        />
      </div>

      {/* Subtle gradient overlay when enabled */}
      {enabled && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5 pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
        />
      )}
    </motion.div>
  );
}
