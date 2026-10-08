import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { sounds } from '../utils/audio';

interface VictoryModalProps {
  levelId: number;
  score: number;
  stars: number;
  coinsEarned: number;
  onNextLevel: () => void;
  onWatchAdToUnlockNext?: () => void;
  isNextLevelUnlocked?: boolean;
  onRestart: () => void;
  onHome: () => void;
  hasNextLevel: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  score,
  stars,
  coinsEarned,
  onNextLevel,
  onWatchAdToUnlockNext,
  isNextLevelUnlocked = true,
  onRestart,
  onHome,
  hasNextLevel,
}) => {
  useEffect(() => {
    sounds.playWin();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#38BDF8', '#10B981', '#EC4899', '#A855F7'],
      });
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Félicitations !
          </span>
          <h2 className="text-3xl font-display font-bold text-white drop-shadow">
            Niveau {levelId} Réussi
          </h2>
        </div>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`transform transition-all duration-500 ${
                starIndex <= stars
                  ? 'scale-110 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700 scale-90'
              }`}
            >
              <Star
                className="w-10 h-10"
                fill={starIndex <= stars ? '#FBBF24' : 'transparent'}
                strokeWidth={1.5}
              />
            </div>
          ))}
        </div>

        {/* Stats card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 gap-3 text-left">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Score</span>
            <p className="text-xl font-bold text-slate-100 tabular-nums">{score}</p>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Gain</span>
            <p className="text-xl font-bold text-amber-400 flex items-center gap-1 tabular-nums">
              +{coinsEarned} <span className="text-sm">🪙</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          {hasNextLevel ? (
            isNextLevelUnlocked ? (
              <button
                onClick={onNextLevel}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-base tracking-wide shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Niveau Suivant ({levelId + 1})</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onWatchAdToUnlockNext || onNextLevel}
                className="w-full py-3.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>📺 Regarder une publicité pour débloquer les 10 prochains niveaux</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            )
          ) : (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-sm font-semibold">
              🎉 Bravo ! Vous avez terminé les 500 niveaux !
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onRestart}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rejouer</span>
            </button>
            <button
              onClick={onHome}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
