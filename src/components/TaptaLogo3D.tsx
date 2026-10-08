import React from 'react';

interface TaptaLogo3DProps {
  className?: string;
  showPyramid?: boolean;
  showSubtitle?: boolean;
}

export const TaptaLogo3D: React.FC<TaptaLogo3DProps> = ({
  className = '',
  showPyramid = true,
  showSubtitle = true,
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 1. TOP PYRAMID OF CHUNKY 3D TILES (exactement comme dans l'affiche) */}
      {showPyramid && (
        <div className="relative flex flex-col items-center -mb-4 z-10">
          {/* Top Row: Yellow tile with Star */}
          <div className="relative mb-[-8px] z-20">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-2xl
              bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04]
              border-2 border-[#FEF08A]
              shadow-[0_6px_0_#A16207,0_12px_18px_rgba(0,0,0,0.45)]
              transform -rotate-1 transition-transform hover:scale-105"
            >
              {/* Gloss highlight */}
              <div className="absolute inset-x-1.5 top-1 h-3.5 bg-white/70 rounded-t-xl pointer-events-none" />
              {/* Embossed 3D Star */}
              <span className="text-2xl sm:text-3xl text-amber-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] filter drop-shadow">
                ★
              </span>
            </div>
          </div>

          {/* Middle Row: Blue Triangle, Green Square, Red Circle */}
          <div className="flex items-center gap-1.5 sm:gap-2 z-10">
            {/* Blue Triangle Tile */}
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold
              bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#0369A1]
              border-2 border-[#BAE6FD]
              shadow-[0_5px_0_#075985,0_10px_16px_rgba(0,0,0,0.4)]
              transform -rotate-3"
            >
              <div className="absolute inset-x-1 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
              <span className="text-xl sm:text-2xl text-sky-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                ▲
              </span>
            </div>

            {/* Green Square Tile */}
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold
              bg-gradient-to-b from-[#4ADE80] via-[#16A34A] to-[#15803D]
              border-2 border-[#BBF7D0]
              shadow-[0_5px_0_#166534,0_10px_16px_rgba(0,0,0,0.4)]
              transform rotate-1"
            >
              <div className="absolute inset-x-1 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
              <span className="text-xl sm:text-2xl text-emerald-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                ■
              </span>
            </div>

            {/* Red Circle Tile */}
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold
              bg-gradient-to-b from-[#F87171] via-[#DC2626] to-[#B91C1C]
              border-2 border-[#FECACA]
              shadow-[0_5px_0_#991B1B,0_10px_16px_rgba(0,0,0,0.4)]
              transform rotate-3"
            >
              <div className="absolute inset-x-1 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
              <span className="text-xl sm:text-2xl text-rose-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                ●
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE BIG 3D TAPTA LOGO WITH CURVED GLOWING PEDESTAL BASE */}
      <div className="relative z-30 flex flex-col items-center">
        {/* Ambient Golden & Cyan Glow behind Logo */}
        <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/35 via-cyan-500/25 to-amber-500/35 rounded-full blur-2xl pointer-events-none" />

        {/* Curved Blue Plinth / Base under TAPTA */}
        <div className="relative pt-2 pb-3 px-6 sm:px-8">
          {/* SVG 3D Curved Plinth Base with Neon Cyan Rim */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 320 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="plinthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="40%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="neonRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base curved body */}
            <path
              d="M 20 40 Q 160 15 300 40 L 305 95 Q 160 115 15 95 Z"
              fill="url(#plinthGrad)"
              stroke="#1E293B"
              strokeWidth="3"
            />
            {/* Glowing top rim */}
            <path
              d="M 22 42 Q 160 17 298 42"
              fill="none"
              stroke="url(#neonRim)"
              strokeWidth="4"
              filter="url(#neonGlow)"
            />
            {/* Subtle bottom shadow */}
            <path
              d="M 15 95 Q 160 115 305 95"
              fill="none"
              stroke="#000000"
              strokeWidth="6"
              opacity="0.6"
            />
          </svg>

          {/* TAPTA Bold 3D Golden Letters */}
          <div className="relative z-10 flex items-center justify-center tracking-tight px-2 py-1">
            <span
              className="text-5xl sm:text-6xl md:text-7xl font-display font-black leading-none
              tracking-wide
              text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#FBBF24] to-[#D97706]
              filter drop-shadow-[0_2px_0_#FFF]
              [text-shadow:_0_2px_0_#F59E0B,_0_4px_0_#D97706,_0_6px_0_#B45309,_0_8px_0_#78350F,_0_10px_16px_rgba(0,0,0,0.85)]"
              style={{
                WebkitTextStroke: '2px #451A03',
              }}
            >
              TAPTA
            </span>
          </div>
        </div>
      </div>

      {/* 3. SOUS-TITRE (Associe • Débloque • Gagne) */}
      {showSubtitle && (
        <div className="mt-1 text-center space-y-1 z-30">
          <div className="text-sm sm:text-base font-display font-extrabold tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-amber-300">ASSOCIE</span>
            <span className="mx-2 text-sky-400">•</span>
            <span className="text-sky-300">DÉBLOQUE</span>
            <span className="mx-2 text-emerald-400">•</span>
            <span className="text-emerald-300">GAGNE</span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-300/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Un jeu de réflexion simple et plein de surprises !
          </p>
        </div>
      )}
    </div>
  );
};
