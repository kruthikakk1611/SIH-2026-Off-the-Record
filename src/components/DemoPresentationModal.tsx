import React from 'react';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Play,
  ArrowRight,
  Shield,
  FolderLock,
  Users,
  Network,
  GitCompare,
  MapPinOff,
  Bot,
  FileCheck2,
  FileSpreadsheet,
} from 'lucide-react';
import { NavPage, CaseRecord, SuspectProfile, EvidenceRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

export interface DemoStep {
  step: number;
  title: string;
  description: string;
  page: NavPage;
  actionSummary: string;
  icon: React.FC<{ className?: string }>;
}

interface DemoPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onExecuteStep: (stepNumber: number) => void;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: '1. Secure Login',
    description: 'Police portal credential and 2FA authentication screen.',
    page: 'login',
    actionSummary: 'Officer authentication with clearance badge & demo bypass.',
    icon: Shield,
  },
  {
    step: 2,
    title: '2. Intelligence Dashboard',
    description: 'Overview of active cases, FIR counts, solved cases, and priority stratification.',
    page: 'dashboard',
    actionSummary: 'Explore 128 active cases, 314 evidence items, and + CREATE NEW CASE.',
    icon: FolderLock,
  },
  {
    step: 3,
    title: '3. Open CASE-0102',
    description: 'Locate Organized Financial Crime investigation card.',
    page: 'cases',
    actionSummary: 'Displays case summary preview and authorized clearance requirement.',
    icon: FolderLock,
  },
  {
    step: 4,
    title: '4. Enter Case Code',
    description: 'Enter clearance code (CX-2026-9901) to unlock full case dossier.',
    page: 'full-case',
    actionSummary: 'Unlocks confidential files, suspects, and forensic logs.',
    icon: FolderLock,
  },
  {
    step: 5,
    title: '5. View Suspects',
    description: 'Inspect persons of interest linked to CASE-0102.',
    page: 'full-case',
    actionSummary: 'Review identified persons (Person A, Person B, Person C).',
    icon: Users,
  },
  {
    step: 6,
    title: '6. Click Person A',
    description: 'Examine Person A profile, known aliases, and linked vehicle.',
    page: 'suspects',
    actionSummary: 'Opens Person A profile dossier with vehicle DL-08-CY-4902.',
    icon: Users,
  },
  {
    step: 7,
    title: '7. View Person A History',
    description: 'Inspect chronological history (2021 record → 2023 link → 2025 vehicle → 2026 current).',
    page: 'suspects',
    actionSummary: 'Shows modal with multi-year incident timeline.',
    icon: Users,
  },
  {
    step: 8,
    title: '8. Open Connection Map',
    description: 'Launch the interactive criminal network graph.',
    page: 'network',
    actionSummary: 'Explore people, phones, vehicles, bank accounts, and cases.',
    icon: Network,
  },
  {
    step: 9,
    title: '9. Person A Connections',
    description: 'Trace Person A → Phone X → Person B → Location Y → Vehicle Z → CASE-0078.',
    page: 'network',
    actionSummary: 'Inspect side panel with relationships and records.',
    icon: Network,
  },
  {
    step: 10,
    title: '10. Open Compare Cases',
    description: 'Launch AI-driven cross-case comparison tool.',
    page: 'compare',
    actionSummary: 'Load dual-case comparison workspace.',
    icon: GitCompare,
  },
  {
    step: 11,
    title: '11. Compare CASE-0102 with CASE-0078',
    description: 'Correlate Organized Financial Crime with Coordinated Theft Network.',
    page: 'compare',
    actionSummary: 'Select Case A and Case B for cross-jurisdiction analysis.',
    icon: GitCompare,
  },
  {
    step: 12,
    title: '12. AI-Detected Similarities',
    description: 'Review similarities: Person A, Vehicle X, Phone match, Crime method (78% confidence).',
    page: 'compare',
    actionSummary: 'Displays 78% similarity score with detailed forensic matrix.',
    icon: GitCompare,
  },
  {
    step: 13,
    title: '13. Open Blind Spots',
    description: 'Open spatial CCTV surveillance gap analyzer.',
    page: 'blindspots',
    actionSummary: 'Displays North-Western Industrial Sector GIS map.',
    icon: MapPinOff,
  },
  {
    step: 14,
    title: '14. Show Location Gap',
    description: 'Highlight 28-minute gap between Location A (10:14 AM) and Location B (10:42 AM).',
    page: 'blindspots',
    actionSummary: 'Displays warning and AI suggestion: "Likely used Route 4 bypass".',
    icon: MapPinOff,
  },
  {
    step: 15,
    title: '15. Open AI Analysis',
    description: 'Launch CrimeX AI assistant for pattern intelligence.',
    page: 'ai-assistant',
    actionSummary: 'Query assistant with assistive framing protocol.',
    icon: Bot,
  },
  {
    step: 16,
    title: '16. Show Investigation Gaps',
    description: 'Review gaps: ⚠ Vehicle ownership, ⚠ Financial relationship, ⚠ B & C connection.',
    page: 'ai-assistant',
    actionSummary: 'Review action items needing investigator verification.',
    icon: Bot,
  },
  {
    step: 17,
    title: '17. Open Evidence',
    description: 'Inspect cryptographic evidence table and items.',
    page: 'evidence',
    actionSummary: 'Select Evidence EV-1027 (Encrypted Financial Ledger).',
    icon: FileCheck2,
  },
  {
    step: 18,
    title: '18. Blockchain Verification',
    description: 'Verify SHA-256 hash against consortium blockchain.',
    page: 'evidence',
    actionSummary: 'Click [ VERIFY INTEGRITY ] → Shows ✓ HASH MATCHES BLOCKCHAIN RECORD.',
    icon: FileCheck2,
  },
  {
    step: 19,
    title: '19. Generate Report',
    description: 'Compile and export official court-ready police dossier.',
    page: 'reports',
    actionSummary: 'Inspect confidential police emblem header, timeline, and [ DOWNLOAD PDF ].',
    icon: FileSpreadsheet,
  },
];

