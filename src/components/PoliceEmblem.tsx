import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PoliceEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const PoliceEmblem: React.FC<PoliceEmblemProps> = ({ size = 'md', showText = true }) => {
  const { t } = useLanguage();
  const dimensionClass =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div
      id="app-police-emblem"
      className="flex items-center gap-2.5 select-none bg-slate-900 text-white px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-xs"
      title={t('Karnataka State Police / CID Intelligence Command')}
    >
      {/* Official Police Shield & Lion Emblem SVG */}
      <svg
        className={`${dimensionClass} shrink-0 text-amber-400`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield background */}
        <path
          d="M50 5 L88 20 C88 55 50 92 50 95 C50 92 12 55 12 20 Z"
          fill="#0B132B"
          stroke="#D4AF37"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Inner Shield border */}
        <path
          d="M50 12 L81 24 C81 53 50 84 50 87 C50 84 19 53 19 24 Z"
          fill="#1C2541"
          stroke="#E0B738"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        {/* 8-pointed Star badge / Ashok Chakra motif */}
        <circle cx="50" cy="46" r="22" fill="#0B132B" stroke="#F6C845" strokeWidth="2" />
        <circle cx="50" cy="46" r="17" fill="#1C2541" stroke="#F6C845" strokeWidth="1" />
        <circle cx="50" cy="46" r="4.5" fill="#F6C845" />

        {/* 16 rays/spokes */}
        {[...Array(16)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="46"
            x2={50 + 17 * Math.cos((i * Math.PI) / 8)}
            y2={46 + 17 * Math.sin((i * Math.PI) / 8)}
            stroke="#F6C845"
            strokeWidth="1"
            opacity="0.8"
          />
        ))}

        {/* Top 3-Lions Crest Head representation */}
        <path
          d="M42 22 Q50 17 58 22 L55 28 Q50 25 45 28 Z"
          fill="#F6C845"
        />
        <circle cx="50" cy="22" r="3" fill="#F6C845" />

        {/* Bottom Banner with Satyameva Jayate ribbon */}
        <path
          d="M25 72 Q50 78 75 72 L72 80 Q50 85 28 80 Z"
          fill="#C41E3A"
          stroke="#F6C845"
          strokeWidth="1.2"
        />
        <text
          x="50"
          y="77.5"
          textAnchor="middle"
          fontSize="5.5"
          fontWeight="900"
          fill="#FFFFFF"
          fontFamily="sans-serif"
          letterSpacing="0.8"
        >
          POLICE
        </text>
      </svg>

      {showText && (
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase">
              {t('STATE POLICE')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[9px] font-mono text-slate-300 font-bold uppercase tracking-widest">
            {t('CID COMMAND')}
          </span>
        </div>
      )}
    </div>
  );
};
