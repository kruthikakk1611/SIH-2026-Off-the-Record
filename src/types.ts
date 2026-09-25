export type NavPage =
  | 'dashboard'
  | 'cases'
  | 'suspects'
  | 'network'
  | 'compare'
  | 'blindspots'
  | 'ai-assistant'
  | 'evidence'
  | 'reports'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'full-case'
  | 'search'
  | 'login'
  | 'secret-room';

export type CasePriority = 'Critical' | 'High' | 'Medium' | 'Completed';

export type OfficerRole = 'INVESTIGATING_OFFICER_A' | 'INVESTIGATING_OFFICER_B' | 'DGP';

export interface OfficerPermissions {
  SECRET_ROOM_ACCESS: boolean;
  CAN_MANAGE_SECRET_ROOM_ACCESS: boolean;
}

export interface OfficerProfile {
  id: string; // e.g. "OFF-2047"
  name: string; // e.g. "Arjun Sharma"
  rank: string; // e.g. "Inspector"
  department: string; // e.g. "Crime Investigation Department"
  state: string; // "Karnataka"
  city: string; // "Bengaluru"
  district: string; // "Bengaluru Urban"
  station: string; // "Central Crime Branch"
  badge: string; // "KA-2047-CCB"
  loginTime: string;
  accessLevel?: 'Investigating Officer' | 'Senior Officer' | 'State Police Command' | string;
  posting?: string;
  officialEmail?: string;
  officialPhone?: string;
  status?: string;
  twoFactorEnabled?: boolean;
  role?: OfficerRole | string;
  permissions?: OfficerPermissions;
}

export interface PoliceOfficerInvolved {
  policeId: string;
  name: string;
  rank: string;
  role: string;
  station: string;
  contact?: string;
  isLead?: boolean;
  isStarter?: boolean;
}

export interface CaseInitiator {
  policeId: string;
  name: string;
  rank: string;
  date: string;
  firNumber: string;
  station: string;
}

export interface SocialMediaAccount {
  platform: string;
  handle: string;
  url?: string;
  lastActive: string;
  profileStatus?: string;
}

export interface BankAccountDetail {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  accountType: string;
  balance?: string;
}

export interface BankTransactionRecord {
  id: string;
  date: string;
  amount: string;
  type: 'credit' | 'debit';
  counterparty: string;
  referenceId: string;
  flagged: boolean;
  flagReason?: string;
}

export interface SuspectLocation {
  address: string;
  city: string;
  area: string;
  coordinates: string;
  lastPingTime: string;
  status: 'Stationary' | 'In Transit' | 'Last Known Sight' | 'Active Ping' | 'Live GPS';
}

export interface SuspectMobileDevice {
  model: string;
  os: string;
  imei1: string;
  imei2: string;
  primaryCarrier: string;
  secondaryCarrier?: string;
}

export interface SuspectVehicleDetailed {
  plateNumber: string;
  makeModel: string;
  vehicleType: string;
  color: string;
  rtoRegisteredTo: string;
  chassisNumber: string;
  status: 'Active Sight' | 'Impounded' | 'Under Toll Watch';
}

export interface OsintInternetRecord {
  source: string;
  category: string;
  title: string;
  description: string;
  timestamp: string;
  verified: boolean;
}

export interface EvidenceTimelineItem {
  id: string;
  evidenceId: string;
  date: string;
  time: string;
  title: string;
  type: string;
  officerName: string;
  officerId: string;
  description: string;
  locationSeized: string;
  blockchainHash: string;
  status: 'Verified' | 'Chain of Custody Intact' | 'Forensic Analysis Complete';
}

