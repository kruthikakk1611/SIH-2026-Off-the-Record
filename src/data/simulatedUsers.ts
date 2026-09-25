import { SimulatedCrimeXUser, SecretRoom } from '../types';

/**
 * Fictional sample CrimeX users for demonstration in the prototype.
 * These allow searching by unique CrimeX User ID (e.g. CX-1042) to add members.
 */
export const SIMULATED_CRIMEX_USERS: SimulatedCrimeXUser[] = [
  {
    userId: 'DGP-0001',
    name: 'DGP Arjun Sharma',
    rank: 'Director General of Police (DGP)',
    department: 'State Police Headquarters & Apex Command',
    station: 'Apex Directorate Headquarters, Nrupathunga Rd',
    badge: 'IPS-KA-DGP-001',
    avatarColor: 'bg-purple-700',
  },
  {
    userId: 'OFF-3319',
    name: 'Sub-Inspector Rajesh Nair',
    rank: 'Sub-Inspector of Police (PSI)',
    department: 'Special Investigation Team (SIT)',
    station: 'Organized Crime Taskforce',
    badge: 'SIT-FLD-3319',
    avatarColor: 'bg-indigo-600',
  },
  {
    userId: 'OFF-2047',
    name: 'K. Reddy',
    rank: 'Police Inspector (PI)',
    department: 'Crime Investigation Department',
    station: 'Central Crime Branch',
    badge: 'KA-2047-CID',
    avatarColor: 'bg-slate-700',
  },
  {
    userId: 'CX-1042',
    name: 'Insp. Neha Verma',
    rank: 'Police Inspector',
    department: 'Cyber Forensics & Digital Wiretaps',
    station: 'Central Cyber Crime Division, Bengaluru',
    badge: 'KA-CYBER-1042',
    avatarColor: 'bg-indigo-600',
  },
  {
    userId: 'CX-2081',
    name: 'Dr. Vikram Rao',
    rank: 'Senior Forensic Specialist',
    department: 'State Forensics Science Laboratory',
    station: 'Forensic Ballistics & Chemical Wing',
    badge: 'FSL-DOC-2081',
    avatarColor: 'bg-emerald-600',
  },
  {
    userId: 'CX-3319',
    name: 'Sub-Inspector Rajesh Nair',
    rank: 'Sub-Inspector of Police',
    department: 'Special Investigation Team (SIT)',
    station: 'Organized Crime Taskforce',
    badge: 'SIT-FLD-3319',
    avatarColor: 'bg-amber-600',
  },
  {
    userId: 'CX-4502',
    name: 'DCP Sanjay Kulkarni',
    rank: 'Deputy Commissioner of Police',
    department: 'Inter-Agency Coordination Command',
    station: 'State Police Command HQ',
    badge: 'KA-DCP-4502',
    avatarColor: 'bg-blue-700',
  },
  {
    userId: 'CX-5120',
    name: 'Priya Menon',
    rank: 'Intelligence Analyst',
    department: 'Financial Crimes & Hawala Tracking',
    station: 'Economic Offences Wing (EOW)',
    badge: 'EOW-FIN-5120',
    avatarColor: 'bg-purple-600',
  },
  {
    userId: 'CX-6744',
    name: 'Anand Joshi',
    rank: 'Senior Technical Officer',
    department: 'Tactical Surveillance & Cell Intercepts',
    station: 'Technical Intelligence Bureau',
    badge: 'TIB-SIG-6744',
    avatarColor: 'bg-cyan-700',
  },
  {
    userId: 'CX-7890',
    name: 'Sub-Insp. Kavita Deshmukh',
    rank: 'Undercover Operations Specialist',
    department: 'Anti-Narcotics & Border Smuggling',
    station: 'Special Operations Task Force',
    badge: 'SOTF-OP-7890',
    avatarColor: 'bg-rose-600',
  },
];

export const DEFAULT_SECRET_ROOM_PASSWORD = 'crimex@2025';

/**
 * Initial sample Secret Room for CASE-0102 to showcase immediate collaboration.
 * Authorized members:
 * 1. DGP Arjun Sharma (DGP-0001) - Room Creator & Apex Command
 * 2. Sub-Inspector Rajesh Nair (OFF-3319) - Special Investigating Team Officer
 * 3. Insp. Neha Verma (CX-1042) - Cyber Forensics & Digital Wiretaps
 */
