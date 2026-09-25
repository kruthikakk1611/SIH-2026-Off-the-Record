import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Check,
  Shield,
  ArrowLeft,
  Scale,
  Users,
  FileCheck2,
  Camera,
  MapPinOff,
  Bot,
  Clock,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { CaseRecord, SuspectProfile, EvidenceRecord, NavPage } from '../types';
import { getIdentityForSuspect } from '../data/suspectIdentityData';
import { getCaseCCTVEvidence } from '../data/caseCCTVData';
import { CASE_SPECIFIC_BLIND_SPOTS } from '../data/caseBlindSpotsData';
import { CourtReportModal } from './CourtReportModal';
import { useLanguage } from '../context/LanguageContext';
import { downloadCaseReport } from '../utils/caseReportGenerator';
import { downloadCaseFIR } from '../utils/firDownloader';
import { FIRViewModal } from './FIRViewModal';
import { getCaseFIR } from '../data/caseFIRData';
import { DEMO_OFFICER } from '../data/mockData';

interface ReportsViewProps {
  cases?: CaseRecord[];
  currentCase?: CaseRecord;
  suspects?: SuspectProfile[];
  evidenceList?: EvidenceRecord[];
  onNavigate?: (page: NavPage) => void;
  isEmbedded?: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  cases = [],
  currentCase,
  suspects = [],
  evidenceList = [],
  onNavigate,
  isEmbedded = false,
}) => {
  const { language, t } = useLanguage();
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [showFIRPreviewModal, setShowFIRPreviewModal] = useState<boolean>(false);
  const [showCourtModal, setShowCourtModal] = useState<boolean>(false);

  const handleOpenFIRPreview = () => {
    setShowFIRPreviewModal(true);
  };

  // Strictly bind report to the selected case. No global case selector!
  const activeCase: CaseRecord | undefined = currentCase || cases[0];

  if (!activeCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white rounded-xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{t('No Case Selected')}</h2>
        <p className="text-sm text-slate-500">
          {t('Please open an active case to view its case-specific investigative report.')}
        </p>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('cases')}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('Return to Cases')}
          </button>
        )}
      </div>
    );
  }

  // Filter case-specific records strictly for THIS activeCase
  const caseSuspects = suspects.filter(
    (s) =>
      activeCase.suspectIds?.includes(s.id) ||
      (s.relatedCases && s.relatedCases.includes(activeCase.id))
  );

  const caseEvidence = evidenceList.filter(
    (e) =>
      activeCase.evidenceIds?.includes(e.id) ||
      e.caseId === activeCase.id
  );

  const caseCCTV = getCaseCCTVEvidence(activeCase.id);
  const caseBlindSpots = CASE_SPECIFIC_BLIND_SPOTS[activeCase.id] || [];

  const handleDownload = async () => {
    await downloadCaseReport(activeCase, {
      suspects: caseSuspects,
      evidenceList: caseEvidence,
      format: 'pdf',
      language,
    });
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const caseOfficerName =
    activeCase.caseOfficer?.name || activeCase.leadOfficer || 'Officer In-Charge';
  const caseOfficerBadge =
    activeCase.caseOfficer?.badge || activeCase.assignedOfficerId || 'KA-POL-AUTH';

  return (
    <div className={`${isEmbedded ? 'space-y-6' : 'max-w-5xl mx-auto space-y-6 pb-12'}`}>
      {/* Top Contextual Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {!isEmbedded && onNavigate && (
              <button
                type="button"
                id="btn-report-back-to-case"
                onClick={() => onNavigate('full-case')}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer mr-2 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('Back to Case Details')}</span>
              </button>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white">
              {activeCase.id}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {t(activeCase.department)}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {t(activeCase.priority)} {t('PRIORITY')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('Case Report')}: {t(activeCase.title)}
          </h1>
          <p className="text-xs text-slate-500">
            {t('Comprehensive case dossier generated exclusively for')} {activeCase.id}.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-report-download-fir"
            onClick={handleOpenFIRPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            title={`Preview and download official statutory FIR (PDF/Text) for ${activeCase.id}`}
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>{t('View & Download FIR')}</span>
          </button>

          <button
            type="button"
            id="btn-report-court-modal"
            onClick={() => setShowCourtModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('Download Court Report')}</span>
          </button>
        </div>
      </div>

      {/* Official Case Report Document Card */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-10 shadow-xs space-y-8 text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Document Header with Emblem and State Seal Reference */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-900 shrink-0" />
              <div className="text-[11px] uppercase tracking-widest font-extrabold text-slate-700 font-mono">
                KARNATAKA STATE POLICE • CRIMINAL INVESTIGATION DEPARTMENT
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 mt-1">
              {t('OFFICIAL CASE INVESTIGATION DOSSIER')}
            </h2>
            <div className="text-xs font-mono text-slate-600">
              {t('CASE RECORD')}: <span className="font-bold text-slate-950">{activeCase.id}</span> • {t('CRIME TYPE')}:{' '}
              <span className="font-semibold text-slate-900">{t(activeCase.crimeType)}</span>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-slate-600 space-y-0.5 shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-200">
            <div>DATE GENERATED: <span className="font-bold text-slate-900">20 Sept 2026</span></div>
            <div>SECURITY CLEARANCE: <span className="font-bold text-blue-700">CX-SEC-RESTRICTED</span></div>
            <div>AUTHORIZATION CODE: <span className="font-bold font-mono text-slate-800">{activeCase.accessCode}</span></div>
          </div>
        </div>

        {/* Section 1: Executive Case Summary & FIR Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>1. Executive Case Summary & FIR Particulars</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-bold">
              Progress: {activeCase.progress}%
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              {activeCase.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">{t('Department')}</span>
                <span className="font-bold text-slate-900">{activeCase.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">{t('Registered:')}</span>
                <span className="font-bold text-slate-900">{activeCase.startedDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">{t('Assigned Team')}</span>
                <span className="font-bold text-slate-900">{activeCase.assignedTeam}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">{t('Case Officer')}</span>
                <span className="font-bold text-blue-800 truncate block">{caseOfficerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Identified Suspects & Verified Identity Records */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>2. Identified Suspects & Digital Identity Verification ({caseSuspects.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Aadhaar & DigiLocker Cross-Checked
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Suspect ID / Alias</th>
                  <th className="p-3">Legal Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Identity Verification</th>
                  <th className="p-3">Associated Vehicles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {caseSuspects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500 italic">
                      No suspects currently listed for {activeCase.id}.
                    </td>
                  </tr>
                ) : (
                  caseSuspects.map((s) => {
                    const identity = getIdentityForSuspect(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          <div>{s.codeName}</div>
                          <span className="text-[10px] text-slate-500 font-normal">ID: {s.id}</span>
                        </td>
                        <td className="p-3 text-slate-800 font-semibold">
                          {identity?.digiLockerVerifiedName || s.name || s.alias || 'Classified'}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            s.status === 'Arrested'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : s.status === 'Prime Suspect'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono">
                            <Fingerprint className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-slate-700 font-medium">
                              {identity?.aadhaarMasked ? `Aadhaar: ${identity.aadhaarMasked}` : (identity?.digiLockerDocumentType || 'DigiLocker Verified')}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-600 text-[11px]">
                          {s.vehicles && s.vehicles.length > 0
                            ? s.vehicles.join(', ')
                            : 'None Logged'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Custody & Forensic Evidence Log with Case CCTV */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>3. Forensic Evidence Chain & Case CCTV Surveillance ({caseEvidence.length} Items)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Tamper-Evident SHA-256 Ledger
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Evidence ID</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Collection Date</th>
                  <th className="p-3">Custody Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {caseEvidence.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500 italic font-sans">
                      No forensic evidence logged yet for {activeCase.id}.
                    </td>
                  </tr>
                ) : (
                  caseEvidence.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-blue-800">{e.id}</td>
                      <td className="p-3 font-sans text-slate-900 font-medium">{e.title}</td>
                      <td className="p-3 text-slate-600">{e.type}</td>
                      <td className="p-3 text-slate-600">{e.collectedDate || '14 Aug 2026'}</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Case CCTV Cameras Summary */}
          {caseCCTV.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Associated Case CCTV Feeds ({caseCCTV.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                {caseCCTV.map((cam) => (
                  <div key={cam.id} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 truncate">{cam.cameraName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{cam.location}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{cam.resolution} • {cam.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Blind Spot Analysis & Corridor Coverage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
              <MapPinOff className="w-4 h-4 text-amber-600" />
              <span>4. Surveillance Blind Spot Analysis ({caseBlindSpots.length} Critical Corridors)</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Gap Risk Audit
            </span>
          </div>

          <div className="space-y-2">
            {caseBlindSpots.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                No active blind spots detected for {activeCase.id}.
              </div>
            ) : (
              caseBlindSpots.map((spot) => (
                <div key={spot.id} className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 font-mono">{spot.corridor}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      {spot.risk} Risk Gap
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {spot.whyIdentified || spot.investigationRelevance}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    Coverage Gap: <span className="font-bold text-slate-800">{spot.coverageGap}</span> • Recommended: {spot.recommendedAction}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 5: AI-Assisted Intelligence Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              <span>5. AI-Assisted Correlation & Pattern Intelligence</span>
            </h3>
            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
              Gemini Police Engine
            </span>
          </div>

          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 text-xs space-y-2">
            <p className="text-slate-800 leading-relaxed font-sans">
              {activeCase.aiSummary || 'AI analysis underway for behavioral clustering and cross-district entity mapping.'}
            </p>

            {activeCase.investigationGaps && activeCase.investigationGaps.length > 0 && (
              <div className="pt-2 border-t border-purple-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">
                  Identified Investigation Gaps / Hypotheses:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-mono">
                  {activeCase.investigationGaps.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Official Investigation Timeline */}
        {activeCase.investigationSteps && activeCase.investigationSteps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>6. Key Investigation Milestones & Procedural Audit</span>
              </h3>
            </div>

            <div className="space-y-2">
              {activeCase.investigationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className={`font-medium ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {step.date || (step.completed ? 'Completed' : 'Pending')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Official Sign-off and Verification */}
        <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 uppercase">
              Investigating Officer In-Charge:
            </div>
            <div className="text-sm font-black text-blue-900">
              {caseOfficerName}
            </div>
            <div className="text-[11px] text-slate-500">
              Official Identification: {caseOfficerBadge} • {activeCase.department}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="font-bold text-slate-900">
              CrimeX Tamper-Evident Audit Hash:
            </div>
            <div className="text-[10px] text-slate-600 font-mono break-all max-w-xs">
              0x4f8c92a1e7b6c3d90214876fbcd1234987afe209
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              DIGITALLY CERTIFIED • VALID FOR MAGISTRATE SUBMISSION
            </div>
          </div>
        </div>
      </div>

      {/* Court Report Modal */}
      {showCourtModal && (
        <CourtReportModal
          caseItem={activeCase}
          suspects={caseSuspects}
          evidence={caseEvidence}
          officer={
            activeCase.caseOfficer
              ? {
                  id: activeCase.caseOfficer.id,
                  name: activeCase.caseOfficer.name,
                  rank: activeCase.caseOfficer.rank,
                  department: activeCase.department,
                  state: 'Karnataka',
                  city: 'Bengaluru',
                  district: 'Bengaluru Urban',
                  station: activeCase.department,
                  badge: activeCase.caseOfficer.badge,
                  loginTime: 'Active',
                }
              : DEMO_OFFICER
          }
          onClose={() => setShowCourtModal(false)}
        />
      )}

      {/* FIR Preview & Download (PDF/Text) Modal */}
      {showFIRPreviewModal && (
        <FIRViewModal
          fir={getCaseFIR(activeCase.id)}
          onClose={() => setShowFIRPreviewModal(false)}
        />
      )}
    </div>
  );
};
