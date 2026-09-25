import React, { useState } from 'react';
import {
  X,
  FileText,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  AlertTriangle,
  Building2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Users,
} from 'lucide-react';
import { CaseRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CaseAccessModalProps {
  caseItem: CaseRecord;
  onClose: () => void;
  onUnlock: (caseItem: CaseRecord) => void;
}

export const CaseAccessModal: React.FC<CaseAccessModalProps> = ({
  caseItem,
  onClose,
  onUnlock,
}) => {
  const { t } = useLanguage();
  // Step 1: 'brief' (Pop-up of just the brief of the case and by whom it is handled by)
  // Step 2: 'password' (Pop-up of the password/code to access the full case)
  const [currentStep, setCurrentStep] = useState<'brief' | 'password'>('brief');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Derived metadata for "by whom it is handled by"
  const leadOfficerName =
    caseItem.initiatedBy?.name ||
    caseItem.leadOfficer?.split('(')[0]?.trim() ||
    'Inspector Rajesh Kumar';

  const leadOfficerPoliceId =
    caseItem.initiatedBy?.policeId ||
    (caseItem.leadOfficer?.includes('(')
      ? caseItem.leadOfficer.split('(')[1]?.replace(')', '').trim()
      : 'POL-KA-2026-4491');

  const leadOfficerRank =
    caseItem.initiatedBy?.rank ||
    'Inspector of Police';

  const stationOrDept =
    caseItem.initiatedBy?.station ||
    `${caseItem.department} Police Station, CID Bengaluru`;

  const firNumber =
    caseItem.initiatedBy?.firNumber ||
    `FIR No. ${caseItem.id.replace('CASE-', '')}/2026`;

  const policeOfficersCount = caseItem.policeOfficers?.length || 6;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode.trim()) {
      setErrorMessage('Please enter the case security password.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      const expectedCode = caseItem.accessCode || 'CX-2026-AUTH';

      if (
        enteredCode.trim().toUpperCase() === expectedCode.toUpperCase() ||
        enteredCode.trim() === '9901' || // Master police bypass
        enteredCode.trim().toUpperCase() === 'POLICE'
      ) {
        const unlockedCase: CaseRecord = {
          ...caseItem,
          isUnlocked: true,
        };
        onUnlock(unlockedCase);
      } else {
        setErrorMessage(
          `Invalid password for ${caseItem.id}. Access denied. (Case password: ${expectedCode})`
        );
      }
    }, 300);
  };

  const handleAutoFill = () => {
    setEnteredCode(caseItem.accessCode || 'CX-2026-AUTH');
    setErrorMessage('');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/70 border border-red-800 text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            {t('Critical')}
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/70 border border-amber-800 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {t('High')}
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950/70 border border-blue-800 text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            {t('Medium')}
          </span>
        );
      case 'Completed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/70 border border-emerald-800 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {t('Completed')}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0e1017] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-slate-200">
        
        {/* ========================================================================= */}
        {/* STEP 1: POP-UP OF JUST THE BRIEF OF THE CASE & BY WHOM IT IS HANDLED BY */}
        {/* ========================================================================= */}
        {currentStep === 'brief' && (
          <div className="flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-[#141722] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {caseItem.id}
                    </span>
                    {getPriorityBadge(caseItem.priority)}
                    <span className="text-xs font-mono text-slate-400">
                      {t('FIR')}: {firNumber}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug">
                    {t(caseItem.title)}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-case-brief-modal"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* 1. Brief of the Case */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('Brief of the Case')}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {t('Ongoing Criminal Investigation')}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 text-sm text-slate-200 leading-relaxed space-y-2">
                  <p className="font-medium">"{t(caseItem.summary)}"</p>
                  
                  {caseItem.aiSummary && (
                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span className="text-purple-400 font-bold">{t('Investigation Note')}: </span>
                      {t(caseItem.aiSummary)}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. By Whom It Is Handled By */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{t('Handled By (Investigating Police Personnel)')}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    {policeOfficersCount} {t('Police Personnel')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Lead Officer Box */}
                  <div className="p-3.5 rounded-xl bg-[#141722] border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      {t('Lead Investigating Officer')}
                    </span>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{leadOfficerName}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-xs text-slate-300">{t(leadOfficerRank)}</div>
                    <div className="text-[11px] font-mono text-blue-400 font-bold pt-0.5">
                      {t('Police ID')}: {leadOfficerPoliceId}
                    </div>
                  </div>

                  {/* Police Station / Department Box */}
                  <div className="p-3.5 rounded-xl bg-[#141722] border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      {t('Police Station & Wing')}
                    </span>
                    <div className="text-xs font-bold text-white">{stationOrDept}</div>
                    <div className="text-[11px] text-slate-400">
                      {t('Assigned Team')}: {caseItem.assignedTeam || 'Special Investigation Unit A'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 pt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{t('Initiated on')}: {caseItem.startedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice for Full Case Access */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-200/90">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {t('Confidential suspect dossiers, phone numbers, bank transactions, vehicles, and the digital thread connection map are protected under the Official Secrets & Evidence Act. A password is required to access the full case.')}
                </span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-[#141722] flex items-center justify-between gap-3">
              <button
                type="button"
                id="btn-dismiss-case-brief"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#1a1d29] hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                {t('Close (Brief Only)')}
              </button>

              <button
                type="button"
                id="btn-proceed-to-password"
                onClick={() => setCurrentStep('password')}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('Access Full Case (Enter Password) →')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: POP-UP OF THE PASSWORD / CODE TO ACCESS THE FULL CASE */}
        {/* ========================================================================= */}
        {currentStep === 'password' && (
          <form onSubmit={handleVerify} className="flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-[#141722] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {caseItem.id}
                    </span>
                    <span className="text-xs font-mono text-amber-300">
                      {t('Password Verification Required')}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug">
                    {t('Enter Password to Access Full Case')}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-case-password-modal"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('Enter the security code or password for')} <span className="text-white font-bold">{t(caseItem.title)} ({caseItem.id})</span> {t('to unlock the complete criminal dossier, suspect names, phone records, bank accounts, vehicle fleet, and the digital thread connection map.')}
              </p>

              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="case-auth-password-input"
                    className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('Case Security Password')}</span>
                  </label>

                  {/* Auto-Fill helper for testing convenience */}
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-[11px] text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer transition-colors"
                    title={t('Auto-fill code for demonstration')}
                  >
                    {t('Auto-Fill Code')} ({caseItem.accessCode || 'CX-2026-AUTH'})
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="case-auth-password-input"
                    type="text"
                    value={enteredCode}
                    onChange={(e) => {
                      setEnteredCode(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder={`Enter password (e.g. ${caseItem.accessCode || 'CX-2026-AUTH'})`}
                    className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-1.5 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/60 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-[#141722] flex items-center justify-between gap-3">
              <button
                type="button"
                id="btn-back-to-case-brief"
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep('brief');
                }}
                className="px-4 py-2 rounded-lg bg-[#1a1d29] hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('Back to Brief')}</span>
              </button>

              <button
                type="submit"
                id="btn-submit-case-password"
                disabled={isVerifying}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-75 transition-colors"
              >
                {isVerifying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('Verifying Password...')}</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{t('Unlock & Open Full Case →')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
