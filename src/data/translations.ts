export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'mr';

import { EXTENDED_TRANSLATIONS } from './translationsExtended';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.cases': 'Cases',
    'nav.suspects': 'Suspects',
    'nav.evidence': 'Evidence',
    'nav.network': 'Connection Map',
    'nav.compare': 'Compare Cases',
    'nav.secretRoom': 'Secret Room',
    'nav.aiAssistant': 'AI Assistant',
    'nav.reports': 'Reports',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',

    // Case Interface
    'case.details': 'Case Details',
    'case.overview': 'Case Overview',
    'case.fir': 'FIR (First Information Report)',
    'case.firNumber': 'FIR Number',
    'case.suspects': 'Suspects',
    'case.evidence': 'Evidence & CCTV',
    'case.blindspots': 'Blind Spot Analysis',
    'case.missingInfo': 'Missing Information',
    'case.deadEnd': 'Dead End Meter',
    'case.investigationMomentum': 'Investigation Momentum',
    'case.investigationLoop': 'Investigation Loop',
    'case.connections': 'Connections',
    'case.timeline': 'Timeline',
    'case.aiAnalysis': 'AI Analysis',
    'case.relatedCases': 'Related Cases',

    // Meters
    'meter.missingInfo': 'Missing Information Meter',
    'meter.deadEnd': 'Dead End / Loop Meter',
    'meter.completeness': 'Case Completeness',
    'meter.missing': 'Missing Information',
    'meter.investigationMomentum': 'Investigation Momentum',
    'meter.loopRisk': 'Dead End Risk',
    'meter.momentumScore': 'Momentum Score',
    'meter.gapsRemaining': 'Gaps Remaining',
    'meter.verifiedCheckpoints': 'Documented & Verified',
    'meter.missingCheckpoints': 'Missing Evidence',

    // Actions
    'action.view': 'View',
    'action.download': 'Download',
    'action.upload': 'Upload',
    'action.search': 'Search',
    'action.verify': 'Verify',
    'action.save': 'Save',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.close': 'Close',
    'action.submit': 'Submit',
    'action.refresh': 'Refresh',
    'action.viewFir': 'View FIR',
    'action.downloadFir': 'Download FIR',
    'action.verifyAadhaar': 'Verify with Aadhaar',
    'action.connectDigiLocker': 'Verify with DigiLocker',
    'action.viewCCTV': 'View CCTV Footage',
    'action.backToCases': 'Back to Cases',
    'action.exportPdf': 'Export Official PDF',

    // Identity Verification
    'identity.title': 'Identity Verification',
    'identity.section': 'IDENTITY VERIFICATION',
    'identity.status': 'Identity Status',
    'identity.availableSources': 'Available Sources',
    'identity.source': 'Verification Source',
    'identity.matchStatus': 'Identity Match',
    'identity.timestamp': 'Verification Timestamp',
    'identity.maskedAadhaar': 'Masked Aadhaar',
    'identity.documentType': 'Document Type',
    'identity.issuingAuthority': 'Issuing Authority',
    'identity.demoName': 'Demo Name',
    'identity.verifiedBadge': 'Identity Verified ✓',
    'identity.confirmedMatch': 'Confirmed',
    'identity.notVerified': 'Not Verified',
    'identity.pending': 'Verification Pending',
    'identity.verified': 'Verified',
    'identity.demoNotice': 'Simulated demonstration verification with fictional/demo data only.',

    // Statuses
    'status.verified': 'Verified',
    'status.notVerified': 'Not Verified',
    'status.pending': 'Pending',
    'status.verificationPending': 'Verification Pending',
    'status.complete': 'Complete',
    'status.incomplete': 'Incomplete',
    'status.high': 'High',
    'status.medium': 'Medium',
    'status.low': 'Low',
    'status.critical': 'Critical',
    'status.active': 'Active',
    'status.closed': 'Closed',
    'status.keyNode': 'Key Node',

    // AI Messages
    'ai.loopDetected': 'Potential investigation loop detected. Consider exploring another angle.',
    'ai.progressNormal': 'Investigation is actively progressing with new leads and evidence corroboration.',
    'ai.moderateStagnation': 'Moderate stagnation observed across repeat suspect inquiries.',
    'ai.recommendation': 'Consider exploring unverified digital evidence, bank transactions, or alternate witness depositions.',
    'ai.disclaimer': 'AI-assisted investigative aid. Investigator remains in complete operational authority.',

    // Common UI Labels
    'app.title': 'Police Intelligence Terminal',
    'app.subtitle': 'Central Law-Enforcement Network',
    'app.official': 'Official Police Record',
  },

  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.cases': 'मामले (केस)',
    'nav.suspects': 'संदेही (सस्पेक्ट्स)',
    'nav.evidence': 'साक्ष्य व सबूत',
    'nav.network': 'कनेक्शन मैप',
    'nav.compare': 'केस तुलना',
    'nav.secretRoom': 'सीक्रेट रूम',
    'nav.aiAssistant': 'एआई सहायक',
    'nav.reports': 'रिपोर्ट्स',
    'nav.notifications': 'सूचनाएं',
    'nav.profile': 'प्रोफाइल',
    'nav.settings': 'सेटिंग्स',

    // Case Interface
    'case.details': 'केस विवरण',
    'case.overview': 'केस अवलोकन',
    'case.fir': 'प्रथम सूचना रिपोर्ट (FIR)',
    'case.firNumber': 'एफआईआर संख्या',
    'case.suspects': 'संदेही व्यक्ति',
    'case.evidence': 'साक्ष्य एवं सीसीटीवी',
    'case.blindspots': 'ब्लाइंड स्पॉट विश्लेषण',
    'case.missingInfo': 'अधूरी जानकारी',
    'case.deadEnd': 'डेड एंड मीटर',
    'case.investigationMomentum': 'जांच गति',
    'case.investigationLoop': 'जांच पुनरावृत्ति (लूप)',
    'case.connections': 'संबंध व नेटवर्क',
    'case.timeline': 'घटनाक्रम',
    'case.aiAnalysis': 'एआई विश्लेषण',
    'case.relatedCases': 'संबंधित मामले',

    // Meters
    'meter.missingInfo': 'अधूरी जानकारी मीटर',
    'meter.deadEnd': 'डेड एंड / लूप डिटेक्टर',
    'meter.completeness': 'केस पूर्णता',
    'meter.missing': 'अधूरी जानकारी',
    'meter.investigationMomentum': 'जांच गति',
    'meter.loopRisk': 'डेड एंड जोखिम',
    'meter.momentumScore': 'गति स्कोर',
    'meter.gapsRemaining': 'शेष कमियां',
    'meter.verifiedCheckpoints': 'सत्यापित साक्ष्य',
    'meter.missingCheckpoints': 'अनुपलब्ध साक्ष्य',

    // Actions
    'action.view': 'देखें',
    'action.download': 'डाउनलोड',
    'action.upload': 'अपलोड',
    'action.search': 'खोजें',
    'action.verify': 'सत्यापित करें',
    'action.save': 'सहेजें',
    'action.edit': 'संपादित करें',
    'action.delete': 'हटाएं',
    'action.back': 'वापस',
    'action.next': 'अगला',
    'action.close': 'बंद करें',
    'action.submit': 'जमा करें',
    'action.refresh': 'ताज़ा करें',
    'action.viewFir': 'एफआईआर देखें',
    'action.downloadFir': 'एफआईआर डाउनलोड करें',
    'action.verifyAadhaar': 'आधार से सत्यापित करें',
    'action.connectDigiLocker': 'डिजिलॉकर से सत्यापित करें',
    'action.viewCCTV': 'सीसीटीवी फुटेज देखें',
    'action.backToCases': 'मामलों की सूची पर वापस जाएं',
    'action.exportPdf': 'आधिकारिक पीडीएफ निर्यात करें',

    // Identity Verification
    'identity.title': 'पहचान सत्यापन',
    'identity.section': 'पहचान सत्यापन (IDENTITY VERIFICATION)',
    'identity.status': 'पहचान स्थिति',
    'identity.availableSources': 'उपलब्ध स्रोत',
    'identity.source': 'सत्यापन स्रोत',
    'identity.matchStatus': 'पहचान मिलान',
    'identity.timestamp': 'सत्यापन समय',
    'identity.maskedAadhaar': 'मास्क्ड आधार संख्या',
    'identity.documentType': 'दस्तावेज़ प्रकार',
    'identity.issuingAuthority': 'जारीकर्ता प्राधिकरण',
    'identity.demoName': 'प्रदर्शित नाम',
    'identity.verifiedBadge': 'पहचान सत्यापित ✓',
    'identity.confirmedMatch': 'पुष्ट (Confirmed)',
    'identity.notVerified': 'असत्यापित',
    'identity.pending': 'सत्यापन लंबित',
    'identity.verified': 'सत्यापित',
    'identity.demoNotice': 'केवल डेमो और परीक्षण हेतु काल्पनिक डेटा।',

    // Statuses
    'status.verified': 'सत्यापित',
    'status.notVerified': 'असत्यापित',
    'status.pending': 'लंबित',
    'status.verificationPending': 'सत्यापन लंबित',
    'status.complete': 'पूर्ण',
    'status.incomplete': 'अपूर्ण',
    'status.high': 'उच्च',
    'status.medium': 'मध्यम',
    'status.low': 'कम',
    'status.critical': 'अत्यंत गंभीर',
    'status.active': 'सक्रिय',
    'status.closed': 'समाप्त',
    'status.keyNode': 'मुख्य संदिग्ध',

    // AI Messages
    'ai.loopDetected': 'संभावित जांच पुनरावृत्ति (लूप) का पता चला है। किसी अन्य दृष्टिकोण की खोज पर विचार करें।',
    'ai.progressNormal': 'जांच नए साक्ष्यों और सूचनाओं के साथ सक्रिय रूप से आगे बढ़ रही है।',
    'ai.moderateStagnation': 'संदेहियों की बारंबार पूछताछ में मध्यम गतिरोध देखा गया है।',
    'ai.recommendation': 'अनसुलझे डिजिटल साक्ष्यों, बैंक लेन-देन या गवाहों के बयानों की पड़ताल पर विचार करें।',
    'ai.disclaimer': 'एआई-सहायक जांच उपकरण। संपूर्ण परिचालन अधिकार जांच अधिकारी के पास ही रहेगा।',

    // Common UI Labels
    'app.title': 'पुलिस गुप्तचर टर्मिनल',
    'app.subtitle': 'केंद्रीय कानून प्रवर्तन नेटवर्क',
    'app.official': 'आधिकारिक पुलिस रिकॉर्ड',
  },

  kn: {
    // Navigation
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.cases': 'ಪ್ರಕರಣಗಳು',
    'nav.suspects': 'ಶಂಕಿತರು',
    'nav.evidence': 'ಸಾಕ್ಷ್ಯಾಧಾರಗಳು',
    'nav.network': 'ಸಂಪರ್ಕ ನಕ್ಷೆ',
    'nav.compare': 'ಪ್ರಕರಣ ಹೋಲಿಕೆ',
    'nav.secretRoom': 'ಸೀಕ್ರೆಟ್ ರೂಮ್',
    'nav.aiAssistant': 'ಎಐ ಸಹಾಯಕ',
    'nav.reports': 'ವರದಿಗಳು',
    'nav.notifications': 'ಸೂಚನೆಗಳು',
    'nav.profile': 'ಪ್ರೊಫೈಲ್',
    'nav.settings': 'ಸೆಟ್ಟಿಂಗ್ಸ್',

    // Case Interface
    'case.details': 'ಪ್ರಕರಣದ ವಿವರಗಳು',
    'case.overview': 'ಪ್ರಕರಣ ಅವಲೋಕನ',
    'case.fir': 'ಪ್ರಥಮ ಮಾಹಿತಿ ವರದಿ (FIR)',
    'case.firNumber': 'ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ',
    'case.suspects': 'ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು',
    'case.evidence': 'ಸಾಕ್ಷ್ಯಾಧಾರ ಮತ್ತು ಸಿಸಿಟಿವಿ',
    'case.blindspots': 'ಬ್ಲೈಂಡ್ ಸ್ಪಾಟ್ ವಿಶ್ಲೇಷಣೆ',
    'case.missingInfo': 'ಕೊರತೆಯಿರುವ ಮಾಹಿತಿ',
    'case.deadEnd': 'ಡೆಡ್ ಎಂಡ್ ಮೀಟರ್',
    'case.investigationMomentum': 'ತನಿಖಾ ಗತಿ',
    'case.investigationLoop': 'ತನಿಖಾ ಲೂಪ್',
    'case.connections': 'ಸಂಪರ್ಕಗಳು',
    'case.timeline': 'ಸಮಯಾವಳಿ (ಟೈಮ್‌ಲೈನ್)',
    'case.aiAnalysis': 'ಎಐ ವಿಶ್ಲೇಷಣೆ',
    'case.relatedCases': 'ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳು',

    // Meters
    'meter.missingInfo': 'ಅಪೂರ್ಣ ಮಾಹಿತಿ ಮೀಟರ್',
    'meter.deadEnd': 'ಡೆಡ್ ಎಂಡ್ / ಲೂಪ್ ಪತ್ತೆ',
    'meter.completeness': 'ಪ್ರಕರಣದ ಪೂರ್ಣತೆ',
    'meter.missing': 'ಕೊರತೆಯಿರುವ ಮಾಹಿತಿ',
    'meter.investigationMomentum': 'ತನಿಖಾ ಗತಿ',
    'meter.loopRisk': 'ಡೆಡ್ ಎಂಡ್ ಅಪಾಯ',
    'meter.momentumScore': 'ವೇಗದ ಸ್ಕೋರ್',
    'meter.gapsRemaining': 'ಬಾಕಿ ಉಳಿದ ಅಂಶಗಳು',
    'meter.verifiedCheckpoints': 'ದಾಖಲಿತ ಸಾಕ್ಷ್ಯ',
    'meter.missingCheckpoints': 'ಕಾಣೆಯಾದ ಸಾಕ್ಷ್ಯ',

    // Actions
    'action.view': 'ವೀಕ್ಷಿಸಿ',
    'action.download': 'ಡೌನ್‌ಲೋಡ್',
    'action.upload': 'ಅಪ್‌ಲೋಡ್',
    'action.search': 'ಹುಡುಕಿ',
    'action.verify': 'ಪರಿಶೀಲಿಸಿ',
    'action.save': 'ಉಳಿಸಿ',
    'action.edit': 'ಸಂಪಾದಿಸಿ',
    'action.delete': 'ಅಳಿಸಿ',
    'action.back': 'ಹಿಂದಕ್ಕೆ',
    'action.next': 'ಮುಂದೆ',
    'action.close': 'ಮುಚ್ಚಿ',
    'action.submit': 'ಸಲ್ಲಿಸಿ',
    'action.refresh': 'ರಿಫ್ರೆಶ್ ಮಾಡಿ',
    'action.viewFir': 'ಎಫ್‌ಐಆರ್ ವೀಕ್ಷಿಸಿ',
    'action.downloadFir': 'ಎಫ್‌ಐಆರ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    'action.verifyAadhaar': 'ಆಧಾರ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ',
    'action.connectDigiLocker': 'ಡಿಜಿಲಾಕರ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ',
    'action.viewCCTV': 'ಸಿಸಿಟಿವಿ ದೃಶ್ಯಾವಳಿ ವೀಕ್ಷಿಸಿ',
    'action.backToCases': 'ಪ್ರಕರಣಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
    'action.exportPdf': 'ಅಧಿಕೃತ ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್',

    // Identity Verification
    'identity.title': 'ಗುರುತಿನ ಪರಿಶೀಲನೆ',
    'identity.section': 'ಗುರುತಿನ ಪರಿಶೀಲನೆ (IDENTITY VERIFICATION)',
    'identity.status': 'ಗುರುತಿನ ಸ್ಥಿತಿ',
    'identity.availableSources': 'ಲಭ್ಯವಿರುವ ಮೂಲಗಳು',
    'identity.source': 'ಪರಿಶೀಲನಾ ಮೂಲ',
    'identity.matchStatus': 'ಹೊಂದಾಣಿಕೆ ಸ್ಥಿತಿ',
    'identity.timestamp': 'ಪರಿಶೀಲಿಸಿದ ಸಮಯ',
    'identity.maskedAadhaar': 'ಮಾಸ್ಕ್ ಮಾಡಲಾದ ಆಧಾರ್ ಸಂಖ್ಯೆ',
    'identity.documentType': 'ದಾಖಲೆಯ ಪ್ರಕಾರ',
    'identity.issuingAuthority': 'ನೀಡಿದ ಪ್ರಾಧಿಕಾರ',
    'identity.demoName': 'ಡೆಮೊ ಹೆಸರು',
    'identity.verifiedBadge': 'ಗುರುತು ದೃಢೀಕರಿಸಲಾಗಿದೆ ✓',
    'identity.confirmedMatch': 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    'identity.notVerified': 'ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ',
    'identity.pending': 'ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ',
    'identity.verified': 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    'identity.demoNotice': 'ಡೆಮೊ ಉದ್ದೇಶಕ್ಕಾಗಿ ಅಣಕು ಡೇಟಾ ಬಳಸಲಾಗಿದೆ.',

    // Statuses
    'status.verified': 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    'status.notVerified': 'ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ',
    'status.pending': 'ಬಾಕಿ ಇದೆ',
    'status.verificationPending': 'ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ',
    'status.complete': 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    'status.incomplete': 'ಅಪೂರ್ಣ',
    'status.high': 'ಹೆಚ್ಚು',
    'status.medium': 'ಮಧ್ಯಮ',
    'status.low': 'ಕಡಿಮೆ',
    'status.critical': 'ಗಂಭೀರ',
    'status.active': 'ಸಕ್ರಿಯ',
    'status.closed': 'ಮುಕ್ತಾಯ',
    'status.keyNode': 'ಪ್ರಮುಖ ಶಂಕಿತ',

    // AI Messages
    'ai.loopDetected': 'ಸಂಭಾವ್ಯ ತನಿಖಾ ಲೂಪ್ ಪತ್ತೆಯಾಗಿದೆ. ಮತ್ತೊಂದು ಕೋನವನ್ನು ಪರಿಶೀಲಿಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.',
    'ai.progressNormal': 'ತನಿಖೆಯು ಹೊಸ ಸಾಕ್ಷ್ಯಾಧಾರಗಳೊಂದಿಗೆ ವೇಗವಾಗಿ ಪ್ರಗತಿ ಸಾಧಿಸುತ್ತಿದೆ.',
    'ai.moderateStagnation': 'ಶಂಕಿತರ ಪುನರಾವರ್ತಿತ ವಿಚಾರಣೆಯಲ್ಲಿ ಮಧ್ಯಮ ಮಟ್ಟದ ಸ್ಥಗಿತತೆ ಕಂಡುಬಂದಿದೆ.',
    'ai.recommendation': 'ಪರಿಶೀಲಿಸದ ಡಿಜಿಟಲ್ ಪುರಾವೆಗಳು, ಬ್ಯಾಂಕ್ ವಹಿವಾಟುಗಳು ಅಥವಾ ಹೊಸ ಸಾಕ್ಷಿದಾರರ ಹೇಳಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    'ai.disclaimer': 'ಎಐ-ಸಹಾಯಿತ ತನಿಖಾ ನೆರವು. ತನಿಖಾಧಿಕಾರಿಯೇ ಸಂಪೂರ್ಣ ಕಾರ್ಯಾಚರಣೆಯ ಅಧಿಕಾರ ಹೊಂದಿದ್ದಾರೆ.',

    // Common UI Labels
    'app.title': 'ಪೊಲೀಸ್ ಗುಪ್ತಚರ ಟರ್ಮಿನಲ್',
    'app.subtitle': 'ಕೇಂದ್ರ ಕಾನೂನು ಜಾರಿ ಜಾಲ',
    'app.official': 'ಅಧಿಕೃತ ಪೊಲೀಸ್ ದಾಖಲೆ',
  },

  ta: {
    // Navigation
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.cases': 'வழக்குகள்',
    'nav.suspects': 'சந்தேக நபர்கள்',
    'nav.evidence': 'ஆதாரங்கள்',
    'nav.network': 'இணைப்பு வரைபடம்',
    'nav.compare': 'வழக்கு ஒப்பீடு',
    'nav.secretRoom': 'சீக்ரெட் ரூம்',
    'nav.aiAssistant': 'ஏஐ உதவியாளர்',
    'nav.reports': 'அறிக்கைகள்',
    'nav.notifications': 'அறிவிப்புகள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.settings': 'அமைப்புகள்',

    // Case Interface
    'case.details': 'வழக்கு விவரங்கள்',
    'case.overview': 'வழக்கு கண்ணோட்டம்',
    'case.fir': 'முதல் தகவல் அறிக்கை (FIR)',
    'case.firNumber': 'எஃப்ஐஆர் எண்',
    'case.suspects': 'சந்தேக நபர்கள்',
    'case.evidence': 'ஆதாரம் & சிசிடிவி',
    'case.blindspots': 'பிளைண்ட் ஸ்பாட் பகுப்பாய்வு',
    'case.missingInfo': 'விடுபட்ட தகவல்கள்',
    'case.deadEnd': 'டெட் எண்ட் மீட்டர்',
    'case.investigationMomentum': 'விசாரணை வேகம்',
    'case.investigationLoop': 'புலனாய்வு சுழற்சி',
    'case.connections': 'இணைப்புகள்',
    'case.timeline': 'காலவரிசை',
    'case.aiAnalysis': 'ஏஐ பகுப்பாய்வு',
    'case.relatedCases': 'தொடர்புடைய வழக்குகள்',

    // Meters
    'meter.missingInfo': 'விடுபட்ட தகவல் மீட்டர்',
    'meter.deadEnd': 'டெட் எண்ட் / லூப் கண்டறிதல்',
    'meter.completeness': 'வழக்கு முழுமை',
    'meter.missing': 'விடுபட்ட தகவல்கள்',
    'meter.investigationMomentum': 'விசாரணை வேகம்',
    'meter.loopRisk': 'டெட் எண்ட் அபாயம்',
    'meter.momentumScore': 'வேக மதிப்பீடு',
    'meter.gapsRemaining': 'விடுபட்ட நிலுவைகள்',
    'meter.verifiedCheckpoints': 'சரிபார்க்கப்பட்ட சான்றுகள்',
    'meter.missingCheckpoints': 'விடுபட்ட சான்றுகள்',

    // Actions
    'action.view': 'பார்க்க',
    'action.download': 'பதிவிறக்குக',
    'action.upload': 'பதிவேற்றுக',
    'action.search': 'தேடுக',
    'action.verify': 'சரிபார்க்கவும்',
    'action.save': 'சேமிக்க',
    'action.edit': 'திருத்த',
    'action.delete': 'நீக்க',
    'action.back': 'பின்செல்க',
    'action.next': 'அடுத்து',
    'action.close': 'மூட',
    'action.submit': 'சமர்ப்பிக்க',
    'action.refresh': 'புதுப்பிக்க',
    'action.viewFir': 'எஃப்ஐஆர் பார்க்க',
    'action.downloadFir': 'எஃப்ஐஆர் பதிவிறக்கம்',
    'action.verifyAadhaar': 'ஆதார் மூலம் சரிபார்க்கவும்',
    'action.connectDigiLocker': 'டிஜிலாக்கர் மூலம் சரிபார்க்கவும்',
    'action.viewCCTV': 'சிசிடிவி காட்சியைப் பார்க்கவும்',
    'action.backToCases': 'வழக்குகளுக்குத் திரும்பு',
    'action.exportPdf': 'அதிகாரப்பூர்வ PDF ஏற்றுமதி',

    // Identity Verification
    'identity.title': 'அடையாள சரிபார்ப்பு',
    'identity.section': 'அடையாள சரிபார்ப்பு (IDENTITY VERIFICATION)',
    'identity.status': 'அடையாள நிலை',
    'identity.availableSources': 'கிடைக்கும் ஆதாரங்கள்',
    'identity.source': 'சரிபார்ப்பு மூலம்',
    'identity.matchStatus': 'பொருந்தும் நிலை',
    'identity.timestamp': 'சரிபார்க்கப்பட்ட நேரம்',
    'identity.maskedAadhaar': 'மறைக்கப்பட்ட ஆதார் எண்',
    'identity.documentType': 'ஆவண வகை',
    'identity.issuingAuthority': 'வழங்கிய அதிகாரம்',
    'identity.demoName': 'மாதிரி பெயர்',
    'identity.verifiedBadge': 'அடையாளம் சரிபார்க்கப்பட்டது ✓',
    'identity.confirmedMatch': 'உறுதி செய்யப்பட்டது',
    'identity.notVerified': 'சரிபார்க்கப்படவில்லை',
    'identity.pending': 'சரிபார்ப்பு நிலுவையில்',
    'identity.verified': 'சரிபார்க்கப்பட்டது',
    'identity.demoNotice': 'மாதிரி பரிசோதனைக்கான கற்பனைத் தரவு.',

    // Statuses
    'status.verified': 'சரிபார்க்கப்பட்டது',
    'status.notVerified': 'சரிபார்க்கப்படவில்லை',
    'status.pending': 'நிலுவையில்',
    'status.verificationPending': 'சரிபார்ப்பு நிலுவையில்',
    'status.complete': 'முடிந்தது',
    'status.incomplete': 'முழுமையடையாத',
    'status.high': 'அதிக',
    'status.medium': 'நடுத்தர',
    'status.low': 'குறைந்த',
    'status.critical': 'தீவிர',
    'status.active': 'செயலில்',
    'status.closed': 'முடிவுற்றது',
    'status.keyNode': 'முக்கிய சந்தேக நபர்',

    // AI Messages
    'ai.loopDetected': 'சாத்தியமான புலனாய்வு சுழற்சி கண்டறியப்பட்டது. மாற்று கோணத்தை ஆராயவும்.',
    'ai.progressNormal': 'விசாரணை புதிய சான்றுகளுடன் முன்னேறி வருகிறது.',
    'ai.moderateStagnation': 'தொடர் விசாரணையில் மிதமான தேக்கநிலை காணப்படுகிறது.',
    'ai.recommendation': 'சரிபார்க்கப்படாத டிஜிட்டல் சான்றுகள், வங்கிப் பரிவர்த்தனைகள் அல்லது புதிய சாட்சியங்களை ஆராயவும்.',
    'ai.disclaimer': 'ஏஐ புலனாய்வு உதவி. விசாரணை அதிகாரிக்கே முழுமையான செயல்பாட்டு அதிகாரம் உள்ளது.',

    // Common UI Labels
    'app.title': 'காவல்துறை நுண்ணறிவு முனையம்',
    'app.subtitle': 'மத்திய சட்ட அமலாக்க நெட்வொர்க்',
    'app.official': 'அதிகாரப்பூர்வ காவல் பதிவு',
  },

  te: {
    // Navigation
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.cases': 'కేసులు',
    'nav.suspects': 'అనుమానితులు',
    'nav.evidence': 'సాక్ష్యాధారాలు',
    'nav.network': 'కనెక్షన్ మ్యాప్',
    'nav.compare': 'కేసు పోలిక',
    'nav.secretRoom': 'సీక్రెట్ రూమ్',
    'nav.aiAssistant': 'ఏఐ సహాయకుడు',
    'nav.reports': 'నివేదికలు',
    'nav.notifications': 'నోటిఫికేషన్‌లు',
    'nav.profile': 'ప్రొఫైల్',
    'nav.settings': 'సెట్టింగ్‌లు',

    // Case Interface
    'case.details': 'కేసు వివరాలు',
    'case.overview': 'కేసు సమీక్ష',
    'case.fir': 'ప్రథమ సమాచార నివేదిక (FIR)',
    'case.firNumber': 'ఎఫ్‌ఐఆర్ సంఖ్య',
    'case.suspects': 'అనుమానితులు',
    'case.evidence': 'సాక్ష్యం & సీసీటీవీ',
    'case.blindspots': 'బ్లైండ్ స్పాట్ విశ్లేషణ',
    'case.missingInfo': 'లోపించిన సమాచారం',
    'case.deadEnd': 'డెడ్ ఎండ్ మీటర్',
    'case.investigationMomentum': 'పరిశోధన వేగం',
    'case.investigationLoop': 'దర్యాప్తు లూప్',
    'case.connections': 'కనెక్షన్లు',
    'case.timeline': 'కాలక్రమం',
    'case.aiAnalysis': 'ఏఐ విశ్లేషణ',
    'case.relatedCases': 'సంబంధిత కేసులు',

    // Meters
    'meter.missingInfo': 'మిస్సింగ్ ఇన్ఫర్మేషన్ మీటర్',
    'meter.deadEnd': 'డెడ్ ఎండ్ / లూప్ డిటెక్టర్',
    'meter.completeness': 'కేసు పూర్తి శాతం',
    'meter.missing': 'లోపించిన సమాచారం',
    'meter.investigationMomentum': 'పరిశోధన వేగం',
    'meter.loopRisk': 'డెడ్ ఎండ్ ముప్పు',
    'meter.momentumScore': 'వేగ స్కోరు',
    'meter.gapsRemaining': 'మిగిలిన లోపాలు',
    'meter.verifiedCheckpoints': 'ధృవీకరించబడిన సాక్ష్యం',
    'meter.missingCheckpoints': 'లోపించిన సాక్ష్యం',

    // Actions
    'action.view': 'వీక్షించండి',
    'action.download': 'డౌన్‌లోడ్',
    'action.upload': 'అప్‌లోడ్',
    'action.search': 'శోధించండి',
    'action.verify': 'ధృవీకరించండి',
    'action.save': 'భద్రపరచండి',
    'action.edit': 'సవరించండి',
    'action.delete': 'తొలగించండి',
    'action.back': 'వెనుకకు',
    'action.next': 'తదుపరి',
    'action.close': 'మూసివేయి',
    'action.submit': 'సమర్పించండి',
    'action.refresh': 'రిఫ్రెష్',
    'action.viewFir': 'ఎఫ్‌ఐఆర్ చూడండి',
    'action.downloadFir': 'ఎఫ్‌ఐఆర్ డౌన్‌లోడ్',
    'action.verifyAadhaar': 'ఆధార్‌తో ధృవీకరించండి',
    'action.connectDigiLocker': 'డిజిలాకర్‌తో ధృవీకరించండి',
    'action.viewCCTV': 'సీసీటీవీ ఫుటేజ్ చూడండి',
    'action.backToCases': 'కేసుల జాబితాకు',
    'action.exportPdf': 'అధికారిక PDF ఎగుమతి',

    // Identity Verification
    'identity.title': 'గుర్తింపు ధృవీకరణ',
    'identity.section': 'గుర్తింపు ధృవీకరణ (IDENTITY VERIFICATION)',
    'identity.status': 'గుర్తింపు స్థితి',
    'identity.availableSources': 'అందుబాటులో ఉన్న మూలాలు',
    'identity.source': 'ధృవీకరణ మూలం',
    'identity.matchStatus': 'సరిపోలిన స్థితి',
    'identity.timestamp': 'ధృవీకరించిన సమయం',
    'identity.maskedAadhaar': 'మాస్క్ చేయబడిన ఆధార్ సంఖ్య',
    'identity.documentType': 'పత్రం రకం',
    'identity.issuingAuthority': 'జారీ చేసిన అధికారం',
    'identity.demoName': 'డెమో పేరు',
    'identity.verifiedBadge': 'గుర్తింపు ధృవీకరించబడింది ✓',
    'identity.confirmedMatch': 'ధృవీకరించబడింది (Confirmed)',
    'identity.notVerified': 'ధృవీకరించబడలేదు',
    'identity.pending': 'ధృవీకరణ పెండింగ్‌లో ఉంది',
    'identity.verified': 'ధృవీకరించబడింది',
    'identity.demoNotice': 'డెమో ప్రయోజనాల కోసం రూపొందించిన కల్పిత డేటా.',

    // Statuses
    'status.verified': 'ధృవీకరించబడింది',
    'status.notVerified': 'ధృవీకరించబడలేదు',
    'status.pending': 'పెండింగ్‌లో ఉంది',
    'status.verificationPending': 'ధృవీకరణ పెండింగ్‌లో ఉంది',
    'status.complete': 'పూర్తయింది',
    'status.incomplete': 'అసంపూర్ణం',
    'status.high': 'అధిక',
    'status.medium': 'మధ్యస్థం',
    'status.low': 'తక్కువ',
    'status.critical': 'తీవ్రమైన',
    'status.active': 'క్రియాశీలకం',
    'status.closed': 'ముగిసింది',
    'status.keyNode': 'ప్రధాన అనుమానితుడు',

    // AI Messages
    'ai.loopDetected': 'సంభావ్య దర్యాప్తు లూప్ కనుగొనబడింది. మరొక కోణాన్ని పరిశీలించండి.',
    'ai.progressNormal': 'కొత్త సాక్ష్యాలు మరియు ఆధాలతో దర్యాప్తు పురోగమిస్తోంది.',
    'ai.moderateStagnation': 'నిరంతర విచారణలలో మధ్యస్థ స్తబ్దత గుర్తించబడింది.',
    'ai.recommendation': 'డిజిటల్ సాక్ష్యాలు, బ్యాంక్ లావాదేవీలు లేదా ప్రత్యామ్నాయ సాక్షుల వాంగ్మూలాలను పరిశీలించండి.',
    'ai.disclaimer': 'ఏఐ సహాయక దర్యాప్తు సాధనం. దర్యాప్తు అధికారిదే పూర్తి కార్యాచరణ అధికారం.',

    // Common UI Labels
    'app.title': 'పోలీస్ ఇంటెలిజెన్స్ టెర్మినల్',
    'app.subtitle': 'కేంద్ర చట్ట అమలు నెట్‌వర్క్',
    'app.official': 'అధికారిక పోలీసు రికార్డు',
  },

  ml: {
    // Navigation
    'nav.dashboard': 'ഡാഷ്‌ബോർഡ്',
    'nav.cases': 'കേസുകൾ',
    'nav.suspects': 'പ്രതികൾ',
    'nav.evidence': 'തെളിവുകൾ',
    'nav.network': 'കണക്ഷൻ ഭൂപടം',
    'nav.compare': 'കേസ് താരതമ്യം',
    'nav.secretRoom': 'സീക്രട്ട് റൂം',
    'nav.aiAssistant': 'എഐ അസിസ്റ്റന്റ്',
    'nav.reports': 'റിപ്പോർട്ടുകൾ',
    'nav.notifications': 'അറിയിപ്പുകൾ',
    'nav.profile': 'പ്രൊഫൈൽ',
    'nav.settings': 'ക്രമീകരണങ്ങൾ',

    // Case Interface
    'case.details': 'കേസ് വിവരങ്ങൾ',
    'case.overview': 'കേസ് അവലോകനം',
    'case.fir': 'പ്രഥമ വിവര റിപ്പോർട്ട് (FIR)',
    'case.firNumber': 'എഫ്.ഐ.ആർ നമ്പർ',
    'case.suspects': 'പ്രതികൾ',
    'case.evidence': 'തെളിവുകളും സിസിടിവിയും',
    'case.blindspots': 'ബ്ലൈൻഡ് സ്പോട്ട് വിശകലനം',
    'case.missingInfo': 'വിട്ടുപോയ വിവരങ്ങൾ',
    'case.deadEnd': 'ഡെഡ് എൻഡ് മീറ്റർ',
    'case.investigationMomentum': 'അന്വേഷണ വേഗത',
    'case.investigationLoop': 'അന്വേഷണ ലൂപ്പ്',
    'case.connections': 'ബന്ധങ്ങൾ',
    'case.timeline': 'ടൈംലൈൻ',
    'case.aiAnalysis': 'എഐ വിശകലനം',
    'case.relatedCases': 'അനുബന്ധ കേസുകൾ',

    // Meters
    'meter.missingInfo': 'വിട്ടുപോയ വിവര മീറ്റർ',
    'meter.deadEnd': 'ഡെഡ് എൻഡ് / ലൂപ്പ് ഡിറ്റക്ടർ',
    'meter.completeness': 'കേസ് പൂർണ്ണത',
    'meter.missing': 'വിട്ടുപോയ വിവരങ്ങൾ',
    'meter.investigationMomentum': 'അന്വേഷണ വേഗത',
    'meter.loopRisk': 'ഡെഡ് എൻഡ് സാധ്യത',
    'meter.momentumScore': 'വേഗതാ സ്കോർ',
    'meter.gapsRemaining': 'ബാക്കി നിൽക്കുന്ന വിടവുകൾ',
    'meter.verifiedCheckpoints': 'രേഖപ്പെടുത്തിയ തെളിവുകൾ',
    'meter.missingCheckpoints': 'വിട്ടുപോയ തെളിവുകൾ',

    // Actions
    'action.view': 'കാണുക',
    'action.download': 'ഡൗൺലോഡ്',
    'action.upload': 'അപ്‌ലോഡ്',
    'action.search': 'തിരയുക',
    'action.verify': 'സ്ഥിരീകരിക്കുക',
    'action.save': 'സേവ് ചെയ്യുക',
    'action.edit': 'എഡിറ്റ് ചെയ്യുക',
    'action.delete': 'ഇല്ലാതാക്കുക',
    'action.back': 'പിന്നോട്ട്',
    'action.next': 'അടുത്തത്',
    'action.close': 'അടയ്ക്കുക',
    'action.submit': 'സമർപ്പിക്കുക',
    'action.refresh': 'പുതുക്കുക',
    'action.viewFir': 'എഫ്.ഐ.ആർ കാണുക',
    'action.downloadFir': 'എഫ്.ഐ.ആർ ഡൗൺലോഡ്',
    'action.verifyAadhaar': 'ആധാർ വഴി സ്ഥിരീകരിക്കുക',
    'action.connectDigiLocker': 'ഡിജിലോക്കർ വഴി സ്ഥിരീകരിക്കുക',
    'action.viewCCTV': 'സിസിടിവി ദൃശ്യം കാണുക',
    'action.backToCases': 'കേസുകളിലേക്ക് മടങ്ങുക',
    'action.exportPdf': 'ഔദ്യോഗിക PDF എക്സ്പോർട്ട്',

    // Identity Verification
    'identity.title': 'തിരിച്ചറിയൽ സ്ഥിരീകരണം',
    'identity.section': 'തിരിച്ചറിയൽ സ്ഥിരീകരണം (IDENTITY VERIFICATION)',
    'identity.status': 'തിരിച്ചറിയൽ നില',
    'identity.availableSources': 'ലഭ്യമായ ഉറവിടങ്ങൾ',
    'identity.source': 'സ്ഥിരീകരണ സ്രോതസ്സ്',
    'identity.matchStatus': 'പൊരുത്തപ്പെടൽ നില',
    'identity.timestamp': 'സ്ഥിരീകരിച്ച സമയം',
    'identity.maskedAadhaar': 'മാസ്ക് ചെയ്ത ആധാർ നമ്പർ',
    'identity.documentType': 'രേഖാ തരം',
    'identity.issuingAuthority': 'നൽകിയ അതോറിറ്റി',
    'identity.demoName': 'ഡെമോ പേര്',
    'identity.verifiedBadge': 'തിരിച്ചറിയൽ സ്ഥിരീകരിച്ചു ✓',
    'identity.confirmedMatch': 'സ്ഥിരീകരിച്ചു (Confirmed)',
    'identity.notVerified': 'സ്ഥിരീകരിച്ചിട്ടില്ല',
    'identity.pending': 'സ്ഥിരീകരണം ബാക്കി',
    'identity.verified': 'സ്ഥിരീകരിച്ചു',
    'identity.demoNotice': 'ഡെമോ ആവശ്യങ്ങൾക്കുള്ള സാങ്കൽപ്പിക ഡാറ്റ.',

    // Statuses
    'status.verified': 'സ്ഥിരീകരിച്ചു',
    'status.notVerified': 'സ്ഥിരീകരിച്ചിട്ടില്ല',
    'status.pending': 'ബാക്കി',
    'status.verificationPending': 'സ്ഥിരീകരണം ബാക്കി',
    'status.complete': 'പൂർത്തിയായി',
    'status.incomplete': 'അപൂർണ്ണം',
    'status.high': 'ഉയർന്ന',
    'status.medium': 'ഇടത്തരം',
    'status.low': 'കുറഞ്ഞ',
    'status.critical': 'നിർണായകം',
    'status.active': 'സജീവം',
    'status.closed': 'അവസാനിച്ചു',
    'status.keyNode': 'പ്രധാന പ്രതി',

    // AI Messages
    'ai.loopDetected': 'അന്വേഷണത്തിൽ ലൂപ്പ് സാധ്യത കണ്ടെത്തി. മറ്റൊരു ദിശയിൽ അന്വേഷിക്കുന്നത് പരിഗണിക്കുക.',
    'ai.progressNormal': 'പുതിയ തെളിവുകളോടെ അന്വേഷണം ശരിയായ ദിശയിൽ മുന്നേറുന്നു.',
    'ai.moderateStagnation': 'തുടർ ചോദ്യം ചെയ്യലുകളിൽ മിതമായ സ്തംഭനാവസ്ഥ കണ്ടെത്തി.',
    'ai.recommendation': 'ഡിജിറ്റൽ തെളിവുകൾ, ബാങ്ക് ഇടപാടുകൾ അല്ലെങ്കിൽ പുതിയ സാക്ഷിമൊഴികൾ പരിശോധിക്കുക.',
    'ai.disclaimer': 'എഐ സഹായത്തോടെയുള്ള അന്വേഷണ സഹായി. അന്വേഷണ ഉദ്യോഗസ്ഥന് പൂർണ്ണ നിയന്ത്രണമുണ്ട്.',

    // Common UI Labels
    'app.title': 'പോലീസ് ഇന്റലിജൻസ് ടെർമിനൽ',
    'app.subtitle': 'സെൻട്രൽ ലോ എൻഫോഴ്സ്മെന്റ് നെറ്റ്‌വർക്ക്',
    'app.official': 'ഔദ്യോഗിക പോലീസ് റെക്കോർഡ്',
  },

  mr: {
    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.cases': 'गुन्हे प्रकरणे',
    'nav.suspects': 'संशयित व्यक्ती',
    'nav.evidence': 'पुरावे व साक्ष',
    'nav.network': 'कनेक्शन नकाशा',
    'nav.compare': 'तुलना करा',
    'nav.secretRoom': 'सिक्रेट रूम',
    'nav.aiAssistant': 'एआय सहाय्यक',
    'nav.reports': 'अहवाल',
    'nav.notifications': 'सूचना',
    'nav.profile': 'प्रोफाइल',
    'nav.settings': 'सेटिंग्ज',

    // Case Interface
    'case.details': 'केस तपशील',
    'case.overview': 'केस आढावा',
    'case.fir': 'प्रथम खबरी अहवाल (FIR)',
    'case.firNumber': 'एफआयआर क्रमांक',
    'case.suspects': 'संशयित व्यक्ती',
    'case.evidence': 'पुरावे आणि सीसीटीव्ही',
    'case.blindspots': 'ब्लाइंड स्पॉट विश्लेषण',
    'case.missingInfo': 'अपूर्ण माहिती',
    'case.deadEnd': 'डेड-एंड मीटर',
    'case.investigationMomentum': 'तपास गती',
    'case.investigationLoop': 'तपास लूप',
    'case.connections': 'संबंध व नेटवर्क',
    'case.timeline': 'घटनाक्रम',
    'case.aiAnalysis': 'एआय विश्लेषण',
    'case.relatedCases': 'संबंधित गुन्हे',

    // Meters
    'meter.missingInfo': 'अपूर्ण माहिती मीटर',
    'meter.deadEnd': 'डेड-एंड / लूप डिटेक्टर',
    'meter.completeness': 'तपास पूर्णता',
    'meter.missing': 'अपूर्ण माहिती',
    'meter.investigationMomentum': 'तपास गती',
    'meter.loopRisk': 'डेड-एंड धोका',
    'meter.momentumScore': 'गती स्कोर',
    'meter.gapsRemaining': 'शिल्लक त्रुटी',
    'meter.verifiedCheckpoints': 'पडताळलेले पुरावे',
    'meter.missingCheckpoints': 'अनुपलब्ध पुरावे',

    // Actions
    'action.view': 'पहा',
    'action.download': 'डाउनलोड',
    'action.upload': 'अपलोड',
    'action.search': 'शोधा',
    'action.verify': 'पडताळा',
    'action.save': 'जतन करा',
    'action.edit': 'संपादन करा',
    'action.delete': 'हटवा',
    'action.back': 'मागे',
    'action.next': 'पुढे',
    'action.close': 'बंद करा',
    'action.submit': 'सादर करा',
    'action.refresh': 'रिफ्रेश',
    'action.viewFir': 'एफआयआर पहा',
    'action.downloadFir': 'एफआयआर डाउनलोड करा',
    'action.verifyAadhaar': 'आधारद्वारे पडताळणी करा',
    'action.connectDigiLocker': 'डिजिलॉकरद्वारे पडताळणी करा',
    'action.viewCCTV': 'सीसीटीव्ही फुटेज पहा',
    'action.backToCases': 'केसेसवर परत जा',
    'action.exportPdf': 'अधिकृत PDF निर्यात करा',

    // Identity Verification
    'identity.title': 'ओळख पडताळणी',
    'identity.section': 'ओळख पडताळणी (IDENTITY VERIFICATION)',
    'identity.status': 'ओळख स्थिती',
    'identity.availableSources': 'उपलब्ध स्रोत',
    'identity.source': 'पडताळणी स्रोत',
    'identity.matchStatus': 'जुळणी स्थिती',
    'identity.timestamp': 'पडताळणी वेळ',
    'identity.maskedAadhaar': 'मास्क्ड आधार क्रमांक',
    'identity.documentType': 'दस्तऐवज प्रकार',
    'identity.issuingAuthority': 'जारी करणारी संस्था',
    'identity.demoName': 'डेमो नाव',
    'identity.verifiedBadge': 'ओळख पडताळणी पूर्ण ✓',
    'identity.confirmedMatch': 'पुष्टी झाली (Confirmed)',
    'identity.notVerified': 'पडताळलेले नाही',
    'identity.pending': 'पडताळणी प्रलंबित',
    'identity.verified': 'पडताळणी पूर्ण',
    'identity.demoNotice': 'डेमोसाठी काल्पनिक माहिती वापरण्यात आली आहे.',

    // Statuses
    'status.verified': 'पडताळणी पूर्ण',
    'status.notVerified': 'पडताळलेले नाही',
    'status.pending': 'प्रलंबित',
    'status.verificationPending': 'पडताळणी प्रलंबित',
    'status.complete': 'पूर्ण',
    'status.incomplete': 'अपूर्ण',
    'status.high': 'उच्च',
    'status.medium': 'मध्यम',
    'status.low': 'कमी',
    'status.critical': 'गंभीर',
    'status.active': 'सक्रिय',
    'status.closed': 'बंद',
    'status.keyNode': 'मुख्य संशयित',

    // AI Messages
    'ai.loopDetected': 'संभाव्य तपास पुनरावृत्ती (लूप) आढळली. इतर कोनातून तपास करण्याचा विचार करा.',
    'ai.progressNormal': 'तपास नव्या पुराव्यांसह वेगाने पुढे सरकत आहे.',
    'ai.moderateStagnation': 'संशयितांच्या वारंवार चौकशीत मध्यम स्तब्धता आढळली.',
    'ai.recommendation': 'डिजिटल पुरावे, बँक व्यवहार किंवा इतर साक्षीदारांच्या जबानीचा तपास करा.',
    'ai.disclaimer': 'एआय-सक्षम तपास सहाय्य. तपास अधिकाऱ्याकडेच संपूर्ण नियंत्रण राहील.',

    // Common UI Labels
    'app.title': 'पोलीस गुप्तचर टर्मिनल',
    'app.subtitle': 'केंद्रीय कायदा अंमलबजावणी नेटवर्क',
    'app.official': 'अधिकृत पोलीस नोंद',
  },
};

