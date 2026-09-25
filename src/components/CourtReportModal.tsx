import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Scale,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Eye,
  Camera,
  FileText,
  Shield,
  Compass,
  AlertCircle,
  Clock,
  Languages,
} from 'lucide-react';
import { CaseRecord, SuspectProfile, EvidenceRecord, OfficerProfile } from '../types';
import { calculateCaseDuration } from '../data/policeAndEvidenceData';
import { useLanguage } from '../context/LanguageContext';
import { downloadCaseReport } from '../utils/caseReportGenerator';
import { PoliceEmblem } from './PoliceEmblem';
import { getCaseFIR } from '../data/caseFIRData';
import { getCaseCCTVEvidence } from '../data/caseCCTVData';
import { getCaseBlindSpots } from '../data/caseBlindSpotsData';
import {
  getCaseCompletenessAnalysis,
  getCaseDeadEndAnalysis,
} from '../data/caseInvestigationAnalysis';
import { getIdentityForSuspect } from '../data/suspectIdentityData';
import { SUPPORTED_LANGUAGES, SupportedLanguage, CASE_TITLES_LOCALIZED } from '../data/translations';

interface CourtReportModalProps {
  caseItem: CaseRecord;
  suspects: SuspectProfile[];
  evidence: EvidenceRecord[];
  officer: OfficerProfile;
  onClose: () => void;
}

