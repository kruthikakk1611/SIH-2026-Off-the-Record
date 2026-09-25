import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Fingerprint,
  FileBadge,
  RefreshCw,
  ExternalLink,
  Lock,
  Building,
  UserCheck,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { SuspectProfile, CaseRecord } from '../types';
import {
  SuspectIdentityRecord,
  getIdentityForSuspect,
  saveSuspectIdentity,
} from '../data/suspectIdentityData';
import { useLanguage } from '../context/LanguageContext';

interface CaseIdentityVerificationSectionProps {
  caseItem: CaseRecord;
  suspects: SuspectProfile[];
  onIdentityChanged?: () => void;
  selectedSuspectId?: string;
  onSelectSuspect?: (suspect: SuspectProfile) => void;
}

export const CaseIdentityVerificationSection: React.FC<CaseIdentityVerificationSectionProps> = ({
  caseItem,
  suspects,
  onIdentityChanged,
  selectedSuspectId,
  onSelectSuspect,
}) => {
  const { t } = useLanguage();

  // Active selected suspect to verify
  const [activeSuspectId, setActiveSuspectId] = useState<string>(() => {
    if (selectedSuspectId) return selectedSuspectId;
    if (suspects.length > 0) return suspects[0].id;
    return 'SUS-01';
  });

  const activeSuspect =
    suspects.find((s) => s.id === activeSuspectId) ||
    suspects[0] || {
      id: 'SUS-01',
      codeName: 'Vikram Raghavan',
      legalName: 'Vikram Raghavan',
      status: 'Primary Suspect',
    };

  // Identity record for active suspect
  const [identity, setIdentity] = useState<SuspectIdentityRecord>(() =>
    getIdentityForSuspect(activeSuspect.id, activeSuspect.legalName || activeSuspect.codeName)
  );

  // Workflow state
  const [workflow, setWorkflow] = useState<'none' | 'aadhaar' | 'digilocker'>('none');
  const [step, setStep] = useState<number>(1); // 1: prompt, 2: in-progress, 3: completed
  const [isProcessing, setIsProcessing] = useState(false);
  const [maskedInput, setMaskedInput] = useState('XXXX-XXXX-1234');
  const [otpToken, setOtpToken] = useState('491204');

  // Handle switching active suspect
  const handleSwitchSuspect = (suspect: SuspectProfile) => {
    setActiveSuspectId(suspect.id);
    const rec = getIdentityForSuspect(suspect.id, suspect.legalName || suspect.codeName);
    setIdentity(rec);
    setWorkflow('none');
    setStep(1);
    if (onSelectSuspect) onSelectSuspect(suspect);
  };

  // Start Aadhaar workflow
  const handleStartAadhaar = () => {
    setWorkflow('aadhaar');
    setStep(1);
  };

  // Start DigiLocker workflow
  const handleStartDigiLocker = () => {
    setWorkflow('digilocker');
    setStep(1);
  };

  // Execute Aadhaar demo verification
  const handleExecuteAadhaar = () => {
    setIsProcessing(true);
    setStep(2); // "Verification in progress..."

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

      const updated: SuspectIdentityRecord = {
        suspectId: activeSuspect.id,
        identityStatus: 'Verified',
        verificationSource: 'Aadhaar',
        verificationStatus: 'Verified',
        verificationTimestamp: timeStr,
        identityMatchStatus: 'Confirmed',
        aadhaarMasked: maskedInput.trim() || 'XXXX-XXXX-1234',
        aadhaarDemographicMatchScore: '99.8% Biometric & Demographic Match (UIDAI Central Registry)',
        aadhaarRegisteredState: 'Karnataka',
        digiLockerDocumentType: 'e-Aadhaar National Identity Record',
        digiLockerIssuingAuthority: 'Unique Identification Authority of India (UIDAI)',
        digiLockerVerifiedName: activeSuspect.legalName || activeSuspect.codeName,
        linkedToCaseId: caseItem.id,
      };

      saveSuspectIdentity(updated);
      setIdentity(updated);
      setIsProcessing(false);
      setStep(3); // "Identity Verified"
      if (onIdentityChanged) onIdentityChanged();
    }, 1400);
  };

  // Execute DigiLocker demo verification
  const handleExecuteDigiLocker = () => {
    setIsProcessing(true);
    setStep(2); // "Verification in progress..."

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

      const updated: SuspectIdentityRecord = {
        suspectId: activeSuspect.id,
        identityStatus: 'Verified',
        verificationSource: 'DigiLocker',
        verificationStatus: 'Verified',
        verificationTimestamp: timeStr,
        identityMatchStatus: 'Confirmed',
        aadhaarMasked: 'XXXX-XXXX-7341',
        aadhaarDemographicMatchScore: '100% Cryptographic Match via National DigiLocker API',
        aadhaarRegisteredState: 'Karnataka',
        digiLockerDocumentType: 'e-Aadhaar & Permanent Account Number (PAN)',
        digiLockerIssuingAuthority: 'Ministry of Electronics & IT / UIDAI & Income Tax Department',
        digiLockerVerifiedName: activeSuspect.legalName || activeSuspect.codeName,
        digiLockerDocUri: `in.gov.digilocker:${activeSuspect.id.toLowerCase()}-uidai-pan`,
        digiLockerConsentTimestamp: timeStr,
        linkedToCaseId: caseItem.id,
      };

      saveSuspectIdentity(updated);
      setIdentity(updated);
      setIsProcessing(false);
      setStep(3); // "Identity Successfully Verified"
      if (onIdentityChanged) onIdentityChanged();
    }, 1400);
  };

  // Reset for re-testing
  const handleReset = () => {
    const updated: SuspectIdentityRecord = {
      suspectId: activeSuspect.id,
      identityStatus: 'Unverified',
      verificationSource: 'None',
      verificationStatus: 'Not Verified',
      identityMatchStatus: 'Pending Official Verification',
      aadhaarMasked: 'XXXX-XXXX-1234',
      linkedToCaseId: caseItem.id,
    };
    saveSuspectIdentity(updated);
    setIdentity(updated);
    setWorkflow('none');
    setStep(1);
    if (onIdentityChanged) onIdentityChanged();
  };

  const isVerified = identity.verificationStatus === 'Verified';
  const isPending = identity.verificationStatus === 'Verification Pending';

  return (
    <div
      id="case-identity-verification-card"
      className="bg-white border-2 border-blue-500/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
    >
      {/* 1. Header Section: # IDENTITY VERIFICATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-black tracking-tight uppercase">
                # {t('IDENTITY VERIFICATION')}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                {t('GOVT GATEWAY')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('Statutory verification via UIDAI Aadhaar & MeitY DigiLocker citizen registry.')}
            </p>
          </div>
        </div>

        {/* Global Case Suspect Count */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{t('Suspects in Case')}:</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800">
            {suspects.length}
          </span>
        </div>
      </div>

      {/* 2. Suspect Selector Bar */}
      {suspects.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {t('Select Suspect for Civic Verification')}:
          </div>
          <div className="flex flex-wrap gap-2">
            {suspects.map((s) => {
              const sIdent = getIdentityForSuspect(s.id, s.legalName || s.codeName);
              const sIsVerified = sIdent.verificationStatus === 'Verified';
              const isSelected = s.id === activeSuspect.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  id={`select-suspect-verify-${s.id}`}
                  onClick={() => handleSwitchSuspect(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{s.codeName}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected
                        ? sIsVerified
                          ? 'bg-emerald-400 text-black'
                          : 'bg-blue-800 text-blue-100'
                        : sIsVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sIsVerified ? `✓ ${t('Verified')}` : t('Not Verified')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Core Identity Verification Card for Active Suspect */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-md border border-slate-800 space-y-4">
        {/* Top Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              {t('Target Profile')}
            </span>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>{activeSuspect.legalName || activeSuspect.codeName}</span>
              <span className="font-mono text-xs text-blue-400">({activeSuspect.id})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Indicator */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {t('Identity Status')}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-md mt-0.5 ${
                  isVerified
                    ? 'bg-emerald-500 text-black'
                    : isPending
                    ? 'bg-amber-400 text-black'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {isVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('Verified')}</span>
                  </>
                ) : isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('Verification Pending')}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t('Not Verified')}</span>
                  </>
                )}
              </span>
            </div>

            {isVerified && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset verification to re-test demo workflow"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Available Sources & Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t('Available Sources')}
            </span>
            <div className="font-bold text-slate-200 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-orange-300">
                <Fingerprint className="w-3.5 h-3.5" /> Aadhaar
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1 text-blue-300">
                <FileBadge className="w-3.5 h-3.5" /> DigiLocker
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t('Verification Source')}
            </span>
            <div className="font-bold text-white mt-1">
              {identity.verificationSource === 'Aadhaar' ? (
                <span className="text-orange-400 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4" />
                  UIDAI Aadhaar
                </span>
              ) : identity.verificationSource === 'DigiLocker' ? (
                <span className="text-blue-400 flex items-center gap-1.5">
                  <FileBadge className="w-4 h-4" />
                  DigiLocker (MeitY)
                </span>
              ) : (
                <span className="text-slate-400 font-normal">None (Unlinked)</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t('Identity Match')}
            </span>
            <div className="font-bold mt-1">
              {isVerified ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {t('Confirmed')}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">Pending Verification</span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t('Verification Timestamp')}
            </span>
            <div className="font-mono text-slate-300 mt-1 truncate">
              {identity.verificationTimestamp || '—'}
            </div>
          </div>
        </div>

        {/* 4. Verified Link Card (When Verified) */}
        {isVerified && (
          <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 space-y-3 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-sm font-extrabold text-emerald-300">
                  {t('Identity Verified ✓')}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-700/60">
                {t('Suspect Dossier Linked')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
                <span className="text-slate-400 text-[10px] font-bold block uppercase">
                  {t('Masked Aadhaar')}
                </span>
                <span className="font-mono font-extrabold text-white text-sm block mt-0.5">
                  {identity.aadhaarMasked || 'XXXX-XXXX-1234'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Never displays full Aadhaar number (Privacy Protected).
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
                <span className="text-slate-400 text-[10px] font-bold block uppercase">
                  {t('Document Type')}
                </span>
                <span className="font-bold text-white text-xs block mt-0.5">
                  {identity.digiLockerDocumentType || 'e-Aadhaar & PAN Record'}
                </span>
                <span className="text-slate-400 text-[10px] block mt-1">
                  Issuing Authority: {identity.digiLockerIssuingAuthority || 'UIDAI / MeitY'}
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
                <span className="text-slate-400 text-[10px] font-bold block uppercase">
                  {t('Authenticated Match')}
                </span>
                <span className="font-bold text-emerald-400 text-sm block mt-0.5">
                  {identity.digiLockerVerifiedName || activeSuspect.legalName || activeSuspect.codeName}
                </span>
                <span className="text-slate-400 text-[10px] block mt-1">
                  {t('Status')}: <strong className="text-emerald-300">{t('Verified')}</strong> | {t('Match')}:{' '}
                  <strong className="text-emerald-300">{t('Confirmed')}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Primary Verification Actions (Aadhaar & DigiLocker Buttons) */}
        {!isVerified && workflow === 'none' && (
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id={`btn-verify-aadhaar-${activeSuspect.id}`}
              onClick={handleStartAadhaar}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{t('Verify with Aadhaar')}</span>
            </button>

            <button
              type="button"
              id={`btn-verify-digilocker-${activeSuspect.id}`}
              onClick={handleStartDigiLocker}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <FileBadge className="w-4 h-4" />
              <span>{t('Verify with DigiLocker')}</span>
            </button>
          </div>
        )}

        {/* 6. AADHAAR WORKFLOW:
            Identity Verification -> Aadhaar Verification -> Verification in progress... -> Identity Verified */}
        {workflow === 'aadhaar' && !isVerified && (
          <div className="bg-slate-800/90 border border-orange-500/50 rounded-xl p-4 space-y-4 animate-in fade-in">
            {/* Step Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 border-b border-slate-700 pb-2">
              <span className="text-slate-300">{t('Identity Verification')}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="text-orange-400">{t('Aadhaar Verification')}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={step === 2 ? 'text-orange-300 animate-pulse' : 'text-slate-500'}>
                {t('Verification in progress...')}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={step === 3 ? 'text-emerald-400' : 'text-slate-500'}>
                {t('Identity Verified')}
              </span>
            </div>

            {step === 1 && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  Query UIDAI Central Identification Gateway for suspect{' '}
                  <strong className="text-white">{activeSuspect.codeName}</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Masked Aadhaar Identifier (Demo)
                    </label>
                    <input
                      type="text"
                      id="input-masked-aadhaar"
                      value={maskedInput}
                      onChange={(e) => setMaskedInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-orange-500 outline-none"
                      placeholder="XXXX-XXXX-1234"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      * Fictional demo data only. Never displays full Aadhaar.
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Simulated OTP / Biometric Token
                    </label>
                    <input
                      type="text"
                      id="input-aadhaar-otp"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-orange-500 outline-none"
                      placeholder="491204"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Simulated law-enforcement cryptographic token.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkflow('none')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-execute-aadhaar"
                    onClick={handleExecuteAadhaar}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>{t('Initiate Aadhaar Verification')}</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-7 h-7 text-orange-400 animate-spin" />
                <div className="text-center">
                  <div className="text-sm font-bold text-white">{t('Verification in progress...')}</div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Querying UIDAI Central Verification Service & matching demographic record.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. DIGILOCKER WORKFLOW:
            Connect DigiLocker -> Verify Identity -> Verification in progress... -> Identity Successfully Verified */}
        {workflow === 'digilocker' && !isVerified && (
          <div className="bg-slate-800/90 border border-blue-500/50 rounded-xl p-4 space-y-4 animate-in fade-in">
            {/* Step Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 border-b border-slate-700 pb-2">
              <span className="text-blue-400">{t('Connect DigiLocker')}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="text-slate-300">{t('Verify Identity')}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={step === 2 ? 'text-blue-300 animate-pulse' : 'text-slate-500'}>
                {t('Verification in progress...')}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className={step === 3 ? 'text-emerald-400' : 'text-slate-500'}>
                {t('Identity Successfully Verified')}
              </span>
            </div>

            {step === 1 && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  Request authorized access to citizen digital document repository for{' '}
                  <strong className="text-white">{activeSuspect.codeName}</strong>.
                </p>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Document Types to Pull:</span>
                    <span className="font-mono text-blue-300">e-Aadhaar & PAN Card</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Issuing Authority:</span>
                    <span className="text-slate-200">UIDAI & Ministry of Electronics & IT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Citizen Target:</span>
                    <span className="text-white font-bold">{activeSuspect.legalName || activeSuspect.codeName}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkflow('none')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-execute-digilocker"
                    onClick={handleExecuteDigiLocker}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <FileBadge className="w-3.5 h-3.5" />
                    <span>{t('Connect & Verify Identity')}</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-7 h-7 text-blue-400 animate-spin" />
                <div className="text-center">
                  <div className="text-sm font-bold text-white">{t('Verification in progress...')}</div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authenticating credentials against National DigiLocker Repository.
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
