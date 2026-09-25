import { OfficerProfile, CaseRecord } from '../types';

/**
 * Role-Based Secret Room Demonstration Profiles:
 * 1. USER 1 — DGP / MAIN OFFICER: Arjun Sharma (SECRET_ROOM_ACCESS: true, CAN_MANAGE_SECRET_ROOM_ACCESS: true)
 * 2. USER 2 — INVESTIGATING OFFICER A: K. Reddy (SECRET_ROOM_ACCESS: false - NO ACCESS, completely hidden)
 * 3. USER 3 — INVESTIGATING OFFICER B: Special Investigating Team Officer (Rajesh Nair) (SECRET_ROOM_ACCESS: true)
 */

export const DEMO_DGP: OfficerProfile = {
  id: 'DGP-0001',
  name: 'DGP Arjun Sharma',
  rank: 'Director General of Police (DGP)',
  department: 'State Police Headquarters & Apex Command',
  state: 'Karnataka',
  city: 'Bengaluru',
  district: 'Bengaluru Urban',
  station: 'Apex Directorate Headquarters, Nrupathunga Rd',
  badge: 'IPS-KA-DGP-001',
  loginTime: '20 Sept 2026 • 07:30 AM',
  accessLevel: 'State Police Command',
  posting: 'Director General & Inspector General of Police (DG&IGP)',
  officialEmail: 'arjun.sharma@ksp.gov.in',
  officialPhone: '+91 (080) 2221-1111 / Apex Command Line',
  status: 'Active',
  twoFactorEnabled: true,
  role: 'DGP',
  permissions: {
    SECRET_ROOM_ACCESS: true,
    CAN_MANAGE_SECRET_ROOM_ACCESS: true,
  },
};

export const DEMO_OFFICER_A: OfficerProfile = {
  id: 'OFF-2047',
  name: 'K. Reddy',
  rank: 'Police Inspector (PI)',
  department: 'Crime Investigation Department',
  state: 'Karnataka',
  city: 'Bengaluru',
  district: 'Bengaluru Urban',
  station: 'Central Crime Branch',
  badge: 'KA-2047-CID',
  loginTime: '20 Sept 2026 • 09:15 AM',
  accessLevel: 'Investigating Officer',
  posting: 'Special Homicide & Syndicate Squad',
  officialEmail: 'k.reddy@ksp.cid.gov.in',
  officialPhone: '+91 (080) 2294-2047 / Ext. 402',
  status: 'Active',
  twoFactorEnabled: true,
  role: 'INVESTIGATING_OFFICER_A',
  permissions: {
    SECRET_ROOM_ACCESS: false,
    CAN_MANAGE_SECRET_ROOM_ACCESS: false,
  },
};

export const DEMO_OFFICER_B: OfficerProfile = {
  id: 'OFF-3319',
  name: 'Sub-Insp. Rajesh Nair',
  rank: 'Sub-Inspector of Police (PSI)',
  department: 'Special Investigation Team (SIT)',
  state: 'Karnataka',
  city: 'Bengaluru',
  district: 'Bengaluru Urban',
  station: 'Organized Crime Taskforce',
  badge: 'SIT-FLD-3319',
  loginTime: '20 Sept 2026 • 08:45 AM',
  accessLevel: 'Special Investigating Team Officer',
  posting: 'Special Investigation Team / Taskforce',
  officialEmail: 'rajesh.nair@ksp.sit.gov.in',
  officialPhone: '+91 (080) 2294-3319 / Ext. 118',
  status: 'Active',
  twoFactorEnabled: true,
  role: 'INVESTIGATING_OFFICER_B',
  permissions: {
    SECRET_ROOM_ACCESS: true,
    CAN_MANAGE_SECRET_ROOM_ACCESS: false,
  },
};

export interface OfficerAccessControlEntry {
  officerId: string;
  name: string;
  rank: string;
  roleLabel: string;
  department: string;
  badge: string;
  hasSecretRoomAccess: boolean;
  canManage: boolean;
  lastUpdated?: string;
  updatedBy?: string;
}

export const INITIAL_OFFICER_ACCESS_LIST: OfficerAccessControlEntry[] = [
  {
    officerId: 'DGP-0001',
    name: 'DGP Arjun Sharma',
    rank: 'Director General of Police (DGP)',
    roleLabel: 'DGP — Director General of Police',
    department: 'State Police Headquarters & Apex Command',
    badge: 'IPS-KA-DGP-001',
    hasSecretRoomAccess: true,
    canManage: true,
    lastUpdated: 'Apex Security Clearance',
    updatedBy: 'Command Authority',
  },
  {
    officerId: 'OFF-2047',
    name: 'K. Reddy',
    rank: 'Police Inspector (PI)',
    roleLabel: 'Investigating Officer A',
    department: 'Crime Investigation Department',
    badge: 'KA-2047-CID',
    hasSecretRoomAccess: false,
    canManage: false,
    lastUpdated: 'Restricted (Secret Room Denied)',
    updatedBy: 'Command Security Policy',
  },
  {
    officerId: 'OFF-3319',
    name: 'Sub-Inspector Rajesh Nair',
    rank: 'Sub-Inspector of Police (PSI)',
    roleLabel: 'Special Investigating Team Officer / Investigating Officer B',
    department: 'Special Investigation Team (SIT)',
    badge: 'SIT-FLD-3319',
    hasSecretRoomAccess: true,
    canManage: false,
    lastUpdated: 'Special Taskforce Clearance',
    updatedBy: 'DGP Arjun Sharma',
  },
];

