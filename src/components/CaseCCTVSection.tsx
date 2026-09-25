import React, { useState } from 'react';
import {
  Camera,
  Play,
  Download,
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Eye,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { CaseRecord } from '../types';
import { getCaseCCTVEvidence, CCTVEvidenceRecord } from '../data/caseCCTVData';
import { CCTVPlayerModal } from './CCTVPlayerModal';
import { useLanguage } from '../context/LanguageContext';

interface CaseCCTVSectionProps {
  caseItem: CaseRecord;
}

export const CaseCCTVSection: React.FC<CaseCCTVSectionProps> = ({ caseItem }) => {
  const { t } = useLanguage();
  const records = getCaseCCTVEvidence(caseItem.id);
  const [selectedRecord, setSelectedRecord] = useState<CCTVEvidenceRecord | null>(null);

  const handleDownloadFootage = (rec: CCTVEvidenceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const manifest = `CCTV EVIDENCE FORENSIC FOOTAGE MANIFEST
Case ID: ${rec.caseId}
Evidence ID: ${rec.id}
Camera Name: ${rec.cameraName}
Model: ${rec.cameraModel}
Location: ${rec.location}
Date & Time: ${rec.date} ${rec.time}
Resolution: ${rec.resolution} | FPS: ${rec.frameRate}
SHA-256 Hash: ${rec.sha256Hash}
Custody Block: #${rec.blockchainBlock}
Officer: ${rec.officerInCharge}
Server Node: ${rec.storageServer}`;

    const blob = new Blob([manifest], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rec.id}-cctv-footage-archive.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-black tracking-tight">
                {t('Case Optical & CCTV Evidence Feeds')}
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-900 text-white">
                {records.length} {t('FEEDS LINKED')}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t('Corroborated optical surveillance records with tamper-proof blockchain hashes.')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((rec) => (
          <div
            key={rec.id}
            onClick={() => setSelectedRecord(rec)}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/80 rounded-xl p-4 text-white space-y-3 cursor-pointer transition-all shadow-md group"
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {rec.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {rec.status}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white mt-1 group-hover:text-blue-300 transition-colors">
                  {rec.cameraName}
                </h4>
              </div>

              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded shrink-0">
                {rec.duration}
              </span>
            </div>

            {/* Video Preview Thumbnail Mock */}
            <div className="relative w-full h-32 bg-black rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute top-2 left-2 font-mono text-[9px] text-emerald-400 bg-black/80 px-2 py-0.5 rounded">
                REC • {rec.time}
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[9px] text-slate-400 bg-black/80 px-2 py-0.5 rounded">
                {rec.resolution.split(' ')[0]}
              </div>
            </div>

            {/* Location & Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2 rounded">
                <span className="text-[9px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" /> {t('Location')}
                </span>
                <span className="font-semibold text-slate-200 block truncate mt-0.5">{rec.location}</span>
                <span className="text-[10px] text-slate-400 truncate block">Related: {rec.relatedLocation}</span>
              </div>

              <div className="bg-slate-800/80 p-2 rounded">
                <span className="text-[9px] text-slate-400 uppercase font-bold block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" /> {t('Timestamp')}
                </span>
                <span className="font-semibold text-slate-200 block mt-0.5">{rec.date}</span>
                <span className="text-[10px] font-mono text-slate-400 block">{rec.time} IST</span>
              </div>
            </div>

            {/* Description Excerpt */}
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
              {rec.description}
            </p>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-[10px] font-mono text-emerald-400 truncate">
                Hash: {rec.sha256Hash.slice(0, 16)}...
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleDownloadFootage(rec, e)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Download forensic footage"
                >
                  <Download className="w-3 h-3" />
                  <span>{t('Download')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>{t('Play Feed')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CCTV Player Modal */}
      {selectedRecord && (
        <CCTVPlayerModal
          cctvRecord={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
};
