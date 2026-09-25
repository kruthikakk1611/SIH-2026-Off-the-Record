import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Edit,
  GitCompare,
  FileText,
  Clock,
  Users,
  Car,
  Phone,
  Scale,
  Sparkles,
  Radio,
  Network,
  Calendar,
  Bot,
  FileCheck2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Search,
  Lock,
  MapPinOff,
  Camera,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Check,
} from 'lucide-react';
import {
  CaseRecord,
  SuspectProfile,
  EvidenceRecord,
  OfficerProfile,
  TimelineEvent,
  SecretRoom,
} from '../types';
import { calculateCaseDuration } from '../data/policeAndEvidenceData';
import { DigitalThreadMap } from './DigitalThreadMap';
import { SuspectDetailModal } from './SuspectDetailModal';
import { CourtReportModal } from './CourtReportModal';
import { CaseCompareModal } from './CaseCompareModal';
import { PasswordGateModal } from './PasswordGateModal';
import { AICaseAssistant } from './AICaseAssistant';
import { CaseFIRSection } from './CaseFIRSection';
import { MissingInfoMeterCard } from './MissingInfoMeterCard';
import { DeadEndLoopMeterCard } from './DeadEndLoopMeterCard';
import { CaseBlindSpotsSection } from './CaseBlindSpotsSection';
import { CaseCCTVSection } from './CaseCCTVSection';
import { CaseIdentityVerificationSection } from './CaseIdentityVerificationSection';
import { getCaseBlindSpots } from '../data/caseBlindSpotsData';
import { getCaseCCTVEvidence } from '../data/caseCCTVData';
import { getIdentityForSuspect } from '../data/suspectIdentityData';
import { ReportsView } from './ReportsView';
import { useLanguage } from '../context/LanguageContext';
import { downloadCaseReport } from '../utils/caseReportGenerator';
import { downloadCaseFIR } from '../utils/firDownloader';
import { FIRViewModal } from './FIRViewModal';
import { getCaseFIR } from '../data/caseFIRData';

interface FullCaseViewProps {
  caseItem?: CaseRecord | null;
  allCases?: CaseRecord[];
  cases?: CaseRecord[];
  allSuspects?: SuspectProfile[];
  suspects?: SuspectProfile[];
  allEvidence?: EvidenceRecord[];
  evidenceList?: EvidenceRecord[];
  officer?: OfficerProfile;
  timeline?: TimelineEvent[];
  onBack?: () => void;
  onBackToCases?: () => void;
  onSelectCase?: (c: CaseRecord) => void;
  onSelectSuspect?: (s: SuspectProfile) => void;
  onOpenSuspect?: (s: SuspectProfile) => void;
  onOpenEvidence?: (e: EvidenceRecord) => void;
  onGenerateReport?: (c: CaseRecord) => void;
  onNavigateToReports?: (c: CaseRecord) => void;
  onNavigateToCompare?: (c1: CaseRecord, c2: CaseRecord) => void;
  onNavigateToNetwork?: () => void;
  onEditCase?: () => void;
  onUnlockCase?: (c: CaseRecord) => void;
  secretRoom?: SecretRoom | null;
  onCreateSecretRoom?: () => void;
  onOpenSecretRoom?: () => void;
  hasSecretRoomAccess?: boolean;
}

export type CaseTabType =
  | 'overview'
  | 'suspects'
  | 'evidence'
  | 'blind-spots'
  | 'connections'
  | 'timeline'
  | 'ai-analysis'
  | 'related-cases'
  | 'case-report';

