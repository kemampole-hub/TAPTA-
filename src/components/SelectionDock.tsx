import React from 'react';
import { Tv, Sparkles } from 'lucide-react';
import { DockTile, SYMBOL_STYLES } from '../types/game';
import { WhiteShatterEffect } from './WhiteShatterEffect';

interface SelectionDockProps {
  tiles: DockTile[];
  unlockedSlotsCount: number; // Exactly 4 to 8 slots currently unlocked
  canUnlockNextSlot?: boolean; // Whether player is in tier to unlock next slot (101-200 for 5th, etc.)
  nextSlotNumber?: number; // 5, 6, 7, or 8
  onUnlockNextSlot?: () => void;
  highlightedIndices?: number[];
  isWarning?: boolean;
}

export const SelectionDock: React.FC<SelectionDockProps> = ({
  tiles,
  unlockedSlotsCount = 4,
  canUnlockNextSlot = false,
  nextSlotNumber,
  onUnlockNextSlot,
  highlightedIndices = [],
  isWarning = false,
}) => {
  // Clamped strictly between 4 and 8
  const currentSlots = Math.max(4, Math.min(8, unlockedSlotsCount));

  // EXACTLY currentSlots are rendered.
  // Emplacements 5 à 8 sont COMPLÈTEMENT INVISIBLES avant leur déblocage:
  // Pas de cadenas, pas de cases vides, pas de contours, pas de placeholders.
  const slotIndices = Array.from({ length: currentSlots }, (_, i) => i);

  return (
    <div className="w-full max-w-md mx-auto px-1 select-none">
      {/* Horizontal Placement Bar Container at Top */}
      <div
        className={`
          relative flex items-center justify-center gap-1.5 p-1.5 sm:p-2
          rounded-2xl bg-slate-900/90 backdrop-blur-md
          border-2 transition-all duration-300
          ${
            isWarning
              ? 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
              : 'border-amber-500/30 shadow-[0_4px_18px_rgba(0,0,0,0.45)]'
          }
        `}
      >
        {/* Subtle top bevel glow */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        {slotIndices.map((index) => {
          const tile = tiles[index] || null;
          const isHighlighted = highlightedIndices.includes(index);
          const styleMeta = tile ? SYMBOL_STYLES[tile.symbol] || { color: '#1E293B' } : null;

          // Check if this tile is the left or right of a converging pair
          const isPairLeft =
            Boolean(tile?.isMatching) &&
            index < tiles.length - 1 &&
            tiles[index + 1]?.symbol === tile?.symbol;
          const isPairRight =
            Boolean(tile?.isMatching) &&
            index > 0 &&
            tiles[index - 1]?.symbol === tile?.symbol;

          return (
            <div
              key={`slot-${index}`}
              className={`
                relative flex-1 aspect-square max-w-[46px] min-w-[34px]
                flex items-center justify-center rounded-xl
                bg-slate-950/75 border shadow-inner transition-all duration-300
                ${
                  index < 4
                    ? 'border-slate-800/90'
                    : 'border-amber-500/50 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
                }
              `}
            >
              {tile ? (
                <div
                  className={`
                    w-full h-full rounded-xl flex items-center justify-center select-none
                    tile-dock font-display font-bold
                    bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#EFE7DE]
                    border border-[#E2D8CC]
                    transition-all duration-200
                    ${
                      tile.isMatching
                        ? isPairLeft
                          ? 'animate-pair-converge-left z-20'
                          : isPairRight
                          ? 'animate-pair-converge-right z-20'
                          : 'animate-tile-shatter z-20'
                        : isHighlighted
                        ? 'scale-105 z-10'
                        : 'scale-100'
                    }
                  `}
                  style={{
                    color: styleMeta?.color,
                  }}
                >
                  {/* Top gloss */}
                  <div className="absolute inset-x-1 top-0.5 h-1 bg-white/80 rounded-t-lg pointer-events-none" />

                  <span className="text-base sm:text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] leading-none">
                    {tile.symbol}
                  </span>

                  {/* Clean white ceramic fragments effect */}
                  {tile.isMatching && <WhiteShatterEffect isFullBreak={true} />}
                </div>
              ) : (
                /* Completely EMPTY slot: tile deleted and slot immediately available */
                <div className="flex flex-col items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700/60" />
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 font-bold">
                    {index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Capacity & Rewarded Unlock Action for 5th, 6th, 7th, 8th slot */}
      <div className="flex items-center justify-between px-2 mt-1 text-[11px]">
        {/* Slot count info */}
        <div className="text-slate-400 font-medium text-[10px]">
          <span>
            {tiles.length} / {currentSlots} tuiles
          </span>
          <span className="text-slate-500 ml-1">
            ({currentSlots === 4 ? '4 emplacements' : `${currentSlots} emplacements débloqués`})
          </span>
        </div>

        {/* Unlock button ONLY appears when reached the level tier (101 for 5th, 201 for 6th, etc.) */}
        {canUnlockNextSlot && nextSlotNumber && onUnlockNextSlot ? (
          <button
            onClick={onUnlockNextSlot}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/50 text-amber-300 font-bold text-[10px] active:scale-95 transition-all shadow-md shadow-amber-500/10"
          >
            <Tv className="w-3 h-3 text-amber-400" />
            <span>Débloquer le {nextSlotNumber}e avec une pub</span>
          </button>
        ) : currentSlots >= 8 ? (
          <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            8 / 8 emplacements max
          </span>
        ) : null}
      </div>
    </div>
  );
};
