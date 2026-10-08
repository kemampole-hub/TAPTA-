import React, { useState } from 'react';
import { Tv, Sparkles, Play, Gift, ArrowLeft, CheckCircle2, Star, Coins, Lock, Award, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface BonusRewardItem {
  type: 'stars' | 'coins' | 'gems' | 'gift' | 'bundle';
  name: string;
  icon: string;
  description: string;
  valueDescription: string;
  coins?: number;
  gems?: number;
  gifts?: number;
  stars?: number;
}

export const POSSIBLE_BONUS_REWARDS: BonusRewardItem[] = [
  {
    type: 'coins',
    name: 'Bourse de Pièces',
    icon: '🪙',
    description: '+150 Pièces d’or offertes',
    valueDescription: '+150 🪙',
    coins: 150,
  },
  {
    type: 'gems',
    name: 'Écrin de Diamants',
    icon: '💎',
    description: '+20 Diamants précieux',
    valueDescription: '+20 💎',
    gems: 20,
  },
  {
    type: 'gift',
    name: 'Coffre Mystère',
    icon: '🎁',
    description: '+1 Grand Coffre Cadeau',
    valueDescription: '+1 🎁',
    gifts: 1,
  },
  {
    type: 'stars',
    name: 'Étoiles Célestes',
    icon: '⭐',
    description: '+10 Étoiles bonus de maîtrise',
    valueDescription: '+10 ⭐',
    stars: 10,
  },
  {
    type: 'bundle',
    name: 'Super Offre Bonus',
    icon: '🎟️',
    description: '+100 Pièces & +10 Diamants',
    valueDescription: '+100 🪙 & +10 💎',
    coins: 100,
    gems: 10,
  },
];

interface BlockUnlockModalProps {
  currentCompletedLevel?: number; // ex: 10, 20, 30...
  targetBlockStart: number; // ex: 11, 21, 31...
  targetBlockEnd: number; // ex: 20, 30, 40...
  isBlockUnlocked: boolean;
  bonusRewardGranted?: BonusRewardItem | null;
  onWatchAdToUnlockBlock: () => void;
  onWatchOptionalBonusAd: () => void;
  onContinueToLevel: (levelId: number) => void;
  onClose: () => void;
}

export const BlockUnlockModal: React.FC<BlockUnlockModalProps> = ({
  currentCompletedLevel,
  targetBlockStart,
  targetBlockEnd,
  isBlockUnlocked,
  bonusRewardGranted,
  onWatchAdToUnlockBlock,
  onWatchOptionalBonusAd,
  onContinueToLevel,
  onClose,
}) => {
  const blockTitle = `Niveaux ${targetBlockStart} à ${targetBlockEnd}`;
  const blockNumber = Math.ceil(targetBlockEnd / 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black overflow-hidden flex flex-col">
        {/* Top Header Glow Bar */}
        <div className={`h-2 w-full ${isBlockUnlocked ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500' : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500'}`} />

        {/* Content Container */}
        <div className="p-5 text-center flex flex-col items-center">
          {/* Badge & Stage Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-[11px] font-bold tracking-wider uppercase mb-3">
            {isBlockUnlocked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">BLOC {blockNumber} DÉBLOQUÉ</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">DÉBLOCAGE DE 10 NIVEAUX</span>
              </>
            )}
          </div>

          {/* Big Visual Icon */}
          <div className="relative my-2">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-xl ${
              isBlockUnlocked
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border-emerald-400/40 text-emerald-300'
                : 'bg-gradient-to-br from-amber-500/20 to-orange-600/30 border-amber-400/40 text-amber-300'
            }`}>
              {isBlockUnlocked ? (
                <Sparkles className="w-10 h-10 animate-bounce" />
              ) : (
                <Tv className="w-10 h-10 animate-pulse" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-amber-300">
              10 Niv.
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-2">
            {isBlockUnlocked ? '🎉 10 niveaux débloqués !' : '🎉 10 niveaux terminés !'}
          </h2>

          <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
            {isBlockUnlocked
              ? `Les niveaux ${targetBlockStart} à ${targetBlockEnd} sont maintenant accessibles et sauvegardés.`
              : `Félicitations pour votre progression ! Regardez une courte vidéo pour débloquer les niveaux ${targetBlockStart} à ${targetBlockEnd}.`}
          </p>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* ÉTAPE 1 : Le bloc est encore verrouillé (Pub 1 Requise) */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {!isBlockUnlocked && (
            <div className="w-full mt-5 space-y-3">
              {/* Preview Box of the 10 levels */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Prochains niveaux :
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Gratuit avec pub récompensée
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {Array.from({ length: 10 }, (_, i) => targetBlockStart + i).map((lvl) => (
                    <div
                      key={lvl}
                      className="py-1 px-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono font-bold text-slate-200"
                    >
                      {lvl}
                    </div>
                  ))}
                </div>
              </div>

              {/* PUB 1 : Bouton Principal « 📺 Regarder une publicité pour débloquer les 10 prochains niveaux » */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onWatchAdToUnlockBlock();
                }}
                className="w-full py-4 px-3 rounded-2xl
                bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600
                hover:from-amber-300 hover:to-amber-500
                text-slate-950 font-display font-black text-xs sm:text-sm tracking-wide
                shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all
                flex items-center justify-center gap-2"
              >
                <Tv className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
                <span className="text-center">📺 Regarder une publicité pour débloquer les 10 prochains niveaux</span>
              </button>

              {/* Bouton secondaire non-contraignant */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au menu principal</span>
              </button>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* ÉTAPE 2 : Le bloc est débloqué (Pub 2 100% Optionnelle)  */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {isBlockUnlocked && (
            <div className="w-full mt-4 space-y-3.5">
              {/* Visual Confirmation Banner */}
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Niveaux {targetBlockStart} à {targetBlockEnd} débloqués !</span>
              </div>

              {/* Bonus Already Claimed Feedback */}
              {bonusRewardGranted ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/20 border border-amber-400/40 text-center animate-fade-in">
                  <span className="text-2xl">{bonusRewardGranted.icon}</span>
                  <h4 className="text-sm font-bold text-amber-300 mt-1">
                    Bonus Obtenu : {bonusRewardGranted.name}
                  </h4>
                  <p className="text-xs text-slate-200 font-semibold mt-0.5">
                    {bonusRewardGranted.valueDescription} ({bonusRewardGranted.description})
                  </p>
                </div>
              ) : (
                /* PUB 2 : Offre Optionnelle pour Recevoir un Bonus */
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      Bonus Spécial (Optionnel)
                    </span>
                    <span className="text-[10px] text-slate-400">Non obligatoire</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    Recevez une récompense aléatoire : ⭐ Étoiles, 🪙 Pièces, 💎 Diamants, 🎁 Cadeau ou 🎟️ Offre !
                  </p>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      onWatchOptionalBonusAd();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl
                    bg-gradient-to-r from-emerald-500/30 via-slate-800/90 to-emerald-500/30
                    hover:from-emerald-500/40 hover:to-emerald-500/40
                    border border-emerald-500/50 hover:border-emerald-400
                    text-emerald-300 hover:text-white font-display font-bold text-xs
                    flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <span>🎁</span>
                    <span>Regarder une publicité pour recevoir un bonus</span>
                  </button>
                </div>
              )}

              {/* ACTION PRINCIPALE : Continuer directement avec le niveau */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onContinueToLevel(targetBlockStart);
                }}
                className="w-full py-3.5 px-4 rounded-2xl
                bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600
                hover:from-amber-300 hover:to-amber-500
                text-slate-950 font-display font-black text-sm tracking-wide
                shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all
                flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950 translate-x-0.5" />
                <span>▶ Continuer au niveau {targetBlockStart}</span>
              </button>

              {/* Quitter vers le menu */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                className="w-full py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Revenir au menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
