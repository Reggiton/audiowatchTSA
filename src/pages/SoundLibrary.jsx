import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Info, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import AudioClassifier from '../components/AudioClassifier';

const CATEGORIES = [
  { id: 'all', label: 'All Sounds' },
  { id: 'speech', label: 'Speech & Human' },
  { id: 'animal', label: 'Animals' },
  { id: 'music', label: 'Music' },
  { id: 'vehicle', label: 'Vehicles' },
  { id: 'alarm', label: 'Alarms & Alerts' },
  { id: 'nature', label: 'Nature' },
  { id: 'household', label: 'Household' },
  { id: 'tools', label: 'Tools & Machines' },
];

export default function SoundLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  const allYamnetSounds = useMemo(() => AudioClassifier.getAllClasses(), []);

  const { data: corrections = [] } = useQuery({
    queryKey: ['soundCorrections'],
    queryFn: () => base44.entities.SoundCorrection.list(),
  });

  const customSoundNames = useMemo(() => {
    const names = new Set();
    corrections.forEach(correction => {
      names.add(correction.corrected_sound_type);
    });
    return Array.from(names);
  }, [corrections]);

  const allAvailableSounds = useMemo(() => {
    return [...customSoundNames, ...allYamnetSounds];
  }, [customSoundNames, allYamnetSounds]);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['soundSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.SoundSettings.list();
      if (allSettings.length === 0) {
        return await base44.entities.SoundSettings.create({
          enabled_sounds: ['alarm', 'doorbell', 'baby_crying', 'smoke_alarm', 'siren'],
          vibration_strength: 'medium',
          flash_alerts: true,
          sensitivity: 'medium',
        });
      }
      return allSettings[0];
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SoundSettings.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['soundSettings'] }),
  });

  const toggleSound = (soundType) => {
    if (!settings) return;
    
    const enabledSounds = settings.enabled_sounds || [];
    const isEnabled = enabledSounds.includes(soundType);
    
    const newEnabledSounds = isEnabled
      ? enabledSounds.filter(s => s !== soundType)
      : [...enabledSounds, soundType];
    
    updateSettingsMutation.mutate({
      id: settings.id,
      data: { enabled_sounds: newEnabledSounds },
    });
  };

  const enabledSounds = settings?.enabled_sounds || [];

  const filteredSounds = useMemo(() => {
    let sounds = allAvailableSounds;

    if (selectedCategory !== 'all') {
      sounds = sounds.filter(sound => {
        const lower = sound.toLowerCase();
        switch (selectedCategory) {
          case 'speech':
            return lower.includes('speech') || lower.includes('voice') || lower.includes('talk') || 
                   lower.includes('conversation') || lower.includes('laughter') || lower.includes('cry');
          case 'animal':
            return lower.includes('dog') || lower.includes('cat') || lower.includes('bird') || 
                   lower.includes('animal') || lower.includes('bark') || lower.includes('meow');
          case 'music':
            return lower.includes('music') || lower.includes('instrument') || lower.includes('guitar') || 
                   lower.includes('piano') || lower.includes('drum') || lower.includes('sing');
          case 'vehicle':
            return lower.includes('car') || lower.includes('vehicle') || lower.includes('motor') || 
                   lower.includes('truck') || lower.includes('train') || lower.includes('aircraft');
          case 'alarm':
            return lower.includes('alarm') || lower.includes('siren') || lower.includes('bell') || 
                   lower.includes('buzzer') || lower.includes('alert');
          case 'nature':
            return lower.includes('wind') || lower.includes('water') || lower.includes('rain') || 
                   lower.includes('thunder') || lower.includes('ocean') || lower.includes('wave');
          case 'household':
            return lower.includes('door') || lower.includes('dishes') || lower.includes('vacuum') || 
                   lower.includes('toilet') || lower.includes('tap') || lower.includes('microwave');
          case 'tools':
            return lower.includes('drill') || lower.includes('saw') || lower.includes('hammer') || 
                   lower.includes('tool') || lower.includes('machine');
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      sounds = sounds.filter(sound =>
        sound.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sounds;
  }, [allAvailableSounds, searchQuery, selectedCategory]);

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
          <div>
            <h1 className="font-bold text-lg">Sound Library</h1>
            <p className="text-xs text-slate-400">{enabledSounds.length} sounds active</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        <motion.div
          className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Info className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-violet-300">
            Choose from {allAvailableSounds.length}+ sounds detected by YamNet AI model. Custom corrected sounds appear at the top.
          </p>
        </motion.div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sounds..."
            className="pl-10 bg-slate-800 border-slate-700 text-white h-12"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-4">
          {filteredSounds.length} sounds {searchQuery || selectedCategory !== 'all' ? 'found' : 'available'}
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-slate-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredSounds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No sounds found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredSounds.map((sound, index) => {
              const isCustom = customSoundNames.includes(sound);
              return (
                <motion.div
                  key={sound}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5) }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{sound}</span>
                    {isCustom && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">
                        Custom
                      </span>
                    )}
                  </div>
                  <Switch
                    checked={enabledSounds.includes(sound)}
                    onCheckedChange={() => toggleSound(sound)}
                    className="data-[state=checked]:bg-violet-600"
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex gap-3 sticky bottom-0 bg-slate-950 py-4">
          <button
            onClick={() => {
              if (settings) {
                updateSettingsMutation.mutate({
                  id: settings.id,
                  data: { enabled_sounds: filteredSounds },
                });
              }
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
          >
            Enable Filtered
          </button>
          <button
            onClick={() => {
              if (settings) {
                updateSettingsMutation.mutate({
                  id: settings.id,
                  data: { enabled_sounds: [] },
                });
              }
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </main>
    </div>
  );
}