const ACCESS_LIST_STORAGE_KEY = 'crimex_officer_access_list_v5';

export function getOfficerAccessList(): OfficerAccessControlEntry[] {
  if (typeof window === 'undefined') return INITIAL_OFFICER_ACCESS_LIST;
  const saved = localStorage.getItem(ACCESS_LIST_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enforce baseline requirements: Rajesh Nair and Arjun Sharma are ALWAYS true by default
        return parsed.map((item) => {
          if (item.officerId === 'DGP-0001') {
            return {
              ...item,
              name: 'DGP Arjun Sharma',
              rank: 'Director General of Police (DGP)',
              roleLabel: 'DGP — Director General of Police',
              hasSecretRoomAccess: true,
              canManage: true,
            };
          }
          if (item.officerId === 'OFF-3319') {
            return {
              ...item,
              name: 'Sub-Inspector Rajesh Nair',
              rank: 'Sub-Inspector of Police (PSI)',
              roleLabel: 'Special Investigating Team Officer / Investigating Officer B',
              hasSecretRoomAccess: true,
            };
          }
          if (item.officerId === 'OFF-2047') {
            return {
              ...item,
              name: 'K. Reddy',
              roleLabel: 'Investigating Officer A',
              canManage: false,
            };
          }
          return item;
        });
      }
    } catch {
      return INITIAL_OFFICER_ACCESS_LIST;
    }
  }
  return INITIAL_OFFICER_ACCESS_LIST;
}

