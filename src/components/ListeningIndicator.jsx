import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

export default function ListeningIndicator({ isListening }) {
  return (
    <div className="relative">
      <motion.div
        className={`w-32 h-32 rounded-full flex items-center justify-center relative ${
          isListening 
            ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
            : 'bg-slate-800'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isListening ? (
          <Mic className="w-12 h-12 text-white" />
        ) : (
          <MicOff className="w-12 h-12 text-slate-400" />
        )}

        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
            />
          </>
        )}
      </motion.div>
      
      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-white">
          {isListening ? 'Listening' : 'Paused'}
        </p>
        <p className="text-sm text-slate-400">
          {isListening ? 'Tap to pause' : 'Tap to start'}
        </p>
      </div>
    </div>
  );
}
