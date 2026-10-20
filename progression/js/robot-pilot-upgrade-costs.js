import { toInt, thousandSeperator, getStrAmount, getPilotRankByLevel } from '/warrobots-calculator-beta/js/data-helper.js?v=1.15.0-beta';
import { resetInputs, updateNumberInput } from '/warrobots-calculator-beta/js/input-helper.js?v=1.15.0-beta';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator-beta/js/modifier-helper.js?v=1.15.0-beta';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const inputExperienceBoostPercentage = document.getElementById('inputExperienceBoostPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalGoldAmount = document.getElementById('totalGoldAmount');
    const spanTotalMemoriumAmount = document.getElementById('totalMemoriumAmount');
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanExperienceAmount, spanGoldAmount, spanMemoriumAmount, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0, experienceBoostPercentage = 0;
    let quantity = 0, experienceAmount = 0, goldAmount = 0, memoriumAmount = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalMemoriumAmount = 0, totalGoldAmount = 0, totalUpgradeTokens = 0;
    let i, j, k;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));
    experienceBoostPercentage = Math.abs(toInt(inputExperienceBoostPercentage.value));

    for (i = 0; i < DS_ROBOT_PILOT_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ROBOT_PILOT_UPGRADE_COSTS[i].length; j++) {
            // To skip Tier 1 Pilot skill upgrade.
            if (INDEX_TO_SKIP.includes(i) && j == 0) {
                continue;
            }

            spanMemoriumAmount = document.getElementById(`spanMemoriumAmount${TYPES[i]}_${j}`);
            spanUpgradeTokens = document.getElementById(`spanUpgradeTokens${TYPES[i]}_${j}`);

            // For tracking the XP Boost costs.
            if (i == 0) {
                for (k = DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].fromLevel; k <= DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].toLevel; k++) {
                    inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}_${k}`);
                    spanExperienceAmount = document.getElementById(`spanExperienceAmount${TYPES[i]}_${j}_${k}`);
                    spanGoldAmount = document.getElementById(`spanGoldAmount${TYPES[i]}_${j}_${k}`);
                    
                    // Calculate and update relevant span elements.
                    quantity = toInt(inputQuantity.value);
                    experienceAmount = DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['xp'] * quantity;
                    if (DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['currency'] == 'Gold') {
                        goldAmount = applyUpgradeDiscountPercentage(experienceBoostPercentage, DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['value'], 1) * quantity;
                        spanGoldAmount.textContent = getStrAmount(goldAmount);
                        spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
                        totalGoldAmount += goldAmount;
                    }
                    spanExperienceAmount.textContent = getStrAmount(experienceAmount);
                    spanExperienceAmount.parentElement.title = thousandSeperator(experienceAmount, ' ') + ' XP';

                    totalQuantity += quantity;
                }
            }
            else {
                inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
                spanGoldAmount = document.getElementById(`spanGoldAmount${TYPES[i]}_${j}`);

                quantity = toInt(inputQuantity.value);
                if (DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['currency'] == 'Memorium') {
                    if (INDEX_TO_SKIP.includes(i)) {
                        memoriumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['value'], 1) * quantity;
                    }
                    else {
                        memoriumAmount = DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['value'] * quantity;
                    }
                    spanMemoriumAmount.textContent = getStrAmount(memoriumAmount);
                    spanMemoriumAmount.parentElement.title = thousandSeperator(memoriumAmount, ' ') + ' Memorium';
                    totalMemoriumAmount += memoriumAmount;
                }
                if (DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['currency'] == 'UpgradeToken') {
                    if (i == 1) {
                        upgradeTokens = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['value'], 1) * quantity;
                    }
                    else {
                        upgradeTokens = DS_ROBOT_PILOT_UPGRADE_COSTS[i][j]['cost']['value'] * quantity;
                    }
                    spanUpgradeTokens.textContent = getStrAmount(upgradeTokens);
                    spanUpgradeTokens.parentElement.title = thousandSeperator(upgradeTokens, ' ') + ' Upgrade Tokens';
                    totalUpgradeTokens += upgradeTokens;
                }

                totalQuantity += quantity;
            }
        }
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ') + ' Gold';
    spanTotalMemoriumAmount.textContent = getStrAmount(totalMemoriumAmount);
    spanTotalMemoriumAmount.title = thousandSeperator(totalMemoriumAmount, ' ') + ' Memorium';
    spanTotalUpgradeTokens.textContent = getStrAmount(totalUpgradeTokens);
    spanTotalUpgradeTokens.title = thousandSeperator(totalUpgradeTokens, ' ') + ' Upgrade Tokens';
}

function resetModifiers() {
    resetInputs(['#inputUpgradeDiscountPercentage', '#inputExperienceBoostPercentage'], 0, syncData);
}

function getContainerIdByTypeIndex(index) {
    return `container${TYPES[index]}Costs`;
}

function resetUpgrades(index) {
    resetInputs([`#${getContainerIdByTypeIndex(index)} .quantities`], 0, syncData);
}

