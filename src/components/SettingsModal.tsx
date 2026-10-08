import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Smartphone, HelpCircle, RotateCcw, Check, Tv, ShieldCheck, Info } from 'lucide-react';
import { ADMOB_CONFIG } from '../config/admob';

interface SettingsModalProps {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  isAdMobTestMode: boolean;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
  onToggleAdMobTestMode: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  hapticEnabled,
  isAdMobTestMode,
  onToggleSound,
  onToggleHaptic,
  onToggleAdMobTestMode,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetConfirm = () => {
    onResetProgress();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 animate-fade-in overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <h1 className="text-lg font-display font-bold text-white">Paramètres</h1>

        <div className="w-16" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-5 pb-8">
        {/* Audio & Haptic Controls */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Audio & Vibrations
          </h2>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl divide-y divide-slate-800/60">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Effets Sonores</p>
                  <p className="text-xs text-slate-400">Bruits de tuiles et mélodies</p>
                </div>
              </div>
              <button
                onClick={onToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Retour Haptique</p>
                  <p className="text-xs text-slate-400">Vibration au toucher</p>
                </div>
              </div>
              <button
                onClick={onToggleHaptic}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  hapticEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hapticEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            Google AdMob Configuration (Rule F: MODE TEST & PRODUCTION)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Configuration Google AdMob
            </h2>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span>Mode Test AdMob</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isAdMobTestMode
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isAdMobTestMode ? 'ACTIF (TEST)' : 'PRODUCTION'}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAdMobTestMode
                    ? 'Annonces de test Google pour le développement'
                    : 'Prêt pour diffusion en production avec vos identifiants'}
                </p>
              </div>

              <button
                onClick={onToggleAdMobTestMode}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  isAdMobTestMode ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isAdMobTestMode ? 'translate-x-0.5' : 'translate-x-6'
                  }`}
                />
              </button>
            </div>

            {/* Ad IDs display card */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-400">
              <div>
                <span className="text-slate-500 block">App ID AdMob :</span>
                <span className="text-amber-300 break-all select-all font-bold">
                  {ADMOB_CONFIG.appId}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-800/60">
                <span className="text-slate-500 block">Bloc Récompensé (Rewarded) :</span>
                <span className="text-emerald-300 break-all select-all font-bold">
                  {ADMOB_CONFIG.rewardedAdUnitId}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Compatible publication Android (Google Mobile Ads SDK / Capacitor).
              </span>
            </div>
          </div>
        </div>

        {/* How to play / Rules summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Règles du Jeu TAPTA (500 Niveaux)
            </h2>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-amber-400 font-display">1.</span>
              <p>
                Dès le niveau 1, vous disposez de <strong>4 emplacements de placement</strong> gratuits en haut de l'écran.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-amber-400 font-display">2.</span>
              <p>
                Les <strong>emplacements 5 à 8</strong> apparaissent progressivement selon votre progression (tranches de 100 niveaux) et peuvent être débloqués avec des vidéos récompensées.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-amber-400 font-display">3.</span>
              <p>
                Dès que <strong>deux tuiles identiques</strong> sont réunies dans la barre, elles s’éclatent avec de fins fragments blancs et libèrent instantanément leurs places.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="font-bold text-amber-400 font-display">4.</span>
              <p>
                <strong>Aucun chronomètre</strong> : vous jouez en toute sérénité sans limite de temps !
              </p>
            </div>
          </div>
        </div>

        {/* Tile symbols summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Symboles & Lettres (27 types)
          </h2>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-[11px] text-slate-400 space-y-2">
            <div>
              <span className="text-amber-300 font-semibold">7 Symboles : </span>
              <span># € ¥ $ ¢ § ∆</span>
            </div>
            <div>
              <span className="text-sky-300 font-semibold">20 Lettres : </span>
              <span>A B C D E F G H I J K L M N O P Q R S T</span>
            </div>
          </div>
        </div>

        {/* Danger zone / Reset progress */}
        <div className="pt-2">
          {resetSuccess ? (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Progression réinitialisée avec succès !</span>
            </div>
          ) : showConfirmReset ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-3">
              <p className="text-xs text-rose-300 font-semibold text-center">
                Voulez-vous vraiment effacer votre progression ?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleResetConfirm}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
                >
                  Oui, réinitialiser
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser la progression</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
