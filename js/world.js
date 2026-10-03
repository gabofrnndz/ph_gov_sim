/**
 * World Logic, Administrative Hierarchy, and Statutory Calculation Engines
 */

import { MAX_PROVINCES, INITIAL_LEGAL_DATABASE } from './data.js';

export const RA_11964_THRESHOLDS = {
  province: [
    { min: 1_500_000_000, class: "1st" },
    { min: 900_000_000, class: "2nd" },
    { min: 700_000_000, class: "3rd" },
    { min: 500_000_000, class: "4th" },
    { min: 300_000_000, class: "5th" },
    { min: 0, class: "6th" }
  ],
  city: [
    { min: 1_300_000_000, class: "1st" },
    { min: 800_000_000, class: "2nd" },
    { min: 600_000_000, class: "3rd" },
    { min: 400_000_000, class: "4th" },
    { min: 240_000_000, class: "5th" },
    { min: 0, class: "6th" }
  ],
  municipality: [
    { min: 200_000_000, class: "1st" },
    { min: 160_000_000, class: "2nd" },
    { min: 130_000_000, class: "3rd" },
    { min: 100_000_000, class: "4th" },
    { min: 70_000_000, class: "5th" },
    { min: 0, class: "6th" }
  ]
};

export function getLGUIncomeClassification(lguType, regularIncome) {
  if (lguType === "Barangay") {
    return { incomeClass: "N/A", note: "Barangays do not have income classifications under RA 11964." };
  }

  const normalizedType = lguType.toLowerCase().includes("city") ? "city" : 
                         lguType.toLowerCase().includes("province") ? "province" : "municipality";

  const brackets = RA_11964_THRESHOLDS[normalizedType];
  const matched = brackets.find(b => regularIncome >= b.min);

  return {
    incomeClass: matched ? matched.class : "6th",
    regularIncome,
    statute: "RA 11964"
  };
}

export function validateAdministrativeHierarchy(state) {
  const issues = [];
  const provinces = Object.values(state.provinces || {});

  if (provinces.length > MAX_PROVINCES) {
    issues.push(`Province count (${provinces.length}) exceeds national maximum limit of ${MAX_PROVINCES}.`);
  }

  if (state.nation && state.nation.capitalId) {
    if (!state.lgus[state.nation.capitalId]) {
      issues.push(`National capital ID '${state.nation.capitalId}' does not point to a valid LGU.`);
    }
  }

  provinces.forEach(p => {
    if (p.capitalId && !state.lgus[p.capitalId]) {
      issues.push(`Capital of province '${p.name}' (${p.capitalId}) is not a recognized LGU.`);
    }
    const provincialDistricts = (p.provincialDistrictIds || []).map(id => state.provincialDistricts[id]).filter(Boolean);
    if (provincialDistricts.length < 2) {
      issues.push(`Province '${p.name}' has fewer than 2 Provincial Districts (violates LGC requirements).`);
    }
  });

  return { valid: issues.length === 0, issues };
}

export function getLegalEntry(legalId, state) {
  const db = state.legalFramework || INITIAL_LEGAL_DATABASE;
  return db[legalId] || null;
}

export function searchLegalFramework(query, state) {
  const db = state.legalFramework || INITIAL_LEGAL_DATABASE;
  if (!query) return Object.values(db);

  const q = query.toLowerCase();
  return Object.values(db).filter(entry => 
    entry.title.toLowerCase().includes(q) ||
    entry.number?.toLowerCase().includes(q) ||
    entry.topic.toLowerCase().includes(q) ||
    entry.provisions.some(p => p.content.toLowerCase().includes(q) || p.title.toLowerCase().includes(q))
  );
}