export function updateOfficerAccessPermission(officerId: string, granted: boolean): void {
  const currentList = getOfficerAccessList();
  const updatedList = currentList.map((entry) => {
    if (entry.officerId === officerId) {
      return {
        ...entry,
        hasSecretRoomAccess: granted,
        lastUpdated: `Updated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        updatedBy: 'DGP Arjun Sharma',
      };
    }
    return entry;
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_LIST_STORAGE_KEY, JSON.stringify(updatedList));
  }
}

/**
 * Checks whether an officer has permission to view and access the Secret Room.
 */
export function checkOfficerSecretRoomAccess(
  officer: OfficerProfile | null,
  accessOverrides?: Record<string, boolean>
): boolean {
  if (!officer) return false;

  // 1. Direct role-based policy matching the exact User Permission Matrix:
  // - Arjun Sharma (DGP) -> TRUE (Full Access)
  // - Sub-Inspector Rajesh Nair (Special Investigating Team Officer) -> TRUE (Access)
  // - K. Reddy (Investigating Officer A) -> FALSE (No Access)

  // K. Reddy is strictly DENIED access
  if (
    officer.id === 'OFF-2047' ||
    officer.role === 'INVESTIGATING_OFFICER_A' ||
    officer.name.toLowerCase().includes('k. reddy') ||
    officer.name.toLowerCase() === 'k. reddy'
  ) {
    // Check if DGP explicitly granted an override in the management panel
    if (accessOverrides && accessOverrides[officer.id] !== undefined) {
      return accessOverrides[officer.id];
    }
    if (typeof window !== 'undefined') {
      const list = getOfficerAccessList();
      const entry = list.find((e) => e.officerId === officer.id);
      if (entry !== undefined) {
        return entry.hasSecretRoomAccess;
      }
    }
    return false;
  }

  // Arjun Sharma (DGP) is FULL ACCESS
  if (
    officer.id === 'DGP-0001' ||
    officer.role === 'DGP' ||
    officer.name.toLowerCase().includes('arjun sharma') ||
    officer.rank?.toLowerCase().includes('dgp') ||
    officer.rank?.toLowerCase().includes('director general')
  ) {
    return true;
  }

  // Sub-Inspector Rajesh Nair (SIT Officer / Officer B) is ACCESS
  if (
    officer.id === 'OFF-3319' ||
    officer.id === 'CX-3319' ||
    officer.role === 'INVESTIGATING_OFFICER_B' ||
    officer.name.toLowerCase().includes('rajesh nair')
  ) {
    // Check if DGP explicitly changed access in the management panel
    if (accessOverrides && accessOverrides[officer.id] !== undefined) {
      return accessOverrides[officer.id];
    }
    if (typeof window !== 'undefined') {
      const list = getOfficerAccessList();
      const entry = list.find((e) => e.officerId === officer.id);
      if (entry !== undefined) {
        return entry.hasSecretRoomAccess;
      }
    }
    return true;
  }

  // Check persistent overrides if available
  if (accessOverrides && accessOverrides[officer.id] !== undefined) {
    return accessOverrides[officer.id];
  }

  // Check stored access list overrides
  if (typeof window !== 'undefined') {
    const list = getOfficerAccessList();
    const entry = list.find((e) => e.officerId === officer.id);
    if (entry !== undefined) {
      return entry.hasSecretRoomAccess;
    }
  }

  // Check profile permissions
  if (officer.permissions?.SECRET_ROOM_ACCESS !== undefined) {
    return Boolean(officer.permissions.SECRET_ROOM_ACCESS);
  }

  return false;
}

/**
 * Checks whether an officer can manage Secret Room access for other officers.
 */
export function checkOfficerCanManageSecretRoom(officer: OfficerProfile | null): boolean {
  if (!officer) return false;
  return Boolean(
    officer.permissions?.CAN_MANAGE_SECRET_ROOM_ACCESS ||
    officer.role === 'DGP' ||
    officer.name.toLowerCase().includes('arjun sharma') ||
    officer.rank?.toLowerCase().includes('dgp') ||
    officer.rank?.toLowerCase().includes('director general')
  );
}

/**
 * Rigorous Case-Specific Secret Room Authorization:
 * BOTH conditions must be satisfied:
 * 1. The officer must have general Secret Room clearance (role / permission)
 * 2. The officer must be assigned/authorized for this SPECIFIC case.
 *
 * Example:
 * - Sub-Inspector Rajesh Nair has Secret Room clearance AND is assigned to CASE-0102.
 *   -> CASE-0102 Secret Room: ALLOWED.
 *   -> CASE-0078 Secret Room: DENIED (not assigned/authorized for CASE-0078).
 * - K. Reddy has NO Secret Room clearance.
 *   -> ANY case Secret Room: DENIED.
 * - DGP Arjun Sharma has Apex Command Clearance.
 *   -> All cases: ALLOWED.
 */
export function checkOfficerCaseSecretRoomAccess(
  officer: OfficerProfile | null,
  caseItem: CaseRecord | null,
  accessOverrides?: Record<string, boolean>
): { allowed: boolean; reason?: string } {
  if (!officer) {
    return { allowed: false, reason: 'Authentication required' };
  }

  // 1. Check general Secret Room clearance first
  const hasGeneralAccess = checkOfficerSecretRoomAccess(officer, accessOverrides);
  if (!hasGeneralAccess) {
    return {
      allowed: false,
      reason: 'Officer does not hold required Secret Room security clearance.',
    };
  }

  if (!caseItem) {
    return { allowed: false, reason: 'No case specified.' };
  }

  // DGP has Apex Command access across all state cases
  if (
    officer.id === 'DGP-0001' ||
    officer.role === 'DGP' ||
    officer.name.toLowerCase().includes('arjun sharma') ||
    officer.rank?.toLowerCase().includes('dgp') ||
    officer.rank?.toLowerCase().includes('director general')
  ) {
    return { allowed: true };
  }

  // 2. Check specific case authorization
  const officerId = officer.id.toLowerCase();
  const officerBadge = officer.badge ? officer.badge.toLowerCase() : '';
  const officerName = officer.name.toLowerCase();

  // Explicit authorized list for this case
  if (caseItem.authorizedSecretRoomOfficers && caseItem.authorizedSecretRoomOfficers.length > 0) {
    const isExplicitlyAuthorized = caseItem.authorizedSecretRoomOfficers.some((authId) => {
      const lower = authId.toLowerCase();
      return (
        lower === officerId ||
        lower === officerBadge ||
        (lower === 'cx-3319' && (officerId === 'off-3319' || officerName.includes('rajesh nair'))) ||
        (lower === 'off-3319' && (officerId === 'off-3319' || officerName.includes('rajesh nair')))
      );
    });

    if (isExplicitlyAuthorized) {
      return { allowed: true };
    }
  }

  // Check assigned officer ID
  if (caseItem.assignedOfficerId) {
    const assignedLower = caseItem.assignedOfficerId.toLowerCase();
    if (
      assignedLower === officerId ||
      assignedLower === officerBadge ||
      (assignedLower === 'off-3319' && (officerId === 'off-3319' || officerName.includes('rajesh nair'))) ||
      (assignedLower === 'cx-3319' && (officerId === 'off-3319' || officerName.includes('rajesh nair')))
    ) {
      return { allowed: true };
    }
  }

  // Check caseOfficer object
  if (caseItem.caseOfficer) {
    const coId = caseItem.caseOfficer.id?.toLowerCase();
    const coBadge = caseItem.caseOfficer.badge?.toLowerCase();
    if (
      (coId && (coId === officerId || (coId === 'off-3319' && officerName.includes('rajesh nair')))) ||
      (coBadge && (coBadge === officerBadge || coBadge === officerId))
    ) {
      return { allowed: true };
    }
  }

  // Check lead officer string
  if (caseItem.leadOfficer) {
    const leadLower = caseItem.leadOfficer.toLowerCase();
    if (
      leadLower.includes(officerName) ||
      leadLower.includes(officerId) ||
      (officerBadge && leadLower.includes(officerBadge))
    ) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: `Access to this case's Secret Room is restricted. Officer is not an assigned or authorized investigating officer for ${caseItem.id}.`,
  };
}
