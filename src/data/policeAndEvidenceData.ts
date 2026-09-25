import { PoliceOfficerInvolved, CaseInitiator, EvidenceTimelineItem } from '../types';

export interface CasePoliceAndEvidence {
  policeOfficers: PoliceOfficerInvolved[];
  initiatedBy: CaseInitiator;
  courtName: string;
  courtSections: string[];
  evidenceTimeline: EvidenceTimelineItem[];
}

export const CASE_POLICE_AND_EVIDENCE: Record<string, CasePoliceAndEvidence> = {
  'CASE-0102': {
    policeOfficers: [
      {
        policeId: 'POL-KA-2026-4491',
        name: 'Inspector Rajesh Kumar',
        rank: 'Inspector of Police',
        role: 'Lead Investigating Officer & Case Initiator',
        station: 'CID Cyber Crime Police Station, Bengaluru',
        contact: '+91 94808 01021',
        isLead: true,
        isStarter: true,
      },
      {
        policeId: 'POL-KA-2026-5582',
        name: 'Sub-Inspector Ananya Rao',
        rank: 'Sub-Inspector of Police',
        role: 'Digital Forensics & Wiretap Telecom Analyst',
        station: 'CID Cyber Crime Police Station, Bengaluru',
        contact: '+91 94808 01025',
      },
      {
        policeId: 'POL-KA-2026-4811',
        name: 'Inspector Vikram Patil',
        rank: 'Inspector of Police',
        role: 'Field Intercept & Vehicle Surveillance In-Charge',
        station: 'Central Crime Branch (CCB), Bengaluru',
        contact: '+91 94808 01032',
      },
      {
        policeId: 'POL-KA-2026-3012',
        name: 'DSP S. Narayana',
        rank: 'Deputy Superintendent of Police',
        role: 'Supervisory Reviewing Authority & Special Cell Liaison',
        station: 'State Intelligence Directorate, Bengaluru',
        contact: '+91 94808 01001',
      },
      {
        policeId: 'POL-KA-2026-6219',
        name: 'Head Constable Ramesh Naik',
        rank: 'Head Constable (Technical)',
        role: 'Physical Hardware Custody & Seizure Officer',
        station: 'CID Cyber Crime Police Station',
        contact: '+91 94808 01078',
      },
      {
        policeId: 'POL-KA-2026-7734',
        name: 'Constable Deepa Murthy',
        rank: 'Cyber Crime Analyst',
        role: 'Call Detail Record (CDR) & Tower Dump Analyst',
        station: 'Cyber Telecommunications Wing',
        contact: '+91 94808 01089',
      },
    ],
    initiatedBy: {
      policeId: 'POL-KA-2026-4491',
      name: 'Inspector Rajesh Kumar',
      rank: 'Inspector of Police',
      date: '12 Aug 2026',
      firNumber: 'FIR No. 109/2026 (Cyber Crime PS)',
      station: 'CID Cyber Crime Police Station, Palace Road, Bengaluru',
    },
    courtName: 'Principal City Civil and Sessions Court (Special Cyber Court), Bengaluru',
    courtSections: [
      'Section 420 IPC / 318(4) BNS (Cheating & Dishonestly Inducing Delivery of Property)',
      'Section 120B IPC / 61(2) BNS (Criminal Conspiracy)',
      'Section 467/468 IPC / 338 BNS (Forgery of Valuable Security for Purpose of Cheating)',
      'Section 66C IT Act, 2000 (Identity Theft & Account Misappropriation)',
      'Section 66D IT Act, 2000 (Cheating by Personation Using Computer Resource)',
    ],
    evidenceTimeline: [
      {
        id: 'ET-01',
        evidenceId: 'EV-1027',
        date: '12 Aug 2026',
        time: '10:30 AM IST',
        title: 'Original FIR & Complainant Forensic Bank Statement',
        type: 'Documentary',
        officerName: 'Inspector Rajesh Kumar',
        officerId: 'POL-KA-2026-4491',
        description:
          'First Information Report formally registered at CID Cyber Crime PS with complainant bank debit slips totaling ₹2.4 Crores across 3 transactions.',
        locationSeized: 'CID Cyber Crime PS, Bengaluru',
        blockchainHash: '0x8f2a4e9b1103c847a9d21b447819c4d9',
        status: 'Verified',
      },
      {
        id: 'ET-02',
        evidenceId: 'EV-1028',
        date: '14 Aug 2026',
        time: '03:15 PM IST',
        title: 'Call Detail Records (CDR) & Tower Pings of Person A',
        type: 'Digital Telecom',
        officerName: 'Constable Deepa Murthy',
        officerId: 'POL-KA-2026-7734',
        description:
          'Telecommunications provider intercept containing 48 calls between Phone X and Phone B during fund transfers. High frequency burst detected during 14:15-14:50 IST.',
        locationSeized: 'Airtel Telecommunications Nodal Center, Bengaluru',
        blockchainHash: '0x3b7d81a92481029481ab091248102941',
        status: 'Chain of Custody Intact',
      },
      {
        id: 'ET-03',
        evidenceId: 'EV-1029',
        date: '18 Aug 2026',
        time: '11:45 AM IST',
        title: 'Seized Encrypted Mobile Handset (iPhone 15 Pro Max)',
        type: 'Physical Digital Hardware',
        officerName: 'Head Constable Ramesh Naik',
        officerId: 'POL-KA-2026-6219',
        description:
          'iPhone 15 Pro Max recovered during search operation at Location A (Outer Ring Rd). Forensic chip-off extraction revealed Telegram encrypted group chats.',
        locationSeized: 'Oakwood Enclave, Outer Ring Road, Marathahalli',
        blockchainHash: '0x991f8102948102847192481024910481',
        status: 'Forensic Analysis Complete',
      },
      {
        id: 'ET-04',
        evidenceId: 'EV-1030',
        date: '22 Aug 2026',
        time: '04:20 PM IST',
        title: 'Mule Bank Account Transaction Ledger & KYC Forgery',
        type: 'Financial Forensic',
        officerName: 'Sub-Inspector Ananya Rao',
        officerId: 'POL-KA-2026-5582',
        description:
          'Certified bank ledger from HDFC Bank showing layering of ₹1.1 Crore through Account-7821 to Account-9912. Forged voter ID card detected in KYC records.',
        locationSeized: 'HDFC Bank Zonal Forensic Unit, Bengaluru',
        blockchainHash: '0x5c4a1029481024918294810294810294',
        status: 'Verified',
      },
      {
        id: 'ET-05',
        evidenceId: 'EV-1031',
        date: '28 Aug 2026',
        time: '09:10 AM IST',
        title: 'ANPR Toll Gate Video Footage & Vehicle Telemetry',
        type: 'Physical Video CCTV',
        officerName: 'Inspector Vikram Patil',
        officerId: 'POL-KA-2026-4811',
        description:
          'High-definition automated number plate recognition feed capturing Vehicle X (KA-04-XX-1102) passing Electronic City elevated toll at 02:44 AM.',
        locationSeized: 'NHAI Electronic City Elevated Toll Plaza',
        blockchainHash: '0x12e98102948102948102948102948102',
        status: 'Chain of Custody Intact',
      },
      {
        id: 'ET-06',
        evidenceId: 'EV-1032',
        date: '05 Sep 2026',
        time: '02:00 PM IST',
        title: 'Encrypted Flash Drive with Hawala Counter Codes',
        type: 'Digital Storage Media',
        officerName: 'Inspector Rajesh Kumar',
        officerId: 'POL-KA-2026-4491',
        description:
          'Kingston 128GB USB drive recovered from safehouse containing spreadsheet of serial numbers and payment tokens matching informal currency remittances.',
        locationSeized: 'Safehouse Location Y, Electronic City Phase 2',
        blockchainHash: '0xaa428102948102948102948102948102',
        status: 'Forensic Analysis Complete',
      },
    ],
  },
  'CASE-0078': {
    policeOfficers: [
      {
        policeId: 'POL-KA-2026-3012',
        name: 'DSP S. Narayana',
        rank: 'Deputy Superintendent of Police',
        role: 'Special Operations Taskforce Commander & Case Initiator',
        station: 'State Intelligence Directorate, Bengaluru',
        contact: '+91 94808 01001',
        isLead: true,
        isStarter: true,
      },
      {
        policeId: 'POL-KA-2026-4811',
        name: 'Inspector Vikram Patil',
        rank: 'Inspector of Police',
        role: 'Field Intercept Team Lead',
        station: 'Central Crime Branch (CCB), Bengaluru',
        contact: '+91 94808 01032',
      },
      {
        policeId: 'POL-KA-2026-5129',
        name: 'Sub-Inspector Mohan Gowda',
        rank: 'Sub-Inspector of Police',
        role: 'Vehicle Tracking & ANPR Surveillance Officer',
        station: 'Highway Patrol Taskforce',
        contact: '+91 94808 01044',
      },
      {
        policeId: 'POL-KA-2026-6219',
        name: 'Head Constable Ramesh Naik',
        rank: 'Head Constable (Technical)',
        role: 'Physical Evidence Seizure Custodian',
        station: 'CID Cyber Crime Police Station',
        contact: '+91 94808 01078',
      },
      {
        policeId: 'POL-KA-2026-8821',
        name: 'Constable Suresh K.',
        rank: 'Field Intelligence Officer',
        role: 'Warehouse Surveillance Specialist',
        station: 'Central Crime Branch (CCB)',
        contact: '+91 94808 01095',
      },
    ],
    initiatedBy: {
      policeId: 'POL-KA-2026-3012',
      name: 'DSP S. Narayana',
      rank: 'Deputy Superintendent of Police',
      date: '04 Jul 2026',
      firNumber: 'FIR No. 088/2026 (Crime Branch PS)',
      station: 'Central Crime Branch Police Station, Bengaluru',
    },
    courtName: 'Metropolitan Magistrate Court - 4th Court, Bengaluru',
    courtSections: [
      'Section 379/411 IPC (Theft & Dishonestly Receiving Stolen Property)',
      'Section 465/471 IPC (Forgery & Using as Genuine a Forged Document)',
      'Section 120B IPC (Criminal Conspiracy)',
    ],
    evidenceTimeline: [
      {
        id: 'ET-78-01',
        evidenceId: 'EV-1028',
        date: '04 Jul 2026',
        time: '08:30 AM IST',
        title: 'Initial Warehouse Burglary Complaint & Inventory Loss Report',
        type: 'Documentary',
        officerName: 'DSP S. Narayana',
        officerId: 'POL-KA-2026-3012',
        description:
          'Audit log reporting stolen commercial electronic consignments valued at ₹85 Lakhs from Peenya logistics park.',
        locationSeized: 'Peenya Industrial Area Police Station',
        blockchainHash: '0x712a102948102948102948102948102',
        status: 'Verified',
      },
      {
        id: 'ET-78-02',
        evidenceId: 'EV-1033',
        date: '19 Jul 2026',
        time: '01:20 PM IST',
        title: 'Cloned Vehicle Number Plates (KA-01-YY-9004)',
        type: 'Physical Hardware',
        officerName: 'Inspector Vikram Patil',
        officerId: 'POL-KA-2026-4811',
        description:
          'Two counterfeit acrylic high-security registration plates recovered from rear storage of seized vehicle.',
        locationSeized: 'Nelamangala Highway Checkpost',
        blockchainHash: '0x551f102948102948102948102948102',
        status: 'Forensic Analysis Complete',
      },
    ],
  },
  'CASE-0041': {
    policeOfficers: [
      {
        policeId: 'POL-KA-2026-5582',
        name: 'Sub-Inspector Ananya Rao',
        rank: 'Sub-Inspector of Police',
        role: 'Lead Investigating Officer & Case Initiator',
        station: 'Economic Offences Wing - Squad 3, Bengaluru',
        contact: '+91 94808 01025',
        isLead: true,
        isStarter: true,
      },
      {
        policeId: 'POL-KA-2026-4491',
        name: 'Inspector Rajesh Kumar',
        rank: 'Inspector of Police',
        role: 'Supervisory Officer',
        station: 'CID Cyber Crime Police Station',
        contact: '+91 94808 01021',
      },
      {
        policeId: 'POL-KA-2026-7734',
        name: 'Constable Deepa Murthy',
        rank: 'Cyber Crime Analyst',
        role: 'Financial Routing & UPI Telemetry Analyst',
        station: 'Cyber Telecommunications Wing',
        contact: '+91 94808 01089',
      },
      {
        policeId: 'POL-KA-2026-6101',
        name: 'Head Constable Vinod Reddy',
        rank: 'Head Constable',
        role: 'Field Verification Officer',
        station: 'Economic Offences Wing',
        contact: '+91 94808 01066',
      },
    ],
    initiatedBy: {
      policeId: 'POL-KA-2026-5582',
      name: 'Sub-Inspector Ananya Rao',
      rank: 'Sub-Inspector of Police',
      date: '19 Jun 2026',
      firNumber: 'FIR No. 041/2026 (Economic Offences Wing)',
      station: 'Economic Offences Wing, CID Complex, Carlton House, Bengaluru',
    },
    courtName: 'Chief Metropolitan Magistrate Court, Bengaluru',
    courtSections: [
      'Section 419/420 IPC (Cheating by Personation)',
      'Section 66C/66D IT Act (Identity Theft & Computer Phishing)',
    ],
    evidenceTimeline: [
      {
        id: 'ET-41-01',
        evidenceId: 'EV-1030',
        date: '19 Jun 2026',
        time: '11:00 AM IST',
        title: 'Phishing Domain DNS Intercept & Server Logs',
        type: 'Digital Server Logs',
        officerName: 'Sub-Inspector Ananya Rao',
        officerId: 'POL-KA-2026-5582',
        description: 'Server access logs from rogue banking portal capturing 310 victim credentials.',
        locationSeized: 'CID Cyber Forensics Lab',
        blockchainHash: '0x992b102948102948102948102948102',
        status: 'Verified',
      },
    ],
  },
};

/**
 * Calculates case duration in human-readable format from startedDate string (e.g. "12 Aug 2026")
 */
export function calculateCaseDuration(startedDateStr: string): {
  days: number;
  displayText: string;
  ongoingStatus: string;
} {
  try {
    const started = new Date(startedDateStr);
    const now = new Date('2026-09-15T00:00:00'); // Fixed benchmark matching the app context
    const diffMs = now.getTime() - started.getTime();
    const days = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (days < 30) {
      return {
        days,
        displayText: `${days} Days`,
        ongoingStatus: `Ongoing for ${days} days (since ${startedDateStr})`,
      };
    }

    const months = Math.floor(days / 30);
    const remDays = days % 30;
    const displayText =
      remDays > 0 ? `${months} month${months > 1 ? 's' : ''} ${remDays} days` : `${months} month${months > 1 ? 's' : ''}`;

    return {
      days,
      displayText,
      ongoingStatus: `Ongoing for ${displayText} (${days} total days, since ${startedDateStr})`,
    };
  } catch (e) {
    return {
      days: 34,
      displayText: '34 Days',
      ongoingStatus: `Ongoing for 34 days (since ${startedDateStr})`,
    };
  }
}