export interface CaseRecord {
  id: string; // e.g. "CASE-0102"
  title: string; // e.g. "Organized Financial Crime"
  priority: CasePriority;
  department: string; // e.g. "Cyber Crime"
  crimeType: string; // e.g. "Financial / Organized Crime"
  startedDate: string; // e.g. "12 Aug 2026"
  progress: number; // 80%
  suspectsCount: number;
  evidenceCount: number;
  relatedCasesCount: number;
  accessCode: string; // "CX-2026-AUTH"
  isUnlocked?: boolean;
  assignedTeam: string;
  leadOfficer: string;
  assignedOfficerId?: string;
  leadOfficerId?: string;
  authorizedSecretRoomOfficers?: string[];
  caseOfficer?: {
    id: string;
    name: string;
    badge: string;
    rank: string;
  };
  summary: string;
  aiSummary: string;
  investigationSteps: {
    title: string;
    completed: boolean;
    date?: string;
  }[];
  suspectIds: string[];
  evidenceIds: string[];
  relatedCaseIds: string[];
  locations: string[];
  vehicles: string[];
  investigationGaps: string[];
  // Extended fields for police team & duration & court
  policeOfficers?: PoliceOfficerInvolved[];
  initiatedBy?: CaseInitiator;
  courtName?: string;
  courtSections?: string[];
  evidenceTimeline?: EvidenceTimelineItem[];
}

export interface SuspectProfile {
  id: string; // e.g. "SUS-01"
  codeName: string; // e.g. "Person A"
  alias?: string; // e.g. "Vikram R."
  legalName?: string;
  role?: string;
  riskLevel?: string;
  connections?: string[];
  age: number;
  status: 'Person of Interest' | 'Key Node' | 'Associate' | 'Under Surveillance' | 'Detained';
  avatarBg: string;
  relatedCases: string[];
  phoneRecords: string[];
  financialLinks: string[];
  vehicles: string[];
  knownLocations: string[];
  firRecords: {
    firNumber: string;
    station: string;
    section: string;
    year: string;
  }[];
  criminalHistory: {
    year: string;
    event: string;
    badge?: string;
  }[];
  associatedPeople: {
    name: string;
    relation: string;
  }[];
  bio: string;
  // Extended internet OSINT, bank, device, social, vehicles, and connection reason
  whyConnected?: string;
  phoneNumber?: string;
  socialMediaAccounts?: SocialMediaAccount[];
  bankDetails?: BankAccountDetail[];
  bankTransactions?: BankTransactionRecord[];
  currentLocationDetails?: SuspectLocation;
  mobileDeviceDetails?: SuspectMobileDevice;
  vehiclesDetailed?: SuspectVehicleDetailed[];
  osintInternetRecords?: OsintInternetRecord[];
}

export type NetworkNodeType =
  | 'person'
  | 'phone'
  | 'vehicle'
  | 'location'
  | 'bank'
  | 'case'
  | 'evidence';

export interface NetworkNode {
  id: string;
  label: string;
  sublabel: string;
  type: NetworkNodeType;
  iconName?: string;
  x: number;
  y: number;
  status?: string;
  details: {
    name?: string;
    identifier?: string;
    relatedCases?: string[];
    associatedPeople?: string[];
    knownVehicles?: string[];
    knownLocations?: string[];
    relevantRecords?: string[];
    financialInfo?: string;
    notes?: string;
  };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  connectionType: 'call' | 'ownership' | 'frequent' | 'financial' | 'case_link' | 'evidence_link';
  isKeyLink?: boolean;
}

export interface EvidenceRecord {
  id: string; // e.g. "EV-1027"
  title: string;
  type?: 'Digital' | 'Physical' | 'Financial' | 'Document' | string;
  evidenceType?: string;
  dateAdded: string;
  addedBy?: string;
  collectedBy?: string;
  status: 'Verified' | 'Pending Verification' | 'Pending' | 'Flagged';
  caseId: string;
  fileSize: string;
  blockchainHash: string;
  blockNumber: number;
  timestamp?: string;
  timestampUtc?: string;
  isTamperProof?: boolean;
  description: string;
  auditTrail?: {
    timestamp: string;
    action: string;
    officer: string;
    detail: string;
  }[];
}

