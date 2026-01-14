import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

export default function ListeningIndicator({ isListening, audioLevel = 0 }) {
  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-violet-500/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-violet-500/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </>
      )}
      
      {isListening && (
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-violet-500/40"
          animate={{
            scale: 1 + (audioLevel * 0.5),
          }}
          transition={{
            duration: 0.1,
          }}
        />
      )}
      
      <motion.div
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
          isListening 
            ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
            : 'bg-slate-700'
        }`}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isListening 
            ? '0 0 30px rgba(139, 92, 246, 0.5)' 
            : '0 0 0px rgba(139, 92, 246, 0)',
        }}
      >
        {isListening ? (
          <Mic className="w-7 h-7 text-white" />
        ) : (
          <MicOff className="w-7 h-7 text-slate-400" />
        )}
      </motion.div>
      
      <motion.p
        className="absolute -bottom-8 text-sm font-medium"
        animate={{
          color: isListening ? '#a78bfa' : '#94a3b8',
        }}
      >
        {isListening ? 'Listening...' : 'Paused'}
      </motion.p>
    </div>
  );
}
