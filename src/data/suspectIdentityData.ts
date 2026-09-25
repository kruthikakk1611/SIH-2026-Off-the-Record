export type VerificationStatus = 'Not Verified' | 'Verification Pending' | 'Verified';
export type VerificationSource = 'None' | 'Aadhaar' | 'DigiLocker';

export interface SuspectIdentityRecord {
  suspectId: string;
  identityStatus: 'Verified' | 'Unverified' | 'Disputed' | 'Pending';
  verificationSource: VerificationSource;
  verificationStatus: VerificationStatus;
  verificationTimestamp?: string;
  identityMatchStatus?: string;

  // Aadhaar specific details (Masked)
  aadhaarMasked?: string; // e.g. "XXXX-XXXX-8921"
  aadhaarDemographicMatchScore?: string; // e.g. "99.8% Match (UIDAI Central Registry)"
  aadhaarRegisteredState?: string;

  // DigiLocker specific details
  digiLockerDocumentType?: string; // e.g. "e-Aadhaar & Permanent Account Number (PAN)"
  digiLockerIssuingAuthority?: string; // e.g. "Unique Identification Authority of India (UIDAI) & Income Tax Department"
  digiLockerVerifiedName?: string;
  digiLockerDocUri?: string;
  digiLockerConsentTimestamp?: string;

  // Link to graph / case
  linkedToCaseId?: string;
}

export const INITIAL_SUSPECT_IDENTITIES: Record<string, SuspectIdentityRecord> = {
  'SUS-01': {
    suspectId: 'SUS-01',
    identityStatus: 'Verified',
    verificationSource: 'Aadhaar',
    verificationStatus: 'Verified',
    verificationTimestamp: '13 Aug 2026, 14:32 IST',
    identityMatchStatus: 'Biometric & Demographic 100% Corroborated',
    aadhaarMasked: 'XXXX-XXXX-4912',
    aadhaarDemographicMatchScore: '99.9% Biometric & Facial Match (UIDAI Certified)',
    aadhaarRegisteredState: 'Karnataka',
    digiLockerDocumentType: 'e-Aadhaar & Smart Card Driving Licence',
    digiLockerIssuingAuthority: 'UIDAI & Transport Dept, Govt of Karnataka',
    digiLockerVerifiedName: 'Vikram Raghavan (DOB: 14/05/1988)',
    digiLockerDocUri: 'in.gov.uidai:aadhaar-xml-4912',
    digiLockerConsentTimestamp: '13 Aug 2026, 14:32:05 IST',
    linkedToCaseId: 'CASE-0102',
  },
  'SUS-02': {
    suspectId: 'SUS-02',
    identityStatus: 'Verified',
    verificationSource: 'DigiLocker',
    verificationStatus: 'Verified',
    verificationTimestamp: '14 Aug 2026, 11:15 IST',
    identityMatchStatus: 'DigiLocker Authenticated via National Identity Gateway',
    aadhaarMasked: 'XXXX-XXXX-7341',
    aadhaarDemographicMatchScore: '98.5% Demographic Match',
    aadhaarRegisteredState: 'Karnataka',
    digiLockerDocumentType: 'PAN Card & Aadhaar e-KYC',
    digiLockerIssuingAuthority: 'Income Tax Department & UIDAI',
    digiLockerVerifiedName: 'Sunil Kumar (DOB: 22/09/1985)',
    digiLockerDocUri: 'in.gov.incometax:pan-7341',
    digiLockerConsentTimestamp: '14 Aug 2026, 11:15:20 IST',
    linkedToCaseId: 'CASE-0102',
  },
  'SUS-03': {
    suspectId: 'SUS-03',
    identityStatus: 'Unverified',
    verificationSource: 'None',
    verificationStatus: 'Not Verified',
    identityMatchStatus: 'Pending Official KYC Verification',
    linkedToCaseId: 'CASE-0102',
  },
  'SUS-04': {
    suspectId: 'SUS-04',
    identityStatus: 'Unverified',
    verificationSource: 'None',
    verificationStatus: 'Not Verified',
    identityMatchStatus: 'Pending Official KYC Verification',
    linkedToCaseId: 'CASE-0102',
  },
  'SUS-05': {
    suspectId: 'SUS-05',
    identityStatus: 'Unverified',
    verificationSource: 'None',
    verificationStatus: 'Not Verified',
    identityMatchStatus: 'Pending Official KYC Verification',
    linkedToCaseId: 'CASE-0102',
  },
  'SUS-06': {
    suspectId: 'SUS-06',
    identityStatus: 'Unverified',
    verificationSource: 'None',
    verificationStatus: 'Not Verified',
    identityMatchStatus: 'Pending Official KYC Verification',
    linkedToCaseId: 'CASE-0102',
  },
};

const STORAGE_KEY = 'crimex_suspect_identities';

export const getSuspectIdentities = (): Record<string, SuspectIdentityRecord> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_SUSPECT_IDENTITIES;
};

export const saveSuspectIdentity = (record: SuspectIdentityRecord): Record<string, SuspectIdentityRecord> => {
  const current = getSuspectIdentities();
  const updated = {
    ...current,
    [record.suspectId]: record,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
  return updated;
};

export const getIdentityForSuspect = (suspectId: string, suspectName?: string): SuspectIdentityRecord => {
  const all = getSuspectIdentities();
  if (all[suspectId]) {
    return all[suspectId];
  }

  // Default initial unverified record
  return {
    suspectId,
    identityStatus: 'Unverified',
    verificationSource: 'None',
    verificationStatus: 'Not Verified',
    identityMatchStatus: 'No civic verification record linked',
    aadhaarMasked: 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
  };
};
