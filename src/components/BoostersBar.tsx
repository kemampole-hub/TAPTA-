import React from 'react';
import { Undo2, Shuffle, Sparkles, Lightbulb } from 'lucide-react';

interface BoostersBarProps {
  coins: number;
  freeUndos: number;
  freeHints: number;
  canUndo: boolean;
  canShuffle: boolean;
  canRecall: boolean;
  canHint: boolean;
  onUndo: () => void;
  onShuffle: () => void;
  onRecall: () => void;
  onHint: () => void;
  disabled?: boolean;
}

export const BoostersBar: React.FC<BoostersBarProps> = ({
  coins,
  freeUndos,
  freeHints,
  canUndo,
  canShuffle,
  canRecall,
  canHint,
  onUndo,
  onShuffle,
  onRecall,
  onHint,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 my-1.5 select-none w-full px-1">
      {/* Indice Button */}
      <button
        onClick={onHint}
        disabled={disabled || !canHint}
        className={`
          flex-1 max-w-[95px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border text-[11px] font-semibold
          transition-all active:scale-95 touch-manipulation
          ${
            canHint && !disabled
              ? 'bg-slate-800/90 border-amber-500/50 text-amber-200 hover:bg-slate-700/90 hover:border-amber-400 shadow-sm'
              : 'bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-not-allowed'
          }
        `}
      >
        <div className="flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Indice</span>
        </div>
        <span className="text-[9px] px-1 py-0.2 bg-slate-950/80 rounded border border-slate-700 text-amber-300 mt-0.5">
          {freeHints > 0 ? `${freeHints} gratuit` : '15🪙'}
        </span>
      </button>

      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={disabled || !canUndo}
        className={`
          flex-1 max-w-[95px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border text-[11px] font-semibold
          transition-all active:scale-95 touch-manipulation
          ${
            canUndo && !disabled
              ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/90 hover:border-amber-500/40'
              : 'bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-not-allowed'
          }
        `}
      >
        <div className="flex items-center gap-1">
          <Undo2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Annuler</span>
        </div>
        <span className="text-[9px] px-1 py-0.2 bg-slate-950/80 rounded border border-slate-700 text-amber-300 mt-0.5">
          {freeUndos > 0 ? `${freeUndos} gratuit` : '25🪙'}
        </span>
      </button>

      {/* Shuffle Button */}
      <button
        onClick={onShuffle}
        disabled={disabled || !canShuffle}
        className={`
          flex-1 max-w-[95px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border text-[11px] font-semibold
          transition-all active:scale-95 touch-manipulation
          ${
            canShuffle && !disabled
              ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/90 hover:border-sky-500/40'
              : 'bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-not-allowed'
          }
        `}
      >
        <div className="flex items-center gap-1">
          <Shuffle className="w-3.5 h-3.5 text-sky-400" />
          <span>Mélanger</span>
        </div>
        <span className="text-[9px] px-1 py-0.2 bg-slate-950/80 rounded border border-slate-700 text-sky-300 mt-0.5">
          50🪙
        </span>
      </button>

      {/* Recall / Safe-Tray Button */}
      <button
        onClick={onRecall}
        disabled={disabled || !canRecall}
        className={`
          flex-1 max-w-[95px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border text-[11px] font-semibold
          transition-all active:scale-95 touch-manipulation
          ${
            canRecall && !disabled
              ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/90 hover:border-emerald-500/40'
              : 'bg-slate-900/40 border-slate-800/50 text-slate-600 cursor-not-allowed'
          }
        `}
      >
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vider 3</span>
        </div>
        <span className="text-[9px] px-1 py-0.2 bg-slate-950/80 rounded border border-slate-700 text-emerald-300 mt-0.5">
          60🪙
        </span>
      </button>
    </div>
  );
};
