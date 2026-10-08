export type TileSymbol =
  | '#' | '€' | '¥' | '$' | '¢' | '§' | '∆'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T';

export const ALL_SYMBOLS: TileSymbol[] = [
  // 7 Symbols
  '#', '€', '¥', '$', '¢', '§', '∆',
  // 20 Letters
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
];

export interface SymbolStyle {
  color: string;
  bgTint: string;
  borderTint: string;
}

export const SYMBOL_STYLES: Record<TileSymbol, SymbolStyle> = {
  // Symbols
  '#': { color: '#D97706', bgTint: '#FEF3C7', borderTint: '#FDE68A' }, // Amber
  '€': { color: '#2563EB', bgTint: '#DBEAFE', borderTint: '#BFDBFE' }, // Royal Blue
  '¥': { color: '#DC2626', bgTint: '#FEE2E2', borderTint: '#FECACA' }, // Crimson
  '$': { color: '#059669', bgTint: '#D1FAE5', borderTint: '#A7F3D0' }, // Emerald
  '¢': { color: '#B45309', bgTint: '#FFEDD5', borderTint: '#FED7AA' }, // Bronze
  '§': { color: '#7C3AED', bgTint: '#EDE9FE', borderTint: '#DDD6FE' }, // Violet
  '∆': { color: '#EA580C', bgTint: '#FFEDD5', borderTint: '#FDBA74' }, // Orange

  // Letters
  'A': { color: '#E11D48', bgTint: '#FFE4E6', borderTint: '#FECDD3' }, // Rose
  'B': { color: '#0284C7', bgTint: '#E0F2FE', borderTint: '#BAE6FD' }, // Sky
  'C': { color: '#16A34A', bgTint: '#DCFCE7', borderTint: '#BBF7D0' }, // Green
  'D': { color: '#9333EA', bgTint: '#F3E8FF', borderTint: '#E9D5FF' }, // Purple
  'E': { color: '#CA8A04', bgTint: '#FEF9C3', borderTint: '#FEF08A' }, // Yellow-Gold
  'F': { color: '#0D9488', bgTint: '#CCFBF1', borderTint: '#99F6E4' }, // Teal
  'G': { color: '#4F46E5', bgTint: '#E0E7FF', borderTint: '#C7D2FE' }, // Indigo
  'H': { color: '#C026D3', bgTint: '#FAE8FF', borderTint: '#F5D0FE' }, // Fuchsia
  'I': { color: '#0891B2', bgTint: '#CFFAFE', borderTint: '#A5F3FC' }, // Cyan
  'J': { color: '#65A30D', bgTint: '#ECFCCB', borderTint: '#D9F99D' }, // Lime
  'K': { color: '#D97706', bgTint: '#FEF3C7', borderTint: '#FDE68A' },
  'L': { color: '#475569', bgTint: '#F1F5F9', borderTint: '#E2E8F0' }, // Slate
  'M': { color: '#BE185D', bgTint: '#FCE7F3', borderTint: '#FBCFE8' }, // Pink
  'N': { color: '#1D4ED8', bgTint: '#DBEAFE', borderTint: '#BFDBFE' },
  'O': { color: '#047857', bgTint: '#D1FAE5', borderTint: '#A7F3D0' },
  'P': { color: '#7E22CE', bgTint: '#F3E8FF', borderTint: '#E9D5FF' },
  'Q': { color: '#C2410C', bgTint: '#FFEDD5', borderTint: '#FED7AA' },
  'R': { color: '#0369A1', bgTint: '#E0F2FE', borderTint: '#BAE6FD' },
  'S': { color: '#B91C1C', bgTint: '#FEE2E2', borderTint: '#FECACA' },
  'T': { color: '#0F766E', bgTint: '#CCFBF1', borderTint: '#99F6E4' },
};

export interface BoardTile {
  id: string;
  symbol: TileSymbol;
  // Position in fractional grid units (each tile width=1, height=1)
  x: number;
  y: number;
  layer: number;
  isBlocked: boolean;
  isHinted?: boolean;
}

export interface DockTile {
  id: string;
  symbol: TileSymbol;
  isMatching?: boolean;
  isPairReunited?: boolean;
  isShattering?: boolean;
}

export type ArrangementType =
  | 'pyramid'
  | 'stairs'
  | 'wall'
  | 'cross'
  | 'diamond'
  | 'hexagon'
  | 'circle'
  | 'spiral'
  | 'two_sides'
  | 'towers'
  | 'bridge'
  | 'inverted_pyramid'
  | 'lightning'
  | 'rings'
  | 'irregular';

export interface ArrangementInfo {
  type: ArrangementType;
  name: string;
  icon: string;
  description: string;
}

export interface LevelDefinition {
  id: number;
  name: string;
  title?: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile' | 'Très difficile' | 'Expert' | string;
  status: string;
  sequence: TileSymbol[];
  sequence_length: number;
  time_limit_seconds: number;
  reward_coins: number;
  reward_stars: number;
  unlock_rule: string;
  ad_unlock_allowed: boolean;
  hint_allowed: boolean;
  perfect_bonus: number;
  patternName: string;
  arrangement?: ArrangementInfo;
  tiles: { x: number; y: number; layer: number }[];
  distinctSymbols: number;
}

export interface LevelZone {
  id: number;
  name: string;
  from: number;
  to: number;
  difficulty: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface MoveRecord {
  tile: BoardTile;
  dockIndex: number;
}

export interface PlayerProfile {
  coins: number;
  gems: number; // 💎 Diamants
  gifts: number; // 🎁 Cadeaux / Coffres
  unlockedLevel: number; // Niveau le plus haut débloqué
  currentLevelId?: number; // Niveau actuellement en cours (ex: 37)
  lastReachedLevel?: number; // Dernier niveau atteint
  hasSavedGame?: boolean; // Indique si une partie est activement sauvegardée
  completedLevels?: number[]; // Niveaux validés avec succès
  unlockedLevels: number[]; // Set of all unlocked level numbers (starts with [1, 2, 3, 4])
  unlockedSlotsCount: number; // Slots in selection dock: starts at 4, up to 8 max via rewarded ads
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  highScore: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  lastDailyRewardDate?: string;
  consecutiveDays: number;
  completedAchievements: string[];
  dailyAdsWatchedCount?: number; // 0 to 3 ("Publicité 1/3", "Publicité 2/3", "Publicité 3/3")
  lastAdsWatchedDate?: string;
  isAdMobTestMode?: boolean; // Toggle between test ads and production ca-app-pub IDs
  lastSavedTimestamp?: number; // Horodatage précis de la sauvegarde
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  isUnlocked: (profile: PlayerProfile) => boolean;
}
