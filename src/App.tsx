import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerProfile } from './types/game';
import { loadProfile, saveProfile, isLevelUnlocked, getResumeLevel, DEFAULT_PROFILE, getBlockInfo, isBlockFullyUnlocked } from './utils/storage';
import { getAllLevels } from './utils/levels';
import { sounds } from './utils/audio';
import { adMobService } from './services/admobService';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { LevelsModal } from './components/LevelsModal';
import { RewardsModal } from './components/RewardsModal';
import { SettingsModal } from './components/SettingsModal';
import { RewardedAdModal, RewardedAdType } from './components/RewardedAdModal';
import { BlockUnlockModal, BonusRewardItem, POSSIBLE_BONUS_REWARDS } from './components/BlockUnlockModal';

type AppScreen = 'HOME' | 'PLAYING' | 'LEVELS' | 'REWARDS' | 'SETTINGS';

interface AdModalState {
  type: RewardedAdType;
  targetId?: number;
  step?: 1 | 2 | 3;
}

interface BlockUnlockTarget {
  blockStart: number;
  blockEnd: number;
  currentCompletedLevel?: number;
}

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [activeLevelId, setActiveLevelId] = useState<number>(() => {
    const init = loadProfile();
    return getResumeLevel(init);
  });
  const [adModalTarget, setAdModalTarget] = useState<AdModalState | null>(null);
  const [adToastMessage, setAdToastMessage] = useState<string | null>(null);
  const [reviveSignal, setReviveSignal] = useState<number>(0);
  const [blockUnlockTarget, setBlockUnlockTarget] = useState<BlockUnlockTarget | null>(null);
  const [bonusRewardGranted, setBonusRewardGranted] = useState<BonusRewardItem | null>(null);

  // Pre-generate all 500 levels
  const allLevels = useMemo(() => getAllLevels(), []);

  // Sync sound & haptics with SoundManager
  useEffect(() => {
    sounds.setSoundEnabled(profile.soundEnabled);
    sounds.setHapticsEnabled(profile.hapticEnabled);
  }, [profile.soundEnabled, profile.hapticEnabled]);

  // Persist profile changes to localStorage automatically
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Guaranteed flush on window close, page reload or tab switch
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProfile(profile);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveProfile(profile);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile]);

  // Toast trigger for AdMob errors or unavailable notices
  const triggerToast = useCallback((msg: string) => {
    setAdToastMessage(msg);
    setTimeout(() => {
      setAdToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  // Safe ad launcher: checks availability without ever crashing or blocking the game
  const requestRewardedAd = useCallback(
    (target: AdModalState) => {
      if (!adMobService.isReady()) {
        triggerToast('Publicité indisponible, réessayez plus tard.');
        return;
      }
      setAdModalTarget(target);
    },
    [triggerToast]
  );

  // Find active level definition
  const currentLevel = useMemo(() => {
    return allLevels.find((lvl) => lvl.id === activeLevelId) || allLevels[0];
  }, [allLevels, activeLevelId]);

  // Ouvre l'écran de déblocage par bloc de 10
  const openBlockUnlock = useCallback((targetLevelId: number, currentLevelId?: number) => {
    const info = getBlockInfo(targetLevelId);
    setBlockUnlockTarget({
      blockStart: info.start,
      blockEnd: info.end,
      currentCompletedLevel: currentLevelId,
    });
    setBonusRewardGranted(null);
  }, []);

  // Start playing level (checks unlock status and auto-saves current level)
  const handleStartLevel = (levelId?: number) => {
    const targetId = levelId || getResumeLevel(profile);
    if (!isLevelUnlocked(profile, targetId)) {
      openBlockUnlock(targetId);
      return;
    }
    setActiveLevelId(targetId);
    setCurrentScreen('PLAYING');

    // Sauvegarder automatiquement le niveau actuellement en cours
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        currentLevelId: targetId,
        lastReachedLevel: Math.max(prev.lastReachedLevel || 1, targetId),
        hasSavedGame: true,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Next level trigger (auto-saves progress and progression)
  const handleNextLevel = () => {
    const nextId = activeLevelId + 1;
    if (nextId <= allLevels.length) {
      if (isLevelUnlocked(profile, nextId)) {
        setActiveLevelId(nextId);
        setProfile((prev) => {
          const updated: PlayerProfile = {
            ...prev,
            currentLevelId: nextId,
            lastReachedLevel: Math.max(prev.lastReachedLevel || 1, nextId),
            hasSavedGame: true,
            lastSavedTimestamp: Date.now(),
          };
          saveProfile(updated);
          return updated;
        });
      } else {
        // Bloque le passage et ouvre l'écran de déblocage du bloc de 10
        openBlockUnlock(nextId, activeLevelId);
      }
    } else {
      setCurrentScreen('HOME');
    }
  };

  // Level completed handler (Rule 5: déblocage et sauvegarde immédiate et persistante)
  const handleLevelComplete = (
    completedId: number,
    levelScore: number,
    stars: number,
    coinsEarned: number
  ) => {
    setProfile((prev) => {
      const currentStars = prev.levelStars[completedId] || 0;
      const newStars = Math.max(currentStars, stars);
      const newCoins = prev.coins + coinsEarned;
      const newHighScore = Math.max(prev.highScore, levelScore);

      const nextId = completedId + 1;
      const nextUnlocked =
        nextId <= allLevels.length && (nextId <= 10 || isLevelUnlocked(prev, nextId))
          ? Array.from(new Set([...prev.unlockedLevels, nextId]))
          : prev.unlockedLevels;
      const newUnlockedLevel = Math.max(
        prev.unlockedLevel || 1,
        nextId <= allLevels.length && (nextId <= 10 || isLevelUnlocked(prev, nextId)) ? nextId : completedId
      );
      const newCurrentLevel = nextId <= allLevels.length ? nextId : completedId;

      const existingCompleted = prev.completedLevels || Object.keys(prev.levelStars).map(Number);
      const newCompletedLevels = Array.from(new Set([...existingCompleted, completedId])).sort((a, b) => a - b);

      const updated: PlayerProfile = {
        ...prev,
        coins: newCoins,
        levelStars: {
          ...prev.levelStars,
          [completedId]: newStars,
        },
        completedLevels: newCompletedLevels,
        highScore: newHighScore,
        unlockedLevels: nextUnlocked,
        unlockedLevel: newUnlockedLevel,
        currentLevelId: newCurrentLevel,
        lastReachedLevel: Math.max(prev.lastReachedLevel || 1, newUnlockedLevel),
        hasSavedGame: true,
        lastSavedTimestamp: Date.now(),
      };
      // Sauvegarde immédiate persistante
      saveProfile(updated);

      // Déblocage par bloc de 10 : Après avoir terminé 10 niveaux (ex: 10, 20, 30, ...)
      if (completedId % 10 === 0 && completedId < allLevels.length) {
        const nextBlockStart = completedId + 1;
        if (!updated.unlockedLevels.includes(nextBlockStart)) {
          setTimeout(() => {
            openBlockUnlock(nextBlockStart, completedId);
          }, 1300);
        }
      }

      return updated;
    });
  };

  // AdMob Rewarded Ad completed callback
  const handleAdRewardGranted = (type: RewardedAdType, targetId?: number) => {
    adMobService.consumeAd();

    if (type === 'revive') {
      // Reprendre exactement là où le joueur était avant l'échec
      setReviveSignal(Date.now());
      sounds.playBooster();
    } else if (type === 'slot' && targetId) {
      // Déblocage définitif de l'emplacement (5, 6, 7, ou 8) avec sauvegarde immédiate
      setProfile((prev) => {
        const newSlots = Math.min(8, Math.max(prev.unlockedSlotsCount || 4, targetId));
        const updated: PlayerProfile = {
          ...prev,
          unlockedSlotsCount: newSlots,
          hasSavedGame: true,
          lastSavedTimestamp: Date.now(),
        };
        saveProfile(updated);
        return updated;
      });
    } else if (type === 'block' && targetId) {
      // PUB 1 : Déblocage immédiat des 10 niveaux du bloc (targetId à targetId + 9)
      const blockStart = targetId;
      const blockEnd = Math.min(500, targetId + 9);
      const newBlockLevels: number[] = [];
      for (let l = blockStart; l <= blockEnd; l++) {
        newBlockLevels.push(l);
      }

      setProfile((prev) => {
        const merged = Array.from(new Set([...prev.unlockedLevels, ...newBlockLevels])).sort((a, b) => a - b);
        const updated: PlayerProfile = {
          ...prev,
          unlockedLevels: merged,
          unlockedLevel: Math.max(prev.unlockedLevel || 1, blockStart),
          currentLevelId: blockStart,
          lastReachedLevel: Math.max(prev.lastReachedLevel || 1, blockStart),
          hasSavedGame: true,
          lastSavedTimestamp: Date.now(),
        };
        saveProfile(updated);
        return updated;
      });
      sounds.playWin();
    } else if (type === 'block_bonus') {
      // PUB 2 : Bonus optionnel tiré aléatoirement
      const randomIndex = Math.floor(Math.random() * POSSIBLE_BONUS_REWARDS.length);
      const randomBonus = POSSIBLE_BONUS_REWARDS[randomIndex];
      setBonusRewardGranted(randomBonus);

      setProfile((prev) => {
        const updated: PlayerProfile = {
          ...prev,
          coins: prev.coins + (randomBonus.coins || 0),
          gems: (prev.gems || 25) + (randomBonus.gems || 0),
          gifts: (prev.gifts || 1) + (randomBonus.gifts || 0),
          highScore: prev.highScore + (randomBonus.stars ? randomBonus.stars * 150 : 0),
          lastSavedTimestamp: Date.now(),
        };
        saveProfile(updated);
        return updated;
      });
      sounds.playBooster();
    } else if (type === 'level' && targetId) {
      // Déblocage d'un niveau avec sauvegarde immédiate
      setProfile((prev) => {
        const updated: PlayerProfile = {
          ...prev,
          unlockedLevels: Array.from(new Set([...prev.unlockedLevels, targetId])),
          unlockedLevel: Math.max(prev.unlockedLevel || 1, targetId),
          lastReachedLevel: Math.max(prev.lastReachedLevel || 1, targetId),
          currentLevelId: targetId,
          hasSavedGame: true,
          lastSavedTimestamp: Date.now(),
        };
        saveProfile(updated);
        return updated;
      });
    } else if (type === 'bonus') {
      // Progression 1/3, 2/3, 3/3 pour les récompenses
      const today = new Date().toISOString().slice(0, 10);
      setProfile((prev) => {
        const nextCount = Math.min(3, (prev.dailyAdsWatchedCount || 0) + 1);
        let addCoins = 0;
        let addGems = 0;
        let addGifts = 0;

        if (nextCount === 1) {
          addCoins = 100;
        } else if (nextCount === 2) {
          addGems = 15;
          addCoins = 100;
        } else if (nextCount === 3) {
          addGifts = 1;
          addGems = 25;
        }

        const updated: PlayerProfile = {
          ...prev,
          coins: prev.coins + addCoins,
          gems: (prev.gems || 25) + addGems,
          gifts: (prev.gifts || 1) + addGifts,
          dailyAdsWatchedCount: nextCount,
          lastAdsWatchedDate: today,
          lastSavedTimestamp: Date.now(),
        };
        saveProfile(updated);
        return updated;
      });
    }
  };

  // Spend coins for boosters
  const handleSpendCoins = (amount: number): boolean => {
    if (profile.coins < amount) return false;
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        coins: prev.coins - amount,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
    return true;
  };

  // Add coins (matches, rewards)
  const handleAddCoins = (amount: number) => {
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        coins: prev.coins + amount,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Toggle sound
  const handleToggleSound = () => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        soundEnabled: !prev.soundEnabled,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Toggle haptics
  const handleToggleHaptic = () => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        hapticEnabled: !prev.hapticEnabled,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Toggle AdMob Test Mode vs Production
  const handleToggleAdMobTestMode = () => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        isAdMobTestMode: !prev.isAdMobTestMode,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Claim Daily Login Reward
  const handleClaimDaily = () => {
    const today = new Date().toISOString().slice(0, 10);
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        coins: prev.coins + 75,
        lastDailyRewardDate: today,
        consecutiveDays: prev.consecutiveDays + 1,
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Claim Achievement
  const handleClaimAchievement = (achId: string, reward: number) => {
    setProfile((prev) => {
      const updated: PlayerProfile = {
        ...prev,
        coins: prev.coins + reward,
        completedAchievements: [...prev.completedAchievements, achId],
        lastSavedTimestamp: Date.now(),
      };
      saveProfile(updated);
      return updated;
    });
  };

  // Reset Progress
  const handleResetProgress = () => {
    const resetProf: PlayerProfile = {
      ...DEFAULT_PROFILE,
      soundEnabled: profile.soundEnabled,
      hapticEnabled: profile.hapticEnabled,
      isAdMobTestMode: profile.isAdMobTestMode ?? true,
      lastSavedTimestamp: Date.now(),
    };
    setProfile(resetProf);
    setActiveLevelId(1);
    saveProfile(resetProf);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Mobile Frame Container */}
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col overflow-hidden bg-slate-950">
        {currentScreen === 'PLAYING' && (
          <GameScreen
            key={`game-${activeLevelId}`}
            level={currentLevel}
            playerCoins={profile.coins}
            soundEnabled={profile.soundEnabled}
            hapticEnabled={profile.hapticEnabled}
            unlockedSlotsCount={profile.unlockedSlotsCount || 4}
            reviveTrigger={reviveSignal}
            onUnlockNextSlot={() => {
              const currentSlots = profile.unlockedSlotsCount || 4;
              if (currentSlots < 8) {
                requestRewardedAd({ type: 'slot', targetId: currentSlots + 1 });
              }
            }}
            onWatchAdToRevive={() => {
              requestRewardedAd({ type: 'revive' });
            }}
            isNextLevelUnlocked={isLevelUnlocked(profile, activeLevelId + 1)}
            onWatchAdToUnlockNext={(nextLvlId) => openBlockUnlock(nextLvlId, activeLevelId)}
            onLevelComplete={handleLevelComplete}
            onSpendCoins={handleSpendCoins}
            onAddCoins={handleAddCoins}
            onToggleSound={handleToggleSound}
            onToggleHaptic={handleToggleHaptic}
            onNextLevel={handleNextLevel}
            onHome={() => setCurrentScreen('HOME')}
            hasNextLevel={activeLevelId < allLevels.length}
          />
        )}

        {currentScreen !== 'PLAYING' && (
          <HomeScreen
            profile={profile}
            onPlay={(levelId) => handleStartLevel(levelId || 1)}
            onOpenLevels={() => setCurrentScreen('LEVELS')}
            onOpenRewards={() => setCurrentScreen('REWARDS')}
            onOpenSettings={() => setCurrentScreen('SETTINGS')}
          />
        )}

        {/* Overlays / Sub-Screens */}
        {currentScreen === 'LEVELS' && (
          <LevelsModal
            levels={allLevels}
            unlockedLevels={profile.unlockedLevels}
            levelStars={profile.levelStars}
            onSelectLevel={(id) => handleStartLevel(id)}
            onWatchAdToUnlock={(id) => openBlockUnlock(id)}
            onClose={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'REWARDS' && (
          <RewardsModal
            profile={profile}
            onClaimDaily={handleClaimDaily}
            onClaimAchievement={handleClaimAchievement}
            onWatchBonusAd={(step) => requestRewardedAd({ type: 'bonus', step })}
            onClose={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'SETTINGS' && (
          <SettingsModal
            soundEnabled={profile.soundEnabled}
            hapticEnabled={profile.hapticEnabled}
            isAdMobTestMode={profile.isAdMobTestMode ?? true}
            onToggleSound={handleToggleSound}
            onToggleHaptic={handleToggleHaptic}
            onToggleAdMobTestMode={handleToggleAdMobTestMode}
            onResetProgress={handleResetProgress}
            onClose={() => setCurrentScreen('HOME')}
          />
        )}

        {/* Block Unlock Modal (10 Niveaux par Pub Récompensée + Pub 2 Bonus Optionnel) */}
        {blockUnlockTarget !== null && (
          <BlockUnlockModal
            currentCompletedLevel={blockUnlockTarget.currentCompletedLevel}
            targetBlockStart={blockUnlockTarget.blockStart}
            targetBlockEnd={blockUnlockTarget.blockEnd}
            isBlockUnlocked={isBlockFullyUnlocked(profile, blockUnlockTarget.blockStart)}
            bonusRewardGranted={bonusRewardGranted}
            onWatchAdToUnlockBlock={() => {
              requestRewardedAd({ type: 'block', targetId: blockUnlockTarget.blockStart });
            }}
            onWatchOptionalBonusAd={() => {
              requestRewardedAd({ type: 'block_bonus', targetId: blockUnlockTarget.blockStart });
            }}
            onContinueToLevel={(levelId) => {
              const target = levelId || blockUnlockTarget.blockStart;
              setBlockUnlockTarget(null);
              setBonusRewardGranted(null);
              handleStartLevel(target);
            }}
            onClose={() => {
              setBlockUnlockTarget(null);
              setBonusRewardGranted(null);
              setCurrentScreen('HOME');
            }}
          />
        )}

        {/* Rewarded Ad Modal (AdMob) */}
        {adModalTarget !== null && (
          <RewardedAdModal
            type={adModalTarget.type}
            targetId={adModalTarget.targetId}
            bonusStep={adModalTarget.step}
            isTestMode={profile.isAdMobTestMode ?? true}
            onAdCompleted={(type, targetId) => {
              handleAdRewardGranted(type, targetId);
            }}
            onClose={() => {
              const justClosed = adModalTarget;
              setAdModalTarget(null);

              // If level was unlocked, play immediately
              if (
                justClosed &&
                justClosed.type === 'level' &&
                justClosed.targetId &&
                isLevelUnlocked(profile, justClosed.targetId)
              ) {
                setActiveLevelId(justClosed.targetId);
                setCurrentScreen('PLAYING');
              }
            }}
          />
        )}

        {/* Non-blocking Ad Notification Toast */}
        {adToastMessage && (
          <div className="absolute bottom-6 inset-x-6 z-50 p-3 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-amber-300 font-bold text-xs text-center shadow-2xl shadow-black/80 animate-fade-in pointer-events-none">
            {adToastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
