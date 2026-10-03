/**
 * Turn Simulation Engine: Bicameral Legislation, Budget Execution, and Financial Recalculation
 */

import { getLGUIncomeClassification } from './world.js';
import { createLGUBudgetModel } from './data.js';

export function processLegislativeTurn(state) {
  const bills = state.bills || [];

  bills.forEach(bill => {
    if (bill.status === "enacted" || bill.status === "vetoed") return;

    if (bill.isRevenueOrAppropriation && bill.originatingChamber !== "house" && bill.status === "draft") {
      bill.status = "stalled";
      bill.notes = "Constitutional Violation: Revenue and Appropriations measures must originate in the House of Representatives.";
      return;
    }

    if (bill.status === "introduced") {
      bill.status = bill.originatingChamber === "house" ? "house_committee" : "senate_committee";
    } else if (bill.status === "house_committee") {
      bill.status = "house_floor_debate";
    } else if (bill.status === "house_floor_debate") {
      const passedHouse = (bill.houseVotesFor || 0) > (bill.houseVotesAgainst || 0);
      bill.status = passedHouse ? "passed_house" : "failed_house";
      if (passedHouse) bill.status = "senate_committee";
    } else if (bill.status === "senate_committee") {
      bill.status = "senate_floor_debate";
    } else if (bill.status === "senate_floor_debate") {
      const passedSenate = (bill.senateVotesFor || 0) > (bill.senateVotesAgainst || 0);
      bill.status = passedSenate ? "passed_senate" : "failed_senate";
      if (passedSenate && bill.originatingChamber === "house") {
        bill.status = "bicameral_conference";
      }
    } else if (bill.status === "bicameral_conference") {
      bill.status = "transmitted_to_president";
      bill.transmittedDateTurn = state.currentTurn;
    } else if (bill.status === "transmitted_to_president") {
      if (bill.presidentialAction === "sign") {
        bill.status = "enacted";
      } else if (bill.presidentialAction === "veto") {
        bill.status = "vetoed";
      } else if (state.currentTurn - bill.transmittedDateTurn >= 2) {
        bill.status = "enacted";
        bill.notes = "Enacted into law by constitutional operation (passed without signature).";
      }
    }
  });

  return bills;
}

export function processBudgetTurn(state) {
  const nationalBudget = state.nationalBudget || { fiscalYear: 2026, stage: "nep_submission", items: [] };

  if (nationalBudget.stage === "nep_submission") {
    nationalBudget.stage = "house_deliberations";
    state.newsFeed?.unshift({
      turn: state.currentTurn,
      headline: "Executive Branch Submits National Expenditure Program (NEP) to Congress",
      category: "Budget"
    });
  } else if (nationalBudget.stage === "house_deliberations") {
    nationalBudget.items.forEach(item => {
      if (!item.isMandatory && item.houseAmount === undefined) {
        item.houseAmount = item.proposedAmount;
      }
    });
    nationalBudget.stage = "senate_deliberations";
  } else if (nationalBudget.stage === "senate_deliberations") {
    nationalBudget.stage = "bicameral_committee";
  } else if (nationalBudget.stage === "bicameral_committee") {
    nationalBudget.items.forEach(item => {
      item.enactedAmount = Math.round(((item.houseAmount || item.proposedAmount) + (item.senateAmount || item.proposedAmount)) / 2);
    });
    nationalBudget.stage = "presidential_action";
  } else if (nationalBudget.stage === "presidential_action") {
    if (nationalBudget.presidentialVetoLineItems?.length > 0) {
      nationalBudget.items.forEach(item => {
        if (nationalBudget.presidentialVetoLineItems.includes(item.id)) {
          item.enactedAmount = 0;
        }
      });
    }
    nationalBudget.stage = "gaa_enacted";
    const totalEnactedExpenditure = nationalBudget.items.reduce((sum, i) => sum + i.enactedAmount, 0);
    state.nation.treasury -= totalEnactedExpenditure;
    state.newsFeed?.unshift({
      turn: state.currentTurn,
      headline: `General Appropriations Act (GAA FY ${nationalBudget.fiscalYear}) Official Enacted`,
      category: "Budget"
    });
  }

  state.lguIncomeClassifications = state.lguIncomeClassifications || {};
  Object.values(state.lgus || {}).forEach(lgu => {
    state.lguIncomeClassifications[lgu.id] = getLGUIncomeClassification(lgu.type, lgu.regularIncome || 0);
    const regularIncome = lgu.regularIncome || 100_000_000;
    const ntaShare = Math.round(regularIncome * 0.35);
    state.lguBudgets = state.lguBudgets || {};
    state.lguBudgets[lgu.id] = createLGUBudgetModel(lgu.id, regularIncome, ntaShare);
  });

  state.nationalBudget = nationalBudget;
  return state;
}

export function advanceTurn(state) {
  state.currentTurn += 1;
  processLegislativeTurn(state);
  processBudgetTurn(state);
  return state;
}