import React from 'react';

interface TaptaLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const TaptaLogo: React.FC<TaptaLogoProps> = ({ size = 'lg' }) => {
  const letters = [
    { char: 'T', color: '#E11D48', shadow: '#BE123C', tilt: '-rotate-3' },
    { char: 'A', color: '#0284C7', shadow: '#0369A1', tilt: 'rotate-2' },
    { char: 'P', color: '#16A34A', shadow: '#15803D', tilt: '-rotate-2' },
    { char: 'T', color: '#EA580C', shadow: '#C2410C', tilt: 'rotate-3' },
    { char: 'A', color: '#9333EA', shadow: '#7E22CE', tilt: '-rotate-1' },
  ];

  const sizeClasses = {
    sm: {
      wrapper: 'gap-1.5',
      tile: 'w-8 h-8 rounded-lg text-lg border',
      shadow: 'shadow-[0_2px_0_#cbd5e1]',
    },
    md: {
      wrapper: 'gap-2',
      tile: 'w-11 h-11 rounded-xl text-2xl border-[1.5px]',
      shadow: 'shadow-[0_3px_0_#cbd5e1]',
    },
    lg: {
      wrapper: 'gap-2.5 sm:gap-3',
      tile: 'w-13 h-13 sm:w-16 sm:h-16 rounded-2xl text-3xl sm:text-4xl border-2',
      shadow: 'shadow-[0_4px_0_#cbd5e1,0_8px_16px_rgba(0,0,0,0.25)]',
    },
  }[size];

  return (
    <div className="flex flex-col items-center select-none">
      <div className={`flex items-center ${sizeClasses.wrapper}`}>
        {letters.map((item, idx) => (
          <div
            key={idx}
            className={`
              relative flex items-center justify-center font-display font-bold
              bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#EFE7DE]
              border-[#E2D8CC]
              transform transition-all duration-300 hover:scale-105
              ${item.tilt}
              ${sizeClasses.tile}
              ${sizeClasses.shadow}
            `}
            style={{
              color: item.color,
            }}
          >
            <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
              {item.char}
            </span>
            {/* Top Gloss highlight */}
            <div className="absolute inset-x-1 top-1 h-[30%] bg-white/70 rounded-t-lg pointer-events-none" />
          </div>
        ))}
      </div>
      {size === 'lg' && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-300 uppercase">
          <span>Triple Match</span>
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span>3D Puzzle</span>
        </div>
      )}
    </div>
  );
};
