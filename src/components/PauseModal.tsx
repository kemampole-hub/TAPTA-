import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Smartphone } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  soundEnabled,
  hapticEnabled,
  onToggleSound,
  onToggleHaptic,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center space-y-5">
        <h2 className="text-2xl font-display font-bold text-slate-100">Jeu en Pause</h2>

        {/* Quick Toggles */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onToggleSound}
            aria-label="Activer/Désactiver le son"
            className={`p-3 rounded-2xl border transition-colors ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={onToggleHaptic}
            aria-label="Activer/Désactiver les vibrations"
            className={`p-3 rounded-2xl border transition-colors ${
              hapticEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Reprendre</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recommencer</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Menu Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
