import { PlayerProfile, Achievement } from '../types/game';

const STORAGE_KEY = 'tapta_game_profile_v1';
const STORAGE_BACKUP_KEY = 'tapta_game_profile_backup_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  coins: 150,
  gems: 25, // 💎 Diamants
  gifts: 1, // 🎁 Cadeaux
  unlockedLevel: 1,
  currentLevelId: 1,
  lastReachedLevel: 1,
  hasSavedGame: false,
  completedLevels: [],
  unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Règle : Blocs de 10. Niveaux 1 à 10 gratuits d'emblée.
  unlockedSlotsCount: 4, // Exactly 4 free slots at start (can be unlocked up to 8 max via ads)
  levelStars: {},
  highScore: 0,
  soundEnabled: true,
  hapticEnabled: true,
  consecutiveDays: 1,
  completedAchievements: [],
  dailyAdsWatchedCount: 0,
  isAdMobTestMode: true,
  lastSavedTimestamp: Date.now(),
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'Premier Pas',
    description: 'Terminer le Niveau 1',
    rewardCoins: 50,
    isUnlocked: (p) => (p.levelStars[1] || 0) > 0,
  },
  {
    id: 'reach_5',
    title: 'Apprenti TAPTA',
    description: 'Débloquer le Niveau 5',
    rewardCoins: 100,
    isUnlocked: (p) => p.unlockedLevels.includes(5),
  },
  {
    id: 'reach_25',
    title: 'Aventurier des Symboles',
    description: 'Débloquer le Niveau 25',
    rewardCoins: 150,
    isUnlocked: (p) => p.unlockedLevels.includes(25),
  },
  {
    id: 'complete_zone_1',
    title: 'Champion Zone Facile',
    description: 'Terminer le Niveau 100 (Zone Facile)',
    rewardCoins: 300,
    isUnlocked: (p) => (p.levelStars[100] || 0) > 0,
  },
  {
    id: 'complete_zone_2',
    title: 'Expert Zone Moyen',
    description: 'Terminer le Niveau 200 (Zone Moyen)',
    rewardCoins: 500,
    isUnlocked: (p) => (p.levelStars[200] || 0) > 0,
  },
  {
    id: 'complete_zone_3',
    title: 'Conquérant Zone Difficile',
    description: 'Terminer le Niveau 300 (Zone Difficile)',
    rewardCoins: 750,
    isUnlocked: (p) => (p.levelStars[300] || 0) > 0,
  },
  {
    id: 'complete_zone_4',
    title: 'Grand Maître Très Difficile',
    description: 'Terminer le Niveau 400 (Zone Très Difficile)',
    rewardCoins: 1000,
    isUnlocked: (p) => (p.levelStars[400] || 0) > 0,
  },
  {
    id: 'complete_500',
    title: 'Légende Suprême TAPTA',
    description: 'Terminer le Niveau 500 (Zone Expert)',
    rewardCoins: 2000,
    isUnlocked: (p) => (p.levelStars[500] || 0) > 0,
  },
  {
    id: 'stars_100',
    title: 'Constellation d’Or',
    description: 'Obtenir au moins 100 Étoiles',
    rewardCoins: 250,
    isUnlocked: (p) => Object.values(p.levelStars).reduce((a, b) => a + b, 0) >= 100,
  },
  {
    id: 'coin_hoarder',
    title: 'Trésorier',
    description: 'Posséder plus de 500 pièces',
    rewardCoins: 200,
    isUnlocked: (p) => p.coins >= 500,
  },
];

export function isLevelUnlocked(profile: PlayerProfile, levelId: number): boolean {
  // Niveaux 1 à 10 100% gratuits et débloqués d'emblée
  if (levelId >= 1 && levelId <= 10) return true;
  if (profile.unlockedLevel && levelId <= profile.unlockedLevel) return true;
  return profile.unlockedLevels ? profile.unlockedLevels.includes(levelId) : false;
}

export function getBlockInfo(levelId: number): {
  blockNumber: number;
  start: number;
  end: number;
  nextBlockStart: number;
  nextBlockEnd: number;
  isBlockEnd: boolean;
} {
  const clamped = Math.max(1, Math.min(500, levelId));
  const blockNumber = Math.ceil(clamped / 10);
  const start = (blockNumber - 1) * 10 + 1;
  const end = Math.min(500, blockNumber * 10);
  const nextBlockStart = Math.min(500, end + 1);
  const nextBlockEnd = Math.min(500, nextBlockStart + 9);
  const isBlockEnd = clamped % 10 === 0;

  return {
    blockNumber,
    start,
    end,
    nextBlockStart,
    nextBlockEnd,
    isBlockEnd,
  };
}

export function isBlockFullyUnlocked(profile: PlayerProfile, blockStart: number): boolean {
  if (blockStart <= 10) return true;
  const blockEnd = Math.min(500, blockStart + 9);
  for (let i = blockStart; i <= blockEnd; i++) {
    if (!isLevelUnlocked(profile, i)) return false;
  }
  return true;
}

