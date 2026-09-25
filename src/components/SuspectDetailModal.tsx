import React, { useState } from 'react';
import {
  X,
  Phone,
  Car,
  CreditCard,
  Globe,
  Smartphone,
  MapPin,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Building,
  CheckCircle2,
  FileText,
  Clock,
  Radio,
  Share2,
  Hash,
  ShieldCheck,
} from 'lucide-react';
import { SuspectProfile } from '../types';
import { IdentityVerificationCard } from './IdentityVerificationCard';
import { useLanguage } from '../context/LanguageContext';

interface SuspectDetailModalProps {
  suspect: SuspectProfile;
  caseId?: string;
  onClose: () => void;
}

type DetailTab =
  | 'overview'
  | 'identity'
  | 'bank-transactions'
  | 'telecom-device'
  | 'vehicles'
  | 'osint-internet'
  | 'history';

export const SuspectDetailModal: React.FC<SuspectDetailModalProps> = ({
  suspect,
  caseId,
  onClose,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const vehiclesCount = suspect.vehiclesDetailed?.length || suspect.vehicles?.length || 0;
  const bankAccountsCount = suspect.bankDetails?.length || suspect.financialLinks?.length || 0;
  const transactionsCount = suspect.bankTransactions?.length || 0;
  const osintCount = suspect.osintInternetRecords?.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0e1017] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#141722] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                suspect.avatarBg || 'from-blue-600 to-indigo-800'
              } flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0 border border-white/20`}
            >
              {suspect.codeName?.slice(0, 2) || suspect.alias?.slice(0, 2) || 'SUS'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {suspect.id}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  {suspect.codeName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    suspect.status === 'Key Node' || suspect.status === 'Person of Interest'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {t(suspect.status)}
                </span>
                {caseId && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {t('Linked to')}: {caseId}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {suspect.legalName || suspect.alias || suspect.codeName}
                {suspect.alias && suspect.legalName && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    ({t('Alias')}: {suspect.alias})
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('Age')}: {suspect.age || 38} • {t('Monitored Node')} • {t('Intelligence Dossier')}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-suspect-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why Connected Callout Banner */}
        {suspect.whyConnected && (
          <div className="bg-amber-950/40 border-b border-amber-900/50 p-4 px-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                {t('Why This Suspect Is Connected to the Case:')}
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {suspect.whyConnected}
              </p>
            </div>
          </div>
        )}

        {/* Nav Tabs */}
        <div className="flex border-b border-slate-800 bg-[#10131d] px-4 overflow-x-auto">
          <button
            type="button"
            id="tab-suspect-overview"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('Overview & Bio')}</span>
          </button>

          <button
            type="button"
            id="tab-suspect-identity"
            onClick={() => setActiveTab('identity')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'identity'
                ? 'border-orange-500 text-orange-400 bg-orange-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>{t('Identity (Aadhaar/DigiLocker)')}</span>
          </button>

          <button
            type="button"
            id="tab-suspect-telecom"
            onClick={() => setActiveTab('telecom-device')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telecom-device'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('Mobile Device & Phone')}</span>
          </button>

          <button
            type="button"
            id="tab-suspect-bank"
            onClick={() => setActiveTab('bank-transactions')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bank-transactions'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('Bank & Transactions')} ({transactionsCount})</span>
          </button>

          <button
            type="button"
            id="tab-suspect-vehicles"
            onClick={() => setActiveTab('vehicles')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vehicles'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{t('Vehicles')} ({vehiclesCount})</span>
          </button>

          <button
            type="button"
            id="tab-suspect-osint"
            onClick={() => setActiveTab('osint-internet')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'osint-internet'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('Internet & OSINT Footprint')} ({osintCount})</span>
          </button>

          <button
            type="button"
            id="tab-suspect-history"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t('Criminal History & FIRs')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB: IDENTITY VERIFICATION (Dedicated) */}
          {activeTab === 'identity' && (
            <div className="space-y-4 animate-in fade-in">
              <IdentityVerificationCard suspect={suspect} caseId={caseId} />
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Civic Identity Verification (Feature 1: Aadhaar/DigiLocker) */}
              <IdentityVerificationCard suspect={suspect} caseId={caseId} />

              {/* Bio & Background */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Investigative Bio & Modus Operandi</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{suspect.bio}</p>
              </div>

              {/* CIVIC IDENTITY VERIFICATION (Aadhaar & DigiLocker) */}
              <IdentityVerificationCard suspect={suspect} caseId={caseId} />

              {/* Current Location Card */}
              {suspect.currentLocationDetails && (
                <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Current Traced Location</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      {suspect.currentLocationDetails.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        Street Address
                      </span>
                      <p className="font-medium text-slate-100 mt-0.5">
                        {suspect.currentLocationDetails.address}
                      </p>
                      <span className="text-slate-400 text-[11px] block mt-1">
                        {suspect.currentLocationDetails.area}, {suspect.currentLocationDetails.city}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        Geo-Coordinates & Tower Ping
                      </span>
                      <p className="font-mono text-blue-400 font-bold mt-0.5">
                        {suspect.currentLocationDetails.coordinates}
                      </p>
                      <span className="text-slate-400 text-[11px] block mt-1">
                        Last Ping: {suspect.currentLocationDetails.lastPingTime}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#141722] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Phone Number
                  </span>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    {suspect.phoneNumber || suspect.phoneRecords?.[0] || 'Unlisted'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141722] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Registered Vehicles
                  </span>
                  <div className="text-xs font-bold text-white mt-1">
                    {vehiclesCount} Vehicle{vehiclesCount !== 1 ? 's' : ''} Documented
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141722] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Social Accounts Found
                  </span>
                  <div className="text-xs font-bold text-white mt-1">
                    {suspect.socialMediaAccounts?.length || 2} Online Handles Indexed
                  </div>
                </div>
              </div>

              {/* Associated People */}
              {suspect.associatedPeople && suspect.associatedPeople.length > 0 && (
                <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Known Network Associates in Crime Syndicate
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {suspect.associatedPeople.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#0a0c12] border border-slate-800 text-xs"
                      >
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.relation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: IDENTITY (AADHAAR & DIGILOCKER) */}
          {activeTab === 'identity' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Civic & National Identity Authentication</span>
                </div>
                <p className="text-xs text-slate-400">
                  Authoritative biometric and digital vault verification through UIDAI Aadhaar registry and MeitY DigiLocker citizen archives.
                </p>
              </div>

              <IdentityVerificationCard suspect={suspect} caseId={caseId} />
            </div>
          )}

          {/* TAB 2: MOBILE DEVICE & TELECOM & SOCIAL MEDIA */}
          {activeTab === 'telecom-device' && (
            <div className="space-y-6">
              {/* Handset Specifications */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Type of Mobile Device Used</span>
                </div>

                {suspect.mobileDeviceDetails ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">
                        Device Model & OS
                      </span>
                      <div className="font-bold text-white text-sm">
                        {suspect.mobileDeviceDetails.model}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        OS: {suspect.mobileDeviceDetails.os}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">
                        Hardware Identifiers (IMEI)
                      </span>
                      <div className="font-mono text-slate-300 text-xs">
                        IMEI 1: <span className="text-white font-bold">{suspect.mobileDeviceDetails.imei1}</span>
                      </div>
                      {suspect.mobileDeviceDetails.imei2 && (
                        <div className="font-mono text-slate-300 text-xs">
                          IMEI 2: <span className="text-white">{suspect.mobileDeviceDetails.imei2}</span>
                        </div>
                      )}
                      <div className="text-blue-400 text-[11px] font-mono mt-1">
                        Carrier: {suspect.mobileDeviceDetails.primaryCarrier}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Handset device extraction: Standard LTE/5G Smartphone under IMEI surveillance.
                  </div>
                )}
              </div>

              {/* Phone Numbers & SIM Records */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Phone Numbers & SIM Card Intelligence</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-white text-sm">
                        {suspect.phoneNumber || '+91 98765 44912'}
                      </div>
                      <div className="text-xs text-slate-400">Primary Monitored Line (Postpaid)</div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      Active Tap
                    </span>
                  </div>

                  {suspect.phoneRecords?.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#0a0c12] border border-slate-800/80 text-xs flex items-center justify-between"
                    >
                      <span className="font-mono text-slate-300">{rec}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Tower Monitored</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Accounts */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Social Media & Messaging Handles</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suspect.socialMediaAccounts?.map((sm, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                          {sm.platform}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{sm.lastActive}</span>
                      </div>
                      <div className="font-mono font-bold text-white text-xs">{sm.handle}</div>
                      {sm.profileStatus && (
                        <div className="text-[11px] text-slate-400 leading-snug">
                          {sm.profileStatus}
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-xs text-slate-400 col-span-2">
                      Telegram, Signal, and WhatsApp accounts linked to primary SIM number.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANK DETAILS & BANK TRANSACTIONS */}
          {activeTab === 'bank-transactions' && (
            <div className="space-y-6">
              {/* Bank Accounts */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>Registered Bank Accounts</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suspect.bankDetails?.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{b.bankName}</span>
                        <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                          {b.accountType}
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 text-xs">
                        A/C: <span className="text-white font-bold">{b.accountNumber}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        IFSC: {b.ifsc} • {b.branch}
                      </div>
                      {b.balance && (
                        <div className="pt-1 text-xs font-bold text-emerald-400 font-mono">
                          Balance: {b.balance}
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-xs text-slate-400 col-span-2">
                      Cooperative Bank and HDFC Bank commercial current accounts under forensic lien.
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Transactions Ledger */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Forensic Bank Transactions Ledger</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Showing {suspect.bankTransactions?.length || 0} Traced Transactions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a0c12] text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Counterparty / Description</th>
                        <th className="py-2.5 px-3">Ref ID</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {suspect.bankTransactions?.map((txn) => (
                        <tr
                          key={txn.id}
                          className={`hover:bg-[#141722] transition-colors ${
                            txn.flagged ? 'bg-red-950/20' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{txn.date}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                txn.type === 'credit'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : 'bg-rose-950 text-rose-300'
                              }`}
                            >
                              {txn.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                            {txn.amount}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">
                            {txn.counterparty}
                            {txn.flagReason && (
                              <div className="text-[10px] text-red-400 font-sans mt-0.5 truncate">
                                ⚠ {txn.flagReason}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">{txn.referenceId}</td>
                          <td className="py-2.5 px-3">
                            {txn.flagged ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/60 text-red-300 border border-red-700">
                                FLAGGED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-slate-800">
                                Verified
                              </span>
                            )}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                            No ledger transactions recorded in this window.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VEHICLES */}
          {activeTab === 'vehicles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    Vehicle Fleet & Registered Numbers ({vehiclesCount} Documented)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suspect.vehiclesDetailed?.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          {v.vehicleType}
                        </span>
                        <div className="text-base font-extrabold text-white mt-0.5">
                          {v.makeModel}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          v.status === 'Under Toll Watch'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    {/* High-visibility Plate Box */}
                    <div className="p-2.5 rounded-lg bg-yellow-400/90 text-slate-900 border-2 border-yellow-500 font-mono font-black text-sm tracking-wider flex items-center justify-between shadow-xs">
                      <span>IND</span>
                      <span className="text-base">{v.plateNumber}</span>
                      <span className="text-xs">🇮🇳</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Color:</span>
                        <span className="font-medium text-white">{v.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">RTO Registration:</span>
                        <span className="font-medium text-slate-200 text-right">{v.rtoRegisteredTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Chassis Number:</span>
                        <span className="font-mono text-slate-400">{v.chassisNumber}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-xs text-slate-400 p-4 rounded-xl bg-[#141722] border border-slate-800 col-span-2">
                    Vehicle X (KA-04-XX-1102) documented in surveillance logs.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: OSINT & INTERNET FOOTPRINT */}
          {activeTab === 'osint-internet' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Every Information Discovered on the Internet (OSINT Database)</span>
              </div>
              <p className="text-xs text-slate-400">
                Automated open-source intelligence crawlers indexed corporate registries, public domain WHOIS, leak breaches, and government database queries.
              </p>

              <div className="space-y-3">
                {suspect.osintInternetRecords?.map((os, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                          {os.category}
                        </span>
                        <span className="text-xs font-bold text-white">{os.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{os.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{os.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-500">Source: {os.source}</span>
                      {os.verified && (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Officially Corroborated
                        </span>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-xs text-slate-400 p-4 rounded-xl bg-[#141722] border border-slate-800">
                    No secondary public internet breach records found outside of commercial registry logs.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CRIMINAL HISTORY & FIRS */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* FIR Records */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Police FIR Records on State Crime Database
                </div>

                <div className="space-y-2">
                  {suspect.firRecords?.map((fir, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-blue-400">{fir.firNumber}</span>
                        <div className="text-slate-400 mt-0.5">
                          {fir.station} • {fir.year}
                        </div>
                      </div>
                      <span className="font-mono text-slate-200 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                        {fir.section}
                      </span>
                    </div>
                  )) || (
                    <div className="text-xs text-slate-400">No prior registered FIRs.</div>
                  )}
                </div>
              </div>

              {/* Chronological Event History */}
              <div className="p-4 rounded-xl bg-[#141722] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Intelligence Timeline & Events
                </div>

                <div className="space-y-3 border-l-2 border-slate-800 pl-4 ml-2">
                  {suspect.criminalHistory?.map((hist, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[21px] top-1" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">{hist.year}</span>
                        {hist.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {hist.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{hist.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#141722] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {t('CrimeX Intelligence Dossier • Officer Authorized Access')}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
          >
            {t('Close Dossier')}
          </button>
        </div>
      </div>
    </div>
  );
};