export const DemoPresentationModal: React.FC<DemoPresentationModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onExecuteStep,
}) => {
  if (!isOpen) return null;

  const currentStepData = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length) {
      onExecuteStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onExecuteStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#11131a] border-2 border-blue-600 rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                SMART INDIA HACKATHON 2026
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181b26] border border-slate-700 text-blue-300">
                19-STEP PRESENTATION FLOW
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              CrimeX Interactive Judge Demo Tour
            </h2>
          </div>
        </div>

        {/* Current Step Spotlight Card */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-[#0e1f3d] to-[#071020] border-2 border-blue-500/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold">
              STEP {currentStep} OF {DEMO_STEPS.length}
            </span>
            <span className="text-slate-400">Target View: {currentStepData.page.toUpperCase()}</span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="w-10 h-10 rounded-xl bg-[#181b26] border border-blue-700 flex items-center justify-center text-blue-400 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{currentStepData.title}</h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {currentStepData.description}
              </p>
              <div className="mt-2 text-xs font-mono text-emerald-400 bg-black/40 px-2.5 py-1 rounded border border-slate-800 inline-block">
                ⚡ Action: {currentStepData.actionSummary}
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid / Scroller */}
        <div className="my-4 flex-1 overflow-y-auto space-y-1.5 pr-2 max-h-56">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Jump Directly to Any Step:
          </div>
          {DEMO_STEPS.map((step) => {
            const isCurrent = step.step === currentStep;
            const isCompleted = step.step < currentStep;

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => onExecuteStep(step.step)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : isCompleted
                    ? 'bg-[#090b10] text-slate-300 hover:text-white border border-slate-800'
                    : 'bg-[#090b10]/50 text-slate-500 hover:text-slate-300 border border-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-mono shrink-0 ${
                        isCurrent ? 'border-white text-white' : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      {step.step}
                    </span>
                  )}
                  <span className="truncate">{step.title}</span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                  {step.page}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep <= 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={() => onExecuteStep(currentStep)}
            className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-bold border border-blue-700 cursor-pointer"
          >
            Replay Current Step
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep >= DEMO_STEPS.length}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 disabled:opacity-50 cursor-pointer"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
