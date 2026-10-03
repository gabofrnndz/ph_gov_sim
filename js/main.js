/**
 * Main Application Entry Point
 * Initializes state, wires DOM events, and orchestrates the UI/Sim lifecycle.
 */

import { loadGameState, saveGameState } from './store.js';
import { advanceTurn } from './sim.js';
import { 
  toggleEditMode, 
  isEditMode, 
  renderNationSettingsEditor, 
  renderDistrictsView, 
  renderBudgetTab, 
  renderLegalFrameworkTab 
} from './ui.js';

// Default mock state for initial load if no save exists
const defaultState = {
  currentTurn: 1,
  nation: { 
    name: "Republic of the Philippines", 
    shortName: "Philippines", 
    currency: "PHP", 
    capitalId: "lgu_manila", 
    treasury: 5000000000000 
  },
  provinces: { 
    "prov_cebu": { 
      id: "prov_cebu", 
      name: "Cebu", 
      capitalId: "lgu_cebu", 
      provincialDistrictIds: ["pd_cebu_1", "pd_cebu_2"], 
      legislativeDistrictIds: ["ld_cebu_1", "ld_cebu_2"] 
    } 
  },
  lgus: { 
    "lgu_manila": { id: "lgu_manila", name: "Manila", type: "Highly Urbanized City", regularIncome: 15000000000, population: 1846513 }, 
    "lgu_cebu": { id: "lgu_cebu", name: "Cebu City", type: "Highly Urbanized City", regularIncome: 9000000000, population: 964169 } 
  },
  provincialDistricts: { 
    "pd_cebu_1": { id: "pd_cebu_1", name: "Cebu 1st Provincial", number: 1, population: 500000, lguIds: ["lgu_cebu"], sanggunianSeats: 5 }, 
    "pd_cebu_2": { id: "pd_cebu_2", name: "Cebu 2nd Provincial", number: 2, population: 464169, lguIds: [], sanggunianSeats: 5 } 
  },
  legislativeDistricts: { 
    "ld_cebu_1": { id: "ld_cebu_1", name: "Cebu 1st Legislative", number: 1, population: 500000, lguIds: ["lgu_cebu"] }, 
    "ld_cebu_2": { id: "ld_cebu_2", name: "Cebu 2nd Legislative", number: 2, population: 464169, lguIds: [] } 
  }
};

// Initialize State
let appState = loadGameState() || defaultState;

// Render Controller
function renderApp() {
  renderNationSettingsEditor(appState, document.getElementById('tab-nation'));
  // Hardcoded to render Cebu for demonstration purposes
  renderDistrictsView("prov_cebu", appState, document.getElementById('tab-districts')); 
  renderBudgetTab(appState, document.getElementById('tab-budget'));
  renderLegalFrameworkTab(appState, document.getElementById('tab-legal'));
}

// Global Event Listeners
document.getElementById('btn-toggle-edit').addEventListener('click', () => {
  toggleEditMode(!isEditMode, appState);
  renderApp();
});

document.getElementById('btn-advance-turn').addEventListener('click', () => {
  if (isEditMode) {
    alert("Simulation is paused. Exit Edit Mode to advance the turn.");
    return;
  }
  appState = advanceTurn(appState);
  renderApp();
});

document.getElementById('btn-save-state').addEventListener('click', () => {
  saveGameState(appState);
  alert("Game State Saved Successfully.");
});

// Tab Navigation Logic
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(e.target.dataset.target).classList.add('active');
  });
});

// Initial Render
renderApp();