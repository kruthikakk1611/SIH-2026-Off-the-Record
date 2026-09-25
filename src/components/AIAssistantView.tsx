import React, { useState } from 'react';
import {
  FileText,
  Network,
  GitCompare,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot,
  Lightbulb,
} from 'lucide-react';
import {
  NavPage,
  CaseRecord,
  SuspectProfile,
  EvidenceRecord,
  OfficerProfile,
} from '../types';
import { AICaseAssistant } from './AICaseAssistant';
import { useLanguage } from '../context/LanguageContext';

interface AIAssistantViewProps {
  onNavigate?: (page: NavPage) => void;
  cases?: CaseRecord[];
  selectedCase?: CaseRecord | null;
  suspects?: SuspectProfile[];
  evidenceList?: EvidenceRecord[];
  officer?: OfficerProfile | null;
  onSelectCase?: (c: CaseRecord) => void;
}

type AIAction =
  | 'summarize'
  | 'connections'
  | 'compare'
  | 'gaps'
  | 'alert'
  | null;

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onNavigate,
  cases = [],
  selectedCase,
  suspects = [],
  evidenceList = [],
  officer,
}) => {
  const { t } = useLanguage();
  const [selectedAction, setSelectedAction] = useState<AIAction>(null);
  const [activeCaseId, setActiveCaseId] = useState<string>(
    selectedCase?.id || cases[0]?.id || 'CASE-0102'
  );

  const currentActiveCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  // 5 actions specified in Section 10
  const actions = [
    {
      id: 'summarize' as const,
      label: t('Summarize Case'),
      icon: FileText,
      description: t('Generate concise executive brief of active criminal proceedings'),
    },
    {
      id: 'connections' as const,
      label: t('Find Important Connections'),
      icon: Network,
      description: t('Highlight high-degree suspect links, common vehicles, and burner phones'),
    },
    {
      id: 'compare' as const,
      label: t('Compare Related Cases'),
      icon: GitCompare,
      description: t('Correlate modus operandi and telemetry overlap across departments'),
    },
    {
      id: 'gaps' as const,
      label: t('Find Investigation Gaps'),
      icon: AlertCircle,
      description: t('Detect missing evidence chains, unverified vehicle plates, and alibis'),
    },
    {
      id: 'alert' as const,
      label: t('Explain This Alert'),
      icon: HelpCircle,
      description: t('Clarify algorithmic rationale behind latest priority intelligence flags'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-slate-900">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <span>{t('CrimeX Inspector AI')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-700 border border-blue-200">
              Gemini-3.8-Flash
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            {t('AI detective assistance providing clues, suspect relationships, and cross-case comparisons to solve investigations faster.')}
          </p>
        </div>

        {/* Case Selector Dropdown */}
        {cases.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              {t('Active Case')}:
            </span>
            <select
              id="ai-assistant-view-case-select"
              value={activeCaseId}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {t(c.title)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Embedded Live Interactive AI Case Detective Assistant for Active Case */}
      {currentActiveCase && (
        <div className="space-y-3">
          <AICaseAssistant
            caseItem={currentActiveCase}
            allCases={cases}
            suspects={suspects}
            evidenceList={evidenceList}
            officer={officer}
          />
        </div>
      )}

      {/* Quick Inquiries Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
            {t('Quick Diagnostic Inquiries')}
          </h2>
        </div>

        {/* 5 Large Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            const isSelected = selectedAction === act.id;

            return (
              <button
                key={act.id}
                id={`btn-ai-${act.id}`}
                type="button"
                onClick={() => setSelectedAction(act.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-black text-white border-black ring-2 ring-blue-600/50'
                    : 'bg-white border-slate-200 hover:border-black hover:bg-slate-50/80 text-black'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm tracking-tight">{act.label}</h3>
                </div>
                <p
                  className={`text-[11px] leading-relaxed font-medium ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {act.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Clean AI Response Panel - Shown when a button is clicked */}
        {selectedAction && currentActiveCase && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">
                  {actions.find((a) => a.id === selectedAction)?.label} — {currentActiveCase.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="text-xs text-slate-400 hover:text-black cursor-pointer font-bold"
              >
                {t('Clear')}
              </button>
            </div>

            {/* 1. Summarize Case Content */}
            {selectedAction === 'summarize' && (
              <div className="space-y-3 text-sm text-slate-700">
                <p className="bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed font-medium">
                  <strong className="text-black">{currentActiveCase.id} {t('Summary')}:</strong> {t(currentActiveCase.summary)}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block font-bold uppercase text-[10px]">{t('Lead Department')}</span>
                    <span className="font-bold text-black text-sm">{t(currentActiveCase.department)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block font-bold uppercase text-[10px]">{t('Priority Level')}</span>
                    <span className="font-bold text-red-600 text-sm">{t(currentActiveCase.priority)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Find Important Connections Content */}
            {selectedAction === 'connections' && (
              <div className="space-y-3 text-sm text-slate-700">
                <p className="text-xs text-slate-600 font-bold">
                  {t('Found critical linkage nodes across police registries for')} {currentActiveCase.id}:
                </p>
                <ul className="space-y-2 text-xs">
                  <li className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-blue-600">•</span>
                    <span>
                      <strong className="text-black">{t('Telecom Intercept')}:</strong> {t('Shared telecommunications tower ping at Location Y within 15 minutes of reported financial layering event.')}
                    </span>
                  </li>
                  <li className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                    <span className="font-bold text-blue-600">•</span>
                    <span>
                      <strong className="text-black">{t('Vehicle Telemetry')}:</strong> {t("Vehicle sighting near crime exit route correlates with secondary suspect's address.")}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* 3. Compare Related Cases Content */}
            {selectedAction === 'compare' && (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    {currentActiveCase.id} vs. {t('Regional Cases Correlation')}:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {t('High similarity detected')} (<span className="font-bold text-blue-600">88%</span>). {t('Common Modus Operandi includes multi-hop fund laundering, vehicle switching at highway bypasses, and coordinated communications silence.')}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Find Investigation Gaps Content */}
            {selectedAction === 'gaps' && (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="space-y-2">
                  {currentActiveCase.investigationGaps && currentActiveCase.investigationGaps.length > 0 ? (
                    currentActiveCase.investigationGaps.map((gap, idx) => (
                      <div key={idx} className="p-3 bg-red-50/60 rounded-lg border border-red-200 text-xs text-red-950 font-medium">
                        <strong className="text-red-700">{t('Gap')} {idx + 1}:</strong> {t(gap)}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-3 bg-red-50/60 rounded-lg border border-red-200 text-xs text-red-950 font-medium">
                        <strong className="text-red-700">{t('Gap')} 1:</strong> {t('Vehicle ownership transfer papers remain unverified by regional RTO.')}
                      </div>
                      <div className="p-3 bg-red-50/60 rounded-lg border border-red-200 text-xs text-red-950 font-medium">
                        <strong className="text-red-700">{t('Gap')} 2:</strong> {t('28-minute surveillance blind spot along Route 4 corridor (10:14 – 10:42 AM).')}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 5. Explain This Alert Content */}
            {selectedAction === 'alert' && (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 border-l-4 border-l-red-600 space-y-2 text-xs">
                  <div className="font-extrabold text-black">
                    {t('Trigger: Multi-Jurisdiction ANPR Alert')}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {t('Vehicle identified passing toll plaza at 03:15 AM carrying simulated plates matching an impounded vehicle from 2024. System escalated case priority to')} <span className="font-bold text-red-600">{t(currentActiveCase.priority)}</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

