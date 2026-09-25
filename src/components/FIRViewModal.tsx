import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  Shield,
  Building,
  Calendar,
  Scale,
  CheckCircle2,
  Check,
  FileType,
} from 'lucide-react';
import { FIRDocument } from '../data/caseFIRData';
import { useLanguage } from '../context/LanguageContext';
import { downloadCaseFIR } from '../utils/firDownloader';

interface FIRViewModalProps {
  fir: FIRDocument;
  onClose: () => void;
}

export const FIRViewModal: React.FC<FIRViewModalProps> = ({ fir, onClose }) => {
  const { t } = useLanguage();
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'txt'>('pdf');
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const handleDownloadFormat = async (format: 'pdf' | 'txt') => {
    setDownloadFormat(format);
    await downloadCaseFIR(fir.caseId, format);
    setDownloadStatus(format === 'pdf' ? t('Downloaded as PDF') : t('Downloaded as Text'));
    setTimeout(() => setDownloadStatus(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in border border-slate-300">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {fir.caseId}
                </span>
                <span className="text-xs font-extrabold text-white uppercase tracking-wide">
                  {t('STATUTORY POLICE FIR PREVIEW')}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight mt-0.5 truncate">
                {fir.firNumber}
              </h2>
            </div>
          </div>

          {/* Download Options & Print Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                type="button"
                id="btn-format-pdf"
                onClick={() => handleDownloadFormat('pdf')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  downloadFormat === 'pdf'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Download FIR in PDF document format"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('Download PDF')}</span>
              </button>

              <button
                type="button"
                id="btn-format-txt"
                onClick={() => handleDownloadFormat('txt')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  downloadFormat === 'txt'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Download FIR in standard Text (.txt) format"
              >
                <FileType className="w-3.5 h-3.5" />
                <span>{t('Download Text (.txt)')}</span>
              </button>
            </div>

            <button
              type="button"
              id="btn-modal-print-fir"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Print document or Save via Browser Print Dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Print')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadStatus && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-2 shadow-xs transition-all">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{downloadStatus} — {fir.caseId}</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">{fir.firNumber}</span>
          </div>
        )}

        {/* Scrollable Printable Document Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-50 space-y-6 text-slate-900 font-sans text-xs print:p-0 print:bg-white">
          {/* Official Letterhead Header */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs text-center space-y-2 relative">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-blue-900" />
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-wide uppercase">
                  {t('Government of Karnataka • Police Department')}
                </h1>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {t('Criminal Investigation Department (CID) / State Police')}
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-slate-800 my-2" />
            <h2 className="text-sm font-extrabold text-blue-900 tracking-wider uppercase">
              {t('First Information Report (F.I.R.)')}
            </h2>
            <p className="text-[11px] text-slate-600 font-medium">
              {t('(Under Section 154 of the Code of Criminal Procedure / Section 173 Bharatiya Nagarik Suraksha Sanhita, 2023)')}
            </p>
          </div>

          {/* Section 1 & 2: PS Details & Legal Provisions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">1. {t('District')}</span>
                <span className="font-extrabold text-slate-900 text-xs">{fir.district}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">2. {t('Police Station')}</span>
                <span className="font-extrabold text-slate-900 text-xs">{fir.policeStation}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">3. {t('FIR Number')}</span>
                <span className="font-mono font-extrabold text-blue-800 text-xs">{fir.firNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">4. {t('Date & Time Logged')}</span>
                <span className="font-bold text-slate-900 text-xs">{fir.date} at {fir.time}</span>
              </div>
            </div>

            {/* Applicable Acts and Sections */}
            <div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-700" />
                <span>{t('Acts and Sections Applied:')}</span>
              </span>
              <div className="space-y-1.5 pl-2">
                {fir.actsAndSections.map((sec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{sec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Occurrence of Offence & General Diary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-700" />
              <span>{t('Occurrence of Offence & Occurrence Details')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Date of Occurrence')}</span>
                <span className="font-bold text-slate-900">{fir.incidentDetails.dateOfOccurrence}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Time of Occurrence')}</span>
                <span className="font-bold text-slate-900">{fir.incidentDetails.timeOfOccurrence}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('General Diary Reference')}</span>
                <span className="font-bold text-slate-900">{fir.incidentDetails.generalDiaryReference}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Place of Occurrence')}</span>
                <span className="font-bold text-slate-900">{fir.incidentDetails.placeOfOccurrence}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Distance & Direction from P.S.')}</span>
                <span className="font-bold text-slate-900">{fir.incidentDetails.distanceAndDirectionFromPS} (Beat: {fir.incidentDetails.beatNo})</span>
              </div>
            </div>
          </div>

          {/* Section 4: Complainant Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-700" />
              <span>{t('Complainant / Informant Information')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Complainant Full Name')}</span>
                <span className="font-extrabold text-slate-900">{fir.complainant.name}</span>
                {fir.complainant.occupation && (
                  <span className="text-slate-600 text-[11px] block mt-0.5">{fir.complainant.occupation}</span>
                )}
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">{t('Contact & Address')}</span>
                <span className="font-bold text-slate-900">{fir.complainant.phone}</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">{fir.complainant.address}</span>
              </div>
            </div>
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                {t("Complainant's Recorded Statement:")}
              </span>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                "{fir.complainant.statementSummary}"
              </p>
            </div>
          </div>

          {/* Section 5: Case Description */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {t('Case Description & Police Incident Findings')}
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {fir.caseDescription}
            </p>
          </div>

          {/* Section 6: Suspects Named in FIR */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {t('Suspects / Accused Named in Docket')}
            </h3>
            <div className="space-y-1.5 pl-2">
              {fir.suspectsNamedInFIR.map((sus, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <span>{sus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t-2 border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Registered By:')}</span>
              <div className="font-extrabold text-slate-900">{fir.investigatingOfficer.name}</div>
              <div className="text-[11px] text-slate-600">{fir.investigatingOfficer.rank}</div>
              <div className="font-mono text-[10px] text-blue-800">{t('Police ID')}: {fir.investigatingOfficer.policeId}</div>
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Supervisory Command Endorsement:')}</span>
              <div className="font-extrabold text-slate-900">DGP Arjun Sharma</div>
              <div className="text-[11px] text-slate-600">{t('Director General of Police, Karnataka Command')}</div>
              <div className="font-mono text-[10px] text-emerald-700 flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('Statutory FIR Clearance Verified')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Format Options Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 font-medium">
            {t('Select export format to save official statutory copy')}:
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-footer-download-pdf"
              onClick={() => handleDownloadFormat('pdf')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('Save as PDF')}</span>
            </button>
            <button
              type="button"
              id="btn-footer-download-txt"
              onClick={() => handleDownloadFormat('txt')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <FileType className="w-3.5 h-3.5" />
              <span>{t('Save as Text (.txt)')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
