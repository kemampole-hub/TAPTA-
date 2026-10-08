import { ALL_SYMBOLS, LevelDefinition, TileSymbol, BoardTile, LevelZone, ArrangementInfo } from '../types/game';
import rawData from '../data/TAPTA_500_niveaux.json';
import {
  ARRANGEMENT_METADATA,
  getArrangementTypeForLevel,
  buildArrangementTiles,
  RawTile,
} from './arrangements';

// Helper to check if tile B on top overlaps tile A
export function isOverlapping(
  a: { x: number; y: number; layer: number },
  b: { x: number; y: number; layer: number }
): boolean {
  if (b.layer <= a.layer) return false;
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  // With horizontal step 1.05 and vertical row step 0.78:
  // Tiles overlap on borders if dx < 0.75 and dy < 0.88
  return dx < 0.75 && dy < 0.88;
}

// Check if a tile is currently blocked by any remaining tile on the board
export function computeIsBlocked(tile: BoardTile, allRemainingTiles: BoardTile[]): boolean {
  for (const other of allRemainingTiles) {
    if (other.id !== tile.id && isOverlapping(tile, other)) {
      return true;
    }
  }
  return false;
}

// Standard pyramid builder with row-by-row slight edge overlap (~22%)
function buildSteppedPyramid(rowCounts: number[], reverseLayers: boolean = false): RawTile[] {
  const tiles: RawTile[] = [];
  const maxRow = Math.max(...rowCounts);
  const rowCount = rowCounts.length;

  rowCounts.forEach((count, r) => {
    // Center each row horizontally
    const startX = ((maxRow - count) * 1.05) / 2;
    const y = Math.round(r * 0.78 * 100) / 100;
    const layer = reverseLayers ? rowCount - 1 - r : r;

    for (let c = 0; c < count; c++) {
      const x = Math.round((startX + c * 1.05) * 100) / 100;
      tiles.push({ x, y, layer });
    }
  });

  return tiles;
}

// Twin Pyramids (two side-by-side peaks merging into a shared base)
function buildTwinPyramid(peakHeight: number, baseRows: number[]): RawTile[] {
  const tiles: RawTile[] = [];
  let currentY = 0;
  let layer = 0;

  for (let r = 0; r < peakHeight; r++) {
    const countPerPeak = r + 1;
    const y = Math.round(currentY * 100) / 100;
    for (let c = 0; c < countPerPeak; c++) {
      const x = Math.round((c * 1.05 + (peakHeight - countPerPeak) * 0.525) * 100) / 100;
      tiles.push({ x, y, layer });
    }
    const rightOffset = peakHeight * 1.05 + 0.8;
    for (let c = 0; c < countPerPeak; c++) {
      const x = Math.round((rightOffset + c * 1.05 + (peakHeight - countPerPeak) * 0.525) * 100) / 100;
      tiles.push({ x, y, layer });
    }
    currentY += 0.78;
    layer++;
  }

  baseRows.forEach((count) => {
    const y = Math.round(currentY * 100) / 100;
    const totalW = peakHeight * 2 * 1.05 + 0.8;
    const startX = Math.max(0, (totalW - count * 1.05) / 2);
    for (let c = 0; c < count; c++) {
      const x = Math.round((startX + c * 1.05) * 100) / 100;
      tiles.push({ x, y, layer });
    }
    currentY += 0.78;
    layer++;
  });

  return tiles;
}

// 5 Difficulty Zones definition
export const LEVEL_ZONES: LevelZone[] = [
  {
    id: 1,
    name: 'FACILE',
    from: 1,
    to: 100,
    difficulty: 'Facile',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    badgeText: '1–100 : FACILE',
  },
  {
    id: 2,
    name: 'MOYEN',
    from: 101,
    to: 200,
    difficulty: 'Moyen',
    color: '#0EA5E9',
    badgeBg: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
    badgeText: '101–200 : MOYEN',
  },
  {
    id: 3,
    name: 'DIFFICILE',
    from: 201,
    to: 300,
    difficulty: 'Difficile',
    color: '#F59E0B',
    badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    badgeText: '201–300 : DIFFICILE',
  },
  {
    id: 4,
    name: 'TRÈS DIFFICILE',
    from: 301,
    to: 400,
    difficulty: 'Très difficile',
    color: '#F43F5E',
    badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    badgeText: '301–400 : TRÈS DIFFICILE',
  },
  {
    id: 5,
    name: 'EXPERT',
    from: 401,
    to: 500,
    difficulty: 'Expert',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    badgeText: '401–500 : EXPERT',
  },
];

