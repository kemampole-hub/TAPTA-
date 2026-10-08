import React from 'react';

export const FloatingTilesBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT CLUSTER OF FLOATING 3D TILES (Red, Blue, Green)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute top-[38%] -left-3 sm:left-2 flex flex-col gap-1.5 animate-float-1">
        {/* Red Circle / Symbol Tile */}
        <div
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center font-bold
          bg-gradient-to-b from-[#F87171] via-[#DC2626] to-[#991B1B]
          border-2 border-[#FECACA]
          shadow-[0_6px_0_#7F1D1D,0_12px_20px_rgba(0,0,0,0.6)]
          transform -rotate-12 hover:scale-105"
        >
          <div className="absolute inset-x-1.5 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
          <span className="text-2xl text-rose-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            #
          </span>
        </div>

        {/* Blue Triangle / Symbol Tile */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold ml-4 -mt-2
          bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#075985]
          border-2 border-[#BAE6FD]
          shadow-[0_6px_0_#0369A1,0_12px_20px_rgba(0,0,0,0.6)]
          transform rotate-6"
        >
          <div className="absolute inset-x-1.5 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
          <span className="text-2xl text-sky-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            €
          </span>
        </div>

        {/* Green Square / Letter Tile */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold -mt-1
          bg-gradient-to-b from-[#4ADE80] via-[#16A34A] to-[#14532D]
          border-2 border-[#BBF7D0]
          shadow-[0_6px_0_#166534,0_12px_20px_rgba(0,0,0,0.6)]
          transform -rotate-6"
        >
          <div className="absolute inset-x-1.5 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
          <span className="text-xl text-emerald-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            A
          </span>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RIGHT CLUSTER OF FLOATING 3D TILES (Yellow, Purple, Blue)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute top-[36%] -right-3 sm:right-2 flex flex-col items-end gap-1.5 animate-float-2">
        {/* Yellow Star Tile */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold
          bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#854D0E]
          border-2 border-[#FEF08A]
          shadow-[0_6px_0_#713F12,0_12px_20px_rgba(0,0,0,0.6)]
          transform rotate-12"
        >
          <div className="absolute inset-x-1.5 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
          <span className="text-2xl text-amber-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            $
          </span>
        </div>

        {/* Purple Diamond / Symbol Tile */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold mr-4 -mt-2
          bg-gradient-to-b from-[#C084FC] via-[#9333EA] to-[#581C87]
          border-2 border-[#E9D5FF]
          shadow-[0_6px_0_#6B21A8,0_12px_20px_rgba(0,0,0,0.6)]
          transform -rotate-8"
        >
          <div className="absolute inset-x-1.5 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
          <span className="text-2xl text-purple-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            ¥
          </span>
        </div>

        {/* Cyan / Symbol Tile */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold -mt-1
          bg-gradient-to-b from-[#22D3EE] via-[#0891B2] to-[#164E63]
          border-2 border-[#A5F3FC]
          shadow-[0_6px_0_#0E7490,0_12px_20px_rgba(0,0,0,0.6)]
          transform rotate-8"
        >
          <div className="absolute inset-x-1.5 top-1 h-3 bg-white/70 rounded-t-xl pointer-events-none" />
          <span className="text-xl text-cyan-950 font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            ∆
          </span>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FLOATING DRIFTING TILES IN CORNERS (Subtle & Atmospheric)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Top Left Floating Tile: B */}
      <div className="absolute top-[8%] left-[8%] animate-float-3 opacity-60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#E2E8F0] border border-white/60 shadow-md flex items-center justify-center text-xs font-bold text-sky-600 transform -rotate-15">
          B
        </div>
      </div>

      {/* Top Right Floating Tile: ¢ */}
      <div className="absolute top-[10%] right-[10%] animate-float-1 opacity-60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#FEF3C7] border border-amber-200/60 shadow-md flex items-center justify-center text-xs font-bold text-amber-600 transform rotate-15">
          ¢
        </div>
      </div>

      {/* Bottom Left Floating Tile: § */}
      <div className="absolute bottom-[20%] left-[6%] animate-float-2 opacity-50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#FFFDF9] to-[#EDE9FE] border border-purple-200/50 shadow-md flex items-center justify-center text-xs font-bold text-purple-600 transform rotate-12">
          §
        </div>
      </div>

      {/* Bottom Right Floating Tile: C */}
      <div className="absolute bottom-[22%] right-[6%] animate-float-3 opacity-50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#FFFDF9] to-[#DCFCE7] border border-emerald-200/50 shadow-md flex items-center justify-center text-xs font-bold text-emerald-600 transform -rotate-12">
          C
        </div>
      </div>
    </div>
  );
};
