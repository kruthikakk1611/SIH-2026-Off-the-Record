import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BlindSpotsViewProps {
  onNavigate?: (page: NavPage) => void;
}

export const BlindSpotsView: React.FC<BlindSpotsViewProps> = () => {
  const { t } = useLanguage();

  const blindSpots = [
    {
      id: 'BS-01',
      corridor: 'Route 4 Industrial Sector (Between Location A & Location B)',
      vehicle: 'Vehicle X (Black SUV)',
      gapTime: '28 minutes unrecorded',
      lastSeen: 'Location A Camera #12 (10:14 AM)',
      nextSeen: 'Location B Toll Point #4 (10:42 AM)',
      risk: 'Critical',
      action: 'Check secondary warehouse feeder cameras along Old Madras Rd.',
    },
    {
      id: 'BS-02',
      corridor: 'Outer Ring Road Sub-Corridor (Koramangala to Domlur)',
      vehicle: 'Vehicle Z (White Delivery Van)',
      gapTime: '15 minutes unrecorded',
      lastSeen: 'Intermediate Flyover South (23:10 PM)',
      nextSeen: 'Inner Sector Checkpoint (23:25 PM)',
      risk: 'Moderate',
      action: 'Request private retail footage at intersection 4B.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight">{t('Blind Spots')}</h1>
        <p className="text-sm text-slate-600 mt-0.5 font-medium">
          {t('Surveillance coverage gaps and transit telemetry blind spots along suspect travel routes.')}
        </p>
      </div>

      {/* Critical Alert Card - Tactical Red, Black & White Accent */}
      <div className="bg-white border-2 border-red-500 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            {t('CRITICAL RED-FLAG')}
          </span>
          <span className="font-extrabold text-black text-sm">
            {t('28-Minute Surveillance Gap Detected on Route 4')}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {t('Vehicle X entered an unmonitored industrial stretch between 10:14 AM and 10:42 AM. Expected transit duration is under 12 minutes. The 16-minute deficit indicates an unscheduled stop or cargo offloading at an unmonitored waypoint.')}
        </p>
      </div>

      {/* Corridor Records */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <h2 className="text-base font-extrabold text-black">{t('Detected Transit Gaps')}</h2>
        </div>

        {blindSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded shadow-xs">
                  {spot.id}
                </span>
                <h3 className="font-extrabold text-sm text-black">{t(spot.corridor)}</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold self-start sm:self-auto ${
                  spot.risk === 'Critical'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-black border border-slate-300'
                }`}
              >
                {t(spot.risk.toUpperCase())} {t('GAP')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-medium">{t('Target Vehicle')}:</span>
                <span className="font-bold text-black">{t(spot.vehicle)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-medium">{t('Unrecorded Duration')}:</span>
                <span className="font-mono font-bold text-black">{t(spot.gapTime)}</span>
              </div>
            </div>

            <div className="text-xs text-slate-700 pt-1">
              <span className="font-bold text-black">{t('Recommended Next Step')}: </span>
              <span className="text-slate-700">{t(spot.action)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
