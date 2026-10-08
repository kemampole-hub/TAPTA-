import React from 'react';

export const LubumbashiBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Base Sky Gradient: Bright warm sky at the top, blending smoothly into deep midnight blue */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1E3A8A 0%, #0F172A 30%, #020617 65%, #02040A 100%)',
        }}
      />

      {/* Top Daylight / Golden Hour Horizon Layer */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#38BDF8]/40 via-[#F59E0B]/15 to-transparent pointer-events-none" />

      {/* Subtle Starfield & Sparkles in the night blue zone */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-12 left-10 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-24 right-14 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse" />
        <div className="absolute top-36 left-1/4 w-1 h-1 bg-cyan-200 rounded-full" />
        <div className="absolute top-52 right-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-64 left-16 w-1 h-1 bg-amber-300 rounded-full opacity-60" />
      </div>

      {/* 2. Stylized Mountain Ridges with "LUBUMBASHI" lettering (exactement comme dans l'affiche) */}
      <svg
        className="absolute top-0 inset-x-0 w-full h-44 object-cover opacity-80"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mountainGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="mountainGradNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#020617" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Distant Mountains */}
        <path
          d="M 0 95 Q 60 55 120 75 Q 180 95 240 60 Q 310 30 400 65 L 400 160 L 0 160 Z"
          fill="url(#mountainGradFar)"
        />

        {/* Foreground Mountain with Lubumbashi text */}
        <path
          d="M 0 120 Q 90 90 190 115 Q 280 80 400 85 L 400 160 L 0 160 Z"
          fill="url(#mountainGradNear)"
        />

        {/* "LUBUMBASHI" landmark label on the right hill */}
        <text
          x="345"
          y="72"
          textAnchor="middle"
          fill="#FFFFFF"
          fillOpacity="0.85"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          letterSpacing="1.2"
        >
          LUBUMBASHI
        </text>

        {/* Iconic Mine Headframe Tower Silhouette on the right hill */}
        <path
          d="M 360 85 L 366 100 L 368 100 L 368 76 L 372 76 L 372 100 L 374 100 L 380 85"
          stroke="#0F172A"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        <rect x="366" y="74" width="8" height="4" fill="#1E293B" opacity="0.9" />
      </svg>

      {/* Smooth gradient transition from upper scenery to deep night blue */}
      <div className="absolute top-28 inset-x-0 h-44 bg-gradient-to-b from-transparent via-[#03081A]/85 to-[#02040A]" />

      {/* Center radial ambient glow */}
      <div className="absolute top-[32%] inset-x-0 h-96 bg-gradient-to-b from-amber-500/10 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
