import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Lock, Check, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../data/translations';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [autoLockMinutes, setAutoLockMinutes] = useState('15');
  const [alertSound, setAlertSound] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('Settings')}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {t('Workstation security parameters, notification triggers, and terminal preferences.')}
        </p>
      </div>

      {/* Language Preference Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">{t('Display Language')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                id={`settings-lang-${lang.code}`}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="block text-sm">{lang.nativeName}</span>
                  <span className="text-[11px] text-slate-500">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Preferences */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-700" />
          <h2 className="text-base font-bold text-slate-900">{t('Workstation Security')}</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="font-semibold text-slate-900 block">{t('Session Inactivity Lock')}</span>
              <span className="text-slate-500">{t('Automatically prompt code lock after idle duration')}</span>
            </div>
            <select
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:outline-none"
            >
              <option value="5">5 {t('minutes')}</option>
              <option value="15">15 {t('minutes')}</option>
              <option value="30">30 {t('minutes')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="font-semibold text-slate-900 block">{t('Critical Alert Chimes')}</span>
              <span className="text-slate-500">{t('Audible notification for immediate ANPR red-flags')}</span>
            </div>
            <input
              type="checkbox"
              checked={alertSound}
              onChange={(e) => setAlertSound(e.target.checked)}
              className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800 cursor-pointer"
            >
            </input>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-semibold text-slate-900 block">{t('Chain of Custody Ledger')}</span>
              <span className="text-slate-500">{t('Forensic block validation on file upload')}</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {t('ENFORCED')}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0c1527] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('Preferences Saved')}</span>
              </>
            ) : (
              <span>{t('Save Preferences')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
