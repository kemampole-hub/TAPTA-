import React, { useMemo } from 'react';

interface WhiteShatterEffectProps {
  // Whether it's a slight break (2 tiles reunited) or a full destruction (3 tiles match)
  isFullBreak?: boolean;
  onComplete?: () => void;
}

interface FragmentData {
  id: number;
  xPct: number;
  yPct: number;
  widthPx: number;
  heightPx: number;
  dxPx: number;
  dyPx: number;
  rotDeg: number;
  durationS: number;
  delayS: number;
  opacity: number;
}

export const WhiteShatterEffect: React.FC<WhiteShatterEffectProps> = ({
  isFullBreak = true,
}) => {
  // Generate small pure white porcelain/ceramic chips that fall downwards with gravity
  const fragments: FragmentData[] = useMemo(() => {
    const count = isFullBreak ? 10 : 6;
    const list: FragmentData[] = [];

    for (let i = 0; i < count; i++) {
      // Starting position inside the tile boundary (20% to 80%)
      const xPct = 15 + Math.random() * 70;
      const yPct = 20 + Math.random() * 60;

      // Small sizes (2.5px to 5.5px)
      const widthPx = Math.round((2.5 + Math.random() * 3) * 10) / 10;
      const heightPx = Math.round((2.5 + Math.random() * 3.5) * 10) / 10;

      // Horizontal micro-drift (-14px to +14px)
      const dxPx = Math.round((Math.random() * 28 - 14) * 10) / 10;

      // Natural downward fall with gravity (+30px to +60px downwards)
      const dyPx = Math.round((isFullBreak ? 35 + Math.random() * 28 : 22 + Math.random() * 20) * 10) / 10;

      // Gentle natural tumbling rotation
      const rotDeg = Math.round(Math.random() * 90 - 45);

      // Duration and slight stagger delay
      const durationS = Math.round((0.38 + Math.random() * 0.14) * 100) / 100;
      const delayS = Math.round((Math.random() * 0.05) * 100) / 100;

      list.push({
        id: i,
        xPct,
        yPct,
        widthPx,
        heightPx,
        dxPx,
        dyPx,
        rotDeg,
        durationS,
        delayS,
        opacity: 0.9 + Math.random() * 0.1,
      });
    }

    return list;
  }, [isFullBreak]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      {/* Subtle fine white crack overlay for a split second */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M10 8 L18 19 L15 28 M18 19 L28 16 L32 24"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-75"
        />
        <path
          d="M18 19 L22 34"
          stroke="#F1F5F9"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Small falling white fragments */}
      {fragments.map((frag) => (
        <span
          key={frag.id}
          style={
            {
              left: `${frag.xPct}%`,
              top: `${frag.yPct}%`,
              width: `${frag.widthPx}px`,
              height: `${frag.heightPx}px`,
              '--frag-dx': `${frag.dxPx}px`,
              '--frag-dy': `${frag.dyPx}px`,
              '--frag-rot': `${frag.rotDeg}deg`,
              '--frag-duration': `${frag.durationS}s`,
              animationDelay: `${frag.delayS}s`,
              backgroundColor: '#FFFFFF',
            } as React.CSSProperties
          }
          className="absolute rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] animate-white-fragment"
        />
      ))}
    </div>
  );
};
