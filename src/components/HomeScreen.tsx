import React, { useState, useEffect } from 'react';
import { Play, Settings, Coins, Trophy } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { hasPlayerSave, getResumeLevel } from '../utils/storage';
import { TaptaLogo3D } from './TaptaLogo3D';
import { FloatingTilesBackground } from './FloatingTilesBackground';
import { LubumbashiBackdrop } from './LubumbashiBackdrop';
import { sounds } from '../utils/audio';

interface HomeScreenProps {
  profile: PlayerProfile;
  onPlay: (levelId?: number) => void;
  onOpenLevels: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onPlay,
  onOpenLevels,
  onOpenRewards,
  onOpenSettings,
}) => {
  // Splash Screen State (2 seconds short entrance animation)
  const [isSplashPhase, setIsSplashPhase] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(15);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const totalStars = Object.values(profile.levelStars).reduce((acc, s) => acc + s, 0);

  // Splash sequence timer: 2 seconds loading then smooth transition into main menu
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, prev + 25);
      });
    }, 400);

    const finishSplashTimer = setTimeout(() => {
      setIsSplashPhase(false);
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(finishSplashTimer);
    };
  }, []);

  // Allow player to tap anywhere during splash to skip immediately
  const handleSkipSplash = () => {
    if (isSplashPhase) {
      setIsSplashPhase(false);
    }
  };

  // Main JOUER / Continuer action:
  // Si une sauvegarde existe : « Continuer au niveau X »
  // Si aucune sauvegarde n'existe : « JOUER » (commencer au niveau 1)
  const isSavedGame = hasPlayerSave(profile);
  const resumeLevel = getResumeLevel(profile);

  const handlePlayMainButton = () => {
    sounds.playTap();
    if (isSavedGame) {
      onPlay(resumeLevel);
    } else {
      onPlay(1);
    }
  };

  // Partage natif Android : « 👥 Inviter des amis »
  const handleInviteFriends = async (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();

    const gameUrl = window.location.href.split('?')[0].split('#')[0];
    const shareMessage = `🎮 Viens jouer à TAPTA !\nTeste tes réflexes et ta logique avec des centaines de niveaux.\nRejoins-moi sur TAPTA !\n${gameUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'TAPTA',
          text: shareMessage,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(shareMessage);
            setCopiedNotice(true);
            setTimeout(() => setCopiedNotice(false), 2500);
          } catch {
            // no-op
          }
        }
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareMessage);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2500);
      } catch {
        // no-op
      }
    }
  };

  return (
    <div
      onClick={handleSkipSplash}
      className="relative h-full w-full max-w-md mx-auto flex flex-col justify-between overflow-hidden select-none bg-[#02040A] text-slate-100 font-sans"
    >
      {/* 1. SCENIC BACKDROP (Ciel bleu nuit & Collines de Lubumbashi) */}
      <LubumbashiBackdrop />

      {/* 2. FLOATING 3D COLORFUL TILES AROUND SCREEN (#, €, ¥, $, ¢, §, ∆, Lettres) */}
      <FloatingTilesBackground />

      {/* 3. TOP COMPACT STAT BAR (Visible une fois le menu affiché) */}
      <header
        className={`relative z-40 flex items-center justify-between px-3 pt-3 transition-opacity duration-700 ${
          isSplashPhase ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Currencies: Pièces 🪙, Diamants 💎, Cadeaux 🎁 */}
        <div className="flex items-center gap-1.5">
          {/* Pièces */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-slate-950/80 border border-amber-500/35 shadow-md backdrop-blur-md">
            <span className="text-xs font-bold text-amber-300 tabular-nums">
              {profile.coins}
            </span>
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Diamants */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-slate-950/80 border border-sky-500/35 shadow-md backdrop-blur-md">
            <span className="text-xs font-bold text-sky-300 tabular-nums">
              {profile.gems || 25}
            </span>
            <span className="text-xs">💎</span>
          </div>

          {/* Cadeaux */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-slate-950/80 border border-emerald-500/35 shadow-md backdrop-blur-md">
            <span className="text-xs font-bold text-emerald-300 tabular-nums">
              {profile.gifts || 1}
            </span>
            <span className="text-xs">🎁</span>
          </div>
        </div>

        {/* Étoiles & Paramètres */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-md backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-slate-200 tabular-nums">
              {totalStars} ★
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playTap();
              onOpenSettings();
            }}
            aria-label="Paramètres"
            className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 active:scale-95 transition-all shadow-md backdrop-blur-md"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 4. CENTER BRAND & 3D LOGO (TAPTA avec mini-pyramide & sous-titre) */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 py-2 my-auto">
        <div className={`${isSplashPhase ? 'animate-logo-entrance' : ''} transition-transform`}>
          <TaptaLogo3D showPyramid={true} showSubtitle={true} />
        </div>
      </div>

      {/* 5. BOTTOM SECTION: SPLASH LOADER OR INTERACTIVE MENU */}
      <div className="relative z-40 px-5 pb-5 w-full max-w-sm mx-auto">
        {/* A. SPLASH SCREEN PROGRESS BAR (Pendant les 2 premières secondes) */}
        {isSplashPhase ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2.5 animate-fade-in">
            {/* Golden loading bar */}
            <div className="w-48 h-2.5 rounded-full bg-slate-900/90 border border-amber-500/40 overflow-hidden shadow-inner p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.6)] transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-amber-300/80 tracking-widest font-semibold uppercase">
              Chargement...
            </p>
            <p className="text-[10px] text-slate-500 animate-pulse">
              Touchez pour continuer
            </p>
          </div>
        ) : (
          /* B. MAIN INTERACTIVE MENU (Après 2 secondes) */
          <div className="space-y-4 animate-fade-in">
            {/* GROS BOUTON 3D « Continuer au niveau X » OU « JOUER » */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayMainButton();
              }}
              className="w-full py-3.5 px-4 rounded-3xl
              bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#D97706]
              border-2 border-[#FEF9C3]
              btn-3d-play
              text-slate-950 font-display font-black text-xl sm:text-2xl tracking-wide
              flex items-center justify-center gap-3 select-none active:scale-[0.98] transition-all shadow-xl shadow-amber-950/40"
            >
              <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md shrink-0">
                <Play className="w-4 h-4 fill-slate-950 text-slate-950 translate-x-0.5" />
              </div>
              <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] truncate">
                {isSavedGame ? `Continuer au niveau ${resumeLevel}` : 'JOUER'}
              </span>
            </button>

            {/* QUATRE PETITES FONCTIONNALITÉS DU MENU :
                ⭐ Niveaux
                💎 Récompenses
                🎁 Cadeaux
                🏆 Défis */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {/* 1. ⭐ Niveaux */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onOpenLevels();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 shadow-lg active:scale-95 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-xl">⭐</span>
                </div>
                <span className="text-[11px] font-bold text-slate-200 mt-1.5">
                  Niveaux
                </span>
                <span className="text-[9px] text-amber-400 font-semibold leading-none">
                  500 niv.
                </span>
              </button>

              {/* 2. 💎 Récompenses */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onOpenRewards();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/40 shadow-lg active:scale-95 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-sky-600/30 border border-sky-400/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-xl">💎</span>
                </div>
                <span className="text-[11px] font-bold text-slate-200 mt-1.5">
                  Récompenses
                </span>
                <span className="text-[9px] text-sky-400 font-semibold leading-none">
                  Bonus Ad
                </span>
              </button>

              {/* 3. 🎁 Cadeaux */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onOpenRewards();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 shadow-lg active:scale-95 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/30 border border-emerald-400/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-xl">🎁</span>
                </div>
                <span className="text-[11px] font-bold text-slate-200 mt-1.5">
                  Cadeaux
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold leading-none">
                  Quotidien
                </span>
              </button>

              {/* 4. 🏆 Défis */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onOpenRewards();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/40 shadow-lg active:scale-95 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-600/30 border border-purple-400/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-xl">🏆</span>
                </div>
                <span className="text-[11px] font-bold text-slate-200 mt-1.5">
                  Défis
                </span>
                <span className="text-[9px] text-purple-400 font-semibold leading-none">
                  Quêtes
                </span>
              </button>
            </div>

            {/* BOUTON UNIQUE : « 👥 Inviter des amis » */}
            <div className="pt-0.5">
              <button
                onClick={handleInviteFriends}
                className="w-full py-3 px-4 rounded-2xl
                bg-slate-900/90 hover:bg-slate-800/90
                border border-sky-400/40 hover:border-sky-300
                shadow-lg shadow-sky-950/50
                flex items-center justify-center gap-2.5
                text-sky-200 hover:text-white
                font-display font-bold text-sm tracking-wide
                active:scale-[0.98] transition-all select-none"
              >
                <span className="text-base">👥</span>
                <span>Inviter des amis</span>
              </button>
              {copiedNotice && (
                <p className="text-center text-[11px] font-semibold text-emerald-400 animate-fade-in mt-1">
                  ✓ Message d'invitation copié !
                </p>
              )}
            </div>

            {/* Motivational Tagline at Bottom */}
            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm font-display italic font-semibold text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Joue aujourd'hui, deviens meilleur demain !
              </p>
              <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
