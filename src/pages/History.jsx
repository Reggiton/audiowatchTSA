import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2, Filter, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import AlertHistoryItem from '../components/AlertHistoryItem';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

const SOUND_FILTERS = [
  { value: 'all', label: 'All Sounds' },
  { value: 'alarm', label: 'Alarms' },
  { value: 'doorbell', label: 'Doorbell' },
  { value: 'baby_crying', label: 'Baby Crying' },
  { value: 'car_horn', label: 'Car Horn' },
  { value: 'smoke_alarm', label: 'Smoke Alarm' },
  { value: 'siren', label: 'Emergency Siren' },
];

export default function History() {
  const [filter, setFilter] = useState('all');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: detections = [], isLoading } = useQuery({
    queryKey: ['allDetections'],
    queryFn: () => api.entities.DetectedSound.list('-timestamp', 100),
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      for (const detection of detections) {
        await api.entities.DetectedSound.delete(detection.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDetections'] });
      queryClient.invalidateQueries({ queryKey: ['recentDetections'] });
      setShowClearDialog(false);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      for (const detection of detections.filter(d => !d.acknowledged)) {
        await api.entities.DetectedSound.update(detection.id, { acknowledged: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDetections'] });
      queryClient.invalidateQueries({ queryKey: ['recentDetections'] });
    },
  });

  const filteredDetections = filter === 'all' 
    ? detections 
    : detections.filter(d => d.sound_type === filter);

  const groupedDetections = filteredDetections.reduce((groups, detection) => {
    const date = startOfDay(new Date(detection.timestamp)).toISOString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(detection);
    return groups;
  }, {});

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  const unreadCount = detections.filter(d => !d.acknowledged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to={createPageUrl('Home')}
              className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <h1 className="font-bold text-lg">Alert History</h1>
              <p className="text-xs text-slate-400">{detections.length} total alerts</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => markAllReadMutation.mutate()}
                className="w-10 h-10 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-slate-300" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Filter className="w-5 h-5 text-slate-300" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                {SOUND_FILTERS.map((item) => (
                  <DropdownMenuItem
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`${filter === item.value ? 'bg-violet-500/20 text-violet-400' : 'text-white'}`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        {filter !== 'all' && (
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-slate-400">Filtering:</span>
            <button
              onClick={() => setFilter('all')}
              className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm flex items-center gap-2"
            >
              {SOUND_FILTERS.find(f => f.value === filter)?.label}
              <span>×</span>
            </button>
          </motion.div>
        )}

        {!isLoading && filteredDetections.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">No Alerts Yet</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              {filter !== 'all' 
                ? `No ${SOUND_FILTERS.find(f => f.value === filter)?.label.toLowerCase()} detected yet.`
                : 'Start listening to detect sounds around you.'
              }
            </p>
          </motion.div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && Object.keys(groupedDetections).length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedDetections).map(([date, items]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {getDateLabel(date)}
                </h3>
                <div className="space-y-3">
                  {items.map((detection, index) => (
                    <AlertHistoryItem 
                      key={detection.id} 
                      detection={detection}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {detections.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(true)}
              className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          </motion.div>
        )}
      </main>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Clear All History?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete all {detections.length} alert records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clearAllMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