function presetUpgrades(index, type) {
    let inputQuantity;
    let quantity = 0;
    let i, j, k;

    for (i = 0; i < DS_ROBOT_PILOT_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ROBOT_PILOT_UPGRADE_COSTS[i].length; j++) {
            // To skip Tier 1 Pilot skill upgrade.
            if (INDEX_TO_SKIP.includes(i) && j == 0) {
                continue;
            }

            if (index == 0 && i == 0) {
                for (k = DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].fromLevel; k <= DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].toLevel; k++) {
                    if (type == 0 && (!(k >= 1 && k <= 10))) {
                        continue;
                    }
                    else if (type == 1 && (!(k >= 11 && k <= 20))) {
                        continue;
                    }
                    else if (type == 2 && (!(k >= 21 && k <= 30))) {
                        continue;
                    }
                    else if (type == 3 && (!(k >= 31 && k <= 40))) {
                        continue;
                    }
                    else if (type == 4 && (!(k >= 41 && k <= 50))) {
                        continue;
                    }
                    else if (type == 5 && (!(k >= 51 && k <= 60))) {
                        continue;
                    }
                    else if (type == 6 && (!(k >= 61 && k <= 70))) {
                        continue;
                    }

                    inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}_${k}`);
                    quantity = toInt(inputQuantity.value);
                    inputQuantity.value = ++quantity;
                }

                k = 0;
            }
            else if (index == i) {
                inputQuantity = document.getElementById(`inputQuantity${TYPES[i]}_${j}`);
                quantity = toInt(inputQuantity.value);
                inputQuantity.value = ++quantity;
            }
        }
    }

    syncData();
}

function init() {
    const containers = [];
    const containerInnerHTMLs = [];
    let i, j, k;

    for (i = 0; i < TYPES.length; i++) {
        containers.push(document.getElementById(getContainerIdByTypeIndex(i)));
        containerInnerHTMLs.push('');
    }

    for (i = 0; i < DS_ROBOT_PILOT_UPGRADE_COSTS.length; i++) {
        for (j = 0; j < DS_ROBOT_PILOT_UPGRADE_COSTS[i].length; j++) {
            // To skip Tier 1 Pilot skill upgrade.
            if (INDEX_TO_SKIP.includes(i) && j == 0) {
                continue;
            }

            if (i == 0) {
                for (k = DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].fromLevel; k <= DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].toLevel; k++) {
                    containerInnerHTMLs[i] += '<div class="col-md-6">' +
                        '<div class="item">' + '<div class="row align-items-center">' +
                        `<div class="col"><div class="item-title">Rank ${getPilotRankByLevel(k)}: Level ${k}</div>` +
                        '</div>' +
                        '<div class="col">' +
                        '<div class="input-group">' +
                        `<button type="button" class="btn btn-danger btn-decrement" data-wc-target="inputQuantity${TYPES[i]}_${j}_${k}">-</button>` +
                        `<input id="inputQuantity${TYPES[i]}_${j}_${k}" type="number" class="form-control quantities sync-data" min="0" value="0">` +
                        `<button type="button" class="btn btn-success btn-increment" data-wc-target="inputQuantity${TYPES[i]}_${j}_${k}">+</button>` +
                        '</div>' +
                        '</div>' +
                        '<div class="col-12">' +
                        '<div class="d-flex flex-wrap gap-1 mt-2">' +
                        `<span class="badge bg-light text-dark border" title="0 XP">XP: <span id="spanExperienceAmount${TYPES[i]}_${j}_${k}" class="experience-amount">0</span></span>` +
                        `<span class="badge bg-light text-dark border" title="0 Gold">Gold: <span id="spanGoldAmount${TYPES[i]}_${j}_${k}" class="gold-amount">0</span></span>` +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                }

                k = 0;
            }
            else if (i == 1) {
                containerInnerHTMLs[i] += '<div class="col-md-6">' +
                    '<div class="item">' + '<div class="row align-items-center">' +
                    `<div class="col"><div class="item-title">Rank ${getPilotRankByLevel(DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].level)}: Level ${DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].level}</div>` +
                    '</div>' +
                    '<div class="col">' +
                    '<div class="input-group">' +
                    `<button type="button" class="btn btn-danger btn-decrement" data-wc-target="inputQuantity${TYPES[i]}_${j}">-</button>` +
                    `<input id="inputQuantity${TYPES[i]}_${j}" type="number" class="form-control quantities sync-data" min="0" value="0">` +
                    `<button type="button" class="btn btn-success btn-increment" data-wc-target="inputQuantity${TYPES[i]}_${j}">+</button>` +
                    '</div>' +
                    '</div>' +
                    '<div class="col-12">' +
                    '<div class="d-flex flex-wrap gap-1 mt-2">' +
                    `<span class="badge bg-light text-dark border" title="0 Memorium">Memorium: <span id="spanMemoriumAmount${TYPES[i]}_${j}" class="memorium-amount">0</span></span>` +
                    `<span class="badge bg-light text-dark border" title="0 Upgrade Tokens">Upgrade Tokens: <span id="spanUpgradeTokens${TYPES[i]}_${j}" class="upgrade-tokens">0</span></span>` +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            else if (i == LAST_INDEX) {
                containerInnerHTMLs[i] += '<div class="col-md-6">' +
                    '<div class="item">' + '<div class="row align-items-center">' +
                    `<div class="col"><div class="item-title">Tier ${DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].tier}</div>` +
                    '</div>' +
                    '<div class="col">' +
                    '<div class="input-group">' +
                    `<button type="button" class="btn btn-danger btn-decrement" data-wc-target="inputQuantity${TYPES[i]}_${j}">-</button>` +
                    `<input id="inputQuantity${TYPES[i]}_${j}" type="number" class="form-control quantities sync-data" min="0" value="0">` +
                    `<button type="button" class="btn btn-success btn-increment" data-wc-target="inputQuantity${TYPES[i]}_${j}">+</button>` +
                    '</div>' +
                    '</div>' +
                    '<div class="col-12">' +
                    '<div class="d-flex flex-wrap gap-1 mt-2">' +
                    `<span class="badge bg-light text-dark border" title="0 Memorium">Memorium: <span id="spanMemoriumAmount${TYPES[i]}_${j}" class="memorium-amount">0</span></span>` +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            else {
                containerInnerHTMLs[i] += '<div class="col-md-6">' +
                    '<div class="item">' + '<div class="row align-items-center">' +
                    `<div class="col"><div class="item-title">Rank ${getPilotRankByLevel(DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].fromLevel)}:<br>Level ${DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].fromLevel} to ${DS_ROBOT_PILOT_UPGRADE_COSTS[i][j].toLevel}</div>` +
                    '</div>' +
                    '<div class="col">' +
                    '<div class="input-group">' +
                    `<button type="button" class="btn btn-danger btn-decrement" data-wc-target="inputQuantity${TYPES[i]}_${j}">-</button>` +
                    `<input id="inputQuantity${TYPES[i]}_${j}" type="number" class="form-control quantities sync-data" min="0" value="0">` +
                    `<button type="button" class="btn btn-success btn-increment" data-wc-target="inputQuantity${TYPES[i]}_${j}">+</button>` +
                    '</div>' +
                    '</div>' +
                    '<div class="col-12">' +
                    '<div class="d-flex flex-wrap gap-1 mt-2">' +
                    `<span class="badge bg-light text-dark border" title="0 Memorium">Memorium: <span id="spanMemoriumAmount${TYPES[i]}_${j}" class="memorium-amount">0</span></span>` +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        }
    }

    for (i = 0; i < containers.length; i++) {
        containers[i].innerHTML = containerInnerHTMLs[i];
    }

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetPilotExperienceBoostCosts')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonResetPilotRankPromotionCosts')) {
            resetUpgrades(1);
        }
        if (e.target.matches('#buttonResetPilotRandomSkillRollCosts')) {
            resetUpgrades(2);
        }
        if (e.target.matches('#buttonResetPilotSelectSkillCosts')) {
            resetUpgrades(3);
        }
        if (e.target.matches('#buttonResetPilotSkillTierUpgradeCosts')) {
            resetUpgrades(4);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_0')) {
            presetUpgrades(0, 0);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_1')) {
            presetUpgrades(0, 1);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_2')) {
            presetUpgrades(0, 2);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_3')) {
            presetUpgrades(0, 3);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_4')) {
            presetUpgrades(0, 4);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_5')) {
            presetUpgrades(0, 5);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_6')) {
            presetUpgrades(0, 6);
        }
        if (e.target.matches('#buttonPresetPilotExperienceBoostCosts_7')) {
            presetUpgrades(0, 7);
        }
        if (e.target.matches('#buttonPresetPilotRankPromotionCosts')) {
            presetUpgrades(1, 0);
        }
        if (e.target.matches('#buttonPresetPilotRandomSkillRollCosts')) {
            presetUpgrades(2, 0);
        }
        if (e.target.matches('#buttonPresetPilotSelectSkillCosts')) {
            presetUpgrades(3, 0);
        }
        if (e.target.matches('#buttonPresetPilotSkillTierUpgradeCosts')) {
            presetUpgrades(4, 0);
        }
        if (e.target.matches('.btn-decrement')) {
            updateInputValue('-', e.target.dataset.wcTarget);
        }
        if (e.target.matches('.btn-increment')) {
            updateInputValue('+', e.target.dataset.wcTarget);
        }
    });
    // Set input event listener.
    document.getElementById('mainContainer').addEventListener('input', (e) => {
        if (e.target.matches('.sync-data')) {
            // Minimum value is 0.
            if (e.target.value < 0) {
                e.target.value = 0;
            }
            syncData();
        }
    });

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    syncData();
}

const TYPES = [
    'PilotExperienceBoost', 'PilotRankPromotion',
    'PilotRandomSkillRoll', 'PilotSelectSkill', 'PilotSkillTierUpgrade'
];
const DS_ROBOT_PILOT_UPGRADE_COSTS = [
    DS_ROBOT_EXPERIENCE_BOOST_COSTS, DS_ROBOT_PILOT_RANK_PROMOTION_COSTS,
    DS_ROBOT_PILOT_RANDOM_SKILL_ROLL_COSTS, DS_ROBOT_PILOT_SELECT_SKILL_COSTS,
    DS_ROBOT_PILOT_SKILL_TIER_UPGRADE_COSTS
];
const LAST_INDEX = TYPES.length - 1;
const INDEX_TO_SKIP = [1, LAST_INDEX];

init();