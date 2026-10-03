/**
 * UI Rendering Engine, Global Edit Mode Controls, and Dashboard Views
 */

import { validateAdministrativeHierarchy, searchLegalFramework } from './world.js';
import { getCandidateDisplayName } from './data.js';

export let isEditMode = false;

export function toggleEditMode(enabled, state) {
  isEditMode = enabled;
  document.body.classList.toggle('edit-mode-active', isEditMode);
  
  const editBanner = document.getElementById('edit-mode-banner');
  if (editBanner) {
    editBanner.style.display = isEditMode ? 'flex' : 'none';
  }

  if (!isEditMode) {
    const validation = validateAdministrativeHierarchy(state);
    if (!validation.valid) {
      console.warn("Edit Mode validation warnings:", validation.issues);
      alert(`Scenario saved with ${validation.issues.length} potential issue(s). Check console for details.`);
    }
  }
}

export function renderNationSettingsEditor(state, containerEl) {
  const { nation } = state;

  containerEl.innerHTML = `
    <div class="editor-card">
      <h3>Nation Settings ${isEditMode ? '<span class="badge-edit">Edit Mode</span>' : ''}</h3>
      <form id="nation-settings-form">
        <div class="form-group">
          <label>Nation Name:</label>
          <input type="text" id="nation-name" value="${nation.name}" ${!isEditMode ? 'disabled' : ''} />
        </div>
        <div class="form-group">
          <label>Short Name:</label>
          <input type="text" id="nation-short-name" value="${nation.shortName}" ${!isEditMode ? 'disabled' : ''} />
        </div>
        <div class="form-group">
          <label>Currency Symbol / Code:</label>
          <input type="text" id="nation-currency" value="${nation.currency}" ${!isEditMode ? 'disabled' : ''} />
        </div>
        <div class="form-group">
          <label>National Capital LGU:</label>
          <select id="nation-capital-select" ${!isEditMode ? 'disabled' : ''}>
            ${Object.values(state.lgus || {}).map(lgu => `
              <option value="${lgu.id}" ${lgu.id === nation.capitalId ? 'selected' : ''}>
                ${lgu.name} (${lgu.type})
              </option>
            `).join('')}
          </select>
        </div>
        ${isEditMode ? '<button type="submit" class="btn-primary">Save Nation Settings</button>' : ''}
      </form>
    </div>
  `;

  if (isEditMode) {
    document.getElementById('nation-settings-form').addEventListener('submit', (e) => {
      e.preventDefault();
      state.nation.name = document.getElementById('nation-name').value;
      state.nation.shortName = document.getElementById('nation-short-name').value;
      state.nation.currency = document.getElementById('nation-currency').value;
      state.nation.capitalId = document.getElementById('nation-capital-select').value;
      alert("Nation settings updated successfully.");
    });
  }
}

