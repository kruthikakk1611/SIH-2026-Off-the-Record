import React, { useState, useEffect } from 'react';
import {
  Shield,
  BadgeCheck,
  Check,
  X,
  Lock,
  KeyRound,
  Clock,
  Laptop,
  ArrowLeft,
  Edit3,
  LogOut,
  ChevronRight,
  AlertCircle,
  FileText,
  Building2,
  MapPin,
  Mail,
  Phone,
  Radio,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  RefreshCw,
  Hash,
  EyeOff,
} from 'lucide-react';
import { OfficerProfile, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProfileViewProps {
  officer: OfficerProfile;
  onLogout: () => void;
  onNavigate?: (page: NavPage) => void;
  onUpdateOfficer?: (officer: OfficerProfile) => void;
}

type ProfileTab = 'profile' | 'permissions' | 'activity' | 'security';
type RoleClearance = 'Investigating Officer' | 'Senior Officer' | 'State Police Command';

interface ActivityItem {
  id: string;
  action: string;
  target: string;
  category: 'case' | 'evidence' | 'suspect' | 'report' | 'network';
  date: string;
  time: string;
  ipAddress?: string;
  hash?: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'ACT-9041',
    action: 'Viewed CASE-0102',
    target: 'CASE-0102: Organized Financial Crime',
    category: 'case',
    date: '15 Sept 2026',
    time: '8:22 PM',
    ipAddress: '10.14.88.192',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'ACT-9040',
    action: 'Added evidence to CASE-0102',
    target: 'EV-1027: Encrypted Ledger Database',
    category: 'evidence',
    date: '15 Sept 2026',
    time: '7:45 PM',
    ipAddress: '10.14.88.192',
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
  },
  {
    id: 'ACT-9039',
    action: 'Updated suspect information',
    target: 'SUS-8812: Vikram Malhotra (Alias: Shadow)',
    category: 'suspect',
    date: '15 Sept 2026',
    time: '5:14 PM',
    ipAddress: '10.14.88.192',
    hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  },
  {
    id: 'ACT-9038',
    action: 'Generated investigation report',
    target: 'REP-0102-Q3: Syndicate Nexus Brief',
    category: 'report',
    date: '15 Sept 2026',
    time: '3:30 PM',
    ipAddress: '10.14.88.192',
    hash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
  },
  {
    id: 'ACT-9037',
    action: 'Viewed Connection Map',
    target: 'Network Graph: Financial Shells Nexus',
    category: 'network',
    date: '15 Sept 2026',
    time: '11:15 AM',
    ipAddress: '10.14.88.192',
    hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
  },
  {
    id: 'ACT-9036',
    action: 'Compared CASE-0102 with CASE-0078',
    target: 'Cross-Jurisdiction Syndicate Similarity',
    category: 'case',
    date: '14 Sept 2026',
    time: '4:10 PM',
    ipAddress: '10.14.88.192',
    hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
  },
  {
    id: 'ACT-9035',
    action: 'Verified digital evidence integrity',
    target: 'EV-1025: Surveillance Footage Call Records',
    category: 'evidence',
    date: '14 Sept 2026',
    time: '2:05 PM',
    ipAddress: '10.14.88.192',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
  },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  officer,
  onLogout,
  onNavigate,
  onUpdateOfficer,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');

  // Role Clearance Switcher (Investigating Officer, Senior Officer, State Police Command)
  const initialRole: RoleClearance = (officer.accessLevel as RoleClearance) || 'Investigating Officer';
  const [selectedRole, setSelectedRole] = useState<RoleClearance>(initialRole);

  // Dynamic role-based profile values
  const getRoleSpecifics = (role: RoleClearance) => {
    // If viewing the officer's own clearance level, retain their exact identity, rank, station and details
    const isBaseRole = role === (officer.accessLevel || 'Investigating Officer');

    if (isBaseRole) {
      return {
        name: officer.name || 'DGP Arjun Sharma',
        id: officer.id || 'DGP-0001',
        rank: officer.rank || 'Director General of Police (DGP)',
        department: officer.department || 'State Police Headquarters & Apex Command',
        state: officer.state || 'Karnataka',
        district: officer.district || 'Bengaluru Urban',
        station: officer.station || 'Apex Directorate Headquarters, Nrupathunga Rd',
        badge: officer.badge || 'IPS-KA-DGP-001',
        accessLevel: officer.accessLevel || 'State Police Command',
        jurisdiction: officer.district ? `${officer.district}` : 'Bengaluru Urban',
        isStatewide: officer.accessLevel === 'State Police Command',
        posting: officer.posting || 'Director General & Inspector General of Police (DG&IGP)',
        officialEmail: officer.officialEmail || 'arjun.sharma@ksp.gov.in',
        officialPhone: officer.officialPhone || '+91 (080) 2221-1111 / Apex Command Line',
      };
    }

    switch (role) {
      case 'State Police Command':
        return {
          name: officer.name || 'DGP Arjun Sharma',
          id: officer.id || 'DGP-0001',
          rank: 'Director General of Police (DGP)',
          department: officer.department || 'State Police Headquarters / Command & Control',
          state: officer.state || 'Karnataka',
          district: 'Statewide',
          station: 'Apex Directorate Headquarters, Nrupathunga Rd',
          badge: officer.badge || 'IPS-KA-DGP-001',
          accessLevel: 'State Police Command',
          jurisdiction: 'Statewide',
          isStatewide: true,
          posting: 'Director General & Inspector General of Police (DG&IGP)',
          officialEmail: officer.officialEmail || 'arjun.sharma@ksp.gov.in',
          officialPhone: officer.officialPhone || '+91 (080) 2221-1111 / Apex Command Line',
        };
      case 'Senior Officer':
        return {
          name: officer.name || 'DGP Arjun Sharma',
          id: officer.id || 'DGP-0001',
          rank: officer.rank?.includes('Superintendent') || officer.rank?.includes('Commissioner') || officer.rank?.includes('DSP')
            ? officer.rank
            : 'Deputy Commissioner of Police (DCP)',
          department: officer.department || 'Crime Investigation Department (CID)',
          state: officer.state || 'Karnataka',
          district: `${officer.district || 'Bengaluru'} Range & Central Zone`,
          station: officer.station || 'Central Crime Branch Division',
          badge: officer.badge || 'IPS-KA-DGP-001',
          accessLevel: 'Senior Officer',
          jurisdiction: `${officer.district || 'Bengaluru'} Range & Central Zone`,
          isStatewide: false,
          posting: officer.posting || 'Organized Crime & Economic Offenses Division',
          officialEmail: officer.officialEmail || 'dcp.investigation@ksp.cid.gov.in',
          officialPhone: officer.officialPhone || '+91 (080) 2294-2050 / Ext. 102',
        };
      case 'Investigating Officer':
      default:
        return {
          name: officer.name || 'DGP Arjun Sharma',
          id: officer.id || 'DGP-0001',
          rank: officer.rank || 'Police Inspector',
          department: officer.department || 'Crime Investigation Department',
          state: officer.state || 'Karnataka',
          district: officer.district || 'Bengaluru Urban',
          station: officer.station || 'Central Crime Branch',
          badge: officer.badge || 'IPS-KA-DGP-001',
          accessLevel: 'Investigating Officer',
          jurisdiction: officer.district || 'Bengaluru Urban',
          isStatewide: false,
          posting: officer.posting || 'Special Homicide & Syndicate Squad',
          officialEmail: officer.officialEmail || 'arjun.sharma@ksp.gov.in',
          officialPhone: officer.officialPhone || '+91 (080) 2294-2047 / Ext. 402',
        };
    }
  };

  const roleInfo = getRoleSpecifics(selectedRole);

  // Profile editable fields
  const [currentPosting, setCurrentPosting] = useState<string>(roleInfo.posting);
  const [officialEmail, setOfficialEmail] = useState<string>(roleInfo.officialEmail);
  const [officialPhone, setOfficialPhone] = useState<string>(roleInfo.officialPhone);

  // Keep state synchronized whenever active officer changes
  useEffect(() => {
    const role = (officer.accessLevel as RoleClearance) || 'Investigating Officer';
    setSelectedRole(role);
    const specifics = getRoleSpecifics(role);
    const postingVal = officer.posting || specifics.posting;
    const emailVal = officer.officialEmail || specifics.officialEmail;
    const phoneVal = officer.officialPhone || specifics.officialPhone;
    setCurrentPosting(postingVal);
    setOfficialEmail(emailVal);
    setOfficialPhone(phoneVal);
    setEditPosting(postingVal);
    setEditEmail(emailVal);
    setEditPhone(phoneVal);
  }, [officer.id, officer.accessLevel]);

  // Modals & Feedback Toasts
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Edit form state
  const [editPosting, setEditPosting] = useState(currentPosting);
  const [editEmail, setEditEmail] = useState(officialEmail);
  const [editPhone, setEditPhone] = useState(officialPhone);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  const handleRoleChange = (newRole: RoleClearance) => {
    setSelectedRole(newRole);
    const updated = getRoleSpecifics(newRole);
    setCurrentPosting(updated.posting);
    setOfficialEmail(updated.officialEmail);
    setOfficialPhone(updated.officialPhone);
    if (onUpdateOfficer) {
      onUpdateOfficer({
        ...officer,
        rank: updated.rank,
        department: updated.department,
        district: updated.district,
        station: updated.station,
        accessLevel: updated.accessLevel,
        posting: updated.posting,
        officialEmail: updated.officialEmail,
        officialPhone: updated.officialPhone,
      });
    }
    showToast(`Access clearance switched to: ${newRole}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPosting(editPosting);
    setOfficialEmail(editEmail);
    setOfficialPhone(editPhone);
    setIsEditModalOpen(false);
    if (onUpdateOfficer) {
      onUpdateOfficer({
        ...officer,
        posting: editPosting,
        officialEmail: editEmail,
        officialPhone: editPhone,
      });
    }
    showToast('Officer profile contact and posting details updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Please enter your current officer password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must contain at least 8 characters with numbers & symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Officer password has been securely updated. Session re-authenticated.');
  };

  const handleSignOutOtherSessions = () => {
    showToast('All other remote and terminal sessions have been successfully invalidated.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans text-slate-800">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700 text-xs font-medium animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Navigation Breadcrumb Bar & Back to Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="hover:text-slate-900 transition-colors cursor-pointer text-slate-600 font-semibold"
          >
            {t('Dashboard')}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold">{t('Profile')}</span>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="profile-btn-back-dashboard"
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Back to Dashboard')}</span>
          </button>
        </div>
      </div>

      {/* Primary Officer Header Identity Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs">
        {/* Top Identification Badge & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              OFFICER PROFILE
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium">
              National Law Enforcement Telecommunication Grid
            </span>
          </div>

          {/* Quick Role Clearance Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold px-1.5">
              Access Level:
            </span>
            {(['Investigating Officer', 'Senior Officer', 'State Police Command'] as RoleClearance[]).map((r) => {
              const isCurrent = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {r === 'State Police Command' ? 'State Command' : r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Identity Overview Grid */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Professional Fictional Profile Photo (Clean Law-Enforcement Silhouette / Portrait Presentation) */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-xl bg-slate-900 border-2 border-slate-800 p-1 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-slate-200"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Officer Profile Photo"
                >
                  <rect width="100" height="100" fill="#0f172a" />
                  {/* Police Peak Cap / Crest Silhouette */}
                  <path
                    d="M30 32 C30 22, 70 22, 70 32 L78 37 C75 39, 25 39, 22 37 Z"
                    fill="#1e293b"
                  />
                  <path
                    d="M45 27 L55 27 L53 32 L47 32 Z"
                    fill="#f59e0b"
                  />
                  {/* Officer Head */}
                  <circle cx="50" cy="44" r="14" fill="#cbd5e1" />
                  {/* Uniform Shoulders and Collar */}
                  <path
                    d="M20 92 L20 74 C20 62, 36 60, 44 64 L50 67 L56 64 C64 60, 80 62, 80 74 L80 92 Z"
                    fill="#1e3a8a"
                  />
                  {/* Shirt and Tie */}
                  <polygon points="44,64 56,64 53,82 47,82" fill="#ffffff" />
                  <polygon points="48,68 52,68 53,88 50,91 47,88" fill="#0f172a" />
                  {/* Insignia Stars on Shoulders */}
                  <polygon points="26,72 28,75 25,75" fill="#f59e0b" />
                  <polygon points="74,72 76,75 73,75" fill="#f59e0b" />
                </svg>
              </div>

              {/* Digital Badge Stamp */}
              <div className="absolute -bottom-2 -right-1.5 px-2 py-0.5 rounded bg-blue-900 border border-blue-700 text-white font-mono text-[9px] font-bold shadow-xs">
                {roleInfo.id}
              </div>
            </div>

            {/* Officer Primary Attributes */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {roleInfo.name}
                </h1>
                <BadgeCheck className="w-5 h-5 text-blue-900" />
                {roleInfo.isStatewide && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Statewide Authorized Access
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{roleInfo.rank}</span>
                <span className="text-slate-300">•</span>
                <span>{roleInfo.department}</span>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700 font-semibold">
                  ID: {roleInfo.id}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700 font-semibold">
                  Station: {roleInfo.station}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700 font-semibold">
                  District: {roleInfo.district}, {roleInfo.state}
                </span>
              </div>
            </div>
          </div>

          {/* Account Status & Access Level Badges */}
          <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="text-left lg:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono block">
                Account Status
              </span>
              <span className="inline-flex items-center gap-1.5 mt-0.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono block">
                Access Level
              </span>
              <span className="inline-block mt-0.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                {roleInfo.accessLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Audit Notice */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-800">
            All important activity is monitored and recorded.
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px] flex items-center gap-2">
          <span>CJIS / KSP Audit Standard</span>
          <span className="text-slate-300">•</span>
          <span>Terminal ID: CCB-BGL-04</span>
        </div>
      </div>

      {/* Four Profile Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-2xs flex items-center gap-2 sm:gap-6 overflow-x-auto">
        <button
          type="button"
          id="tab-btn-profile"
          onClick={() => setActiveTab('profile')}
          className={`py-3.5 px-3 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <span>{t('Profile')}</span>
        </button>

        <button
          type="button"
          id="tab-btn-permissions"
          onClick={() => setActiveTab('permissions')}
          className={`py-3.5 px-3 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'permissions'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <span>{t('Permissions')}</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[11px] font-mono text-slate-600">
            RBAC
          </span>
        </button>

        <button
          type="button"
          id="tab-btn-activity"
          onClick={() => setActiveTab('activity')}
          className={`py-3.5 px-3 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <span>{t('Activity')}</span>
          <span className="w-2 h-2 rounded-full bg-blue-600" />
        </button>

        <button
          type="button"
          id="tab-btn-security"
          onClick={() => setActiveTab('security')}
          className={`py-3.5 px-3 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <span>{t('Security')}</span>
          <Lock className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* TAB 1: PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-t-0 border-slate-200/90 rounded-b-xl p-6 sm:p-8 shadow-2xs space-y-8 animate-in fade-in-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('Official Officer Dossier')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('Verified law-enforcement identity and operational station posting details.')}
            </p>
          </div>

          {/* Clean Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Full Name')}
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {roleInfo.name}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Officer ID')}
                </span>
                <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5 block">
                  {roleInfo.id}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Rank')}
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                  {t(roleInfo.rank)}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Badge Number')}
                </span>
                <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5 block">
                  {roleInfo.badge}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Department')}
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                  {t(roleInfo.department)}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('State')}
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                  {roleInfo.state}
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('District')}
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                  {roleInfo.district}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Police Station / Unit')}
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                  {roleInfo.station}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Current Posting')}
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">
                  {currentPosting}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Official Email')}
                </span>
                <span className="text-sm font-mono text-slate-800 mt-0.5 block">
                  {officialEmail}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  {t('Official Phone / Extension')}
                </span>
                <span className="text-sm font-mono text-slate-800 mt-0.5 block">
                  {officialPhone}
                </span>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 uppercase font-semibold font-mono block">
                  Verification Authority
                </span>
                <span className="text-sm font-semibold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Karnataka State Police Headquarters (Verified)
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Personal contact details and passwords are cryptographically shielded.
            </p>
            <button
              type="button"
              id="profile-btn-edit"
              onClick={() => {
                setEditPosting(currentPosting);
                setEditEmail(officialEmail);
                setEditPhone(officialPhone);
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISSIONS TAB */}
      {activeTab === 'permissions' && (
        <div className="bg-white border border-t-0 border-slate-200/90 rounded-b-xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ACCESS & PERMISSIONS
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-Based Access Control (RBAC) boundaries assigned by the Police Command Directorate.
            </p>
          </div>

          {/* Access Level and Jurisdiction Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Access Level
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {roleInfo.accessLevel}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {selectedRole === 'State Police Command'
                  ? 'Command level authority across all divisions.'
                  : selectedRole === 'Senior Officer'
                  ? 'Supervisory clearance across multiple precincts.'
                  : 'Authorized for primary case docket investigation.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Authorized Jurisdiction
              </span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {roleInfo.jurisdiction}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {roleInfo.isStatewide
                  ? 'Statewide Authorized Access — All districts unlocked'
                  : 'Restricted to designated police territorial zone'}
              </p>
            </div>
          </div>

          {/* Clean Permission List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
              <span>Permission Capability</span>
              <span>Authorization Status</span>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              {/* Common Capabilities */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">View Assigned Cases</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">Create New Cases</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">Edit Assigned Cases</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">Add Evidence</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">View Connection Maps</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">Compare Authorized Cases</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <span className="text-slate-800 font-medium">Generate Reports</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  Allowed
                </span>
              </div>

              {/* Role-Specific Capabilities */}
              {selectedRole === 'State Police Command' ? (
                <>
                  <div className="px-4 py-3 flex items-center justify-between bg-indigo-50/30">
                    <span className="text-slate-900 font-semibold">View Statewide Cases</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-indigo-50/30">
                    <span className="text-slate-900 font-semibold">View Statewide Connections</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-indigo-50/30">
                    <span className="text-slate-900 font-semibold">Review Evidence</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-indigo-50/30">
                    <span className="text-slate-900 font-semibold">Review Audit Trails</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-indigo-50/30">
                    <span className="text-slate-900 font-semibold">Manage User Permissions</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed
                    </span>
                  </div>
                </>
              ) : selectedRole === 'Senior Officer' ? (
                <>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Cross-District Case Access</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Statewide Case Access</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                      <X className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                      Not Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Manage User Permissions</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      Allowed (Division)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Statewide Case Access</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                      <X className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                      Not Allowed
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Manage User Permissions</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                      <X className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                      Not Allowed
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500">
            Access is based on role, jurisdiction and case authorization.
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-t-0 border-slate-200/90 rounded-b-xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">RECENT ACTIVITY</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological log of case dossiers, evidence records, and analytical queries opened.
              </p>
            </div>

            <button
              type="button"
              id="profile-btn-view-audit"
              onClick={() => setIsAuditModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>View Full Audit Trail</span>
            </button>
          </div>

          {/* Clean Activity Timeline List */}
          <div className="space-y-3">
            {INITIAL_ACTIVITIES.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-sm font-bold text-slate-900">{item.action}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-4.5">{item.target}</p>
                </div>

                <div className="text-left sm:text-right pl-4.5 sm:pl-0">
                  <div className="text-xs font-semibold text-slate-700 font-mono">
                    {item.date} • {item.time}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Terminal Log #{item.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>All activity records are cryptographically timestamped and immutable.</span>
            <span className="font-mono text-[11px]">Audit Sync: Realtime</span>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="bg-white border border-t-0 border-slate-200/90 rounded-b-xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">ACCOUNT SECURITY</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Law-enforcement authentication parameters, session safeguards, and credentials.
            </p>
          </div>

          {/* Security Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Last Login */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Last Login
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                15 Sept 2026 • 8:20 PM
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Authenticated from workstation CCB-BGL-04 (Intranet)
              </p>
            </div>

            {/* Account Status */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Account Status
              </span>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Active
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Zero security infractions logged in current quarter
              </p>
            </div>

            {/* Two-Factor Authentication */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Two-Factor Authentication
              </span>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                <Shield className="w-3.5 h-3.5 text-blue-700" />
                Enabled
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Secured via Police Hardware Key & Department OTP
              </p>
            </div>

            {/* Active Sessions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Active Sessions
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block font-mono">
                1 Active Session
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Terminal CCB-BGL-04 • IP 10.14.88.192 (Bengaluru HQ)
              </p>
            </div>
          </div>

          {/* Password Management Box */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold block">
                Password
              </span>
              <span className="text-lg font-mono tracking-widest text-slate-700 mt-1 block">
                ••••••••
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Last changed 42 days ago • Meets law enforcement 14-char complexity standard
              </p>
            </div>

            <button
              type="button"
              id="security-btn-change-password"
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Remote Sessions Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Session Control
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Revoke all active tokens on mobile tablets, external precinct terminals, and forensic laptops.
              </p>
            </div>

            <button
              type="button"
              id="security-btn-signout-other"
              onClick={handleSignOutOtherSessions}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out of Other Sessions</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Edit Officer Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Posting / Squad
                </label>
                <input
                  type="text"
                  value={editPosting}
                  onChange={(e) => setEditPosting(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white"
                  placeholder="e.g. Special Homicide & Syndicate Squad"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white font-mono text-xs"
                  placeholder="name@ksp.cid.gov.in"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Phone / Extension
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white font-mono text-xs"
                  placeholder="+91 (080) 2294-XXXX / Ext. XXX"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
                Official badge numbers, ID codes, and primary station designations can only be altered by the State Police Headquarters Registry.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FULL AUDIT TRAIL MODAL */}
      {/* ========================================================================= */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-900" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Official Cryptographic Audit Trail
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Officer: {roleInfo.name} ({roleInfo.id}) • Station: {roleInfo.station}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-blue-950 flex items-center justify-between">
                <span>
                  Tamper-evident log verified against Police Headquarters Chain of Custody.
                </span>
                <span className="font-mono text-[11px] font-bold">SHA-256 Valid</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Target Resource</th>
                      <th className="py-2.5 px-3">IP / Terminal</th>
                      <th className="py-2.5 px-3">Integrity Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {INITIAL_ACTIVITIES.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {act.date} {act.time}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {act.action}
                        </td>
                        <td className="py-2 px-3 text-slate-600 truncate max-w-[180px]">
                          {act.target}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {act.ipAddress}
                        </td>
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={act.hash}>
                          {act.hash ? act.hash.slice(0, 10) + '...' : 'Verified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Log entries: {INITIAL_ACTIVITIES.length} events recorded
              </span>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CHANGE PASSWORD MODAL */}
      {/* ========================================================================= */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-800" />
                <h3 className="text-sm font-bold text-slate-900">Change Officer Password</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Secure Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white"
                  placeholder="Re-type new password"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
