import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, Lock, Play, Tv, Sparkles, CheckCircle2, Search, Clock, Award } from 'lucide-react';
import { LevelDefinition, LevelZone, SYMBOL_STYLES } from '../types/game';
import { LEVEL_ZONES } from '../utils/levels';

interface LevelsModalProps {
  levels: LevelDefinition[];
  unlockedLevels: number[];
  levelStars: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onWatchAdToUnlock: (levelId: number) => void;
  onClose: () => void;
}

export const LevelsModal: React.FC<LevelsModalProps> = ({
  levels,
  unlockedLevels,
  levelStars,
  onSelectLevel,
  onWatchAdToUnlock,
  onClose,
}) => {
  // Selected Zone: 1 (Facile), 2 (Moyen), 3 (Difficile), 4 (Très difficile), 5 (Expert)
  const [selectedZoneId, setSelectedZoneId] = useState<number>(1);
  // Sub-block of 20 within the zone (0 = 1-20, 1 = 21-40, 2 = 41-60, 3 = 61-80, 4 = 81-100)
  const [subBlockIndex, setSubBlockIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentZone = useMemo(() => {
    return LEVEL_ZONES.find((z) => z.id === selectedZoneId) || LEVEL_ZONES[0];
  }, [selectedZoneId]);

  // Sub-blocks within the current zone (each zone has 100 levels -> 5 sub-blocks of 20)
  const subBlocks = useMemo(() => {
    const list: { label: string; start: number; end: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const start = currentZone.from + i * 20;
      const end = Math.min(currentZone.to, start + 19);
      list.push({
        label: `${start}–${end}`,
        start,
        end,
      });
    }
    return list;
  }, [currentZone]);

  // Filtered levels based on search query OR zone & sub-block
  const displayedLevels = useMemo(() => {
    const q = searchQuery.trim();
    if (q) {
      const num = parseInt(q, 10);
      if (!isNaN(num)) {
        return levels.filter((lvl) => lvl.id === num);
      }
      return levels.filter(
        (lvl) =>
          lvl.name.toLowerCase().includes(q.toLowerCase()) ||
          lvl.difficulty.toLowerCase().includes(q.toLowerCase()) ||
          lvl.patternName.toLowerCase().includes(q.toLowerCase())
      );
    }

    const currentSub = subBlocks[subBlockIndex] || subBlocks[0];
    return levels.filter(
      (lvl) => lvl.id >= currentSub.start && lvl.id <= currentSub.end
    );
  }, [levels, searchQuery, subBlocks, subBlockIndex]);

  // Total stars count
  const totalStars = useMemo(() => {
    return Object.values(levelStars).reduce((acc, s) => acc + s, 0);
  }, [levelStars]);

  // Zone completion stats
  const zoneStats = useMemo(() => {
    const zoneLevels = levels.filter(
      (l) => l.id >= currentZone.from && l.id <= currentZone.to
    );
    const unlockedInZone = zoneLevels.filter(
      (l) => l.id <= 4 || unlockedLevels.includes(l.id)
    ).length;
    const starsInZone = zoneLevels.reduce(
      (acc, l) => acc + (levelStars[l.id] || 0),
      0
    );
    return { unlocked: unlockedInZone, total: zoneLevels.length, stars: starsInZone };
  }, [levels, currentZone, unlockedLevels, levelStars]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 animate-fade-in overflow-hidden select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3.5 py-3 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-base font-display font-bold text-white tracking-wide">
            500 Niveaux TAPTA
          </h1>
          <span className="text-[10px] text-amber-400 font-medium">
            {unlockedLevels.length} / 500 Débloqués · {totalStars} ★
          </span>
        </div>

        {/* Quick Search Toggle / Input */}
        <div className="relative w-24 sm:w-28">
          <input
            type="number"
            min="1"
            max="500"
            placeholder="Niveau..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-[10px] text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* 5 Great Zones Tabs (Rule 10) */}
      <div className="grid grid-cols-5 gap-1 p-2 bg-slate-900/60 border-b border-slate-800/80 text-center">
        {LEVEL_ZONES.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => {
                setSelectedZoneId(zone.id);
                setSubBlockIndex(0);
                setSearchQuery('');
              }}
              style={{
                borderColor: isSelected ? zone.color : 'transparent',
              }}
              className={`
                flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all border
                ${
                  isSelected
                    ? 'bg-slate-800/90 text-white shadow-md'
                    : 'bg-slate-950/40 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                }
              `}
            >
              <span
                className="text-[10px] font-bold font-display uppercase tracking-tight truncate max-w-full"
                style={{ color: isSelected ? zone.color : undefined }}
              >
                {zone.name}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tabular-nums">
                {zone.from}–{zone.to}
              </span>
            </button>
          );
        })}
      </div>

      {/* Zone Progress Summary Banner */}
      <div className="px-3.5 py-1.5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentZone.color }}
          />
          <span className="text-[11px] font-bold text-slate-200">
            Zone {currentZone.name} ({currentZone.from}–{currentZone.to})
          </span>
          <span className="text-[10px] text-slate-400">
            · {zoneStats.unlocked}/{zoneStats.total} Débloqués
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{zoneStats.stars} ★</span>
        </div>
      </div>

      {/* Sub-block Pagination chips (20 levels each) if not searching */}
      {!searchQuery && (
        <div className="flex items-center justify-center gap-1 p-1.5 bg-slate-900/30 border-b border-slate-800/40 overflow-x-auto no-scrollbar">
          {subBlocks.map((sb, idx) => {
            const isSelected = subBlockIndex === idx;
            return (
              <button
                key={sb.label}
                onClick={() => setSubBlockIndex(idx)}
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                  ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }
                `}
              >
                {sb.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Levels Cards List */}
      <div className="flex-1 overflow-y-auto p-3 max-w-md mx-auto w-full">
        {displayedLevels.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Aucun niveau trouvé pour cette recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-8">
            {displayedLevels.map((lvl) => {
              const isFreeInitial = lvl.id <= 4;
              const isUnlocked = isFreeInitial || unlockedLevels.includes(lvl.id);
              const stars = levelStars[lvl.id] || 0;

              return (
                <div
                  key={lvl.id}
                  className={`
                    relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-200
                    ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-slate-800 shadow-md'
                        : 'bg-slate-950/90 border-slate-900/80 opacity-90'
                    }
                  `}
                >
                  {/* Top card row: ID, Status, Difficulty */}
                  <div className="w-full flex items-center justify-between text-[11px] mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-400 font-display text-sm">
                        #{lvl.id}
                      </span>
                      {isFreeInitial ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          🔓 Gratuit
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Débloqué
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Verrouillé
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        lvl.difficulty === 'Expert'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : lvl.difficulty === 'Très difficile'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : lvl.difficulty === 'Difficile'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : lvl.difficulty === 'Moyen'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {lvl.difficulty}
                    </span>
                  </div>

                  {/* Level Info: Pattern & Sequence Preview */}
                  <div className="my-1.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold truncate ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                        {lvl.patternName}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        {lvl.time_limit_seconds}s
                      </span>
                    </div>

                    {/* Séquence à reproduire Preview */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        Séquence :
                      </span>
                      {lvl.sequence.map((sym, i) => {
                        const styleMeta = SYMBOL_STYLES[sym] || { color: '#F8FAFC' };
                        return (
                          <span
                            key={i}
                            style={{ color: styleMeta.color }}
                            className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-800 border border-slate-700/80 text-[11px] font-bold font-display"
                          >
                            {sym}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="w-full pt-2.5 border-t border-slate-800/80 mt-1">
                    {isUnlocked ? (
                      <div className="flex items-center justify-between">
                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className="w-3.5 h-3.5"
                              fill={s <= stars ? '#FBBF24' : 'transparent'}
                              stroke={s <= stars ? '#FBBF24' : '#64748B'}
                            />
                          ))}
                          <span className="text-[10px] text-amber-300/80 ml-1.5 font-semibold">
                            +{lvl.reward_coins}🪙
                          </span>
                        </div>

                        {/* Play Button */}
                        <button
                          onClick={() => onSelectLevel(lvl.id)}
                          className="py-1 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Jouer</span>
                        </button>
                      </div>
                    ) : (
                      /* Locked Level: Rewarded Ad Unlock Button */
                      <button
                        onClick={() => onWatchAdToUnlock(lvl.id)}
                        className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-97 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                      >
                        <Tv className="w-3.5 h-3.5 text-slate-950" />
                        <span>📺 Débloquer ce bloc (10 niveaux)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
