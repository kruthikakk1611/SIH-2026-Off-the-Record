import React, { useState, useEffect } from 'react';
import {
  NavPage,
  OfficerProfile,
  CaseRecord,
  SuspectProfile,
  EvidenceRecord,
  TimelineEvent,
  CaseActivityNotification,
  SecretRoom,
} from './types';
import {
  DEMO_OFFICER,
  INITIAL_CASES,
  DEMO_SUSPECTS,
  INITIAL_EVIDENCE,
  DEMO_TIMELINE as INITIAL_TIMELINE,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { INITIAL_SECRET_ROOMS } from './data/simulatedUsers';
import {
  checkOfficerSecretRoomAccess,
  checkOfficerCanManageSecretRoom,
  checkOfficerCaseSecretRoomAccess,
  getOfficerAccessList,
  updateOfficerAccessPermission,
  OfficerAccessControlEntry,
} from './data/roleAccessData';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CasesView } from './components/CasesView';
import { FullCaseView } from './components/FullCaseView';
import { SuspectsView } from './components/SuspectsView';
import { ConnectionMapView } from './components/ConnectionMapView';
import { CompareCasesView } from './components/CompareCasesView';
import { BlindSpotsView } from './components/BlindSpotsView';
import { AIAssistantView } from './components/AIAssistantView';
import { EvidenceView } from './components/EvidenceView';
import { ReportsView } from './components/ReportsView';
import { SearchResultsView } from './components/SearchResultsView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { SecretRoomView } from './components/SecretRoomView';
import { CreateCaseModal } from './components/CreateCaseModal';
import { EditCaseModal } from './components/EditCaseModal';
import { CreateSecretRoomModal } from './components/CreateSecretRoomModal';
import { DemoPresentationModal } from './components/DemoPresentationModal';
import { CaseAccessModal } from './components/CaseAccessModal';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Lock } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  // Authentication state (begins at login page when application is run)
  const [officer, setOfficer] = useState<OfficerProfile | null>(null);

  // Current Active Navigation Page
  const [currentPage, setCurrentPage] = useState<NavPage>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Collapsible Sidebar State (persisted in localStorage)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('crimex_sidebar_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      localStorage.setItem('crimex_sidebar_expanded', String(next));
      return next;
    });
  };

  // Cases State
  const [cases, setCases] = useState<CaseRecord[]>(() => {
    const saved = localStorage.getItem('crimex_cases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CASES;
      }
    }
    return INITIAL_CASES;
  });

  // Suspects State
  const [suspects, setSuspects] = useState<SuspectProfile[]>(DEMO_SUSPECTS);
  const [selectedSuspectForHistory, setSelectedSuspectForHistory] = useState<SuspectProfile | null>(null);

  // Evidence State
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(() => {
    const saved = localStorage.getItem('crimex_evidence');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EVIDENCE;
      }
    }
    return INITIAL_EVIDENCE;
  });

  // Notifications State (Section 15)
  const [notifications, setNotifications] = useState<CaseActivityNotification[]>(() => {
    const saved = localStorage.getItem('crimex_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Selected Case for Full Case Dossier (defaults to CASE-0102)
  const [selectedCase, setSelectedCase] = useState<CaseRecord>(INITIAL_CASES[0]);

  // Selected Evidence for Verification
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord>(INITIAL_EVIDENCE[0]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Compare Cases State
  const [compareCase1, setCompareCase1] = useState('CASE-0102');
  const [compareCase2, setCompareCase2] = useState('CASE-0078');

  // Secret Rooms State
  const [secretRooms, setSecretRooms] = useState<SecretRoom[]>(() => {
    const sanitizeRooms = (roomsList: SecretRoom[]): SecretRoom[] => {
      return roomsList.map((r) => {
        const isArjunCreator =
          r.createdByOfficerName?.toLowerCase().includes('arjun sharma') ||
          r.createdByOfficerId === 'DGP-0001' ||
          r.createdByOfficerId === 'OFF-2047';

        return {
          ...r,
          createdByOfficerId: isArjunCreator ? 'DGP-0001' : r.createdByOfficerId,
          createdByOfficerName: isArjunCreator ? 'DGP Arjun Sharma' : r.createdByOfficerName,
          members: r.members.map((m) => {
            if (m.name.toLowerCase().includes('arjun sharma') || m.userId === 'DGP-0001') {
              return {
                ...m,
                userId: 'DGP-0001',
                name: 'DGP Arjun Sharma',
                rank: 'Director General of Police (DGP)',
                department: 'State Police Headquarters & Apex Command',
                badge: 'IPS-KA-DGP-001',
                isCreator: true,
              };
            }
            return m;
          }),
          posts: r.posts.map((p) => {
            if (p.senderName.toLowerCase().includes('arjun sharma') || p.senderId === 'DGP-0001') {
              return {
                ...p,
                senderId: 'DGP-0001',
                senderName: 'DGP Arjun Sharma',
                senderRank: 'Director General of Police (DGP)',
              };
            }
            return p;
          }),
        };
      });
    };

    const saved = localStorage.getItem('crimex_secret_rooms_v5') || localStorage.getItem('crimex_secret_rooms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeRooms(parsed);
          localStorage.setItem('crimex_secret_rooms_v5', JSON.stringify(sanitized));
          return sanitized;
        }
      } catch (e) {
        return sanitizeRooms(INITIAL_SECRET_ROOMS);
      }
    }
    return sanitizeRooms(INITIAL_SECRET_ROOMS);
  });

  // Active Secret Room ID & fresh session token (forces locked state on every entry)
  const [activeSecretRoomId, setActiveSecretRoomId] = useState<string>(() => {
    return INITIAL_SECRET_ROOMS[0]?.id || '';
  });
  const [secretRoomSessionId, setSecretRoomSessionId] = useState<number>(() => Date.now());

  // Modals
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [isEditCaseModalOpen, setIsEditCaseModalOpen] = useState(false);
  const [isCreateSecretRoomModalOpen, setIsCreateSecretRoomModalOpen] = useState(false);
  const [caseForSecretRoom, setCaseForSecretRoom] = useState<CaseRecord | null>(null);
  const [isDemoFlowModalOpen, setIsDemoFlowModalOpen] = useState(false);
  const [caseToUnlock, setCaseToUnlock] = useState<CaseRecord | null>(null);
  const [currentDemoStep, setCurrentDemoStep] = useState(1);

  // Role-Based Secret Room Access Control State
  const [officerAccessList, setOfficerAccessList] = useState<OfficerAccessControlEntry[]>(() => {
    return getOfficerAccessList();
  });

  const hasSecretRoomAccess = checkOfficerSecretRoomAccess(officer);
  const canManageSecretRoom = checkOfficerCanManageSecretRoom(officer);
  const selectedCaseSecretRoomAuth = checkOfficerCaseSecretRoomAccess(officer, selectedCase);
  const hasSelectedCaseSecretRoomAccess = selectedCaseSecretRoomAuth.allowed;

  const handleToggleOfficerAccess = (officerId: string, granted: boolean) => {
    updateOfficerAccessPermission(officerId, granted);
    setOfficerAccessList(getOfficerAccessList());

    if (officer && officer.id === officerId) {
      setOfficer((prev) =>
        prev
          ? {
              ...prev,
              permissions: {
                SECRET_ROOM_ACCESS: granted,
                CAN_MANAGE_SECRET_ROOM_ACCESS: prev.permissions?.CAN_MANAGE_SECRET_ROOM_ACCESS ?? false,
              },
            }
          : prev
      );
    }

    const targetEntry = getOfficerAccessList().find((e) => e.officerId === officerId);
    const actorName = officer?.name || 'DGP Arjun Sharma';
    const newNotif: CaseActivityNotification = {
      id: `notif-${Date.now()}`,
      caseId: 'CASE-0102',
      title: granted ? 'SECRET ROOM ACCESS GRANTED' : 'SECRET ROOM ACCESS REVOKED',
      message: `${actorName} ${granted ? 'authorized' : 'revoked'} Secret Room clearance for ${targetEntry?.name || officerId}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      officer: actorName,
      type: 'status',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Route Guard: If an officer without case-specific Secret Room clearance attempts to access secret-room, redirect to full-case
  useEffect(() => {
    if (currentPage === 'secret-room') {
      const activeRoom = secretRooms.find((r) => r.caseId === selectedCase.id) || null;
      const auth = checkOfficerCaseSecretRoomAccess(officer, selectedCase, undefined, activeRoom);
      if (!auth.allowed) {
        setCurrentPage('full-case');
      }
    }
  }, [currentPage, officer, selectedCase, secretRooms]);

  // Sync to localStorage
  useEffect(() => {
    if (officer) {
      localStorage.setItem('crimex_officer', JSON.stringify(officer));
    } else {
      localStorage.removeItem('crimex_officer');
    }
  }, [officer]);

  useEffect(() => {
    localStorage.setItem('crimex_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('crimex_evidence', JSON.stringify(evidenceList));
  }, [evidenceList]);

  useEffect(() => {
    localStorage.setItem('crimex_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('crimex_secret_rooms_v5', JSON.stringify(secretRooms));
    localStorage.setItem('crimex_secret_rooms', JSON.stringify(secretRooms));
  }, [secretRooms]);

  // Auth Handlers
  const handleLogin = (profile: OfficerProfile) => {
    setOfficer(profile);
    setCurrentPage('dashboard');
    setCurrentDemoStep(2);
  };

  const handleLogout = () => {
    setOfficer(null);
    setCurrentPage('login');
    setCurrentDemoStep(1);
  };

  // Search Submit
  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      setCurrentPage('search');
    }
  };

  // Request access to case: as soon as pressed, opens brief & handled-by pop-up
  const handleRequestCaseAccess = (c: CaseRecord) => {
    setCaseToUnlock(c);
  };

  // Unlock case with verified unique code
  const handleUnlockCase = (unlockedCase: CaseRecord) => {
    const updated = { ...unlockedCase, isUnlocked: true };
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCase(updated);
    setCaseToUnlock(null);
    setCurrentPage('full-case');

    // Broadcast notification (Section 15)
    const newNotif: CaseActivityNotification = {
      id: `notif-${Date.now()}`,
      caseId: updated.id,
      title: `${updated.id} DOSSIER UNLOCKED`,
      message: `${officer?.name || 'Authorized Officer'} authenticated unique code for ${updated.id}. Full criminal dossier unlocked.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      officer: officer?.name || 'Authorized Officer',
      type: 'status',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Backward-compatible alias
  const handleOpenFullCase = (c: CaseRecord) => {
    handleRequestCaseAccess(c);
  };

  // Create Case Handler
  const handleCreateNewCase = (newCase: CaseRecord) => {
    setCases((prev) => [newCase, ...prev]);

    // Broadcast notification (Section 15)
    const newNotif: CaseActivityNotification = {
      id: `notif-${Date.now()}`,
      caseId: newCase.id,
      title: `${newCase.id} INITIATED`,
      message: `${officer?.name || 'Lead Officer'} registered new dossier: "${newCase.title}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      officer: officer?.name || 'Lead Officer',
      type: 'status',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setSelectedCase(newCase);
    setCurrentPage('full-case');
  };

  // Edit Case Handler (Section 15)
  const handleSaveCaseEdit = (updatedCase: CaseRecord, notificationMessage: string) => {
    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    setSelectedCase(updatedCase);

    const newNotif: CaseActivityNotification = {
      id: `notif-${Date.now()}`,
      caseId: updatedCase.id,
      title: `${updatedCase.id} UPDATED`,
      message: notificationMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      officer: officer?.name || 'Investigating Officer',
      type: 'update',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Evidence Handler
  const handleAddNewEvidence = (newRecord: EvidenceRecord) => {
    setEvidenceList((prev) => [newRecord, ...prev]);

    // Update case evidence count
    setCases((prev) =>
      prev.map((c) =>
        c.id === newRecord.caseId ? { ...c, evidenceCount: c.evidenceCount + 1 } : c
      )
    );

    // Broadcast notification
    const newNotif: CaseActivityNotification = {
      id: `notif-${Date.now()}`,
      caseId: newRecord.caseId,
      title: `${newRecord.caseId} EVIDENCE LOGGED`,
      message: `Officer-204 added Evidence ${newRecord.id} (${newRecord.title}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      officer: 'Officer-204',
      type: 'evidence',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Secret Room Handlers: Strictly enforce case-specific clearance and assignment
  const handleOpenSecretRoom = (caseItem: CaseRecord) => {
    const authCheck = checkOfficerCaseSecretRoomAccess(officer, caseItem);
    if (!authCheck.allowed) {
      const newNotif: CaseActivityNotification = {
        id: `notif-${Date.now()}`,
        caseId: caseItem.id,
        title: 'SECRET ROOM ACCESS DENIED',
        message: authCheck.reason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        officer: officer?.name || 'System Guard',
        type: 'status',
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return;
    }

    const existing = secretRooms.find((r) => r.caseId === caseItem.id);
    if (existing) {
      setActiveSecretRoomId(existing.id);
      setSelectedCase(caseItem);
      setSecretRoomSessionId(Date.now());
      setCurrentPage('secret-room');
    } else {
      setCaseForSecretRoom(caseItem);
      setIsCreateSecretRoomModalOpen(true);
    }
  };

  const handleCreateSecretRoomClick = (caseItem: CaseRecord) => {
    const authCheck = checkOfficerCaseSecretRoomAccess(officer, caseItem);
    if (!authCheck.allowed) return;
    setCaseForSecretRoom(caseItem);
    setIsCreateSecretRoomModalOpen(true);
  };

  const handleSaveNewSecretRoom = (newRoom: SecretRoom) => {
    setSecretRooms((prev) => [newRoom, ...prev]);
    setActiveSecretRoomId(newRoom.id);
    const matchingCase = cases.find((c) => c.id === newRoom.caseId);
    if (matchingCase) {
      setSelectedCase(matchingCase);
    }
    setCurrentPage('secret-room');

    const newNotif: CaseActivityNotification = {
      id: `notif-${Date.now()}`,
      caseId: newRoom.caseId,
      title: 'SECRET ROOM CREATED',
      message: `Officer ${newRoom.createdByOfficerName} created Secret Room "${newRoom.roomName}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      officer: newRoom.createdByOfficerName,
      type: 'update',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateSecretRoom = (updatedRoom: SecretRoom) => {
    setSecretRooms((prev) =>
      prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
    );
  };

  const secretRoomCaseIds = React.useMemo(() => {
    return new Set(
      secretRooms
        .filter((r) => {
          const matchingCase = cases.find((c) => c.id === r.caseId);
          return checkOfficerCaseSecretRoomAccess(officer, matchingCase).allowed;
        })
        .map((r) => r.caseId)
    );
  }, [secretRooms, officer, cases]);

  const currentCaseSecretRoom = React.useMemo(() => {
    return secretRooms.find((r) => r.caseId === selectedCase.id) || null;
  }, [secretRooms, selectedCase.id]);

  // 19-Step Presentation Flow Dispatcher (Section 22 Exact Story)
  const handleExecuteDemoStep = (stepNumber: number) => {
    setCurrentDemoStep(stepNumber);

    switch (stepNumber) {
      case 1: // Login
        setOfficer(null);
        setCurrentPage('login');
        setIsDemoFlowModalOpen(false);
        break;

      case 2: // Dashboard
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('dashboard');
        break;

      case 3: // Open CASE-0102 in cases
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('cases');
        break;

      case 4: // Enter case code & unlock full case
        if (!officer) setOfficer(DEMO_OFFICER);
        const unlockedCase = { ...INITIAL_CASES[0], isUnlocked: true };
        setSelectedCase(unlockedCase);
        setCurrentPage('full-case');
        break;

      case 5: // View suspects in CASE-0102
        if (!officer) setOfficer(DEMO_OFFICER);
        setSelectedCase(INITIAL_CASES[0]);
        setCurrentPage('full-case');
        break;

      case 6: // Click Person A
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('suspects');
        break;

      case 7: // View Person A history
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('suspects');
        setSelectedSuspectForHistory(DEMO_SUSPECTS[0]);
        break;

      case 8: // Open Connection Map
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('network');
        break;

      case 9: // Show Person A connections
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('network');
        break;

      case 10: // Open Compare Cases
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('compare');
        break;

      case 11: // Compare CASE-0102 with CASE-0078
        if (!officer) setOfficer(DEMO_OFFICER);
        setCompareCase1('CASE-0102');
        setCompareCase2('CASE-0078');
        setCurrentPage('compare');
        break;

      case 12: // Show AI-detected similarities
        if (!officer) setOfficer(DEMO_OFFICER);
        setCompareCase1('CASE-0102');
        setCompareCase2('CASE-0078');
        setCurrentPage('compare');
        break;

      case 13: // Open Blind Spots
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('blindspots');
        break;

      case 14: // Show location-data gap (Location A to B)
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('blindspots');
        break;

      case 15: // Open AI Analysis
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('ai-assistant');
        break;

      case 16: // Show investigation gaps
        if (!officer) setOfficer(DEMO_OFFICER);
        setCurrentPage('ai-assistant');
        break;

      case 17: // Open Evidence
        if (!officer) setOfficer(DEMO_OFFICER);
        setSelectedEvidence(INITIAL_EVIDENCE[0]); // EV-1027
        setCurrentPage('evidence');
        break;

      case 18: // Show blockchain verification
        if (!officer) setOfficer(DEMO_OFFICER);
        setSelectedEvidence(INITIAL_EVIDENCE[0]);
        setCurrentPage('evidence');
        break;

      case 19: // Generate Report
        if (!officer) setOfficer(DEMO_OFFICER);
        setSelectedCase(INITIAL_CASES[0]);
        setCurrentPage('reports');
        break;

      default:
        setCurrentPage('dashboard');
    }
  };

  // If unauthenticated, show government login screen
  if (!officer || currentPage === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onQuickDemoBypass={() => handleLogin(DEMO_OFFICER)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar Navigation (Left side on desktop) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        officer={officer}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        hasSecretRoomAccess={hasSecretRoomAccess}
        isExpanded={isSidebarExpanded}
        onToggleExpand={handleToggleSidebar}
      />

      {/* Main Container (offset by dynamic sidebar width on lg) */}
      <div className={`transition-all duration-200 ${isSidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'} flex-1 flex flex-col min-w-0`}>
        {/* Header Bar */}
        <Header
          officer={officer}
          selectedCase={selectedCase}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          notifications={notifications}
          onNavigate={setCurrentPage}
          onOpenDemoFlowModal={() => setIsDemoFlowModalOpen(true)}
          currentDemoStep={currentDemoStep}
        />

        {/* Content View Routing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            currentPage={currentPage}
            selectedCase={selectedCase}
            onNavigate={setCurrentPage}
          />

          {currentPage === 'dashboard' && (
            <DashboardView
              cases={cases}
              officer={officer}
              onNavigate={setCurrentPage}
              onSelectCase={handleRequestCaseAccess}
              onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)}
              onSearch={handleSearchSubmit}
              hasSecretRoomAccess={hasSecretRoomAccess}
            />
          )}

          {currentPage === 'cases' && (
            <CasesView
              cases={cases}
              onSelectCase={handleRequestCaseAccess}
              onOpenFullCase={handleUnlockCase}
              onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)}
              onNavigate={setCurrentPage}
              secretRoomCaseIds={secretRoomCaseIds}
              hasSecretRoomAccess={hasSecretRoomAccess}
            />
          )}

          {currentPage === 'full-case' && (
            <FullCaseView
              caseItem={selectedCase}
              allCases={cases}
              cases={cases}
              allSuspects={suspects}
              suspects={suspects}
              allEvidence={evidenceList}
              evidenceList={evidenceList}
              officer={officer}
              timeline={INITIAL_TIMELINE}
              onBackToCases={() => setCurrentPage('cases')}
              onOpenSuspect={(sus) => {
                setSelectedSuspectForHistory(sus);
                setCurrentPage('suspects');
              }}
              onOpenEvidence={(ev) => {
                setSelectedEvidence(ev);
                setCurrentPage('evidence');
              }}
              onNavigateToNetwork={() => setCurrentPage('network')}
              onNavigateToCompare={(c1, c2) => {
                setCompareCase1(c1);
                setCompareCase2(c2);
                setCurrentPage('compare');
              }}
              onNavigateToReports={(c) => {
                setSelectedCase(c);
                setCurrentPage('reports');
              }}
              onEditCase={() => setIsEditCaseModalOpen(true)}
              onUnlockCase={handleUnlockCase}
              secretRoom={currentCaseSecretRoom}
              onCreateSecretRoom={() => handleCreateSecretRoomClick(selectedCase)}
              onOpenSecretRoom={() => handleOpenSecretRoom(selectedCase)}
              hasSecretRoomAccess={hasSelectedCaseSecretRoomAccess}
            />
          )}

          {currentPage === 'suspects' && (
            <SuspectsView
              suspects={suspects}
              onOpenNetworkWithPerson={(sus) => {
                setCurrentPage('network');
              }}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'network' && (
            <ConnectionMapView
              onNavigate={setCurrentPage}
              onOpenSuspectHistory={(sus) => {
                setSelectedSuspectForHistory(sus);
                setCurrentPage('suspects');
              }}
            />
          )}

          {currentPage === 'compare' && (
            <CompareCasesView
              cases={cases}
              initialCaseId1={compareCase1}
              initialCaseId2={compareCase2}
              onNavigate={setCurrentPage}
              onSelectCase={handleOpenFullCase}
            />
          )}

          {currentPage === 'blindspots' && (
            <BlindSpotsView onNavigate={setCurrentPage} />
          )}

          {currentPage === 'ai-assistant' && (
            <AIAssistantView
              onNavigate={setCurrentPage}
              cases={cases}
              selectedCase={selectedCase}
              suspects={suspects}
              evidenceList={evidenceList}
              officer={officer}
              onSelectCase={handleRequestCaseAccess}
            />
          )}

          {currentPage === 'evidence' && (
            <EvidenceView
              evidenceList={evidenceList}
              onAddNewEvidence={handleAddNewEvidence}
              onNavigate={setCurrentPage}
              selectedEvidenceItem={selectedEvidence}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsView
              cases={cases}
              currentCase={selectedCase}
              suspects={suspects}
              evidenceList={evidenceList}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'profile' && officer && (
            <ProfileView
              officer={officer}
              onLogout={handleLogout}
              onNavigate={setCurrentPage}
              onUpdateOfficer={(updated) => setOfficer(updated)}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView />
          )}

          {currentPage === 'secret-room' && (() => {
            const activeRoom =
              secretRooms.find((r) => r.caseId === selectedCase.id) || null;

            // Strictly enforce dual authorization: role clearance AND active case assignment / room membership
            const caseAuth = checkOfficerCaseSecretRoomAccess(officer, selectedCase, undefined, activeRoom);
            if (!caseAuth.allowed) {
              return (
                <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{t('Case Secret Room Restricted')}</h2>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {t(caseAuth.reason)}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2 font-mono">
                      {t('Case')}: {selectedCase.id} • {t('Officer')}: {officer?.name || t('Authorized Personnel')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('full-case')}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    {t('Return to Case Details')}
                  </button>
                </div>
              );
            }

            if (!activeRoom) {
              return (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{t('No Secret Room Created Yet')}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {t('Create an exclusive collaboration room for')} {selectedCase.id} ({t(selectedCase.title)})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCreateSecretRoomClick(selectedCase)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    {t('Create Secret Room for')} {selectedCase.id}
                  </button>
                </div>
              );
            }

            const associatedCase = selectedCase;

            return (
              <SecretRoomView
                key={`secret-room-${associatedCase.id}-${activeRoom.id}-${secretRoomSessionId}`}
                room={activeRoom}
                caseItem={associatedCase}
                officer={officer || DEMO_OFFICER}
                onBackToCase={() => {
                  setSecretRoomSessionId(Date.now());
                  setSelectedCase(associatedCase);
                  setCurrentPage('full-case');
                }}
                onUpdateRoom={handleUpdateSecretRoom}
                canManageAccess={canManageSecretRoom}
                officerAccessList={officerAccessList}
                onToggleOfficerAccess={handleToggleOfficerAccess}
              />
            );
          })()}

          {currentPage === 'search' && (
            <SearchResultsView
              query={searchQuery}
              cases={cases}
              suspects={suspects}
              evidenceList={evidenceList}
              onSelectCase={handleRequestCaseAccess}
              onSelectSuspect={(s) => {
                setSelectedSuspectForHistory(s);
                setCurrentPage('suspects');
              }}
              onSelectEvidence={(ev) => {
                setSelectedEvidence(ev);
                setCurrentPage('evidence');
              }}
              onNavigate={setCurrentPage}
              onSearchChange={handleSearchSubmit}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Create Case Modal (Section 16) */}
      <CreateCaseModal
        isOpen={isCreateCaseModalOpen}
        onClose={() => setIsCreateCaseModalOpen(false)}
        onCreateCase={handleCreateNewCase}
      />

      {/* 2. Edit Case Modal (Section 15) */}
      <EditCaseModal
        isOpen={isEditCaseModalOpen}
        caseItem={selectedCase}
        onClose={() => setIsEditCaseModalOpen(false)}
        onSaveEdit={handleSaveCaseEdit}
        availableSuspects={suspects}
      />

      {/* 3. Interactive Demo Presentation Flow Modal (Section 22) */}
      <DemoPresentationModal
        isOpen={isDemoFlowModalOpen}
        onClose={() => setIsDemoFlowModalOpen(false)}
        currentStep={currentDemoStep}
        onExecuteStep={handleExecuteDemoStep}
      />

      {/* 4. Case Unique Code Access Verification Modal */}
      {caseToUnlock && (
        <CaseAccessModal
          caseItem={caseToUnlock}
          onClose={() => setCaseToUnlock(null)}
          onUnlock={handleUnlockCase}
        />
      )}

      {/* 5. Create Case Secret Room Modal */}
      {caseForSecretRoom && (
        <CreateSecretRoomModal
          isOpen={isCreateSecretRoomModalOpen}
          onClose={() => {
            setIsCreateSecretRoomModalOpen(false);
            setCaseForSecretRoom(null);
          }}
          caseItem={caseForSecretRoom}
          officer={officer || DEMO_OFFICER}
          onCreateRoom={handleSaveNewSecretRoom}
        />
      )}
    </div>
  );
}
