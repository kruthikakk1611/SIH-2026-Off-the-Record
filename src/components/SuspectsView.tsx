import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Phone,
  Car,
  MapPin,
  FileText,
  CreditCard,
  Globe,
  History,
  User,
  Shield,
  Clock,
} from 'lucide-react';
import { SuspectProfile, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SuspectsViewProps {
  suspects: SuspectProfile[];
  initialSelectedSuspect?: SuspectProfile | null;
  onOpenNetworkWithPerson?: (suspect: SuspectProfile) => void;
  onNavigate?: (page: NavPage) => void;
}

export const SuspectsView: React.FC<SuspectsViewProps> = ({
  suspects,
  initialSelectedSuspect = null,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectProfile | null>(
    initialSelectedSuspect
  );
  const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);

  // Section collapse states (only some expanded by default to avoid overwhelming)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    vehicles: true,
    locations: false,
    cases: true,
    financial: false,
    social: false,
    criminal: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const filteredSuspects = suspects.filter(
    (s) =>
      s.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.alias && s.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.relatedCases.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- 1. SUSPECT PROFILE VIEW (Section 7) ---
  if (selectedSuspect) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Back button */}
        <div>
          <button
            type="button"
            id="btn-back-to-suspects"
            onClick={() => setSelectedSuspect(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to All Suspects')}</span>
          </button>
        </div>

        {/* Profile Card Header: Name, Photo, Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Photo / Clean Avatar */}
              <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-xs">
                {selectedSuspect.codeName.slice(-1) || <User className="w-8 h-8" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-black tracking-tight">
                    {selectedSuspect.codeName}
                  </h1>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-black text-white font-bold">
                    {selectedSuspect.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {t('Alias')}: <span className="font-bold text-black">{selectedSuspect.alias || 'Classified'}</span> • {t('Age')}: {selectedSuspect.age || 34}
                </p>
              </div>
            </div>

            {/* Status badge & History Action */}
            <div className="flex flex-col sm:items-end gap-2">
              <span className="px-3 py-1 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-300 inline-flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {t('Status')}: {t('Under Investigation')}
              </span>

              <button
                type="button"
                id="btn-view-full-history"
                onClick={() => setShowFullHistoryModal(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer mt-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>{t('View Full History')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {/* 1. Contact / Communication Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-800" />
                <span>{t('Contact & Communication Details')}</span>
              </div>
              {openSections.contact ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.contact && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  {selectedSuspect.phoneRecords && selectedSuspect.phoneRecords.length > 0 ? (
                    selectedSuspect.phoneRecords.map((p, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                        <span>{p}</span>
                        <span className="text-[10px] text-slate-400">Cellular / Intercept</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-slate-50 rounded text-slate-500">+91 98450 22104 (Primary SIM)</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Vehicles */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('vehicles')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-blue-800" />
                <span>{t('Associated Vehicles & Registrations')} ({selectedSuspect.vehicles.length})</span>
              </div>
              {openSections.vehicles ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.vehicles && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  {selectedSuspect.vehicles.map((v, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-100 flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Locations */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('locations')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-800" />
                <span>{t('Locations & Movements')}</span>
              </div>
              {openSections.locations ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.locations && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100">
                <div className="space-y-1.5">
                  {selectedSuspect.knownLocations.map((loc, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-800" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Related Cases */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('cases')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-800" />
                <span>{t('Associated Cases')} ({selectedSuspect.relatedCases.length} {t('Cases')})</span>
              </div>
              {openSections.cases ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.cases && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 font-mono">
                  {selectedSuspect.relatedCases.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-900 rounded font-semibold border border-blue-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Financial Links */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('financial')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-blue-800" />
                <span>{t('Financial Links & Accounts')}</span>
              </div>
              {openSections.financial ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.financial && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100">
                <div className="space-y-1.5 font-mono">
                  {selectedSuspect.financialLinks && selectedSuspect.financialLinks.length > 0 ? (
                    selectedSuspect.financialLinks.map((f, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100">
                        {f}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-slate-50 rounded text-slate-500">
                      HDFC Bank Acct #****9102 • Routing via intermediary fintech wallet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 6. Social Media Intelligence */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('social')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-blue-800" />
                <span>{t('Social Media Intelligence & Handles')}</span>
              </div>
              {openSections.social ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.social && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100 space-y-1.5">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  Telegram: @secure_relay_k • Last active 4h ago
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  Encrypted VoIP Protocol: Signal session ID authenticated
                </div>
              </div>
            )}
          </div>

          {/* 7. Criminal History */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleSection('criminal')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-blue-800" />
                <span>{t('Criminal History & Prior FIRs')}</span>
              </div>
              {openSections.criminal ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSections.criminal && (
              <div className="px-5 pb-4 pt-1 text-xs text-slate-700 border-t border-slate-100 space-y-2">
                {selectedSuspect.firRecords && selectedSuspect.firRecords.length > 0 ? (
                  selectedSuspect.firRecords.map((fir, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                      <div className="font-bold text-slate-900">{fir.firNumber}</div>
                      <div className="text-slate-500 font-mono mt-0.5">
                        Station: {fir.station} • Section: {fir.section} ({fir.year})
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded text-slate-500 font-mono">
                    FIR #102/2024 • Section 420/120B IPC • Ashok Nagar PS
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal: View Full History */}
        {showFullHistoryModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {t('Complete Investigative History')} — {selectedSuspect.codeName}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFullHistoryModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 max-h-80 overflow-y-auto pr-1">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="font-bold block text-slate-900">2024 — Financial Fraud Inquiry</span>
                  <p className="mt-1 text-slate-600">Questioned by Economic Offences Wing regarding shell transaction ledger.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="font-bold block text-slate-900">2025 — Vehicle Telemetry Flag</span>
                  <p className="mt-1 text-slate-600">ANPR camera alert triggered at corridor checkpoint with cloned plates.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="font-bold block text-slate-900">2026 — Key Coordinator Designation</span>
                  <p className="mt-1 text-slate-600">Formally linked to CASE-0102 and CASE-0078 syndicate infrastructure.</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowFullHistoryModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t('Close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 2. SUSPECTS LIST VIEW (Section 6) ---
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight">{t('Suspects')}</h1>
        <p className="text-sm text-slate-600 mt-0.5 font-medium">
          {t('Identified individuals, persons of interest, and associates across active investigations.')}
        </p>
      </div>

      {/* Search suspect... */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="suspect-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search suspect by name, alias, or case...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
      </div>

      {/* Simple Suspect Cards / List as specified in Section 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredSuspects.map((suspect) => (
          <div
            key={suspect.id}
            id={`suspect-card-${suspect.id}`}
            onClick={() => setSelectedSuspect(suspect)}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-600 hover:shadow-sm transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs group-hover:bg-black transition-colors">
                {suspect.codeName.slice(-1) || 'P'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black group-hover:text-blue-600 transition-colors">
                  {suspect.codeName}
                </h3>
                <div className="text-xs text-red-600 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>{t('Under Investigation')}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
              <div><span className="font-bold text-black">{suspect.relatedCases.length}</span> {t('Cases')}</div>
              <div><span className="font-bold text-black">{suspect.vehicles.length}</span> {t('Vehicles')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
