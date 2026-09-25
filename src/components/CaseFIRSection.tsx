import React, { useState } from 'react';
import {
  FileText,
  Building,
  Calendar,
  Clock,
  Scale,
  User,
  ShieldCheck,
  Download,
  Eye,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CaseRecord } from '../types';
import { getCaseFIR, FIRDocument } from '../data/caseFIRData';
import { FIRViewModal } from './FIRViewModal';
import { useLanguage } from '../context/LanguageContext';

interface CaseFIRSectionProps {
  caseItem: CaseRecord;
}

export const CaseFIRSection: React.FC<CaseFIRSectionProps> = ({ caseItem }) => {
  const { t } = useLanguage();
  const fir: FIRDocument = getCaseFIR(caseItem.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = () => {
    const content = `GOVERNMENT OF KARNATAKA - STATE POLICE DEPARTMENT
FIRST INFORMATION REPORT (Under Section 154 Cr.P.C. / Sec 173 BNSS)
======================================================================
FIR Number: ${fir.firNumber}
Police Station: ${fir.policeStation}, District: ${fir.district}
Date & Time: ${fir.date} at ${fir.time}
Acts & Legal Provisions:
${fir.actsAndSections.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}

Incident Details:
- Date/Time: ${fir.incidentDetails.dateOfOccurrence}, ${fir.incidentDetails.timeOfOccurrence}
- Place of Occurrence: ${fir.incidentDetails.placeOfOccurrence}
- General Diary: ${fir.incidentDetails.generalDiaryReference}

Complainant: ${fir.complainant.name} (${fir.complainant.phone})
Statement Summary: "${fir.complainant.statementSummary}"

Case Description:
${fir.caseDescription}

Investigating Officer: ${fir.investigatingOfficer.name} (${fir.investigatingOfficer.rank}, ID: ${fir.investigatingOfficer.policeId})
Command Review: DGP Arjun Sharma, Director General of Police, Karnataka Command
======================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fir.caseId}-FIR-${fir.firNumber.replace(/\//g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500" />

        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                  {t('PRIMARY STATUTORY DOCUMENT')}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {t('Sec 154 CrPC / Sec 173 BNSS')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-black tracking-tight mt-0.5">
                {t('First Information Report (FIR)')} — {fir.firNumber}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              id="btn-view-complete-fir"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Open full legal FIR docket"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('View Full FIR')}</span>
            </button>

            <button
              type="button"
              id="btn-download-fir-document"
              onClick={handleDownload}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Download official FIR docket"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('Download FIR')}</span>
            </button>
          </div>
        </div>

        {/* Primary FIR Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
              <Building className="w-3 h-3 text-blue-600" />
              {t('Police Station')}
            </span>
            <span className="font-extrabold text-black block mt-1 truncate">
              {fir.policeStation}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">{fir.district}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              {t('Date of Occurrence')}
            </span>
            <span className="font-extrabold text-black block mt-1">
              {fir.date}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">{fir.time} IST</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
              <Scale className="w-3 h-3 text-blue-600" />
              {t('Acts & Sections')}
            </span>
            <span className="font-extrabold text-blue-700 block mt-1 truncate">
              {fir.actsAndSections[0]}
            </span>
            <span className="text-[10px] text-slate-500 block">
              +{fir.actsAndSections.length - 1} {t('Acts & Legal Provisions')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
              <User className="w-3 h-3 text-blue-600" />
              {t('Complainant')}
            </span>
            <span className="font-extrabold text-black block mt-1 truncate">
              {fir.complainant.name}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">{fir.complainant.phone}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {t('Investigating Officer')}
            </span>
            <span className="font-extrabold text-black block mt-1 truncate">
              {fir.investigatingOfficer.name}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              {fir.investigatingOfficer.rank}
            </span>
          </div>
        </div>

        {/* Brief Incident & Description Excerpt */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-black uppercase tracking-wider text-[11px]">
              {t('Incident Details')}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {fir.incidentDetails.dateOfOccurrence} ({fir.incidentDetails.timeOfOccurrence})
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium line-clamp-2 sm:line-clamp-3">
            {fir.caseDescription}
          </p>

          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">{t('Place of Occurrence')}: <strong>{fir.incidentDetails.placeOfOccurrence}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? t('Close') : t('Acts & Sections')}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Legal Sections */}
          {isExpanded && (
            <div className="pt-2.5 border-t border-slate-200 space-y-1.5 animate-in fade-in">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('Acts & Sections')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {fir.actsAndSections.map((sec, i) => (
                  <div key={i} className="p-2 bg-white rounded border border-slate-200 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-800 text-[11px]">{sec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Modal Viewer */}
      {isModalOpen && <FIRViewModal fir={fir} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
