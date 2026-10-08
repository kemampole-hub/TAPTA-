export type { ArrangementInfo, ArrangementType } from '../types/game';
import { ArrangementInfo, ArrangementType } from '../types/game';

export interface RawTile {
  x: number;
  y: number;
  layer: number;
}

export const ARRANGEMENT_METADATA: Record<ArrangementType, ArrangementInfo> = {
  pyramid: {
    type: 'pyramid',
    name: 'Pyramide',
    icon: '🔺',
    description: 'Base large et sommet effilé en gradins',
  },
  stairs: {
    type: 'stairs',
    name: 'Étages',
    icon: '🪜',
    description: 'Paliers horizontaux étagés comme des marches',
  },
  wall: {
    type: 'wall',
    name: 'Mur',
    icon: '🧱',
    description: 'Grand bloc compact en appareillage de briques',
  },
  cross: {
    type: 'cross',
    name: 'Croix',
    icon: '✚',
    description: 'Grande croix symétrique au centre du plateau',
  },
  diamond: {
    type: 'diamond',
    name: 'Diamant',
    icon: '💠',
    description: 'Silhouette en losange avec centre élargi',
  },
  hexagon: {
    type: 'hexagon',
    name: 'Hexagone',
    icon: '⬡',
    description: 'Structure hexagonale aux arêtes obliques',
  },
  circle: {
    type: 'circle',
    name: 'Cercle',
    icon: '⭕',
    description: 'Anneau circulaire entourant un espace central',
  },
  spiral: {
    type: 'spiral',
    name: 'Spirale',
    icon: '🌀',
    description: 'Chemin en spirale s’enroulant vers le cœur',
  },
  two_sides: {
    type: 'two_sides',
    name: 'Deux Côtés',
    icon: '↔️',
    description: 'Deux ailes latérales séparées par un vide central',
  },
  towers: {
    type: 'towers',
    name: 'Tours',
    icon: '🏰',
    description: 'Colonnes verticales surmontées de créneaux',
  },
  bridge: {
    type: 'bridge',
    name: 'Pont',
    icon: '🌉',
    description: 'Deux piliers verticaux enjambés par un tablier',
  },
  inverted_pyramid: {
    type: 'inverted_pyramid',
    name: 'Pyramide Inversée',
    icon: '🔻',
    description: 'Sommet large s’affinant en pointe vers le bas',
  },
  lightning: {
    type: 'lightning',
    name: 'Éclair',
    icon: '⚡',
    description: 'Forme dynamique en zigzag vif et électrique',
  },
  rings: {
    type: 'rings',
    name: 'Centre avec Anneaux',
    icon: '🎯',
    description: 'Anneaux concentriques enveloppant le centre',
  },
  irregular: {
    type: 'irregular',
    name: 'Forme Irrégulière',
    icon: '🧩',
    description: 'Disposition asymétrique, organique et imprévisible',
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 🔺 PYRAMIDE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generatePyramid(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const maxLayers = targetTiles <= 20 ? 2 : targetTiles <= 60 ? 3 : targetTiles <= 120 ? 4 : 5;
  const tiers = [
    [2, 4, 6, 6, 8, 8],      // Base layer 0
    [2, 4, 4, 6, 6],         // Layer 1
    [2, 4, 4, 4],            // Layer 2
    [2, 4, 4],               // Layer 3
    [2, 2],                  // Layer 4
  ];

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const rowCounts = tiers[l % tiers.length];
    const maxRow = Math.max(...rowCounts);
    const layerOffset = l * 0.15;
    for (let r = 0; r < rowCounts.length; r++) {
      const count = rowCounts[r];
      const startX = ((maxRow - count) * 1.05) / 2 + layerOffset - (maxRow * 1.05) / 4;
      const y = Math.round((r * 0.78 + layerOffset - (rowCounts.length * 0.78) / 2) * 100) / 100;
      for (let c = 0; c < count; c++) {
        tiles.push({
          x: Math.round((startX + c * 1.05) * 100) / 100,
          y,
          layer: l,
        });
      }
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 🪜 ÉTAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateStairs(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const steps = 4;
  const maxLayers = targetTiles <= 20 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 120 ? 3 : 4;
  const tilesPerStep = Math.min(3, Math.max(2, Math.floor(targetTiles / (steps * maxLayers * 2)) * 2));

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    for (let s = 0; s < steps; s++) {
      const startX = -1.2 + s * 0.4 + l * 0.15;
      const y = Math.round((-1.5 + s * 0.95 + l * 0.15) * 100) / 100;
      for (let c = 0; c < tilesPerStep; c++) {
        tiles.push({
          x: Math.round((startX + c * 1.05) * 100) / 100,
          y,
          layer: l + (s % 2),
        });
      }
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 🧱 MUR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateWall(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const cols = 5;
  const rows = 4;
  const maxLayers = targetTiles <= 25 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 130 ? 3 : 4;

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const lCols = Math.max(3, cols - l);
    const lRows = Math.max(3, rows - l);
    const startX = -((lCols - 1) * 1.05) / 2;
    const startY = -((lRows - 1) * 0.82) / 2;
    for (let r = 0; r < lRows; r++) {
      const brickOffset = r % 2 === 1 ? 0.525 : 0;
      const y = Math.round((startY + r * 0.82) * 100) / 100;
      for (let c = 0; c < lCols; c++) {
        tiles.push({
          x: Math.round((startX + brickOffset + c * 1.05) * 100) / 100,
          y,
          layer: l,
        });
      }
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. ✚ CROIX
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateCross(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const maxLayers = targetTiles <= 20 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 120 ? 3 : 4;

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const armLen = 2; // Fixed compact span: armLen 2 gives spanX = 4.2
    const offset = l * 0.12;
    // Vertical beam
    for (let r = -armLen; r <= armLen; r++) {
      const y = Math.round((r * 0.85 + offset) * 100) / 100;
      tiles.push({ x: Math.round((-0.525 + offset) * 100) / 100, y, layer: l });
      tiles.push({ x: Math.round((0.525 + offset) * 100) / 100, y, layer: l });
    }
    // Horizontal arms
    for (let c = -armLen; c <= armLen; c++) {
      if (Math.abs(c) > 0) {
        const x = Math.round((c * 1.05 + offset) * 100) / 100;
        tiles.push({ x, y: Math.round((-0.42 + offset) * 100) / 100, layer: l });
        tiles.push({ x, y: Math.round((0.42 + offset) * 100) / 100, layer: l });
      }
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. 💠 DIAMANT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateDiamond(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const tiers = [
    [2, 4, 6, 6, 4, 2],       // Layer 0
    [2, 4, 4, 2],             // Layer 1
    [2, 4, 2],                // Layer 2
    [2, 2],                   // Layer 3
  ];

  for (let l = 0; l < tiers.length && tiles.length < targetTiles; l++) {
    const rowCounts = tiers[l];
    const maxRow = Math.max(...rowCounts);
    const layerOffset = l * 0.12;
    for (let r = 0; r < rowCounts.length; r++) {
      const count = rowCounts[r];
      const startX = ((maxRow - count) * 1.05) / 2 + layerOffset - (maxRow * 1.05) / 4;
      const y = Math.round((r * 0.85 + layerOffset - (rowCounts.length * 0.85) / 2) * 100) / 100;
      for (let c = 0; c < count; c++) {
        tiles.push({
          x: Math.round((startX + c * 1.05) * 100) / 100,
          y,
          layer: l,
        });
      }
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. ⬡ HEXAGONE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateHexagon(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const tiers = [
    [3, 5, 6, 6, 5, 3],       // Layer 0
    [2, 4, 4, 2],             // Layer 1
    [2, 3, 2],                // Layer 2
    [2, 2],                   // Layer 3
  ];

  for (let l = 0; l < tiers.length && tiles.length < targetTiles; l++) {
    const rowCounts = tiers[l];
    const maxRow = Math.max(...rowCounts);
    const layerOffset = l * 0.14;
    for (let r = 0; r < rowCounts.length; r++) {
      const count = rowCounts[r];
      const startX = ((maxRow - count) * 1.05) / 2 + layerOffset - (maxRow * 1.05) / 4;
      const y = Math.round((r * 0.82 + layerOffset - (rowCounts.length * 0.82) / 2) * 100) / 100;
      for (let c = 0; c < count; c++) {
        tiles.push({
          x: Math.round((startX + c * 1.05) * 100) / 100,
          y,
          layer: l,
        });
      }
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. ⭕ CERCLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateCircle(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const rings = [
    { radiusX: 2.3, radiusY: 1.9, layer: 0, countRatio: 0.40 },
    { radiusX: 1.7, radiusY: 1.4, layer: 1, countRatio: 0.30 },
    { radiusX: 1.1, radiusY: 0.9, layer: 2, countRatio: 0.20 },
    { radiusX: 0.5, radiusY: 0.4, layer: 3, countRatio: 0.10 },
  ];

  for (const ring of rings) {
    if (tiles.length >= targetTiles) break;
    const ringTiles = Math.max(4, Math.floor((targetTiles * ring.countRatio) / 2) * 2);
    for (let i = 0; i < ringTiles; i++) {
      const angle = (2 * Math.PI * i) / ringTiles;
      tiles.push({
        x: Math.round(ring.radiusX * Math.cos(angle) * 100) / 100,
        y: Math.round(ring.radiusY * Math.sin(angle) * 100) / 100,
        layer: ring.layer,
      });
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. 🌀 SPIRALE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateSpiral(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const count = Math.max(6, Math.floor(targetTiles / 2) * 2);
  const maxRadius = 2.4;
  const turns = 2.4;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1 || 1);
    const angle = t * turns * 2 * Math.PI;
    const r = maxRadius * (1 - 0.70 * t);
    const layer = Math.min(4, Math.floor(t * 5));
    tiles.push({
      x: Math.round(r * Math.cos(angle) * 100) / 100,
      y: Math.round(r * 0.85 * Math.sin(angle) * 100) / 100,
      layer,
    });
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. ↔️ DEUX CÔTÉS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateTwoSides(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const maxLayers = targetTiles <= 20 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 120 ? 3 : 4;
  const rows = 4;

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const offset = l * 0.12;
    for (let r = 0; r < rows; r++) {
      const y = Math.round((-1.5 + r * 0.88 + offset) * 100) / 100;
      // Left Wing
      tiles.push({ x: Math.round((-2.2 + offset) * 100) / 100, y, layer: l });
      tiles.push({ x: Math.round((-1.15 + offset) * 100) / 100, y, layer: l });
      // Right Wing
      tiles.push({ x: Math.round((1.15 + offset) * 100) / 100, y, layer: l });
      tiles.push({ x: Math.round((2.2 + offset) * 100) / 100, y, layer: l });
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. 🏰 TOUR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateTowers(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const towerPositions = [-1.8, 0, 1.8];
  const maxLayers = targetTiles <= 24 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 120 ? 3 : 4;
  const height = 4;

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const offset = l * 0.12;
    towerPositions.forEach((posX) => {
      for (let r = 0; r < height; r++) {
        const y = Math.round((-1.5 + r * 0.85 + offset) * 100) / 100;
        tiles.push({
          x: Math.round((posX - 0.45 + offset) * 100) / 100,
          y,
          layer: l,
        });
        tiles.push({
          x: Math.round((posX + 0.45 + offset) * 100) / 100,
          y,
          layer: l,
        });
      }
    });
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. 🌉 PONT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateBridge(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const maxLayers = targetTiles <= 20 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 120 ? 3 : 4;

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const offset = l * 0.12;
    // Left & Right Pillars
    for (let r = 0; r < 3; r++) {
      const y = Math.round((-0.8 + r * 0.88 + offset) * 100) / 100;
      tiles.push({ x: Math.round((-1.8 + offset) * 100) / 100, y, layer: l });
      tiles.push({ x: Math.round((-0.9 + offset) * 100) / 100, y, layer: l });
      tiles.push({ x: Math.round((0.9 + offset) * 100) / 100, y, layer: l });
      tiles.push({ x: Math.round((1.8 + offset) * 100) / 100, y, layer: l });
    }

    // Horizontal bridge deck across the top
    for (let c = -2; c <= 2; c++) {
      tiles.push({
        x: Math.round((c * 1.05 + offset) * 100) / 100,
        y: Math.round((-1.6 + offset) * 100) / 100,
        layer: l + 1,
      });
      tiles.push({
        x: Math.round((c * 1.05 + offset) * 100) / 100,
        y: Math.round((-1.6 + offset + 0.4) * 100) / 100,
        layer: l + 1,
      });
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. 🔻 PYRAMIDE INVERSÉE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateInvertedPyramid(targetTiles: number): RawTile[] {
  const normal = generatePyramid(targetTiles);
  const maxY = Math.max(...normal.map((t) => t.y));
  return normal.map((t) => ({
    x: t.x,
    y: Math.round((maxY - t.y) * 100) / 100,
    layer: t.layer,
  }));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. ⚡ ÉCLAIR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateLightning(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const maxLayers = targetTiles <= 20 ? 1 : targetTiles <= 60 ? 2 : targetTiles <= 120 ? 3 : 4;

  for (let l = 0; l < maxLayers && tiles.length < targetTiles; l++) {
    const offset = l * 0.12;
    // Strike 1 (down-left)
    for (let i = 0; i < 3; i++) {
      const x = Math.round((1.2 - i * 0.70 + offset) * 100) / 100;
      const y = Math.round((-1.8 + i * 0.75 + offset) * 100) / 100;
      tiles.push({ x: x - 0.25, y, layer: l });
      tiles.push({ x: x + 0.25, y, layer: l });
    }
    // Strike 2 (across)
    for (let i = 0; i < 3; i++) {
      const x = Math.round((-0.6 + i * 0.75 + offset) * 100) / 100;
      const y = Math.round((-0.2 + offset) * 100) / 100;
      tiles.push({ x, y: y - 0.2, layer: l + 1 });
      tiles.push({ x, y: y + 0.2, layer: l + 1 });
    }
    // Strike 3 (down-left fork)
    for (let i = 0; i < 3; i++) {
      const x = Math.round((0.8 - i * 0.75 + offset) * 100) / 100;
      const y = Math.round((0.6 + i * 0.75 + offset) * 100) / 100;
      tiles.push({ x: x - 0.25, y, layer: l });
      tiles.push({ x: x + 0.25, y, layer: l });
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14. 🎯 CENTRE AVEC ANNEAUX
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateConcentricRings(targetTiles: number): RawTile[] {
  const tiles: RawTile[] = [];
  const rings = [
    { radiusX: 2.3, radiusY: 1.9, layer: 0, countRatio: 0.40 },
    { radiusX: 1.6, radiusY: 1.3, layer: 1, countRatio: 0.30 },
    { radiusX: 0.9, radiusY: 0.7, layer: 2, countRatio: 0.20 },
  ];

  // Core center pair
  tiles.push({ x: -0.45, y: 0, layer: 3 });
  tiles.push({ x: 0.45, y: 0, layer: 3 });

  for (const ring of rings) {
    if (tiles.length >= targetTiles) break;
    const ringTiles = Math.max(4, Math.floor((targetTiles * ring.countRatio) / 2) * 2);
    for (let i = 0; i < ringTiles; i++) {
      const angle = (2 * Math.PI * i) / ringTiles;
      tiles.push({
        x: Math.round(ring.radiusX * Math.cos(angle) * 100) / 100,
        y: Math.round(ring.radiusY * Math.sin(angle) * 100) / 100,
        layer: ring.layer,
      });
    }
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15. 🧩 FORME IRRÉGULIÈRE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function generateIrregular(targetTiles: number, levelId: number): RawTile[] {
  const tiles: RawTile[] = [];
  let seed = (levelId * 9301 + 49297) % 233280;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const occupied = new Set<string>();
  const addPair = (gx: number, gy: number, layer: number = 0) => {
    const key1 = `${gx},${gy},${layer}`;
    const key2 = `${gx + 1},${gy},${layer}`;
    if (!occupied.has(key1) && !occupied.has(key2)) {
      occupied.add(key1);
      occupied.add(key2);
      tiles.push({
        x: Math.round(gx * 1.05 * 100) / 100,
        y: Math.round(gy * 0.88 * 100) / 100,
        layer,
      });
      tiles.push({
        x: Math.round((gx + 1) * 1.05 * 100) / 100,
        y: Math.round(gy * 0.88 * 100) / 100,
        layer,
      });
      return true;
    }
    return false;
  };

  addPair(0, 0, 0);

  let attempts = 0;
  while (tiles.length < targetTiles && attempts < 400) {
    attempts++;
    const gx = Math.floor(pseudoRandom() * 5) - 2;
    const gy = Math.floor(pseudoRandom() * 5) - 2;
    const layer = Math.floor(pseudoRandom() * 4);
    addPair(gx, gy, layer);
  }

  return ensureEvenCount(tiles, targetTiles);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper: Ensure the generated tile count is strictly even and matches target
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ensureEvenCount(tiles: RawTile[], target: number): RawTile[] {
  let result = [...tiles];
  if (result.length % 2 !== 0) {
    result.pop();
  }

  // If result has fewer tiles than target, safely stack pairs on existing tiles in higher layers
  while (result.length < target) {
    const idx = (result.length / 2) % (result.length || 1);
    const ref = result[idx] || { x: 0, y: 0, layer: 0 };
    result.push({
      x: Math.round(ref.x * 100) / 100,
      y: Math.round(ref.y * 100) / 100,
      layer: ref.layer + 1,
    });
    const ref2 = result[(idx + 1) % (result.length || 1)] || { x: 0.5, y: 0, layer: 0 };
    result.push({
      x: Math.round(ref2.x * 100) / 100,
      y: Math.round(ref2.y * 100) / 100,
      layer: ref2.layer + 1,
    });
  }

  // If result has more tiles than target, truncate while keeping parity
  if (result.length > target) {
    const evenTarget = target & ~1;
    result = result.slice(0, evenTarget);
  }

  return result;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SYSTEM FOR THE 500 LEVELS: Tier distribution & no consecutive repeats
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function getArrangementTypeForLevel(levelId: number): ArrangementType {
  // Pool per level tier according to user specification
  let pool: ArrangementType[];

  if (levelId <= 30) {
    // Niveaux 1–30 : arrangements simples : Pyramide, Étages, Mur
    pool = ['pyramid', 'stairs', 'wall'];
  } else if (levelId <= 80) {
    // Niveaux 31–80 : ajouter Croix, Diamant et Deux côtés
    pool = ['pyramid', 'stairs', 'wall', 'cross', 'diamond', 'two_sides'];
  } else if (levelId <= 150) {
    // Niveaux 81–150 : ajouter Hexagone, Cercle et Tour
    pool = ['pyramid', 'stairs', 'wall', 'cross', 'diamond', 'two_sides', 'hexagon', 'circle', 'towers'];
  } else if (levelId <= 230) {
    // Niveaux 151–230 : ajouter Pont, Pyramide inversée et Centre avec anneaux
    pool = [
      'pyramid',
      'stairs',
      'wall',
      'cross',
      'diamond',
      'two_sides',
      'hexagon',
      'circle',
      'towers',
      'bridge',
      'inverted_pyramid',
      'rings',
    ];
  } else if (levelId <= 320) {
    // Niveaux 231–320 : ajouter Spirale et Éclair
    pool = [
      'pyramid',
      'stairs',
      'wall',
      'cross',
      'diamond',
      'two_sides',
      'hexagon',
      'circle',
      'towers',
      'bridge',
      'inverted_pyramid',
      'rings',
      'spiral',
      'lightning',
    ];
  } else if (levelId <= 400) {
    // Niveaux 321–400 : introduire davantage de Formes irrégulières
    pool = [
      'irregular',
      'spiral',
      'irregular',
      'lightning',
      'irregular',
      'hexagon',
      'rings',
      'irregular',
      'bridge',
      'diamond',
      'cross',
      'towers',
      'irregular',
      'circle',
      'two_sides',
    ];
  } else {
    // Niveaux 401–500 : combiner tous les 15 arrangements dans des compositions riches
    pool = [
      'pyramid',
      'stairs',
      'wall',
      'cross',
      'diamond',
      'hexagon',
      'circle',
      'spiral',
      'two_sides',
      'towers',
      'bridge',
      'inverted_pyramid',
      'lightning',
      'rings',
      'irregular',
    ];
  }

  // Deterministic indexing ensuring two consecutive levels are never the same
  const index = (levelId - 1) % pool.length;
  let chosen = pool[index];

  // Extra safety check: if previous level would have had the same arrangement, shift by 1
  if (levelId > 1) {
    const prevChosen = getArrangementTypeForLevel(levelId - 1);
    if (chosen === prevChosen) {
      chosen = pool[(index + 1) % pool.length];
    }
  }

  return chosen;
}

// Master dispatcher for arrangement generation
export function buildArrangementTiles(
  type: ArrangementType,
  targetTiles: number,
  levelId: number
): RawTile[] {
  switch (type) {
    case 'pyramid':
      return generatePyramid(targetTiles);
    case 'stairs':
      return generateStairs(targetTiles);
    case 'wall':
      return generateWall(targetTiles);
    case 'cross':
      return generateCross(targetTiles);
    case 'diamond':
      return generateDiamond(targetTiles);
    case 'hexagon':
      return generateHexagon(targetTiles);
    case 'circle':
      return generateCircle(targetTiles);
    case 'spiral':
      return generateSpiral(targetTiles);
    case 'two_sides':
      return generateTwoSides(targetTiles);
    case 'towers':
      return generateTowers(targetTiles);
    case 'bridge':
      return generateBridge(targetTiles);
    case 'inverted_pyramid':
      return generateInvertedPyramid(targetTiles);
    case 'lightning':
      return generateLightning(targetTiles);
    case 'rings':
      return generateConcentricRings(targetTiles);
    case 'irregular':
      return generateIrregular(targetTiles, levelId);
    default:
      return generatePyramid(targetTiles);
  }
}
