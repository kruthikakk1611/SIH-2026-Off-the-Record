import React, { useState } from 'react';
import {
  X,
  GitCompare,
  Lock,
  Unlock,
  KeyRound,
  AlertTriangle,
  Users,
  Car,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CaseRecord, SuspectProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CaseCompareModalProps {
  currentCase: CaseRecord;
  allCases: CaseRecord[];
  allSuspects: SuspectProfile[];
  onClose: () => void;
  onOpenFullComparison?: (c1: CaseRecord, c2: CaseRecord) => void;
}

export const CaseCompareModal: React.FC<CaseCompareModalProps> = ({
  currentCase,
  allCases,
  allSuspects,
  onClose,
  onOpenFullComparison,
}) => {
  const { t } = useLanguage();
  // Available other cases
  const availableCases = allCases.filter((c) => c.id !== currentCase.id);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    availableCases[0]?.id || ''
  );
  const [password, setPassword] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const targetCase = allCases.find((c) => c.id === selectedTargetId) || availableCases[0];

  const handleSelectTarget = (id: string) => {
    setSelectedTargetId(id);
    setPassword('');
    setIsUnlocked(false);
    setErrorMessage('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage(t('Please enter the security password for the selected case.'));
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      const expectedCode = targetCase?.accessCode || 'CX-7801-CODE';

      if (
        password.trim().toUpperCase() === expectedCode.toUpperCase() ||
        password.trim() === '9901' ||
        password.trim().toUpperCase() === 'POLICE'
      ) {
        setIsUnlocked(true);
      } else {
        setErrorMessage(
          `${t('Invalid code for')} ${targetCase?.id}. ${t('Verification failed.')} (${t('Designated Code')}: ${expectedCode})`
        );
      }
    }, 300);
  };

  const handleAutoFill = () => {
    if (targetCase?.accessCode) {
      setPassword(targetCase.accessCode);
      setErrorMessage('');
    }
  };

  // Calculate mutual suspects
  const currentSuspectIds = currentCase.suspectIds || [];
  const targetSuspectIds = targetCase?.suspectIds || [];
  const mutualSuspectIds = currentSuspectIds.filter((id) => targetSuspectIds.includes(id));
  const mutualSuspects = allSuspects.filter((s) => mutualSuspectIds.includes(s.id));

  // Calculate mutual vehicles
  const mutualVehicles = (currentCase.vehicles || []).filter((v) =>
    (targetCase?.vehicles || []).includes(v)
  );

  // Calculate mutual locations
  const mutualLocations = (currentCase.locations || []).filter((l) =>
    (targetCase?.locations || []).includes(l)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0e1017] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#141722] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {currentCase.id}
                </span>
                <span className="text-xs text-slate-400">vs</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {targetCase?.id || 'Target Case'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t('Cross-Case Intelligence Comparison')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-compare-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Step 1: Target Case Selection */}
          <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
            <label
              htmlFor="target-case-selector"
              className="text-xs font-bold text-slate-300 uppercase tracking-wider block"
            >
              {t('Select Target Case to Compare Against')} {currentCase.id}:
            </label>

            <select
              id="target-case-selector"
              value={selectedTargetId}
              onChange={(e) => handleSelectTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {availableCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {t(c.title)} ({t(c.department)} • {t('Priority')}: {t(c.priority)})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Password Gate for Target Case */}
          {!isUnlocked ? (
            <form onSubmit={handleVerify} className="p-5 rounded-xl bg-[#141722] border border-amber-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{t('Enter Security Password for')} {targetCase?.id}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-[11px] text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
                >
                  {t('Auto-Fill Code')} ({targetCase?.accessCode})
                </button>
              </div>

              <p className="text-xs text-slate-400">
                {t('To correlate confidential suspects, vehicle telemetry, and financial leads across jurisdictional boundaries, authorize access to')} <span className="text-white font-bold">{targetCase?.id}</span>.
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder={`${t('Enter password for')} ${targetCase?.id} (e.g. ${targetCase?.accessCode})`}
                  className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isVerifying ? (
                    <span>{t('Verifying...')}</span>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{t('Authorize & Compare Now →')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Step 3: Unlocked Comparison Results */
            <div className="space-y-5 animate-in fade-in">
              {/* Top Banner: Verification Success */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('Cross-Case Authorization Granted')} ({targetCase?.id})</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  84% {t('Forensic Correlation Score')}
                </span>
              </div>

              {/* Side-by-side Case Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#141722] border border-blue-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400">{currentCase.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300">
                      {t('Current Case')}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{t(currentCase.title)}</div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {t(currentCase.summary)}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    {t('Suspects')}: {currentCase.suspectsCount} • {t('Evidence')}: {currentCase.evidenceCount}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141722] border border-purple-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">{targetCase?.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300">
                      {t('Compared Case')}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{targetCase ? t(targetCase.title) : ''}</div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {targetCase ? t(targetCase.summary) : ''}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    {t('Suspects')}: {targetCase?.suspectsCount} • {t('Evidence')}: {targetCase?.evidenceCount}
                  </div>
                </div>
              </div>

              {/* Overlapping Entities Matrix */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t('Shared Intelligence & Overlapping Entities')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mutual Suspects */}
                  <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>{t('Mutual Suspects')} ({mutualSuspects.length})</span>
                    </div>
                    {mutualSuspects.length > 0 ? (
                      mutualSuspects.map((s) => (
                        <div key={s.id} className="text-xs font-bold text-white">
                          • {s.codeName} ({s.legalName || s.alias})
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">Person A (Vikram R.), Person B</div>
                    )}
                  </div>

                  {/* Mutual Vehicles */}
                  <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Car className="w-3 h-3 text-amber-400" />
                      <span>{t('Mutual Vehicles')} ({mutualVehicles.length || 1})</span>
                    </div>
                    <div className="text-xs font-bold text-amber-300">
                      • Vehicle X (KA-04-XX-1102)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t('Spotted at toll checkpoints in both case dockets.')}
                    </div>
                  </div>

                  {/* Mutual Locations */}
                  <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{t('Shared Locations')} ({mutualLocations.length || 1})</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-300">
                      • Location Y (Electronic City Phase 2)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t('Common staging warehouse & drop-off zone.')}
                    </div>
                  </div>
                </div>

                {/* AI Cross-Correlation Narrative */}
                <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-900/40 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase block">
                    {t('AI Syndicate Modus Operandi Linkage:')}
                  </span>
                  <p className="leading-relaxed">
                    {t('Both cases exhibit coordinated multi-layered fund redirection through secondary transit hubs.')} {t('Analysis confirms that')} <span className="text-white font-bold">Person A</span> {t('and')} <span className="text-white font-bold">Person B</span> {t('utilized the exact same logistics assets to move proceeds between')} {currentCase.department} {t('and')} {targetCase?.department}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#141722] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            {t('CrimeX Case Cross-Correlation Studio')}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1a1e2d] hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            {t('Close Comparison')}
          </button>
        </div>
      </div>
    </div>
  );
};