export const INITIAL_SECRET_ROOMS: SecretRoom[] = [
  {
    id: 'ROOM-0102',
    caseId: 'CASE-0102',
    caseTitle: 'Hawala Money Laundering Syndicate',
    roomName: 'Operation Nightfall - Taskroom Alpha',
    password: DEFAULT_SECRET_ROOM_PASSWORD,
    createdAt: '2026-09-15T09:30:00Z',
    createdByOfficerId: 'DGP-0001',
    createdByOfficerName: 'DGP Arjun Sharma',
    members: [
      {
        userId: 'DGP-0001',
        name: 'DGP Arjun Sharma',
        rank: 'Director General of Police (DGP)',
        department: 'State Police Headquarters & Apex Command',
        badge: 'IPS-KA-DGP-001',
        isCreator: true,
        addedAt: '2026-09-15T09:30:00Z',
      },
      {
        userId: 'OFF-3319',
        name: 'Sub-Inspector Rajesh Nair',
        rank: 'Sub-Inspector of Police (PSI)',
        department: 'Special Investigation Team (SIT)',
        badge: 'SIT-FLD-3319',
        isCreator: false,
        addedAt: '2026-09-15T09:32:00Z',
      },
      {
        userId: 'CX-1042',
        name: 'Insp. Neha Verma',
        rank: 'Police Inspector',
        department: 'Cyber Forensics & Digital Wiretaps',
        badge: 'KA-CYBER-1042',
        isCreator: false,
        addedAt: '2026-09-15T09:35:00Z',
      },
    ],
    posts: [
      {
        id: 'post-1',
        senderId: 'DGP-0001',
        senderName: 'DGP Arjun Sharma',
        senderRank: 'Director General of Police (DGP)',
        content:
          'Apex Command Secret Room activated to coordinate sensitive surveillance and intercepted transactions. All evidence discussed here remains strictly within authorized room members.',
        timestamp: 'Today at 09:30 AM',
        type: 'note',
      },
      {
        id: 'post-2',
        senderId: 'CX-1042',
        senderName: 'Insp. Neha Verma',
        senderRank: 'Police Inspector',
        content:
          'Decrypted the encrypted telegram chat logs recovered from device EV-028. Found recurring references to a shell account in Mauritius transferring ₹4.2 Crore.',
        timestamp: 'Today at 10:15 AM',
        type: 'finding',
      },
      {
        id: 'post-3',
        senderId: 'OFF-3319',
        senderName: 'Sub-Inspector Rajesh Nair',
        senderRank: 'Sub-Inspector of Police (PSI)',
        content:
          'Special Investigation Team deployed perimeter monitoring near the secondary hawala transit points in Kalasipalyam. Awaiting green signal for simultaneous interdiction.',
        timestamp: 'Today at 10:30 AM',
        type: 'finding',
      },
      {
        id: 'post-4',
        senderId: 'DGP-0001',
        senderName: 'DGP Arjun Sharma',
        senderRank: 'Director General of Police (DGP)',
        content:
          'Maintain covert posture. Cross-verify suspect movements with airport manifest logs from the 12th.',
        timestamp: 'Today at 10:45 AM',
        type: 'message',
      },
    ],
  },
  {
    id: 'ROOM-0078',
    caseId: 'CASE-0078',
    caseTitle: 'Coordinated Theft Network',
    roomName: 'Outer Ring Road Cargo Intercept Cell',
    password: DEFAULT_SECRET_ROOM_PASSWORD,
    createdAt: '2026-09-16T11:00:00Z',
    createdByOfficerId: 'CX-3012',
    createdByOfficerName: 'DSP S. Narayana',
    members: [
      {
        userId: 'CX-3012',
        name: 'DSP S. Narayana',
        rank: 'Deputy Superintendent of Police (DSP)',
        department: 'Special Operations Taskforce',
        badge: 'KA-3012-SID',
        isCreator: true,
        addedAt: '2026-09-16T11:00:00Z',
      },
      {
        userId: 'DGP-0001',
        name: 'DGP Arjun Sharma',
        rank: 'Director General of Police (DGP)',
        department: 'State Police Headquarters & Apex Command',
        badge: 'IPS-KA-DGP-001',
        isCreator: false,
        addedAt: '2026-09-16T11:05:00Z',
      },
      {
        userId: 'CX-4502',
        name: 'DCP Sanjay Kulkarni',
        rank: 'Deputy Commissioner of Police',
        department: 'Inter-Agency Coordination Command',
        badge: 'KA-DCP-4502',
        isCreator: false,
        addedAt: '2026-09-16T11:15:00Z',
      },
    ],
    posts: [
      {
        id: 'post-78-1',
        senderId: 'CX-3012',
        senderName: 'DSP S. Narayana',
        senderRank: 'Deputy Superintendent of Police (DSP)',
        content:
          'Secret Taskroom activated for CASE-0078 warehouse burglary ring. ANPR cameras on Nelamangala toll corridor flagged vehicle X registration plate cloning.',
        timestamp: 'Yesterday at 11:20 AM',
        type: 'note',
      },
      {
        id: 'post-78-2',
        senderId: 'CX-4502',
        senderName: 'DCP Sanjay Kulkarni',
        senderRank: 'Deputy Commissioner of Police',
        content:
          'Transit manifest confirms 4 containers were offloaded into unlisted godowns near Peenya Industrial Area.',
        timestamp: 'Yesterday at 02:40 PM',
        type: 'finding',
      },
    ],
  },
];
