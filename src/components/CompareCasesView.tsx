import React, { useState } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import { CaseRecord, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CompareCasesViewProps {
  cases: CaseRecord[];
  initialCaseId1?: string;
  initialCaseId2?: string;
  onNavigate?: (page: NavPage) => void;
  onSelectCase?: (caseItem: CaseRecord) => void;
}

export const CompareCasesView: React.FC<CompareCasesViewProps> = ({
  cases,
  initialCaseId1 = 'CASE-0102',
  initialCaseId2 = 'CASE-0078',
}) => {
  const { t } = useLanguage();
  const [caseInput1, setCaseInput1] = useState<string>(initialCaseId1);
  const [caseInput2, setCaseInput2] = useState<string>(initialCaseId2);
  const [hasCompared, setHasCompared] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseInput1 || !caseInput2) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasCompared(true);
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Title as specified in Section 9 */}
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight">{t('Compare Cases')}</h1>
        <p className="text-sm text-slate-600 mt-0.5 font-medium">
          {t('Evaluate cross-case correlations between multiple investigative files.')}
        </p>
      </div>

      {/* Two Input Boxes and Compare Button as specified in Section 9 */}
      <form onSubmit={handleCompare} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              {t('First Case ID')}
            </label>
            <input
              type="text"
              id="input-compare-case-1"
              value={caseInput1}
              onChange={(e) => {
                setCaseInput1(e.target.value);
                setHasCompared(false);
              }}
              placeholder="e.g. CASE-0102"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-black placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              {t('Second Case ID')}
            </label>
            <input
              type="text"
              id="input-compare-case-2"
              value={caseInput2}
              onChange={(e) => {
                setCaseInput2(e.target.value);
                setHasCompared(false);
              }}
              placeholder="e.g. CASE-0078"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-black placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            id="btn-execute-compare"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-2.5 bg-black hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <span>{t('Analyzing records...')}</span>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                <span>{t('Compare')}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results ONLY shown after clicking Compare as specified in Section 9 */}
      {hasCompared && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <div className="text-3xl font-extrabold text-black font-mono tracking-tight">
                87% {t('Potential Similarity')}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('Comparing')} <span className="font-mono font-bold text-blue-600">{caseInput1}</span> {t('and')}{' '}
                <span className="font-mono font-bold text-blue-600">{caseInput2}</span>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-xs self-start sm:self-auto">
              {t('HIGH OVERLAP DETECTED')}
            </span>
          </div>

          {/* Simple metrics: Common Suspects, Common Vehicles, Common Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('Common Suspects')}</div>
              <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">2</div>
              <div className="text-[11px] text-slate-600 font-medium mt-1">{t('Person A, Person B')}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('Common Vehicles')}</div>
              <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">1</div>
              <div className="text-[11px] text-slate-600 font-medium mt-1">{t('Vehicle X (Black SUV)')}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('Common Locations')}</div>
              <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">3</div>
              <div className="text-[11px] text-slate-600 font-medium mt-1">{t('Location Y, Koramangala Hub')}</div>
            </div>
          </div>

          {/* Investigator Note as specified in Section 9 */}
          <div className="p-4 bg-slate-50 border border-slate-200 border-l-4 border-l-blue-600 rounded-lg text-sm text-slate-700 space-y-1">
            <div className="font-extrabold text-black">{t('Potential relationship detected.')}</div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t('Requires investigator verification. Multiple mutual entities corroborate shared logistics infrastructure between these cases.')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
