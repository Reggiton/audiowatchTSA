import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function SoundCorrectionDialog({ detection, open, onClose, onCorrect }) {
  const [correctedType, setCorrectedType] = useState('');

  const handleSubmit = () => {
    if (!correctedType.trim()) return;
    onCorrect(correctedType.trim());
    setCorrectedType('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Correct Sound Detection</DialogTitle>
          <DialogDescription className="text-slate-400">
            Help improve accuracy by telling us what sound this actually was.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-300 font-medium mb-1">Detected as:</p>
                <p className="text-white capitalize">{detection?.sound_type?.replace(/_/g, ' ')}</p>
                {detection?.rawClass && (
                  <p className="text-slate-400 text-xs mt-1">YamNet: {detection.rawClass}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What sound was this actually?
            </label>
            <Input
              value={correctedType}
              onChange={(e) => setCorrectedType(e.target.value)}
              placeholder="e.g., doorbell, alarm, dog barking"
              className="bg-slate-800 border-slate-700 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!correctedType.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              Save Correction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
