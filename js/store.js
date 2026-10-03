/**
 * State Storage, Hydration, and Migration System
 */

import { INITIAL_LEGAL_DATABASE, INITIAL_POLITICAL_PARTIES } from './data.js';

const STORAGE_KEY = "ph_gov_sim_save_state";

export function migrateSaveState(loadedState) {
  if (!loadedState) return null;

  if (!loadedState.legalFramework) {
    loadedState.legalFramework = { ...INITIAL_LEGAL_DATABASE };
  } else {
    Object.keys(INITIAL_LEGAL_DATABASE).forEach(key => {
      if (!loadedState.legalFramework[key]) {
        loadedState.legalFramework[key] = INITIAL_LEGAL_DATABASE[key];
      }
    });
  }

  if (!loadedState.politicalParties) {
    loadedState.politicalParties = { ...INITIAL_POLITICAL_PARTIES };
  }
  if (!loadedState.candidates) {
    loadedState.candidates = {};
  }
  if (!loadedState.bills) {
    loadedState.bills = [];
  }

  if (!loadedState.nationalBudget) {
    loadedState.nationalBudget = {
      fiscalYear: 2026,
      stage: "nep_submission",
      items: [
        { id: "b1", departmentId: "DEPED", programName: "Basic Education Facilities", category: "Capital Outlays", proposedAmount: 120_000_000_000, houseAmount: 125_000_000_000, senateAmount: 122_000_000_000, enactedAmount: 123_500_000_000 },
        { id: "b2", departmentId: "DPWH", programName: "Flood Mitigation & Highways", category: "Capital Outlays", proposedAmount: 250_000_000_000, houseAmount: 260_000_000_000, senateAmount: 245_000_000_000, enactedAmount: 252_500_000_000 },
        { id: "b3", departmentId: "DOH", programName: "Health Facilities Enhancement", category: "MOOE", proposedAmount: 80_000_000_000, houseAmount: 85_000_000_000, senateAmount: 88_000_000_000, enactedAmount: 86_500_000_000 }
      ]
    };
  }

  if (!loadedState.lguBudgets) {
    loadedState.lguBudgets = {};
  }

  return loadedState;
}

export function saveGameState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error("Failed to save state to LocalStorage:", err);
  }
}

export function loadGameState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const parsed = JSON.parse(serialized);
    return migrateSaveState(parsed);
  } catch (err) {
    console.error("Failed to load state from LocalStorage:", err);
    return null;
  }
}