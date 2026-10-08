import React from 'react';
import { ArrowLeft, Gift, Award, CheckCircle2, Coins, Sparkles, Tv, Star, Play } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { ACHIEVEMENTS, canClaimDailyReward } from '../utils/storage';
import { sounds } from '../utils/audio';

interface RewardsModalProps {
  profile: PlayerProfile;
  onClaimDaily: () => void;
  onClaimAchievement: (id: string, coins: number) => void;
  onWatchBonusAd: (step: 1 | 2 | 3) => void;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  profile,
  onClaimDaily,
  onClaimAchievement,
  onWatchBonusAd,
  onClose,
}) => {
  const isDailyAvailable = canClaimDailyReward(profile);
  const adsWatched = profile.dailyAdsWatchedCount || 0;
  const currentAdStep = (adsWatched < 3 ? adsWatched + 1 : 3) as 1 | 2 | 3;
  const hasAdsRemaining = adsWatched < 3;

  const handleClaimDailyClick = () => {
    sounds.playCoin();
    onClaimDaily();
  };

  const handleClaimAchClick = (id: string, reward: number) => {
    sounds.playCoin();
    onClaimAchievement(id, reward);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 animate-fade-in overflow-hidden">
      {/* Top Header with Coins, Gems, Gifts */}
      <header className="flex items-center justify-between px-3 py-3 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Accueil</span>
        </button>

        <h1 className="text-base font-display font-bold text-white">
          Récompenses
        </h1>

        {/* Currency badges */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <span>{profile.coins}</span>
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300">
            <span>{profile.gems || 25}</span>
            <span className="text-xs">💎</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <span>{profile.gifts || 1}</span>
            <span className="text-xs">🎁</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-4 pb-8">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            AdMob Rewarded Ads Bonus Section (Rule B & C : 3 PUBLICITÉS)
            Permet de recevoir : ⭐ Étoiles, 🪙 Pièces, 💎 Diamants, 🎁 Cadeaux
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-purple-950/30 border-2 border-amber-400/40 rounded-3xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <Tv className="w-3.5 h-3.5" />
                <span>Google AdMob • Récompenses Gratuites</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white">
                Coffre aux Récompenses Quotidiennes
              </h2>
              <p className="text-xs text-slate-300">
                Regardez jusqu'à 3 courtes vidéos par jour pour débloquer de précieux cadeaux !
              </p>
            </div>
          </div>

          {/* 3 Steps indicator */}
          <div className="grid grid-cols-3 gap-2 my-3">
            {/* Step 1 */}
            <div
              className={`p-2 rounded-xl border text-center transition-all ${
                adsWatched >= 1
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : adsWatched === 0
                  ? 'bg-amber-950/40 border-amber-400/60 text-amber-200 ring-2 ring-amber-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold uppercase">
                {adsWatched >= 1 ? '✓ Récupéré' : 'Publicité 1/3'}
              </div>
              <div className="text-xs font-bold mt-1 text-slate-100 flex items-center justify-center gap-1">
                <span>+100🪙</span>
                <span>+1⭐</span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-2 rounded-xl border text-center transition-all ${
                adsWatched >= 2
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : adsWatched === 1
                  ? 'bg-amber-950/40 border-amber-400/60 text-amber-200 ring-2 ring-amber-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold uppercase">
                {adsWatched >= 2 ? '✓ Récupéré' : 'Publicité 2/3'}
              </div>
              <div className="text-xs font-bold mt-1 text-slate-100 flex items-center justify-center gap-1">
                <span>+15💎</span>
                <span>+100🪙</span>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-2 rounded-xl border text-center transition-all ${
                adsWatched >= 3
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                  : adsWatched === 2
                  ? 'bg-amber-950/40 border-amber-400/60 text-amber-200 ring-2 ring-amber-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold uppercase">
                {adsWatched >= 3 ? '✓ Récupéré' : 'Publicité 3/3'}
              </div>
              <div className="text-xs font-bold mt-1 text-slate-100 flex items-center justify-center gap-1">
                <span>+1🎁</span>
                <span>+25💎</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {hasAdsRemaining ? (
            <button
              onClick={() => onWatchBonusAd(currentAdStep)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-98 text-slate-950 font-display font-bold text-xs shadow-lg shadow-amber-500/20 border border-amber-300 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                Regarder la Publicité {currentAdStep}/3 • Recevoir la récompense
              </span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Toutes les 3 récompenses publicitaires du jour ont été obtenues !</span>
            </div>
          )}
        </div>

        {/* Daily Bonus Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Bonus de Connexion
              </span>
              <h2 className="text-base font-bold font-display text-white mt-0.5">
                Cadeau Quotidien
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Connectez-vous chaque jour pour accumuler des pièces et maintenir votre série.
              </p>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Série : {profile.consecutiveDays} jour(s)
            </span>
            <button
              onClick={handleClaimDailyClick}
              disabled={!isDailyAvailable}
              className={`
                py-1.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all
                ${
                  isDailyAvailable
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                }
              `}
            >
              <span>{isDailyAvailable ? 'Réclamer +75 🪙' : 'Déjà réclamé'}</span>
            </button>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Award className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Hauts Faits & Défis (500 Niveaux)
            </h2>
          </div>

          <div className="space-y-2">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = ach.isUnlocked(profile);
              const isClaimed = profile.completedAchievements.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80"
                >
                  <div className="space-y-0.5 max-w-[210px]">
                    <p className="text-xs font-bold text-slate-100">{ach.title}</p>
                    <p className="text-[11px] text-slate-400 leading-tight">{ach.description}</p>
                  </div>

                  <div>
                    {isClaimed ? (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Réussi</span>
                      </div>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleClaimAchClick(ach.id, ach.rewardCoins)}
                        className="py-1 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
                      >
                        +{ach.rewardCoins} 🪙
                      </button>
                    ) : (
                      <div className="text-[11px] text-slate-500 font-semibold px-2 py-0.5 bg-slate-800/60 rounded-lg">
                        +{ach.rewardCoins} 🪙
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
