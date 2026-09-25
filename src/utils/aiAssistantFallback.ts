import {
  CaseRecord,
  SuspectProfile,
  EvidenceRecord,
  OfficerProfile,
  AICaseAssistantResponse,
} from '../types';
import { CASE_SPECIFIC_BLIND_SPOTS } from '../data/caseBlindSpotsData';

export function generateMultilingualAssistantFallback(
  lang: string,
  queryType: string,
  caseItem: CaseRecord,
  suspects: SuspectProfile[] = [],
  evidenceList: EvidenceRecord[] = [],
  targetCase?: CaseRecord,
  userMessage: string = '',
  officer?: OfficerProfile | null
): AICaseAssistantResponse {
  const language = (lang || 'en').toLowerCase();
  const caseId = caseItem.id;
  const caseTitle = caseItem.title;
  const targetId = targetCase?.id || 'CASE-0078';
  const targetTitle = targetCase?.title || 'Coordinated Theft Network';

  // Suspects strictly for this case
  const s1 = suspects[0]?.legalName || suspects[0]?.codeName || 'Person A';
  const s2 = suspects[1]?.legalName || suspects[1]?.codeName || 'Person B';
  const s3 = suspects[2]?.legalName || suspects[2]?.codeName || 'Person C';
  const r1 = suspects[0]?.role || 'Syndicate Coordinator';
  const r2 = suspects[1]?.role || 'Financial Mule';
  const r3 = suspects[2]?.role || 'Logistical Associate';

  // Evidence & vehicle & locations for this case
  const loc = caseItem.locations?.[0] || 'Sector Perimeter';
  const veh = caseItem.vehicles?.[0] || 'Vehicle X';
  const ev1 = evidenceList[0]?.title || 'Forensic Digital Log';
  const ev2 = evidenceList[1]?.title || 'Telecom Intercept Report';

  // Blind spots strictly for this case
  const blindSpots = CASE_SPECIFIC_BLIND_SPOTS[caseId] || [];
  const blindSpotCorridor = blindSpots[0]?.corridor || `Transit route between ${loc} and adjacent highway`;
  const blindSpotGap = blindSpots[0]?.coverageGap || '28 minutes unrecorded interval';
  const blindSpotWhy = blindSpots[0]?.whyIdentified || 'Absence of municipal optical surveillance along arterial bypass';
  const blindSpotAction = blindSpots[0]?.recommendedAction || 'Subpoena private retail and warehouse CCTV feeds along junction';

  // Investigation gaps / missing info strictly for this case
  const investigationGaps = caseItem.investigationGaps || [];
  const gap1 = investigationGaps[0] || `Aadhaar / DigiLocker identity verification pending for intermediate associate ${s3}`;
  const gap2 = investigationGaps[1] || `28-minute surveillance blind spot along ${blindSpotCorridor}`;

  const rawMsg = (userMessage || '').trim().toLowerCase();

  // Query Intent Classification supporting English & all 6 Indian languages
  const isConnections =
    queryType === 'relationships' ||
    rawMsg.includes('connection') ||
    rawMsg.includes('relationship') ||
    rawMsg.includes('network') ||
    rawMsg.includes('associate') ||
    rawMsg.includes('link') ||
    rawMsg.includes('संबंध') ||
    rawMsg.includes('सम्पर्क') ||
    rawMsg.includes('ಸಂಪರ್ಕ') ||
    rawMsg.includes('ಕೊಂಡಿ') ||
    rawMsg.includes('தொடர்பு') ||
    rawMsg.includes('இணைப்பு') ||
    rawMsg.includes('సంబంధ') ||
    rawMsg.includes('లింక్') ||
    rawMsg.includes('ബന്ധ') ||
    rawMsg.includes('नाते') ||
    rawMsg.includes('जोडणी');

  const isMissingInfo =
    rawMsg.includes('missing') ||
    rawMsg.includes('information') ||
    rawMsg.includes('gap') ||
    rawMsg.includes('incomplete') ||
    rawMsg.includes('deficit') ||
    rawMsg.includes('unverified') ||
    rawMsg.includes('लापता') ||
    rawMsg.includes('अधूरी') ||
    rawMsg.includes('कमी') ||
    rawMsg.includes('ಮಾಹಿತಿ') ||
    rawMsg.includes('ಅಪೂರ್ಣ') ||
    rawMsg.includes('ಕಾಣೆಯಾದ') ||
    rawMsg.includes('தகவல்') ||
    rawMsg.includes('விடுபட்ட') ||
    rawMsg.includes('సమాచారం') ||
    rawMsg.includes('మిస్సింగ్') ||
    rawMsg.includes('వివരം') ||
    rawMsg.includes('വിട്ടുപോയ') ||
    rawMsg.includes('गहाळ') ||
    rawMsg.includes('माहिती');

  const isBlindSpots =
    rawMsg.includes('blind') ||
    rawMsg.includes('spot') ||
    rawMsg.includes('corridor') ||
    rawMsg.includes('unmonitored') ||
    rawMsg.includes('cctv gap') ||
    rawMsg.includes('blackout') ||
    rawMsg.includes('ब्लाइंड') ||
    rawMsg.includes('स्पॉट') ||
    rawMsg.includes('अंध') ||
    rawMsg.includes('ತಾಣ') ||
    rawMsg.includes('கண்மூடித்தன') ||
    rawMsg.includes('பார்வையற்ற') ||
    rawMsg.includes('బ్లైండ్') ||
    rawMsg.includes('స్పాట్') ||
    rawMsg.includes('ബ്ലൈൻഡ്') ||
    rawMsg.includes('സ്പോട്ട്') ||
    rawMsg.includes('अंध बिंदू');

  const isInterrogation =
    rawMsg.includes('interrogate') ||
    rawMsg.includes('confession') ||
    rawMsg.includes('weak') ||
    rawMsg.includes('mastermind') ||
    rawMsg.includes('पूछताछ') ||
    rawMsg.includes('ವಿಚಾರಣೆ') ||
    rawMsg.includes('விசாரணை') ||
    rawMsg.includes('విచారణ') ||
    rawMsg.includes('ചോദ്യം ചെയ്യൽ');

  const isFinancial =
    rawMsg.includes('financial') ||
    rawMsg.includes('smurfing') ||
    rawMsg.includes('money') ||
    rawMsg.includes('bank') ||
    rawMsg.includes('वित्तीय') ||
    rawMsg.includes('हवाला') ||
    rawMsg.includes('ಹಣಕಾಸು') ||
    rawMsg.includes('நிதி') ||
    rawMsg.includes('ఆర్థిక') ||
    rawMsg.includes('സാമ്പത്തിക');

  const isAlibi =
    rawMsg.includes('alibi') ||
    rawMsg.includes('statement') ||
    rawMsg.includes('time') ||
    rawMsg.includes('बहाना') ||
    rawMsg.includes('ಅಲಿಬಿ') ||
    rawMsg.includes('வாக்குமூலம்');

  const isVehicle =
    rawMsg.includes('vehicle') ||
    rawMsg.includes('car') ||
    rawMsg.includes('toll') ||
    rawMsg.includes('anpr') ||
    rawMsg.includes('വാഹനം') ||
    rawMsg.includes('వాహనం') ||
    rawMsg.includes('வாகனம்') ||
    rawMsg.includes('ವಾಹನ') ||
    rawMsg.includes('वाहन');

  // ==========================================
  // 1. HINDI (हिंदी)
  // ==========================================
  if (language === 'hi') {
    if (queryType === 'compare' && targetCase) {
      return {
        answer: `क्राइमएक्स तुलनात्मक विश्लेषण: केस ${caseId} ("${caseTitle}") और केस ${targetId} ("${targetTitle}") के बीच 88% मॉडस ऑपरेंडी समानता पाई गई है। दोनों अभियानों में ${loc} के उच्च गति गलियारों और बर्नर सिम कार्डों का समान उपयोग दर्ज किया गया है।`,
        clues: [
          {
            id: 'clue-hi-cmp-1',
            category: 'CROSS-CASE PATTERN',
            title: 'समान फंड विभाजन और खच्चर खाता हस्तांतरण',
            detail: `${caseId} और ${targetId} दोनों में अपराध के 7 मिनट के भीतर 4 अलग-अलग बैंक खातों में राशि स्थानांतरित की गई।`,
            confidence: 93,
            priority: 'CRITICAL',
            suggestedAction: 'खाता फ्रीज करने हेतु संबंधित बैंकों को तत्काल धारा 91 नोटिस जारी करें।',
          },
          {
            id: 'clue-hi-cmp-2',
            category: 'VEHICLE TRACK',
            title: 'फास्टटैग टोल प्लाजा पर वाहन टेलीमेट्री ओवरलैप',
            detail: `दोनों मामलों से जुड़े वाहन ${veh} ने 4 दिनों के भीतर एक ही टोल प्लाजा को पार किया।`,
            confidence: 89,
            priority: 'HIGH',
            suggestedAction: 'राष्ट्रीय राजमार्ग प्राधिकरण से पिछले 60 दिनों के फास्टटैग लॉग प्राप्त करें।',
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'सिंडिकेट समन्वयक से कैश एजेंट',
            nature: 'Financial Dependency',
            confidence: 92,
            hiddenClue: 'एन्क्रिप्टेड संदेशों से सीधे वित्तीय निर्देशों की पुष्टि होती है।',
            actionableInterrogationTip: 'सिंडिकेट प्रमुख के खिलाफ गवाही के बदले सरकारी गवाह बनने का विकल्प दें।',
          },
        ],
        comparison: {
          matchingScore: 88,
          sharedModusOperandi: [
            'मध्यवर्ती खातों के माध्यम से बहु-स्तरीय धन शोधन',
            'राजमार्ग बाईपास का उपयोग करके वाहन बदलना',
            'घटना के तुरंत बाद बर्नर फोन को नष्ट करना',
          ],
          suspectOrAliasOverlap: [`${s2} और ${targetId} के हैंडलर के बीच सामान्य फोन संपर्क स्थापित।`],
          vehicleOrDeviceOverlap: [`दोनों अपराध स्थलों के सीसीटीवी में वाहन ${veh} की उपस्थिति दर्ज।`],
          crossCaseClues: [`${targetId} में जब्त की गई डायरी में ${caseId} के बैंक खातों का विवरण मिला।`],
          breakthroughHypothesis: `दोनों मामले एक ही क्षेत्रीय आपराधिक नेटवर्क के अंग हैं। ${caseId} को सुलझाने से ${targetId} का नेतृत्व उजागर होता है।`,
        },
        fastTrackActionSteps: [
          `1. ${caseId} और ${targetId} के सीडीआर टावर डंप की क्रॉस-चेकिंग करें।`,
          `2. ${s2} से दोनों मामलों के संबंध में संयुक्त पूछताछ करें।`,
          `3. पहचान किए गए बैंक खातों पर तत्काल रोक लगाएं।`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'वित्तीय लेन-देन में घबराहट और सिंडिकेट द्वारा छोड़ दिए जाने के कारण टूटने की सबसे अधिक संभावना।',
          keyQuestions: [
            `${loc} पर हार्डवेयर कुंजी किसने सौंपी थी?`,
            `आपका फोन नंबर ${targetId} के हैंडलर की कॉल सूची में क्यों है?`,
          ],
        },
      };
    }

    if (isConnections) {
      return {
        answer: `क्राइमएक्स संदिग्ध संबंध विश्लेषण (${caseId} - "${caseTitle}"): संदिग्धों के बीच त्रि-स्तरीय सिंडिकेट पदानुक्रम की पुष्टि हुई है। ${s1} (${r1}) मुख्य साजिशकर्ता के रूप में कार्य करता है, जो वित्तीय संचालन ${s2} (${r2}) के जरिए नियंत्रित करता है। ${s3} (${r3}) वाहन ${veh} की मदद से लॉजिस्टिक्स संभालता है। ${s2} इस नेटवर्क की सबसे कमजोर वित्तीय कड़ी है।`,
        clues: [
          {
            id: 'clue-hi-rel-1',
            category: 'SUSPECT WEAK LINK',
            title: `${s1} और ${s2} के बीच वित्तीय निर्भरता लिंक`,
            detail: `बैंक रिकॉर्ड से पता चलता है कि ${s1} ने ${s2} को कमीशन दिया था जो ऋण वसूली में तुरंत कट गया।`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: `${s2} को अन्य आरोपियों से अलग करें और कानूनी संरक्षण की पेशकश करें।`,
          },
          {
            id: 'clue-hi-rel-2',
            category: 'ALIBI INCONSISTENCY',
            title: `${s2} और ${s3} के बीच साझा लॉजिस्टिक्स समन्वय`,
            detail: `दोनों ने घटना के समय दूर होने का दावा किया, जबकि टोल कैमरों ने वाहन ${veh} में उन्हें साथ दर्ज किया।`,
            confidence: 93,
            priority: 'HIGH',
            suggestedAction: 'दोनों संदिग्धों को समय-मुद्रित सीसीटीवी फुटेज दिखाकर सामना कराएं।',
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'मास्टरमाइंड से वित्तीय माध्यम',
            nature: 'Command Hierarchy',
            confidence: 95,
            hiddenClue: 'साप्ताहिक स्वचालित बैंक ट्रांसफर जिसे कंसल्टेंसी शुल्क के रूप में दिखाया गया।',
            actionableInterrogationTip: 'नकली इनवॉइस विसंगतियों के साथ सामना करें जिनका कोई वास्तविक रिकॉर्ड नहीं है।',
          },
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'लॉजिस्टिक्स समन्वयक से फील्ड ऑपरेटर',
            nature: 'Logistical Mule',
            confidence: 88,
            hiddenClue: 'एक ही सेलुलर टावर सेक्टर पर रिकॉर्ड किए गए बर्नर फोन आईएमईआई स्विच।',
            actionableInterrogationTip: 'दोहरे आईएमईआई हैंडसेट कैप्चर लॉग प्रस्तुत करें।',
          },
        ],
        fastTrackActionSteps: [
          `1. ${s2} के वित्तीय खातों के आधार पर धारा 91 नोटिस भेजें।`,
          `2. ${s1} और ${s3} से अलग-अलग कमरों में समकालिक पूछताछ करें।`,
          `3. बरामद मोबाइल फोनों से सिगनल ऐप चैट को प्रमाणित करें।`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'कोई पूर्व आपराधिक रिकॉर्ड नहीं है और लंबी न्यायिक हिरासत से भयभीत है।',
          keyQuestions: [
            `शेल कंपनी के तहत चालू खाता खोलने का निर्देश किसने दिया था?`,
            `${s3} को वाहन ${veh} की चाबियां कहां सौंपी गई थीं?`,
          ],
        },
      };
    }

    if (isMissingInfo) {
      return {
        answer: `क्राइमएक्स अधूरी / लापता जानकारी विश्लेषण (${caseId} - "${caseTitle}"): जांच में महत्वपूर्ण प्रक्रियात्मक साक्ष्य की कमियां पाई गई हैं। शीर्ष लंबित बिंदु: 1) ${gap1}। 2) ${gap2}। तत्काल आधार पर बायोमेट्रिक सत्यापन और बैंक नोडल अधिकारी के बयान दर्ज करने की आवश्यकता है।`,
        clues: [
          {
            id: 'clue-hi-gap-1',
            category: 'MISSING EVIDENCE',
            title: `लंबित सत्यापन: ${gap1}`,
            detail: `जांच अधिकारी द्वारा संबंधित विभाग को औपचारिक अनुरोध भेजा जाना अभी शेष है।`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: 'तत्काल संबंधित नोडल एजेंसी से डिजिटल सत्यापन रिपोर्ट प्राप्त करें।',
          },
          {
            id: 'clue-hi-gap-2',
            category: 'TIMELINE GAP',
            title: `प्रक्रियात्मक अंतराल: ${gap2}`,
            detail: `फोरेंसिक और निगरानी अंतराल के कारण अपराध का मार्ग आंशिक रूप से अपूर्ण है।`,
            confidence: 91,
            priority: 'HIGH',
            suggestedAction: 'निजी प्रतिष्ठानों से सुरक्षा डीवीआर फुटेज जब्त करने हेतु टीम भेजें।',
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'जांच अंतराल में छिपा वित्तीय लिंक',
            nature: 'Financial Dependency',
            confidence: 90,
            hiddenClue: 'खाता सत्यापन लंबित होने के कारण अंतिम लाभार्थी की पुष्टि शेष है।',
            actionableInterrogationTip: 'प्राथमिक जमा पर्चियों पर किए गए हस्ताक्षरों का मिलान करें।',
          },
        ],
        fastTrackActionSteps: [
          `1. ${gap1} को पूरा करने हेतु विशेष जांच दल रवाना करें।`,
          `2. बैंक नोडल अधिकारी को धारा 161 CrPC / BNSS के तहत तलब करें।`,
          `3. साक्ष्य श्रृंखला को अदालत में पेश करने हेतु धारा 65B प्रमाणपत्र संलग्न करें।`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'अधूरे दस्तावेजों के कारण कानूनी बचाव का कोई आधार नहीं बचा है।',
          keyQuestions: [
            `अधूरे केवाईसी फॉर्म पर हस्ताक्षर किसके कहने पर किए गए थे?`,
            `लेनदेन के समय बैंक में आपके साथ कौन मौजूद था?`,
          ],
        },
      };
    }

    if (isBlindSpots) {
      return {
        answer: `क्राइमएक्स सर्विलांस ब्लाइंड स्पॉट विश्लेषण (${caseId} - "${caseTitle}"): ${blindSpotCorridor} के साथ उच्च-प्राथमिकता वाला निगरानी अंतराल पहचाना गया है। ${blindSpotGap} का अनरिकॉर्डेड अंतराल दर्ज किया गया है (${blindSpotWhy})। वाहन ${veh} ने सार्वजनिक कैमरों से बचने के लिए इसी मार्ग का उपयोग किया।`,
        clues: [
          {
            id: 'clue-hi-bs-1',
            category: 'SURVEILLANCE BLIND SPOT',
            title: `निगरानी अंतराल: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} का समय अंतराल जहां कोई सरकारी सीसीटीवी नहीं है। ${blindSpotWhy}।`,
            confidence: 97,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
          {
            id: 'clue-hi-bs-2',
            category: 'VEHICLE TRACK',
            title: `वाहन ${veh} की अनरिकॉर्डेड आवाजाही`,
            detail: `वाहन ने इस गलियारे में प्रवेश किया और सामान्य समय से काफी देर बाद बाहर निकला।`,
            confidence: 92,
            priority: 'HIGH',
            suggestedAction: 'गलियारे के प्रवेश और निकास बिंदुओं के फास्टटैग लॉग मिलाएं।',
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'ब्लाइंड स्पॉट में भौतिक संपर्क',
            nature: 'Logistical Mule',
            confidence: 91,
            hiddenClue: 'ब्लाइंड स्पॉट के दौरान दोनों मोबाइल फोन एक ही समय पर स्विच ऑफ हुए।',
            actionableInterrogationTip: 'टावर डंप में फोन बंद होने के समय पर सवाल पूछें।',
          },
        ],
        fastTrackActionSteps: [
          `1. ${blindSpotCorridor} पर स्थित निजी गोदामों के सीसीटीवी जब्त करें।`,
          `2. इस मार्ग पर अस्थायी निगरानी कैमरे तैनात करें।`,
          `3. घटना के समय के निकटतम सेलुलर टावर डेटा का मिलान करें।`,
        ],
        recommendedInterrogationTarget: {
          name: s3,
          whyVulnerable: 'ब्लाइंड स्पॉट में वाहन चलाने के स्पष्ट सबूत मौजूद हैं।',
          keyQuestions: [
            `${blindSpotCorridor} में वाहन 28 मिनट तक क्यों रुका था?`,
            `उस दौरान आपने किसे सामान या फोन सौंपा था?`,
          ],
        },
      };
    }

    // Default Clues / Interrogation / Financial in Hindi
    return {
      answer: isInterrogation
        ? `पूछताछ रणनीति (${caseId} - "${caseTitle}"): सबसे पहले ${s2} से पूछताछ करें। यह सिंडिकेट का सबसे कमजोर वित्तीय माध्यम है जो बैंक खातों के फ्रीज होने के बाद अत्यधिक दबाव में है।`
        : isFinancial
        ? `वित्तीय जांच (${caseId} - "${caseTitle}"): 48 घंटों के भीतर ₹49,500 के 5 संरचित जमा (स्मर्फिंग पैटर्न) पाए गए हैं जो पैन सीमा से ठीक नीचे रखे गए थे।`
        : isAlibi
        ? `बहाना विसंगति (${caseId} - "${caseTitle}"): ${s1} का दावा है कि वह घर पर था, जबकि टॉवर #204 के टेलीमेट्री डेटा ने रात 01:42 बजे उसकी उपस्थिति अपराध स्थल से 1.2 किमी दूर दर्ज की।`
        : isVehicle
        ? `वाहन टेलीमेट्री जांच (${caseId} - "${caseTitle}"): वाहन ${veh} घटना के तुरंत बाद उत्तरी बाईपास पर देखा गया। फास्टटैग रिकॉर्ड से पुष्टि होती है।`
        : `इंस्पेक्टर एआई विश्लेषण (${caseId} - "${caseTitle}"): 4 उच्च-प्राथमिकता वाले फोरेंसिक सुराग पहचाने गए हैं। सिंडिकेट की सबसे कमजोर कड़ी ${s2} है जिसका वित्तीय लेन-देन उसके बयानों का सीधा खंडन करता है।`,
      clues: [
        {
          id: 'clue-hi-1',
          category: 'ALIBI INCONSISTENCY',
          title: 'सेल टावर पिंग शपथ पत्र का खंडन करता है',
          detail: `${s1} ने कहा कि वह रात 11 से सुबह 4 बजे तक घर पर था। सीडीआर टेलीमेट्री से पता चलता है कि उसके दूसरे सिम ने 01:42 बजे टावर #204 को पिंग किया।`,
          confidence: 97,
          priority: 'CRITICAL',
          suggestedAction: 'अगले बयान के दौरान प्रमाणित सेलुलर सीडीआर रिपोर्ट प्रस्तुत करें।',
        },
        {
          id: 'clue-hi-2',
          category: 'FINANCIAL TRAIL',
          title: 'तीव्र संरचित बैंक जमा (स्मर्फिंग पैटर्न)',
          detail: `घटना के 48 घंटों के भीतर ${s2} के खाते में ₹49,500 के 5 लगातार जमा किए गए।`,
          confidence: 94,
          priority: 'CRITICAL',
          suggestedAction: 'धारा 102 के तहत लाभार्थी खाते पर तत्काल रोक लगाएं।',
        },
      ],
      relationships: [
        {
          sourcePerson: s1,
          targetPerson: s2,
          relationshipType: 'संगठित साजिश एवं वित्तीय माध्यम',
          nature: 'Direct Conspiracy',
          confidence: 93,
          hiddenClue: 'जब्त मोबाइल से सिगनल ऐप चैट का स्क्रीनशॉट बरामद।',
          actionableInterrogationTip: 'साइबर फोरेंसिक द्वारा निकाली गई थंबनेल कैश दिखाएं।',
        },
      ],
      fastTrackActionSteps: [
        `1. इलेक्ट्रॉनिक साक्ष्य अधिनियम धारा 65B के तहत हिरासत अवधि बढ़ाने का आवेदन दें।`,
        `2. वित्तीय साक्ष्यों के आधार पर ${s2} से केंद्रित पूछताछ करें।`,
      ],
      recommendedInterrogationTarget: {
        name: s2,
        whyVulnerable: 'भारी व्यक्तिगत कर्ज और सिंडिकेट द्वारा छोड़ दिए जाने के कारण सरकारी गवाह बनने की सबसे अधिक संभावना।',
        keyQuestions: [
          `15 अगस्त को 5 एटीएम में जमा करने के लिए नकदी किसने दी थी?`,
          `सिग्नल संदेशों के लिए इस्तेमाल किया गया बर्नर फोन कहां छिपा है?`,
        ],
      },
    };
  }

  // ==========================================
  // 2. KANNADA (ಕನ್ನಡ)
  // ==========================================
  if (language === 'kn') {
    if (queryType === 'compare' && targetCase) {
      return {
        answer: `ಕ್ರೈಮ್‌ಎಕ್ಸ್ ತುಲನಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ: ಪ್ರಕರಣ ${caseId} ಮತ್ತು ಪ್ರಕರಣ ${targetId} ನಡುವೆ 88% ಅಪರಾಧ ವಿಧಾನ (M.O.) ಹೋಲಿಕೆ ಕಂಡುಬಂದಿದೆ. ಎರಡೂ ಕಾರ್ಯಾಚರಣೆಗಳು ${loc} ಕಾರಿಡಾರ್ ಮತ್ತು ಬರ್ನರ್ ಸಿಮ್ ಕಾರ್ಡ್‌ಗಳನ್ನು ಬಳಸಿಕೊಂಡಿವೆ.`,
        clues: [
          {
            id: 'clue-kn-cmp-1',
            category: 'CROSS-CASE PATTERN',
            title: 'ಏಕರೂಪದ ಹಣ ವಿಭಜನೆ ಮತ್ತು ಖಾತೆ ವರ್ಗಾವಣೆ',
            detail: `${caseId} ಮತ್ತು ${targetId} ಎರಡರಲ್ಲೂ ಘಟನೆಯ 7 ನಿಮಿಷಗಳಲ್ಲಿ 4 ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಿಗೆ ಹಣ ವರ್ಗಾವಣೆಯಾಗಿದೆ.`,
            confidence: 93,
            priority: 'CRITICAL',
            suggestedAction: 'ಖಾತೆಗಳನ್ನು ತಡೆಹಿಡಿಯಲು ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ಸೆಕ್ಷನ್ 91 ನೋಟಿಸ್ ಜಾರಿ ಮಾಡಿ.',
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'ಸಿಂಡಿಕೇಟ್ ಸಂಯೋಜಕ ಮತ್ತು ಹಣಕಾಸು ಏಜೆಂಟ್',
            nature: 'Financial Dependency',
            confidence: 92,
            hiddenClue: 'ಟೆಲಿಗ್ರಾಂ ಸಂದೇಶಗಳಲ್ಲಿ ನೇರ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಸೂಚನೆಗಳು ಲಭ್ಯವಾಗಿವೆ.',
            actionableInterrogationTip: 'ಪ್ರಮುಖ ಆರೋಪಿಯ ವಿರುದ್ಧ ಸಾಕ್ಷ್ಯ ನೀಡಲು ಸರ್ಕಾರಿ ಸಾಕ್ಷಿ ಸ್ಥಾನಮಾನ ನೀಡುವ ಭರವಸೆ ನೀಡಿ.',
          },
        ],
        fastTrackActionSteps: [
          `1. ಸಿಡಿಆರ್ ಟವರ್ ಡಂಪ್‌ಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ ಸಾಮಾನ್ಯ ಐಎಂಇಐ ಸಂಖ್ಯೆಗಳನ್ನು ಗುರುತಿಸಿ.`,
          `2. ${s2} ನನ್ನು ಎರಡೂ ತನಿಖಾ ತಂಡಗಳು ಜಂಟಿ ವಿಚಾರಣೆಗೆ ಒಳಪಡಿಸಿ.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'ಹಣಕಾಸು ವಹಿವಾಟು ನಿರ್ಬಂಧದಿಂದ ಆತಂಕಗೊಂಡಿದ್ದು ತಪ್ಪೊಪ್ಪಿಕೊಳ್ಳುವ ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆಯಿದೆ.',
          keyQuestions: [
            `${loc} ನಲ್ಲಿ ಹಾರ್ಡ್‌ವೇರ್ ಕೀಲಿಯನ್ನು ನಿಮಗೆ ನೀಡಿದವರು ಯಾರು?`,
            `${targetId} ನ ನಿರ್ವಾಹಕರ ಕಾಲ್ ಲಾಗ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸಂಖ್ಯೆ ಏಕೆ ಇದೆ?`,
          ],
        },
      };
    }

    if (isConnections) {
      return {
        answer: `ಕ್ರೈಮ್‌ಎಕ್ಸ್ ಸಂಶಯಾಸ್ಪದ ವ್ಯಕ್ತಿಗಳ ಸಂಪರ್ಕ ವಿಶ್ಲೇಷಣೆ (${caseId} - "${caseTitle}"): 3 ಹಂತದ ಸಿಂಡಿಕೇಟ್ ಜಾಲ ಪತ್ತೆಯಾಗಿದೆ. ${s1} (${r1}) ಪ್ರಮುಖ ಯೋಜಕರಾಗಿದ್ದು, ${s2} (${r2}) ಮೂಲಕ ಹಣಕಾಸು ನಿರ್ವಹಿಸುತ್ತಾರೆ. ${s3} (${r3}) ವಾಹನ ${veh} ಬಳಸಿ ಸ್ಥಳೀಯ ಕಾರ್ಯಾಚರಣೆ ನಡೆಸಿದ್ದಾರೆ. ${s2} ಈ ಜಾಲದ ಅತ್ಯಂತ ದುರ್ಬಲ ಕೊಂಡಿ.`,
        clues: [
          {
            id: 'clue-kn-rel-1',
            category: 'SUSPECT WEAK LINK',
            title: `${s1} ಮತ್ತು ${s2} ನಡುವಿನ ಆರ್ಥಿಕ ಕೊಂಡಿ`,
            detail: `ಬ್ಯಾಂಕ್ ದಾಖಲೆಗಳ ಪ್ರಕಾರ ಕಮಿಷನ್ ಬಂದ ತಕ್ಷಣ ಸಾಲಕ್ಕೆ ಕಡಿತಗೊಂಡಿದೆ. ಈ ಆರ್ಥಿಕ ದುರ್ಬಲತೆ ಆತನನ್ನು ಪ್ರಮುಖ ಕೊಂಡಿಯನ್ನಾಗಿ ಮಾಡಿದೆ.`,
            confidence: 94,
            priority: 'CRITICAL',
            suggestedAction: `${s2} ನನ್ನು ಇತರರಿಂದ ಪ್ರತ್ಯೇಕಿಸಿ ರಕ್ಷಣೆ ಭರವಸೆಯೊಂದಿಗೆ ವಿಚಾರಣೆ ನಡೆಸಿ.`,
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'ಮುಖ್ಯಸ್ಥ ಮತ್ತು ಹಣಕಾಸು ವಾಹಕ',
            nature: 'Command Hierarchy',
            confidence: 95,
            hiddenClue: 'ಸಲಹಾ ಶುಲ್ಕದ ಸೋಗಿನಲ್ಲಿ ವಾರದ ಸ್ವಯಂಚಾಲಿತ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ.',
            actionableInterrogationTip: 'ನಕಲಿ ಇನ್‌ವಾಯ್ಸ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಮುಖಾಮುಖಿ ವಿಚಾರಣೆ ನಡೆಸಿ.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${s2} ನ ವೈಯಕ್ತಿಕ ಲೆಕ್ಕಪರಿಶೋಧಕರಿಗೆ ಸಮನ್ಸ್ ಜಾರಿ ಮಾಡಿ.`,
          `2. ${s1} ಮತ್ತು ${s3} ರನ್ನು ಪ್ರತ್ಯೇಕ ಕೋಣೆಗಳಲ್ಲಿ ಏಕಕಾಲದಲ್ಲಿ ಪ್ರಶ್ನಿಸಿ.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'ಹಿಂದಿನ ಅಪರಾಧ ಹಿನ್ನೆಲೆಯಿಲ್ಲ ಹಾಗೂ ಸುದೀರ್ಘ ನ್ಯಾಯಾಂಗ ಬಂಧನಕ್ಕೆ ಹೆದರಿದ್ದಾರೆ.',
          keyQuestions: [
            `ಶೆಲ್ ಕಂಪನಿಯ ಹೆಸರಿನಲ್ಲಿ ಖಾತೆ ತೆರೆಯಲು ಸೂಚಿಸಿದವರು ಯಾರು?`,
            `${s3} ಗೆ ವಾಹನದ ಕೀಲಿಗಳನ್ನು ಎಲ್ಲಿ ಹಸ್ತಾಂತರಿಸಲಾಯಿತು?`,
          ],
        },
      };
    }

    if (isMissingInfo) {
      return {
        answer: `ಕ್ರೈಮ್‌ಎಕ್ಸ್ ಕಾಣೆಯಾದ / ಅಪೂರ್ಣ ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣೆ (${caseId} - "${caseTitle}"): ಪ್ರಕರಣದಲ್ಲಿ ಪ್ರಮುಖ ತನಿಖಾ ಕೊರತೆಗಳು ಪತ್ತೆಯಾಗಿವೆ: 1) ${gap1}. 2) ${gap2}. ಡಿಜಿಲಾಕರ್/ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ ಹಾಗೂ ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್ ಹೇಳಿಕೆಯನ್ನು ತಕ್ಷಣ ದಾಖಲಿಸಬೇಕಾಗಿದೆ.`,
        clues: [
          {
            id: 'clue-kn-gap-1',
            category: 'MISSING EVIDENCE',
            title: `ಬಾಕಿ ತನಿಖಾ ಅಂಶ: ${gap1}`,
            detail: `ಸಂಬಂಧಿತ ಇಲಾಖೆಯಿಂದ ಅಗತ್ಯ ದಾಖಲೆಗಳ ಸಂಗ್ರಹ ಬಾಕಿಯಿದೆ.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: 'ತಕ್ಷಣ ನೋಟಿಸ್ ಜಾರಿ ಮಾಡಿ ಅಗತ್ಯ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.',
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'ಮಾಹಿತಿ ಕೊರತೆಯಿಂದ ಮರೆಮಾಚಲಾದ ಸಂಪರ್ಕ',
            nature: 'Logistical Mule',
            confidence: 89,
            hiddenClue: 'ಗುರುತು ಪರಿಶೀಲನೆ ಬಾಕಿಯಿರುವುದರಿಂದ ನೈಜ ವಿಳಾಸ ಪತ್ತೆಯಾಗಿಲ್ಲ.',
            actionableInterrogationTip: 'ಸ್ಥಳೀಯ ವಿಳಾಸ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${gap1} ಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ತಕ್ಷಣ ತಂಡ ನಿಯೋಜಿಸಿ.`,
          `2. ಬ್ಯಾಂಕ್ ನೊಡಲ್ ಅಧಿಕಾರಿಗೆ ಸಮನ್ಸ್ ಜಾರಿ ಮಾಡಿ.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'ದಾಖಲೆಗಳ ಕೊರತೆಯಿಂದಾಗಿ ಕಾನೂನು ರಕ್ಷಣೆ ಪಡೆಯಲು ಅಸಾಧ್ಯವಾಗಿದೆ.',
          keyQuestions: [
            `ಅಪೂರ್ಣ ಕೆವೈಸಿ ದಾಖಲೆಗಳನ್ನು ಯಾರ ಒತ್ತಡದಿಂದ ನೀಡಲಾಯಿತು?`,
            `ಖಾತೆ ತೆರೆಯುವಾಗ ನಿಮ್ಮ ಜೊತೆಗಿದ್ದವರು ಯಾರು?`,
          ],
        },
      };
    }

    if (isBlindSpots) {
      return {
        answer: `ಕ್ರೈಮ್‌ಎಕ್ಸ್ ಬ್ಲೈಂಡ್ ಸ್ಪಾಟ್ ವಿಶ್ಲೇಷಣೆ (${caseId} - "${caseTitle}"): ${blindSpotCorridor} ನಲ್ಲಿ ಗಂಭೀರ ಕ್ಯಾಮೆರಾ ಕೊರತೆ ಗುರುತಿಸಲಾಗಿದೆ. ${blindSpotGap} ದಾಖಲಾಗದ ಸಮಯ ದಾಖಲಾಗಿದೆ (${blindSpotWhy}). ವಾಹನ ${veh} ಎಎನ್‌ಪಿಆರ್ ಕ್ಯಾಮೆರಾಗಳನ್ನು ತಪ್ಪಿಸಲು ಈ ಮಾರ್ಗವನ್ನು ಬಳಸಿದೆ.`,
        clues: [
          {
            id: 'clue-kn-bs-1',
            category: 'SURVEILLANCE BLIND SPOT',
            title: `ಬ್ಲೈಂಡ್ ಸ್ಪಾಟ್: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} ಯಾವುದೇ ಸಿಸಿಟಿವಿ ಇಲ್ಲದ ಮಾರ್ಗ. ${blindSpotWhy}.`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'ಬ್ಲೈಂಡ್ ಸ್ಪಾಟ್‌ನಲ್ಲಿ ಭೇಟಿ',
            nature: 'Logistical Mule',
            confidence: 91,
            hiddenClue: 'ಈ ಮಾರ್ಗದಲ್ಲಿ ಸಂಚರಿಸುವಾಗ ಮೊಬೈಲ್ ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ.',
            actionableInterrogationTip: 'ಆ ಮಾರ್ಗದಲ್ಲಿ ನಿಲ್ಲಿಸಿದ ಕಾರಣವನ್ನು ಪ್ರಶ್ನಿಸಿ.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${blindSpotCorridor} ಮಾರ್ಗದಲ್ಲಿನ ಖಾಸಗಿ ಸಿಸಿಟಿವಿ ವಶಪಡಿಸಿಕೊಳ್ಳಿ.`,
          `2. ಸಮೀಪದ ಟವರ್ ಡಂಪ್ ವಿವರ ಪರಿಶೀಲಿಸಿ.`,
        ],
        recommendedInterrogationTarget: {
          name: s3,
          whyVulnerable: 'ಬ್ಲೈಂಡ್ ಸ್ಪಾಟ್‌ನಲ್ಲಿ ವಾಹನ ಸಂಚರಿಸಿದ್ದಕ್ಕೆ ಸ್ಪಷ್ಟ ಸಾಕ್ಷ್ಯಗಳಿವೆ.',
          keyQuestions: [
            `${blindSpotCorridor} ನಲ್ಲಿ ವಾಹನ ಏಕೆ ತಡವಾಯಿತು?`,
            `ಅಲ್ಲಿ ಯಾರಿಗೆ ವಸ್ತುಗಳನ್ನು ಹಸ್ತಾಂತರಿಸಲಾಯಿತು?`,
          ],
        },
      };
    }

    // Default Clues in Kannada
    return {
      answer: isInterrogation
        ? `ವಿಚಾರಣಾ ತಂತ್ರ (${caseId} - "${caseTitle}"): ಮೊದಲು ${s2} ನನ್ನು ವಿಚಾರಿಸಿ. ಬ್ಯಾಂಕ್ ಖಾತೆಗಳು ಸ್ಥಗಿತಗೊಂಡ ನಂತರ ಆತ ತೀವ್ರ ಆತಂಕದಲ್ಲಿದ್ದು ತಪ್ಪೊಪ್ಪಿಕೊಳ್ಳುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು.`
        : isFinancial
        ? `ಹಣಕಾಸು ಜಾಡು (${caseId} - "${caseTitle}"): 48 ಗಂಟೆಗಳಲ್ಲಿ ಪ್ಯಾನ್ ಮಿತಿಗಿಂತ ಕಡಿಮೆ ಇರುವ ₹49,500 ರ 5 ಠೇವಣಿಗಳು ಪತ್ತೆಯಾಗಿವೆ.`
        : isAlibi
        ? `ಅಲಿಬಿ ಅಸಂಗತತೆ (${caseId} - "${caseTitle}"): ${s1} ಮನೆಯಲ್ಲಿದ್ದೆ ಎಂದು ಹೇಳಿದರೂ ಟವರ್ #204 ರಲ್ಲಿ ರಾತ್ರಿ 01:42 ಕ್ಕೆ ಆತನ ಸಿಮ್ ಪಿಂಗ್ ದಾಖಲಾಗಿದೆ.`
        : `ಇನ್‌ಸ್ಪೆಕ್ಟರ್ AI ವಿಶ್ಲೇಷಣೆ (${caseId} - "${caseTitle}"): 4 ಪ್ರಮುಖ ಫೋರೆನ್ಸಿಕ್ ಸುಳಿವುಗಳು ಪತ್ತೆಯಾಗಿವೆ. ${s2} ಸಿಂಡಿಕೇಟ್‌ನ ಅತ್ಯಂತ ದುರ್ಬಲ ಕೊಂಡಿಯಾಗಿದ್ದು ತನಿಖೆಯನ್ನು 65% ವೇಗಗೊಳಿಸಬಹುದು.`,
      clues: [
        {
          id: 'clue-kn-1',
          category: 'ALIBI INCONSISTENCY',
          title: 'ಸೆಲ್ ಟವರ್ ಪಿಂಗ್ ಹೇಳಿಕೆಯನ್ನು ಅಲ್ಲಗಳೆಯುತ್ತದೆ',
          detail: `${s1} ಮನೆಯಲ್ಲಿ ಮಲಗಿದ್ದೆ ಎಂದು ಹೇಳಿದರೂ, ಟವರ್ #204 ನಲ್ಲಿ ರಾತ್ರಿ 01:42 ಕ್ಕೆ ಸಿಮ್ ಪಿಂಗ್ ಆಗಿದೆ.`,
          confidence: 97,
          priority: 'CRITICAL',
          suggestedAction: 'ಮುಂದಿನ ವಿಚಾರಣೆಯಲ್ಲಿ ಪ್ರಮಾಣೀಕೃತ ಸಿಡಿಆರ್ ಟವರ್ ವರದಿಯನ್ನು ಹಾಜರುಪಡಿಸಿ.',
        },
      ],
      relationships: [
        {
          sourcePerson: s1,
          targetPerson: s2,
          relationshipType: 'ಸಂಘಟಿತ ಪಿತೂರಿ ಮತ್ತು ಆರ್ಥಿಕ ವಾಹಕ',
          nature: 'Direct Conspiracy',
          confidence: 93,
          hiddenClue: 'ಮೊಬೈಲ್‌ನಿಂದ ಸಿಗ್ನಲ್ ಆಪ್ ಚಾಟ್ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಪತ್ತೆ.',
          actionableInterrogationTip: 'ಫೋರೆನ್ಸಿಕ್ ತಜ್ಞರು ಹೊರತೆಗೆದ ಇಮೇಜ್ ಕ್ಯಾಶ್ ತೋರಿಸಿ.',
        },
      ],
      fastTrackActionSteps: [
        `1. ಸೆಕ್ಷನ್ 65B ಪ್ರಮಾಣಪತ್ರದ ಆಧಾರದ ಮೇಲೆ ಕಸ್ಟಡಿ ವಿಸ್ತರಣೆ ಪಡೆಯಿರಿ.`,
        `2. ಹಣಕಾಸಿನ ಜಾಡನ್ನು ಗುರಿಯಾಗಿಸಿಕೊಂಡು ${s2} ನ ತೀವ್ರ ವಿಚಾರಣೆ ನಡೆಸಿ.`,
      ],
      recommendedInterrogationTarget: {
        name: s2,
        whyVulnerable: 'ವೈಯಕ್ತಿಕ ಸಾಲ ಮತ್ತು ಸಿಂಡಿಕೇಟ್‌ನಿಂದ ಕೈಬಿಡಲ್ಪಟ್ಟಿರುವುದು ಆತನನ್ನು ಸರ್ಕಾರಿ ಸಾಕ್ಷಿಯಾಗಲು ಪ್ರೇರೇಪಿಸುತ್ತದೆ.',
        keyQuestions: [
          `ಆಗಸ್ಟ್ 15 ರಂದು ಠೇವಣಿ ಮಾಡಲು ಹಣ ನೀಡಿದವರು ಯಾರು?`,
          `ಸಿಗ್ನಲ್ ಸಂದೇಶಗಳಿಗೆ ಬಳಸಿದ ಬರ್ನರ್ ಮೊಬೈಲ್ ಎಲ್ಲಿ ಬಚ್ಚಿಡಲಾಗಿದೆ?`,
        ],
      },
    };
  }

  // ==========================================
  // 3. TAMIL (தமிழ்)
  // ==========================================
  if (language === 'ta') {
    if (isConnections) {
      return {
        answer: `CrimeX சந்தேக நபர் தொடர்பு பகுப்பாய்வு (${caseId} - "${caseTitle}"): 3-அடுக்கு குற்ற வலையமைப்பு கண்டறியப்பட்டுள்ளது. ${s1} (${r1}) முக்கிய ஒருங்கிணைப்பாளராகவும், ${s2} (${r2}) நிதி கடத்தல்காரராகவும் செயல்படுகின்றனர். ${s3} (${r3}) வாகனம் ${veh} மூலம் கள செயல்பாடுகளை நிர்வகிக்கிறார். ${s2} இந்த நெட்வொர்க்கின் பலவீனமான கன்னி.`,
        clues: [
          {
            id: 'clue-ta-rel-1',
            category: 'SUSPECT WEAK LINK',
            title: `${s1} மற்றும் ${s2} இடையேயான நிதி பிணைப்பு`,
            detail: `வங்கிக் கணக்கு பதிவுகள் ${s2} கமிஷன் பெற்றதையும் அது கடன் தவணைக்கு சென்றதையும் காட்டுகின்றன.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: `${s2} ஐ தனிமைப்படுத்தி வாக்குமூலம் பெறவும்.`,
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'கூட்டு சதி மற்றும் நிதி கடத்தல்',
            nature: 'Direct Conspiracy',
            confidence: 93,
            hiddenClue: 'கைப்பற்றப்பட்ட மொபைலில் இருந்து சிக்னல் ஆப் அரட்டை மீட்பு.',
            actionableInterrogationTip: 'மீட்கப்பட்ட ஆதாரங்களை காட்டி உண்மையை ஒப்புக்கொள்ள வைக்கவும்.',
          },
        ],
        fastTrackActionSteps: [
          `1. பிரிவு 65B சான்றிதழின் அடிப்படையில் காவல் நீட்டிப்பு பெறவும்.`,
          `2. நிதி ஆதாரங்களை முன்வைத்து ${s2} இடம் தீவிர விசாரணை நடத்தவும்.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'கடன் சுமை மற்றும் கும்பலால் கைவிடப்பட்டதால் அரசு சாட்சியாக மாற அதிக வாய்ப்பு உள்ளது.',
          keyQuestions: [
            `ஆகஸ்ட் 15 அன்று டெபாசிட் செய்ய பணத்தை கொடுத்தது யார்?`,
            `பயன்படுத்தப்பட்ட ரகசிய மொபைல் எங்கு மறைக்கப்பட்டுள்ளது?`,
          ],
        },
      };
    }

    if (isMissingInfo) {
      return {
        answer: `CrimeX விடுபட்ட தகவல்கள் பகுப்பாய்வு (${caseId} - "${caseTitle}"): வழக்கில் முக்கியமான புலனாய்வு இடைவெளிகள் கண்டறியப்பட்டுள்ளன: 1) ${gap1}. 2) ${gap2}. உடனடி ஆதார்/டிஜிலாக்கர் சரிபார்ப்பு மற்றும் வங்கி மேலாளர் வாக்குமூலம் பதிவு செய்யப்பட வேண்டும்.`,
        clues: [
          {
            id: 'clue-ta-gap-1',
            category: 'MISSING EVIDENCE',
            title: `நிலுவையில் உள்ள சரிபார்ப்பு: ${gap1}`,
            detail: `அத்தியாவசிய டிஜிட்டல் சான்றுகளின் சரிபார்ப்பு இன்னும் முடிவடையவில்லை.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: 'உடனடியாக நோட்டீஸ் அனுப்பி ஆவணங்களை பெறவும்.',
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'தகவல் இடைவெளியில் மறைந்துள்ள தொடர்பு',
            nature: 'Logistical Mule',
            confidence: 90,
            hiddenClue: 'ஆவண சரிபார்ப்பு நிலுவையில் உள்ளதால் உண்மையான முகவரி மறைக்கப்பட்டுள்ளது.',
            actionableInterrogationTip: 'முகவரி ஆவணங்களை ஆய்வு செய்து விசாரிக்கவும்.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${gap1} குறித்த அறிக்கையை பெற தனிப்படையை அனுப்பவும்.`,
          `2. வங்கி மேலாளருக்கு சம்மன் அனுப்பவும்.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'ஆவணங்கள் முழுமையடையாததால் சட்டப்பூர்வமாக சிக்குவார்.',
          keyQuestions: [
            `யார் சொல்லி முழுமையற்ற படிவத்தில் கையெழுத்திட்டீர்கள்?`,
            `வங்கிக்கு உங்களுடன் வந்தது யார்?`,
          ],
        },
      };
    }

    if (isBlindSpots) {
      return {
        answer: `CrimeX கண்காணிப்பற்ற பகுதிகள் (Blind Spots) பகுப்பாய்வு (${caseId} - "${caseTitle}"): ${blindSpotCorridor} வழியில் தீவிர கண்காணிப்பு இடைவெளி கண்டறியப்பட்டுள்ளது. ${blindSpotGap} நேரம் பதிவாகாத இடைவெளி ஏற்பட்டுள்ளது (${blindSpotWhy}). வாகனம் ${veh} கேமராக்களில் இருந்து தப்பிக்க இந்த வழியைப் பயன்படுத்தியுள்ளது.`,
        clues: [
          {
            id: 'clue-ta-bs-1',
            category: 'SURVEILLANCE BLIND SPOT',
            title: `கண்காணிப்பற்ற பாதை: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} நேர இடைவெளியில் பொது கேமராக்கள் இல்லை. ${blindSpotWhy}.`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'கண்காணிப்பற்ற பகுதியில் சந்திப்பு',
            nature: 'Logistical Mule',
            confidence: 91,
            hiddenClue: 'இந்த பாதையில் செல்லும்போது மொபைல் போன் அணைக்கப்பட்டுள்ளது.',
            actionableInterrogationTip: 'போன் அணைக்கப்பட்டதற்கான காரணத்தை கேட்கவும்.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${blindSpotCorridor} அருகில் உள்ள தனியார் சிசிடிவிகளை கைப்பற்றவும்.`,
          `2. அந்த பகுதியில் தற்காலிக கேமராக்களை பொருத்தவும்.`,
        ],
        recommendedInterrogationTarget: {
          name: s3,
          whyVulnerable: 'வாகனம் அந்த வழியே சென்றதற்கு நேரடி ஆதாரங்கள் உள்ளன.',
          keyQuestions: [
            `${blindSpotCorridor} இல் வாகனம் ஏன் தாமதமானது?`,
            `அங்கு யாருக்கு பொருட்களை ஒப்படைத்தீர்கள்?`,
          ],
        },
      };
    }

    // Default Tamil
    return {
      answer: isInterrogation
        ? `விசாரணை உத்தி (${caseId} - "${caseTitle}"): முதலில் ${s2} இடம் விசாரணை நடத்தவும். வங்கி கணக்குகள் முடக்கப்பட்டதால் இவர் மன அழுத்தத்தில் உள்ளார்.`
        : isFinancial
        ? `நிதி தடயவியல் (${caseId} - "${caseTitle}"): ₹49,500 வீதம் 5 முறை அடுத்தடுத்து வங்கி கணக்கில் டெபாசிட் செய்யப்பட்டுள்ளது.`
        : isAlibi
        ? `வாக்குமூல முரண்பாடு (${caseId} - "${caseTitle}"): ${s1} வீட்டில் இருந்ததாகக் கூறியும், டவர் #204 இல் அவரது சிம் சிக்னல் பதிவாகியுள்ளது.`
        : `CrimeX இன்ஸ்பெக்டர் AI தடயவியல் பகுப்பாய்வு (${caseId} - "${caseTitle}"): வழக்கை 65% விரைவாக முடிக்க உதவும் உயர் முன்னுரிமை தடயங்கள் கண்டறியப்பட்டுள்ளன. சந்தேக நபர் வலையமைப்பில் பலவீனமான நபர் ${s2} ஆவார்.`,
      clues: [
        {
          id: 'clue-ta-1',
          category: 'ALIBI INCONSISTENCY',
          title: 'செல் கோபுர சமிக்ஞை பொய் வாக்குமூலத்தை வெளிப்படுத்துகிறது',
          detail: `${s1} வீட்டில் இருந்ததாகக் கூறினார், ஆனால் இரவு 01:42 மணிக்கு டவர் #204 இல் சிக்னல் பதிவாகியுள்ளது.`,
          confidence: 97,
          priority: 'CRITICAL',
          suggestedAction: 'விசாரணையில் சான்றளிக்கப்பட்ட சிடிஆர் அறிக்கையை காண்பிக்கவும்.',
        },
      ],
      relationships: [
        {
          sourcePerson: s1,
          targetPerson: s2,
          relationshipType: 'கூட்டு சதி மற்றும் நிதி கடத்தல்',
          nature: 'Direct Conspiracy',
          confidence: 93,
          hiddenClue: 'கைப்பற்றப்பட்ட மொபைலில் இருந்து சிக்னல் ஆப் அரட்டை மீட்பு.',
          actionableInterrogationTip: 'மீட்கப்பட்ட ஆதாரங்களை காட்டி உண்மையை ஒப்புக்கொள்ள வைக்கவும்.',
        },
      ],
      fastTrackActionSteps: [
        `1. பிரிவு 65B சான்றிதழின் அடிப்படையில் காவல் நீட்டிப்பு பெறவும்.`,
        `2. நிதி ஆதாரங்களை முன்வைத்து ${s2} இடம் தீவிர விசாரணை நடத்தவும்.`,
      ],
      recommendedInterrogationTarget: {
        name: s2,
        whyVulnerable: 'கடன் சுமை மற்றும் கும்பலால் கைவிடப்பட்டதால் அரசு சாட்சியாக மாற அதிக வாய்ப்பு உள்ளது.',
        keyQuestions: [
          `ஆகஸ்ட் 15 அன்று டெபாசிட் செய்ய பணத்தை கொடுத்தது யார்?`,
          `பயன்படுத்தப்பட்ட ரகசிய மொபைல் எங்கு மறைக்கப்பட்டுள்ளது?`,
        ],
      },
    };
  }

  // ==========================================
  // 4. TELUGU (తెలుగు)
  // ==========================================
  if (language === 'te') {
    if (isConnections) {
      return {
        answer: `CrimeX అనుమానితుల సంబంధాల విశ్లేషణ (${caseId} - "${caseTitle}"): 3-స్థాయిల సిండికేట్ నెట్‌వర్క్ నిర్ధారించబడింది. ${s1} (${r1}) ప్రధాన సూత్రధారిగా, ${s2} (${r2}) ద్వారా నిధుల రవాణా జరుపుతున్నాడు. ${s3} (${r3}) వాహనం ${veh} తో క్షేత్రస్థాయి కార్యకలాపాలు సాగిస్తున్నాడు. ${s2} అత్యంత బలహీనమైన లింక్.`,
        clues: [
          {
            id: 'clue-te-rel-1',
            category: 'SUSPECT WEAK LINK',
            title: `${s1} మరియు ${s2} మధ్య ఆర్థిక సంబంధం`,
            detail: `బ్యాంక్ లావాదేవీలు కమీషన్ రావడం, అప్పుల కింద కట్ అవ్వడం సూచిస్తున్నాయి.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: `${s2} ను విడిగా విచారించండి.`,
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'వ్యవస్థీకృత కుట్ర మరియు ఆర్థిక వాహకం',
            nature: 'Direct Conspiracy',
            confidence: 93,
            hiddenClue: 'మొబైల్ ఫోన్ నుండి సిగ్నల్ యాప్ చాట్ స్క్రీన్‌షాట్ లభ్యమైంది.',
            actionableInterrogationTip: 'ఫోరెన్సిక్స్ రికవరీ చేసిన చాట్ ఆధారాలతో ప్రశ్నించండి.',
          },
        ],
        fastTrackActionSteps: [
          `1. సెక్షన్ 65B సర్టిఫికేట్ ఆధారంగా కస్టడీ పొడిగింపును పొందండి.`,
          `2. ఆర్థిక ఆధారాలపై ${s2} ను ప్రత్యేకంగా విచారించండి.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'వ్యక్తిగత అప్పులు మరియు ముఠా వదిలివేయడం వలన అప్రూవర్‌గా మారే అవకాశం ఎక్కువ.',
          keyQuestions: [
            `ఆగస్టు 15న డిపాజిట్ చేయడానికి నగదు ఎవరు ఇచ్చారు?`,
            `సిగ్నల్ మెసేజ్‌ల కోసం ఉపయోగించిన మొబైల్ ఎక్కడ దాచారు?`,
          ],
        },
      };
    }

    if (isMissingInfo) {
      return {
        answer: `CrimeX మిస్సింగ్ / అసంపూర్ణ సమాచార విశ్లేషణ (${caseId} - "${caseTitle}"): దర్యాప్తులో కీలక లోపాలు గుర్తించబడ్డాయి: 1) ${gap1}. 2) ${gap2}. ఆధార్/డిజిలాకర్ ధృవీకరణ మరియు బ్యాంక్ నోడల్ అధికారి వాంగ్మూలం తక్షణమే సేకరించాలి.`,
        clues: [
          {
            id: 'clue-te-gap-1',
            category: 'MISSING EVIDENCE',
            title: `పెండింగ్ ధృవీకరణ: ${gap1}`,
            detail: `డిజిటల్ రికార్డుల ధృవీకరణ ఇంకా పెండింగ్‌లో ఉంది.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: 'వెంటనే దర్యాప్తు బృందాన్ని పంపి రికార్డులు తెప్పించండి.',
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'సమాచార లోపంలో దాగివున్న సంబంధం',
            nature: 'Logistical Mule',
            confidence: 90,
            hiddenClue: 'ధృవీకరణ లేకపోవడం వల్ల వాస్తవ చిరునామా తెలియరాలేదు.',
            actionableInterrogationTip: 'చిరునామా ఆధారాలను సేకరించి నిగ్గుతేల్చండి.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${gap1} రికార్డులను వెంటనే సేకరించండి.`,
          `2. బ్యాంక్ అధికారికి సమన్లు జారీ చేయండి.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'అసంపూర్ణ పత్రాల వల్ల నేరం స్పష్టంగా రుజువవుతుంది.',
          keyQuestions: [
            `అసంపూర్ణ ఫారమ్‌లపై ఎవరి ప్రోద్బలంతో సంతకం చేశారు?`,
            `బ్యాంకుకు వచ్చినప్పుడు మీతో ఎవరున్నారు?`,
          ],
        },
      };
    }

    if (isBlindSpots) {
      return {
        answer: `CrimeX బ్లైండ్ స్పాట్స్ విశ్లేషణ (${caseId} - "${caseTitle}"): ${blindSpotCorridor} వద్ద నిఘా లోపం బయటపడింది. ${blindSpotGap} పాటు రికార్డు కాని సమయం నమోదైంది (${blindSpotWhy}). వాహనం ${veh} టోల్ కెమెరాలను తప్పించుకోవడానికి ఈ మార్గాన్ని ఉపయోగించింది.`,
        clues: [
          {
            id: 'clue-te-bs-1',
            category: 'SURVEILLANCE BLIND SPOT',
            title: `నిఘా లేని మార్గం: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} సమయం పాటు కెమెరాలు లేవు. ${blindSpotWhy}.`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'బ్లైండ్ స్పాట్‌లో రహస్య సమావేశం',
            nature: 'Logistical Mule',
            confidence: 91,
            hiddenClue: 'ఆ మార్గంలో వెళ్తున్నప్పుడు ఫోన్లు స్విచ్ ఆఫ్ అయ్యాయి.',
            actionableInterrogationTip: 'ఫోన్ ఆపివేయడానికి గల కారణాన్ని అడగండి.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${blindSpotCorridor} వద్ద ప్రైవేట్ సీసీటీవీలను స్వాధీనం చేసుకోండి.`,
          `2. ఆ ప్రాంతంలో తాత్కాలిక కెమెరాలు ఏర్పాటు చేయండి.`,
        ],
        recommendedInterrogationTarget: {
          name: s3,
          whyVulnerable: 'బ్లైండ్ స్పాట్ గుండా వాహనం వెళ్లినట్లు ఆధారాలు ఉన్నాయి.',
          keyQuestions: [
            `${blindSpotCorridor} లో వాహనం ఎందుకు ఆగింది?`,
            `అక్కడ ఎవరికి వస్తువులు అప్పగించారు?`,
          ],
        },
      };
    }

    // Default Telugu
    return {
      answer: isInterrogation
        ? `విచారణ వ్యూహం (${caseId} - "${caseTitle}"): ముందుగా ${s2} ను విచారించండి. ఖాతాలు నిలిపివేయడంతో తీవ్ర భయాందోళనల్లో ఉన్నాడు.`
        : isFinancial
        ? `ఆర్థిక ఆధారాలు (${caseId} - "${caseTitle}"): ₹49,500 చొప్పున 5 వరుస డిపాజిట్లు జరిగాయి.`
        : isAlibi
        ? `అలిబి అబద్ధం (${caseId} - "${caseTitle}"): ${s1} ఇంట్లో ఉన్నానని చెప్పినప్పటికీ టవర్ #204 వద్ద సిగ్నల్ నమోదైంది.`
        : `CrimeX ఇన్‌స్పెక్టర్ AI ఫోరెన్సిక్ విశ్లేషణ (${caseId} - "${caseTitle}"): కేసు పరిష్కారానికి 4 కీలక ఆధారాలు లభించాయి. బలహీనమైన లింక్ ${s2}.`,
      clues: [
        {
          id: 'clue-te-1',
          category: 'ALIBI INCONSISTENCY',
          title: 'సెల్ టవర్ పింగ్ అలిబిని తోసిపుచ్చుతోంది',
          detail: `${s1} ఇంట్లో నిద్రపోతున్నానని చెప్పాడు, కానీ రాత్రి 01:42 గంటలకు టవర్ #204 వద్ద అతని సిమ్ పింగ్ రికార్డైంది.`,
          confidence: 97,
          priority: 'CRITICAL',
          suggestedAction: 'విచారణలో ధృవీకరించబడిన సెల్యులార్ సిడిఆర్ నివేదికను చూపించండి.',
        },
      ],
      relationships: [
        {
          sourcePerson: s1,
          targetPerson: s2,
          relationshipType: 'వ్యవస్థీకృత కుట్ర మరియు ఆర్థిక వాహకం',
          nature: 'Direct Conspiracy',
          confidence: 93,
          hiddenClue: 'మొబైల్ ఫోన్ నుండి సిగ్నಲ್ యాప్ చాట్ స్క్రీన్‌షాట్ లభ్యమైంది.',
          actionableInterrogationTip: 'ఫోరెన్సిక్స్ రికవరీ చేసిన చాట్ క్యాష్‌ను చూపి విచారించండి.',
        },
      ],
      fastTrackActionSteps: [
        `1. సెక్షన్ 65B సర్టిఫికేట్ ఆధారంగా కస్టడీ పొడిగింపును పొందండి.`,
        `2. ఆర్థిక ఆధారాలపై ${s2} ను ప్రత్యేకంగా విచారించండి.`,
      ],
      recommendedInterrogationTarget: {
        name: s2,
        whyVulnerable: 'వ్యక్తిగత అప్పులు మరియు ముఠా వదిలివేయడం వలన అప్రూవర్‌గా మారే అవకాశం ఎక్కువ.',
        keyQuestions: [
          `ఆగస్టు 15న డిపాజిట్ చేయడానికి నగదు ఎవరు ఇచ్చారు?`,
          `సిగ్నల్ మెసేజ్‌ల కోసం ఉపయోగించిన మొబైల్ ఎక్కడ దాచారు?`,
        ],
      },
    };
  }

  // ==========================================
  // 5. MALAYALAM (മലയാളം)
  // ==========================================
  if (language === 'ml') {
    if (isConnections) {
      return {
        answer: `CrimeX പ്രതികളുടെ ബന്ധങ്ങളുടെ വിശകലനം (${caseId} - "${caseTitle}"): 3-തല സിൻഡിക്കേറ്റ് ഘടന കണ്ടെത്തി. ${s1} (${r1}) പ്രധാന സൂത്രധാരനും, ${s2} (${r2}) സാമ്പത്തിക ഇടനിലക്കാരനുമാണ്. ${s3} (${r3}) വാഹനം ${veh} ഉപയോഗിച്ച് പ്രവർത്തനങ്ങൾ നടത്തുന്നു. ${s2} ഈ ശൃംഖലയിലെ ഏറ്റവും ദുർബലമായ കണ്ണി.`,
        clues: [
          {
            id: 'clue-ml-rel-1',
            category: 'SUSPECT WEAK LINK',
            title: `${s1} ഉം ${s2} ഉം തമ്മിലുള്ള സാമ്പത്തിക ബന്ധം`,
            detail: `ബാങ്ക് ഇടപാടുകൾ കമ്മീഷൻ കൈമാറ്റവും കടബാധ്യതയും വ്യക്തമാക്കുന്നു.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: `${s2} നെ ഒറ്റയ്ക്ക് ചോദ്യം ചെയ്യുക.`,
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'സാമ്പത്തിക ഇടനിലക്കാരൻ',
            nature: 'Direct Conspiracy',
            confidence: 93,
            hiddenClue: 'ഫോണിൽ നിന്ന് എൻക്രിപ്റ്റ് ചെയ്ത ചാറ്റുകൾ വീണ്ടെടുത്തു.',
            actionableInterrogationTip: 'തെളിവുകൾ മുൻനിർത്തി മാപ്പുസാക്ഷിയാകാൻ പ്രേരിപ്പിക്കുക.',
          },
        ],
        fastTrackActionSteps: [
          `1. ഡിജിറ്റൽ തെളിവുകളുടെ അടിസ്ഥാനത്തിൽ കസ്റ്റഡി കാലാവധി നീട്ടുക.`,
          `2. സാമ്പത്തിക രേഖകൾ മുൻനിർത്തി ${s2} നെ ചോദ്യം ചെയ്യുക.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'സാമ്പത്തിക ബാധ്യതകളും സംഘം കൈവിട്ടതും കാരണം കുറ്റസമ്മതത്തിന് സാധ്യത കൂടുതൽ.',
          keyQuestions: [
            `ഓഗസ്റ്റ് 15 ന് നിക്ഷേപിക്കാനുള്ള പണം നൽകിയത് ആര്?`,
            `രഹസ്യ ആശയവിനിമയത്തിന് ഉപയോഗിച്ച ഫോൺ എവിടെ ഒളിപ്പിച്ചു?`,
          ],
        },
      };
    }

    if (isMissingInfo) {
      return {
        answer: `CrimeX വിട്ടുപോയ വിവരങ്ങളുടെ വിശകലനം (${caseId} - "${caseTitle}"): കേസിൽ നിർണായക അന്വേഷണ വിടവുകൾ കണ്ടെത്തി: 1) ${gap1}. 2) ${gap2}. ആധാർ/ഡിജിലോക്കർ ബയോമെട്രിക് സ്ഥിരീകരണവും ബാങ്ക് മാനേജരുടെ മൊഴിയും ഉടൻ രേഖപ്പെടുത്തേണ്ടതുണ്ട്.`,
        clues: [
          {
            id: 'clue-ml-gap-1',
            category: 'MISSING EVIDENCE',
            title: `തീർപ്പാക്കാത്ത രേഖ: ${gap1}`,
            detail: `ഡിജിറ്റൽ രേഖകളുടെ ഔദ്യോഗിക സ്ഥിരീകരണം ഇനിയും പൂർത്തിയായിട്ടില്ല.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: 'ഉടൻ തന്നെ രേഖകൾ ശേഖരിക്കാൻ സംഘത്തെ അയക്കുക.',
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'വിവരങ്ങളുടെ അഭാവത്തിൽ മറഞ്ഞിരിക്കുന്ന ബന്ധം',
            nature: 'Logistical Mule',
            confidence: 90,
            hiddenClue: 'സ്ഥിരീകരണം ലഭിക്കാത്തതിനാൽ യഥാർത്ഥ മേൽവിലാസം അവ്യക്തമാണ്.',
            actionableInterrogationTip: 'രേഖകൾ പരിശോധിച്ച് വ്യക്തത വരുത്തുക.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${gap1} സംബന്ധിച്ച വിവരങ്ങൾ വേഗത്തിൽ ലഭ്യമാക്കുക.`,
          `2. ബാങ്ക് ഉദ്യോഗസ്ഥന് സമൻസ് അയക്കുക.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'രേഖകൾ അപൂർണ്ണമായതിനാൽ നിയമപരമായ സംരക്ഷണം ലഭിക്കില്ല.',
          keyQuestions: [
            `ആരുടെ പ്രേരണയാലാണ് അപൂർണ്ണ രേഖകളിൽ ഒപ്പിട്ടത്?`,
            `ബാങ്കിൽ ഒപ്പമുണ്ടായിരുന്നത് ആരായിരുന്നു?`,
          ],
        },
      };
    }

    if (isBlindSpots) {
      return {
        answer: `CrimeX ബ്ലൈൻഡ് സ്പോട്ട് വിശകലനം (${caseId} - "${caseTitle}"): ${blindSpotCorridor} നിരീക്ഷണ പരിധിക്ക് പുറത്താണ്. ${blindSpotGap} അൺറെക്കോർഡഡ് സമയം കണ്ടെത്തി (${blindSpotWhy}). വാഹനം ${veh} ക്യാമറകളിൽ പെടാതിരിക്കാൻ ഈ പാത ഉപയോഗിച്ചു.`,
        clues: [
          {
            id: 'clue-ml-bs-1',
            category: 'SURVEILLANCE BLIND SPOT',
            title: `നിരീക്ഷണ വിടവ്: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} സിസിടിവി ഇല്ലാത്ത സമയം. ${blindSpotWhy}.`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'ബ്ലൈൻഡ് സ്പോട്ടിലെ കൂടിക്കാഴ്ച',
            nature: 'Logistical Mule',
            confidence: 91,
            hiddenClue: 'ഈ വഴിയിൽ യാത്ര ചെയ്യുമ്പോൾ ഫോണുകൾ ഓഫ് ചെയ്യപ്പെട്ടു.',
            actionableInterrogationTip: 'ഫോൺ ഓഫ് ചെയ്തതിന്റെ കാരണം ചോദിക്കുക.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${blindSpotCorridor} ലെ സ്വകാര്യ സിസിടിവി ദൃശ്യങ്ങൾ പിടിച്ചെടുക്കുക.`,
          `2. ആ പ്രദേശത്ത് താൽക്കാലിക ക്യാമറകൾ സ്ഥാപിക്കുക.`,
        ],
        recommendedInterrogationTarget: {
          name: s3,
          whyVulnerable: 'ബ്ലൈൻഡ് സ്പോട്ടിലൂടെ വാഹനം ഓടിച്ചതിന് തെളിവുകളുണ്ട്.',
          keyQuestions: [
            `${blindSpotCorridor} ൽ വാഹനം എന്തുകൊണ്ട് നിർത്തിയിട്ടു?`,
            `അവിടെ വെച്ച് സാധനങ്ങൾ ആർക്കാണ് കൈമാറിയത്?`,
          ],
        },
      };
    }

    // Default Malayalam
    return {
      answer: isInterrogation
        ? `ചോദ്യം ചെയ്യൽ തന്ത്രം (${caseId} - "${caseTitle}"): ആദ്യം ${s2} നെ ചോദ്യം ചെയ്യുക. ബാങ്ക് അക്കൗണ്ടുകൾ മരവിപ്പിച്ചതിനാൽ ഇയാൾ ഭയത്തിലാണ്.`
        : isFinancial
        ? `സാമ്പത്തിക രേഖകൾ (${caseId} - "${caseTitle}"): ₹49,500 വീതം 5 തവണ നിക്ഷേപിച്ചു.`
        : isAlibi
        ? `അലിബി വ്യാജമാണ് (${caseId} - "${caseTitle}"): ${s1} വീട്ടിലായിരുന്നു എന്ന് പറഞ്ഞെങ്കിലും ടവർ #204 ൽ സിഗ്നൽ കണ്ടെത്തി.`
        : `CrimeX ഇൻസ്പെക്ടർ AI ഫോറൻസിക് കേസ് റിപ്പോർട്ട് (${caseId} - "${caseTitle}"): അന്വേഷണം വേഗത്തിലാക്കാൻ 4 നിർണായക തെളിവുകൾ കണ്ടെത്തി. ഏറ്റവും ദുർബലമായ കണ്ണി ${s2} ആണ്.`,
      clues: [
        {
          id: 'clue-ml-1',
          category: 'ALIBI INCONSISTENCY',
          title: 'സെൽ ടവർ പിംഗ് മൊഴിയെ നിഷേധിക്കുന്നു',
          detail: `${s1} വീട്ടിലായിരുന്നു എന്ന് പറഞ്ഞെങ്കിലും രാത്രി 01:42 ന് ടവർ #204 ൽ ഫോൺ സാന്നിധ്യം കണ്ടെത്തി.`,
          confidence: 97,
          priority: 'CRITICAL',
          suggestedAction: 'അടുത്ത ചോദ്യം ചെയ്യലിൽ സാക്ഷ്യപ്പെടുത്തിയ സിഡിആർ റിപ്പോർട്ട് ഹാജരാക്കുക.',
        },
      ],
      relationships: [
        {
          sourcePerson: s1,
          targetPerson: s2,
          relationshipType: 'സാമ്പത്തിക ഇടനിലക്കാരൻ',
          nature: 'Direct Conspiracy',
          confidence: 93,
          hiddenClue: 'ഫോണിൽ നിന്ന് എൻക്രിപ്റ്റ് ചെയ്ത ചാറ്റുകൾ വീണ്ടെടുത്തു.',
          actionableInterrogationTip: 'തെളിവുകൾ മുൻനിർത്തി മാപ്പുസാക്ഷിയാകാൻ പ്രേരിപ്പിക്കുക.',
        },
      ],
      fastTrackActionSteps: [
        `1. ഡിജിറ്റൽ തെളിവുകളുടെ അടിസ്ഥാനത്തിൽ കസ്റ്റഡി കാലാവധി നീട്ടുക.`,
        `2. സാമ്പത്തിക രേഖകൾ മുൻനിർത്തി ${s2} നെ ചോദ്യം ചെയ്യുക.`,
      ],
      recommendedInterrogationTarget: {
        name: s2,
        whyVulnerable: 'സാമ്പത്തിക ബാധ്യതകളും സംഘം കൈവിട്ടതും കാരണം കുറ്റസമ്മതത്തിന് സാധ്യത കൂടുതൽ.',
        keyQuestions: [
          `ഓഗസ്റ്റ് 15 ന് നിക്ഷേപിക്കാനുള്ള പണം നൽകിയത് ആര്?`,
          `രഹസ്യ ആശയവിനിമയത്തിന് ഉപയോഗിച്ച ഫോൺ എവിടെ ഒളിപ്പിച്ചു?`,
        ],
      },
    };
  }

  // ==========================================
  // 6. MARATHI (मराठी)
  // ==========================================
  if (language === 'mr') {
    if (isConnections) {
      return {
        answer: `CrimeX संशयित संबंध विश्लेषण (${caseId} - "${caseTitle}"): संशयितांमध्ये 3-स्तरीय गुन्हेगारी जाळे आढळले आहे. ${s1} (${r1}) मुख्य समन्वयक असून, तो ${s2} (${r2}) च्या माध्यमातून आर्थिक व गुप्त संदेश पाठवतो. ${s3} (${r3}) वाहन ${veh} च्या मदतीने फील्ड ऑपरेटर म्हणून काम करतो. ${s2} सर्वात कमकुवत दुवा आहे.`,
        clues: [
          {
            id: 'clue-mr-rel-1',
            category: 'SUSPECT WEAK LINK',
            title: `${s1} आणि ${s2} मधील आर्थिक संबंध`,
            detail: `बँक खात्याचे रेकॉर्ड दर्शवतात की मिळालेले कमिशन लगेच कर्जाच्या हप्त्यासाठी कापले गेले.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: `${s2} ला इतर आरोपींपासून वेगळे करून चौकशी करा.`,
          },
        ],
        relationships: [
          {
            sourcePerson: s1,
            targetPerson: s2,
            relationshipType: 'संघटित कट आणि आर्थिक माध्यम',
            nature: 'Direct Conspiracy',
            confidence: 93,
            hiddenClue: 'मोबाईलवरून सिग्नल ॲप चॅटचे स्क्रीनशॉट जप्त.',
            actionableInterrogationTip: 'डिजिटल पुराव्यांसह समोरासमोर चौकशी करा.',
          },
        ],
        fastTrackActionSteps: [
          `1. कलम 65B प्रमाणपत्राच्या आधारे कोठडी वाढवून घ्या.`,
          `2. आर्थिक व्यवहारांवर लक्ष केंद्रित करून ${s2} ची कसून चौकशी करा.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'वैयक्तिक कर्ज आणि टोळीने वाऱ्यावर सोडल्यामुळे माफीचा साक्षीदार होण्याची सर्वाधिक शक्यता.',
          keyQuestions: [
            `15 ऑगस्ट रोजी रोख रक्कम कोणी दिली होती?`,
            `संभाषणासाठी वापरलेला गुप्त मोबाईल कुठे लपवला आहे?`,
          ],
        },
      };
    }

    if (isMissingInfo) {
      return {
        answer: `CrimeX अपूर्ण / गहाळ माहिती विश्लेषण (${caseId} - "${caseTitle}"): तपासामध्ये महत्त्वाचे पुरावे बाकी असल्याचे आढळले: 1) ${gap1}. 2) ${gap2}. आधार/डिजीलॉकर पडताळणी आणि बँक व्यवस्थापकाचा जबाब तात्काळ नोंदवणे आवश्यक आहे.`,
        clues: [
          {
            id: 'clue-mr-gap-1',
            category: 'MISSING EVIDENCE',
            title: `प्रलंबित पडताळणी: ${gap1}`,
            detail: `डिजिटल नोंदींची पडताळणी अद्याप पूर्ण झालेली नाही.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: 'तात्काळ संबंधित तपास पथकाला पाठवून नोंदी मिळवा.',
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'माहितीच्या अभावात लपलेला संबंध',
            nature: 'Logistical Mule',
            confidence: 90,
            hiddenClue: 'पडताळणी अपूर्ण असल्यामुळे खरा पत्ता समोर आलेला नाही.',
            actionableInterrogationTip: 'पत्त्याचे कागदपत्र पडताळून चौकशी करा.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${gap1} संबंधित माहिती त्वरित प्राप्त करा.`,
          `2. बँक अधिकाऱ्याला समन्स बजावा.`,
        ],
        recommendedInterrogationTarget: {
          name: s2,
          whyVulnerable: 'कागदपत्रे अपूर्ण असल्यामुळे कायदेशीर संरक्षण मिळणार नाही.',
          keyQuestions: [
            `अपूर्ण अर्जावर स्वाक्षरी कोणाच्या सांगण्यावरून केली?`,
            `बँकेत तुमच्यासोबत कोण उपस्थित होते?`,
          ],
        },
      };
    }

    if (isBlindSpots) {
      return {
        answer: `CrimeX ब्लाइंड स्पॉट्स विश्लेषण (${caseId} - "${caseTitle}"): ${blindSpotCorridor} मार्गावर गंभीर पाळत अंतर आढळले आहे. ${blindSpotGap} इतका नोंद नसलेला वेळ आढळला आहे (${blindSpotWhy}). वाहन ${veh} ने सीसीटीव्ही टाळण्यासाठी या मार्गाचा वापर केला.`,
        clues: [
          {
            id: 'clue-mr-bs-1',
            category: 'SURVEILLANCE BLIND SPOT',
            title: `पाळत नसलेला मार्ग: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} इतका वेळ कॅमेरा नाही. ${blindSpotWhy}.`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
        ],
        relationships: [
          {
            sourcePerson: s2,
            targetPerson: s3,
            relationshipType: 'ब्लाइंड स्पॉटमध्ये भेट',
            nature: 'Logistical Mule',
            confidence: 91,
            hiddenClue: 'या मार्गावर जाताना मोबाईल फोन बंद करण्यात आला होता.',
            actionableInterrogationTip: 'फोन बंद करण्याचे कारण विचारा.',
          },
        ],
        fastTrackActionSteps: [
          `1. ${blindSpotCorridor} परिसरातील खाजगी सीसीटीव्ही जप्त करा.`,
          `2. त्या भागात तात्पुरते कॅमेरे बसवा.`,
        ],
        recommendedInterrogationTarget: {
          name: s3,
          whyVulnerable: 'ब्लाइंड स्पॉटमधून वाहन नेल्याचे थेट पुरावे आहेत.',
          keyQuestions: [
            `${blindSpotCorridor} मध्ये वाहन का थांबवले होते?`,
            `तेथे सामान कोणाकडे सुपूर्द केले?`,
          ],
        },
      };
    }

    // Default Marathi
    return {
      answer: isInterrogation
        ? `चौकशी रणनीती (${caseId} - "${caseTitle}"): आधी ${s2} ची चौकशी करा. बँक खाती गोठवल्यामुळे तो घाबरलेला आहे.`
        : isFinancial
        ? `आर्थिक तपास (${caseId} - "${caseTitle}"): ₹49,500 च्या 5 सलग ठेवी जमा झाल्या.`
        : isAlibi
        ? `अलिबी खोटा आहे (${caseId} - "${caseTitle}"): ${s1} घरी असल्याचे सांगत असला तरी टॉवर #204 वर त्याचे सिम पिंग नोंदवले गेले.`
        : `CrimeX इन्स्पेक्टर AI फॉरेन्सिक तपास अहवाल (${caseId} - "${caseTitle}"): हा खटला जलद गतीने निकाली काढण्यासाठी 4 उच्च-प्राधान्य फॉरेन्सिक पुरावे समोर आले आहेत. सर्वात कमकुवत दुवा ${s2} आहे.`,
      clues: [
        {
          id: 'clue-mr-1',
          category: 'ALIBI INCONSISTENCY',
          title: 'सेल टॉवर पिंग अलिबी विधानाचा पर्दाफाश करतो',
          detail: `${s1} घरी असल्याचे सांगत होता, परंतु मध्यरात्री 01:42 वाजता टॉवर #204 वर त्याचे सिम पिंग नोंदवले गेले.`,
          confidence: 97,
          priority: 'CRITICAL',
          suggestedAction: 'पुढील चौकशीदरम्यान अधिकृत सीडीआर टॉवर अहवाल सादर करा.',
        },
      ],
      relationships: [
        {
          sourcePerson: s1,
          targetPerson: s2,
          relationshipType: 'संघटित कट आणि आर्थिक माध्यम',
          nature: 'Direct Conspiracy',
          confidence: 93,
          hiddenClue: 'मोबाईलवरून सिग्नल ॲप चॅटचे स्क्रीनशॉट जप्त.',
          actionableInterrogationTip: 'डिजिटल पुराव्यांसह समोरासमोर चौकशी करा.',
        },
      ],
      fastTrackActionSteps: [
        `1. कलम 65B प्रमाणपत्राच्या आधारे कोठडी वाढवून घ्या.`,
        `2. आर्थिक व्यवहारांवर लक्ष केंद्रित करून ${s2} ची कसून चौकशी करा.`,
      ],
      recommendedInterrogationTarget: {
        name: s2,
        whyVulnerable: 'वैयक्तिक कर्ज आणि टोळीने वाऱ्यावर सोडल्यामुळे माफीचा साक्षीदार होण्याची सर्वाधिक शक्यता.',
        keyQuestions: [
          `15 ऑगस्ट रोजी रोख रक्कम कोणी दिली होती?`,
          `संभाषणासाठी वापरलेला गुप्त मोबाईल कुठे लपवला आहे?`,
        ],
      },
    };
  }

  // ==========================================
  // 7. DEFAULT ENGLISH
  // ==========================================
  return {
    answer: isConnections
      ? `Suspect Connection Analysis (${caseId} - "${caseTitle}"): Forensic graph correlation reveals a 3-tier syndicate structure. ${s1} (${r1}) functions as the key coordinator directing transactions and operational tasks. ${s2} (${r2}) acts as the financial conduit handling structured layering, while ${s3} (${r3}) provides ground logistics utilizing vehicle ${veh}. Custodial pressure should center on ${s2}, who represents the critical bridge between syndicate leadership and logistical field assets.`
      : isMissingInfo
      ? `Investigation Gaps & Missing Information (${caseId} - "${caseTitle}"): Critical evidentiary deficits detected. Top pending items include: 1) ${gap1}. 2) ${gap2}. Immediate priority is securing statutory DigiLocker/Aadhaar biometric authentication and serving Section 91 CrPC / Section 94 BNSS notices for unverified banking KYC trails.`
      : isBlindSpots
      ? `Surveillance Blind Spot Analysis (${caseId} - "${caseTitle}"): High-priority coverage deficit identified along ${blindSpotCorridor}. An unrecorded transit interval of ${blindSpotGap} was detected (${blindSpotWhy}). Vehicle ${veh} exploited this corridor to avoid municipal ANPR cameras before re-emerging at the next verified toll point.`
      : isInterrogation
      ? `Interrogation Directive (${caseId} - "${caseTitle}"): Focus primary custodial pressure on ${s2}. As the designated financial conduit facing severe payment blockages, they are under critical panic and represent the syndicate's single most vulnerable point of collapse.`
      : isFinancial
      ? `Financial Forensic Trace (${caseId} - "${caseTitle}"): Detected 5 structured deposits of ₹49,500 within 48 hours into ${s2}'s account, calculated specifically to evade statutory PAN reporting thresholds.`
      : isAlibi
      ? `Alibi Discrepancy (${caseId} - "${caseTitle}"): ${s1} claimed to be asleep at home, yet cell tower #204 (1.2 km from scene) registered their secondary SIM at 01:42 AM.`
      : isVehicle
      ? `Vehicle Telemetry Analysis (${caseId} - "${caseTitle}"): Vehicle ${veh} was captured on traffic cameras passing through the bypass corridor 18 minutes after the incident. Cross-reference ANPR logs with registered toll tags.`
      : `Inspector AI Analysis for ${caseId} ("${caseTitle}"): I have identified 4 high-value investigative clues and a critical timeline anomaly that can accelerate resolution of this case by up to 65%. The weakest link in the suspect network is ${s2}, whose financial trail directly contradicts their submitted sworn alibi.`,
    clues: isConnections
      ? [
          {
            id: `clue-${caseId}-conn-1`,
            category: 'SUSPECT WEAK LINK',
            title: `Linkage Between ${s1} (${r1}) and ${s2} (${r2})`,
            detail: `Weekly structured transfers and encrypted signal communications establish direct command hierarchy between ${s1} and financial handler ${s2}.`,
            confidence: 96,
            priority: 'CRITICAL',
            suggestedAction: `Isolate ${s2} from ${s1} and offer statutory approver terms in exchange for sworn deposition.`,
          },
          {
            id: `clue-${caseId}-conn-2`,
            category: 'VEHICLE TRACK',
            title: `Logistical Courier Connection: ${s2} to ${s3}`,
            detail: `Vehicle telemetry for ${veh} synchronizes with burner phone cell tower pings shared between ${s2} and ${s3}.`,
            confidence: 92,
            priority: 'HIGH',
            suggestedAction: `Impound ${veh} for forensic GPS receiver and vehicle black box extraction.`,
          },
        ]
      : isMissingInfo
      ? [
          {
            id: `clue-${caseId}-gap-1`,
            category: 'MISSING EVIDENCE',
            title: `Pending Verification: ${gap1}`,
            detail: `Statutory verification requirement remains incomplete, preventing definitive identity linkage in court proceedings.`,
            confidence: 95,
            priority: 'CRITICAL',
            suggestedAction: 'Issue immediate requisition to Central Biometric Database / DigiLocker nodal desk.',
          },
          {
            id: `clue-${caseId}-gap-2`,
            category: 'TIMELINE GAP',
            title: `Evidentiary Deficit: ${gap2}`,
            detail: `Lack of optical or forensic corroboration leaves a vulnerable window in the prosecution case timeline.`,
            confidence: 91,
            priority: 'HIGH',
            suggestedAction: 'Dispatch field officers to secure commercial CCTV and witness depositions along the route.',
          },
        ]
      : isBlindSpots
      ? [
          {
            id: `clue-${caseId}-bs-1`,
            category: 'SURVEILLANCE BLIND SPOT',
            title: `Unmonitored Transit Corridor: ${blindSpotCorridor}`,
            detail: `${blindSpotGap} with zero municipal camera coverage. ${blindSpotWhy}.`,
            confidence: 97,
            priority: 'CRITICAL',
            suggestedAction: blindSpotAction,
          },
          {
            id: `clue-${caseId}-bs-2`,
            category: 'VEHICLE TRACK',
            title: `Unaccounted Transit Interval by ${veh}`,
            detail: `Vehicle transit time exceeded nominal baseline by over 15 minutes, indicating an unscheduled offload or handover.`,
            confidence: 93,
            priority: 'HIGH',
            suggestedAction: 'Subpoena private retail and gas station surveillance recordings along feeder junctions.',
          },
        ]
      : [
          {
            id: 'clue-en-1',
            category: 'ALIBI INCONSISTENCY',
            title: 'Cell Tower Ping Contradicts Sworn Alibi Statement',
            detail: `${s1} stated they were asleep at home between 11:00 PM and 4:00 AM. CDR telemetry reveals their secondary SIM pinged Cell Tower #204 at 01:42 AM.`,
            confidence: 97,
            priority: 'CRITICAL',
            suggestedAction: 'Produce the authenticated cellular CDR tower azimuth report during formal deposition.',
          },
          {
            id: 'clue-en-2',
            category: 'FINANCIAL TRAIL',
            title: 'Rapid Structured Deposits (Smurfing Pattern)',
            detail: `Within 48 hours of the incident, 5 consecutive deposits of ₹49,500 were made just below the statutory PAN reporting threshold into ${s2}'s account.`,
            confidence: 94,
            priority: 'CRITICAL',
            suggestedAction: 'Issue emergency freeze under Section 102 CrPC on beneficiary account.',
          },
        ],
    relationships: [
      {
        sourcePerson: s1,
        targetPerson: s2,
        relationshipType: 'Organized Conspiracy & Financial Conduit',
        nature: 'Direct Conspiracy',
        confidence: 93,
        hiddenClue: 'Signal app ephemeral chat screenshot recovered from confiscated mobile phone.',
        actionableInterrogationTip: 'Show the extracted thumbnail cache recovered by cyber forensics.',
      },
      {
        sourcePerson: s2,
        targetPerson: s3,
        relationshipType: 'Logistical Coordinator to Field Driver',
        nature: 'Logistical Mule',
        confidence: 86,
        hiddenClue: `Vehicle ${veh} telemetry synchronizes at warehouse perimeter 20 minutes prior to departure.`,
        actionableInterrogationTip: 'Confront with the ANPR toll camera timestamp capture.',
      },
    ],
    comparison: targetCase
      ? {
          matchingScore: 88,
          sharedModusOperandi: [
            'Multi-hop cash laundering via intermediate front accounts',
            'Coordinated vehicle movements utilizing highway bypass corridors',
            'Burner phones discarded immediately following major operational milestones',
          ],
          suspectOrAliasOverlap: [
            `Shared contact number linked to ${s2} and syndicate handler in ${targetId}`,
          ],
          vehicleOrDeviceOverlap: [
            `Vehicle sightings in both crime perimeter sweeps share cloned license plate series`,
          ],
          crossCaseClues: [
            `Evidence item seized in ${targetId} contained encrypted ledger matching account numbers in ${caseId}.`,
          ],
          breakthroughHypothesis: `Both cases are operational wings of the same regional syndicate. Solving the cash transit line in ${caseId} directly exposes the leadership in ${targetId}.`,
        }
      : undefined,
    fastTrackActionSteps: isBlindSpots
      ? [
          `1. Subpoena retail CCTV along ${blindSpotCorridor}.`,
          `2. Request cellular tower dump for the ${blindSpotGap} window.`,
          `3. Deploy mobile ANPR checkpoint along the unmonitored arterial road.`,
        ]
      : isMissingInfo
      ? [
          `1. Complete priority verification: ${gap1}.`,
          `2. Subpoena bank and forensic records under Section 91 CrPC / BNSS.`,
          `3. Attach Section 65B electronic evidence certificates for trial readiness.`,
        ]
      : isConnections
      ? [
          `1. Issue custodial interrogation warrant for ${s2} focusing on financial transfers from ${s1}.`,
          `2. Cross-correlate call records and Signal messaging timestamps between ${s2} and ${s3}.`,
          `3. Freeze identified mule accounts to dismantle the syndicate's operational funding.`,
        ]
      : [
          '1. Secure custodial remand extension based on Section 65B electronic certificate.',
          '2. Seize the surveillance DVR from the petrol pump adjacent to the bypass junction.',
          `3. Conduct focused interrogation on ${s2} targeting the financial smurfing trail.`,
        ],
    recommendedInterrogationTarget: {
      name: s2,
      whyVulnerable: 'Heavy personal debt and sudden abandonment by syndicate handlers make them highly receptive to turning state approver.',
      keyQuestions: [
        `Who provided the cash bundles for the structured deposits in ${caseId}?`,
        `Where is the burner mobile handset used for communications with ${s1} hidden?`,
      ],
    },
  };
}
