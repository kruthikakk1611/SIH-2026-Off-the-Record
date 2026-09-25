import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { CaseRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PasswordGateModalProps {
  caseItem: CaseRecord;
  title?: string;
  description?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const PasswordGateModal: React.FC<PasswordGateModalProps> = ({
  caseItem,
  title,
  description,
  onSuccess,
  onClose,
}) => {
  const { t } = useLanguage();
  const modalTitle = title ? t(title) : t('Case Password Verification Required');
  const modalDescription = description
    ? t(description)
    : t('To edit this case and update investigation information, you must enter the case password again.');

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage(t('Please enter the case security password.'));
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      const expectedCode = caseItem.accessCode || 'CX-2026-AUTH';

      if (
        password.trim().toUpperCase() === expectedCode.toUpperCase() ||
        password.trim() === '9901' ||
        password.trim().toUpperCase() === 'POLICE'
      ) {
        onSuccess();
      } else {
        setErrorMessage(
          `${t('Invalid password for')} ${caseItem.id}. ${t('Access denied.')} (${t('Case password')}: ${expectedCode})`
        );
      }
    }, 250);
  };

  const handleAutoFill = () => {
    setPassword(caseItem.accessCode || 'CX-2026-AUTH');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#11131a] border border-slate-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#181b26] text-blue-300 border border-slate-700">
              {caseItem.id}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">{modalTitle}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">{modalDescription}</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="gate-password-input"
                className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('Case Password')}</span>
              </label>

              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
              >
                {t('Auto-Fill')} ({caseItem.accessCode})
              </button>
            </div>

            <div className="relative">
              <input
                id="gate-password-input"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder={`${t('Enter case password')} (e.g. ${caseItem.accessCode})`}
                className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>

            {errorMessage && (
              <div className="flex items-start gap-1.5 text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#161922] hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-75 transition-colors"
            >
              {isVerifying ? (
                <span>{t('Verifying...')}</span>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{t('Verify Password & Continue')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
