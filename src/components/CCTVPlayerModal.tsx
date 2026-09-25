import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Download,
  Camera,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { CCTVEvidenceRecord } from '../data/caseCCTVData';
import { useLanguage } from '../context/LanguageContext';

interface CCTVPlayerModalProps {
  cctvRecord: CCTVEvidenceRecord;
  onClose: () => void;
}

export const CCTVPlayerModal: React.FC<CCTVPlayerModalProps> = ({ cctvRecord, onClose }) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [filterMode, setFilterMode] = useState<'standard' | 'night-vision' | 'high-contrast'>('standard');
  const [currentTimeSec, setCurrentTimeSec] = useState(22); // 00:22 / 04:32

  const handleDownloadMetadata = () => {
    const report = `${t('POLICE FORENSIC VIDEO LEDGER - CHAIN OF CUSTODY EXPORT')}
${t('Case ID')}: ${cctvRecord.caseId}
${t('Evidence ID')}: ${cctvRecord.id}
${t('Camera')}: ${cctvRecord.cameraName}
${t('Location')}: ${cctvRecord.location}
${t('Timestamp')}: ${cctvRecord.date} at ${cctvRecord.time}
${t('Status')}: ${cctvRecord.status}
${t('Resolution')}: ${cctvRecord.resolution} | ${t('Frame Rate')}: ${cctvRecord.frameRate}
SHA-256 Hash: ${cctvRecord.sha256Hash}
${t('Blockchain Custody Block')}: #${cctvRecord.blockchainBlock}
${t('Officer in Charge')}: ${cctvRecord.officerInCharge}
${t('Suspect Identified')}: ${cctvRecord.suspectIdentified || 'N/A'}
${t('Vehicle Identified')}: ${cctvRecord.vehicleIdentified || 'N/A'}
${t('Key Timestamp Findings')}: ${cctvRecord.keyTimestampTag}
${t('Forensic Observation')}: ${cctvRecord.findings}
${t('Storage Server Node')}: ${cctvRecord.storageServer}`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cctvRecord.id}-forensic-cctv-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b0e14] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#121622] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {cctvRecord.id}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t(cctvRecord.status)}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight mt-0.5 truncate max-w-xl">
                {cctvRecord.cameraName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-download-cctv-report"
              onClick={handleDownloadMetadata}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Export Forensic Dossier')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative bg-black flex flex-col items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[380px] select-none border-b border-slate-800">
          {/* Mock Video Feed Screen with visual filters */}
          <div
            className={`w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center relative p-4 transition-all duration-300 ${
              filterMode === 'night-vision'
                ? 'bg-emerald-950/40 contrast-125 hue-rotate-90'
                : filterMode === 'high-contrast'
                ? 'bg-slate-900 contrast-150 grayscale'
                : 'bg-gradient-to-b from-slate-950 via-slate-900 to-black'
            }`}
          >
            {/* Camera OSD Overlays */}
            <div className="absolute top-4 left-4 font-mono text-[11px] text-emerald-400 bg-black/70 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>{t('LIVE CAM FEED [ARCHIVED REPLAY]')}</span>
              <span className="text-slate-400">|</span>
              <span>{cctvRecord.date} {cctvRecord.time}</span>
            </div>

            <div className="absolute top-4 right-4 font-mono text-[11px] text-slate-300 bg-black/70 px-2.5 py-1 rounded border border-slate-700/60">
              FPS: {cctvRecord.frameRate} • {cctvRecord.resolution.split(' ')[0]}
            </div>

            {/* Visual Subject Representation */}
            <div className="relative w-72 h-44 border-2 border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center p-4 bg-slate-950/40">
              {showBoundingBox && (
                <div className="absolute -top-3 left-3 bg-emerald-500 text-black font-mono font-extrabold text-[10px] px-2 py-0.5 rounded shadow">
                  {t('AI TARGET DETECTED')}: {cctvRecord.suspectIdentified ? 'PERSON 91%' : t('VEHICLE DETECTED')}
                </div>
              )}
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-400/80 flex items-center justify-center text-emerald-300 font-bold font-mono">
                REC
              </div>
              <p className="text-center font-mono text-xs text-slate-200 mt-2 font-semibold">
                {cctvRecord.vehicleIdentified || 'Vehicle X (KA-04-XX-1102)'}
              </p>
              <span className="text-[10px] font-mono text-emerald-400">
                {cctvRecord.keyTimestampTag}
              </span>
            </div>

            {/* Watermark Hash */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-500 bg-black/60 px-2 py-0.5 rounded">
              SHA-256: {cctvRecord.sha256Hash.slice(0, 24)}...
            </div>
          </div>

          {/* Video Control Bar */}
          <div className="w-full bg-[#11141e] border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setCurrentTimeSec(0)}
                title={t('Restart playback')}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-xs text-slate-300 ml-1">
                00:{currentTimeSec < 10 ? `0${currentTimeSec}` : currentTimeSec} / {cctvRecord.duration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback speed */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer transition-colors ${
                      playbackSpeed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Filter mode */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setFilterMode('standard')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    filterMode === 'standard' ? 'bg-slate-700 text-white' : 'text-slate-400'
                  }`}
                >
                  RGB
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('night-vision')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    filterMode === 'night-vision' ? 'bg-emerald-700 text-white' : 'text-slate-400'
                  }`}
                >
                  IR Night
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('high-contrast')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    filterMode === 'high-contrast' ? 'bg-slate-700 text-white' : 'text-slate-400'
                  }`}
                >
                  Contrast
                </button>
              </div>

              {/* Bounding box toggle */}
              <button
                type="button"
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  showBoundingBox
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {t('AI Markers')}: {showBoundingBox ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Metadata & Analysis Details */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#0e111a] text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">{t('Camera & Hardware')}</span>
              <span className="font-bold text-white block mt-0.5">{cctvRecord.cameraModel}</span>
              <span className="text-slate-400 text-[11px] block">{cctvRecord.lensType}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">{t('Location & Landmark')}</span>
              <span className="font-bold text-white block mt-0.5 truncate">{cctvRecord.location}</span>
              <span className="text-blue-400 text-[11px] block">{t('Related')}: {cctvRecord.relatedLocation}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">{t('Forensic Custody Ledger')}</span>
              <span className="font-mono text-emerald-400 text-[11px] block truncate mt-0.5">
                {t('Block')} #{cctvRecord.blockchainBlock} ({t('Tamper-Proof')})
              </span>
              <span className="text-slate-400 text-[10px] block">{t('Verified by')}: {cctvRecord.officerInCharge}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('Forensic Video Observation & Findings:')}</span>
            </span>
            <p className="text-slate-300 leading-relaxed font-medium">
              {cctvRecord.description}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-400">
                {t('Identified Target')}: <strong className="text-white">{cctvRecord.suspectIdentified || 'N/A'}</strong>
              </span>
              <span className="font-mono text-slate-400">
                {t('Server Archive')}: {cctvRecord.storageServer}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