export interface CaseComparisonResult {
  case1Id: string;
  case2Id: string;
  commonSuspectsCount: number;
  commonVehiclesCount: number;
  commonLocationsCount: number;
  commonEvidenceLinksCount: number;
  activitySimilarityScore: number;
  aiInsight: string;
  sharedSuspects: string[];
  sharedLocations: string[];
  sharedVehicles: string[];
  sharedEvidence: string[];
  disclaimer: string;
}

export interface BlindSpotData {
  id: string;
  corridorName: string;
  zone: string;
  lastKnownLocation: {
    name: string;
    time: string;
    type: string;
  };
  gapDuration: string;
  gapReason: string;
  nextKnownLocation: {
    name: string;
    time: string;
    type: string;
  };
  relatedCasesCount: number;
  relatedPersonsCount: number;
  previousGapsCount: number;
  riskAlert: string;
  surveillanceStatus: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description: string;
  officer: string;
  badgeType: 'fir' | 'suspect' | 'evidence' | 'vehicle' | 'case' | 'gap';
}

export interface CaseActivityNotification {
  id: string;
  caseId: string;
  timestamp: string;
  timeAgo: string;
  officer: string;
  title: string;
  message: string;
  type: 'update' | 'evidence' | 'suspect' | 'alert' | 'status';
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  date: string;
  officer: string;
  action: string;
  caseId: string;
  details: string;
  hashSignature: string;
}

export interface AICaseClue {
  id: string;
  category:
    | 'SUSPECT WEAK LINK'
    | 'FINANCIAL TRAIL'
    | 'ALIBI INCONSISTENCY'
    | 'VEHICLE TRACK'
    | 'CROSS-CASE PATTERN'
    | 'TIMELINE GAP'
    | 'MISSING EVIDENCE'
    | 'SURVEILLANCE BLIND SPOT';
  title: string;
  detail: string;
  confidence: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  suggestedAction: string;
}

export interface AIRelationshipInsight {
  sourcePerson: string;
  targetPerson: string;
  relationshipType: string;
  nature: 'Financial Dependency' | 'Command Hierarchy' | 'Logistical Mule' | 'Direct Conspiracy' | 'Alibi Cover';
  confidence: number;
  hiddenClue: string;
  actionableInterrogationTip: string;
}

export interface AICaseComparisonResult {
  matchingScore: number;
  sharedModusOperandi: string[];
  suspectOrAliasOverlap: string[];
  vehicleOrDeviceOverlap: string[];
  crossCaseClues: string[];
  breakthroughHypothesis: string;
}

export interface AICaseAssistantResponse {
  answer: string;
  clues?: AICaseClue[];
  relationships?: AIRelationshipInsight[];
  comparison?: AICaseComparisonResult;
  fastTrackActionSteps?: string[];
  recommendedInterrogationTarget?: {
    name: string;
    whyVulnerable: string;
    keyQuestions: string[];
  };
}

export interface SimulatedCrimeXUser {
  userId: string; // e.g. "CX-1042"
  name: string;
  rank: string;
  department: string;
  station: string;
  badge: string;
  avatarColor?: string;
}

export interface SecretRoomMember {
  userId: string;
  name: string;
  rank: string;
  department: string;
  badge?: string;
  isCreator?: boolean;
  addedAt: string;
}

export interface SecretRoomPost {
  id: string;
  senderId: string;
  senderName: string;
  senderRank?: string;
  content: string;
  timestamp: string;
  type: 'message' | 'finding' | 'note';
}

export interface SecretRoom {
  id: string;
  caseId: string;
  caseTitle: string;
  roomName: string;
  password?: string;
  createdAt: string;
  createdByOfficerId: string;
  createdByOfficerName: string;
  members: SecretRoomMember[];
  posts: SecretRoomPost[];
}