// Map of common English plain texts to translation keys for automatic seamless translation
export const PHRASE_TO_KEY: Record<string, string> = {
  // Nav
  'Dashboard': 'nav.dashboard',
  'Cases': 'nav.cases',
  'All Cases': 'nav.cases',
  'Suspects': 'nav.suspects',
  'Evidence': 'nav.evidence',
  'Digital Evidence Locker': 'nav.evidence',
  'Connection Map': 'nav.network',
  'Crime Graph & Network': 'nav.network',
  'Compare Cases': 'nav.compare',
  'Secret Room': 'nav.secretRoom',
  'AI Assistant': 'nav.aiAssistant',
  'AI Case Assistant': 'nav.aiAssistant',
  'Reports': 'nav.reports',
  'Official Court Reports': 'nav.reports',
  'Notifications': 'nav.notifications',
  'Profile': 'nav.profile',
  'Settings': 'nav.settings',
  'System Settings': 'nav.settings',

  // Case Details
  'Case Details': 'case.details',
  'Case Overview': 'case.overview',
  'Overview': 'case.overview',
  'FIR': 'case.fir',
  'FIR (First Information Report)': 'case.fir',
  'FIR Number': 'case.firNumber',
  'Evidence & CCTV': 'case.evidence',
  'CCTV & Video Forensics': 'case.evidence',
  'Blind Spot Analysis': 'case.blindspots',
  'Blind Spots': 'case.blindspots',
  'Blind Spots & Information Gaps': 'case.blindspots',
  'Missing Information': 'case.missingInfo',
  'Missing Information Meter': 'case.missingInfo',
  'Dead End Meter': 'case.deadEnd',
  'Investigation Momentum': 'case.investigationMomentum',
  'Investigation Loop': 'case.investigationLoop',
  'Investigation Loop Index': 'case.investigationLoop',
  'Connections': 'case.connections',
  'Timeline': 'case.timeline',
  'AI Analysis': 'case.aiAnalysis',
  'Related Cases': 'case.relatedCases',

  // Actions
  'Create New Case': 'action.createCase',
  'Create Case': 'action.createCase',
  'Search by suspect, vehicle, case ID...': 'search.placeholder',

  // Actions
  'View': 'action.view',
  'Download': 'action.download',
  'Upload': 'action.upload',
  'Search': 'action.search',
  'Verify': 'action.verify',
  'Save': 'action.save',
  'Edit': 'action.edit',
  'Delete': 'action.delete',
  'Back': 'action.back',
  'Next': 'action.next',
  'Close': 'action.close',
  'Submit': 'action.submit',
  'Refresh': 'action.refresh',
  'View FIR': 'action.viewFir',
  'Download FIR': 'action.downloadFir',
  'Verify with Aadhaar': 'action.verifyAadhaar',
  'Verify using Aadhaar': 'action.verifyAadhaar',
  'Verify with DigiLocker': 'action.connectDigiLocker',
  'Connect DigiLocker': 'action.connectDigiLocker',
  'View CCTV Footage': 'action.viewCCTV',
  'Back to Cases': 'action.backToCases',
  'Export Official PDF': 'action.exportPdf',

  // Identity
  'Identity Verification': 'identity.title',
  'IDENTITY VERIFICATION': 'identity.section',
  'Identity Status': 'identity.status',
  'Available Sources': 'identity.availableSources',
  'Verification Source': 'identity.source',
  'Identity Match': 'identity.matchStatus',
  'Verification Timestamp': 'identity.timestamp',
  'Identity Verified ✓': 'identity.verifiedBadge',
  'Verified ✓': 'identity.verifiedBadge',
  'Confirmed': 'identity.confirmedMatch',
  'Masked Aadhaar': 'identity.maskedAadhaar',
  'Document Type': 'identity.documentType',
  'Issuing Authority': 'identity.issuingAuthority',

  // Statuses
  'Verified': 'status.verified',
  'Not Verified': 'status.notVerified',
  'Pending': 'status.pending',
  'Verification Pending': 'status.verificationPending',
  'Complete': 'status.complete',
  'Incomplete': 'status.incomplete',
  'High': 'status.high',
  'Medium': 'status.medium',
  'Low': 'status.low',
  'Critical': 'status.critical',
  'Active': 'status.active',
  'Closed': 'status.closed',
  'Key Node': 'status.keyNode',

  // AI Messages
  'Potential investigation loop detected. Consider exploring another angle.': 'ai.loopDetected',
  'AI-assisted investigative aid. Investigator remains in complete operational authority.': 'ai.disclaimer',

  // Common UI
  'Police Intelligence Terminal': 'app.title',
  'Central Law-Enforcement Network': 'app.subtitle',
  'Official Police Record': 'app.official',
};

