import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { NavPage, CaseRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbsProps {
  currentPage: NavPage;
  selectedCase?: CaseRecord | null;
  onNavigate: (page: NavPage) => void;
  caseSubSection?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPage,
  selectedCase,
  onNavigate,
  caseSubSection,
}) => {
  const { t } = useLanguage();
  // If on dashboard, render a minimal clean indicator or keep it simple
  const isDashboard = currentPage === 'dashboard';

  const getPageTitle = (page: NavPage): string => {
    switch (page) {
      case 'dashboard':
        return t('Dashboard');
      case 'cases':
        return t('Cases');
      case 'full-case':
        return selectedCase ? selectedCase.id : t('Case File');
      case 'suspects':
        return t('Suspects');
      case 'evidence':
        return t('Evidence');
      case 'network':
        return t('Connection Map');
      case 'compare':
        return t('Compare Cases');
      case 'ai-assistant':
        return t('AI Assistant');
      case 'blindspots':
        return t('Blind Spots');
      case 'reports':
        return t('Reports');
      case 'notifications':
        return t('Notifications');
      case 'profile':
        return t('Profile');
      case 'settings':
        return t('Settings');
      case 'search':
        return t('Search Results');
      case 'secret-room':
        return t('Secret Room');
      default:
        return t('Overview');
    }
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="flex items-center justify-between text-xs text-slate-500 mb-6 py-2 px-3 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium"
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Dashboard root link */}
        <button
          type="button"
          id="breadcrumb-home"
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-600 ${
            isDashboard ? 'font-bold text-slate-900' : 'text-slate-500'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>{t('Dashboard')}</span>
        </button>

        {!isDashboard && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {currentPage === 'full-case' ? (
              <>
                <button
                  type="button"
                  id="breadcrumb-cases"
                  onClick={() => onNavigate('cases')}
                  className="hover:text-blue-600 text-slate-500 cursor-pointer transition-colors"
                >
                  {t('Cases')}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900 font-mono">
                  {selectedCase ? selectedCase.id : t('Case Overview')}
                </span>
                {caseSubSection && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-blue-700 font-bold capitalize">
                      {t(caseSubSection)}
                    </span>
                  </>
                )}
              </>
            ) : currentPage === 'secret-room' && selectedCase ? (
              <>
                <button
                  type="button"
                  id="breadcrumb-cases"
                  onClick={() => onNavigate('cases')}
                  className="hover:text-blue-600 text-slate-500 cursor-pointer transition-colors"
                >
                  {t('Cases')}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <button
                  type="button"
                  id="breadcrumb-case-detail"
                  onClick={() => onNavigate('full-case')}
                  className="hover:text-blue-600 text-slate-500 cursor-pointer transition-colors font-mono"
                >
                  {selectedCase.id}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900">
                  {t('Secret Room')}
                </span>
              </>
            ) : currentPage === 'reports' && selectedCase ? (
              <>
                <button
                  type="button"
                  id="breadcrumb-cases"
                  onClick={() => onNavigate('cases')}
                  className="hover:text-blue-600 text-slate-500 cursor-pointer transition-colors"
                >
                  {t('Cases')}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <button
                  type="button"
                  id="breadcrumb-case-detail"
                  onClick={() => onNavigate('full-case')}
                  className="hover:text-blue-600 text-slate-500 cursor-pointer transition-colors font-mono"
                >
                  {selectedCase.id}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900">
                  {t('Case Report')}
                </span>
              </>
            ) : (
              <span className="font-bold text-slate-900">
                {getPageTitle(currentPage)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Quick Back Action when not on Dashboard */}
      {!isDashboard && (
        <button
          type="button"
          id="breadcrumb-back-btn"
          onClick={() => {
            if (currentPage === 'full-case') {
              onNavigate('cases');
            } else if (currentPage === 'secret-room' || currentPage === 'reports') {
              onNavigate('full-case');
            } else {
              onNavigate('dashboard');
            }
          }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-black cursor-pointer px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{t('Back')}</span>
        </button>
      )}
    </nav>
  );
};