export function getZoneForLevel(levelId: number): LevelZone {
  for (const zone of LEVEL_ZONES) {
    if (levelId >= zone.from && levelId <= zone.to) {
      return zone;
    }
  }
  return LEVEL_ZONES[LEVEL_ZONES.length - 1];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RÈGLE PROGRESSION DES TUILES : 10 tuiles (Niv 1) à 250 tuiles (Niv 500)
// Repères requis :
// - Niveau 1 : environ 10 tuiles
// - Niveau 10 : environ 20 tuiles
// - Niveau 20 : 30 tuiles
// - Niveau 50 : environ 50 tuiles
// - Niveau 100 : environ 80 tuiles
// - Niveau 200 : environ 120 tuiles
// - Niveau 300 : environ 160 tuiles
// - Niveau 400 : environ 200 tuiles
// - Niveau 500 : environ 250 tuiles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function computeTargetTileCount(levelId: number): number {
  const milestones: [number, number][] = [
    [1, 10],
    [10, 20],
    [20, 30],
    [50, 50],
    [100, 80],
    [200, 120],
    [300, 160],
    [400, 200],
    [500, 250],
  ];

  if (levelId <= 1) return 10;
  if (levelId >= 500) return 250;

  for (let i = 0; i < milestones.length - 1; i++) {
    const [lvlA, countA] = milestones[i];
    const [lvlB, countB] = milestones[i + 1];
    if (levelId >= lvlA && levelId <= lvlB) {
      const progress = (levelId - lvlA) / (lvlB - lvlA);
      const rawCount = countA + progress * (countB - countA);
      // Strictement pair pour garantir des paires exactes
      const evenCount = Math.round(rawCount / 2) * 2;
      return Math.max(10, Math.min(250, evenCount));
    }
  }

  return 10;
}

// Generate geometry using the 15 arrangements with level tier progression
function getTilesForJsonLevel(
  levelId: number,
  seqLength: number,
  uniqueSymbolsCount: number = 2
): { tiles: RawTile[]; patternName: string; arrangement: ArrangementInfo } {
  const arrangementType = getArrangementTypeForLevel(levelId);
  const arrangement = ARRANGEMENT_METADATA[arrangementType];

  let targetTiles = computeTargetTileCount(levelId);

  // Garantir que toutes les tuiles de séquence ont la place d'être associées par paires
  targetTiles = Math.max(targetTiles, uniqueSymbolsCount * 2);
  if (targetTiles % 2 !== 0) targetTiles++;

  const tiles = buildArrangementTiles(arrangementType, targetTiles, levelId);
  const patternName = `${arrangement.icon} ${arrangement.name}`;

  return { tiles, patternName, arrangement };
}

// Extensible Architecture: 500 initial levels from JSON + custom extension support
const customAddedLevels: LevelDefinition[] = [];

// Cache generated 500 levels
let cachedLevels: LevelDefinition[] | null = null;

