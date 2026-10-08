import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Pause, Coins, Trophy, Lightbulb, CheckCircle2, Star } from 'lucide-react';
import { BoardTile, DockTile, LevelDefinition, MoveRecord, TileSymbol, SYMBOL_STYLES } from '../types/game';
import { createBoardForLevel, computeIsBlocked, getZoneForLevel } from '../utils/levels';
import { TileView } from './TileView';
import { SelectionDock } from './SelectionDock';
import { BoostersBar } from './BoostersBar';
import { PauseModal } from './PauseModal';
import { VictoryModal } from './VictoryModal';
import { DefeatModal } from './DefeatModal';
import { sounds } from '../utils/audio';

interface FloatingScore {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface GameScreenProps {
  level: LevelDefinition;
  playerCoins: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  unlockedSlotsCount: number; // Global unlocked slots (4 to 8)
  reviveTrigger?: number;
  onUnlockNextSlot: () => void;
  onWatchAdToRevive?: () => void;
  isNextLevelUnlocked?: boolean;
  onWatchAdToUnlockNext?: (levelId: number) => void;
  onLevelComplete: (levelId: number, score: number, stars: number, coinsEarned: number) => void;
  onSpendCoins: (amount: number) => boolean;
  onAddCoins: (amount: number) => void;
  onToggleSound: () => void;
  onToggleHaptic: () => void;
  onNextLevel: () => void;
  onHome: () => void;
  hasNextLevel: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  level,
  playerCoins,
  soundEnabled,
  hapticEnabled,
  unlockedSlotsCount = 4,
  reviveTrigger,
  onUnlockNextSlot,
  onWatchAdToRevive,
  isNextLevelUnlocked = true,
  onWatchAdToUnlockNext,
  onLevelComplete,
  onSpendCoins,
  onAddCoins,
  onToggleSound,
  onToggleHaptic,
  onNextLevel,
  onHome,
  hasNextLevel,
}) => {
  // Game states
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>(() => createBoardForLevel(level));
  const [dockTiles, setDockTiles] = useState<DockTile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const lastMatchTimeRef = useRef<number>(0);

  // Séquence à reproduire tracking
  const [completedSequenceSymbols, setCompletedSequenceSymbols] = useState<TileSymbol[]>([]);
  const [hasAwardedPerfectBonus, setHasAwardedPerfectBonus] = useState<boolean>(false);

  // Boosters state & Hint
  const [freeUndos, setFreeUndos] = useState<number>(2);
  const [freeHints, setFreeHints] = useState<number>(3);
  const [hintedTileId, setHintedTileId] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [isResolvingPair, setIsResolvingPair] = useState<boolean>(false);

  // Modals state
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isLost, setIsLost] = useState<boolean>(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROGRESSION DES 4 EMPLACEMENTS SUPPLÉMENTAIRES SUR 500 NIVEAUX :
  // NIVEAUX 1 À 100   → seulement 4 emplacements.
  // NIVEAUX 101 À 200 → le 5e emplacement peut être débloqué.
  // NIVEAUX 201 À 300 → le 6e emplacement peut être débloqué.
  // NIVEAUX 301 À 400 → le 7e emplacement peut être débloqué.
  // NIVEAUX 401 À 500 → le 8e emplacement peut être débloqué.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const maxAllowedForLevel = useMemo(() => {
    if (level.id <= 100) return 4;
    if (level.id <= 200) return 5;
    if (level.id <= 300) return 6;
    if (level.id <= 400) return 7;
    return 8;
  }, [level.id]);

  // Nombre d'emplacements actifs dans ce niveau (strictement maxAllowedForLevel au max)
  const effectiveSlots = Math.min(maxAllowedForLevel, unlockedSlotsCount);

  // Le joueur peut-il débloquer un emplacement supplémentaire dans ce niveau ?
  const canUnlockNextSlot = unlockedSlotsCount < maxAllowedForLevel && unlockedSlotsCount < 8;
  const nextSlotNumber = unlockedSlotsCount + 1;

  // Board layout sizing
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 360,
    height: 380,
  });

  // Reset when level changes
  useEffect(() => {
    setBoardTiles(createBoardForLevel(level));
    setDockTiles([]);
    setScore(0);
    setCombo(0);
    setCompletedSequenceSymbols([]);
    setHasAwardedPerfectBonus(false);
    setFreeUndos(2);
    setFreeHints(3);
    setHintedTileId(null);
    setMoveHistory([]);
    setIsResolvingPair(false);
    setIsPaused(false);
    setIsWon(false);
    setIsLost(false);
    setFloatingScores([]);
  }, [level]);

  // Handle revive trigger from AdMob rewarded ad without resetting level
  useEffect(() => {
    if (reviveTrigger && isLost) {
      handleRevive();
    }
  }, [reviveTrigger]);

  // Calculate layout bounding box for current level
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    level.tiles.forEach((t) => {
      minX = Math.min(minX, t.x);
      maxX = Math.max(maxX, t.x);
      minY = Math.min(minY, t.y);
      maxY = Math.max(maxY, t.y);
    });
    return {
      minX: minX === Infinity ? 0 : minX,
      maxX: maxX === -Infinity ? 1 : maxX,
      minY: minY === Infinity ? 0 : minY,
      maxY: maxY === -Infinity ? 1 : maxY,
    };
  }, [level]);

  // Handle container resize to dynamically scale tiles for mobile screens
  useEffect(() => {
    const el = boardContainerRef.current;
    if (!el) return;

    const updateSize = () => {
      if (el) {
        setContainerSize({
          width: el.clientWidth || 360,
          height: el.clientHeight || 380,
        });
      }
    };
    updateSize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateSize());
      ro.observe(el);
    }
    window.addEventListener('resize', updateSize);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Compute tile pixel dimension and centering offset so entire pyramid fits without zoom or scroll
  const { tilePx, offsetX, offsetY } = useMemo(() => {
    const spanX = Math.max(1, (bounds.maxX - bounds.minX) + 1.0);
    const spanY = Math.max(1, (bounds.maxY - bounds.minY) + 1.0);

    const paddingX = 24;
    const paddingY = 24;

    const availableW = Math.max(180, containerSize.width - paddingX);
    const availableH = Math.max(180, containerSize.height - paddingY);

    const maxTileW = availableW / spanX;
    const maxTileH = availableH / spanY;

    // Automatic scaling to fit phone screen
    const computedSize = Math.max(30, Math.min(62, Math.floor(Math.min(maxTileW, maxTileH))));

    const boardWidthPx = (bounds.maxX - bounds.minX) * computedSize + computedSize;
    const boardHeightPx = (bounds.maxY - bounds.minY) * computedSize + computedSize;

    const offX = Math.max(8, Math.round((containerSize.width - boardWidthPx) / 2));
    const offY = Math.max(8, Math.round((containerSize.height - boardHeightPx) / 2));

    return {
      tilePx: computedSize,
      offsetX: offX,
      offsetY: offY,
    };
  }, [bounds, containerSize]);

  // Restart level
  const handleRestart = () => {
    setBoardTiles(createBoardForLevel(level));
    setDockTiles([]);
    setScore(0);
    setCombo(0);
    setCompletedSequenceSymbols([]);
    setHasAwardedPerfectBonus(false);
    setFreeUndos(2);
    setFreeHints(3);
    setHintedTileId(null);
    setMoveHistory([]);
    setIsPaused(false);
    setIsWon(false);
    setIsLost(false);
    setFloatingScores([]);
  };

  // Add floating score popups
  const triggerScorePopup = (text: string) => {
    const id = `score-${Date.now()}-${Math.random()}`;
    const newPopup: FloatingScore = {
      id,
      text,
      x: containerSize.width / 2 + (Math.random() * 40 - 20),
      y: containerSize.height * 0.45,
    };
    setFloatingScores((prev) => [...prev, newPopup]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  };

  // Handle tile click on the board
  const handleTileClick = (clickedTile: BoardTile) => {
    if (isPaused || isWon || isLost || isResolvingPair) return;
    if (clickedTile.isBlocked) return;

    // Check if effective slots for this level are full
    if (dockTiles.length >= effectiveSlots) {
      if (canUnlockNextSlot) {
        triggerScorePopup(`🎁 Débloquez le ${nextSlotNumber}e emplacement avec une pub !`);
      } else {
        triggerScorePopup(`Barre pleine (${effectiveSlots} tuiles max)`);
      }
      return;
    }

    // Clear hint if player touches a tile
    if (hintedTileId) {
      setHintedTileId(null);
    }

    // 1. Remove tile from board
    const remainingBoard = boardTiles.filter((t) => t.id !== clickedTile.id);

    // 2. Recompute blocked states for remaining board tiles
    const updatedBoard = remainingBoard.map((tile) => ({
      ...tile,
      isBlocked: computeIsBlocked(tile, remainingBoard),
    }));

    setBoardTiles(updatedBoard);

    // 3. Place into dock (group with matching symbols if present, or next free slot)
    const newDock = [...dockTiles];
    const lastSameIndex = newDock.map((d) => d.symbol).lastIndexOf(clickedTile.symbol);
    const insertIndex = lastSameIndex !== -1 ? lastSameIndex + 1 : newDock.length;

    const newDockTile: DockTile = {
      id: clickedTile.id,
      symbol: clickedTile.symbol,
    };
    newDock.splice(insertIndex, 0, newDockTile);

    // 4. Save move history for Undo
    setMoveHistory((prev) => [
      ...prev,
      { tile: clickedTile, dockIndex: insertIndex },
    ]);

    setDockTiles(newDock);

    // 5. Check if 2 identical tiles are reunited to trigger convergence, shatter and disappearance
    checkMatch(newDock, updatedBoard);
  };

  // Check if 2 identical tiles are reunited in the dock (PAIR MATCH)
  const checkMatch = (
    currentDock: DockTile[],
    remainingBoard: BoardTile[]
  ) => {
    const symbolCounts: Record<string, number> = {};
    currentDock.forEach((t) => {
      symbolCounts[t.symbol] = (symbolCounts[t.symbol] || 0) + 1;
    });

    // Find any symbol with at least 2 identical tiles reunited
    const matchingSymbol = Object.keys(symbolCounts).find(
      (sym) => symbolCounts[sym] >= 2
    ) as TileSymbol | undefined;

    if (matchingSymbol) {
      // Lock clicking during resolution
      setIsResolvingPair(true);

      // Sound: clean ceramic shatter
      sounds.playShatter();

      // Mark the 2 matching tiles (triggers convergence and WhiteShatterEffect)
      let markedCount = 0;
      const markedDock = currentDock.map((t) => {
        if (t.symbol === matchingSymbol && markedCount < 2) {
          markedCount++;
          return { ...t, isMatching: true };
        }
        return t;
      });
      setDockTiles(markedDock);

      // Sound & Combo
      const now = Date.now();
      const isQuickStreak = now - lastMatchTimeRef.current < 3500;
      lastMatchTimeRef.current = now;

      const nextCombo = isQuickStreak ? combo + 1 : 1;
      setCombo(nextCombo);

      if (nextCombo > 1) {
        sounds.playCombo(nextCombo);
        triggerScorePopup(`+${100 + nextCombo * 30} COMBO x${nextCombo}!`);
      } else {
        sounds.playMatch();
        triggerScorePopup('+75');
      }

      // Add coins & score
      const points = 75 + (nextCombo - 1) * 30;
      setScore((s) => s + points);
      onAddCoins(3);

      // Check if this matched symbol is part of the sequence to reproduce
      if (level.sequence.includes(matchingSymbol)) {
        setCompletedSequenceSymbols((prev) => {
          if (!prev.includes(matchingSymbol)) {
            const updated = [...prev, matchingSymbol];
            const allDone = level.sequence.every((s) => updated.includes(s));
            if (allDone && !hasAwardedPerfectBonus) {
              setHasAwardedPerfectBonus(true);
              const bonus = level.perfect_bonus || 10;
              onAddCoins(bonus);
              setScore((s) => s + bonus * 15);
              triggerScorePopup(`🎯 Séquence validée ! +${bonus}🪙`);
            }
            return updated;
          }
          return prev;
        });
      }

      // At the end of the shatter animation (380ms), completely DELETE both tiles from the array
      // so their slots become completely empty and reconstructed immediately!
      setTimeout(() => {
        let afterMatch: DockTile[] = [];
        setDockTiles((prev) => {
          let removedCount = 0;
          afterMatch = prev.filter((t) => {
            if (t.symbol === matchingSymbol && removedCount < 2) {
              removedCount++;
              return false; // Completely removed from state!
            }
            return true;
          });

          // Check if board and dock are completely cleared -> VICTORY!
          if (remainingBoard.length === 0 && afterMatch.length === 0) {
            handleVictory();
          }

          return afterMatch;
        });
        setIsResolvingPair(false);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // RÈGLE 8: APRÈS L'ÉCLATEMENT
        // Après chaque paire détruite :
        // - libérer immédiatement les emplacements ;
        // - vérifier automatiquement s'il existe une autre paire identique ;
        // - si une autre paire existe, elle doit également s'éclater en chaîne !
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        checkMatch(afterMatch, remainingBoard);
      }, 380);
    } else {
      // Check defeat: dock full with effectiveSlots tiles and no pair formed
      if (currentDock.length >= effectiveSlots) {
        setTimeout(() => {
          setIsLost(true);
        }, 350);
      }
    }
  };

  // Handle victory
  const handleVictory = () => {
    setIsWon(true);
    const targetStars = level.reward_stars || 1;
    const stars = score >= 350 ? 3 : Math.max(targetStars, 2);
    const coinsEarned = (level.reward_coins || 15) + (stars === 3 ? (level.perfect_bonus || 5) : 0);
    onLevelComplete(level.id, score, stars, coinsEarned);
  };

  // Booster: Bouton Indice
  const handleHint = () => {
    if (boardTiles.length === 0 || isPaused || isWon || isLost) return;

    if (freeHints > 0) {
      setFreeHints((h) => h - 1);
    } else {
      if (!onSpendCoins(15)) return;
    }

    sounds.playBooster();

    // 1. Look for unblocked board tile that matches symbol already in dock
    const accessibleBoardTiles = boardTiles.filter((t) => !t.isBlocked);
    const dockSymbols = dockTiles.map((d) => d.symbol);

    let candidate = accessibleBoardTiles.find((t) => dockSymbols.includes(t.symbol));

    // 2. If none, look for an unblocked tile that matches an uncompleted symbol in sequence
    if (!candidate) {
      const neededSequenceSymbols = level.sequence.filter(
        (s) => !completedSequenceSymbols.includes(s)
      );
      candidate = accessibleBoardTiles.find((t) =>
        neededSequenceSymbols.includes(t.symbol)
      );
    }

    // 3. If none, pick any accessible tile that has >= 2 copies on the remaining board
    if (!candidate) {
      const symbolBoardCounts: Record<string, number> = {};
      boardTiles.forEach((t) => {
        symbolBoardCounts[t.symbol] = (symbolBoardCounts[t.symbol] || 0) + 1;
      });
      candidate = accessibleBoardTiles.find(
        (t) => (symbolBoardCounts[t.symbol] || 0) >= 2
      ) || accessibleBoardTiles[0];
    }

    if (candidate) {
      setHintedTileId(candidate.id);
      triggerScorePopup(`💡 Tuile « ${candidate.symbol} »`);
      setTimeout(() => {
        setHintedTileId((curr) => (curr === candidate?.id ? null : curr));
      }, 3500);
    } else {
      triggerScorePopup('💡 Dégagez les tuiles supérieures !');
    }
  };

  // Booster: Undo
  const handleUndo = () => {
    if (moveHistory.length === 0 || dockTiles.length === 0) return;

    if (freeUndos > 0) {
      setFreeUndos((u) => u - 1);
    } else {
      if (!onSpendCoins(25)) return;
    }

    sounds.playBooster();

    const lastMove = moveHistory[moveHistory.length - 1];
    setMoveHistory((prev) => prev.slice(0, -1));

    setDockTiles((prev) => prev.filter((d) => d.id !== lastMove.tile.id));

    setBoardTiles((prev) => {
      const restored = [...prev, lastMove.tile];
      return restored.map((tile) => ({
        ...tile,
        isBlocked: computeIsBlocked(tile, restored),
      }));
    });
  };

  // Booster: Shuffle
  const handleShuffle = () => {
    if (boardTiles.length <= 1) return;
    if (!onSpendCoins(50)) return;

    sounds.playBooster();

    setBoardTiles((prev) => {
      const symbols = prev.map((t) => t.symbol);
      for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
      }

      const shuffled = prev.map((tile, idx) => ({
        ...tile,
        symbol: symbols[idx],
      }));

      return shuffled.map((tile) => ({
        ...tile,
        isBlocked: computeIsBlocked(tile, shuffled),
      }));
    });
  };

  // Booster: Recall / Clear 3 tiles from dock
  const handleRecall = () => {
    if (dockTiles.length === 0) return;
    if (!onSpendCoins(60)) return;

    sounds.playBooster();
    setDockTiles((prev) => prev.slice(0, Math.max(0, prev.length - 3)));
    setIsLost(false);
  };

  // Handle Revive after defeat (free 3 tiles from dock, keeps board and level intact)
  const handleRevive = () => {
    sounds.playBooster();
    setDockTiles((prev) => prev.slice(0, Math.max(0, prev.length - 3)));
    setIsLost(false);
    triggerScorePopup('▶ Partie reprise ! 3 tuiles libérées');
  };

  const handleCoinsRevive = () => {
    if (!onSpendCoins(60)) return;
    handleRevive();
  };

  return (
    <div className="relative h-full flex flex-col justify-between max-w-md mx-auto w-full select-none overflow-hidden p-2.5 bg-slate-950">
      {/* 1. TOP HEADER: Numéro, Difficulté, Score, Pièces, Étoiles, Pause */}
      <header className="flex items-center justify-between py-1.5 px-2 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md shadow-md">
        {/* Back button */}
        <button
          onClick={onHome}
          aria-label="Retour au menu"
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Level Number & Difficulty Badge */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold font-display text-white">
              Niveau {level.id}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                level.difficulty === 'Expert'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : level.difficulty === 'Très difficile'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : level.difficulty === 'Difficile'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : level.difficulty === 'Moyen'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {level.difficulty}
            </span>
            {level.arrangement && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-800/80 border border-slate-700/60 text-amber-300 flex items-center gap-0.5">
                <span>{level.arrangement.icon}</span>
                <span>{level.arrangement.name}</span>
              </span>
            )}
          </div>

          {/* Stars indicator */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3].map((s) => {
              const isFilled = s === 1 || (s === 2 && score >= 180) || (s === 3 && score >= 350);
              return (
                <Star
                  key={s}
                  className="w-3 h-3"
                  fill={isFilled ? '#FBBF24' : 'transparent'}
                  stroke={isFilled ? '#FBBF24' : '#64748B'}
                />
              );
            })}
          </div>
        </div>

        {/* Score & Coins & Pause */}
        <div className="flex items-center gap-1.5">
          {/* Score */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-200 tabular-nums">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>{score}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-amber-300 tabular-nums">
            <span>{playerCoins}</span>
            <Coins className="w-3 h-3 text-amber-400" />
          </div>

          {/* Pause */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsPaused(true);
            }}
            aria-label="Mettre en pause"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 active:scale-95 transition-all"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SUB-BAR: Séquence à reproduire & Bouton Indice (AUCUN CHRONOMÈTRE, pas de secondes) */}
      <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 my-1 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-xs">
        {/* Séquence à reproduire */}
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">
            🎯 Séquence :
          </span>
          <div className="flex items-center gap-1">
            {level.sequence.map((sym, i) => {
              const isMatched = completedSequenceSymbols.includes(sym);
              const styleMeta = SYMBOL_STYLES[sym] || { color: '#F8FAFC' };
              return (
                <div
                  key={i}
                  style={{ color: isMatched ? '#10B981' : styleMeta.color }}
                  className={`
                    relative flex items-center justify-center w-6 h-6 rounded-lg text-xs font-display font-bold border transition-all
                    ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400 scale-105 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-slate-800/90 border-slate-700 text-slate-100'
                    }
                  `}
                >
                  {sym}
                  {isMatched && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-2 h-2 text-slate-950" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton Indice Rapide */}
        <button
          onClick={handleHint}
          disabled={isPaused || isWon || isLost}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs active:scale-95 transition-all shrink-0"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Indice</span>
        </button>
      </div>

      {/* 3. BARRE DE PLACEMENT HORIZONTALE (EN HAUT) : 4 DE BASE + 5 À 8 SELON TRANCHE ET PUB */}
      <div className="mb-1 w-full">
        <SelectionDock
          tiles={dockTiles}
          unlockedSlotsCount={effectiveSlots}
          canUnlockNextSlot={canUnlockNextSlot}
          nextSlotNumber={nextSlotNumber}
          onUnlockNextSlot={canUnlockNextSlot ? onUnlockNextSlot : undefined}
          isWarning={dockTiles.length >= effectiveSlots}
        />
      </div>

      {/* 4. PLATEAU DE JEU AVEC ARRIÈRE-PLAN ZEN IMMERSIF */}
      <div
        ref={boardContainerRef}
        className="relative flex-1 my-0.5 rounded-3xl border border-slate-800/60 overflow-hidden shadow-2xl flex items-center justify-center bg-slate-950"
      >
        {/* Background Image: Immersive Zen Landscape with Cover Mode */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/src/assets/images/zen_pyramid_bg_1791312295185.jpg"
            alt="Arrière-plan zen de la pyramide"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-radial from-slate-950/35 via-slate-950/50 to-slate-950/75 pointer-events-none" />
        </div>

        {/* Floating score text notifications */}
        {floatingScores.map((fs) => (
          <div
            key={fs.id}
            style={{ left: `${fs.x}px`, top: `${fs.y}px` }}
            className="absolute z-50 pointer-events-none font-display font-bold text-xl text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)] animate-float-score"
          >
            {fs.text}
          </div>
        ))}

        {/* Render stacked board tiles */}
        <div className="relative w-full h-full overflow-hidden">
          {boardTiles.map((tile) => (
            <TileView
              key={tile.id}
              tile={{
                ...tile,
                isHinted: tile.id === hintedTileId,
              }}
              sizePx={tilePx}
              leftPx={offsetX + (tile.x - bounds.minX) * tilePx}
              topPx={offsetY + (tile.y - bounds.minY) * tilePx}
              onClick={handleTileClick}
            />
          ))}
        </div>

        {/* Empty board state safeguard */}
        {boardTiles.length === 0 && !isWon && (
          <div className="text-center font-display font-bold text-amber-400 animate-pulse">
            Plateau vidé !
          </div>
        )}
      </div>

      {/* 5. BOOSTERS BAR (Indice, Annuler, Mélanger, Vider 3) */}
      <div className="pb-0.5 pt-0.5">
        <BoostersBar
          coins={playerCoins}
          freeUndos={freeUndos}
          freeHints={freeHints}
          canUndo={moveHistory.length > 0}
          canShuffle={boardTiles.length > 1 && playerCoins >= 50}
          canRecall={dockTiles.length > 0 && playerCoins >= 60}
          canHint={boardTiles.length > 0}
          onUndo={handleUndo}
          onShuffle={handleShuffle}
          onRecall={handleRecall}
          onHint={handleHint}
          disabled={isPaused || isWon || isLost}
        />
      </div>

      {/* Modals */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onHome={onHome}
          soundEnabled={soundEnabled}
          hapticEnabled={hapticEnabled}
          onToggleSound={onToggleSound}
          onToggleHaptic={onToggleHaptic}
        />
      )}

      {isWon && (
        <VictoryModal
          levelId={level.id}
          score={score}
          stars={score >= 350 ? 3 : Math.max(level.reward_stars || 1, 2)}
          coinsEarned={(level.reward_coins || 15) + (level.perfect_bonus || 5)}
          onNextLevel={onNextLevel}
          onWatchAdToUnlockNext={
            onWatchAdToUnlockNext ? () => onWatchAdToUnlockNext(level.id + 1) : undefined
          }
          isNextLevelUnlocked={isNextLevelUnlocked}
          onRestart={handleRestart}
          onHome={onHome}
          hasNextLevel={hasNextLevel}
        />
      )}

      {isLost && (
        <DefeatModal
          levelId={level.id}
          coins={playerCoins}
          onWatchAdToRevive={onWatchAdToRevive}
          onRevive={handleCoinsRevive}
          onRestart={handleRestart}
          onHome={onHome}
        />
      )}
    </div>
  );
};
