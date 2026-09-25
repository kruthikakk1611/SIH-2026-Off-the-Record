import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Fingerprint,
  FileBadge,
  ExternalLink,
  Lock,
  RefreshCw,
  Sparkles,
  Building,
  UserCheck,
  ArrowRight,
  Check,
} from 'lucide-react';
import {
  SuspectIdentityRecord,
  getIdentityForSuspect,
  saveSuspectIdentity,
} from '../data/suspectIdentityData';
import { SuspectProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface IdentityVerificationCardProps {
  suspect: SuspectProfile;
  caseId?: string;
  onIdentityUpdated?: (updated: SuspectIdentityRecord) => void;
  compact?: boolean;
}

export const IdentityVerificationCard: React.FC<IdentityVerificationCardProps> = ({
  suspect,
  caseId,
  onIdentityUpdated,
  compact = false,
}) => {
  const { t } = useLanguage();
  const [identity, setIdentity] = useState<SuspectIdentityRecord>(() =>
    getIdentityForSuspect(suspect.id, suspect.legalName || suspect.codeName)
  );

  const [activeWorkflow, setActiveWorkflow] = useState<'none' | 'aadhaar' | 'digilocker'>('none');
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [inputMaskedAadhaar, setInputMaskedAadhaar] = useState('XXXX-XXXX-1234');
  const [otpCode, setOtpCode] = useState('491204');

  const handleStartAadhaar = () => {
    setActiveWorkflow('aadhaar');
    setWorkflowStep(1);
  };

  const handleStartDigiLocker = () => {
    setActiveWorkflow('digilocker');
    setWorkflowStep(1);
  };

  const handleExecuteAadhaarVerification = () => {
    setIsVerifying(true);
    setWorkflowStep(2); // "Verification in progress..."

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

      const updated: SuspectIdentityRecord = {
        suspectId: suspect.id,
        identityStatus: 'Verified',
        verificationSource: 'Aadhaar',
        verificationStatus: 'Verified',
        verificationTimestamp: timeStr,
        identityMatchStatus: 'Confirmed',
        aadhaarMasked: inputMaskedAadhaar.trim() || 'XXXX-XXXX-1234',
        aadhaarDemographicMatchScore: '99.8% Biometric & Demographic Match (UIDAI Certified)',
        aadhaarRegisteredState: 'Karnataka',
        digiLockerDocumentType: 'e-Aadhaar National Identity Record',
        digiLockerIssuingAuthority: 'Unique Identification Authority of India (UIDAI)',
        digiLockerVerifiedName: suspect.legalName || suspect.alias || suspect.codeName,
        linkedToCaseId: caseId || 'CASE-0102',
      };

      saveSuspectIdentity(updated);
      setIdentity(updated);
      setIsVerifying(false);
      setWorkflowStep(3); // "Identity Verified"
      if (onIdentityUpdated) onIdentityUpdated(updated);
    }, 1200);
  };

  const handleExecuteDigiLockerVerification = () => {
    setIsVerifying(true);
    setWorkflowStep(2); // "Verification in progress..."

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

      const updated: SuspectIdentityRecord = {
        suspectId: suspect.id,
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
        digiLockerVerifiedName: suspect.legalName || suspect.alias || suspect.codeName,
        digiLockerDocUri: `in.gov.digilocker:${suspect.id.toLowerCase()}-uidai-pan`,
        digiLockerConsentTimestamp: timeStr,
        linkedToCaseId: caseId || 'CASE-0102',
      };

      saveSuspectIdentity(updated);
      setIdentity(updated);
      setIsVerifying(false);
      setWorkflowStep(3); // "Identity Successfully Verified"
      if (onIdentityUpdated) onIdentityUpdated(updated);
    }, 1200);
  };

  const handleResetVerification = () => {
    const updated: SuspectIdentityRecord = {
      suspectId: suspect.id,
      identityStatus: 'Unverified',
      verificationSource: 'None',
      verificationStatus: 'Not Verified',
      identityMatchStatus: 'Pending Official Verification',
      aadhaarMasked: 'XXXX-XXXX-1234',
      linkedToCaseId: caseId,
    };
    saveSuspectIdentity(updated);
    setIdentity(updated);
    setActiveWorkflow('none');
    setWorkflowStep(1);
    if (onIdentityUpdated) onIdentityUpdated(updated);
  };

  const isVerified = identity.verificationStatus === 'Verified';

  return (
    <div
      id={`identity-card-${suspect.id}`}
      className="bg-slate-900 border-2 border-blue-500/40 rounded-xl p-5 text-white shadow-md space-y-4"
    >
      {/* 1. Header Banner: # IDENTITY VERIFICATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isVerified
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-blue-600 text-white shadow-sm'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight uppercase">
                # {t('IDENTITY VERIFICATION')}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                GOVT GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory verification via UIDAI Aadhaar & MeitY DigiLocker citizen registry.
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-2.5 py-1 rounded text-xs font-extrabold flex items-center gap-1.5 shadow-2xs ${
              isVerified
                ? 'bg-emerald-500 text-black'
                : identity.verificationStatus === 'Verification Pending'
                ? 'bg-amber-400 text-black'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('Verified')}</span>
              </>
            ) : identity.verificationStatus === 'Verification Pending' ? (
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

          {isVerified && (
            <button
              type="button"
              onClick={handleResetVerification}
              title="Reset verification for demo re-testing"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
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

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('Verification Source')}
          </span>
          <span className="font-bold text-white mt-1 block flex items-center gap-1.5">
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
          </span>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
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

        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('Verification Timestamp')}
          </span>
          <span className="font-mono text-slate-300 mt-1 block truncate">
            {identity.verificationTimestamp || '—'}
          </span>
        </div>
      </div>

      {/* 3. Link Verified Identity to the Suspect */}
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
              {t('Linked to Suspect Dossier')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                {t('Masked Aadhaar')}
              </span>
              <span className="font-mono font-extrabold text-white text-sm block mt-0.5">
                {identity.aadhaarMasked || 'XXXX-XXXX-1234'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {t('Never displays full Aadhaar number (Privacy Protected).')}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                {t('Document Type')}
              </span>
              <span className="font-bold text-white text-xs block mt-0.5">
                {identity.digiLockerDocumentType || 'e-Aadhaar & PAN Record'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {t('Authority')}: {identity.digiLockerIssuingAuthority || 'UIDAI / MeitY'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                {t('Citizen Target Match')}
              </span>
              <span className="font-bold text-emerald-400 text-sm block mt-0.5">
                {identity.digiLockerVerifiedName || suspect.legalName || suspect.alias || suspect.codeName}
              </span>
              <span className="text-slate-400 text-[10px] block mt-1">
                {t('Status')}: <strong className="text-emerald-300">{t('Verified')}</strong> | {t('Match')}:{' '}
                <strong className="text-emerald-300">{t('Confirmed')}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Action Buttons (Verify with Aadhaar / Verify with DigiLocker) */}
      {!isVerified && activeWorkflow === 'none' && (
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            id={`btn-verify-aadhaar-${suspect.id}`}
            onClick={handleStartAadhaar}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{t('Verify with Aadhaar')}</span>
          </button>

          <button
            type="button"
            id={`btn-verify-digilocker-${suspect.id}`}
            onClick={handleStartDigiLocker}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <FileBadge className="w-4 h-4" />
            <span>{t('Verify with DigiLocker')}</span>
          </button>
        </div>
      )}

      {/* 5. AADHAAR WORKFLOW:
          Identity Verification -> Aadhaar Verification -> Verification in progress... -> Identity Verified */}
      {activeWorkflow === 'aadhaar' && !isVerified && (
        <div className="bg-slate-800/90 border border-orange-500/50 rounded-xl p-4 space-y-4 animate-in fade-in">
          {/* Breadcrumb Steps */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 border-b border-slate-700 pb-2">
            <span className="text-slate-300">{t('Identity Verification')}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-orange-400">{t('Aadhaar Verification')}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className={workflowStep === 2 ? 'text-orange-300 animate-pulse' : 'text-slate-500'}>
              {t('Verification in progress...')}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className={workflowStep === 3 ? 'text-emerald-400' : 'text-slate-500'}>
              {t('Identity Verified')}
            </span>
          </div>

          {workflowStep === 1 && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                {t('Submit demographic & biometric query to UIDAI Gateway for suspect')}{' '}
                <strong className="text-white">{suspect.codeName}</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    {t('Masked Aadhaar Identifier (Demo)')}
                  </label>
                  <input
                    type="text"
                    id={`input-aadhaar-masked-${suspect.id}`}
                    value={inputMaskedAadhaar}
                    onChange={(e) => setInputMaskedAadhaar(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-orange-500 outline-none"
                    placeholder="XXXX-XXXX-1234"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    * {t('Fictional demo data only. Never displays full Aadhaar.')}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    {t('Law Enforcement Biometric Token')}
                  </label>
                  <input
                    type="text"
                    id={`input-aadhaar-token-${suspect.id}`}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-orange-500 outline-none"
                    placeholder="491204"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {t('UIDAI sandbox authentication token.')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveWorkflow('none')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                >
                  {t('Cancel')}
                </button>
                <button
                  type="button"
                  id={`btn-confirm-aadhaar-${suspect.id}`}
                  onClick={handleExecuteAadhaarVerification}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>{t('Initiate Aadhaar Verification')}</span>
                </button>
              </div>
            </div>
          )}

          {workflowStep === 2 && (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-7 h-7 text-orange-400 animate-spin" />
              <div className="text-center">
                <div className="text-sm font-bold text-white">{t('Verification in progress...')}</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('Querying UIDAI Central Verification Service & matching demographic record.')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. DIGILOCKER WORKFLOW:
          Connect DigiLocker -> Verify Identity -> Verification in progress... -> Identity Successfully Verified */}
      {activeWorkflow === 'digilocker' && !isVerified && (
        <div className="bg-slate-800/90 border border-blue-500/50 rounded-xl p-4 space-y-4 animate-in fade-in">
          {/* Breadcrumb Steps */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 border-b border-slate-700 pb-2">
            <span className="text-blue-400">{t('Connect DigiLocker')}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-300">{t('Verify Identity')}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className={workflowStep === 2 ? 'text-blue-300 animate-pulse' : 'text-slate-500'}>
              {t('Verification in progress...')}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className={workflowStep === 3 ? 'text-emerald-400' : 'text-slate-500'}>
              {t('Identity Successfully Verified')}
            </span>
          </div>

          {workflowStep === 1 && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                {t('Establish citizen consent token & pull digital identity credentials for')}{' '}
                <strong className="text-white">{suspect.codeName}</strong>.
              </p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{t('Document Types to Pull')}:</span>
                  <span className="font-mono text-blue-300">e-Aadhaar & PAN Card</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{t('Issuing Authority')}:</span>
                  <span className="text-slate-200">UIDAI & Ministry of Electronics & IT</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{t('Citizen Target')}:</span>
                  <span className="text-white font-bold">{suspect.legalName || suspect.codeName}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveWorkflow('none')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                >
                  {t('Cancel')}
                </button>
                <button
                  type="button"
                  id={`btn-confirm-digilocker-${suspect.id}`}
                  onClick={handleExecuteDigiLockerVerification}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span>{t('Connect & Verify Identity')}</span>
                </button>
              </div>
            </div>
          )}

          {workflowStep === 2 && (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-7 h-7 text-blue-400 animate-spin" />
              <div className="text-center">
                <div className="text-sm font-bold text-white">{t('Verification in progress...')}</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('Authenticating credentials against National DigiLocker Repository.')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
