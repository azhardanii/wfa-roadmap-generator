import React, { useId } from 'react';

export default function OrbVisual({ size = 'md', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `jalur-route-${uid}`;
  const glowId = `jalur-glow-${uid}`;

  const sizeConfig = {
    sm: {
      box: 'w-11 h-11 rounded-2xl',
      icon: 'w-7 h-7',
      pad: 'p-1.5'
    },
    md: {
      box: 'w-20 h-20 rounded-[26px]',
      icon: 'w-12 h-12',
      pad: 'p-3'
    },
    lg: {
      box: 'w-28 h-28 rounded-3xl',
      icon: 'w-16 h-16',
      pad: 'p-4'
    },
    xl: {
      box: 'w-36 h-36 rounded-[32px]',
      icon: 'w-20 h-20',
      pad: 'p-5'
    }
  }[size] || {
    box: 'w-20 h-20 rounded-[26px]',
    icon: 'w-12 h-12',
    pad: 'p-3'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      title="Ikon Peta Perjalanan Jalur"
    >
      {/* Ambient backdrop glow */}
      <div
        className={`absolute ${sizeConfig.box} blur-xl opacity-75 animate-pulse-subtle bg-gradient-to-tr from-emerald-400/45 via-teal-300/35 to-amber-300/25 pointer-events-none`}
        style={{ transform: 'scale(1.22)' }}
      />

      {/* Frosted glass roadmap emblem tile */}
      <div
        className={`relative ${sizeConfig.box} ${sizeConfig.pad} flex items-center justify-center bg-gradient-to-br from-white/25 via-emerald-300/15 to-pine-950/50 backdrop-blur-md border border-white/30 shadow-float animate-float-slow`}
      >
        {/* Subtle inner specular bevel */}
        <div className="absolute inset-1 rounded-[20px] border border-white/15 pointer-events-none" />

        {/* Custom Winding Roadmap & Finish Flag SVG Emblem */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeConfig.icon} relative z-10 overflow-visible`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="12" y1="52" x2="50" y2="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="55%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Faint compass horizon arc */}
          <circle
            cx="32"
            cy="32"
            r="25"
            stroke="white"
            strokeOpacity="0.14"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />

          {/* Subtle trail shadow under S-curve path */}
          <path
            d="M14 50 C14 36, 46 42, 46 28 C46 18, 22 20, 28 11 L43 11"
            stroke="#06281E"
            strokeOpacity="0.35"
            strokeWidth="5.5"
            strokeLinecap="round"
            transform="translate(0, 1.5)"
          />

          {/* Main glowing S-curve journey path */}
          <path
            d="M14 50 C14 36, 46 42, 46 28 C46 19, 24 22, 30 12 L42 12"
            stroke={`url(#${gradId})`}
            strokeWidth="4"
            strokeLinecap="round"
            filter={`url(#${glowId})`}
          />

          {/* Start milestone pin (bottom-left) */}
          <circle cx="14" cy="50" r="6" fill="#0C2A20" stroke="#6EE7B7" strokeWidth="2.5" />
          <circle cx="14" cy="50" r="2.2" fill="#A7F3D0" />

          {/* Mid-journey checkpoint node */}
          <circle cx="44" cy="29" r="5" fill="#163B30" stroke="#34D399" strokeWidth="2.5" />
          <circle cx="44" cy="29" r="1.8" fill="#FFFFFF" />

          {/* Finish flag at peak (top-right) */}
          <path
            d="M42 11 V23"
            stroke="#FDE68A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M42 11 L54 14.5 L42 18.5 Z"
            fill="#FCD34D"
            stroke="#FEF3C7"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Achievement glint spark */}
          <path
            d="M21 18 L22.2 14.8 L23.4 18 L26.6 19.2 L23.4 20.4 L22.2 23.6 L21 20.4 L17.8 19.2 Z"
            fill="#A7F3D0"
            fillOpacity="0.9"
          />
        </svg>
      </div>
    </div>
  );
}
