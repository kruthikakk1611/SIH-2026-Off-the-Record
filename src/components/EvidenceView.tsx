import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { EvidenceRecord, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EvidenceViewProps {
  evidenceList: EvidenceRecord[];
  onAddNewEvidence?: (record: EvidenceRecord) => void;
  onNavigate?: (page: NavPage) => void;
  selectedEvidenceItem?: EvidenceRecord | null;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  evidenceList,
  onAddNewEvidence,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New evidence form
  const [title, setTitle] = useState('');
  const [caseId, setCaseId] = useState('CASE-0102');
  const [type, setType] = useState('Digital');
  const [description, setDescription] = useState('');

  const types = ['ALL', 'Digital', 'Physical', 'Financial', 'Document'];

  const filtered = evidenceList.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      e.id.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.caseId.toLowerCase().includes(q);
    const matchesType = selectedType === 'ALL' || e.type === selectedType;
    return matchesQuery && matchesType;
  });

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!title.trim() || !onAddNewEvidence) return;

    const newRecord: EvidenceRecord = {
      id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      caseId,
      type,
      dateAdded: 'Today',
      collectedBy: 'Investigating Officer',
      status: 'Verified',
      fileSize: '1.2 MB',
      blockchainHash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockNumber: 142091,
      description: description || 'Officially logged in forensic evidence register.',
    };

    onAddNewEvidence(newRecord);
    setTitle('');
    setDescription('');
    setIsUploadOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">{t('Evidence')}</h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            {t('Chain-of-custody forensic ledger for digital and physical artifacts.')}
          </p>
        </div>

        {onAddNewEvidence && (
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Add Evidence')}</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search evidence ID, title, or case...')}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {types.map((typeItem) => (
              <button
                key={typeItem}
                type="button"
                onClick={() => setSelectedType(typeItem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedType === typeItem
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black'
                }`}
              >
                {t(typeItem)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-black uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('Evidence ID')}</th>
                <th className="py-3 px-4">{t('Title')}</th>
                <th className="py-3 px-4">{t('Case ID')}</th>
                <th className="py-3 px-4">{t('Type')}</th>
                <th className="py-3 px-4">{t('Status')}</th>
                <th className="py-3 px-4">{t('Date Logged')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedEvidence(item)}
                  className="hover:bg-slate-50/90 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-blue-600">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-black hover:text-blue-600 transition-colors">{t(item.title)}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-slate-700">{item.caseId}</td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600">{t(item.type || 'Digital')}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {t(item.status || 'Verified')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{item.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedEvidence.id}</span>
                <h3 className="text-lg font-extrabold text-black">{t(selectedEvidence.title)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-black cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 font-bold block">{t('Description')}:</span>
                <p className="mt-1 text-slate-900 font-medium">{t(selectedEvidence.description)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Case')}:</span>
                  <span className="font-bold text-black">{selectedEvidence.caseId}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('Chain Status')}:</span>
                  <span className="font-bold text-blue-700">{t('Verified & Intact')}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] break-all">
                <span className="text-slate-500 font-bold block text-[10px] uppercase">{t('Forensic Hash')}:</span>
                <span className="text-slate-800 font-semibold">{selectedEvidence.blockchainHash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f'}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 bg-black hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-black">{t('Add Forensic Evidence')}</h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-black cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-black mb-1">{t('Title / Label')}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Seized Mobile Handset (Burner SIM)"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-black mb-1">{t('Case ID')}</label>
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold text-black focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">{t('Artifact Type')}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-black focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Digital">{t('Digital')}</option>
                    <option value="Physical">{t('Physical')}</option>
                    <option value="Financial">{t('Financial')}</option>
                    <option value="Document">{t('Document')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-black mb-1">{t('Description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Custody details, seizure location, officer badge..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-black focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-3 py-2 bg-slate-100 text-slate-700 hover:text-black rounded-lg text-xs font-bold cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {t('Save Record')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