export const FullCaseView: React.FC<FullCaseViewProps> = ({
  caseItem: caseItemProp,
  allCases,
  cases,
  allSuspects,
  suspects,
  allEvidence,
  evidenceList,
  officer,
  onBack,
  onBackToCases,
  onSelectSuspect,
  onOpenSuspect,
  onEditCase,
  secretRoom,
  onCreateSecretRoom,
  onOpenSecretRoom,
  hasSecretRoomAccess = true,
  onNavigateToReports,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<CaseTabType>('overview');
  const [selectedSuspectForDossier, setSelectedSuspectForDossier] =
    useState<SuspectProfile | null>(null);
  const [showCourtReportModal, setShowCourtReportModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showEditPasswordGate, setShowEditPasswordGate] = useState<boolean>(false);
  const [suspectSearchTerm, setSuspectSearchTerm] = useState<string>('');
  const [isDownloadingReport, setIsDownloadingReport] = useState<boolean>(false);

  // Reconcile props
  const caseList = allCases || cases || [];
  const caseItem = caseItemProp || caseList[0];

  if (!caseItem) {
    return (
      <div className="max-w-4xl mx-auto p-12 bg-white rounded-xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No Case Selected</h2>
        <p className="text-sm text-slate-500">Please select an active case from the cases directory.</p>
        <button
          type="button"
          onClick={onBackToCases || onBack}
          className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Cases
        </button>
      </div>
    );
  }

  const suspectList = allSuspects || suspects || [];
  const evidenceItems = allEvidence || evidenceList || [];

  // Filter suspects belonging to this case
  const caseSuspects = suspectList.filter(
    (s) => caseItem.suspectIds?.includes(s.id) || s.relatedCases?.includes(caseItem.id)
  );

  // Filter evidence belonging to this case
  const caseEvidence = evidenceItems.filter(
    (e) => caseItem.evidenceIds?.includes(e.id) || e.caseId === caseItem.id
  );

  // Calculate duration and initiator
  const duration = calculateCaseDuration(caseItem.startedDate);
  const initiator = caseItem.initiatedBy || {
    policeId: 'POL-KA-2026-4491',
    name: 'Inspector Rajesh Kumar',
    rank: 'Inspector of Police',
    date: caseItem.startedDate,
    firNumber: 'FIR No. 109/2026',
    station: caseItem.department || 'CID Cyber Crime Police Station',
  };
  const policeOfficers = caseItem.policeOfficers || [];
  const policeCount = policeOfficers.length || 6;

  // Case-Specific Blind Spots and CCTV evidence
  const caseBlindSpots = getCaseBlindSpots(caseItem.id);
  const caseCCTVRecords = getCaseCCTVEvidence(caseItem.id);

  // Filtered suspects by search in suspects tab
  const filteredSuspects = caseSuspects.filter((s) => {
    const q = suspectSearchTerm.toLowerCase();
    return (
      s.codeName.toLowerCase().includes(q) ||
      (s.legalName && s.legalName.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  });

  // Related cases (excluding current case)
  const relatedCases = caseList.filter((c) => c.id !== caseItem.id);

  // Check if current authenticated officer is the creator/admin of the case secret room
  const isSecretRoomCreator = useMemo(() => {
    if (!officer || !secretRoom) return false;
    const offId = (officer.id || '').trim().toLowerCase();
    const offName = (officer.name || '').trim().toLowerCase();
    const creatorId = (secretRoom.createdByOfficerId || '').trim().toLowerCase();
    const creatorName = (secretRoom.createdByOfficerName || '').trim().toLowerCase();

    if (offId && creatorId && offId === creatorId) return true;
    if (offName && creatorName && offName === creatorName) return true;

    const creatorMember = secretRoom.members?.find((m) => m.isCreator);
    if (creatorMember) {
      if (offId && creatorMember.userId.toLowerCase() === offId) return true;
      if (offName && creatorMember.name.toLowerCase() === offName) return true;
    }

    if (
      (creatorName.includes('arjun sharma') || creatorId === 'dgp-0001') &&
      (offName.includes('arjun sharma') || offId === 'dgp-0001')
    ) {
      return true;
    }

    return false;
  }, [officer, secretRoom]);

  const handleBack = () => {
    if (onBackToCases) onBackToCases();
    else if (onBack) onBack();
  };

  const handleInspectSuspect = (suspect: SuspectProfile) => {
    setSelectedSuspectForDossier(suspect);
    if (onSelectSuspect) onSelectSuspect(suspect);
    if (onOpenSuspect) onOpenSuspect(suspect);
  };

  const handleEditCaseClick = () => {
    setShowEditPasswordGate(true);
  };

  const handleEditPasswordSuccess = () => {
    setShowEditPasswordGate(false);
    if (onEditCase) onEditCase();
  };

  const [showFIRPreviewModal, setShowFIRPreviewModal] = useState<boolean>(false);
  const [isDownloadingFIR, setIsDownloadingFIR] = useState<boolean>(false);

  const handleOpenFIRPreview = () => {
    setShowFIRPreviewModal(true);
  };

  const handleDownloadFIR = async (format: 'pdf' | 'txt' = 'txt') => {
    setIsDownloadingFIR(true);
    await downloadCaseFIR(caseItem, format);
    setTimeout(() => setIsDownloadingFIR(false), 2000);
  };

  const handleDirectDownloadReport = async () => {
    setIsDownloadingReport(true);
    await downloadCaseReport(caseItem, {
      suspects: caseSuspects,
      evidenceList: caseEvidence,
      officer,
      format: 'pdf',
      language,
    });
    setTimeout(() => setIsDownloadingReport(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 text-slate-900 animate-in fade-in">
      {/* 1. Header Area: CASE-0102, Title, Priority */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {caseItem.id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${
                  caseItem.priority === 'Critical'
                    ? 'bg-red-600 text-white shadow-xs'
                    : caseItem.priority === 'High'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {t(caseItem.priority)} {t('PRIORITY')}
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                {t(caseItem.department)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
              {t(caseItem.title)}
            </h1>

            <p className="text-xs text-slate-500 font-mono">
              {t('FIR')}: {initiator.firNumber} • {t('Crime Type')}: {t(caseItem.crimeType)} • {t('Registered')}: {caseItem.startedDate}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              id="btn-back-to-cases"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back to Cases')}</span>
            </button>

            <button
              type="button"
              id="btn-download-fir"
              onClick={handleOpenFIRPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title={`Preview official statutory FIR and download in PDF or Text for ${caseItem.id}`}
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>{t('View & Download FIR')}</span>
            </button>

            <button
              type="button"
              id="btn-edit-this-case"
              onClick={handleEditCaseClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-blue-600 hover:text-blue-700 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Edit case details (Requires password verification)"
            >
              <Edit className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('Edit Case')}</span>
            </button>

            {hasSecretRoomAccess && (
              secretRoom ? (
                <button
                  type="button"
                  id="btn-open-secret-room"
                  onClick={onOpenSecretRoom}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  title={`Open Secret Room: ${secretRoom.roomName}`}
                >
                  <Lock className="w-3.5 h-3.5 text-blue-200" />
                  <span>{t('Open Secret Room')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-800 text-blue-100 font-mono font-bold">
                    {secretRoom.members.length} {secretRoom.members.length === 1 ? 'member' : 'members'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-create-secret-room"
                  onClick={onCreateSecretRoom}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  title="Create a private Secret Room for this case"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('Create Secret Room')}</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 2. Simple Navigation Bar: Overview | Suspects | Evidence | Connections | Timeline | AI Analysis | Related Cases */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl px-2 shadow-2xs overflow-x-auto">
        <button
          type="button"
          id="tab-case-overview"
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('Overview')}</span>
        </button>

        <button
          type="button"
          id="tab-case-suspects"
          onClick={() => setActiveTab('suspects')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'suspects'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('Suspects')} ({caseSuspects.length || caseItem.suspectsCount})</span>
        </button>

        <button
          type="button"
          id="tab-case-evidence"
          onClick={() => setActiveTab('evidence')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'evidence'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{t('Evidence')} ({caseEvidence.length || caseItem.evidenceCount})</span>
        </button>

        <button
          type="button"
          id="tab-case-blind-spots"
          onClick={() => setActiveTab('blind-spots')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'blind-spots'
              ? 'border-amber-600 text-amber-700 bg-amber-50/70 font-extrabold'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <MapPinOff className="w-4 h-4 text-amber-600" />
          <span>{t('Blind Spots')}</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {caseBlindSpots.length}
          </span>
        </button>

        <button
          type="button"
          id="tab-case-connections"
          onClick={() => setActiveTab('connections')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'connections'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>{t('Connections')}</span>
        </button>

        <button
          type="button"
          id="tab-case-timeline"
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t('Timeline')}</span>
        </button>

        <button
          type="button"
          id="tab-case-ai-analysis"
          onClick={() => setActiveTab('ai-analysis')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'ai-analysis'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70 font-extrabold'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-600" />
          <span>{t('AI Analysis')}</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Gemini
          </span>
        </button>

        <button
          type="button"
          id="tab-case-related-cases"
          onClick={() => setActiveTab('related-cases')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'related-cases'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>{t('Related Cases')}</span>
        </button>

        <button
          type="button"
          id="tab-case-report"
          onClick={() => setActiveTab('case-report')}
          className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'case-report'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-black'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          <span>{t('Case Report')}</span>
        </button>

        {hasSecretRoomAccess && (
          <button
            type="button"
            id="tab-case-secret-room"
            onClick={() => {
              if (secretRoom && onOpenSecretRoom) {
                onOpenSecretRoom();
              } else if (onCreateSecretRoom) {
                onCreateSecretRoom();
              }
            }}
            className="py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 border-transparent text-slate-600 hover:text-blue-600 ml-auto"
            title={secretRoom ? 'Open Secret Room' : 'Create Secret Room'}
          >
            <Lock className="w-4 h-4 text-blue-600" />
            <span>{t('Secret Room')}</span>
            {secretRoom ? (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {isSecretRoomCreator ? `Active (${secretRoom.members.length})` : 'Active'}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                + Create
              </span>
            )}
          </button>
        )}
      </div>

      {/* 3. Tab Contents: ONLY SHOW THE SELECTED SECTION (Never stack vertically) */}

      {/* SECTION 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* FEATURE 3: PRIMARY LEGAL DOCUMENT (FIR First) */}
          <CaseFIRSection caseItem={caseItem} />

          {/* FEATURE 7: MISSING INFORMATION & CASE COMPLETENESS METER */}
          <MissingInfoMeterCard
            caseItem={caseItem}
            suspects={caseSuspects}
            evidenceList={caseEvidence}
          />

          {/* FEATURE 8: AI DEAD END / INVESTIGATION LOOP METER */}
          <DeadEndLoopMeterCard
            caseItem={caseItem}
            suspects={caseSuspects}
            evidenceList={caseEvidence}
          />

          {/* Case Brief Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-black flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t('Case Brief (Official Summary)')}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">{t('Verified Police Record')}</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {caseItem.summary}
            </p>
          </div>

          {/* Key Facts & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Case Initiator */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('Initiated By')}
              </span>
              <div className="text-sm font-bold text-black truncate">{initiator.name}</div>
              <div className="text-xs text-slate-600">{initiator.rank}</div>
              <span className="text-[11px] font-mono text-blue-700 block mt-1">
                ID: {initiator.policeId}
              </span>
            </div>

            {/* Case Duration */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('Case Duration')}
              </span>
              <div className="text-sm font-bold text-blue-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{duration.displayText}</span>
              </div>
              <div className="text-xs text-slate-600">{t('Started')}: {caseItem.startedDate}</div>
              <span className="text-[11px] font-mono text-slate-500 block">
                {duration.ongoingStatus}
              </span>
            </div>

            {/* Police Team Size */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('Police Personnel')}
              </span>
              <div className="text-sm font-bold text-black flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{policeCount} {t('Officers Assigned')}</span>
              </div>
              <div className="text-xs text-slate-600 truncate">{initiator.station}</div>
              <span className="text-[11px] text-blue-600 font-bold block">
                {t('Lead')}: {initiator.name.split(' ').slice(1).join(' ') || initiator.name}
              </span>
            </div>

            {/* Investigation Progress */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {t('Progress')}
                </span>
                <span className="text-xs font-mono font-bold text-black">
                  {caseItem.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${caseItem.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 block pt-1">
                {t('Status')}: {t(caseItem.priority)} {t('Docket')}
              </span>
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider">
              {t('Investigation Modules')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                type="button"
                id="overview-jump-suspects"
                onClick={() => setActiveTab('suspects')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black group-hover:text-blue-600 block">
                      Suspects ({caseSuspects.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      View mugshots, phone taps, vehicles
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                id="overview-jump-evidence"
                onClick={() => setActiveTab('evidence')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black group-hover:text-blue-600 block">
                      Evidence ({caseEvidence.length || caseItem.evidenceCount})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Custody log, forensics, CCTV & seizures
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                id="overview-jump-blind-spots"
                onClick={() => setActiveTab('blind-spots')}
                className="p-3.5 rounded-lg border border-amber-200 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-black flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPinOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 group-hover:text-amber-800 block">
                      Blind Spots ({caseBlindSpots.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Corridor gaps & unmonitored routes
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                id="overview-jump-connections"
                onClick={() => setActiveTab('connections')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black group-hover:text-blue-600 block">
                      Connection Map
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Digital links, calls, syndicates
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                id="overview-jump-timeline"
                onClick={() => setActiveTab('timeline')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black group-hover:text-blue-600 block">
                      Timeline
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Chronological event sequence
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                id="overview-jump-ai-assistant"
                onClick={() => setActiveTab('ai-analysis')}
                className="p-3.5 rounded-lg border border-purple-200 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-950 group-hover:text-purple-800 block">
                      AI Case Assistant & Clues
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Prioritized clues, suspect links
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                id="overview-jump-related-cases"
                onClick={() => setActiveTab('related-cases')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/40 text-left transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                    <GitCompare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-black group-hover:text-blue-600 block">
                      Related Cases
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cross-case modus operandi
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Assigned Police Personnel Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">
                  {t('Assigned Police Personnel')} ({policeOfficers.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {t('Authorized Departmental Team')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{t('Police ID')}</th>
                    <th className="py-2.5 px-3">{t('Officer Name')}</th>
                    <th className="py-2.5 px-3">{t('Rank')}</th>
                    <th className="py-2.5 px-3">{t('Case Role')}</th>
                    <th className="py-2.5 px-3">{t('Station')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {policeOfficers.map((officerItem) => (
                    <tr key={officerItem.policeId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        {officerItem.policeId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-black flex items-center gap-1.5">
                        {officerItem.name}
                        {officerItem.isStarter && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono">
                            Starter
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{officerItem.rank}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{officerItem.role}</td>
                      <td className="py-2.5 px-3 text-slate-500">{officerItem.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SUSPECTS */}
      {activeTab === 'suspects' && (
        <div className="space-y-6">
          {/* AADHAAR & DIGILOCKER IDENTITY VERIFICATION SECTION */}
          <CaseIdentityVerificationSection
            caseItem={caseItem}
            suspects={caseSuspects}
            onSelectSuspect={handleInspectSuspect}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-black tracking-tight">
                {t('Case Suspects')} ({caseSuspects.length})
              </h2>
              <p className="text-xs text-slate-500">
                {t('Click any suspect to open their full dossier, criminal history, and forensic records.')}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                id="search-case-suspects"
                value={suspectSearchTerm}
                onChange={(e) => setSuspectSearchTerm(e.target.value)}
                placeholder={t('Search suspects...')}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuspects.map((suspect) => {
              const vehiclesCount =
                suspect.vehiclesDetailed?.length || suspect.vehicles?.length || 0;
              const phone = suspect.phoneNumber || suspect.phoneRecords?.[0] || 'Under Tap';

              return (
                <div
                  key={suspect.id}
                  id={`suspect-card-${suspect.id}`}
                  onClick={() => handleInspectSuspect(suspect)}
                  className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Name, Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                            suspect.avatarBg || 'from-blue-600 to-indigo-800'
                          } flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0`}
                        >
                          {suspect.codeName?.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {suspect.id}
                          </span>
                          <h4 className="text-sm font-bold text-black group-hover:text-blue-600 transition-colors">
                            {suspect.codeName}
                          </h4>
                          <div className="text-xs text-slate-500">
                            {suspect.legalName || 'Legal Name on File'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          suspect.status === 'Key Node'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {suspect.status}
                      </span>
                    </div>

                    {/* Why Connected */}
                    {suspect.whyConnected && (
                      <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-snug line-clamp-2">
                        <span className="font-bold">Link: </span>
                        {suspect.whyConnected}
                      </div>
                    )}

                    {/* Phone & Vehicles */}
                    <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {t('Phone')}:
                        </span>
                        <span className="font-mono font-bold text-slate-900">{phone}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Car className="w-3 h-3 text-slate-400" />
                          {t('Vehicles')}:
                        </span>
                        <span className="font-medium text-slate-900">
                          {vehiclesCount} {t('Registered')}
                        </span>
                      </div>

                      {suspect.currentLocationDetails && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Radio className="w-3 h-3 text-emerald-500" />
                            {t('Area')}:
                          </span>
                          <span className="font-medium text-slate-900 truncate max-w-[140px]">
                            {suspect.currentLocationDetails.area}
                          </span>
                        </div>
                      )}

                      {/* FEATURE 1: Civic Identity Verification Status & Action Buttons */}
                      {(() => {
                        const identity = getIdentityForSuspect(suspect.id, suspect.legalName || suspect.codeName);
                        const isVer = identity.verificationStatus === 'Verified';
                        return (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                {t('Identity Verification')}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  isVer
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : identity.verificationStatus === 'Verification Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {isVer ? `✓ ${t('Verified')}` : t('Not Verified')}
                              </span>
                            </div>

                            {isVer ? (
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono bg-emerald-50/60 px-2 py-1 rounded">
                                <span>Source: {identity.verificationSource}</span>
                                <span className="text-emerald-700 font-bold">Match: Confirmed</span>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInspectSuspect(suspect);
                                  }}
                                  className="py-1 px-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-[10px] font-bold text-center transition-colors cursor-pointer truncate"
                                  title="Verify with Aadhaar"
                                >
                                  {t('Verify with Aadhaar')}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInspectSuspect(suspect);
                                  }}
                                  className="py-1 px-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold text-center transition-colors cursor-pointer truncate"
                                  title="Verify with DigiLocker"
                                >
                                  {t('Verify with DigiLocker')}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      {t('Risk')}: {t(suspect.riskLevel || 'High')}
                    </span>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {t('View Dossier →')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          {/* FEATURE 4: CCTV FORENSIC EVIDENCE FEEDS (Case-Specific) */}
          <CaseCCTVSection caseItem={caseItem} />

          {/* Physical, Digital & Ballistic Seized Evidence */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-black tracking-tight">
                  {t('Case Physical & Seized Evidence')} ({caseEvidence.length})
                </h2>
                <p className="text-xs text-slate-500">
                  {t('Seized items, digital artifacts, call recordings, and forensic ballistic logs.')}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t('Sec 65B Certified')}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{t('Evidence ID')}</th>
                      <th className="py-3 px-4">{t('Type')}</th>
                      <th className="py-3 px-4">{t('Description')}</th>
                      <th className="py-3 px-4">{t('Seized Location / Date')}</th>
                      <th className="py-3 px-4">{t('Custody Officer')}</th>
                      <th className="py-3 px-4">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {caseEvidence.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {ev.id}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                            {ev.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 max-w-xs">
                          {ev.description}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          <div>{ev.collectedDate}</div>
                          <div className="text-[11px] text-slate-400">{ev.location}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {ev.collectedBy}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {ev.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: BLIND SPOTS (FEATURE 2 — Case-Specific Blind Spot & Surveillance Gap Analysis) */}
      {activeTab === 'blind-spots' && (
        <CaseBlindSpotsSection caseItem={caseItem} />
      )}

      {/* SECTION 4: CONNECTIONS */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-black tracking-tight">
                {t('Case Connection Map')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Interactive relationship graph mapping phone pings, shared vehicles, and crime syndicate nodes.')}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {t('Auto-Correlated Graph')}
            </span>
          </div>

          <DigitalThreadMap
            caseItem={caseItem}
            suspects={caseSuspects.length > 0 ? caseSuspects : suspectList.slice(0, 6)}
            onSelectSuspect={handleInspectSuspect}
          />
        </div>
      )}

      {/* SECTION 5: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-black tracking-tight">
                {t('Chronological Case Timeline')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Sequential chain of events, seizures, and verified investigative actions.')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {t('Sec 65B Certified')}
            </span>
          </div>

          <div className="relative border-l-2 border-blue-600 ml-4 pl-6 space-y-6">
            {caseItem.evidenceTimeline?.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 absolute -left-[31px] top-1 border-2 border-white shadow-xs" />

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-400 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {item.evidenceId}
                      </span>
                      <span className="text-xs font-bold text-black">{t(item.title)}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {t(item.type)}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {item.date} • {item.time}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-bold block">Seizing Officer:</span>
                      <span className="font-medium text-slate-900">
                        {item.officerName} (ID: {item.officerId})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block">Location:</span>
                      <span className="font-medium text-slate-900 truncate block">
                        {item.locationSeized}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block">Digital Hash:</span>
                      <span className="font-mono text-blue-700 truncate block">
                        {item.blockchainHash}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-xs text-slate-500 py-6">
                No chronological evidence events recorded.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 6: AI ANALYSIS (CLUES, RELATIONSHIPS, SOLVE FASTER) */}
      {activeTab === 'ai-analysis' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main AICaseAssistant Component */}
          <AICaseAssistant
            caseItem={caseItem}
            allCases={caseList}
            suspects={caseSuspects.length > 0 ? caseSuspects : suspectList}
            evidenceList={caseEvidence.length > 0 ? caseEvidence : evidenceItems}
            officer={officer}
            onOpenSuspect={handleInspectSuspect}
          />

          {/* Forensic Correlation Findings Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">
                  AI Forensic Correlation & Pattern Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Automated telemetry analysis correlating bank statements, CDR pings, and vehicle trackers.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-purple-50/60 border border-purple-200 text-xs text-purple-950 leading-relaxed">
              <span className="font-bold block uppercase text-[10px] text-purple-800 mb-1">
                Automated Pattern Correlation:
              </span>
              <p>{caseItem.aiSummary}</p>
            </div>

            {/* Investigation Gaps */}
            {caseItem.investigationGaps && caseItem.investigationGaps.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Open Investigation Gaps:
                </div>
                <div className="space-y-1.5">
                  {caseItem.investigationGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 7: RELATED CASES */}
      {activeTab === 'related-cases' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-black tracking-tight">
                {t('Related Cases & Modus Operandi Correlation')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Cross-referenced cases with shared suspects, overlapping vehicle sightings, or matching MO.')}
              </p>
            </div>

            <button
              type="button"
              id="btn-open-compare-modal-related"
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('Compare With Another Case')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedCases.map((rel) => {
              // Calculate simulated MO match
              const matchScore = rel.priority === caseItem.priority ? 86 : 64;

              return (
                <div
                  key={rel.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {rel.id}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {t(rel.department)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-black mt-1">{t(rel.title)}</h3>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {matchScore}% {t('MO Match')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {t(rel.summary)}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>{t('Progress')}: {rel.progress}%</span>
                    <button
                      type="button"
                      onClick={() => setShowCompareModal(true)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('Compare Side-by-Side')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 9: CASE REPORT */}
      {activeTab === 'case-report' && (
        <div className="space-y-6">
          <ReportsView
            currentCase={caseItem}
            cases={caseList}
            suspects={caseSuspects.length > 0 ? caseSuspects : suspectList}
            evidenceList={caseEvidence.length > 0 ? caseEvidence : evidenceItems}
            onNavigate={onNavigateToReports ? () => onNavigateToReports(caseItem) : undefined}
            isEmbedded={true}
          />
        </div>
      )}

      {/* MODALS */}

      {/* 1. Suspect Detail Modal */}
      {selectedSuspectForDossier && (
        <SuspectDetailModal
          suspect={selectedSuspectForDossier}
          caseId={caseItem.id}
          onClose={() => setSelectedSuspectForDossier(null)}
        />
      )}

      {/* 2. Court Report Modal */}
      {showCourtReportModal && (
        <CourtReportModal
          caseItem={caseItem}
          suspects={caseSuspects.length > 0 ? caseSuspects : suspectList}
          evidence={caseEvidence}
          officer={
            officer || {
              id: initiator.policeId,
              name: initiator.name,
              rank: initiator.rank,
              department: caseItem.department,
              state: 'Karnataka',
              city: 'Bengaluru',
              district: 'Bengaluru Urban',
              station: initiator.station,
              badge: 'CX-4491',
              loginTime: 'Active',
            }
          }
          onClose={() => setShowCourtReportModal(false)}
        />
      )}

      {/* 3. Case Compare Modal */}
      {showCompareModal && (
        <CaseCompareModal
          currentCase={caseItem}
          allCases={caseList}
          allSuspects={suspectList}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {/* 4. Edit Case Password Gate Modal */}
      {showEditPasswordGate && (
        <PasswordGateModal
          caseItem={caseItem}
          title="Authenticate to Edit Case"
          description={`To edit case parameters, update investigation steps, or add intelligence for ${caseItem.id}, please enter the case security password again.`}
          onSuccess={handleEditPasswordSuccess}
          onClose={() => setShowEditPasswordGate(false)}
        />
      )}

      {/* 5. FIR Preview & Download (PDF/Text) Modal */}
      {showFIRPreviewModal && (
        <FIRViewModal
          fir={getCaseFIR(caseItem.id)}
          onClose={() => setShowFIRPreviewModal(false)}
        />
      )}
    </div>
  );
};