export const CASE_TITLES_LOCALIZED: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'Organized Financial Crime': 'Organized Financial Crime',
    'Coordinated Theft Network': 'Coordinated Theft Network',
    'Cyber Fraud Network': 'Cyber Fraud Network',
    'Illegal Hawala Syndicate': 'Illegal Hawala Syndicate',
    'Cross-Border Telecom Intercept': 'Cross-Border Telecom Intercept',
    'Inter-State Cargo Hijacking': 'Inter-State Cargo Hijacking',
    'Cryptocurrency Ransom Launder': 'Cryptocurrency Ransom Launder',
    'High-Value Identity Theft Cluster': 'High-Value Identity Theft Cluster',
    'Port Customs Smuggling Probe': 'Port Customs Smuggling Probe',
    'Extortion & Threat Call Ring': 'Extortion & Threat Call Ring',
    'Unclassified Incident Report': 'Unclassified Incident Report',
  },
  hi: {
    'Organized Financial Crime': 'संगठित वित्तीय अपराध',
    'Coordinated Theft Network': 'समन्वित चोरी नेटवर्क',
    'Cyber Fraud Network': 'साइबर धोखाधड़ी नेटवर्क',
    'Illegal Hawala Syndicate': 'अवैध हवाला सिंडिकेट',
    'Cross-Border Telecom Intercept': 'सीमा पार दूरसंचार अवरोधन',
    'Inter-State Cargo Hijacking': 'अंतर-राज्यीय कार्गो अपहरण',
    'Cryptocurrency Ransom Launder': 'क्रिप्टोकरेंसी फिरौती शोधन',
    'High-Value Identity Theft Cluster': 'उच्च-मूल्य पहचान चोरी समूह',
    'Port Customs Smuggling Probe': 'बंदरगाह सीमा शुल्क तस्करी जांच',
    'Extortion & Threat Call Ring': 'जबरन वसूली एवं धमकी कॉल गिरोह',
    'Unclassified Incident Report': 'अवर्गीकृत घटना रिपोर्ट',
  },
  kn: {
    'Organized Financial Crime': 'ಸಂಘಟಿತ ಹಣಕಾಸು ಅಪರಾಧ',
    'Coordinated Theft Network': 'ಸಂಯೋಜಿತ ಕಳ್ಳತನ ಜಾಲ',
    'Cyber Fraud Network': 'ಸೈಬರ್ ವಂಚನೆ ಜಾಲ',
    'Illegal Hawala Syndicate': 'ಕಾನೂನುಬಾಹಿರ ಹವಾಲಾ ಸಿಂಡಿಕೇಟ್',
    'Cross-Border Telecom Intercept': 'ಗಡಿಯಾಚೆಗಿನ ದೂರಸಂಪರ್ಕ ಪ್ರತಿಬಂಧ',
    'Inter-State Cargo Hijacking': 'ಅಂತರ-ರಾಜ್ಯ ಸರಕು ಅಪಹರಣ',
    'Cryptocurrency Ransom Launder': 'ಕ್ರಿಪ್ಟೋಕರೆನ್ಸಿ ಸುಲಿಗೆ ಮನಿ ಲಾಂಡರಿಂಗ್',
    'High-Value Identity Theft Cluster': 'ಹೆಚ್ಚಿನ ಮೌಲ್ಯದ ಗುರುತು ಕಳ್ಳತನ ಗುಂಪು',
    'Port Customs Smuggling Probe': 'ಬಂದರು ಕಸ್ಟಮ್ಸ್ ಕಳ್ಳಸಾಗಣೆ ತನಿಖೆ',
    'Extortion & Threat Call Ring': 'ಸುಲಿಗೆ ಮತ್ತು ಬೆದರಿಕೆ ಕರೆ ಗ್ಯಾಂಗ್',
    'Unclassified Incident Report': 'ವರ್ಗೀಕರಿಸದ ಘಟನೆ ವರದಿ',
  },
  ta: {
    'Organized Financial Crime': 'ஒழுங்கமைக்கப்பட்ட நிதி குற்றம்',
    'Coordinated Theft Network': 'ஒருங்கிணைந்த திருட்டு வலையமைப்பு',
    'Cyber Fraud Network': 'సైబర్ மோசடி வலையமைப்பு',
    'Illegal Hawala Syndicate': 'சட்டவிரோத ஹவாலா கூட்டமைப்பு',
    'Cross-Border Telecom Intercept': 'எல்லை தாண்டிய தொலைத்தொடர்பு இடைமறிப்பு',
    'Inter-State Cargo Hijacking': 'மாநிலங்களுக்கு இடையேயான சரக்கு கடத்தல்',
    'Cryptocurrency Ransom Launder': 'கிரிப்டோகரன்சி மீட்கும் தொகை சலவை',
    'High-Value Identity Theft Cluster': 'உயர் மதிப்பு அடையாள திருட்டு குழுமம்',
    'Port Customs Smuggling Probe': 'துறைமுக சுங்க கடத்தல் விசாரணை',
    'Extortion & Threat Call Ring': 'பறிமுதல் மற்றும் அச்சுறுத்தல் அழைப்பு வளையம்',
    'Unclassified Incident Report': 'வகைப்படுத்தப்படாத சம்பவ அறிக்கை',
  },
  te: {
    'Organized Financial Crime': 'వ్యవస్థీకృత ఆర్థిక నేరం',
    'Coordinated Theft Network': 'సమన్వయ దొంగతన నెట్‌వర్క్',
    'Cyber Fraud Network': 'సైబర్ మోసాల నెట్‌వర్క్',
    'Illegal Hawala Syndicate': 'చట్టవిరుద్ధ హవాలా సిండికేట్',
    'Cross-Border Telecom Intercept': 'సరిహద్దు టెలికాం నిరోధం',
    'Inter-State Cargo Hijacking': 'అంతర్-రాష్ట్ర సరుకు హైజాకింగ్',
    'Cryptocurrency Ransom Launder': 'క్రిప్టోకరెన్సీ రన్సమ్ లాండరింగ్',
    'High-Value Identity Theft Cluster': 'అధిక-విలువ గుర్తింపు దొంగతనం క్లస్టర్',
    'Port Customs Smuggling Probe': 'పోర్ట్ కస్టమ్స్ స్మగ్లింగ్ దర్యాప్తు',
    'Extortion & Threat Call Ring': 'దోపిడీ మరియు బెదిరింపు కాల్ రింగ్',
    'Unclassified Incident Report': 'వర్గీకరించని సంఘటన నివేదిక',
  },
  ml: {
    'Organized Financial Crime': 'സംഘടിത സാമ്പത്തിക കുറ്റകൃത്യം',
    'Coordinated Theft Network': 'ഏകോപിത മോഷണ ശൃംഖല',
    'Cyber Fraud Network': 'സൈബർ തട്ടിപ്പ് ശൃംഖല',
    'Illegal Hawala Syndicate': 'നിയമവിരുദ്ധ ഹവാല സിൻഡിക്കേറ്റ്',
    'Cross-Border Telecom Intercept': 'അതിർത്തി കടന്നുള്ള ടെലികോം തടസ്സപ്പെടുത്തൽ',
    'Inter-State Cargo Hijacking': 'അന്തർസംസ്ഥാന ചരക്ക് തട്ടിക്കൊണ്ടുപോകൽ',
    'Cryptocurrency Ransom Launder': 'ക്രിപ്‌റ്റോകറൻസി മോചനദ്രവ്യ വെളുപ്പിക്കൽ',
    'High-Value Identity Theft Cluster': 'ഉയർന്ന മൂല്യമുള്ള ഐഡന്റിറ്റി മോഷണ ക്ലസ്റ്റർ',
    'Port Customs Smuggling Probe': 'പോർട്ട് കസ്റ്റംസ് കള്ളക്കടത്ത് അന്വേഷണം',
    'Extortion & Threat Call Ring': 'ഭീഷണിപ്പെടുത്തി പണം തട്ടൽ റിംഗ്',
    'Unclassified Incident Report': 'വർഗ്ഗീകരിക്കാത്ത സംഭവ റിപ്പോർട്ട്',
  },
  mr: {
    'Organized Financial Crime': 'संघटित आर्थिक गुन्हेगारी',
    'Coordinated Theft Network': 'समन्वित चोरीचे जाळे',
    'Cyber Fraud Network': 'सायबर फसवणूक नेटवर्क',
    'Illegal Hawala Syndicate': 'बेकायदेशीर हवाला सिंडिकेट',
    'Cross-Border Telecom Intercept': 'सीमापार दूरसंचार अडवणूक',
    'Inter-State Cargo Hijacking': 'आंतरराज्यीय मालवाहू हायजॅकिंग',
    'Cryptocurrency Ransom Launder': 'क्रिप्टोकरन्सी खंडणी मनी लाँडरिंग',
    'High-Value Identity Theft Cluster': 'उच्च-मूल्य ओळख चोरी क्लस्टर',
    'Port Customs Smuggling Probe': 'पोर्ट सीमाशुल्क तस्करी तपास',
    'Extortion & Threat Call Ring': 'खंडणी आणि धमकी कॉल रिंग',
    'Unclassified Incident Report': 'अवर्गीकृत घटना अहवाल',
  },
};

