import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ListFilter,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { CaseRecord, SuspectProfile, EvidenceRecord } from '../types';
import {
  getCaseCompletenessAnalysis,
  MissingInfoItem,
} from '../data/caseInvestigationAnalysis';
import { useLanguage } from '../context/LanguageContext';

interface MissingInfoMeterCardProps {
  caseItem: CaseRecord;
  suspects?: SuspectProfile[];
  evidenceList?: EvidenceRecord[];
}

export const MissingInfoMeterCard: React.FC<MissingInfoMeterCardProps> = ({
  caseItem,
  suspects = [],
  evidenceList = [],
}) => {
  const { t } = useLanguage();
  const analysis = getCaseCompletenessAnalysis(caseItem, suspects, evidenceList);
  const [activeTab, setActiveTab] = useState<'missing' | 'complete' | 'all'>('missing');

  const missingItems = analysis.items.filter((item) => !item.isCompleted);
  const completedItems = analysis.items.filter((item) => item.isCompleted);

  return (
    <div
      id="case-missing-information-card"
      className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
    >
      {/* 1. Header: # MISSING INFORMATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-black tracking-tight uppercase">
                # {t('MISSING INFORMATION')}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                CASE {caseItem.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated audit of statutory investigation elements across FIR, identity, witnesses & forensics.
            </p>
          </div>
        </div>

        {/* Completeness / Missing Stats */}
        <div className="flex items-center gap-3 self-start sm:self-auto font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              {t('Case Completeness')}
            </span>
            <span className="text-base font-black text-emerald-600">
              {analysis.completenessPercentage}% {t('Complete')}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              {t('Missing Information')}
            </span>
            <span className="text-base font-black text-red-600">
              {analysis.missingPercentage}% {t('Missing')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Progress / Meter Bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap justify-between text-xs font-bold gap-2">
          <span className="text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {t('Documented & Verified')}: {analysis.completedCount} checkpoints ({analysis.completenessPercentage}%)
            </span>
          </span>
          <span className="text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>
              {t('Missing Evidence')}: {analysis.missingCount} checkpoints ({analysis.missingPercentage}%)
            </span>
          </span>
        </div>

        <div className="w-full h-4 bg-red-100 rounded-full overflow-hidden flex shadow-inner border border-slate-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-l-full"
            style={{ width: `${analysis.completenessPercentage}%` }}
            title={`Completed: ${analysis.completenessPercentage}%`}
          />
          <div
            className="h-full bg-red-500 transition-all duration-500 rounded-r-full"
            style={{ width: `${analysis.missingPercentage}%` }}
            title={`Missing: ${analysis.missingPercentage}%`}
          />
        </div>
      </div>

      {/* 3. Filter Tabs: What is Missing vs What is Complete */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 text-xs font-bold">
          <button
            type="button"
            id="tab-filter-missing-info"
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'missing'
                ? 'bg-red-600 text-white shadow-xs font-extrabold'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('Missing Elements')} ({missingItems.length})</span>
          </button>

          <button
            type="button"
            id="tab-filter-completed-info"
            onClick={() => setActiveTab('complete')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'complete'
                ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('Completed Elements')} ({completedItems.length})</span>
          </button>

          <button
            type="button"
            id="tab-filter-all-info"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-xs font-extrabold'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            <span>{t('All')} ({analysis.items.length})</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          {t('Active Case')}: {caseItem.id}
        </span>
      </div>

      {/* 4. Missing Information List (Visible & Clear) */}
      {(activeTab === 'missing' || activeTab === 'all') && (
        <div className="space-y-2.5">
          <div className="text-xs font-extrabold text-red-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{t('CURRENTLY MISSING FROM INVESTIGATION')}:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {missingItems.map((item, idx) => (
              <div
                key={`missing-${idx}`}
                className="p-3.5 rounded-xl bg-red-50/60 border border-red-200/90 text-xs space-y-1.5 flex flex-col justify-between hover:bg-red-50 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-red-600 font-extrabold text-sm">⚠</span>
                      <span>{t(item.title)}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                        item.impact === 'High'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-400 text-black'
                      }`}
                    >
                      {t(item.impact)} {t('Impact')}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-snug">
                    {t(item.description)}
                  </p>
                </div>

                <div className="pt-2 border-t border-red-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">{t('Action Needed')}:</span>
                  <span className="text-red-700 font-semibold">{t(item.actionNeeded)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Completed Information List (Visible & Clear) */}
      {(activeTab === 'complete' || activeTab === 'all') && (
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('ALREADY DOCUMENTED & COMPLETED IN CASE')}:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {completedItems.map((item, idx) => (
              <div
                key={`complete-${idx}`}
                className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1 hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-emerald-600 font-extrabold text-sm">✓</span>
                    <span>{t(item.title)}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {t(item.category)}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{t(item.description)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI Recommendations Footer */}
      <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
        <div className="text-slate-800">
          <strong className="text-blue-950">{t('Recommended Immediate Action')}: </strong>
          {t(analysis.recommendedImmediateAction)}
        </div>
      </div>
    </div>
  );
};