export function hasPlayerSave(profile: PlayerProfile): boolean {
  if (profile.hasSavedGame) return true;
  if (profile.completedLevels && profile.completedLevels.length > 0) return true;
  if (Object.keys(profile.levelStars || {}).length > 0) return true;
  if ((profile.unlockedLevel || 1) > 1) return true;
  if ((profile.currentLevelId || 1) > 1) return true;
  if ((profile.lastReachedLevel || 1) > 1) return true;
  if ((profile.unlockedSlotsCount || 4) > 4) return true;
  return false;
}

export function getResumeLevel(profile: PlayerProfile): number {
  const candidate = profile.currentLevelId || profile.lastReachedLevel || profile.unlockedLevel || 1;
  return Math.max(1, Math.min(500, candidate));
}

export function loadProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Fallback à la sauvegarde redondante
      raw = localStorage.getItem(STORAGE_BACKUP_KEY);
    }
    if (!raw) return DEFAULT_PROFILE;

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const backupRaw = localStorage.getItem(STORAGE_BACKUP_KEY);
      if (backupRaw) {
        parsed = JSON.parse(backupRaw);
      } else {
        return DEFAULT_PROFILE;
      }
    }

    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROFILE;

    const existingUnlocked: number[] = Array.isArray(parsed.unlockedLevels)
      ? parsed.unlockedLevels
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const initialBlock = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const mergedUnlocked = Array.from(new Set([...initialBlock, ...existingUnlocked]))
      .filter((n) => typeof n === 'number' && n >= 1 && n <= 500)
      .sort((a, b) => a - b);
    const highestUnlocked = Math.max(1, ...mergedUnlocked);

    const slots = Math.max(4, Math.min(8, Number(parsed.unlockedSlotsCount) || 4));
    const today = new Date().toISOString().slice(0, 10);
    const isSameDay = parsed.lastAdsWatchedDate === today;

    // Sanitisation des étoiles
    const levelStars: Record<number, number> = {};
    if (parsed.levelStars && typeof parsed.levelStars === 'object') {
      for (const [k, v] of Object.entries(parsed.levelStars)) {
        const lvlId = Number(k);
        const stars = Number(v);
        if (lvlId >= 1 && lvlId <= 500 && stars >= 1 && stars <= 3) {
          levelStars[lvlId] = stars;
        }
      }
    }

    const completedFromStars = Object.keys(levelStars).map(Number);
    const completedArr = Array.isArray(parsed.completedLevels)
      ? Array.from(new Set([...parsed.completedLevels, ...completedFromStars]))
      : completedFromStars;
    completedArr.sort((a, b) => a - b);

    const unlockedLvl = Math.max(1, Math.min(500, Number(parsed.unlockedLevel) || highestUnlocked));
    const currentLvl = Math.max(1, Math.min(500, Number(parsed.currentLevelId) || unlockedLvl));
    const lastReached = Math.max(1, Math.min(500, Number(parsed.lastReachedLevel) || Math.max(unlockedLvl, currentLvl)));

    const hasSave = Boolean(
      parsed.hasSavedGame ||
      completedArr.length > 0 ||
      Object.keys(levelStars).length > 0 ||
      unlockedLvl > 1 ||
      currentLvl > 1 ||
      slots > 4
    );

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      coins: typeof parsed.coins === 'number' && !isNaN(parsed.coins) ? Math.max(0, parsed.coins) : 150,
      gems: typeof parsed.gems === 'number' && !isNaN(parsed.gems) ? Math.max(0, parsed.gems) : 25,
      gifts: typeof parsed.gifts === 'number' && !isNaN(parsed.gifts) ? Math.max(0, parsed.gifts) : 1,
      unlockedLevel: unlockedLvl,
      currentLevelId: currentLvl,
      lastReachedLevel: lastReached,
      hasSavedGame: hasSave,
      completedLevels: completedArr,
      unlockedLevels: mergedUnlocked,
      unlockedSlotsCount: slots,
      levelStars,
      highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      hapticEnabled: typeof parsed.hapticEnabled === 'boolean' ? parsed.hapticEnabled : true,
      dailyAdsWatchedCount: isSameDay ? (parsed.dailyAdsWatchedCount || 0) : 0,
      lastAdsWatchedDate: parsed.lastAdsWatchedDate || today,
      isAdMobTestMode: typeof parsed.isAdMobTestMode === 'boolean' ? parsed.isAdMobTestMode : true,
      completedAchievements: Array.isArray(parsed.completedAchievements) ? parsed.completedAchievements : [],
      lastSavedTimestamp: parsed.lastSavedTimestamp || Date.now(),
    };
  } catch (err) {
    console.error('Erreur lors du chargement de la sauvegarde:', err);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...profile,
      lastSavedTimestamp: Date.now(),
    };
    const serialized = JSON.stringify(payload);
    // Sauvegarde primaire
    localStorage.setItem(STORAGE_KEY, serialized);
    // Sauvegarde miroir / redondante
    localStorage.setItem(STORAGE_BACKUP_KEY, serialized);
  } catch (err) {
    console.warn('Erreur lors de la sauvegarde du profil:', err);
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_BACKUP_KEY);
  } catch {}
}

export function canClaimDailyReward(profile: PlayerProfile): boolean {
  if (!profile.lastDailyRewardDate) return true;
  const today = new Date().toISOString().slice(0, 10);
  return profile.lastDailyRewardDate !== today;
}
