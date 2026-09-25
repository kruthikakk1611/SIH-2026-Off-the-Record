import React, { useState, useMemo } from 'react';
import {
  Lock,
  Shield,
  Users,
  UserPlus,
  UserMinus,
  Search,
  MessageSquare,
  FileText,
  AlertCircle,
  FolderLock,
  ArrowLeft,
  Send,
  Check,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  EyeOff,
  Eye,
  KeyRound,
  Key,
  RotateCcw,
  Copy,
  Unlock,
} from 'lucide-react';
import {
  CaseRecord,
  OfficerProfile,
  SecretRoom,
  SecretRoomMember,
  SecretRoomPost,
  SimulatedCrimeXUser,
} from '../types';
import { SIMULATED_CRIMEX_USERS, DEFAULT_SECRET_ROOM_PASSWORD } from '../data/simulatedUsers';
import {
  OfficerAccessControlEntry,
  checkOfficerSecretRoomAccess,
  getOfficerAccessList,
} from '../data/roleAccessData';
import { useLanguage } from '../context/LanguageContext';

interface SecretRoomViewProps {
  room: SecretRoom;
  caseItem: CaseRecord;
  officer: OfficerProfile;
  onBackToCase: () => void;
  onUpdateRoom: (updatedRoom: SecretRoom) => void;
  canManageAccess?: boolean;
  officerAccessList?: OfficerAccessControlEntry[];
  onToggleOfficerAccess?: (officerId: string, granted: boolean) => void;
}

