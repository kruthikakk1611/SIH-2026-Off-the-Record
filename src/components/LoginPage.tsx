import React, { useState } from 'react';
import {
  Shield,
  Lock,
  AlertTriangle,
  UserCheck,
  Building2,
  BadgeCheck,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  X,
  MapPin,
  Briefcase,
  KeyRound,
} from 'lucide-react';
import { OfficerProfile } from '../types';
import { DEMO_OFFICER } from '../data/mockData';
import { DEMO_OFFICER_A, DEMO_OFFICER_B, DEMO_DGP } from '../data/roleAccessData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface LoginPageProps {
  onLogin: (officer: OfficerProfile) => void;
  onQuickDemoBypass?: () => void;
}

const STATE_OPTIONS = [
  'Karnataka',
  'Maharashtra',
  'Delhi (NCT)',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Punjab',
];

const CITY_OPTIONS_BY_STATE: Record<string, string[]> = {
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
  'Delhi (NCT)': ['New Delhi', 'Central Delhi', 'South Delhi', 'Dwarka', 'Rohini'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  Telangana: ['Hyderabad', 'Warangal', 'Cyberabad', 'Nizamabad'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Kanpur', 'Varanasi', 'Agra'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
};

const DISTRICT_OPTIONS_BY_CITY: Record<string, string[]> = {
  Bengaluru: ['Bengaluru Urban', 'Bengaluru Rural', 'Ramanagara'],
  Mysuru: ['Mysuru District', 'Chamarajanagar'],
  Mangaluru: ['Dakshina Kannada', 'Udupi'],
  Hubballi: ['Dharwad District', 'Gadag'],
  Belagavi: ['Belagavi North', 'Belagavi South'],
  Mumbai: ['Mumbai City', 'Mumbai Suburban'],
  Pune: ['Pune District', 'Pimpri-Chinchwad'],
  Nagpur: ['Nagpur Urban', 'Nagpur Rural'],
  Thane: ['Thane District', 'Kalyan-Dombivli'],
  'New Delhi': ['New Delhi Police District', 'Central District'],
  'Central Delhi': ['Central District', 'North Delhi District'],
  'South Delhi': ['South District', 'South-East District'],
  Chennai: ['Chennai Central', 'Chennai North', 'Chennai South'],
  Coimbatore: ['Coimbatore City', 'Coimbatore Rural'],
  Hyderabad: ['Hyderabad Commissionerate', 'Cyberabad Commissionerate'],
  Cyberabad: ['Cyberabad Zone 1', 'Cyberabad Zone 2'],
  Lucknow: ['Lucknow Central', 'Lucknow North'],
  Noida: ['Gautam Buddha Nagar Central', 'Greater Noida'],
  Kolkata: ['Kolkata Police Division', 'South 24 Parganas'],
};

const DESIGNATION_OPTIONS = [
  'Police Inspector (PI)',
  'Sub-Inspector of Police (PSI)',
  'Assistant Commissioner of Police (ACP)',
  'Deputy Superintendent of Police (DSP)',
  'Superintendent of Police (SP)',
  'Deputy Commissioner of Police (DCP)',
  'Cyber Crime Forensic Analyst',
  'Senior Criminal Intelligence Officer',
  'Inspector General of Police (IGP)',
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onQuickDemoBypass }) => {
  const { t } = useLanguage();
  // Step 1 or Step 2 (First login page vs Second login page)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1: Location & Designation
  const [selectedState, setSelectedState] = useState<string>('Karnataka');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Bengaluru Urban');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('Police Inspector (PI)');

  // Step 2: Police Government ID & Password
  const [govId, setGovId] = useState<string>('OFF-2047');
  const [password, setPassword] = useState<string>('investigator@2025');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Verification & Error States
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Verification Request Modal State
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verifForm, setVerifForm] = useState({
    fullName: '',
    badgeNumber: '',
    stationUnit: '',
    departmentEmail: '',
    stationIncharge: '',
  });
  const [verifSuccess, setVerifSuccess] = useState<boolean>(false);

  // Handle Dynamic City & District updates
  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const cities = CITY_OPTIONS_BY_STATE[st] || ['Central District'];
    const newCity = cities[0];
    setSelectedCity(newCity);
    const districts = DISTRICT_OPTIONS_BY_CITY[newCity] || [`${newCity} District`];
    setSelectedDistrict(districts[0]);
  };

  const handleCityChange = (ct: string) => {
    setSelectedCity(ct);
    const districts = DISTRICT_OPTIONS_BY_CITY[ct] || [`${ct} District`];
    setSelectedDistrict(districts[0]);
  };

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState || !selectedCity || !selectedDistrict || !selectedDesignation) {
      setError(t('Please ensure all jurisdiction details and designation are selected.'));
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  // Step 2 Final Submission
  const handleFinalLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govId.trim()) {
      setError(t('Please enter your Police Government ID.'));
      return;
    }
    if (!password.trim()) {
      setError(t('Please enter your authorization password.'));
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);

      const upperGov = govId.trim().toUpperCase();
      if (
        upperGov === 'OFF-2047' ||
        upperGov === 'K. REDDY' ||
        upperGov === 'REDDY' ||
        upperGov.includes('OFFICER A') ||
        upperGov.includes('OFFICER-A')
      ) {
        onLogin({
          ...DEMO_OFFICER_A,
          state: selectedState,
          city: selectedCity,
          district: selectedDistrict,
          rank: selectedDesignation,
        });
      } else if (
        upperGov === 'OFF-3319' ||
        upperGov === 'RAJESH NAIR' ||
        upperGov === 'SIT' ||
        upperGov.includes('OFFICER B') ||
        upperGov.includes('OFFICER-B') ||
        upperGov.includes('SPECIAL INVESTIGATING')
      ) {
        onLogin({
          ...DEMO_OFFICER_B,
          state: selectedState,
          city: selectedCity,
          district: selectedDistrict,
          rank: selectedDesignation,
        });
      } else if (
        upperGov === 'DGP-0001' ||
        upperGov === 'DGP' ||
        upperGov === 'ARJUN SHARMA' ||
        upperGov === 'SHARMA' ||
        upperGov === 'DEMO' ||
        upperGov.includes('DGP') ||
        upperGov.includes('MAIN OFFICER')
      ) {
        onLogin({
          ...DEMO_DGP,
          state: selectedState,
          city: selectedCity,
          district: selectedDistrict,
        });
      } else {
        onLogin({
          ...DEMO_OFFICER_A,
          id: govId,
          rank: selectedDesignation,
          state: selectedState,
          city: selectedCity,
          district: selectedDistrict,
          name: `${selectedDesignation} (${govId})`,
          role: 'INVESTIGATING_OFFICER_A',
          permissions: {
            SECRET_ROOM_ACCESS: false,
            CAN_MANAGE_SECRET_ROOM_ACCESS: false,
          },
        });
      }
    }, 450);
  };

  // Quick Demo Shortcut for Judges / Evaluation
  const handleQuickDemoClick = () => {
    if (onQuickDemoBypass) {
      onQuickDemoBypass();
    } else {
      onLogin(DEMO_DGP);
    }
  };

  // Preset for quick switch in Step 1
  const handlePresetSelect = (st: string, ct: string, dt: string, des: string) => {
    setSelectedState(st);
    setSelectedCity(ct);
    setSelectedDistrict(dt);
    setSelectedDesignation(des);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifSuccess(true);
    setTimeout(() => {
      setVerifSuccess(false);
      setShowVerificationModal(false);
      setVerifForm({
        fullName: '',
        badgeNumber: '',
        stationUnit: '',
        departmentEmail: '',
        stationIncharge: '',
      });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Subtle, restrained dark grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#151822_1px,transparent_1px),linear-gradient(to_bottom,#151822_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      {/* Very faint neutral glow in center for depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-slate-800/15 blur-[120px] pointer-events-none" />

      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Portal Header - Clean, Minimal & Official */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#12141c] border border-slate-700/80 shadow-lg shadow-black/40 mb-3">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>Crime</span>
            <span className="text-blue-500">X</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-[#181b26]/70 border border-slate-700/60 text-blue-300">
              {t('POLICE PORTAL')}
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            {t('AI-Powered Law Enforcement & Criminal Intelligence System')}
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#11131a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-600 rounded-t-2xl" />

          {/* Stepper Progress Indicator */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                1
              </div>
              <span
                className={`text-xs font-semibold ${
                  currentStep === 1 ? 'text-white' : 'text-slate-400'
                }`}
              >
                Jurisdiction
              </span>
            </div>

            <div className="w-12 h-0.5 bg-slate-800" />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-semibold ${
                  currentStep === 2 ? 'text-white' : 'text-slate-500'
                }`}
              >
                Government ID
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-900/80 text-red-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: State, City, District, Designation */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-4">
              <div className="pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t('Step 1: Departmental Jurisdiction')}
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t('Select your assigned state, station city, district, and official designation.')}
                </p>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{t('State')}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{t('Select State')}</span>
                </label>
                <div className="relative">
                  <select
                    id="select-login-state"
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700/90 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                  >
                    {STATE_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-[#12141c] text-slate-200">
                        {st}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-3 text-xs text-slate-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* City & District Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <select
                      id="select-login-city"
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700/90 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                    >
                      {(CITY_OPTIONS_BY_STATE[selectedState] || ['Bengaluru']).map((ct) => (
                        <option key={ct} value={ct} className="bg-[#12141c] text-slate-200">
                          {ct}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-3 text-xs text-slate-400">
                      ▼
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    District
                  </label>
                  <div className="relative">
                    <select
                      id="select-login-district"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700/90 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                    >
                      {(DISTRICT_OPTIONS_BY_CITY[selectedCity] || [`${selectedCity} District`]).map((dt) => (
                        <option key={dt} value={dt} className="bg-[#12141c] text-slate-200">
                          {dt}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-3 text-xs text-slate-400">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Designation / Rank */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('Your Designation')}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{t('Official Rank')}</span>
                </label>
                <div className="relative">
                  <select
                    id="select-login-designation"
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700/90 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                  >
                    {DESIGNATION_OPTIONS.map((des) => (
                      <option key={des} value={des} className="bg-[#12141c] text-slate-200">
                        {des}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-3 text-xs text-slate-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* Fast Presets for Demonstration */}
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  {t('Quick Jurisdiction Presets:')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetSelect(
                        'Karnataka',
                        'Bengaluru',
                        'Bengaluru Urban',
                        'Police Inspector (PI)'
                      )
                    }
                    className="px-2 py-1 rounded bg-[#161922] hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-[10px] cursor-pointer"
                  >
                    {t('Bengaluru Urban (Inspector)')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetSelect(
                        'Maharashtra',
                        'Mumbai',
                        'Mumbai City',
                        'Deputy Commissioner of Police (DCP)'
                      )
                    }
                    className="px-2 py-1 rounded bg-[#161922] hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-[10px] cursor-pointer"
                  >
                    {t('Mumbai City (DCP)')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetSelect(
                        'Delhi (NCT)',
                        'New Delhi',
                        'New Delhi Police District',
                        'Assistant Commissioner of Police (ACP)'
                      )
                    }
                    className="px-2 py-1 rounded bg-[#161922] hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-[10px] cursor-pointer"
                  >
                    {t('Delhi Special Cell (ACP)')}
                  </button>
                </div>
              </div>

              {/* Next Step Button */}
              <button
                type="submit"
                id="btn-proceed-to-step2"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('Continue to Police ID & Credentials')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Police Government ID, Password & Authorized Warning */}
          {currentStep === 2 && (
            <form onSubmit={handleFinalLoginSubmit} className="space-y-4">
              {/* Back button and title */}
              <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      {t('Step 2: Government Authentication')}
                    </h2>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {t('Jurisdiction')}: {t(selectedDistrict)}, {t(selectedState)} ({t(selectedDesignation)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setError('');
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-[#161922] border border-slate-700/60 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('Back')}</span>
                </button>
              </div>

              {/* MANDATORY WARNING (Preserved per explicit security mandate) */}
              <div className="p-3 rounded-xl bg-amber-950/40 border-2 border-amber-600/70 text-amber-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-amber-300 uppercase tracking-wide">
                      {t('WARNING: ONLY AUTHORIZED LOGIN, ONLY AUTHORIZED PEOPLE ARE ALLOWED')}
                    </p>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      {t('Access to this criminal intelligence system is strictly limited to verified police personnel. All login attempts, sessions, and case investigations are monitored and auditable under law.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Police Government ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{t('Police Government ID')}</span>
                  <span className="text-[10px] font-mono text-blue-400 bg-[#181b26]/80 px-1.5 py-0.5 rounded border border-slate-700/60">
                    {t('Default')}: OFF-2047
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="input-gov-id"
                    type="text"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    placeholder={t('Enter Official Government ID (e.g. OFF-2047)')}
                    className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700/90 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] text-slate-500 font-mono pointer-events-none">
                    GOV-ID
                  </span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{t('Password')}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{t('Default')}: investigator@2025</span>
                </label>
                <div className="relative">
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('Enter officer security password')}
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#090b10] border border-slate-700/90 rounded-xl text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                id="btn-login-submit"
                disabled={isVerifying}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('Verifying Police Credentials & Clearance...')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{t('SECURE LOGIN TO CRIMEX')}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Officer Demonstration Profiles */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t('Officer Sign-In Profiles')}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{t('Select Profile')}</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Profile 1: Investigating Officer A (K. Reddy) */}
              <button
                type="button"
                id="btn-demo-officer-a"
                onClick={() => onLogin(DEMO_OFFICER_A)}
                disabled={isVerifying}
                className="w-full p-2.5 rounded-xl bg-[#141722] hover:bg-slate-800 border border-slate-700/80 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-600/50 flex items-center justify-center text-blue-400 shrink-0 font-mono text-xs font-bold">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      K. Reddy
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t('Investigating Officer A • CID (OFF-2047)')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Inspector
                  </span>
                </div>
              </button>

              {/* Profile 2: Investigating Officer B (Special Investigating Team Officer) */}
              <button
                type="button"
                id="btn-demo-officer-b"
                onClick={() => onLogin(DEMO_OFFICER_B)}
                disabled={isVerifying}
                className="w-full p-2.5 rounded-xl bg-[#141722] hover:bg-slate-800 border border-slate-700/80 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-600/50 flex items-center justify-center text-indigo-400 shrink-0 font-mono text-xs font-bold">
                    B
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Sub-Inspector Rajesh Nair
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t('Special Investigating Team Officer (Investigating Officer B) • SIT (OFF-3319)')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
                    SIT Officer
                  </span>
                </div>
              </button>

              {/* Profile 3: DGP / Main Officer (Arjun Sharma) */}
              <button
                type="button"
                id="btn-demo-dgp"
                onClick={() => onLogin(DEMO_DGP)}
                disabled={isVerifying}
                className="w-full p-2.5 rounded-xl bg-[#141722] hover:bg-slate-800 border border-blue-900/60 text-left transition-colors flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0 font-mono text-xs font-bold">
                    ★
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      DGP Arjun Sharma
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t('Director General of Police • Apex Command (DGP-0001)')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-600/70">
                    DGP
                  </span>
                </div>
              </button>
            </div>

            {/* Quick Demo Bypass Button (Preserved) */}
            <button
              type="button"
              id="btn-quick-demo-access"
              onClick={handleQuickDemoClick}
              disabled={isVerifying}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-[#11131a] hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BadgeCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{t('Standard Demo: Login as DGP Arjun Sharma (Main Officer)')}</span>
            </button>
          </div>

          {/* Request Verification / Clearance link */}
          <div className="mt-3 text-center">
            <button
              type="button"
              id="btn-create-account"
              onClick={() => setShowVerificationModal(true)}
              className="text-xs text-slate-400 hover:text-blue-400 underline font-medium cursor-pointer transition-colors"
            >
              {t('Non-registered officer? Request Clearance / Onboarding')}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center text-xs text-slate-500 font-mono">
          {t('Smart India Hackathon 2026 • CrimeX National Law Enforcement Intelligence')}
        </div>
      </div>

      {/* Official Clearance Request Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#11131a] border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowVerificationModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#181c26] border border-slate-700 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('Official Verification Request')}</h3>
                <p className="text-xs text-slate-400">{t('CrimeX Law-Enforcement Credentials Onboarding')}</p>
              </div>
            </div>

            {verifSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs text-center space-y-2">
                <UserCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm">{t('Verification Request Submitted')}</p>
                <p className="text-slate-300">
                  {t('Your credentials have been routed to the Station Incharge and State Nodal Officer for official clearance.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('Notice: Public registration is prohibited. Official verification through your state nodal police authority is required.')}
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('Officer Full Name')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sub-Inspector R. Sen"
                    value={verifForm.fullName}
                    onChange={(e) => setVerifForm({ ...verifForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t('Official Badge ID')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CX-7819"
                      value={verifForm.badgeNumber}
                      onChange={(e) => setVerifForm({ ...verifForm, badgeNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t('Station / Unit')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyber Crime Wing"
                      value={verifForm.stationUnit}
                      onChange={(e) => setVerifForm({ ...verifForm, stationUnit: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('Departmental Email (.gov.in / .nic.in)')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer.name@police.gov.in"
                    value={verifForm.departmentEmail}
                    onChange={(e) => setVerifForm({ ...verifForm, departmentEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('Station Incharge / Approving Officer Badge')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SP-BLR-01"
                    value={verifForm.stationIncharge}
                    onChange={(e) => setVerifForm({ ...verifForm, stationIncharge: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#161922] hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    {t('Submit for Clearance')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
