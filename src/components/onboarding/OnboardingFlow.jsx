/**
 * Onboarding Flow Component
 * First-time user tutorial explaining app features
 * Walks through microphone permissions, alerts, and customization options
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { X, ChevronRight, Mic, Bell, Settings as SettingsIcon, Zap } from 'lucide-react';

// Onboarding step definitions with icon, color, and optional actions
const steps = [
  {
    title: "Welcome to AudioWatch",
    description: "Your AI-powered sound recognition assistant that helps you stay aware of important sounds around you.",
    icon: Zap,
    color: "from-violet-500 to-purple-600"
  },
  {
    title: "Microphone Access",
    description: "We need access to your microphone to detect sounds in real-time. Your audio is processed locally and never recorded or stored.",
    icon: Mic,
    color: "from-blue-500 to-cyan-600",
    action: "permission" // Triggers microphone permission request
  },
  {
    title: "Smart Alerts",
    description: "Get notified with vibrations and visual alerts when important sounds are detected. Each sound has its own unique alert pattern.",
    icon: Bell,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Customize Your Experience",
    description: "Choose which sounds to detect and adjust sensitivity, vibration strength, and alert preferences to match your needs.",
    icon: SettingsIcon,
    color: "from-emerald-500 to-green-600"
  }
];

export default function OnboardingFlow({ onComplete, onSkip }) {
  // Track current step index (0-3)
  const [currentStep, setCurrentStep] = useState(0);
  // Track whether microphone permission was granted
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Handle progression to next step, requesting permissions when needed
  const handleNext = async () => {
    const step = steps[currentStep];
    
    // Request microphone permission if this step requires it
    if (step.action === 'permission') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately stop the stream - just checking permission
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);
      } catch (err) {
        console.error('Permission denied:', err);
        return; // Don't advance if permission denied
      }
    }
    
    // Advance to next step or complete onboarding
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Current step data and derived states
  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;
  const needsPermission = step.action === 'permission';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {/* Skip button positioned above the card */}
        <button
          onClick={onSkip}
          className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
        >
          Skip
        </button>

        <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden">
          {/* Progress bar showing completion percentage */}
          <div className="h-1 bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8">
            {/* Animated icon display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="mb-6"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step title and description with slide transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Success message shown after permission granted */}
            {needsPermission && permissionGranted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center"
              >
                <p className="text-sm text-emerald-400">✓ Microphone access granted</p>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {/* Back button (hidden on first step) */}
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 h-12 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Back
                </Button>
              )}
              {/* Continue/Get Started button */}
              <Button
                onClick={handleNext}
                className={`flex-1 h-12 bg-gradient-to-r ${step.color} hover:opacity-90 text-white font-semibold`}
              >
                {isLastStep ? "Get Started" : "Continue"}
                {!isLastStep && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>

            {/* Step indicator dots */}
            <div className="flex justify-center gap-2 mt-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-violet-500'
                      : index < currentStep
                      ? 'w-1.5 bg-violet-500/50'
                      : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
