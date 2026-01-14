import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Zap } from 'lucide-react';

export default function AudioVisualization({ audioLevel, detectionProbability, isListening, detectedSound }) {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Mic className="w-4 h-4" />
            <span>Mic Volume</span>
          </div>
          <span className="text-slate-300 font-medium">
            {isListening ? `${Math.floor(audioLevel * 100)}%` : '0%'}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            animate={{
              width: isListening ? `${audioLevel * 100}%` : '0%',
            }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4" />
            <span>Detection Confidence</span>
          </div>
          <span className="text-slate-300 font-medium">
            {isListening ? `${Math.floor(detectionProbability)}%` : '0%'}
          </span>
        </div>
        {detectedSound && detectionProbability > 10 && (
          <div className="text-xs text-slate-400 text-center">
            Detecting: <span className="text-violet-400 font-medium">{detectedSound}</span>
          </div>
        )}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              detectionProbability > 60 
                ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                : detectionProbability > 30
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-slate-600 to-slate-500'
            }`}
            animate={{
              width: isListening ? `${detectionProbability}%` : '0%',
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
