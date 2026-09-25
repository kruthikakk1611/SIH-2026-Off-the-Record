import React, { useState } from 'react';
import { Search, Plus, ArrowRight, FolderLock, Lock } from 'lucide-react';
import { CaseRecord, NavPage, OfficerProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardViewProps {
  cases: CaseRecord[];
  officer: OfficerProfile;
  onNavigate: (page: NavPage) => void;
  onSelectCase: (caseItem: CaseRecord) => void;
  onOpenCreateCaseModal: () => void;
  onSearch: (query: string) => void;
  hasSecretRoomAccess?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  officer,
  onNavigate,
  onSelectCase,
  onOpenCreateCaseModal,
  onSearch,
  hasSecretRoomAccess = true,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // We highlight 3-4 priority cases as specified in Section 3
  const priorityCases = cases.slice(0, 3);

  // Clean 4 stats as specified in Section 3
  const stats = [
    { label: 'Active Cases', value: '12' },
    { label: 'High Priority', value: '4' },
    { label: 'Cases Solved', value: '28' },
    { label: 'New Alerts', value: '5' },
  ];

  // Latest 4 activities as specified in Section 3
  const recentActivities = [
    {
      id: 'act-1',
      text: 'New evidence added to CASE-0102',
      time: '12m ago',
      caseId: 'CASE-0102',
    },
    {
      id: 'act-2',
      text: 'Related case detected',
      time: '45m ago',
      caseId: 'CASE-0078',
    },
    {
      id: 'act-3',
      text: 'Suspect profile updated',
      time: '2h ago',
      caseId: 'CASE-0102',
    },
    {
      id: 'act-4',
      text: 'AI alert generated',
      time: '3h ago',
      caseId: 'CASE-0041',
    },
  ];

  // Helper for clean priority badge (Red for critical alerts, black/blue for standard)
  const renderPriorityBadge = (priority: string) => {
    const isCritical = priority.toLowerCase() === 'critical';
    const isHigh = priority.toLowerCase() === 'high';

    if (isCritical) {
      return (
        <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-red-600 text-white shadow-xs tracking-wide">
          {t('CRITICAL')}
        </span>
      );
    }
    if (isHigh) {
      return (
        <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-red-50 text-red-700 border border-red-300">
          {t('HIGH')}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-100 text-black border border-slate-300">
        {t(priority.toUpperCase())}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Header Row with Greetings & Top-Right Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            {t('Good morning, Officer')}
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            {t("Here's your investigation overview.")}
          </p>
        </div>

        {/* Top-Right: Search and + New Case */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-64 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="dashboard-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search cases, suspects, vehicles...')}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-black placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
            />
          </form>

          <button
            type="button"
            id="btn-dashboard-new-case"
            onClick={onOpenCreateCaseModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('New Case')}</span>
          </button>
        </div>
      </div>

      {/* 4 Small Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const isAlert = stat.label.toLowerCase().includes('alert');
          const isActive = stat.label.toLowerCase().includes('active');

          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t(stat.label)}
                </div>
                {isAlert && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                )}
              </div>
              <div
                className={`text-3xl font-extrabold font-mono tracking-tight ${
                  isAlert ? 'text-red-600' : isActive ? 'text-blue-600' : 'text-black'
                }`}
              >
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Priority Cases Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-lg font-extrabold text-black tracking-tight">{t('Priority Cases')}</h2>
          </div>
          <button
            type="button"
            id="link-view-all-cases"
            onClick={() => onNavigate('cases')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('View All Cases')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {priorityCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50 px-3 rounded-lg transition-colors cursor-pointer group"
            >
              {/* Case ID and Case Name */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {c.id}
                  </span>
                  <span className="text-sm font-extrabold text-black group-hover:text-blue-600 transition-colors">
                    {t(c.title)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 pl-0.5">
                  {t('Department:')} <span className="font-medium text-slate-700">{t(c.department)}</span>
                </div>
              </div>

              {/* Priority, Progress, and View Case Button */}
              <div className="flex items-center justify-between md:justify-end gap-5">
                {/* Priority */}
                <div>{renderPriorityBadge(c.priority)}</div>

                {/* Progress */}
                <div className="w-28 text-right">
                  <div className="text-xs font-medium text-slate-600">
                    {t('Progress')} <span className="font-extrabold text-black">{c.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>

                {/* Explicit View Case → Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id={`btn-view-case-${c.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors shrink-0 shadow-2xs cursor-pointer"
                  >
                    <span>{t('View Case')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-black" />
          <h2 className="text-lg font-extrabold text-black tracking-tight">
            {t('Recent Activity')}
          </h2>
        </div>

        <div className="space-y-3">
          {recentActivities.map((act) => {
            const isAlertAct = act.text.toLowerCase().includes('alert') || act.text.toLowerCase().includes('critical') || act.text.toLowerCase().includes('red-flag');

            return (
              <div
                key={act.id}
                className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${isAlertAct ? 'bg-red-600' : 'bg-blue-600'}`} />
                  <span className="text-slate-800 font-medium">{t(act.text)}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{act.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
