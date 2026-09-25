import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  Activity,
  Lightbulb,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { CaseRecord, SuspectProfile, EvidenceRecord } from '../types';
import {
  getCaseDeadEndAnalysis,
  DeadEndLoopAnalysis,
} from '../data/caseInvestigationAnalysis';
import { useLanguage } from '../context/LanguageContext';

interface DeadEndLoopMeterCardProps {
  caseItem: CaseRecord;
  suspects?: SuspectProfile[];
  evidenceList?: EvidenceRecord[];
  onNavigateToSection?: (section: string) => void;
}

export const DeadEndLoopMeterCard: React.FC<DeadEndLoopMeterCardProps> = ({
  caseItem,
  suspects = [],
  evidenceList = [],
  onNavigateToSection,
}) => {
  const { t } = useLanguage();
  const analysis = getCaseDeadEndAnalysis(caseItem, suspects, evidenceList);
  const [showIndicators, setShowIndicators] = useState(true);

  const isHighRisk = analysis.loopRisk === 'High';
  const isModerateRisk = analysis.loopRisk === 'Moderate';

  // Momentum display mapping
  const momentumColor =
    analysis.momentumStatus === 'Investigation Stalled'
      ? 'text-red-400 bg-red-950/80 border-red-800'
      : analysis.momentumStatus === 'At Risk of Investigation Loop'
      ? 'text-amber-300 bg-amber-950/80 border-amber-800'
      : 'text-emerald-400 bg-emerald-950/80 border-emerald-800';

  const riskColor =
    analysis.loopRisk === 'High'
      ? 'text-red-400 bg-red-950/90 border-red-800'
      : analysis.loopRisk === 'Moderate'
      ? 'text-amber-400 bg-amber-950/90 border-amber-800'
      : 'text-emerald-400 bg-emerald-950/90 border-emerald-800';

  return (
    <div
      id="case-investigation-momentum-card"
      className="bg-[#0b0e14] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 text-white shadow-md space-y-5"
    >
      {/* 1. Header: # INVESTIGATION MOMENTUM / DEAD END METER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              isHighRisk
                ? 'bg-red-950 text-red-400 border-red-800'
                : isModerateRisk
                ? 'bg-amber-950 text-amber-400 border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}
          >
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight uppercase">
                # {t('INVESTIGATION MOMENTUM / DEAD END METER')}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{t('AI-ASSISTED INVESTIGATIVE AID')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Suggestive telemetry evaluating inquiry repetition, stalled evidentiary threads, and circular questioning.
            </p>
          </div>
        </div>

        {/* Case Badge */}
        <div className="font-mono text-xs text-slate-400 self-start sm:self-auto">
          {t('Case')}: <strong className="text-blue-400 font-bold">{caseItem.id}</strong>
        </div>
      </div>

      {/* 2. Mandatory Disclaimer Notice */}
      <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl flex items-start gap-2.5 text-xs text-purple-200">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">{t('Investigative Notice')}: </strong>
          {t('This meter functions strictly as an AI-assisted investigative aid. It is not an absolute judgment of case validity, but an analytical alert designed to prevent circular inquiry loops and identify blind spots.')}
        </p>
      </div>

      {/* 3. Primary Status Display: Momentum Status & Risk Level */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Momentum Status */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {t('Investigation Momentum')}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${momentumColor}`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t(analysis.momentumStatus)}</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Current inquiry pace & evidence intake
          </span>
        </div>

        {/* Risk Level */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {t('Dead End / Loop Risk')}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${riskColor}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t(analysis.loopRisk)} {t('Risk')} ({analysis.loopRiskScore}/100)</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Probability of circular investigative path
          </span>
        </div>

        {/* Repetitive Inquiry Gauge */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {t('Inquiry Repetition Entropy')}
          </span>
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-300">{t('Repetitive Pattern')}:</span>
            <span
              className={
                analysis.repetitiveInterrogationPattern ? 'text-red-400' : 'text-emerald-400'
              }
            >
              {analysis.repetitiveInterrogationPattern ? t('Detected') : t('None Detected')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-300">{t('Days Since Last Evidence')}:</span>
            <span className="text-amber-300">{analysis.daysSinceNewEvidence} {t('days')}</span>
          </div>
        </div>
      </div>

      {/* 4. Explanation of Why This Status Was Given */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
            {t('Why This Status Was Assigned')}:
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {t(analysis.summaryExplanation)}
        </p>

        {/* Concrete contributing factors */}
        <div className="space-y-2 pt-1">
          {analysis.deadEndFactors.map((factor, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs"
            >
              <div className="mt-0.5 shrink-0 text-amber-400 font-bold">•</div>
              <div className="text-slate-300">
                <span className="text-white font-bold">{t(factor.title)}: </span>
                <span>{t(factor.description)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Suggested Next Steps to Break the Loop */}
      <div className="bg-blue-950/30 border border-blue-800/60 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h3 className="text-xs font-extrabold text-blue-200 uppercase tracking-wider">
              {t('Suggested Next Steps to Break the Loop')}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-blue-400">
            {analysis.loopBreakingRecommendations.length} {t('Actionable Leads')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {analysis.loopBreakingRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950/80 border border-blue-900/60 rounded-xl flex flex-col justify-between gap-2 text-xs hover:border-blue-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <span className="text-blue-400">#{idx + 1}</span>
                  <span>{t(rec.actionTitle)}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1 leading-snug">
                  {t(rec.reasoning)}
                </p>
              </div>

              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">{t('Target')}: {rec.targetSection}</span>
                {onNavigateToSection && (
                  <button
                    type="button"
                    onClick={() => onNavigateToSection(rec.targetSection)}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('Execute')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
