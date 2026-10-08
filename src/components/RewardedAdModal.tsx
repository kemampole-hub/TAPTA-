import React, { useState, useEffect } from 'react';
import { Tv, X, CheckCircle2, Play, Sparkles, ShieldCheck, Lock, AlertCircle, Coins, Gift } from 'lucide-react';
import { sounds } from '../utils/audio';
import { ADMOB_CONFIG, getActiveAdMobAppId, getActiveRewardedUnitId } from '../config/admob';

export type RewardedAdType = 'revive' | 'slot' | 'level' | 'bonus' | 'block' | 'block_bonus';

export interface RewardedAdModalProps {
  type: RewardedAdType;
  targetId?: number; // levelId, slotNumber, or bonus step (1, 2, 3)
  bonusStep?: number; // 1, 2, or 3
  isTestMode?: boolean;
  onAdCompleted: (type: RewardedAdType, targetId?: number) => void;
  onClose: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  type,
  targetId = 1,
  bonusStep = 1,
  isTestMode = true,
  onAdCompleted,
  onClose,
}) => {
  const TOTAL_DURATION = 5; // 5 seconds high-fidelity AdMob rewarded video
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_DURATION);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const activeUnitId = getActiveRewardedUnitId(isTestMode);
  const activeAppId = getActiveAdMobAppId(isTestMode);

  // Reward description clearly displayed before and during video
  const rewardDetails = React.useMemo(() => {
    switch (type) {
      case 'revive':
        return {
          title: 'Reprendre la Partie Immédiatement',
          subtitle: 'Seconde chance sans recommencer le niveau',
          badge: '▶ CONTINUER LA PARTIE',
          rewardPreview: '3 emplacements libérés et plateau conservé',
          icon: <Play className="w-8 h-8 text-amber-400 fill-current" />,
        };
      case 'slot':
        return {
          title: `Débloquer l'Emplacement ${targetId}`,
          subtitle: `Ajout définitif de l'emplacement ${targetId} dans votre barre`,
          badge: `EMPLACEMENT ${targetId}`,
          rewardPreview: `+1 case disponible en haut du jeu`,
          icon: <Lock className="w-8 h-8 text-amber-400" />,
        };
      case 'level':
        return {
          title: `Débloquer le Niveau ${targetId}`,
          subtitle: `Accès direct sans attendre la réussite du niveau précédent`,
          badge: `NIVEAU ${targetId}`,
          rewardPreview: `Accès complet au Niveau ${targetId}`,
          icon: <Sparkles className="w-8 h-8 text-amber-400" />,
        };
      case 'block':
        const blockEnd = Math.min(500, targetId + 9);
        return {
          title: `Débloquer les Niveaux ${targetId} à ${blockEnd}`,
          subtitle: `Accès immédiat et définitif aux 10 niveaux suivants`,
          badge: `BLOC ${targetId}–${blockEnd}`,
          rewardPreview: `+10 Niveaux débloqués (${targetId} à ${blockEnd})`,
          icon: <Sparkles className="w-8 h-8 text-amber-400" />,
        };
      case 'block_bonus':
        return {
          title: 'Bonus Spécial Optionnel',
          subtitle: 'Récompense aléatoire exclusive pour votre parcours',
          badge: 'BONUS OPTIONNEL',
          rewardPreview: '⭐ Étoiles, 🪙 Pièces, 💎 Diamants, 🎁 Cadeau ou 🎟️ Bonus',
          icon: <Gift className="w-8 h-8 text-emerald-400" />,
        };
      case 'bonus':
      default:
        if (bonusStep === 1) {
          return {
            title: 'Récompense Spéciale (1/3)',
            subtitle: 'Pack Pièces & Étoile d’Or',
            badge: 'PUBLICITÉ 1/3',
            rewardPreview: '+100 🪙 Pièces & +1 ⭐ Étoile',
            icon: <Coins className="w-8 h-8 text-amber-400" />,
          };
        } else if (bonusStep === 2) {
          return {
            title: 'Récompense Précieuse (2/3)',
            subtitle: 'Pack Diamants & Pièces',
            badge: 'PUBLICITÉ 2/3',
            rewardPreview: '+15 💎 Diamants & +100 🪙 Pièces',
            icon: <Sparkles className="w-8 h-8 text-sky-400" />,
          };
        } else {
          return {
            title: 'Grand Coffre Cadeau (3/3)',
            subtitle: 'Cadeau Mystère Suprême & Diamants',
            badge: 'PUBLICITÉ 3/3',
            rewardPreview: '+1 🎁 Coffre Mystère & +25 💎 Diamants',
            icon: <Gift className="w-8 h-8 text-emerald-400" />,
          };
        }
    }
  }, [type, targetId, bonusStep]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isCompleted && !hasClaimed) {
        setIsCompleted(true);
        setHasClaimed(true);
        sounds.playMatch();
        onAdCompleted(type, targetId);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted, hasClaimed, type, targetId, onAdCompleted]);

  const handleCloseAttempt = () => {
    if (isCompleted) {
      onClose();
    } else {
      setShowExitConfirm(true);
    }
  };

  const progressPercent = Math.min(100, Math.round(((TOTAL_DURATION - timeLeft) / TOTAL_DURATION) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* AdMob Bar Top */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/95 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Tv className="w-3.5 h-3.5" />
            <span>Google AdMob</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 font-mono">
              {isTestMode ? 'TEST' : 'PROD'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
                Récompense dans {timeLeft}s
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Récompense acquise !
              </span>
            )}

            <button
              onClick={handleCloseAttempt}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Fermer l'annonce"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ad Video Visual Container */}
        <div className="relative p-6 flex flex-col items-center justify-center text-center min-h-[300px] bg-radial from-slate-800 via-slate-900 to-slate-950">
          {/* Ad Unit & ID Banner for Google AdMob compliance */}
          <div className="absolute top-3 inset-x-4 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>Ad Unit: {activeUnitId.slice(0, 15)}...</span>
            <span>{rewardDetails.badge}</span>
          </div>

          {/* Animated decorative center badge */}
          <div className="relative my-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce">
              {rewardDetails.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-slate-950 border border-amber-400/60 text-[9px] font-bold text-amber-300 uppercase">
              {rewardDetails.badge}
            </div>
          </div>

          {/* Clear Reward Details (exigé: affiché avant & pendant le visionnage) */}
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-lg font-display font-bold text-white">
              {rewardDetails.title}
            </h3>
            <p className="text-xs text-slate-300">
              {rewardDetails.subtitle}
            </p>

            {/* Highlighted reward card */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-inner flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Récompense : {rewardDetails.rewardPreview}</span>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>AdMob Vidéo Sécurisée • Aucun prélèvement</span>
          </div>
        </div>

        {/* Ad Footer Action */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800/80">
          {isCompleted ? (
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-105 active:scale-98 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Récompense validée ! Continuer</span>
            </button>
          ) : (
            <div className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 text-slate-400 font-semibold text-xs text-center border border-slate-800">
              Visionnage requis ({timeLeft}s restantes)
            </div>
          )}
        </div>

        {/* Early Exit Confirmation Overlay */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <AlertCircle className="w-10 h-10 text-rose-400" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-rose-400">
                Attention : Ne partez pas maintenant !
              </p>
              <p className="text-xs text-slate-300">
                Si vous fermez la vidéo avant la fin, aucune récompense ne sera attribuée.
              </p>
            </div>
            <div className="w-full space-y-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-98 transition-all"
              >
                Continuer à regarder ({timeLeft}s)
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-700/60 transition-all"
              >
                Quitter sans récompense
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
