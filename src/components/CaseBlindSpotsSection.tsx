import React, { useState } from 'react';
import {
  MapPinOff,
  AlertTriangle,
  Clock,
  Car,
  Camera,
  Layers,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  EyeOff,
  Compass,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { CaseRecord } from '../types';
import { getCaseBlindSpots, CaseBlindSpotItem } from '../data/caseBlindSpotsData';
import { useLanguage } from '../context/LanguageContext';

interface CaseBlindSpotsSectionProps {
  caseItem: CaseRecord;
}

export const CaseBlindSpotsSection: React.FC<CaseBlindSpotsSectionProps> = ({ caseItem }) => {
  const { t } = useLanguage();
  const blindSpots = getCaseBlindSpots(caseItem.id);
  const [selectedSpot, setSelectedSpot] = useState<CaseBlindSpotItem>(blindSpots[0]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'partial'>('all');

  const filteredSpots = blindSpots.filter((s) => {
    if (filter === 'critical') return s.risk === 'Critical';
    if (filter === 'partial') return s.surveillanceCoverage === 'Partial' || s.surveillanceCoverage === 'None';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Banner for this specific case */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <MapPinOff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {caseItem.id} {t('SURVEILLANCE GAPS')}
                </span>
                <span className="text-xs text-slate-400 font-medium">{t('Case-Specific Telemetry')}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                {t('Blind Spot & Surveillance Gap Analysis')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{blindSpots.length} {t('Blind Spots Detected')}</span>
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
              {t(caseItem.department || 'CID Cyber Command')}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t('Tactical analysis of unmonitored transit corridors, camera coverage deficits, and time gaps specific to')} <strong>{t(caseItem.title)}</strong>. {t('Tracks movements without optical surveillance coverage and suggests targeted intelligence collection actions.')}
        </p>
      </div>

      {/* Interactive Tactical Map Visual Representation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-extrabold text-white">
              {t('Tactical Surveillance Coverage Topology')} — {t(caseItem.title)}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t('Active CCTV')}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> {t('Unmonitored Blind Spot')}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {t('Critical Time Gap')}
            </span>
          </div>
        </div>

        {/* Tactical Canvas Representation */}
        <div className="relative w-full h-64 sm:h-72 bg-[#080b11] border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-4 select-none">
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Simulated corridor transit vector */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 60 180 Q 220 80 440 140 T 780 110"
              fill="none"
              stroke="url(#corridorGrad)"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Map Node Pins corresponding to this case */}
          <div className="relative z-10 w-full max-w-2xl h-full flex items-center justify-around">
            {blindSpots.map((spot) => {
              const isSelected = selectedSpot?.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className={`cursor-pointer group flex flex-col items-center transition-transform ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-lg transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-black ring-4 ring-amber-400/30'
                        : spot.risk === 'Critical'
                        ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-500/50'
                        : 'bg-slate-800 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white border border-slate-700 block truncate max-w-[130px]">
                      {spot.corridor.split('(')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400 block mt-0.5">
                      {spot.coverageGap.slice(0, 18)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 right-3 font-mono text-[10px] text-slate-400 bg-black/80 px-2 py-1 rounded border border-slate-800">
            {t('Sector Route')}: {t(caseItem.title)}
          </div>
        </div>
      </div>

      {/* Selected Blind Spot Detail & AI Tactical Recommendation */}
      {selectedSpot && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Detail Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-700/80 rounded-2xl p-5 text-white shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {selectedSpot.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedSpot.risk === 'Critical'
                        ? 'bg-red-500 text-black font-extrabold'
                        : 'bg-amber-400 text-black font-bold'
                    }`}
                  >
                    {selectedSpot.risk} RISK
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Coverage: {selectedSpot.surveillanceCoverage}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {selectedSpot.corridor}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Gap Gap</span>
                <span className="font-mono text-sm font-extrabold text-amber-400">
                  {selectedSpot.coverageGap}
                </span>
              </div>
            </div>

            {/* Suspect movement & Why identified */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  {t('Relevant Movement Without Camera Coverage')}:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {t(selectedSpot.relevantSuspectMovement)}
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  {t('Investigation Relevance & Tactical Impact')}:
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {t(selectedSpot.investigationRelevance)}
                </p>
              </div>
            </div>

            {/* Specific Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('Geographic Area')}</span>
                <span className="font-semibold text-white block mt-0.5 truncate">{selectedSpot.geographicArea}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('Vehicle Involved')}</span>
                <span className="font-mono font-bold text-amber-300 block mt-0.5 truncate">
                  {selectedSpot.vehicleInvolved || 'Unregistered'}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('Last Known Optical Ping')}</span>
                <span className="font-mono text-emerald-400 block mt-0.5 truncate">
                  {selectedSpot.lastKnownPing || 'None'}
                </span>
              </div>
            </div>

            {/* CCTV Deficit */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-red-400" />
                <span>{t('CCTV Availability Deficit')}:</span>
              </span>
              <p className="text-xs text-slate-300 font-medium">
                {t(selectedSpot.cctvAvailability)}
              </p>
            </div>
          </div>

          {/* AI Case Tactical Recommendation */}
          <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/60 rounded-2xl p-5 text-white shadow-lg space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {t('AI Investigative Directive')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                {t('Recommended Action for')} {selectedSpot.id}
              </h4>
              <p className="text-xs text-purple-100/90 leading-relaxed font-medium">
                {t(selectedSpot.recommendedAction)}
              </p>
            </div>

            <div className="pt-3 border-t border-purple-800/40 text-[11px] text-purple-300 font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{t('Next Point')}: {selectedSpot.nextConfirmedPing || 'Pending'}</span>
            </div>
          </div>
        </div>
      )}

      {/* List of All Identified Blind Spots for this Case */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-extrabold text-black flex items-center justify-between">
          <span>{t('Identified Case Blind Spots Ledger')} ({blindSpots.length})</span>
          <span className="text-xs font-normal text-slate-500">{t('Click row to inspect tactical telemetry')}</span>
        </h3>

        <div className="space-y-2">
          {blindSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                selectedSpot?.id === spot.id
                  ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    spot.risk === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <MapPinOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-black">{spot.id}</span>
                    <span className="text-xs font-bold text-slate-900">{spot.corridor}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        spot.risk === 'Critical' ? 'bg-red-600 text-white' : 'bg-amber-400 text-black'
                      }`}
                    >
                      {spot.risk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{spot.whyIdentified}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-auto">
                <div className="text-right font-mono">
                  <span className="font-bold text-black block">{spot.coverageGap}</span>
                  <span className="text-[10px] text-slate-500">{spot.surveillanceCoverage} Coverage</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
