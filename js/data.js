/**
 * Data Models, Constants, and Initial Presets
 */

export const MAX_PROVINCES = 100;

export const INITIAL_POLITICAL_PARTIES = {
  "party_pfp": {
    id: "party_pfp",
    name: "Partido Federal ng Pilipinas",
    abbreviation: "PFP",
    ideology: "Federalism / Center-Right",
    popularity: 0.35,
    platform: ["Decentralization", "Infrastructure Expansion", "Agricultural Modernization"],
    leadership: { chairperson: "cand_pfp_chair" },
    coalitionId: "bagong_pilipinas"
  },
  "party_lakas": {
    id: "party_lakas",
    name: "Lakas–CMD",
    abbreviation: "Lakas",
    ideology: "Christian Democracy / Center-Right",
    popularity: 0.30,
    platform: ["Economic Growth", "Legislative Cooperation", "Local Governance"],
    leadership: { chairperson: "cand_lakas_chair" },
    coalitionId: "bagong_pilipinas"
  }
};

export const INITIAL_LEGAL_DATABASE = {
  "RA_11964": {
    id: "RA_11964",
    type: "RepublicAct",
    number: "11964",
    title: "Automatic Income Classification of Local Government Units Act",
    date: "2023-10-26",
    status: "active",
    amends: ["RA_7160"],
    amendedBy: [],
    repeals: [],
    repealedBy: [],
    institution: "Congress of the Philippines",
    topic: "Local Government Finance",
    provisions: [
      {
        section: "Section 4",
        title: "Income Classifications",
        content: "Provinces, cities, and municipalities shall be classified into six (6) main classes based on their average annual regular income."
      },
      {
        section: "Section 6",
        title: "Automatic Reclassification",
        content: "The Department of Finance shall automatically reclassify LGUs every three (3) fiscal years based on regular revenue figures."
      }
    ],
    gameMechanics: [
      "Automatically assigns LGU income classes (1st to 6th) without manual override.",
      "Recalculates LGU regular income during annual economic updates."
    ],
    source: "Official Gazette of the Republic of the Philippines"
  },
  "RA_7160": {
    id: "RA_7160",
    type: "RepublicAct",
    number: "7160",
    title: "Local Government Code of 1991",
    date: "1991-10-10",
    status: "active",
    amends: [],
    amendedBy: ["RA_11964"],
    repeals: [],
    repealedBy: [],
    institution: "Congress of the Philippines",
    topic: "Local Governance & Decentralization",
    provisions: [
      {
        section: "Section 41",
        title: "Manner of Election",
        content: "The Sangguniang Panlalawigan, Sangguniang Panlungsod, and Sangguniang Bayan shall be elected by legislative or provincial districts."
      }
    ],
    gameMechanics: [
      "Mandates minimum 2 Provincial Districts per province for Sangguniang Panlalawigan representation.",
      "Governs local ordinance enactment and local taxation authority."
    ],
    source: "Lawphil / Official Gazette"
  },
  "CONST_1987_ART_VI": {
    id: "CONST_1987_ART_VI",
    type: "Constitution",
    number: "1987-Art6",
    title: "1987 Constitution: Article VI - The Legislative Department",
    date: "1987-02-02",
    status: "active",
    amends: [],
    amendedBy: [],
    repeals: [],
    repealedBy: [],
    institution: "Constitutional Commission",
    topic: "Legislative Structure & Procedure",
    provisions: [
      {
        section: "Section 5(1)",
        title: "House Composition & Apportionment",
        content: "The House of Representatives shall be composed of not more than two hundred and fifty members, unless otherwise fixed by law..."
      },
      {
        section: "Section 24",
        title: "Bills Originating in the House",
        content: "All appropriation, revenue or tariff bills, bills authorizing increase of the public debt, bills of local application, and private bills shall originate exclusively in the House of Representatives."
      }
    ],
    gameMechanics: [
      "National budget and tax measures must originate in the House of Representatives engine.",
      "Legislative reapportionment statutes require separate enactment from Sangguniang Panlalawigan district splits."
    ],
    source: "Official Gazette of the Republic of the Philippines"
  }
};

export function createCandidateModel(data) {
  return {
    id: data.id,
    firstName: data.firstName || "",
    middleName: data.middleName || "",
    lastName: data.lastName || "",
    suffix: data.suffix || "",
    age: data.age || 40,
    dateOfBirth: data.dateOfBirth || "1984-01-01",
    gender: data.gender || "Unspecified",
    nationality: data.nationality || "Filipino",
    portraitUrl: data.portraitUrl || "",
    partyId: data.partyId || "independent",
    position: data.position || "Representative",
    provinceId: data.provinceId || null,
    lguId: data.lguId || null,
    districtId: data.districtId || null,
    isIncumbent: Boolean(data.isIncumbent),
    politicalExperienceYears: data.politicalExperienceYears || 0,
    previousOffices: data.previousOffices || [],
    occupation: data.occupation || "",
    education: data.education || "",
    biography: data.biography || "",
    policyPositions: data.policyPositions || {},
    electionStatus: data.electionStatus || "declared",
    ballotNumber: data.ballotNumber || null,
    votesReceived: data.votesReceived || 0
  };
}

export function getCandidateDisplayName(candidate) {
  if (!candidate) return "Unknown Candidate";
  const { firstName, middleName, lastName, suffix } = candidate;
  const middleInitial = middleName ? `${middleName.charAt(0)}.` : "";
  return [firstName, middleInitial, lastName, suffix].filter(Boolean).join(" ");
}

export function createBudgetItem(data) {
  return {
    id: data.id || `budget_item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    departmentId: data.departmentId,
    programName: data.programName,
    category: data.category || "Personnel Services",
    proposedAmount: data.proposedAmount || 0,
    houseAmount: data.houseAmount ?? data.proposedAmount,
    senateAmount: data.senateAmount ?? data.proposedAmount,
    enactedAmount: data.enactedAmount ?? data.proposedAmount,
    isMandatory: Boolean(data.isMandatory)
  };
}

export function createLGUBudgetModel(lguId, regularIncome, internalRevenueAllotment) {
  const totalRevenue = regularIncome + internalRevenueAllotment;
  return {
    lguId,
    fiscalYear: 2026,
    estimatedRevenue: totalRevenue,
    regularIncome,
    internalRevenueAllotment,
    allocations: {
      personalServices: totalRevenue * 0.40,
      developmentFund: totalRevenue * 0.20,
      drrmFund: totalRevenue * 0.05,
      healthServices: totalRevenue * 0.15,
      generalServices: totalRevenue * 0.20
    },
    status: "enacted"
  };
}