function buildAll500Levels(): LevelDefinition[] {
  if (cachedLevels) return cachedLevels;

  const list: LevelDefinition[] = [];
  const rawList = rawData.levels;

  for (const raw of rawList) {
    const uniqueSymbolsCount = new Set(raw.sequence).size;
    const { tiles, patternName, arrangement } = getTilesForJsonLevel(
      raw.id,
      raw.sequence_length,
      uniqueSymbolsCount
    );

    list.push({
      id: raw.id,
      name: raw.name,
      title: raw.name,
      difficulty: raw.difficulty,
      status: raw.status,
      sequence: raw.sequence as TileSymbol[],
      sequence_length: raw.sequence_length,
      time_limit_seconds: raw.time_limit_seconds,
      reward_coins: raw.reward_coins,
      reward_stars: raw.reward_stars,
      unlock_rule: raw.unlock_rule,
      ad_unlock_allowed: raw.ad_unlock_allowed,
      hint_allowed: raw.hint_allowed,
      perfect_bonus: raw.perfect_bonus,
      patternName,
      arrangement,
      tiles,
      distinctSymbols: Math.max(2, uniqueSymbolsCount),
    });
  }

  cachedLevels = list;
  return list;
}

// Get all 500 levels (plus any custom extensions registered later)
export function getAllLevels(): LevelDefinition[] {
  const base500 = buildAll500Levels();
  if (customAddedLevels.length === 0) return base500;
  return [...base500, ...customAddedLevels];
}

// Extensible registration method for adding future level packs beyond 500
export function registerCustomLevels(newLevels: LevelDefinition[]): void {
  for (const lvl of newLevels) {
    if (!customAddedLevels.some((existing) => existing.id === lvl.id)) {
      customAddedLevels.push(lvl);
    }
  }
}

// Get single level by id
export function getLevel(id: number): LevelDefinition {
  const all = getAllLevels();
  return all.find((l) => l.id === id) || all[0];
}

// Solvable board tiles generator for a given level
export function createBoardForLevel(level: LevelDefinition): BoardTile[] {
  // Ensure even number of tiles for pair matching (2 identical tiles)
  const usableTiles = level.tiles.length % 2 === 0
    ? level.tiles
    : level.tiles.slice(0, level.tiles.length - 1);
  const totalTiles = usableTiles.length;
  const pairCount = Math.floor(totalTiles / 2);

  // Distinct symbols guaranteed to include the level sequence symbols first
  const sequenceSymbols = Array.from(new Set(level.sequence)) as TileSymbol[];
  const remainingPool = ALL_SYMBOLS.filter((s) => !sequenceSymbols.includes(s));

  // Deterministic shuffle of remaining pool based on level.id
  const shuffledExtra = [...remainingPool].sort((a, b) => {
    const hashA = (a.charCodeAt(0) * 17 + level.id * 31) % 100;
    const hashB = (b.charCodeAt(0) * 17 + level.id * 31) % 100;
    return hashA - hashB;
  });

  const fullSymbolsList = [...sequenceSymbols, ...shuffledExtra];
  const chosenSymbols: TileSymbol[] = [];

  // 1. First ensure every unique symbol in sequence has at least one pair (2 tiles)
  for (const sym of sequenceSymbols) {
    if (chosenSymbols.length + 2 <= totalTiles) {
      chosenSymbols.push(sym, sym);
    }
  }

  // 2. Fill remaining tiles with pairs from fullSymbolsList
  let extraIdx = 0;
  while (chosenSymbols.length < totalTiles) {
    const sym = fullSymbolsList[extraIdx % fullSymbolsList.length];
    chosenSymbols.push(sym, sym);
    extraIdx++;
  }

  // Shuffle symbols with pseudo-random seed to distribute nicely across pyramid tiers
  const seed = level.id * 7919;
  for (let i = chosenSymbols.length - 1; i > 0; i--) {
    const j = (seed + i * 13) % (i + 1);
    const temp = chosenSymbols[i];
    chosenSymbols[i] = chosenSymbols[j];
    chosenSymbols[j] = temp;
  }

  // Create initial BoardTile objects
  const boardTiles: BoardTile[] = usableTiles.map((pos, index) => ({
    id: `tile-${level.id}-${index}-${Date.now()}-${Math.random()}`,
    symbol: chosenSymbols[index],
    x: pos.x,
    y: pos.y,
    layer: pos.layer,
    isBlocked: false,
  }));

  // Compute initial blocked states
  return boardTiles.map((tile) => ({
    ...tile,
    isBlocked: computeIsBlocked(tile, boardTiles),
  }));
}