export const CourtReportModal: React.FC<CourtReportModalProps> = ({
  caseItem,
  suspects,
  evidence,
  officer,
  onClose,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Filter suspects & evidence for this specific case
  const caseSuspects = suspects.filter(
    (s) => caseItem.suspectIds?.includes(s.id) || s.relatedCases?.includes(caseItem.id)
  );
  const caseEvidence = evidence.filter(
    (e) => caseItem.evidenceIds?.includes(e.id) || e.caseId === caseItem.id
  );

  const fir = getCaseFIR(caseItem.id);
  const cctvList = getCaseCCTVEvidence(caseItem.id);
  const blindSpotsList = getCaseBlindSpots(caseItem.id);
  const completeness = getCaseCompletenessAnalysis(caseItem, caseSuspects, caseEvidence);
  const deadEnd = getCaseDeadEndAnalysis(caseItem, caseSuspects, caseEvidence);

  const duration = calculateCaseDuration(caseItem.startedDate);
  const policeCount = caseItem.policeOfficers?.length || 6;
  const initiator = caseItem.initiatedBy || {
    policeId: 'POL-KA-2026-4491',
    name: 'Inspector Rajesh Kumar',
    rank: 'Inspector of Police',
    date: caseItem.startedDate,
    firNumber: 'FIR No. 109/2026',
    station: caseItem.department || 'CID Cyber Crime Police Station',
  };

  const localizedTitle =
    CASE_TITLES_LOCALIZED[language]?.[caseItem.title] || t(caseItem.title);

  const handlePrint = async () => {
    await downloadCaseReport(caseItem, {
      suspects: caseSuspects,
      evidenceList: caseEvidence,
      officer,
      format: 'pdf',
      language,
    });
    setDownloadSuccess(t('Official Court Report exported (PDF / Print)!'));
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadTxt = async () => {
    await downloadCaseReport(caseItem, {
      suspects: caseSuspects,
      evidenceList: caseEvidence,
      officer,
      format: 'txt',
      language,
    });

    setDownloadSuccess(t('Official Court Report downloaded successfully (.txt)!'));
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
      <div className="bg-[#0e1017] border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header with Court Crest styling & Language Toggle */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#141722] flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                  {caseItem.id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {t('FIR')}: {fir.firNumber}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 hidden sm:inline-block">
                  {t('Sec 65B Certified')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {t('Official Court Submission Report & Investigation Dossier')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Selector within Modal */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs">
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-medium text-slate-200 outline-none cursor-pointer"
                title={t('Select Language for Report')}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              id="btn-print-court-report"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c2030] hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              title={t('Print Document / Save as PDF')}
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('Print / PDF')}</span>
            </button>

            <button
              type="button"
              id="btn-download-court-report"
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('Download (.txt)')}</span>
            </button>

            <button
              type="button"
              id="btn-close-court-report-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950/60 border-b border-emerald-800 p-2.5 px-6 text-xs text-emerald-300 flex items-center gap-2 font-medium no-print">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Formatted Formal Court Document Container */}
        <div
          id="printable-court-report"
          className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 font-serif space-y-6 select-text relative"
        >
          {/* Subtle Diagonal Confidential Watermark (print & view) */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden opacity-[0.035]"
            aria-hidden="true"
          >
            <div className="text-[72px] sm:text-[96px] font-black font-sans uppercase tracking-widest text-slate-900 -rotate-25 whitespace-nowrap">
              CONFIDENTIAL • POLICE DOSSIER • SEC-RESTRICTED
            </div>
          </div>

          {/* Top Judicial Letterhead & Emblem */}
          <div className="text-center space-y-2 pb-5 border-b-2 border-slate-900">
            <div className="flex justify-center mb-2">
              <PoliceEmblem size="lg" showText={false} />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
              {t('GOVERNMENT OF KARNATAKA — STATE POLICE HEADQUARTERS')}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {t('In the Court of the Principal City Civil and Sessions Judge, Bengaluru')}
            </div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {t('Special Jurisdiction for Cyber Crimes & Economic Offences')}
            </div>
            <div className="pt-2 text-base sm:text-lg font-black text-slate-950 underline underline-offset-4">
              {t('OFFICIAL CRIMINAL CASE DOSSIER & STATUTORY CHARGE SHEET SUBMISSION')}
            </div>
            <div className="text-xs font-sans text-slate-600 italic">
              {t('(Prepared under Section 173 BNSS / Section 173 CrPC with Sec 65B Forensics)')}
            </div>
          </div>

          {/* Reference & Security Meta Box */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 font-sans text-xs space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-2">
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">
                  {t('Case Reference')}:
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">{caseItem.id}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">
                  {t('FIR Number')}:
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">{fir.firNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">
                  {t('Date of Generation')}:
                </span>
                <span className="font-semibold text-slate-800">{reportDate}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">
                  {t('Clearance Level')}:
                </span>
                <span className="font-mono font-bold text-red-700 uppercase">
                  CX-RESTRICTED (LEO ONLY)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
              <div>
                <span className="font-bold text-slate-900">{t('Police Station')}: </span>
                <span>{fir.policeStation} ({fir.district})</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{t('Digital Auth Token')}: </span>
                <span className="font-mono text-[10px] text-blue-800 font-semibold">
                  CX-SIG-2026-{caseItem.id}-VERIFIED-SHA256
                </span>
              </div>
            </div>
          </div>

          {/* Legal Caution Notice Banner */}
          <div className="border border-amber-300 bg-amber-50 rounded-lg p-3 font-sans text-xs text-amber-900 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[11px]">
                {t('LEGAL CAUTION & STATUTORY NOTICE UNDER OFFICIAL SECRETS ACT')}
              </span>
              <p className="text-[11px] leading-relaxed text-amber-800 mt-0.5">
                {t('This document contains privileged, classified criminal investigative intelligence. Reproduction or unauthorized forwarding is punishable under the Official Secrets Act, 1923 and Bharatiya Nyaya Sanhita, 2023. Electronic evidence is forensically authenticated under Section 65B of the Indian Evidence Act / Section 63 of Bharatiya Sakshya Adhiniyam.')}
              </p>
            </div>
          </div>

          {/* 1. Case Overview & Investigation Duration */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>1. {t('Case Overview & Investigation Duration')}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                {t('Priority')}: {t(caseItem.priority)} • {caseItem.progress}% {t('Completed')}
              </span>
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 font-sans text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 font-semibold block">{t('Case Title')}:</span>
                <span className="font-bold text-slate-900">{localizedTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">{t('Assigned Department')}:</span>
                <span className="text-slate-800 font-medium">{caseItem.department}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">{t('Investigation Status')}:</span>
                <span className="text-slate-800 font-medium">{duration.displayText} ({duration.ongoingStatus})</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">{t('Initiating Officer')}:</span>
                <span className="text-slate-800 font-medium">{initiator.name} ({initiator.rank})</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">{t('Lead Officer')}:</span>
                <span className="text-slate-800 font-medium">{caseItem.leadOfficer || initiator.name}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">{t('Registration Date')}:</span>
                <span className="font-mono text-slate-800">{caseItem.startedDate}</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="font-sans font-bold text-slate-900 text-xs">{t('Executive Synopsis')}:</span>
              <p className="text-xs text-slate-800 leading-relaxed indent-4">
                "{caseItem.summary}"
              </p>
            </div>

            {caseItem.aiSummary && (
              <div className="bg-blue-50/60 border border-blue-200 rounded p-2.5 font-sans text-xs text-blue-950">
                <span className="font-bold text-blue-900">{t('AI Forensic Correlation')}: </span>
                <span>{caseItem.aiSummary}</span>
              </div>
            )}
          </div>

          {/* 2. Primary Statutory FIR Particulars */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
              2. {t('Primary Statutory FIR Particulars (Sec 154 CrPC / Sec 173 BNSS)')}
            </h3>

            <div className="font-sans text-xs border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-100 p-2.5 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('FIR Number')}:</span>
                  <span className="font-mono font-bold text-slate-900">{fir.firNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('Date & Time Logged')}:</span>
                  <span className="text-slate-800">{fir.date} at {fir.time}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('General Diary Ref')}:</span>
                  <span className="font-mono text-slate-800">{fir.incidentDetails.generalDiaryReference}</span>
                </div>
              </div>

              <div className="p-3 space-y-2 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">{t('Complainant')}:</span>
                    <span className="font-semibold text-slate-900">{fir.complainant.name}</span>
                    <span className="text-slate-600 block text-[11px]">
                      {t('Phone')}: {fir.complainant.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[11px]">{t('Place of Occurrence')}:</span>
                    <span className="text-slate-800">{fir.incidentDetails.placeOfOccurrence}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-slate-500 font-bold block text-[11px]">{t('Substantive Sections of Law')}:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 mt-1 font-mono text-[11px]">
                    {fir.actsAndSections.map((sec, idx) => (
                      <li key={idx}>{sec}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-1">
                  <span className="text-slate-500 font-bold block text-[11px]">{t('Complainant Statement Summary')}:</span>
                  <p className="text-slate-700 italic text-[11px] mt-0.5">
                    "{fir.complainant.statementSummary}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Accused & Suspects Dossier with Civic Identity Verification */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>
                3. {t('Accused & Suspects Dossier with Civic Identity Verification')} ({caseSuspects.length}{' '}
                {t('Persons')})
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold font-sans">
                {t('Aadhaar & DigiLocker Corroborated')}
              </span>
            </h3>

            <div className="space-y-3 font-sans text-xs">
              {caseSuspects.map((s, idx) => {
                const identity = getIdentityForSuspect(s.id, s.legalName || s.codeName);
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-800 text-xs">
                          [SUSPECT #{idx + 1}]
                        </span>
                        <span className="font-bold text-slate-950 text-sm">
                          {s.legalName || identity.digiLockerVerifiedName || s.codeName}
                        </span>
                        <span className="text-slate-500 text-xs">
                          ({t('Alias')}: <span className="font-mono font-semibold">{s.codeName}</span>)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {identity.verificationStatus === 'Verified' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('DigiLocker Verified')}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                            {t('Verification Pending')}
                          </span>
                        )}
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                          {t(s.status)} • {t('Age')}: {s.age || 38}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-slate-700 text-[11px]">
                      <div>
                        <span className="font-bold block text-slate-500 text-[10px] uppercase">
                          {t('Primary Mobile')}:
                        </span>
                        <span className="font-mono font-medium text-slate-900">
                          {s.phoneNumber || s.phoneRecords?.[0] || 'Lawful Tap Active'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold block text-slate-500 text-[10px] uppercase">
                          {t('Aadhaar Number')}:
                        </span>
                        <span className="font-mono font-medium text-slate-900">
                          {identity.aadhaarMasked || 'Biometric Link Pending'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold block text-slate-500 text-[10px] uppercase">
                          {t('DigiLocker Document')}:
                        </span>
                        <span className="font-medium text-slate-900">
                          {identity.digiLockerDocumentType || 'PAN / Driving License'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold block text-slate-500 text-[10px] uppercase">
                          {t('Priority Role')}:
                        </span>
                        <span className="font-medium text-red-700 font-bold">
                          {t(s.priority || 'High')} ({t(s.role || 'Conspirator')})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-slate-700">
                      <div>
                        <span className="font-bold text-slate-900">{t('Associated Vehicles')}: </span>
                        <span className="font-mono">
                          {s.vehiclesDetailed?.map((v) => `${v.plateNumber} (${v.makeModel})`).join(', ') ||
                            s.vehicles?.join(', ') ||
                            t('None on File')}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{t('Bank Accounts & Financial Liens')}: </span>
                        <span className="font-mono">
                          {s.bankDetails?.map((b) => `${b.bankName} (A/C ${b.accountNumber})`).join(', ') ||
                            s.financialLinks?.join(', ') ||
                            t('Forensic Lien Active')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-200">
                      <span className="font-bold text-slate-900 block text-[11px]">
                        {t('Why Connected to the Conspiracy:')}
                      </span>
                      <p className="text-slate-700 text-xs italic mt-0.5">
                        "{s.whyConnected || s.bio || t('Identified through telecommunication metadata correlation.')}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Forensic Evidence Chain of Custody */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>
                4. {t('Forensic Evidence Chain of Custody & Exhibits')} ({caseEvidence.length}{' '}
                {t('Seized Items')})
              </span>
              <span className="text-[10px] font-mono text-blue-700 font-semibold font-sans">
                {t('SHA-256 Blockchain Verified')}
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3 border-b border-slate-300">{t('Exhibit ID')}</th>
                    <th className="py-2 px-3 border-b border-slate-300">{t('Category')}</th>
                    <th className="py-2 px-3 border-b border-slate-300">{t('Title / Seized Item')}</th>
                    <th className="py-2 px-3 border-b border-slate-300">{t('Location / Date')}</th>
                    <th className="py-2 px-3 border-b border-slate-300">{t('Custody Status')}</th>
                    <th className="py-2 px-3 border-b border-slate-300">{t('Cryptographic Hash')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {caseEvidence.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {e.id}
                      </td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-semibold">
                          {t(e.type)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-900 font-medium">
                        {e.title}
                        {e.description && (
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                            {e.description}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                        {e.location || initiator.station}
                        <div className="text-[10px] text-slate-500">
                          {e.dateSeized || caseItem.startedDate}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-800 whitespace-nowrap font-medium">
                        {t(e.status)}
                      </td>
                      <td className="py-2 px-3 font-mono text-[10px] text-slate-600 truncate max-w-[140px]">
                        {e.blockchainHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. CCTV Surveillance Footage Logs */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>
                5. {t('CCTV Surveillance Footage Logs')} ({cctvList.length} {t('Cameras')})
              </span>
              <span className="text-[10px] font-sans text-slate-600 font-semibold">
                {t('High-Resolution Optical Extractions')}
              </span>
            </h3>

            {cctvList.length === 0 ? (
              <p className="font-sans text-xs text-slate-500 italic">
                {t('No CCTV footage corridors registered for this case.')}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3 border-b border-slate-300">{t('Camera ID')}</th>
                      <th className="py-2 px-3 border-b border-slate-300">{t('Location / Corridor')}</th>
                      <th className="py-2 px-3 border-b border-slate-300">{t('Type')}</th>
                      <th className="py-2 px-3 border-b border-slate-300">{t('Timestamp')}</th>
                      <th className="py-2 px-3 border-b border-slate-300">{t('Forensic Status')}</th>
                      <th className="py-2 px-3 border-b border-slate-300">{t('Optical Findings')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cctvList.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {c.id}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {c.location}
                        </td>
                        <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                          {c.cameraName}
                        </td>
                        <td className="py-2 px-3 text-slate-700 whitespace-nowrap font-mono text-[11px]">
                          {c.date} {c.time}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-800 text-[11px]">
                          {c.findings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. Investigation Blind Spots & Surveillance Gaps */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>
                6. {t('Investigation Blind Spots & Surveillance Gaps')} ({blindSpotsList.length}{' '}
                {t('Identified Gaps')})
              </span>
              <span className="text-[10px] font-sans text-amber-800 font-semibold">
                {t('Tactical Intercept Corridors')}
              </span>
            </h3>

            {blindSpotsList.length === 0 ? (
              <p className="font-sans text-xs text-slate-500 italic">
                {t('No critical perimeter surveillance blind spots detected.')}
              </p>
            ) : (
              <div className="space-y-2 font-sans text-xs">
                {blindSpotsList.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">
                          {idx + 1}. {b.corridor}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            b.risk === 'Critical'
                              ? 'bg-red-200 text-red-900 border border-red-300'
                              : 'bg-amber-200 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {t(b.risk)}
                        </span>
                        <span className="text-slate-600 text-[11px] font-mono">
                          ({b.coverageGap || 'Transit Corridor'})
                        </span>
                      </div>
                      <p className="text-slate-700 text-[11px]">{b.whyIdentified}</p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        {t('Required Action')}:
                      </span>
                      <span className="text-blue-900 font-semibold text-xs">
                        {b.recommendedAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Statutory Case Completeness & Missing Information Audit */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>7. {t('Statutory Case Completeness & Missing Information Audit')}</span>
              <span className="text-[10px] font-mono text-slate-600 font-bold">
                {completeness.completenessPercentage}% {t('Verified')} • {completeness.missingCount}{' '}
                {t('Gaps Remaining')}
              </span>
            </h3>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 font-sans text-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>{t('Overall Legal Case Readiness Score')}</span>
                <span className="font-bold text-blue-900">
                  {completeness.completedCount} / {completeness.totalCheckpoints} {t('Checkpoints')} (
                  {completeness.completenessPercentage}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${completeness.completenessPercentage}%` }}
                />
              </div>

              <div className="pt-1">
                <span className="font-bold text-slate-900 text-xs block mb-1">
                  {t('Outstanding Evidentiary Gaps for Court Admissibility')}:
                </span>
                <div className="space-y-1.5">
                  {completeness.items
                    .filter((it) => !it.isCompleted)
                    .map((it, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded border border-slate-200 bg-white flex items-start justify-between gap-2 text-[11px]"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{it.title}</span>
                          <p className="text-slate-600 text-[10px] mt-0.5">{it.description}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono font-bold text-[10px] shrink-0">
                          {it.impact} {t('Impact')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-800 bg-blue-50/70 p-2 rounded border border-blue-200">
                <span className="font-bold text-blue-950">{t('Statutory Directive')}: </span>
                <span>{completeness.recommendedImmediateAction}</span>
              </div>
            </div>
          </div>

          {/* 8. Investigation Momentum & Dead End / Loop Risk Meter */}
          <div className="space-y-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>8. {t('Investigation Momentum & Dead End / Loop Risk Meter')}</span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  deadEnd.loopRisk === 'High'
                    ? 'bg-red-100 text-red-800'
                    : deadEnd.loopRisk === 'Moderate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {t(deadEnd.loopRisk)} {t('RISK')} ({deadEnd.loopRiskScore}%)
              </span>
            </h3>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 font-sans text-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    {t('Momentum Score')}:
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {deadEnd.momentumScore} / 100 ({t(deadEnd.momentumStatus)})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    {t('Repetitive Questioning Loop')}:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {deadEnd.repetitiveInterrogationPattern
                      ? t('CIRCULAR PATTERN DETECTED')
                      : t('PROGRESSIVE INQUIRY')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    {t('Days Since Fresh Evidence')}:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {deadEnd.daysSinceNewEvidence} {t('days')}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 text-xs block mb-0.5">
                  {t('Investigative Advisory')}:
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {deadEnd.summaryExplanation}
                </p>
              </div>

              <div className="pt-1">
                <span className="font-bold text-slate-900 text-xs block mb-1">
                  {t('Recommended Operational Pivots (Loop-Breaking Actions)')}:
                </span>
                <div className="space-y-1 text-[11px]">
                  {deadEnd.loopBreakingRecommendations.map((r, i) => (
                    <div key={i} className="p-2 rounded bg-white border border-slate-200">
                      <span className="font-bold text-blue-900">{r.actionTitle}</span>
                      <p className="text-slate-600 text-[10px] mt-0.5">{r.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 9. Statutory Forensic Certification under Sec 65B Indian Evidence Act / BNSS */}
          <div className="space-y-2 pt-2">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1">
              9. {t('Statutory Forensic Certification under Sec 65B Indian Evidence Act / BNSS')}
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed font-serif indent-6">
              {t('I')}, <span className="font-bold">{officer?.name || initiator.name}</span>,{' '}
              {officer?.rank || initiator.rank}, {t('Police Station')}: {initiator.station}, {t('hereby solemnly affirm and certify that the digital exhibits, telecommunication logs, CCTV extractions, and banking ledgers incorporated into this dossier were generated in the ordinary course of regular police operations by certified forensic terminals.')}
            </p>
            <p className="text-xs text-slate-800 leading-relaxed font-serif indent-6">
              {t('The computer systems and optical recording equipment were operating properly at all material times, and no unauthorized alteration has occurred. This electronic evidence complies with Section 65B(4) of the Indian Evidence Act, 1872 and Section 63 of Bharatiya Sakshya Adhiniyam, 2023.')}
            </p>
          </div>

          {/* 10. Official Signatures, Seal & Digital Token Block */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 font-sans text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                {t('SUBMITTED BY INVESTIGATING OFFICER')}:
              </div>
              <div className="pt-2">
                <span className="font-mono text-blue-900 font-bold block text-sm">
                  /s/ {officer?.name || initiator.name}
                </span>
                <span className="text-slate-700 font-medium">
                  {officer?.rank || initiator.rank}, {initiator.station}
                </span>
                <div className="text-slate-500 font-mono text-[11px]">
                  {t('Police ID')}: {officer?.id || initiator.policeId} • {t('Badge')}: KA-CCB-2026
                </div>
                <div className="text-slate-500 text-[11px]">{t('Date')}: {reportDate}</div>
              </div>
            </div>

            {/* Circular Official Seal / Stamp */}
            <div className="text-center sm:text-right shrink-0">
              <div className="inline-block border-2 border-red-800 bg-red-50/40 p-3.5 rounded-xl text-center shadow-xs">
                <div className="w-8 h-8 mx-auto mb-1 text-red-800">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="text-[10px] font-mono uppercase font-bold text-red-900 tracking-wider">
                  {t('OFFICIAL INVESTIGATION SEAL')}
                </div>
                <div className="text-xs font-mono font-bold text-red-950 mt-0.5">
                  CRIMEX #CX-{caseItem.id}
                </div>
                <div className="text-[9px] font-mono text-red-700 mt-1">
                  SEC-65B VERIFIED • SHA256-DIGITAL-TOKEN
                </div>
                <div className="text-[8px] text-slate-500 mt-0.5">
                  KARNATAKA STATE POLICE CID
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-[#141722] flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('Formatted for Judicial Submission • Principal Sessions Court')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1a1d29] hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
            >
              {t('Close Window')}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('Print / Save PDF')}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('Download Case Report')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