export const SecretRoomView: React.FC<SecretRoomViewProps> = ({
  room,
  caseItem,
  officer,
  onBackToCase,
  onUpdateRoom,
  canManageAccess = false,
  officerAccessList = [],
  onToggleOfficerAccess,
}) => {
  const { t } = useLanguage();
  // Password Authentication State - MUST start locked every time
  const effectivePassword = room.password || DEFAULT_SECRET_ROOM_PASSWORD;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showEnteredPassword, setShowEnteredPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Passcode Settings Modal State
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [editPasscode, setEditPasscode] = useState(effectivePassword);
  const [showEditPasscode, setShowEditPasscode] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState('');

  // Member Search State
  const [searchUserId, setSearchUserId] = useState('');
  const [showAddMemberPanel, setShowAddMemberPanel] = useState(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  // Remove Member Confirmation Modal State
  const [memberToRemove, setMemberToRemove] = useState<SecretRoomMember | null>(null);

  // New Post State
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'message' | 'finding' | 'note'>('message');
  const [activeFilter, setActiveFilter] = useState<'all' | 'message' | 'finding' | 'note'>('all');

  // Strict Case Security: Reset unlock and credentials if active room or case ID shifts
  React.useEffect(() => {
    setIsUnlocked(false);
    setEnteredPassword('');
    setPasswordError('');
    setEditPasscode(room.password || DEFAULT_SECRET_ROOM_PASSWORD);
  }, [room.id, room.caseId, caseItem.id]);

  // Normalized Creator Display Name and ID
  const creatorDisplayName = useMemo(() => {
    if (
      room.createdByOfficerName?.toLowerCase().includes('arjun sharma') ||
      room.createdByOfficerId === 'DGP-0001' ||
      room.createdByOfficerId === 'OFF-2047'
    ) {
      return 'DGP Arjun Sharma';
    }
    if (room.createdByOfficerName) {
      return room.createdByOfficerName.replace(/Inspector\s+/i, 'DGP ');
    }
    return 'DGP Arjun Sharma';
  }, [room.createdByOfficerName, room.createdByOfficerId]);

  const creatorOfficerId = useMemo(() => {
    if (
      room.createdByOfficerName?.toLowerCase().includes('arjun sharma') ||
      room.createdByOfficerId === 'DGP-0001' ||
      room.createdByOfficerId === 'OFF-2047'
    ) {
      return 'DGP-0001';
    }
    return room.createdByOfficerId || 'DGP-0001';
  }, [room.createdByOfficerName, room.createdByOfficerId]);

  // Determine if currently logged-in officer is strictly the CREATOR of this Secret Room
  const isOfficerCreator = useMemo(() => {
    if (!officer) return false;
    const offId = (officer.id || '').trim().toLowerCase();
    const offName = (officer.name || '').trim().toLowerCase();

    // 1. Direct ID match on room creator ID
    if (room.createdByOfficerId && offId) {
      if (room.createdByOfficerId.trim().toLowerCase() === offId) return true;
    }

    // 2. Direct match with creator member record
    const creatorMember = room.members.find((m) => m.isCreator);
    if (creatorMember) {
      if (offId && creatorMember.userId.toLowerCase() === offId) return true;
      if (offName && creatorMember.name.toLowerCase() === offName) return true;
    }

    // 3. Match normalized creator names
    if (room.createdByOfficerName && offName) {
      const cleanRoomCreator = room.createdByOfficerName
        .replace(/^(dgp|insp|inspector|sub-insp|sub-inspector|psi|pi|dsp|dcp|sp|dr\.)\s+/i, '')
        .trim()
        .toLowerCase();
      const cleanOffName = offName
        .replace(/^(dgp|insp|inspector|sub-insp|sub-inspector|psi|pi|dsp|dcp|sp|dr\.)\s+/i, '')
        .trim()
        .toLowerCase();
      if (cleanRoomCreator && cleanOffName && cleanRoomCreator === cleanOffName) return true;
    }

    // 4. Default DGP Arjun Sharma fallback
    const isRoomArjun =
      (room.createdByOfficerName && room.createdByOfficerName.toLowerCase().includes('arjun sharma')) ||
      room.createdByOfficerId === 'DGP-0001';
    const isOfficerArjun =
      (officer.name && officer.name.toLowerCase().includes('arjun sharma')) ||
      officer.id === 'DGP-0001';
    if (isRoomArjun && isOfficerArjun) return true;

    return false;
  }, [room.createdByOfficerId, room.createdByOfficerName, room.members, officer]);

  // Dynamic anonymous member index mapping for non-creator members
  const memberIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let count = 1;
    // Iterate over all members who are not the creator
    room.members
      .filter((m) => !m.isCreator && m.userId !== creatorOfficerId)
      .forEach((m) => {
        if (m.userId) map.set(m.userId.toLowerCase(), count);
        if (m.name) map.set(m.name.toLowerCase(), count);
        count++;
      });
    return map;
  }, [room.members, creatorOfficerId]);

  // Check if current authenticated officer is an authorized member of THIS specific case room
  const isCurrentViewerAuthorized = useMemo(() => {
    if (!officer) return false;

    // 1. If officer is the creator/admin of this specific room -> Authorized
    if (isOfficerCreator) return true;

    // 2. If officer is an active member in THIS specific case room's roster -> Authorized
    const isInRoomMembers = room.members.some(
      (m) =>
        m.userId.toLowerCase() === (officer?.id || '').toLowerCase() ||
        (m.name && officer?.name && m.name.toLowerCase() === officer.name.toLowerCase())
    );
    if (isInRoomMembers) return true;

    // 3. Fallback for DGP State Command Apex clearance if general clearance is active
    if (
      officer.role === 'DGP' ||
      officer.id === 'DGP-0001' ||
      (officer.name && officer.name.toLowerCase().includes('arjun sharma'))
    ) {
      return true;
    }

    // Otherwise strictly NOT authorized (e.g. member from another case or removed member)
    return false;
  }, [room.members, officer, isOfficerCreator]);

  // Matching user in directory for search
  const matchingUsers = useMemo(() => {
    const trimmed = searchUserId.trim().toLowerCase();
    if (!trimmed) return [];

    return SIMULATED_CRIMEX_USERS.filter((u) => {
      const idMatch = u.userId.toLowerCase().includes(trimmed);
      const nameMatch = u.name.toLowerCase().includes(trimmed);
      const deptMatch = u.department.toLowerCase().includes(trimmed);
      return idMatch || nameMatch || deptMatch;
    });
  }, [searchUserId]);

  // Add Member Handler - ONLY creator can invite members
  const handleAddMember = (user: SimulatedCrimeXUser) => {
    if (!isOfficerCreator) {
      setAddFeedback('Access Denied: Only the Secret Room creator has permission to invite or add members.');
      setTimeout(() => setAddFeedback(null), 3500);
      return;
    }

    if (room.members.some((m) => m.userId.toLowerCase() === user.userId.toLowerCase())) {
      setAddFeedback(`Officer ${user.name} (${user.userId}) is already in this Secret Room.`);
      setTimeout(() => setAddFeedback(null), 3000);
      return;
    }

    const now = new Date();
    const formattedTime = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newMember: SecretRoomMember = {
      userId: user.userId,
      name: user.name,
      rank: user.rank,
      department: user.department,
      badge: user.badge,
      isCreator: false,
      addedAt: now.toISOString(),
    };

    // Also add an automatic system note in the room
    const systemPost: SecretRoomPost = {
      id: `post-add-${Date.now()}`,
      senderId: officer.id || 'DGP-0001',
      senderName: officer.name || 'DGP Arjun Sharma',
      senderRank: officer.rank || 'Director General of Police (DGP)',
      content: `Added ${user.name} (${user.userId} • ${user.department}) to the Secret Room.`,
      timestamp: formattedTime,
      type: 'note',
    };

    const updatedRoom: SecretRoom = {
      ...room,
      members: [...room.members, newMember],
      posts: [systemPost, ...room.posts],
    };

    onUpdateRoom(updatedRoom);
    setSearchUserId('');
    setAddFeedback(`Successfully added ${user.name} (${user.userId}) to the Secret Room.`);
    setTimeout(() => setAddFeedback(null), 3500);
  };

  // Remove Member Handler - ONLY creator can remove members
  const handleConfirmRemoveMember = () => {
    if (!memberToRemove || !isOfficerCreator) return;

    // Cannot remove creator
    if (memberToRemove.isCreator) return;

    const now = new Date();
    const formattedTime = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const systemPost: SecretRoomPost = {
      id: `post-rem-${Date.now()}`,
      senderId: officer.id || 'DGP-0001',
      senderName: officer.name || 'DGP Arjun Sharma',
      senderRank: officer.rank || 'Director General of Police (DGP)',
      content: `Removed ${memberToRemove.name} (${memberToRemove.userId}) from the Secret Room. Clearance revoked.`,
      timestamp: formattedTime,
      type: 'note',
    };

    const updatedRoom: SecretRoom = {
      ...room,
      members: room.members.filter((m) => m.userId !== memberToRemove.userId),
      posts: [systemPost, ...room.posts],
    };

    onUpdateRoom(updatedRoom);
    setMemberToRemove(null);
  };

  // Post Message/Note/Finding Handler - Compulsorily posts under logged-in officer identity
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const now = new Date();
    const formattedTime = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newPost: SecretRoomPost = {
      id: `post-${Date.now()}`,
      senderId: officer?.id || 'DGP-0001',
      senderName: officer?.name || 'DGP Arjun Sharma',
      senderRank: officer?.rank || 'Director General of Police (DGP)',
      content: postContent.trim(),
      timestamp: formattedTime,
      type: postType,
    };

    const updatedRoom: SecretRoom = {
      ...room,
      posts: [newPost, ...room.posts],
    };

    onUpdateRoom(updatedRoom);
    setPostContent('');
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return room.posts;
    return room.posts.filter((p) => p.type === activeFilter);
  }, [room.posts, activeFilter]);

  // Non-member users available for simulation testing
  const nonMemberSampleUsers = useMemo(() => {
    const memberIds = new Set(room.members.map((m) => m.userId.toLowerCase()));
    return SIMULATED_CRIMEX_USERS.filter((u) => !memberIds.has(u.userId.toLowerCase()));
  }, [room.members]);

  // Unlock Room Handler - Strictly requires valid password
  const handleUnlockRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEntered = enteredPassword.trim();
    if (!cleanEntered) {
      setPasswordError(
        t('Password is required. Please enter the Secret Room password to gain access.')
      );
      return;
    }
    if (cleanEntered === effectivePassword.trim()) {
      setIsUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError(
        t('Incorrect password. Access denied. Please enter the valid Secret Room password.')
      );
    }
  };

  // Save Modified Passcode Handler - Strictly restricted to Secret Room CREATOR only
  const handleSavePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOfficerCreator) {
      setPasscodeSuccessMsg('Access Denied: Only the Secret Room creator has permission to change the passcode.');
      return;
    }
    if (!editPasscode.trim()) return;
    const updated: SecretRoom = {
      ...room,
      password: editPasscode.trim(),
    };
    onUpdateRoom(updated);
    setPasscodeSuccessMsg('Passcode updated successfully.');
    setTimeout(() => {
      setPasscodeSuccessMsg('');
      setShowPasscodeModal(false);
    }, 1200);
  };

  // Copy Passcode to Clipboard
  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(effectivePassword);
    setCopiedPasscode(true);
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  // Leave / Exit Room Handler - Completely clears unlock state
  const handleLeaveRoom = () => {
    setIsUnlocked(false);
    setEnteredPassword('');
    setPasswordError('');
    onBackToCase();
  };

  // 0. PASSWORD ENTRY AUTHENTICATION SCREEN (If not unlocked)
  if (!isUnlocked) {
    return (
      <div className="max-w-lg mx-auto my-6 animate-in fade-in duration-200">
        {/* Back Navigation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleLeaveRoom}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Case ({caseItem.id})</span>
          </button>
        </div>

        {/* Auth Container Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Top Security Banner */}
          <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black tracking-tight text-white">
                    Secret Room Authentication
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                    Encrypted
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Enter confidential room passcode to enter workspace
                </p>
              </div>
            </div>

            {/* Room Identifier Card */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{room.roomName}</span>
                <span className="font-mono text-[11px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">
                  {caseItem.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {t('Case')}: {t(caseItem.title)}
              </p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleUnlockRoom} className="p-6 space-y-4">
            {/* Default Password Callout / Quick Fill */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950 flex items-center gap-2">
                    <span>Default Secret Room Password:</span>
                    <span className="font-mono font-black text-xs bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 shadow-2xs">
                      {DEFAULT_SECRET_ROOM_PASSWORD}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Use this default passcode to unlock the room, or enter a custom passcode if configured.
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="btn-auto-fill-default-password"
                onClick={() => {
                  setEnteredPassword(effectivePassword);
                  setPasswordError('');
                }}
                className="shrink-0 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Fill default password"
              >
                Auto-fill
              </button>
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="input-secret-room-passcode"
                className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between"
              >
                <span>Enter Secret Room Password *</span>
                <span className="text-[11px] font-normal text-slate-400">
                  Case clearance code
                </span>
              </label>
              <div className="relative">
                <input
                  id="input-secret-room-passcode"
                  type={showEnteredPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder={`Enter password (default: ${DEFAULT_SECRET_ROOM_PASSWORD})`}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowEnteredPassword(!showEnteredPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showEnteredPassword ? 'Hide password' : 'Show password'}
                >
                  {showEnteredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit & Secondary Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                id="btn-unlock-secret-room"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock & Enter Secret Room</span>
              </button>

              <button
                type="button"
                onClick={handleLeaveRoom}
                className="w-full py-2 px-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Cancel & Return to Case
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header with Breadcrumbs & Room Identity */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            {/* Case Reference & Back Button */}
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={handleLeaveRoom}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Case ({caseItem.id})</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <FolderLock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t(caseItem.title)}</span>
              </span>
            </div>

            {/* Room Title */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {room.roomName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Secret Room
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                    <Key className="w-3 h-3 text-blue-600" /> Passcode Protected
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Private investigation channel •{' '}
                  {isOfficerCreator ? (
                    <>
                      Created by{' '}
                      <span className="font-semibold text-slate-700">{creatorDisplayName}</span> (
                      {creatorOfficerId})
                    </>
                  ) : (
                    <>
                      Managed by{' '}
                      <span className="font-semibold text-slate-700">Room Admin</span> • End-to-End Encrypted
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions: Passcode and Lock Room */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-secret-room-passcode-info"
              onClick={() => {
                setEditPasscode(effectivePassword);
                setShowPasscodeModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="View or update room passcode"
            >
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>Passcode</span>
            </button>

            <button
              type="button"
              id="btn-lock-secret-room"
              onClick={() => {
                setIsUnlocked(false);
                setEnteredPassword('');
                setPasswordError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="Lock Secret Room"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Lock Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ACCESS CHECK: If Current Officer is NOT Authorized, Display Access Denied Banner */}
      {!isCurrentViewerAuthorized ? (
        <div className="bg-white border border-red-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold font-mono">
              <EyeOff className="w-3.5 h-3.5" />
              <span>ACCESS RESTRICTED • PRIVATE ROOM</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              You are not a member of this Secret Room
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              CrimeX security protocols prohibit viewing this room’s contents. Only verified members
              added by the room creator (<span className="font-semibold">{creatorDisplayName}</span>)
              can view discussions, case findings, or member records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1">
            <div className="text-slate-500 font-medium">Attempted access by:</div>
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>{officer?.name || 'Officer'}</span>
              <span className="font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                {officer?.id || 'UNVERIFIED'}
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">{officer?.department || 'Police Department'}</div>
          </div>

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBackToCase}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Return to Case
            </button>
          </div>
        </div>
      ) : (
        /* 3. AUTHORIZED COLLABORATION VIEW */
        <div className="space-y-5">
          {/* DGP APEX ACCESS & OFFICER CLEARANCE MANAGEMENT PANEL */}
          {(canManageAccess || officer.role === 'DGP') && (
            <div
              id="dgp-access-control-panel"
              className="bg-slate-900 border border-blue-900/60 rounded-2xl p-5 text-white shadow-md space-y-4 animate-in fade-in duration-150"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>DGP Access Management: Officer Authorization</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-500/40 uppercase font-bold">
                        Apex Command
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Director General of Police authorization portal. Manage which investigating officers have permission to access and see the Secret Room.
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-200 text-xs font-mono font-bold self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Apex Security Clearance Active</span>
                </div>
              </div>

              {/* Officers Authorization Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {officerAccessList.map((entry) => {
                  const isDGPUser = entry.officerId === 'DGP-0001' || entry.roleLabel.includes('DGP');
                  return (
                    <div
                      key={entry.officerId}
                      id={`dgp-officer-row-${entry.officerId}`}
                      className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">{entry.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-bold shrink-0">
                            {entry.officerId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {entry.roleLabel} • {entry.department}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clearance:</span>
                          {entry.hasSecretRoomAccess ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              AUTHORIZED (TRUE)
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/50 inline-flex items-center gap-1">
                              <EyeOff className="w-2.5 h-2.5 text-red-400" />
                              DENIED / HIDDEN (FALSE)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isDGPUser ? 'Apex Admin' : entry.hasSecretRoomAccess ? 'Access Granted' : 'Hidden from UI'}
                        </span>
                        {!isDGPUser && (
                          entry.hasSecretRoomAccess ? (
                            <button
                              type="button"
                              id={`btn-revoke-access-${entry.officerId}`}
                              onClick={() => {
                                if (onToggleOfficerAccess) {
                                  onToggleOfficerAccess(entry.officerId, false);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-900/70 hover:bg-red-800 text-red-100 border border-red-700/80 text-xs font-bold cursor-pointer transition-colors shadow-xs"
                              title={`Revoke Secret Room clearance for ${entry.name}`}
                            >
                              Revoke Access
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`btn-grant-access-${entry.officerId}`}
                              onClick={() => {
                                if (onToggleOfficerAccess) {
                                  onToggleOfficerAccess(entry.officerId, true);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                              title={`Authorize ${entry.name} for Secret Room access`}
                            >
                              Grant Access
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Creator Membership Management vs Member Classified Security */}
          <div className="lg:col-span-4 space-y-4">
            {isOfficerCreator ? (
              /* ADMIN / CREATOR: See all members, see member count, see member names/details, add/remove members */
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Room Members ({room.members.length})
                    </h2>
                  </div>
                  <button
                    type="button"
                    id="btn-toggle-add-member"
                    onClick={() => setShowAddMemberPanel(!showAddMemberPanel)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      showAddMemberPanel
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{showAddMemberPanel ? 'Close Search' : 'Add Member'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Only registered officers have permission to view and contribute to this case room. As Creator, you can invite or remove members.
                </p>

                {/* Feedback toast */}
                {addFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{addFeedback}</span>
                  </div>
                )}

                {/* ADD MEMBER PANEL (Search by CrimeX User ID) */}
                {showAddMemberPanel && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label
                        htmlFor="input-search-user-id"
                        className="block text-xs font-bold text-slate-700 mb-1"
                      >
                        Search CrimeX User ID or Name
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          id="input-search-user-id"
                          type="text"
                          value={searchUserId}
                          onChange={(e) => setSearchUserId(e.target.value)}
                          placeholder="Enter User ID (e.g. CX-1042, CX-2081)"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800 font-mono"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Quick Sample Buttons for Instant Evaluation */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Quick Demo User IDs:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {SIMULATED_CRIMEX_USERS.slice(0, 4).map((u) => (
                          <button
                            key={u.userId}
                            type="button"
                            onClick={() => setSearchUserId(u.userId)}
                            className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700 cursor-pointer"
                          >
                            {u.userId}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Matching Results */}
                    {searchUserId.trim() && (
                      <div className="space-y-2 pt-1">
                        <div className="text-[11px] font-bold text-slate-500">
                          {matchingUsers.length} Matching User{matchingUsers.length === 1 ? '' : 's'}:
                        </div>
                        {matchingUsers.length === 0 ? (
                          <div className="p-3 text-center text-xs text-slate-500 bg-white rounded-lg border border-slate-200">
                            No CrimeX user found matching &quot;{searchUserId}&quot;.
                          </div>
                        ) : (
                          matchingUsers.map((user) => {
                            const isAlreadyMember = room.members.some(
                              (m) => m.userId.toLowerCase() === user.userId.toLowerCase()
                            );
                            return (
                              <div
                                key={user.userId}
                                className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                      {user.name}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                                      {user.userId}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {user.rank} • {user.department}
                                  </div>
                                </div>

                                {isAlreadyMember ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold shrink-0">
                                    <Check className="w-3 h-3" /> Added
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAddMember(user)}
                                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs flex items-center gap-1 transition-colors"
                                  >
                                    <UserPlus className="w-3 h-3" />
                                    <span>Add</span>
                                  </button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CURRENT MEMBERS LIST (ADMIN ONLY) */}
                <div className="space-y-2 divide-y divide-slate-100">
                  {room.members.map((member) => {
                    const isArjun =
                      member.name.toLowerCase().includes('arjun sharma') ||
                      member.userId === 'DGP-0001' ||
                      member.userId === 'OFF-2047';
                    const memberDisplayName = isArjun ? 'DGP Arjun Sharma' : member.name;
                    const memberUserId = isArjun ? 'DGP-0001' : member.userId;
                    const memberDept = isArjun
                      ? 'State Police Headquarters & Apex Command'
                      : member.department;

                    return (
                      <div
                        key={member.userId}
                        className="pt-2.5 first:pt-0 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {memberDisplayName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {memberDisplayName}
                              </span>
                              {member.isCreator && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wide">
                                  Creator
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 font-mono">
                              <span>{memberUserId}</span>
                              <span>•</span>
                              <span className="font-sans truncate">{memberDept}</span>
                            </div>
                          </div>
                        </div>

                        {/* Remove Member Option - Strictly creator only */}
                        {!member.isCreator && (
                          <button
                            type="button"
                            onClick={() => setMemberToRemove(member)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title={`Remove ${member.name} from Secret Room`}
                            aria-label={`Remove ${member.name}`}
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* REGULAR MEMBER VIEW: Completely hide member list, real names of other members, member count, and management options */
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Room Security
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    Classified
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Participant Privacy Protected</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    To maintain strict operational security and investigator confidentiality, participant identities and member rosters are classified. Only the Secret Room Admin (Creator) manages membership.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-[11px]">Your Session Status:</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                      AUTHENTICATED
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-blue-100/80">
                    <span className="text-slate-500 font-medium text-[11px]">Case Clearance:</span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {caseItem.id}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Room Info card */}
            <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Room Specifications</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Posts and findings shared here are strictly accessible only by verified personnel authorized for{' '}
                <span className="font-semibold text-slate-800">{room.roomName}</span>. All intelligence remains confidential.
              </p>
            </div>
          </div>

          {/* Right Column: Shared Collaboration & Discussion Space */}
          <div className="lg:col-span-8 space-y-4">
            {/* New Post Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Shared Investigation Space
                  </h2>
                </div>

                {/* Post Category Picker */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setPostType('message')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      postType === 'message'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💬 Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('finding')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      postType === 'finding'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔍 Finding
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('note')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      postType === 'note'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📝 Note
                  </button>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleCreatePost} className="space-y-2.5">
                <textarea
                  id="input-secret-room-post"
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={
                    postType === 'finding'
                      ? 'Share a breakthrough finding, decrypted data, or verified lead...'
                      : postType === 'note'
                      ? 'Document an internal note or task for room members...'
                      : 'Post a message to collaborate with members...'
                  }
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>Posting as:</span>
                    {isOfficerCreator ? (
                      <>
                        <span className="font-bold text-slate-800">{officer?.name || 'DGP Arjun Sharma'}</span>
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                          {officer?.id || 'DGP-0001'} • Room Admin
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-slate-800">
                          {officer?.rank ? officer.rank.replace(/\s*\([A-Z0-9-]+\)\s*/g, '').trim() : 'Investigation Officer'}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                          Designation Protected (Identity Masked)
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="btn-post-secret-room"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post {postType === 'finding' ? 'Finding' : postType === 'note' ? 'Note' : 'Message'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed Header & Filter Tabs */}
            <div className="flex items-center justify-between gap-2 px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Case Activity & Discussion ({filteredPosts.length})
              </h3>

              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({room.posts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('finding')}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeFilter === 'finding'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Findings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('note')}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeFilter === 'note'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('message')}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeFilter === 'message'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Messages
                </button>
              </div>
            </div>

            {/* Posts Feed List */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs space-y-1">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No posts in this category yet</p>
                  <p className="text-slate-400">Post a message or finding to collaborate with members.</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isAuthorArjun =
                    post.senderName.toLowerCase().includes('arjun sharma') ||
                    post.senderId === 'DGP-0001' ||
                    post.senderId === 'OFF-2047';
                  const isPostAuthorCreator =
                    post.senderId === creatorOfficerId || post.senderId === 'DGP-0001' || isAuthorArjun;

                  const isSelf =
                    (officer?.id && post.senderId && post.senderId.toLowerCase() === officer.id.toLowerCase()) ||
                    (officer?.name && post.senderName && post.senderName.toLowerCase() === officer.name.toLowerCase());

                  let authorDisplayName: string;
                  let authorId: string;
                  let authorRank: string | undefined;
                  let authorInitial: string;
                  let displayContent = post.content;

                  if (isOfficerCreator) {
                    // Creator / Admin: See all real member names and details
                    authorDisplayName = isAuthorArjun ? 'DGP Arjun Sharma' : post.senderName;
                    authorId = isAuthorArjun ? 'DGP-0001' : post.senderId;
                    authorRank = isAuthorArjun ? 'Director General of Police (DGP)' : post.senderRank;
                    authorInitial = authorDisplayName.charAt(0);
                  } else {
                    // Regular Member: Must NOT see the real names, emails, phone numbers, or personal profile details of other members
                    const getDesignation = (rank?: string): string => {
                      if (!rank) return 'Investigation Officer';
                      const clean = rank.replace(/\s*\([A-Z0-9-]+\)\s*/g, '').trim();
                      if (clean.toLowerCase().includes('sub-inspector')) return 'Sub-Inspector of Police';
                      if (clean.toLowerCase().includes('inspector')) return 'Investigation Officer';
                      if (clean.toLowerCase().includes('forensic')) return 'Senior Forensic Specialist';
                      if (clean.toLowerCase().includes('analyst') || clean.toLowerCase().includes('intelligence')) return 'Intelligence Analyst';
                      if (clean.toLowerCase().includes('specialist') || clean.toLowerCase().includes('taskforce')) return 'Special Operations Officer';
                      return clean || 'Investigation Officer';
                    };

                    const getMemberNumber = (senderId: string, senderName: string): number => {
                      const byId = memberIndexMap.get(senderId.toLowerCase());
                      if (byId !== undefined) return byId;
                      const byName = memberIndexMap.get(senderName.toLowerCase());
                      if (byName !== undefined) return byName;
                      return 1;
                    };

                    if (isSelf) {
                      authorDisplayName = `${getDesignation(officer?.rank || post.senderRank)} (You)`;
                      authorId = 'YOU';
                      authorRank = undefined;
                      authorInitial = 'Y';
                    } else if (isPostAuthorCreator) {
                      authorDisplayName = 'Secret Room Admin';
                      authorId = 'ADMIN';
                      authorRank = undefined;
                      authorInitial = 'A';
                    } else {
                      // Other member: strictly display member's designation / Member N
                      const memberNum = getMemberNumber(post.senderId, post.senderName);
                      authorDisplayName = getDesignation(post.senderRank);
                      authorId = `Member ${memberNum}`;
                      authorRank = undefined;
                      authorInitial = `M${memberNum}`;
                    }

                    // Mask system generated strings that might contain real names
                    if (post.type === 'note') {
                      if (displayContent.startsWith('Added ')) {
                        displayContent = 'A verified case specialist was added to the Secret Room by Admin.';
                      } else if (displayContent.startsWith('Removed ')) {
                        displayContent = 'A member clearance was revoked by Room Admin.';
                      }
                    }
                  }

                  const isFinding = post.type === 'finding';
                  const isNote = post.type === 'note';

                  return (
                    <div
                      key={post.id}
                      className={`p-4 rounded-2xl border transition-shadow bg-white ${
                        isFinding
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isNote
                          ? 'border-amber-200 bg-amber-50/20'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Post Meta */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                            {authorInitial}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">
                                {isOfficerCreator ? authorDisplayName : `Posted by: ${authorDisplayName}`}
                              </span>
                              {isOfficerCreator && (
                                <>
                                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                    {authorId}
                                  </span>
                                  {isPostAuthorCreator && (
                                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded uppercase">
                                      Creator
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            {isOfficerCreator && authorRank && (
                              <div className="text-[10px] text-slate-400">{authorRank}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Post Type Badge */}
                          {isFinding && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <span>🔍 Finding</span>
                            </span>
                          )}
                          {isNote && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <span>📝 Note</span>
                            </span>
                          )}
                          {!isFinding && !isNote && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              💬 Chat
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                            {post.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap pl-9">
                        {displayContent}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      {/* 4. SIMPLE REMOVE MEMBER CONFIRMATION MODAL */}
      {memberToRemove && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
              <UserMinus className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Room Member?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-900">{memberToRemove.name}</span> (
                <span className="font-mono font-semibold">{memberToRemove.userId}</span>) from{' '}
                <span className="font-semibold text-slate-900">{room.roomName}</span>?
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 text-red-800 text-xs">
              <p className="font-semibold">Access will be revoked immediately.</p>
              <p className="text-[11px] text-red-700 mt-0.5">
                This officer will no longer be able to open this Secret Room or view any notes, findings, or messages.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-remove-member"
                onClick={handleConfirmRemoveMember}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PASSCODE SETTINGS & INFO MODAL */}
      {showPasscodeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Room Passcode Settings</h3>
                  <p className="text-[11px] text-slate-500">Security credentials for {room.roomName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasscodeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Current Passcode Display */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Active Room Passcode</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
                <span className="font-mono text-sm font-bold text-slate-800 tracking-wider">
                  {effectivePassword}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPasscode}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedPasscode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPasscode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Default Passcode:</span>
                <span className="font-mono font-semibold text-slate-700">{DEFAULT_SECRET_ROOM_PASSWORD}</span>
              </div>
            </div>

            {passcodeSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passcodeSuccessMsg}</span>
              </div>
            )}

            {/* Change Passcode Form - ONLY visible to Room Creator */}
            {isOfficerCreator ? (
              <form onSubmit={handleSavePasscode} className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="input-edit-passcode" className="text-xs font-bold text-slate-700">
                      Update Room Passcode
                    </label>
                    {editPasscode !== DEFAULT_SECRET_ROOM_PASSWORD && (
                      <button
                        type="button"
                        onClick={() => setEditPasscode(DEFAULT_SECRET_ROOM_PASSWORD)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Reset to Default
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="input-edit-passcode"
                      type={showEditPasscode ? 'text' : 'password'}
                      required
                      value={editPasscode}
                      onChange={(e) => setEditPasscode(e.target.value)}
                      placeholder="Enter new passcode"
                      className="w-full pl-3 pr-10 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPasscode(!showEditPasscode)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showEditPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Updating this passcode will require anyone entering the room to supply the new code.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasscodeModal(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    id="btn-save-passcode"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="w-3 h-3" />
                    <span>Save New Passcode</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2 space-y-3">
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-950">Password Modification Restricted</div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Only the Secret Room Creator (<span className="font-semibold text-slate-900">{creatorDisplayName}</span>) has access to modify or change the room password. Members in the secret room do not have access to change the password.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPasscodeModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
