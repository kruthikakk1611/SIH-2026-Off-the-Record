import React from 'react';
import {
  Search,
  FolderLock,
  Users,
  Car,
  MapPin,
  FileCheck2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { CaseRecord, SuspectProfile, EvidenceRecord, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SearchResultsViewProps {
  query: string;
  cases: CaseRecord[];
  suspects: SuspectProfile[];
  evidenceList: EvidenceRecord[];
  onSelectCase: (caseItem: CaseRecord) => void;
  onSelectSuspect: (suspect: SuspectProfile) => void;
  onSelectEvidence: (evidence: EvidenceRecord) => void;
  onNavigate: (page: NavPage) => void;
  onSearchChange: (newQuery: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  cases,
  suspects,
  evidenceList,
  onSelectCase,
  onSelectSuspect,
  onSelectEvidence,
  onNavigate,
  onSearchChange,
}) => {
  const { t } = useLanguage();
  const q = query.toLowerCase().trim();

  const matchingCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.crimeType.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q)
  );

  const matchingPeople = suspects.filter(
    (s) =>
      s.codeName.toLowerCase().includes(q) ||
      (s.alias && s.alias.toLowerCase().includes(q)) ||
      s.bio.toLowerCase().includes(q)
  );

  const matchingVehicles = [
    {
      id: 'VEH-01',
      plate: 'DL-08-CY-4902',
      name: 'Vehicle X (Black SUV)',
      owner: 'Person A',
      cases: ['CASE-0102', 'CASE-0078'],
    },
    {
      id: 'VEH-02',
      plate: 'KA-01-MJ-8819',
      name: 'Vehicle Z (White Delivery Van)',
      owner: 'Person B',
      cases: ['CASE-0102'],
    },
  ].filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.plate.toLowerCase().includes(q) ||
      v.owner.toLowerCase().includes(q) ||
      'vehicle'.includes(q)
  );

  const totalHits =
    matchingCases.length +
    matchingPeople.length +
    matchingVehicles.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Search Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to Dashboard')}</span>
          </button>

          <span className="text-xs font-mono font-semibold text-slate-500">
            {totalHits} {t('matches found')}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t('Search Results for')} <span className="font-mono text-blue-900">"{query || t('All')}"</span>
          </h1>
        </div>

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400">{t('Quick searches')}:</span>
          {['CASE-0102', 'Person A', 'Vehicle X', 'CASE-0078'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSearchChange(term)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs cursor-pointer transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Search Results */}
      <div className="space-y-4">
        {/* Cases */}
        {matchingCases.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              <FolderLock className="w-4 h-4 text-blue-900" />
              <span>{t('Matching Cases')} ({matchingCases.length})</span>
            </div>

            <div className="space-y-2">
              {matchingCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-blue-900">{c.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{t(c.priority)} {t('Priority')}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{t(c.title)}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suspects */}
        {matchingPeople.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              <Users className="w-4 h-4 text-blue-900" />
              <span>{t('Matching Suspects')} ({matchingPeople.length})</span>
            </div>

            <div className="space-y-2">
              {matchingPeople.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectSuspect(p);
                    onNavigate('suspects');
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                      {p.codeName.slice(-1)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{p.codeName}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {t('Alias')}: {p.alias || t('Classified')} • {t('Status')}: {t('Under Investigation')}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicles */}
        {matchingVehicles.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              <Car className="w-4 h-4 text-amber-700" />
              <span>{t('Matching Vehicles')} ({matchingVehicles.length})</span>
            </div>

            <div className="space-y-2">
              {matchingVehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t(v.name)}</div>
                    <div className="text-slate-500 font-mono mt-0.5">
                      {t('Plate')}: {v.plate} • {t('Associated')}: {v.owner}
                    </div>
                  </div>
                  <span className="font-mono text-blue-900 font-semibold">
                    {v.cases.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
