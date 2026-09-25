import React, { useState } from 'react';
import {
  Network,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  CreditCard,
  Phone,
  Car,
  MapPin,
  Shield,
  Info,
} from 'lucide-react';
import { SuspectProfile, CaseRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DigitalThreadMapProps {
  caseItem: CaseRecord;
  suspects: SuspectProfile[];
  onSelectSuspect: (suspect: SuspectProfile) => void;
}

interface ThreadLink {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'financial' | 'telecom' | 'vehicle' | 'conspiracy';
  label: string;
  sublabel: string;
}

export const DigitalThreadMap: React.FC<DigitalThreadMapProps> = ({
  caseItem,
  suspects,
  onSelectSuspect,
}) => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Position suspects along an organic circular / digital thread constellation
  const center = { x: 420, y: 260 };
  const radius = 175;

  const positionedSuspects = suspects.map((s, index) => {
    const angle = (index / Math.max(suspects.length, 1)) * 2 * Math.PI - Math.PI / 2;
    // For SUS-01 (Person A) as lead coordinator, position near center or primary focus
    if (s.id === 'SUS-01' && suspects.length > 2) {
      return {
        ...s,
        x: 320,
        y: 240,
        isHub: true,
      };
    }
    const offsetRadius = s.id === 'SUS-02' ? radius * 0.9 : radius;
    return {
      ...s,
      x: center.x + offsetRadius * Math.cos(angle),
      y: center.y + offsetRadius * Math.sin(angle),
      isHub: false,
    };
  });

  // Define the digital threads between suspects
  const allThreads: ThreadLink[] = [
    {
      id: 'thread-1',
      sourceId: 'SUS-01',
      targetId: 'SUS-02',
      type: 'financial',
      label: '₹7,00,000 Transferred',
      sublabel: 'Layered via Account-7821 in 18 mins',
    },
    {
      id: 'thread-2',
      sourceId: 'SUS-01',
      targetId: 'SUS-03',
      type: 'financial',
      label: '₹3,50,000 P2P Dispersal',
      sublabel: 'UPI Split to synthetic wallets',
    },
    {
      id: 'thread-3',
      sourceId: 'SUS-01',
      targetId: 'SUS-04',
      type: 'vehicle',
      label: 'Shared Vehicle KA-04-XX-1102',
      sublabel: 'Cash courier & transit driver',
    },
    {
      id: 'thread-4',
      sourceId: 'SUS-02',
      targetId: 'SUS-05',
      type: 'conspiracy',
      label: 'Holding Yard Lease',
      sublabel: 'Electronic City / Peenya Safehouse',
    },
    {
      id: 'thread-5',
      sourceId: 'SUS-01',
      targetId: 'SUS-06',
      type: 'telecom',
      label: 'VoIP & Proxy Infrastructure',
      sublabel: '48 Encrypted Wiretap Burst Calls',
    },
    {
      id: 'thread-6',
      sourceId: 'SUS-03',
      targetId: 'SUS-06',
      type: 'telecom',
      label: 'Dynamic DNS & VPN Relays',
      sublabel: 'Shadowsocks bridge sync',
    },
  ];

  const filteredThreads = allThreads.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const getThreadColor = (type: string) => {
    switch (type) {
      case 'financial':
        return '#10b981'; // emerald
      case 'telecom':
        return '#38bdf8'; // sky blue
      case 'vehicle':
        return '#fbbf24'; // amber
      case 'conspiracy':
      default:
        return '#f43f5e'; // rose
    }
  };

  return (
    <div className="bg-[#0b0d14] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {t('Digital Thread Connection Map')}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
                Interactive Graph
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t("Click any suspect's face or name to open their complete history and background.")}
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-[#151824] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Threads
          </button>
          <button
            type="button"
            onClick={() => setFilterType('financial')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'financial'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-xs'
                : 'bg-[#151824] text-emerald-400 hover:bg-emerald-950/40 border border-slate-800'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            Financial
          </button>
          <button
            type="button"
            onClick={() => setFilterType('telecom')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'telecom'
                ? 'bg-sky-400 text-slate-950 font-extrabold shadow-xs'
                : 'bg-[#151824] text-sky-400 hover:bg-sky-950/40 border border-slate-800'
            }`}
          >
            <Phone className="w-3 h-3" />
            Telecom/Calls
          </button>
          <button
            type="button"
            onClick={() => setFilterType('vehicle')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'vehicle'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-xs'
                : 'bg-[#151824] text-amber-400 hover:bg-amber-950/40 border border-slate-800'
            }`}
          >
            <Car className="w-3 h-3" />
            Vehicles
          </button>
        </div>
      </div>

      {/* Interactive Graph Canvas */}
      <div className="relative w-full h-[480px] bg-[#07080d] border border-slate-800/80 rounded-xl overflow-hidden flex items-center justify-center select-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Zoom Controls */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-1 bg-[#12141e]/90 border border-slate-800 rounded-lg p-1 shadow-lg backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.45))}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={t('Zoom In')}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.75))}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={t('Zoom Out')}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={t('Reset View')}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute left-3 bottom-3 z-20 bg-[#10131d]/90 border border-slate-800 rounded-lg p-2.5 text-[11px] space-y-1.5 shadow-lg backdrop-blur-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {t('Thread Legend')}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
            <span className="text-slate-300">{t('Financial Wire Transfer')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-sky-400 rounded-full" />
            <span className="text-slate-300">{t('Wiretap & Telecom Intercept')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 rounded-full" />
            <span className="text-slate-300">{t('Shared Vehicle Telemetry')}</span>
          </div>
        </div>

        {/* SVG Drawing Layer */}
        <svg
          viewBox="0 0 840 520"
          className="w-full h-full"
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          <defs>
            <filter id="glow-thread" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Render Thread Lines */}
          {filteredThreads.map((thread) => {
            const src = positionedSuspects.find((s) => s.id === thread.sourceId);
            const tgt = positionedSuspects.find((s) => s.id === thread.targetId);
            if (!src || !tgt) return null;

            const isHighlighted =
              hoveredNode === thread.sourceId || hoveredNode === thread.targetId;
            const strokeColor = getThreadColor(thread.type);
            const midX = (src.x + tgt.x) / 2;
            const midY = (src.y + tgt.y) / 2;

            return (
              <g key={thread.id} className="transition-opacity duration-200">
                {/* Outer halo glow for digital thread */}
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 4 : 2}
                  strokeOpacity={isHighlighted ? 0.8 : 0.35}
                  strokeDasharray={thread.type === 'telecom' ? '6 4' : 'none'}
                  filter="url(#glow-thread)"
                />

                {/* Main animated wire */}
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeOpacity={0.9}
                />

                {/* Thread Tag Pill in Center */}
                <g
                  transform={`translate(${midX}, ${midY})`}
                  className="cursor-pointer pointer-events-none"
                >
                  <rect
                    x="-65"
                    y="-11"
                    width="130"
                    height="22"
                    rx="11"
                    fill="#0a0c13"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeOpacity="0.8"
                  />
                  <text
                    x="0"
                    y="3"
                    fill="#e2e8f0"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {thread.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Suspect Nodes */}
          {positionedSuspects.map((suspect) => {
            const isHovered = hoveredNode === suspect.id;
            const initial = suspect.codeName?.slice(0, 2) || suspect.alias?.slice(0, 2) || 'S';

            return (
              <g
                key={suspect.id}
                transform={`translate(${suspect.x}, ${suspect.y})`}
                onMouseEnter={() => setHoveredNode(suspect.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectSuspect(suspect)}
                className="cursor-pointer group"
              >
                {/* Pulse Ring */}
                <circle
                  r={suspect.isHub ? 38 : 32}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeOpacity={isHovered ? 0.8 : 0.2}
                  className={isHovered ? 'animate-ping' : ''}
                />

                {/* Outer Node Circle */}
                <circle
                  r={suspect.isHub ? 34 : 28}
                  fill="#111420"
                  stroke={isHovered ? '#60a5fa' : suspect.isHub ? '#3b82f6' : '#334155'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150 group-hover:scale-105"
                />

                {/* Avatar / Initials */}
                <circle
                  r={suspect.isHub ? 26 : 21}
                  fill={suspect.status === 'Key Node' || suspect.isHub ? '#1e3a8a' : '#1e293b'}
                />
                <text
                  x="0"
                  y="5"
                  fill="#ffffff"
                  fontSize={suspect.isHub ? '13' : '11'}
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {initial}
                </text>

                {/* Node Labels below */}
                <g transform="translate(0, 42)">
                  <rect
                    x="-55"
                    y="-10"
                    width="110"
                    height="32"
                    rx="6"
                    fill="#0e111a"
                    stroke={isHovered ? '#3b82f6' : '#1e293b'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {suspect.codeName}
                  </text>
                  <text
                    x="0"
                    y="16"
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {suspect.legalName || suspect.alias || suspect.id}
                  </text>
                </g>

                {/* "Click for Background" tooltip on hover */}
                {isHovered && (
                  <g transform="translate(0, -44)">
                    <rect
                      x="-70"
                      y="-12"
                      width="140"
                      height="20"
                      rx="10"
                      fill="#2563eb"
                    />
                    <text
                      x="0"
                      y="2"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {t('Click to Open Dossier ↗')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick Suspect Bar at bottom of map */}
      <div className="pt-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {t('Suspects in this Case Network (Click any card to inspect full history, bank & vehicle data):')}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {suspects.map((s) => (
            <button
              key={s.id}
              type="button"
              id={`btn-suspect-map-card-${s.id}`}
              onClick={() => onSelectSuspect(s)}
              className="p-2.5 rounded-xl bg-[#12141f] hover:bg-[#1a1e2d] border border-slate-800 hover:border-blue-500/60 text-left transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-6 h-6 rounded-lg bg-gradient-to-br ${
                    s.avatarBg || 'from-blue-600 to-indigo-800'
                  } text-white font-bold text-[10px] flex items-center justify-center shrink-0`}
                >
                  {s.codeName?.slice(0, 2)}
                </div>
                <span className="text-xs font-bold text-white group-hover:text-blue-400 truncate">
                  {s.codeName}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {s.legalName || s.alias || s.id}
              </div>
              <div className="text-[9px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span>{t('View Dossier →')}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
