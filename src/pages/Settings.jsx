/**
 * Settings Page
 * Configure flash alerts, vibration settings, detection sensitivity
 * Manage app preferences and view app information
 */

import React from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Vibrate, Sun, Gauge, Bell, 
  ChevronRight, Flashlight, Volume2, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['soundSettings'],
    queryFn: async () => {
      const allSettings = await api.entities.list('sound_settings');
      if (allSettings.length === 0) {
        return await api.entities.create('sound_settings', {
          enabled_sounds: ['Speech', 'Dog', 'Alarm', 'Doorbell', 'Baby cry, infant cry'],
          vibration_intensity: 50,
          flash_alerts: true,
          sensitivity: 50,
        });
      }
      return allSettings[0];
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.update('sound_settings', id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soundSettings'] });
    },
  });

  const updateSetting = (key, value) => {
    if (!settings) return;
    updateSettingsMutation.mutate({
      id: settings.id,
      data: { [key]: value },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="px-6 py-4 flex items-center gap-4">
          <Link 
            to={createPageUrl('Home')}
            className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        <section>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
            Alert Settings
          </h2>
          
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 divide-y divide-slate-700/50">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Flashlight className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">Flash Alerts</p>
                  <p className="text-sm text-slate-400">Screen flashes on detection</p>
                </div>
              </div>
              <Switch 
                checked={settings?.flash_alerts ?? true}
                onCheckedChange={(checked) => updateSetting('flash_alerts', checked)}
                className="data-[state=checked]:bg-violet-600"
                disabled={isLoading || !settings}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium">Vibration Alerts</p>
                  <p className="text-sm text-slate-400">Vibrate on detection</p>
                </div>
              </div>
              <Switch 
                checked={settings?.vibration_enabled ?? true}
                onCheckedChange={(checked) => updateSetting('vibration_enabled', checked)}
                className="data-[state=checked]:bg-violet-600"
                disabled={isLoading || !settings}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
            Intensity
          </h2>
          
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Vibration Strength</span>
                </div>
                <span className="text-sm text-violet-400">
                  {settings?.vibration_intensity || 50}%
                </span>
              </div>
              <Slider
                value={[settings?.vibration_intensity || 50]}
                onValueChange={([value]) => {
                  updateSetting('vibration_intensity', value);
                  // Haptic feedback proportional to strength
                  if (navigator.vibrate) {
                    const duration = Math.floor(value * 3); // 0-300ms
                    navigator.vibrate(duration);
                  }
                }}
                min={10}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-violet-500"
                disabled={isLoading || !settings}
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Light</span>
                <span>Strong</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Detection Sensitivity</span>
                </div>
                <span className="text-sm text-emerald-400">
                  {settings?.sensitivity || 50}%
                </span>
              </div>
              <Slider
                value={[settings?.sensitivity || 50]}
                onValueChange={([value]) => {
                  updateSetting('sensitivity', value);
                }}
                min={10}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-emerald-500"
                disabled={isLoading || !settings}
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
            Sound Detection
          </h2>
          
          <Link to={createPageUrl('SoundLibrary')}>
            <motion.div 
              className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 flex items-center justify-between"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Sound Library</p>
                  <p className="text-sm text-slate-400">
                    {settings?.enabled_sounds?.length || 0} sounds enabled
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </motion.div>
          </Link>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
            About
          </h2>
          
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">AudioWatch</h3>
            <p className="text-sm text-slate-400 mb-4">Sound Recognition App</p>
            <p className="text-xs text-slate-500">
              Version 1.0.0
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
