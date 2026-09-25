import React, { useState, useMemo } from 'react';
import { Search, Plus, Lock, ArrowRight } from 'lucide-react';
import { CaseRecord, CasePriority, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CasesViewProps {
  cases: CaseRecord[];
  onSelectCase: (caseItem: CaseRecord) => void;
  onOpenFullCase?: (caseItem: CaseRecord) => void;
  onOpenCreateCaseModal: () => void;
  onNavigate: (page: NavPage) => void;
  secretRoomCaseIds?: Set<string>;
  hasSecretRoomAccess?: boolean;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  onSelectCase,
  onOpenFullCase,
  onOpenCreateCaseModal,
  secretRoomCaseIds,
  hasSecretRoomAccess = true,
}) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | CasePriority>('All');

  const filters: ('All' | CasePriority)[] = ['All', 'Critical', 'High', 'Medium', 'Completed'];

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesFilter = selectedFilter === 'All' || c.priority === selectedFilter;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [cases, selectedFilter, searchTerm]);

  const handleRowClick = (caseItem: CaseRecord) => {
    onSelectCase(caseItem);
  };

  const renderPriorityBadge = (priority: CasePriority) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-red-600 text-white shadow-xs">
            {t('Critical')}
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-300">
            {t('High')}
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-black border border-slate-300">
            {t('Medium')}
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            {t('Completed')}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">{t('Cases')}</h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            {t('Active and archived criminal case files across departments.')}
          </p>
        </div>

        <button
          type="button"
          id="btn-cases-new-case"
          onClick={onOpenCreateCaseModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('New Case')}</span>
        </button>
      </div>

      {/* Controls: Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Cases */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="cases-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('Search cases by ID, title, or department...')}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Filters: All | Critical | High | Medium | Completed */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter}
                id={`filter-case-${filter.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedFilter === filter
                    ? filter === 'Critical'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black'
                }`}
              >
                {t(filter)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Table/List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-black uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{t('Case ID')}</th>
                <th className="py-3.5 px-4">{t('Case Name')}</th>
                <th className="py-3.5 px-4">{t('Priority')}</th>
                <th className="py-3.5 px-4">{t('Department')}</th>
                <th className="py-3.5 px-4">{t('Progress')}</th>
                <th className="py-3.5 px-4 text-right">{t('Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {t('No cases match the selected search or filter criteria.')}
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    id={`case-row-${c.id}`}
                    onClick={() => handleRowClick(c)}
                    className="hover:bg-slate-50/90 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-blue-600 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-black hover:text-blue-600 transition-colors">
                      <div className="flex items-center gap-2">
                        <span>{t(c.title)}</span>
                        {hasSecretRoomAccess && secretRoomCaseIds?.has(c.id) && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> {t('Secret Room')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderPriorityBadge(c.priority)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      {t(c.department)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-black">
                          {c.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        id={`btn-view-full-case-${c.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(c);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-800 text-xs font-bold transition-colors shrink-0 shadow-2xs cursor-pointer"
                      >
                        <span>{t('View Full Case')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
