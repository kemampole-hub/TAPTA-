import React, { useState } from 'react';
import { BoardTile, SYMBOL_STYLES } from '../types/game';
import { sounds } from '../utils/audio';

interface TileViewProps {
  tile: BoardTile;
  sizePx: number;
  leftPx: number;
  topPx: number;
  onClick: (tile: BoardTile) => void;
  style?: React.CSSProperties;
}

export const TileView: React.FC<TileViewProps> = ({
  tile,
  sizePx,
  leftPx,
  topPx,
  onClick,
  style = {},
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const styleMeta = SYMBOL_STYLES[tile.symbol] || {
    color: '#1E293B',
    bgTint: '#F8FAFC',
    borderTint: '#E2E8F0',
  };

  const handlePointerDown = () => {
    if (tile.isBlocked) {
      setIsShaking(true);
      sounds.playBlocked();
      setTimeout(() => setIsShaking(false), 300);
      return;
    }
    setIsPressing(true);
  };

  const handlePointerUp = () => {
    setIsPressing(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tile.isBlocked) {
      setIsShaking(true);
      sounds.playBlocked();
      setTimeout(() => setIsShaking(false), 300);
      return;
    }
    sounds.playTap();
    onClick(tile);
  };

  return (
    <div
      role="button"
      tabIndex={tile.isBlocked ? -1 : 0}
      aria-label={`Tuile ${tile.symbol}${tile.isBlocked ? ' (bloquée)' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        left: `${leftPx}px`,
        top: `${topPx}px`,
        zIndex: 10 + tile.layer * 10,
        ...style,
      }}
      className={`
        absolute select-none cursor-pointer touch-manipulation
        flex items-center justify-center
        rounded-xl
        transition-all duration-150
        ${isShaking ? 'animate-shake' : ''}
        ${
          tile.isHinted
            ? 'ring-4 ring-amber-400 border-2 border-amber-300 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.9)] z-50 bg-amber-50 animate-bounce'
            : tile.isBlocked
            ? 'tile-3d-blocked bg-[#F3EDE3] border border-[#D0C4B4] cursor-not-allowed'
            : isPressing
            ? 'tile-3d-active scale-95 bg-white border border-[#DDD5C9]'
            : 'tile-3d-active bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#EFE7DE] border border-[#DDD5C9]'
        }
      `}
    >
      {/* 3D Tile Bevel Top Highlight */}
      <div className="absolute inset-x-1.5 top-1 h-1.5 bg-white/80 rounded-t-lg pointer-events-none" />

      {/* Hint badge indicator */}
      {tile.isHinted && (
        <div className="absolute -top-2 -right-1 px-1 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black shadow-md z-30">
          💡
        </div>
      )}

      {/* Symbol Centered with High Contrast & Legibility */}
      <span
        className={`
          font-display font-bold leading-none select-none
          drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]
          transition-transform
          ${isPressing ? 'scale-90' : 'scale-100'}
        `}
        style={{
          fontSize: `${Math.round(sizePx * 0.48)}px`,
          color: styleMeta.color,
          opacity: tile.isBlocked ? 0.82 : 1,
        }}
      >
        {tile.symbol}
      </span>

      {/* Subtle indicator when Blocked (discrete dot without masking symbol) */}
      {tile.isBlocked && (
        <div className="absolute inset-0 bg-slate-900/10 rounded-xl pointer-events-none flex items-end justify-end p-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500/80" />
        </div>
      )}
    </div>
  );
};
