import React, { useEffect } from 'react';
import { RotateCcw, Home, Sparkles, AlertCircle, Tv, Play } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DefeatModalProps {
  levelId: number;
  coins: number;
  onWatchAdToRevive?: () => void;
  onRevive: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({
  levelId,
  coins,
  onWatchAdToRevive,
  onRevive,
  onRestart,
  onHome,
}) => {
  const canReviveCoins = coins >= 60;

  useEffect(() => {
    sounds.playLose();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-4 relative overflow-hidden">
        {/* Ambient red glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-1">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Barre de sélection pleine !
          </h2>
          <p className="text-xs text-slate-400">
            Aucun espace libre restant pour de nouvelles tuiles.
          </p>
        </div>

        {/* Primary AdMob Rewarded Resume CTA (A. APRÈS UN ÉCHEC) */}
        {onWatchAdToRevive && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-amber-500/5 border-2 border-amber-400/50 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Seconde chance sans recommencer !</span>
            </div>

            <button
              onClick={onWatchAdToRevive}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-98 text-slate-950 font-display font-bold text-sm tracking-wide shadow-xl shadow-amber-500/30 border border-amber-200 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current text-slate-950" />
              <span>▶ Regarder une publicité pour continuer</span>
            </button>
            <p className="text-[10px] text-slate-400">
              Libère 3 emplacements et reprend la partie exactement là où vous étiez.
            </p>
          </div>
        )}

        {/* Alternative: Revive with 60 Coins */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium">Ou utiliser des pièces :</span>
          <button
            onClick={onRevive}
            disabled={!canReviveCoins}
            className={`
              py-1.5 px-3 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all
              ${
                canReviveCoins
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            <Sparkles className="w-3 h-3" />
            <span>Retirer 3 tuiles (60🪙)</span>
          </button>
        </div>

        {/* Regular actions: Restart or Home */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recommencer le Niveau {levelId}</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-semibold text-xs border border-slate-800/80 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Retour au Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