export const getTranslation = (lang: SupportedLanguage, keyOrText: string): string => {
  if (!keyOrText) return '';

  const trimmed = keyOrText.trim();

  // Helper for lookup of an atomic phrase
  const lookupAtomic = (phrase: string): string | null => {
    if (!phrase) return null;
    const clean = phrase.trim();
    if (!clean) return null;

    // 1. Direct check in localized case titles
    if (CASE_TITLES_LOCALIZED[lang]?.[clean]) {
      return CASE_TITLES_LOCALIZED[lang][clean];
    }

    // 2. Check extended direct phrase in target language
    if (EXTENDED_TRANSLATIONS[lang]?.[clean]) {
      return EXTENDED_TRANSLATIONS[lang][clean];
    }

    // 3. Direct key lookup in TRANSLATIONS (e.g. 'nav.dashboard')
    if (TRANSLATIONS[lang]?.[clean]) {
      return TRANSLATIONS[lang][clean];
    }

    // 4. Phrase lookup via PHRASE_TO_KEY
    const mappedKey = PHRASE_TO_KEY[clean];
    if (mappedKey && TRANSLATIONS[lang]?.[mappedKey]) {
      return TRANSLATIONS[lang][mappedKey];
    }

    return null;
  };

  // Direct lookup first
  const directMatch = lookupAtomic(trimmed);
  if (directMatch) return directMatch;

  // Handle bracket wrap: e.g. "[ CREATE CASE ]" -> "[ " + translated + " ]"
  const bracketMatch = trimmed.match(/^(\[\s*)(.*?)(\s*\])$/);
  if (bracketMatch) {
    const innerTranslated = lookupAtomic(bracketMatch[2]);
    if (innerTranslated) {
      return `${bracketMatch[1]}${innerTranslated}${bracketMatch[3]}`;
    }
  }

  // Handle emoji or status bullet prefix: e.g. "🔴 Critical" -> "🔴 " + translated
  const emojiMatch = trimmed.match(/^([🔴🟠🟡🟢✓⚠•\+\*#]+\s*)(.*)$/);
  if (emojiMatch) {
    const innerTranslated = lookupAtomic(emojiMatch[2]);
    if (innerTranslated) {
      return `${emojiMatch[1]}${innerTranslated}`;
    }
  }

  // Handle trailing asterisk: e.g. "Case Title *" -> translated + " *"
  const starMatch = trimmed.match(/^(.*?)\s*(\*+)$/);
  if (starMatch) {
    const innerTranslated = lookupAtomic(starMatch[1]);
    if (innerTranslated) {
      return `${innerTranslated} ${starMatch[2]}`;
    }
  }

  // Handle trailing colon: e.g. "Quick Jurisdiction Presets:" -> translated + ":"
  const colonMatch = trimmed.match(/^(.*?)\s*(:+)$/);
  if (colonMatch) {
    const innerTranslated = lookupAtomic(colonMatch[1]);
    if (innerTranslated) {
      return `${innerTranslated}${colonMatch[2]}`;
    }
  }

  // Handle common key-value prefixes: "FIR: ...", "Police ID: ...", "Assigned Team: ...", "Initiated on: ..."
  const kvMatch = trimmed.match(/^(FIR|Police ID|Assigned Team|Initiated on|Default|Category|Priority|Status|City|State|District):\s*(.*)$/i);
  if (kvMatch) {
    const prefixTranslated = lookupAtomic(kvMatch[1]) || kvMatch[1];
    return `${prefixTranslated}: ${kvMatch[2]}`;
  }

  // Handle auto-fill code pattern: "Auto-Fill Code (CX-2026-9901)"
  const autoFillMatch = trimmed.match(/^(Auto-Fill Code)\s*(\(.*?\))$/i);
  if (autoFillMatch) {
    const prefixTranslated = lookupAtomic(autoFillMatch[1]) || autoFillMatch[1];
    return `${prefixTranslated} ${autoFillMatch[2]}`;
  }

  // Normalized fallback (remove leading/trailing symbols, colons, exclamations)
  const normalized = trimmed
    .replace(/^#\s*/, '')
    .replace(/^[✓⚠•\+\*🔴🟠🟡🟢]\s*/, '')
    .replace(/[:!]$/, '')
    .trim();

  const normMatch = lookupAtomic(normalized);
  if (normMatch) return normMatch;

  // 5. Fallback to English in extended or key map
  if (EXTENDED_TRANSLATIONS['en']?.[trimmed]) {
    return EXTENDED_TRANSLATIONS['en'][trimmed];
  }
  if (EXTENDED_TRANSLATIONS['en']?.[normalized]) {
    return EXTENDED_TRANSLATIONS['en'][normalized];
  }
  if (TRANSLATIONS['en']?.[keyOrText]) {
    return TRANSLATIONS['en'][keyOrText];
  }
  const mappedKey = PHRASE_TO_KEY[trimmed] || PHRASE_TO_KEY[normalized];
  if (mappedKey && TRANSLATIONS['en']?.[mappedKey]) {
    return TRANSLATIONS['en'][mappedKey];
  }

  // 6. Return the original string (preserves FIR numbers, Case IDs, suspect names, timestamps, etc.)
  return keyOrText;
};
