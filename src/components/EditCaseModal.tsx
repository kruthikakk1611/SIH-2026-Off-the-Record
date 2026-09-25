import React, { useState } from 'react';
import {
  X,
  Edit3,
  Users,
  FileCheck2,
  Shield,
} from 'lucide-react';
import { CaseRecord, CasePriority, SuspectProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EditCaseModalProps {
  isOpen: boolean;
  caseItem: CaseRecord;
  onClose: () => void;
  onSaveEdit: (
    updatedCase: CaseRecord,
    notificationMessage: string
  ) => void;
  availableSuspects: SuspectProfile[];
}

export const EditCaseModal: React.FC<EditCaseModalProps> = ({
  isOpen,
  caseItem,
  onClose,
  onSaveEdit,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const [title, setTitle] = useState(caseItem.title);
  const [priority, setPriority] = useState<CasePriority>(caseItem.priority);
  const [newSuspect, setNewSuspect] = useState('');
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [department, setDepartment] = useState(caseItem.department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let notificationChanges: string[] = [];

    if (priority !== caseItem.priority) {
      notificationChanges.push(`Case priority changed from ${caseItem.priority} to ${priority}.`);
    }
    if (newSuspect.trim()) {
      notificationChanges.push(`Officer-317 added ${newSuspect.trim()}.`);
    }
    if (newEvidenceTitle.trim()) {
      notificationChanges.push(`Officer-204 added Evidence "${newEvidenceTitle.trim()}".`);
    }
    if (newNote.trim()) {
      notificationChanges.push(`Investigator notes appended to dossier.`);
    }

    const notificationMsg =
      notificationChanges.length > 0
        ? notificationChanges.join(' ')
        : `Case parameters updated by Lead Officer.`;

    const updatedCase: CaseRecord = {
      ...caseItem,
      title,
      priority,
      department,
      suspectsCount: newSuspect ? caseItem.suspectsCount + 1 : caseItem.suspectsCount,
      evidenceCount: newEvidenceTitle ? caseItem.evidenceCount + 1 : caseItem.evidenceCount,
      summary: newNote
        ? `${caseItem.summary} [Update: ${newNote}]`
        : caseItem.summary,
    };

    onSaveEdit(updatedCase, notificationMsg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#11131a] border-2 border-blue-700 rounded-2xl w-full max-w-xl p-6 sm:p-7 relative shadow-2xl animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="w-11 h-11 rounded-xl bg-[#181b26] border border-blue-600 flex items-center justify-center text-blue-400">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200">
                {caseItem.id}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>{t('Authorized Officer Edit Mode')}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {t('Edit Investigation Parameters')}
            </h2>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1">
              {t('Case Title')}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                {t('Change Status / Priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Critical">🔴 {t('Critical')}</option>
                <option value="High">🟠 {t('High')}</option>
                <option value="Medium">🟡 {t('Medium')}</option>
                <option value="Completed">🟢 {t('Completed')}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                {t('Assigned Department')}
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Add Suspect field */}
          <div className="p-3.5 rounded-xl bg-[#090b10] border border-slate-800/80 space-y-2">
            <label className="block font-bold text-blue-300 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{t('Add Suspect / Person of Interest')}</span>
            </label>
            <input
              type="text"
              value={newSuspect}
              onChange={(e) => setNewSuspect(e.target.value)}
              placeholder={t('e.g. Person C (Mule Network Recruiter)')}
              className="w-full px-3 py-2 bg-[#151822] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-400 block">
              {t('Triggers live notification on audit trail')}
            </span>
          </div>

          {/* Add Evidence field */}
          <div className="p-3.5 rounded-xl bg-[#090b10] border border-slate-800/80 space-y-2">
            <label className="block font-bold text-sky-300 uppercase flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>{t('Add Evidence Item')}</span>
            </label>
            <input
              type="text"
              value={newEvidenceTitle}
              onChange={(e) => setNewEvidenceTitle(e.target.value)}
              placeholder={t('e.g. Evidence EV-1027 (Encrypted Financial Ledger)')}
              className="w-full px-3 py-2 bg-[#151822] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-400 block">
              {t('Triggers live notification on forensic ledger')}
            </span>
          </div>

          {/* Add Notes */}
          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1">
              {t('Add Case Progress Notes')}
            </label>
            <textarea
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={t('Record new interrogation findings or forensic test results...')}
              className="w-full px-3.5 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">
              {t('Action logged to permanent audit trail')}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                id="btn-save-case-changes"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                {t('Save Changes & Broadcast')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