export function renderDistrictsView(provinceId, state, containerEl) {
  const province = state.provinces[provinceId];
  if (!province) return;

  const provincialDistricts = (province.provincialDistrictIds || []).map(id => state.provincialDistricts[id]).filter(Boolean);
  const legislativeDistricts = (province.legislativeDistrictIds || []).map(id => state.legislativeDistricts[id]).filter(Boolean);

  containerEl.innerHTML = `
    <div class="district-management-grid">
      <div class="district-panel">
        <h4>Sangguniang Panlalawigan Districts (Provincial)</h4>
        <p class="section-desc">Districts for provincial legislative seats. Minimum 2 per province.</p>
        <ul class="district-list">
          ${provincialDistricts.map(pd => `
            <li class="district-card">
              <strong>${pd.name}</strong> (Number:${pd.number})
              <div>Population: ${pd.population.toLocaleString()}</div>
              <div>LGUs: ${pd.lguIds.map(id => state.lgus[id]?.name).join(', ')}</div>
              <div>Seats: ${pd.sanggunianSeats || 5}</div>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="district-panel">
        <h4>House Legislative Districts (National)</h4>
        <p class="section-desc">Legally enacted congressional seats representing this province in the House.</p>
        <ul class="district-list">
          ${legislativeDistricts.map(ld => `
            <li class="district-card">
              <strong>${ld.name}</strong> (District${ld.number})
              <div>Population: ${ld.population.toLocaleString()}</div>
              <div>LGUs: ${ld.lguIds.map(id => state.lgus[id]?.name).join(', ')}</div>
              <div>Representative: ${ld.representativeId ? getCandidateDisplayName(state.candidates?.[ld.representativeId]) : 'Vacant'}</div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

export function renderLegalFrameworkTab(state, containerEl) {
  let currentSearch = "";

  function updateView() {
    const entries = searchLegalFramework(currentSearch, state);

    containerEl.innerHTML = `
      <div class="legal-framework-panel">
        <div class="panel-header">
          <h3>Philippine Legal Framework & Reference Database</h3>
          <p class="subtitle">Authoritative statutory bases governing simulator mechanics, governance, and automatic calculations.</p>
        </div>

        <div class="filter-bar">
          <input 
            type="text" 
            id="legal-search-input" 
            placeholder="Search statutes, Republic Acts, Constitution (e.g. RA 11964, budget, LGU)..." 
            value="${currentSearch}" 
          />
        </div>

        <div class="legal-entries-list">
          ${entries.map(entry => `
            <div class="legal-card ${entry.status}">
              <div class="legal-card-header">
                <span class="legal-badge ${entry.type.toLowerCase()}">${entry.type}</span>
                <span class="legal-number">${entry.number ? 'No. ' + entry.number : ''}</span>
                <span class="status-pill status-${entry.status}">${entry.status.toUpperCase()}</span>
              </div>
              <h4 class="legal-title">${entry.title}</h4>
              <div class="legal-meta">
                <span><strong>Topic:</strong> ${entry.topic}</span> | 
                <span><strong>Source:</strong> ${entry.source}</span>
              </div>

              <div class="legal-provisions">
                <h5>Provisions:</h5>
                ${entry.provisions.map(p => `
                  <div class="provision-item">
                    <strong>${p.section} (${p.title}):</strong>
                    <p>"${p.content}"</p>
                  </div>
                `).join('')}
              </div>

              <div class="game-mechanics-link">
                <h5>Bound Simulator Mechanics:</h5>
                <ul>
                  ${entry.gameMechanics.map(m => `<li>⚡ ${m}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('legal-search-input')?.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      updateView();
    });
  }

  updateView();
}

export function renderBudgetTab(state, containerEl) {
  const budget = state.nationalBudget || { items: [], stage: "nep_submission", fiscalYear: 2026 };
  const totalProposed = budget.items.reduce((sum, i) => sum + (i.proposedAmount || 0), 0);
  const totalEnacted = budget.items.reduce((sum, i) => sum + (i.enactedAmount || 0), 0);

  containerEl.innerHTML = `
    <div class="budget-view-container">
      <div class="budget-header-card">
        <h3>National Budget & General Appropriations Act (FY ${budget.fiscalYear})</h3>
        <p><strong>Pipeline Stage:</strong> <span class="badge badge-stage">${budget.stage.replace(/_/g, ' ').toUpperCase()}</span></p>
        <div class="budget-metrics-grid">
          <div class="metric-box">
            <span>Proposed NEP Total:</span>
            <strong>${state.nation.currency} ${totalProposed.toLocaleString()}</strong>
          </div>
          <div class="metric-box">
            <span>Enacted GAA Total:</span>
            <strong>${state.nation.currency} ${totalEnacted.toLocaleString()}</strong>
          </div>
          <div class="metric-box">
            <span>National Treasury:</span>
            <strong>${state.nation.currency} ${(state.nation.treasury || 0).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div class="budget-items-panel mt-4">
        <h4>Departmental & Program Breakdown</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Program</th>
              <th>Category</th>
              <th>Executive NEP</th>
              <th>House GAB</th>
              <th>Senate GAB</th>
              <th>Final GAA</th>
            </tr>
          </thead>
          <tbody>
            ${budget.items.map(item => `
              <tr>
                <td><strong>${item.departmentId}</strong></td>
                <td>${item.programName}</td>
                <td><span class="category-pill">${item.category}</span></td>
                <td>${state.nation.currency}${item.proposedAmount.toLocaleString()}</td>
                <td>${state.nation.currency}${(item.houseAmount || item.proposedAmount).toLocaleString()}</td>
                <td>${state.nation.currency}${(item.senateAmount || item.proposedAmount).toLocaleString()}</td>
                <td><strong>${state.nation.currency}${(item.enactedAmount || item.proposedAmount).toLocaleString()}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}